import React from 'react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Picker } from 'emoji-mart';
import TimeAgo from 'react-timeago';
import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

import initialize from '../utils/initialize';
import { getCookie } from '../utils/cookie';
import { showSignInAlert } from '../utils/helpers';
import { formatDateWord } from '../utils/dateHelpers';
import { contentGeneralEvent } from '../utils/appier';

import liveAndChatActions from '../redux/actions/liveAndChatActions';
import pageActions from '../redux/actions/pageActions';
import chatsActions from '../redux/actions/chats';
import userActions from '../redux/actions/userActions';

import Layout from '../components/Layouts/Default';
import Wrench from '../components/Includes/Common/Wrench';

import { Row, Col, Button, Input } from 'reactstrap';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RefreshIcon from '@material-ui/icons/Refresh';

import { DEV_API, VISITOR_TOKEN } from '../config';

import '../assets/scss/components/live-event.scss';

class LiveEvent extends React.Component {

	static async getInitialProps(ctx) {
		initialize(ctx);
		const id = ctx.query.id;
		const accessToken = getCookie('ACCESS_TOKEN');
		const options = {
			method: 'GET',
			headers: {
				'Authorization': accessToken ? accessToken : VISITOR_TOKEN
			}
		};
		const res = await Promise.all([
			fetch(`${DEV_API}/api/v1/live-event/${id}`, options),
			fetch(`${DEV_API}/api/v1/live-event/${id}/url`, options)
		]);

		const error_code = res[0].status > 200 ? res[0].status : false;
		const error_code_2 = res[1].status > 200 ? res[1].status : false;

		if (error_code || error_code_2) {
			return {
				selected_event: false,
				selected_event_url: false
			};
		}



		const data = await Promise.all([
			res[0].json(),
			res[1].json()
		]);

		return {
			selected_event: data[0],
			selected_event_url: data[1]
		};
	}

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			emoji_picker_open: false,
			chat_open: false,
			chat: '',
			user_data: null,
			snapshots: [],
			sending_chat: false,
			chats: [],
			live_events: [],
			meta: {},
			resolution: 300
		};

		const segments = this.props.router.asPath.split(/\?/);
		this.reference = null;
		this.homepageTitle = null;
		if (segments.length > 1) {
			const q = queryString.parse(segments[1]);
			if (q.ref) {
				this.reference = q.ref;
			}
			if (q.homepage_title) {
				this.homepageTitle = q.homepage_title;
			}
		}

		this.player = null;
		this.props.setPageLoader();


	}

	componentDidMount() {
		this.initVOD();
		this.props.getLiveEvent('non on air')
			.then(response => {
				this.setState({ live_events: response.data.data, meta: response.data.meta }, () => {
					this.props.unsetPageLoader();
				});
			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
			});

		this.props.getUserData()
			.then(response => {
				console.log(response);
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({ user_data: response.data.data });
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	loadChatMessages(id) {
		this.props.setPageLoader();
		this.props.getChatMessages(id)
			.then(chats => {
				let sortedChats = chats.sort((a, b) => a.ts - b.ts);
				this.setState({ chats: sortedChats }, () => {
					const chatBox = document.getElementById('chat-messages');
					chatBox.scrollTop = chatBox.scrollHeight;
					this.props.unsetPageLoader();
				});
			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
			});
	}

	initVOD() {
		let url = '';
		let vmap = '';
		let id = '';
		let name = '';
		let type = '';
		let portrait_image = '';
		if (this.props.selected_event && this.props.selected_event_url) {
			url = this.props.selected_event_url.data.url;
			vmap = this.props.selected_event_url.data.vmap;
			id = this.props.selected_event.data.id;
			name = this.props.selected_event.data.name;
			type = this.props.selected_event.data.type;
			portrait_image = this.props.selected_event.data.portrait_image;
			this.loadChatMessages(id);
		}

		this.player = window.jwplayer('live-event-player');
		this.player.setup({
			autostart: true,
			floating: false,
			file: url,
			primary: 'html5',
			width: '100%',
			aspectratio: '16:9',
			displaytitle: true,
			setFullscreen: true,
			stretching: 'exactfit',
			advertising: {
				client: 'googima',
				tag: vmap
			},
			logo: {
				hide: true
			}
		});
		this.player.on('setupError', error => {
			console.log(error);
			this.player.remove();
			this.setState({
				error: true,
				error_data: error
			});
		});

		this.player.on('error', error => {
			console.log(error);
			this.player.remove();
			this.setState({
				error: true,
				error_data: error
			});
		});
		this.player.on('fullscreen', () => {
			if (screen.orientation.type === 'portrait-primary') {
				document.querySelector("#live-event-player").requestFullscreen();
				screen.orientation.lock("landscape-primary")
			}
			if (screen.orientation.type === 'landscape-primary') {
				document.querySelector("#live-event-player").requestFullscreen();
				screen.orientation.lock("portrait-primary")
			}
		});
		this.player.on('firstFrame', () => {
			if (this.reference && this.homepageTitle && this.reference == 'homepage') {
				contentGeneralEvent(this.homepageTitle, type, id, name, 'N/A', 'N/A', this.state.meta.image_path + this.state.resolution + portrait_image, 'N/A', 'mweb_homepage_live_event_play');
			}
		});

		this.player.on('play', () => {
			conviva.updatePlayerAssetMetadata(this, {
				playerType: 'JWPlayer',
				content_type: type,
				program_id: id,
				program_name: name,
				date_video: 'N/A',
				time_video: 'N/A',
				page_title: 'N/A',
				genre: 'N/A',
				page_view: 'N/A',
				app_version: 'N/A',
				group_content_page_title: 'N/A',
				group_content_name: 'N/A',
				exclusive_tab_name: 'N/A'
			});
		});
	}

	loadMore() {
		// TODO
	}

	toggleChat() {
		this.setState({ chat_open: !this.state.chat_open }, () => {
			const chatBox = document.getElementById('chat-messages');
			chatBox.scrollTop = chatBox.scrollHeight;
		});
	}

	toggleEmoji() {
		this.setState({ emoji_picker_open: !this.state.emoji_picker_open });
	}

	handleChatEnter(e) {
		const chatInput = document.getElementById('chat-input');
		const scrollHeight = chatInput.scrollHeight - 30;
		chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && this.state.chat && this.state.chat != '\n') {
			this.sendChat();
		}
	}

	onChangeChatInput(e) {
		if (e.target.value != '\n') {
			this.setState({ chat: e.target.value });
		}
	}

	resendChat(index) {
		let chats = this.state.chats;
		let lastChat = chats[index];
		lastChat.sent = false;
		lastChat.failed = false;
		chats[index] = lastChat;
		this.setState({ chats: chats, sending_chat: true }, () => {
			const { id } = this.props.selected_event.data;
			this.props.setChat(id, lastChat.m, this.state.user_data.nickname, this.state.user_data.photo_url)
				.then(response => {
					lastChat.sent = true;
					if (response.status !== 200 || response.data.status.code !== 0) {
						lastChat.failed = true;
					}
					chats[index] = lastChat;
					this.setState({ chats: chats, sending_chat: false });
				})
				.catch(() => {
					lastChat.sent = true;
					lastChat.failed = true;
					chats[index] = lastChat;
					this.setState({ chats: chats, sending_chat: false });
				});
		});
	}

	sendChat() {
		if (this.state.user_data) {
			if (this.state.chat != '') {
				const { id } = this.props.selected_event.data;

				let u = '';
				if (this.state.user_data.nickname) {
					u = this.state.user_data.nickname;
				}
				else if (this.state.user_data.display_name) {
					u = this.state.user_data.display_name;
				}
				else {
					u = this.state.user_data.email;
				}
				let newChat = {
					ts: Date.now(),
					m: this.state.chat,
					u: u,
					i: this.state.user_data.photo_url,
					sent: false,
					failed: false
				};
				let chats = this.state.chats;
				chats.push(newChat);
				this.setState({ chats: chats, chat: '', sending_chat: true }, () => {
					const chatBox = document.getElementById('chat-messages');
					chatBox.scrollTop = chatBox.scrollHeight;

					const chatInput = document.getElementById('chat-input');
					chatInput.style.height = `24px`;

					this.props.setChat(id, newChat.m, this.state.user_data.nickname, this.state.user_data.photo_url)
						.then(response => {
							newChat.sent = true;
							if (response.status !== 200 || response.data.status.code !== 0) {
								newChat.failed = true;
							}
							chats[chats.length - 1] = newChat;
							this.setState({ chats: chats, sending_chat: false });
						})
						.catch(() => {
							newChat.sent = true;
							newChat.failed = true;
							chats[chats.length - 1] = newChat;
							this.setState({ chats: chats, sending_chat: false });
						});
				});
			}
		}
		else {
			showSignInAlert(`Please <b>Sign In</b><br/>
			Woops! Gonna sign in first!<br/>
			Only a click away and you<br/>
			can continue to enjoy<br/>
			<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
		}
	}

	onSelectEmoji() {

	}

	render() {
		let playerRef = (<div></div>);
		if (this.state.error) {
			playerRef = (
				<div style={{
					textAlign: 'center',
					margin: 30
				}}>
					<Wrench />
					<h5 style={{ color: '#8f8f8f' }}>
						<strong style={{ fontSize: 14 }}>Cannot load the video</strong><br />
						<span style={{ fontSize: 12 }}>Please try again later,</span><br />
						<span style={{ fontSize: 12 }}>we're working to fix the problem</span>
					</h5>
				</div>
			);
		}
		else {
			playerRef = (<div style={{ minHeight: 180 }} id="live-event-player"></div>);
		}

		return (
			<Layout title="Live Event - RCTI+">
				<Head>
					<meta name="description" content={`description`} />
					<meta name="keywords" content={`keywords`} />
				</Head>
				<div className="wrapper-content" style={{ padding: 0, margin: 0 }}>
					{playerRef}
					<div className="title-wrap">
						Live Chat Plus {this.props.selected_event ? formatDateWord(new Date(this.props.selected_event.data.start_date)) : ''}
					</div>
					<div className="content-wrap">
						<div className="live-event-menu">
							<BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
								{scrollRef => (
									<div>
										<p className="live-event-title"><strong>Live Event</strong></p>
										<div ref={scrollRef} className="live-event-slider">
											{this.state.live_events.map((le, i) => (
												<div onClick={() => Router.push(`/live-event/${le.id}/${le.name.toLowerCase().replace(/ +/g, '-')}`)} key={i} className="live-event-slide">
													<Img alt={'alt'} src={[this.state.meta.image_path + this.state.resolution + le.portrait_image, '/static/placeholders/placeholder_potrait.png']} className="live-event-thumbnail" />
													<div className="ribbon">Live</div>
												</div>
											))}
										</div>
									</div>
								)}
							</BottomScrollListener>
						</div>
					</div>
					<div className={'live-event-chat-wrap ' + (this.state.chat_open ? 'live-event-chat-wrap-open' : '')}>
						<Button onClick={this.toggleChat.bind(this)} color="link"><ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" /></Button>
						<div className="box-chat">
							<div className="chat-messages" id="chat-messages">
								{this.state.chats.map((chat, i) => (
									<Row key={i} className="chat-line">
										<Col xs={2}>
											<Img
												loader={<PersonOutlineIcon className="chat-avatar" />}
												unloader={<PersonOutlineIcon className="chat-avatar" />}
												className="chat-avatar" src={[chat.i]} />
										</Col>
										<Col className="chat-message" xs={10}>
											{chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span>
										</Col>
									</Row>
								))}
							</div>
							<div className="chat-input-box">
								<div className="chat-box">
									<Row>
										<Col xs={1}>
											<Button className="emoji-button">
												{this.state.emoji_picker_open ? (<KeyboardIcon onClick={this.toggleEmoji.bind(this)} />) : (<SentimenVerySatifiedIcon onClick={this.toggleEmoji.bind(this)} />)}
											</Button>
										</Col>
										<Col xs={9}>
											<Input
												onKeyDown={this.handleChatEnter.bind(this)}
												onChange={this.onChangeChatInput.bind(this)}
												value={this.state.chat}
												type="textarea"
												id="chat-input"
												placeholder="Start Chatting"
												className="chat-input"
												maxLength={250}
												rows={1} />
										</Col>
										<Col xs={1}>
											<Button className="send-button" onClick={this.sendChat.bind(this)}>
												<SendIcon />
											</Button>
										</Col>
									</Row>
								</div>
								<Picker
									onSelect={emoji => {
										this.onSelectEmoji();
									}}
									showPreview={false}
									darkMode
									style={{ height: this.state.emoji_picker_open ? 200 : 0 }} />
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...liveAndChatActions,
	...pageActions,
	...chatsActions,
	...userActions
})(withRouter(LiveEvent));
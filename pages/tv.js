import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Picker } from 'emoji-mart';
import Img from 'react-image';
import TimeAgo from 'react-timeago';

import initialize from '../utils/initialize';

import liveAndChatActions from '../redux/actions/liveAndChatActions';
import pageActions from '../redux/actions/pageActions';
import chatsActions from '../redux/actions/chats';
import userActions from '../redux/actions/userActions';

import Layout from '../components/Layouts/Default';
import SelectDateModal from '../components/Modals/SelectDateModal';
import ActionSheet from '../components/Modals/ActionSheet';
import Wrench from '../components/Includes/Common/Wrench';

import { formatDate, formatDateWord, getFormattedDateBefore } from '../utils/dateHelpers';
import { showAlert, showSignInAlert } from '../utils/helpers';

import { Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane, Input } from 'reactstrap';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RefreshIcon from '@material-ui/icons/Refresh';

import { BASE_URL, SITEMAP } from '../config';

import '../assets/scss/components/live-tv.scss';
import 'emoji-mart/css/emoji-mart.css';

import { liveTvTabClicked, liveTvShareClicked, liveTvShareCatchupClicked, liveTvLiveChatClicked, liveTvChannelClicked, liveTvCatchupSchedulePlay, liveTvCatchupScheduleClicked } from '../utils/appier';

class Tv extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
		return { context_data: ctx.query };
	}

	constructor(props) {
		super(props);
		const now = new Date();
		this.state = {
			live_events: [],
			selected_live_event: {},
			selected_live_event_url: {},
			selected_index: 0,
			selected_tab: 'live',
			epg: [],
			catchup: [],
			selected_catchup: {},
			meta: {},
			dates_before: getFormattedDateBefore(7),
			selected_date: formatDateWord(now),
			select_modal: false,
			player_url: '',
			player_vmap: '',
			action_sheet: false,
			caption: '',
			url: '',
			hashtags: [],
			chat_open: false,
			channel_code: this.props.context_data ? this.props.context_data.channel : 'rcti',
			error: false,
			error_data: {},
			emoji_picker_open: false,
			chats: [],
			chat: '',
			user_data: null,
			snapshots: [],
			sending_chat: false
		};

		this.player = null;
		this.currentDate = now;
		this.props.setCatchupDate(formatDateWord(now));
		this.props.setPageLoader();
	}

	componentDidMount() {
		this.props.getLiveEvent('on air')
			.then(response => {
				this.setState({ live_events: response.data.data, meta: response.data.meta }, () => {
					if (this.state.live_events.length > 0) {
						for (let i = 0; i < this.state.live_events.length; i++) {
							if (this.state.live_events[i].channel_code === this.state.channel_code) {
								this.selectChannel(i, true);
								break;
							}
						}

					}
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

	isLiveProgram(epg) {
		const currentTime = new Date().getTime();
		const startTime = new Date(formatDate(this.currentDate) + ' ' + epg.s).getTime();
		const endTime = new Date(formatDate(this.currentDate) + ' ' + epg.e).getTime();
		return currentTime > startTime && currentTime < endTime;
	}

	getCurrentLiveEpg() {
		const epg = this.state.epg;
		for (let i = 0; i < epg.length; i++) {
			if (this.isLiveProgram(epg[i])) {
				return epg[i];
			}
		}

		return null;
	}

	initVOD() {
		this.player = window.jwplayer('live-tv-player');
		this.player.setup({
			autostart: true,
			floating: false,
			file: this.state.player_url,
			primary: 'html5',
			width: '100%',
			aspectratio: '16:9',
			displaytitle: true,
			setFullscreen: true,
			stretching: 'exactfit',
			advertising: {
				client: process.env.ADVERTISING_CLIENT,
				tag: this.state.player_vmap
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
				document.querySelector("#live-tv-player").requestFullscreen();
				screen.orientation.lock("landscape-primary")
			}
			if (screen.orientation.type === 'landscape-primary') {
				document.querySelector("#live-tv-player").requestFullscreen();
				screen.orientation.lock("portrait-primary")
			}
		});

		const self = this;
		this.player.on('play', () => {
			if (this.state.selected_tab === 'live') {
				const currentEpg = self.getCurrentLiveEpg();
				if (currentEpg != null) {
					conviva.updatePlayerAssetMetadata(this, {
						playerType: 'JWPlayer',
						content_type: 'N/A',
						program_id: currentEpg.id, 
						program_name: currentEpg.title,
						date_video: 'N/A',
						time_video: 'N/A',
						page_title:'N/A',
						genre: 'N/A',
						page_view: 'N/A',
						app_version: 'N/A',
						group_content_page_title: 'N/A',
						group_content_name: 'N/A',
						exclusive_tab_name: 'N/A'
					});
				}
			}
			else if (this.state.selected_tab === 'catch_up_tv') {
				if (this.state.selected_catchup) {
					conviva.updatePlayerAssetMetadata(this, {
						playerType: 'JWPlayer',
						content_type: 'N/A',
						program_id: this.state.selected_catchup.id, 
						program_name: this.state.selected_catchup.title,
						date_video: 'N/A',
						time_video: 'N/A',
						page_title:'N/A',
						genre: 'N/A',
						page_view: 'N/A',
						app_version: 'N/A',
						group_content_page_title: 'N/A',
						group_content_name: 'N/A',
						exclusive_tab_name: 'N/A'
					});
					
					liveTvCatchupSchedulePlay(this.state.selected_date, this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, this.state.selected_catchup.title, 'mweb_livetv_catchup_schedule_play');
				}
			}
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

	selectChannel(index, first = false) {
		this.props.setPageLoader();
		this.setState({ selected_index: index, error: false }, () => {
			this.loadChatMessages(this.state.live_events[this.state.selected_index].id);
			this.props.listenChatMessages(this.state.live_events[this.state.selected_index].id)
				.then(collection => {
					let snapshots = this.state.snapshots;
					// for (let i = 0; i < this.state.live_events.length; i++) {
					// 	if (snapshots[this.state.live_events[i].id]) {
					// 		snapshots[this.state.live_events[i].id]();
					// 	}
					// }

					let snapshot = collection.onSnapshot(querySnapshot => {
						querySnapshot.docChanges().slice(Math.max(querySnapshot.docChanges().length - 10, 0))
							.forEach(change => {
								let chats = this.state.chats;
								if (change.type === 'added') {
									if (!this.state.sending_chat) {
										let lastChat = chats[chats.length - 1];
										let newChat = change.doc.data();
										if ((lastChat && newChat) && (lastChat.u != newChat.u || lastChat.m != newChat.m || lastChat.i != newChat.i)) {
											chats.push(newChat);
										}
										
										this.setState({ chats: chats });
									}
								}
								else if (change.type === 'removed') {
									let removed = change.doc.data();
									for (let i = 0; i < chats.length; i++){ 
										if (chats[i].ts === removed.ts) {
											chats.splice(i, 1); 
										}
									}
									this.setState({ chats: chats });
								}
							});
					});
					snapshots[this.state.live_events[this.state.selected_index].id] = snapshot;
					this.setState({ snapshots: snapshots });
				});
				
			this.props.getLiveEventUrl(this.state.live_events[this.state.selected_index].id)
				.then(res => {
					this.setState({
						selected_live_event: this.state.live_events[this.state.selected_index],
						selected_live_event_url: res.data.data,
						player_url: res.data.data.url,
						player_vmap: res.data.data.vmap
					}, () => {
						this.initVOD();
						this.props.setChannelCode(this.state.selected_live_event.channel_code);
						this.props.setCatchupDate(formatDateWord(this.currentDate));
						this.props.unsetPageLoader();
					});
				})
				.catch(error => {
					console.log(error);
					this.setState({
						error: true,
						error_data: error.status === 200 ? error.data.status.message_client : ''
					});
					this.props.unsetPageLoader();
				});

			this.props.getEPG(formatDate(this.currentDate), this.state.live_events[this.state.selected_index].channel_code)
				.then(response => {
					let epg = response.data.data.filter(e => e.e < e.s || this.currentDate.getTime() < new Date(formatDate(this.currentDate) + ' ' + e.e).getTime());
					this.setState({ epg: epg }, () => {
						if (first != true) {
							let programLive = this.getCurrentLiveEpg();
							liveTvChannelClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, programLive ? programLive.title : 'N/A', 'mweb_livetv_channel_clicked');
						}
						this.props.unsetPageLoader();
					});
				})
				.catch(error => {
					console.log(error);
					if (first != true) {
						liveTvChannelClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'N/A', 'mweb_livetv_channel_clicked');
					}
					this.props.unsetPageLoader();
				});

			this.props.getEPG(formatDate(new Date(this.state.selected_date)), this.state.live_events[this.state.selected_index].channel_code)
				.then(response => {
					let catchup = response.data.data.filter(e => {
						if (e.s > e.e) {
							return this.currentDate.getTime() > new Date(new Date(this.state.selected_date + ' ' + e.e).getTime() + (1 * 24 * 60 * 60 * 1000)).getTime();
						}
						return this.currentDate.getTime() > new Date(this.state.selected_date + ' ' + e.e).getTime();
					});
					this.setState({ catchup: catchup }, () => {
						this.props.setCatchupData(catchup);
						this.props.unsetPageLoader();
					});
				})
				.catch(error => {
					console.log(error);
					this.props.unsetPageLoader();
				});
		});

		
	}

	selectCatchup(id) {
		this.props.setPageLoader();
		liveTvCatchupScheduleClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_catchup_schedule_clicked');
		this.props.getCatchupUrl(id)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({
						player_url: response.data.data.url,
						player_vmap: response.data.data.vmap,
						selected_catchup: response.data.data,
						error: false
					}, () => this.initVOD());
				}
				else {
					showAlert(response.data.status.message_server, `
					<svg style="font-size: 4.5rem" class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"></path></svg>
					`, 'Close');
				}
				this.props.unsetPageLoader();
			})
			.catch(error => {
				console.log(error);
				if (error.status === 200) {
					showAlert(error.data.status.message_server, `
					<svg style="font-size: 4.5rem" class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"></path></svg>
					`, 'Close');
				}
				
				this.props.unsetPageLoader();
			});
	}

	toggleSelectModal() {
		this.setState({ select_modal: !this.state.select_modal });
	}

	toggleActionSheet(caption = '', url = '', hashtags = []) {
		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		}, () => {
			if (this.state.action_sheet) {
				switch (this.state.selected_tab) {
					case 'live':
						liveTvShareClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_share_clicked');
						break;

					case 'catch_up_tv':
						liveTvShareCatchupClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'N/A','mweb_livetv_share_catchup_clicked');
						break;
				}
			}
		});
	}

	toggleChat() {
		this.setState({ chat_open: !this.state.chat_open }, () => {
			if (this.state.chat_open) {
				liveTvLiveChatClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_livechat_clicked');
			}
			const chatBox = document.getElementById('chat-messages');
			chatBox.scrollTop = chatBox.scrollHeight;
		});
	}

	toggleEmoji() {
		this.setState({ emoji_picker_open: !this.state.emoji_picker_open });
	}

	tryAgain() {
		this.setState({ error: false }, () => {
            this.initVOD();
        });
	}

	onChangeChatInput(e) {
		if (e.target.value != '\n') {
			this.setState({ chat: e.target.value });
		}
	}

	handleChatEnter(e) {
		const chatInput = document.getElementById('chat-input');
		const scrollHeight = chatInput.scrollHeight - 30;
		chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && this.state.chat && this.state.chat != '\n') {
			this.sendChat();
		}
	}

	onSelectEmoji(emoji) {
		this.setState({ chat: this.state.chat + emoji.native });
	}

	checkLogin() {
		if (!this.state.user_data) {
			showSignInAlert(`Please <b>Sign In</b><br/>
				Woops! Gonna sign in first!<br/>
				Only a click away and you<br/>
				can continue to enjoy<br/>
				<b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true);
		}
	}

	sendChat() {
		if (this.state.user_data) {
			if (this.state.chat != '') {
				const userData = this.state.user_data;
				let user = userData.nickname ? userData.nickname : 
						userData.display_name ? userData.display_name : 
						userData.email ? userData.email.replace(/\d{4}$/, '****') : 
						userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';

				let newChat = {
					ts: Date.now(),
					m: this.state.chat,
					u: user,
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
					
					this.props.setChat(this.state.live_events[this.state.selected_index].id, newChat.m, user, this.state.user_data.photo_url)
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
			<b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true);
		}
	}

	resendChat(index) {
		let chats = this.state.chats;
		let lastChat = chats[index];
		lastChat.sent = false;
		lastChat.failed = false;
		chats[index] = lastChat;
		this.setState({ chats: chats, sending_chat: true }, () => {
			const userData = this.state.user_data;
			let user = userData.nickname ? userData.nickname : 
						userData.display_name ? userData.display_name : 
						userData.email ? userData.email.replace(/\d{4}$/, '****') : 
						userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
			this.props.setChat(this.state.live_events[this.state.selected_index].id, lastChat.m, user, this.state.user_data.photo_url)
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

	render() {
		let playerRef = (<div></div>);
		if (this.state.error) {
			playerRef = (
				<div style={{ 
					textAlign: 'center',
					margin: 30
					}}>
					<Wrench/>
					<h5 style={{ color: '#8f8f8f' }}>
						<strong style={{ fontSize: 14 }}>Cannot load the video</strong><br/>
						<span style={{ fontSize: 12 }}>Please try again later,</span><br/>
						<span style={{ fontSize: 12 }}>we're working to fix the problem</span>
					</h5>
				</div>
			);
		}
		else {
			playerRef = (
				<div>
					<div style={{ minHeight: 180 }} id="live-tv-player"></div>
					{/* <!-- /21865661642/RC_MOBILE_LIVE_BELOW-PLAYER --> */}
					{/* <div id='div-gpt-ad-1581999069906-0' style={{ width: '100% !important' }}>
						<script dangerouslySetInnerHTML={{ __html: `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1581999069906-0'); });` }}></script>
					</div> */}
				</div>
			);
		}

		return (
			<Layout className="live-tv-layout" title={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].title}>
				<Head>
					<meta name="description" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].description}/>
					<meta name="keywords" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].keywords}/>

					<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
					<script dangerouslySetInnerHTML={{ __html: `
							window.googletag = window.googletag || {cmd: []};
							googletag.cmd.push(function() {
							googletag.defineSlot('/21865661642/RC_MOBILE_LIVE_BELOW-PLAYER', [[320, 50], [468, 60]], 'div-gpt-ad-1581999069906-0').addService(googletag.pubads());
							googletag.pubads().enableSingleRequest();
							googletag.pubads().collapseEmptyDivs();
							googletag.enableServices();
						});
					` }}></script>
				</Head>
				<SelectDateModal
					open={this.state.select_modal}
					data={this.state.dates_before}
					toggle={this.toggleSelectModal.bind(this)} />

				<ActionSheet
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rctiplus'])} />

				<div className="wrapper-content" style={{ padding: 0, margin: 0 }}>
					{playerRef}
					<div className="tv-wrap">
						<Row>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=rcti" as="/tv/rcti">
									<Button size="sm" color="link" className={this.state.selected_index === 0 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 0)}>RCTI</Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=mnctv" as="/tv/mnctv">
									<Button size="sm" color="link" className={this.state.selected_index === 1 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 1)}>MNCTV</Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=globaltv" as="/tv/globaltv">
									<Button size="sm" color="link" className={this.state.selected_index === 2 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 2)}>GTV</Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=inews" as="/tv/inews">
									<Button size="sm" color="link" className={this.state.selected_index === 3 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 3)}>INEWS</Button>
								</Link>
							</Col>
						</Row>
					</div>
					<Nav tabs className="tab-wrap">
						<NavItem onClick={() => {
							this.setState({ selected_tab: 'live' }, () => {
								liveTvTabClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'Live', 'mweb_livetv_tab_clicked');
							});
						}} className={this.state.selected_tab === 'live' ? 'selected' : ''}>
							<NavLink>Live</NavLink>
						</NavItem>
						<NavItem onClick={() => {
							this.setState({ selected_tab: 'catch_up_tv' }, () => {
								liveTvTabClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'Catch Up TV', 'mweb_livetv_tab_clicked');
							});
						}} className={this.state.selected_tab === 'catch_up_tv' ? 'selected' : ''}>
							<NavLink>Catch Up TV</NavLink>
						</NavItem>
					</Nav>
					<div className="tab-content-wrap">
						<TabContent activeTab={this.state.selected_tab}>
							<TabPane tabId={'live'}>
								{this.state.epg.map(e => {
									if (this.isLiveProgram(e)) {
										return (<Row key={e.id} className={'program-item selected'}>
											<Col xs={9}>
												<div className="title">{e.title} <FiberManualRecordIcon /></div>
												<div className="subtitle">{e.s} - {e.e}</div>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Live TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + e.title, BASE_URL + this.props.router.asPath, ['rctiplus', this.props.chats.channel_code])} className="share-btn" />
											</Col>
										</Row>);
									}

									return (<Row key={e.id} className={'program-item'}>
										<Col xs={9}>
											<div className="title">{e.title}</div>
											<div className="subtitle">{e.s} - {e.e}</div>
										</Col>
									</Row>);
								})}

							</TabPane>
							<TabPane tabId={'catch_up_tv'}>
								<div className="catch-up-wrapper">
									<div className="catchup-dropdown-menu">
										<Button onClick={this.toggleSelectModal.bind(this)} size="sm" color="link">{this.props.chats.catchup_date} <ExpandMoreIcon /></Button>

									</div>
									{this.props.chats.catchup.map(c => (
										<Row onClick={this.selectCatchup.bind(this, c.id)} key={c.id} className={'program-item'}>
											<Col xs={9}>
												<div className="title">{c.title}</div>
												<div className="subtitle">{c.s} - {c.e}</div>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Catch Up TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + c.title, BASE_URL + this.props.router.asPath, ['rctiplus', this.props.chats.channel_code])} className="share-btn" />
											</Col>
										</Row>
									))}
								</div>
							</TabPane>
						</TabContent>
					</div>
					<div className={'live-chat-wrap ' + (this.state.chat_open ? 'live-chat-wrap-open' : '')}>
						<Button onClick={this.toggleChat.bind(this)} color="link"><ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" /></Button>
						<div className="box-chat">
							<div className="chat-messages" id="chat-messages">
								{this.state.chats.map((chat, i) => (
									<Row key={i} className="chat-line">
										<Col xs={2}>
											<Img
												loader={<PersonOutlineIcon className="chat-avatar"/>}
												unloader={<PersonOutlineIcon className="chat-avatar"/>} 
												className="chat-avatar" src={[chat.i]}/>
										</Col>
										<Col className="chat-message" xs={10}>
											{chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message"/> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} /> )) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span>
										</Col>
									</Row>
								))}
							</div>
							<div className="chat-input-box">
								<div className="chat-box">
									<Row>
										<Col xs={1}>
											<Button className="emoji-button">
												{this.state.emoji_picker_open ? (<KeyboardIcon onClick={this.toggleEmoji.bind(this)}/>) : (<SentimenVerySatifiedIcon onClick={this.toggleEmoji.bind(this)}/>)}
											</Button>
										</Col>
										<Col xs={9}>
											<Input 
												onKeyDown={this.handleChatEnter.bind(this)}
												onChange={this.onChangeChatInput.bind(this)}
												onClick={this.checkLogin.bind(this)}
												value={this.state.chat}
												type="textarea"
												id="chat-input"
												placeholder="Start Chatting"
												className="chat-input"
												maxLength={250}
												rows={1}/>
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
										this.onSelectEmoji(emoji);
									}}
									showPreview={false} 
									darkMode 
									style={{ height: this.state.emoji_picker_open ? 200 : 0 }}/>
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
})(withRouter(Tv));

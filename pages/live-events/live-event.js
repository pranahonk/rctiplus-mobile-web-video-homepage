import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Router, { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';

import Img from 'react-image';
import { Picker } from 'emoji-mart';
import TimeAgo from 'react-timeago';
import queryString from 'query-string';
import MuteChat from '../../components/Includes/Common/MuteChat';


import initialize from '../../utils/initialize';
import { getCookie, getVisitorToken, checkToken, getUserAccessToken } from '../../utils/cookie';
import { showSignInAlert } from '../../utils/helpers';
import { liveEventTabClicked, liveShareEvent, appierAdsShow, appierAdsClicked, getUidAppier } from '../../utils/appier';
import { stickyAdsShowing, stickyAdsClicked, initGA } from '../../utils/firebaseTracking';

import liveAndChatActions from '../../redux/actions/liveAndChatActions';
import pageActions from '../../redux/actions/pageActions';
import chatsActions from '../../redux/actions/chats';
import userActions from '../../redux/actions/userActions';

import Layout from '../../components/Layouts/Default_v2';
import Thumbnail from '../../components/Includes/Common/Thumbnail';
import CountdownTimer from '../../components/Includes/Common/CountdownTimer';
import ActionSheet from '../../components/Modals/ActionSheet';
import LiveIcon from '../../components/Includes/Common/LiveIcon';
import StreamVideoIcon from '../../components/Includes/Common/StreamVideoIcon';
import NavBack from '../../components/Includes/Navbar/NavBack';
import ErrorPlayer from '../../components/Includes/Player/ErrorPlayer';
import Toast from '../../components/Includes/Common/Toast';
import JsonLDVideo from '../../components/Seo/JsonLDVideo';

import { Row, Col, Button, Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ShareIcon from '@material-ui/icons/Share';
import PauseIcon from '../../components/Includes/Common/PauseIcon';
import MissedIcon from '../../components/Includes/Common/Missed';

import { DEV_API, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, BASE_URL, RESOLUTION_IMG, VISITOR_TOKEN } from '../../config';

import '../../assets/scss/components/live-event-v2.scss';
import '../../assets/scss/components/live-event.scss';
import '../../assets/scss/videojs.scss';
import 'emoji-mart/css/emoji-mart.css';

import { getCountdown } from '../../utils/helpers';
import { triggerQualityButtonClick } from '../../utils/player';

import ax from 'axios';

const JwPlayer = dynamic(() => import('../../components/Includes/Player/JwPlayer'));
// const InnoPlayer = dynamic(() => import('../../components/Includes/Player/InnoPlayer'));
const InteractiveModal = dynamic(() => import('../../components/Modals/InteractiveModal'));

const axios = ax.create({
  // baseURL: API + '/api',
  baseURL: DEV_API + '/api'
});

axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
  return request;
});

class LiveEvent extends React.Component {

	static async getInitialProps(ctx) {
		initialize(ctx);

		let userAgent;
		if (ctx.req) {
			userAgent = ctx.req.headers['user-agent'];
		}
		else {
			userAgent = navigator.userAgent;
		}
		let isMobile = Boolean(userAgent.match(
			/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
		));

		return {
			user_agent: userAgent,
			is_mobile: isMobile,
		};
	}

	constructor(props) {
		super(props);
		this.playerContainerRef = React.createRef();
		this.titleRef = React.createRef();
		this.state = {
			tabStatus: '',
			isAvailable: false,
			errorCon: false,
			error: false,
			errorEnd: false,
			emoji_picker_open: false,
			chat_open: false,
			chat: '',
			user_data: null,
			snapshots: [],
			sending_chat: false,
			block_user: {
				status: false,
				message: '',
			},
			chats: [],
			live_events: [],
			missed_event: [],
			ads_data: null,
			isAds: false,
			meta: '',
			resolution: RESOLUTION_IMG,
			status: false,
			screen_width: 320,
			quality_selector_shown: false,
			playing: false,
            user_active: false,
			selected_tab: 'live-event',
			is_live: false,
			action_sheet: false,
			caption: '',
			url: '',
			selected_event: {},
			selected_event_url: {},
			hashtags: [],
			tab_status: '',
			refreshUrl: null,
			statusError: 0,
      adsOverlayDuration: {
        refreshDuration: 0,
        reloadDuration: 0
      },
			videoIndexing: {},
			interactive_modal : false
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
		this.videoNode = null;
		this.convivaTracker = null;
		this.disconnectHandler = null;
		this.currentTime = new Date().getTime();
		this.props.setPageLoader();
	}

	componentWillUnmount() {
		for (let key in this.state.snapshots) {
			this.state.snapshots[key]();
		}

		if (this.player) {
			this.player.dispose();
		}
	}

	async componentDidMount() {
		if(this.props.router.asPath.match('/live-event/') && this.state.selected_event?.data?.chat !== "inactive") this.loadChatMessages(this.props.router.query.id);
		initGA();
		this.getAvailable();

		if (this.props.router.asPath.match('/missed-event/')) {
			this.setState({
				selected_tab: 'missed-event',
			});
		}

		try {
			let res = null;
			const { id } = this.props.router.query
	
			if (this.props.router.asPath.match('/missed-event/')) {
				res = await Promise.all([
					axios.get(`${DEV_API}/api/v1/missed-event/${id}`),
					axios.get(`${DEV_API}/api/v2/missed-event/${id}/url?appierid=${getUidAppier()}`)
				]);
			}
			else {
				res = await Promise.all([
					axios.get(`${DEV_API}/api/v1/live-event/${id}`),
					axios.get(`${DEV_API}/api/v1/live-event/${id}/url?appierid=${getUidAppier()}`)
				]);
			}

			const error_code = res[0]?.status > 200 ? res[0]?.status : false;
			const error_code_2 = res[1]?.status > 200 ? res[1]?.status : false;
			if (error_code || error_code_2) {
				this.setState({
					selected_event: {},
					selected_event_url: {},
				})
			}
	
			const data = await Promise.all([
				res[0],
				res[1],
			]);
	
			this.setState({
				selected_event: data[0]?.data,
				selected_event_url: data[1]?.data,
				statusError: data[1]?.data ? data[1]?.data?.status : false,
				status: data[1]?.data?.status?.code === 12 ? 2 : 0
			})
			
		} catch (error) {
			console.error('error',error)
			this.setState({
				selected_event: {},
				selected_event_url: {},
			})
		}

		this.getMissedEvent();
		this.getLiveEvent();
		
		this.props.getUserData()
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({ user_data: response.data.data });
				}
			})

		axios.get('/v1/get-ads-duration')
		.then(response => {
			if (response.data.data) {
				const [ refresh, reload ] = response.data.data
				this.setState({
					adsOverlayDuration: {
						refreshDuration: refresh.duration,
						reloadDuration: reload ? reload.duration : refresh.duration
					}
				})
			}
		})
		setTimeout(() => {
			var span = document.getElementsByClassName("tooltiptext")[0]
			if(!span) return
			span.parentNode.removeChild(span);  
		}, 2000);
	}

	getLiveEvent() {
		this.props.setPageLoader();
		this.props.setSeamlessLoad(true);
		this.props.getLiveEvent('non on air')
		.then(response => {
			this.setState({
				live_events: response.data.data ,
				meta: response.data.meta.image_path,
			}, () => {
				// this.initVOD();
				// this.initPlayer();
				this.props.setSeamlessLoad(false);
				this.props.unsetPageLoader();

				if (location.search.includes("refpage=login")) this.toggleChat()
			});
		})
		.catch(error => {
			// this.initPlayer();
			this.props.setSeamlessLoad(false);
			this.props.unsetPageLoader();
		});
	}
	
	getMissedEvent() {
		this.props.setSeamlessLoad(true);
    this.props.setPageLoader();
    this.props.getMissedEvent()
    .then(({data: lists}) => {
			this.props.setSeamlessLoad(false);
			this.props.unsetPageLoader();
      this.setState({
				missed_event: lists.data,
				meta: lists.meta.image_path,
      });
    })
    .catch((error) => {
			this.props.setSeamlessLoad(false);
			this.props.unsetPageLoader();
    });
  }

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selected_tab !== this.state.selected_tab) {
			setTimeout(() => {
				var span = document.getElementsByClassName("tooltiptext")[0]
				if(!span) return
				span.parentNode.removeChild(span);  
			}, 4000);
		}
	}

	isLive() {
		if (this.state.selected_event && this.state.selected_event.data) {
			const { data } = this.state.selected_event;
			const currentTime = new Date(data.current_date * 1000).getTime();
			const startTime = new Date(data.release_date_quiz * 1000).getTime();
			if (currentTime < startTime) {
				return [getCountdown(data.release_date_quiz, data.current_date)[0], getCountdown(data.release_date_quiz, data.current_date)[0]];
			}
			else {
				getCountdown(data.release_date_quiz, data.current_date)[1]
			}
		}

		return false;
	}
	getAvailable() {
		if (this.state.selected_event && this.state.selected_event.data && this.state.selected_event_url && this.state.selected_event_url.data) {

			const { data } = this.state.selected_event;
			const currentTime = new Date().getTime();
			const endTime = new Date(data.end_date).getTime();
			if(this.props.router.asPath.match('/live-event/')) {
				if (endTime < currentTime) {
					this.setState({ isAvailable: true });
				}
			}
			return false;
		}
		if(this.props.router.asPath.match('/missed-event/')) {

			this.setState({ isAvailable: true })
			return false
		}
		if(this.props.router.asPath.match('/live-event/') || !(this.state.selected_event_url && this.state.selected_event_url.data)) {

			this.setState({ errorEnd: true })
			return false
		}
	}

	statusChatBlock(id) {
		// UNCOMMENT LAGI KALO UDAH
		this.props.getLiveChatBlock(id)
			.then(res => {
				this.setState({
					block_user: {
						status: res.data.status.code === 0 ? false : true,
						message: res.data.status.message_client,
					},
				});
			})
			.catch((error) => {
			});
	}

	checkLogin() {
		if (!this.state.user_data && !getUserAccessToken()) {
			showSignInAlert(`Please <b>Sign In</b><br/>
				Woops! Gonna sign in first!<br/>
				Only a click away and you<br/>
				can continue to enjoy<br/>
				<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true, 'popup-action-signup', 'popup-action-signin');
			return false;
		}
		return true;
	}

	loadChatMessages(id) {
		this.props.setPageLoader();
		this.setState({ chats: [] }, () => {
			const chatBox = document.getElementById('chat-messages');
			chatBox.scrollTop = chatBox?.scrollHeight;
			this.props.unsetPageLoader();
			if (true) {
				let firstLoadChat = true;
				this.props.listenChatMessages(id)
					.then(collection => {
						let snapshots = this.state.snapshots;
						let snapshot = collection.orderBy('ts', 'desc').limit(10).onSnapshot(querySnapshot => {
							querySnapshot.docChanges()
								.map(change => {
									let chats = this.state.chats;
									if (change.type === 'added') {
										if (!this.state.sending_chat) {
											if (chats.length > 0) {
												let lastChat = chats[chats.length - 1];
												let newChat = change.doc.data();
												if ((lastChat && newChat) && (lastChat.u != newChat.u || lastChat.m != newChat.m || lastChat.i != newChat.i)) {
													if (firstLoadChat) {
														chats.unshift(newChat);
													}
													else {
														chats.push(newChat);
													}
												}
											}
											else {
												if (firstLoadChat) {
													chats.unshift(change.doc.data());
												}
												else {
													chats.push(change.doc.data());
												}
											}

											this.setState({ chats: chats }, () => {
												const chatBox = document.getElementById('chat-messages');
												chatBox.scrollTop = chatBox.scrollHeight;

												const chatInput = document.getElementById('chat-input');
												chatInput.style.height = `100%`;
											});
										}
									}
								});

							firstLoadChat = false;
						});
					});
			}

		});
	}
	setupPlayerBehavior() {
		if (this.player) {
			this.player.on('useractive', () => {
				if (!this.player.paused()) {
					const seekButtons = document.getElementsByClassName('vjs-seek-button');
					for (let i = 0; i < seekButtons.length; i++) {
						seekButtons[i].style.display = 'block';
					}

					this.setState({ user_active: true });
				}
			});

			this.player.on('userinactive', () => {
				if (!this.player.paused()) {
					const seekButtons = document.getElementsByClassName('vjs-seek-button');
					for (let i = 0; i < seekButtons.length; i++) {
						seekButtons[i].style.display = 'none';
					}

					this.setState({ user_active: false });
				}

				if (this.state.quality_selector_shown) {
                    this.triggerQualityButtonClick('inactive');
				}
				this.setState({ quality_selector_shown: false });
			});

			this.player.on('play', () => {
				const seekButtons = document.getElementsByClassName('vjs-seek-button');
				for (let i = 0; i < seekButtons.length; i++) {
					seekButtons[i].style.display = 'none';
				}

				const playButton = document.getElementsByClassName('vjs-big-play-button');
				if (playButton.length > 0) {
					playButton[0].style.display = 'none';
				}

				this.setState({ playing: true });
			});

			this.player.on('pause', () => {
				const seekButtons = document.getElementsByClassName('vjs-seek-button');
				for (let i = 0; i < seekButtons.length; i++) {
					seekButtons[i].style.display = 'none';
				}

				const playButton = document.getElementsByClassName('vjs-big-play-button');
				if (playButton.length > 0) {
					playButton[0].style.display = 'block';
				}

				this.setState({ playing: false });
			});

			this.player.on('playing', () => {
				this.setState({ playing: true });
			});
		}
	}
	setSkipButtonCentered(orientation = 'portrait') {
		if (this.player) {
			const player = document.getElementById(this.player.id());
			if (player) {
				const playerHeight = player.clientHeight;
				const seekButtons = document.getElementsByClassName('vjs-seek-button');
				for (let i = 0; i < seekButtons.length; i++) {
					seekButtons[i].style.bottom = (Math.floor(playerHeight / 2) - 5) + 'px';

					if (i == 0) {
						seekButtons[i].style.left = (this.state.screen_width - ((this.state.screen_width / 3) * (orientation == 'portrait' ? 2.35 : 2.20))) + 'px';
					}
					else if (i == 1) {
						seekButtons[i].style.left = (this.state.screen_width - (this.state.screen_width / 3)) + 'px';
					}
				}
			}

		}
	}
	changeQualityIconButton() {
        const self = this;
        setTimeout(() => {
            const qualitySelectorElement = document.getElementsByClassName('vjs-quality-selector');
            if (qualitySelectorElement.length > 0) {
                const childs = qualitySelectorElement[0].childNodes;
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].className == 'vjs-menu-button vjs-menu-button-popup vjs-button') {
                        childs[i].addEventListener('touchstart', function() {
                            
                            self.setState({ quality_selector_shown: !self.state.quality_selector_shown });
                        });
                        const qualityItems = document.querySelectorAll('li[role=menuitemradio]');
                        for (let j = 0; j < qualityItems.length; j++) {
                            qualityItems[j].addEventListener('touchstart', function() {
                                
                                self.setState({ quality_selector_shown: false });
                            });
                        }
                        childs[i].addEventListener('click', function() {
                            
                            self.setState({ quality_selector_shown: !self.state.quality_selector_shown });
                        });

                        const grandChilds = childs[i].childNodes;
                        for (let j = 0; j < grandChilds.length; j++) {
                            if (grandChilds[j].className == 'vjs-icon-placeholder' || grandChilds[j].className == 'vjs-icon-placeholder vjs-icon-hd' ) {
                                grandChilds[j].classList.remove('vjs-icon-hd');
                                grandChilds[j].innerHTML = '<i style="transform: scale(1.5)" class="fas fa-cog"></i>';
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }, 1000);
    }

	toggleChat() {
		if (this.checkLogin()) {
			this.setState({ chat_open: !this.state.chat_open }, () => {
				if (this.state.chat_open && !this.state.isAds) {
					if(this.state.selected_event.data) {
						this.getAds(this.state.selected_event.data.id);
					}
				}
				if (!this.state.chat_open) {
					this.setState((state,props) => ({
						ads_data: null,
					}));
				}
				this.props.toggleFooter(this.state.chat_open);
				const chatBox = document.getElementById('chat-messages');
				chatBox.scrollTop = chatBox.scrollHeight;
			});
		}
	}

	toggleEmoji() {
		this.setState({ emoji_picker_open: !this.state.emoji_picker_open });
	}

	handleChatEnter(e) {
		const chatInput = document.getElementById('chat-input');
		// const scrollHeight = chatInput.scrollHeight - 30;
		// chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && this.state.chat && this.state.chat != '\n') {
			this.sendChat();
		}
	}

	onChangeChatInput(e) {
		if (e.target.value != '\n') {
			this.setState({ chat: e.target.value });
		}
	}

	toggleActionSheet(caption = '', url = '', hashtags = [], tabStatus = 'livetv') {
		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		});
	}

	toggleInteractiveModal() {
		this.setState({ interactive_modal: !this.state.interactive_modal });
	}

	resendChat(index) {
		// let chats = this.state.chats;
		// let lastChat = chats[index];
		// lastChat.sent = false;
		// lastChat.failed = false;
		// chats[index] = lastChat;
		// this.setState({ chats: chats, sending_chat: true }, () => {
		// 	const { id } = this.props.selected_event.data;
		// 	const userData = this.state.user_data;
		// 	let user = userData.nickname ? userData.nickname :
		// 		userData.display_name ? userData.display_name :
		// 			userData.email ? userData.email.replace(/\d{4}$/, '****') :
		// 				userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';

		// 	this.props.setChat(id, lastChat.m, user, this.state.user_data.photo_url)
		// 		.then(response => {
		// 			lastChat.sent = true;
		// 			if (response.status !== 200 || response.data.status.code !== 0) {
		// 				lastChat.failed = true;
		// 			}
		// 			chats[index] = lastChat;
		// 			this.setState({ chats: chats, sending_chat: false });
		// 		})
		// 		.catch(() => {
		// 			lastChat.sent = true;
		// 			lastChat.failed = true;
		// 			chats[index] = lastChat;
		// 			this.setState({ chats: chats, sending_chat: false });
		// 		});
		// });
	}

	sendChat() {
		if (this.state.user_data) {
			if (this.state.chat != '') {
				const { id } = this.state.selected_event.data;
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
					chatInput.style.height = `100%`;

					this.props.setChat(this.state.selected_event.data.id ? this.state.selected_event.data.id : this.state.selected_event.data.content_id, newChat.m, user, this.state.user_data.photo_url)
						.then(response => {
							newChat.sent = true;
							if (response.status !== 200 || response.data.status.code !== 0) {
								newChat.failed = true;
							}
							// chats[chats.length - 1] = newChat;
							this.setState({ chats: chats, sending_chat: false });
						})
						.catch(() => {
							// newChat.sent = true;
							// newChat.failed = true;
							// chats[chats.length - 1] = newChat;
							// this.setState({ chats: chats, sending_chat: false });
						});
				});


				// websocket
				// this.props.postChatSocket(id, this.state.chat, this.state.user_data.photo_url, user)
				// .then(response => {
				// 	newChat.sent = true;
				// 	if (response.status !== 200) {
				// 		newChat.failed = true
				// 	}
				// 	chats[chats.length - 1] = newChat;
				// 		this.setState({ chats: chats, sending_chat: false });
				// })
				// .catch(() => {
				// 	newChat.sent = true;
				// 	newChat.failed = true;
				// 	chats[chats.length - 1] = newChat;
				// 	this.setState({ chats: chats, sending_chat: false });
				// });
				// this.setState({ chats: chats, chat: '', sending_chat: true }, () => {
				// 	const chatBox = document.getElementById('chat-messages');
				// 	chatBox.scrollTop = chatBox.scrollHeight;

				// 	const chatInput = document.getElementById('chat-input');
				// 	chatInput.style.height = `24px`;
				// });
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

	getPlayNow(status) {
		const vm = this
		if(status) {
			window.location.reload(false);
		}
	}

	renderPlayer() {
		let playerRef = (<div></div>);
		let errorRef = (<div></div>);

		if (this.state.errorCon) {
			errorRef = (
				<ErrorPlayer
				iconError={<StreamVideoIcon />}
				title="No Internet Connection"
				content1="Please check your connection,"
				content2="you seem to be offline."
				status={ 500 }
				statusCode={ 500 } />
				);
			return errorRef;
		}
		if (this.state.error) {
			errorRef = (
				<ErrorPlayer
				iconError={<StreamVideoIcon />}
				title="Video Error"
				content1="Sorry, Error has occured."
				content2="Please try again later."
				status={ this.state.status }
				statusCode={ this.state.statusCode } />
				);
			return errorRef;
		}
		if (this.state.errorEnd) {
				errorRef = (<ErrorPlayer
				iconError={<MissedIcon />}
				title=""
				content1="Sorry, Please check the video"
				content2="on Missed Event"
				status={ this.state.status }
				statusCode={ this.state.statusCode } />
				);

			return errorRef;
		}
		if (this.state.isAvailable) {
				errorRef = (<ErrorPlayer
				iconError={<MissedIcon />}
				title="Not Available"
				content1="Sorry, video is not available."
				content2="You can watch other video, below."
				status={ this.state.status }
				statusCode={ this.state.statusCode } />
				);

			return errorRef;
		}
		if(!this.state.error || !this.state.errorEnd || !this.state.errorCon) {
			playerRef = (
				<div className="player-liveevent-container">
					<div data-vjs-player>
						<div
							onClick={() => {
								if (this.player) {
									this.player.pause();
								}
							}}
							style={{
								position: 'absolute',
								top: '50%',
								left: this.state.screen_width / 2,
								marginTop: '-0.81666em',
								display: this.state.playing && this.state.user_active ? 'block' : 'none',
								transform: 'scale(1.5) translateX(-30%) translateY(-30%)',
								padding: 0
							}}>
							<PauseIcon/>
						</div>
						<video
							autoPlay
							playsInline
							style={{
								width: '100%',
							}}
							ref={node => this.videoNode = node}
							className="video-js vjs-default-skin vjs-big-play-centered"
						></video>
					</div>
				</div>
			);
		}

		return this.state.error ? errorRef : playerRef;
	}
	getMeta() {
		if(Object.keys(this.props.router.query).length === 0) {
			return {
				title: 'Live Event - RCTI+',
				description: 'Nonton streaming online live event hanya di RCTI+',
				image: '',
			}
		}
		const data = this.state.selected_event?.data;
		const meta = this.state.selected_event?.meta;
		return {
			title: this.props.router.asPath.includes('/missed-event') ? `Nonton Tayangan Ulang Streaming ${this.props.router.query.title.replace(/-/gi, ' ') || ''}`: 'Nonton Live Streaming ' + (this.props.router.query.title.replace(/-/gi, ' ') || ''),
			description: this.props.router.asPath.includes('/missed-event') ? `Tonton siaran ulang ${(this.props.router.query.title.replace(/-/gi, ' ') || '')} gratis dan tanpa buffering di RCTI+` : `Tonton siaran langsung ${(this.props.router.query.title.replace(/-/gi, ' ') || '')} gratis dan tanpa buffering di RCTI+` ,
			image: data && meta ? (meta.image_path + '300' + data.portrait_image) : '',
		};
	}

	getAds(id) {
		if(id) {
			this.props.getAdsChat(id)
			.then(({data}) => {
				this.setState({
					ads_data: data,
				}, () => {
					if (data.data) {
						stickyAdsShowing(data, 'sticky_ads_showing');
						appierAdsShow(data, 'sticky_ads_showing', 'live-event');
						// RPLUSAdsShowing(data, 'views', 'sticky_ads_showing');
					}
				});
			})
		}
	}
	callbackAds(e) {
		this.setState({
			ads_data: null,
		}, () => {
			setTimeout(() => {
				if (this.state.selected_event.data) {
					this.getAds(this.state.selected_event.data.id);
				}
			}, 100);
		});
	}

	callbackCount(end, current) {
		if(this.state.isAds) {
			let distance = getCountdown(end, current)[0] || 100000;
			const countdown = setInterval(() => {
				distance -= 1000
				if (distance < 0 || !this.state.isAds) {
					clearInterval(countdown)
					this.setState({
						ads_data: null,
						isAds: false,
					}, () => {
						if(this.state.chat_open) {
							setTimeout(() => {
								if (this.state.selected_event.data) {
									this.getAds(this.state.selected_event.data.id);
								}
							}, 100);
						}
					});
				}
			}
			,1000)
		}
	}
	getStatusAds(e) {
		if(this.state.ads_data) {
			stickyAdsClicked(this.state.ads_data, 'sticky_ads_clicked', 'closed')
			appierAdsClicked(this.state.ads_data, 'sticky_ads_clicked', 'closed')
			RPLUSAdsClicked(this.state.ads_data, 'click', 'sticky_ads_clicked', 'closed')
		}
		this.setState({ isAds: e })
	}


	routingQueryGenerator(targetContent) {
    let targetHref = [],
      targetHrefAlias = []

    const query = {
      ...this.props.router.query,
      id: targetContent.content_id,
      title: targetContent.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase(),
    }

    for (const key in query) {
			targetHref.push(`${key}=${query[key]}`)
      targetHrefAlias.push(query[key])
    }
		
    return {
      href: targetHref.join("&"), // actual target url
      hrefAlias: targetHrefAlias.join("/") // url when displayed on browser 
    }
  }

	handleActionBtn(action) {
		this.props.setPageLoader()
    const { videoIndexing, missed_event, live_events } = this.state

		const isLiveEvent = this.props.router.asPath.includes("live-event/")
		const queuingContents = isLiveEvent ? live_events : missed_event
		const route = isLiveEvent ? "live-event" : "missed-event"
    const direction = (action === "forward") ? "next" : "prev"

    const targetVideoContent = queuingContents[videoIndexing[direction]]
    const { href, hrefAlias } = this.routingQueryGenerator(targetVideoContent)
		const indexing = this.generateIndexing(queuingContents, this.state.videoIndexing, targetVideoContent.content_id)

    this.props.router.push(
			`/${route}/?${href}`,
			`/${route}/${hrefAlias}`
			)
		this.setState({ videoIndexing: indexing }, _ => this.props.unsetPageLoader())
	}

	getCurrentViewingVideoIndex() {
		const { missed_event, live_events } = this.state
		const isLiveEvent = this.props.router.asPath.includes("live-event/")
		const queuingContents = isLiveEvent ? live_events : missed_event

		if (queuingContents.length === 0) return
		
		const currentEventId = +this.props.router.query.id
		const indexes = {
			...this.state.videoIndexing,
			maxQueue: queuingContents.length
		}
		const videoIndexing = this.generateIndexing(queuingContents, indexes, currentEventId)
		
    if (this.state.videoIndexing.current !== videoIndexing.current) {
			this.setState({ videoIndexing })
    }
  }
	
	generateIndexing(queueingContents, indexes, targetId) {
		let output = indexes
		queueingContents.forEach((content, i) => {
			if (targetId === content.content_id) {
				output["prev"] = i - 1 < 0 ? 0 : i - 1
        output["current"] = i
        output["next"] = i + 1 > queueingContents.length - 1 ? queueingContents.length - 1 : i + 1
        return
			}
		})
		return output
	}

	
	render() {
		this.getCurrentViewingVideoIndex()

		const { state, props } = this;
		const  { selected_event, selected_event_url } = this.state

		let errorEvent = (<Col xs="12" key="1" className="le-error">
				<LiveIcon />
				<p>Ups! No Data Found</p>
				<p>content isn't available right now</p>
			</Col>
		);
		const contentData = {
			asPath: props.router.asPath || '',
			title: selected_event?.data?.name,
			thumbnailUrl: this.getMeta().image || '',
			expires: selected_event?.data?.end_date || '',
			startDate: selected_event?.data?.start_date || '',
			endDate: selected_event?.data?.end_date || '',
		}
		return (
			<Layout title={this.getMeta().title}>
				<Head>
					<JsonLDVideo content={contentData} />
					<meta name="description" content={this.getMeta().description} />
					<meta name="keywords" content={this.getMeta().title} />
					<meta property="og:title" content={this.getMeta().title} />
					<meta property="og:description" content={this.getMeta().description} />
					<meta property="og:image" itemProp="image" content={this.getMeta().image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:type" content="article" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={this.getMeta().image} />
					<meta name="twitter:image:alt" content={this.getMeta().title} />
					<meta name="twitter:title" content={this.getMeta().title} />
					<meta name="twitter:description" content={this.getMeta().description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />

          <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
				</Head>
				{/* <Offline onChange={(status) => {
					if (!status) {
							this.setState({
								errorCon: true,
							});
							return false
						}
						this.setState({
								errorCon: false,
							}, () => {
								this.player.dispose();
								setTimeout(() => {
									this.initPlayer();
								}, 500);
							});
					}} /> */}
				<InteractiveModal
					open={this.state.interactive_modal}
					toggle={this.toggleInteractiveModal.bind(this)}
				/>
				<ActionSheet
					tabStatus= {this.state.tabStatus}
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rctiplus'])} />
				<div className="wrapper-content" style={{ padding: 0, margin: 0 }}>
					<div ref={ this.playerContainerRef }  className="rplus-player-container">
					<NavBack navPlayer={true} stylePos="absolute"/>

							{/* <InnoPlayer
							data={ selected_event_url && selected_event_url.data }
							type={ this.props.router.asPath.match('/missed-event/') ? 'missed event' : 'live event' }
							customData={{
								program_name: this.props.selected_event && this.props.selected_event.data && this.props.selected_event.data.name,
								isLogin: this.props.user.isAuth,
								sectionPage: this.props.router.asPath.match('/missed-event/') ? 'missed event' : 'live event' ,
								}}
							geoblockStatus={ this.state.statusError === 2 ? true : false }
              adsOverlayData={ state.adsOverlayDuration }
							actionBtn={(e) => this.handleActionBtn(e)}
							videoIndexing={state.videoIndexing}
							/> */}

							<JwPlayer
							data={ selected_event_url?.data }
							type={ this.props.router.asPath.match('/missed-event/') ? 'missed event' : 'live event' }
							customData={{
								program_name: selected_event && selected_event.data && selected_event.data.name,
								isLogin: this.props.user.isAuth,
								sectionPage: this.props.router.asPath.match('/missed-event/') ? 'missed event' : 'live event' ,
								}}
							geoblockStatus={ this.state.statusError === 2 ? true : false }
              adsOverlayData={ state.adsOverlayDuration }
							actionBtn={(e) => this.handleActionBtn(e)}
							videoIndexing={state.videoIndexing}
							/>

					</div>
					<div ref= { this.titleRef } className="title-wrap">
						<h1 style={{
							display: 'flex',
							alignItems: 'center',
							fontSize: '1em',
							margin: 0
						}}>
						{this.state.is_live[0] ? (
								<CountdownTimer
									id= {selected_event.data.id}
									onUrl={this.getPlayNow}
									statusPlay={this.state.is_live[1]}
									key={this.state.is_live[0]}
									position="relative"
									timer={this.state.is_live[0]}
									timerCurrent={ selected_event.data && selected_event.data.current_date }
									statusTimer="1"/>
							) : null}

							{selected_event && selected_event.data ? selected_event.data.name : 'Live Streaming'}
						</h1>

						<ShareIcon onClick={() => {
							liveShareEvent(selected_event.data && selected_event.data.id || 'error', selected_event.data && selected_event.data.name || 'error');
							this.toggleActionSheet((selected_event && selected_event.data ? selected_event.data.name : 'Live Streaming'), BASE_URL + this.props.router.asPath, ['rctiplus'], 'livetv')
						}}/>
					</div>
					<div className="live-event-content-wrap">
                        <Nav tabs className="tab-wrap">
                            <NavItem
                                onClick={() => this.setState({ selected_tab: 'live-event' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Live Event');})}
                                className={this.state.selected_tab === 'live-event' ? 'selected' : ''}>
                                <NavLink>Live Event</NavLink>
                            </NavItem>
                            <NavItem
                                onClick={() => this.setState({ selected_tab: 'missed-event' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Missed Event');})}
                                className={this.state.selected_tab === 'missed-event' ? 'selected' : ''}>
                                <NavLink>Missed Event</NavLink>
                            </NavItem>
                        </Nav>
						<div className="live-event-menu" id="live-event">
							<TabContent activeTab={this.state.selected_tab}>
								<TabPane tabId={'live-event'}>
									<Row style={{marginLeft: '0 !important'}}>
										{this.state.live_events.length > 0 ? this.state.live_events.map((le, i) => (
											<Col xs={6} key={i} onClick={() => Router.push(`/live-event/${le.content_id}/${le.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`, undefined, { shallow: true })}>
												<Thumbnail
												label="Live"
												isInteractive={le.is_interactive}
												timer={getCountdown(le.release_date_quiz, le.current_date)[0]}
												timerCurrent={ le.current_date }
												statusPlay={getCountdown(le.release_date_quiz, le.current_date)[1]}
												backgroundColor="#fa262f"
												statusLabel="1"
												statusTimer="1"
												src={this.state.meta + this.state.resolution + le.landscape_image} alt={le.content_title}/>
											</Col>
										)) : this.props.pages.status ? (<div/>)
										 : errorEvent}
									</Row>
								</TabPane>
								<TabPane tabId={'missed-event'}>
									<Row style={{marginLeft: '0 !important'}}>
									{this.state.missed_event.length > 0 ? this.state.missed_event.map((le, i) => (
											<Col xs={6} key={i} onClick={() => Router.push(`/missed-event/${le.content_id}/${le.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`)}>
												<Thumbnail
												label="Live"
												backgroundColor="#fa262f"
												statusLabel="0"
												isInteractive='false'
												statusTimer="0"
												src={this.state.meta + this.state.resolution + le.landscape_image} alt={le.content_title}/>
											</Col>
										)) : this.props.pages.status ? (<div/>)
										: errorEvent}
									</Row>
								</TabPane>
							</TabContent>
						</div>
					</div>
					{ this.props.router.asPath.match('/missed-event/') || this.state.selected_tab === 'missed-event'  ? (<div />) :
					 (<div className={'live-event-chat-wrap ' + (this.state.chat_open ? 'live-event-chat-wrap-open' : '')} style={this.state.chat_open ?
						{height: `calc(100% - ${this.playerContainerRef.current.clientHeight + this.titleRef.current.clientHeight}px)`}
							: null}>
								<Row>
									<Col xs={7}>
									{selected_event?.data?.chat !== "inactive" && (
										<div className="btn-chat">
											<Button id="btn-expand" onClick={this.toggleChat.bind(this)} color="link">
												<ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" />
											</Button>
											{this.state.ads_data ? (<Toast callbackCount={this.callbackCount.bind(this)} count={this.callbackAds.bind(this)} data={this.state.ads_data.data} isAds={this.getStatusAds.bind(this)}/>) : (<div/>)}
										</div>
									)}
									</Col>
									<Col xs={5} style={{textAlign: 'end', marginLeft: '-10px'}}>
										{selected_event?.data?.is_interactive !== "false" && (
											<div className='tooltip-custom'>
												<span className="tooltiptext">Ikuti sekarang!</span>
												<div className='interactive'>
														<Button id="btn-expand" onClick={() => this.setState({interactive_modal: true})} color="link">
															<Row className='justify-content-center'>
																<img 
																	src='/static/player_icons/quiz_icon.svg	'
																	width={40}
																	height={40}
																	alt="desc"
																	className='ml-n3 mt-n3'
																	/>
																	<p className='ml-2 mt-n1'>Interactive</p>
																	<FiberManualRecordIcon className="indicator-dot-red mt-n1" />
															</Row>
														</Button>
												</div>
											</div>
										)}
									</Col>
								</Row>

							<div className="box-chat" id="chat-input">
								<div className="wrap-live-chat__block" style={this.state.block_user.status ? { display: 'flex' } : { display: 'none' }}>
									<div className="block_chat" style={this.state.chat_open ? { display: 'block' } : { display: 'none' }}>
										<div>
											<MuteChat className="icon-block__chat" />
											<p>Sorry, you cannot send the message</p>
											<span>{this.state.block_user.message}</span>
										</div>
									</div>
								</div>
								<div className="chat-messages" id="chat-messages">
									{this.state.chats.map((chat, i) => (
										<Row key={i} className="chat-line">
											<Col xs={2}>
												<Img
													loader={<PersonOutlineIcon className="chat-avatar" />}
													unloader={<PersonOutlineIcon className="chat-avatar" />}
													className="chat-avatar" src={[chat.i, '/static/icons/person-outline.png']} />
											</Col>
											<Col className="chat-message" xs={10}>
												{/* {chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span> */}
												<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />{' '}
													<span className="username">
														{chat.u}
													</span> 
													<span className="message">
														{chat.m}
													</span>
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
													onClick={this.checkLogin.bind(this)}
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
										style={{ display: this.state.emoji_picker_open ? 'block' : 'none' }} />
								</div>
							</div>
					</div>)}
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

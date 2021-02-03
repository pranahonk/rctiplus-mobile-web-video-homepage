import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Picker } from 'emoji-mart';
import TimeAgo from 'react-timeago';
import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';
import { Offline, Online } from 'react-detect-offline';
import { isIOS } from 'react-device-detect';
import MuteChat from '../../components/Includes/Common/MuteChat';
import moment from 'moment'
const ShareIcon = dynamic(() => import('../../components/Includes/IconCustom/ShareIcon'));


import initialize from '../../utils/initialize';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';
import { showSignInAlert } from '../../utils/helpers';
import { contentGeneralEvent, liveEventTabClicked, liveShareEvent, appierAdsShow, appierAdsClicked } from '../../utils/appier';
import { stickyAdsShowing, stickyAdsClicked, initGA } from '../../utils/firebaseTracking';
import { RPLUSAdsShowing, RPLUSAdsClicked } from '../../utils/internalTracking';

import liveAndChatActions from '../../redux/actions/liveAndChatActions';
import pageActions from '../../redux/actions/pageActions';
import chatsActions from '../../redux/actions/chats';
import userActions from '../../redux/actions/userActions';

import Layout from '../../components/Layouts/Default_v2';
import Thumbnail from '../../components/Includes/Common/Thumbnail';
import CountdownTimer from '../../components/Includes/Common/CountdownTimer';
import ActionSheet from '../../components/Modals/ActionSheet';
import LiveIcon from '../../components/Includes/Common/LiveIcon';
import SignalIcon from '../../components/Includes/Common/SignalIcon';
import StreamVideoIcon from '../../components/Includes/Common/StreamVideoIcon';
import NavBack from '../../components/Includes/Navbar/NavBack';
import ErrorPlayer from '../../components/Includes/Player/ErrorPlayer';
import Toast from '../../components/Includes/Common/Toast';
import ErrorIcon from '../../components/Includes/Common/ErrorLiveEvent';

import { Row, Col, Button, Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
// import ShareIcon from '@material-ui/icons/Share';
import PauseIcon from '../../components/Includes/Common/PauseIcon';
import Wrench from '../../components/Includes/Common/Wrench';
import MissedIcon from '../../components/Includes/Common/Missed';

import { DEV_API, VISITOR_TOKEN, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, BASE_URL, STATIC, RESOLUTION_IMG } from '../../config';

import '../../assets/scss/components/live-event-v2.scss';
import '../../assets/scss/components/live-event.scss';
import '../../assets/scss/videojs.scss';
import 'emoji-mart/css/emoji-mart.css';

import { getUserId, getUidAppier } from '../../utils/appier';
import { getCountdown } from '../../utils/helpers';
import { convivaVideoJs } from '../../utils/conviva';
import { triggerQualityButtonClick } from '../../utils/player';

import ax from 'axios';

// import videojs from 'video.js';
// import 'videojs-contrib-ads';
// import 'videojs-ima';
// import 'video.js/src/css/video-js.scss';
// import 'videojs-hls-quality-selector';
// import qualitySelector from '../../assets/js/videojs-hls-quality-selector/dist/videojs-hls-quality-selector.cjs';
// import qualityLevels from 'videojs-contrib-quality-levels';
// import 'videojs-seek-buttons';
// import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';
const JwPlayer = dynamic(() => import('../../components/Includes/Player/JwPlayer'));
const innerHeight = require('ios-inner-height');

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
			const id = ctx.query.id;
        // const id = 19;
		const accessToken = getCookie('ACCESS_TOKEN');
		const options = {
			method: 'GET',
			headers: {
				'Authorization': accessToken ? accessToken : VISITOR_TOKEN
			}
		};
		let res = null;
		if (ctx.asPath.match('/missed-event/') || ctx.asPath.match('/past-event/')) {
			res = await Promise.all([
				fetch(`${DEV_API}/api/v1/missed-event/${id}`, options),
				fetch(`${DEV_API}/api/v2/missed-event/${id}/url?appierid=${getUidAppier()}`, options)
			]);
		}
		else {
			res = await Promise.all([
				fetch(`${DEV_API}/api/v1/live-event/${id}`, options),
				fetch(`${DEV_API}/api/v1/live-event/${id}/url?appierid=${getUidAppier()}`, options)
			]);
		}

		const error_code = res[0].status > 200 ? res[0].status : false;
		const error_code_2 = res[1].status > 200 ? res[1].status : false;
		if (error_code || error_code_2) {
			return {
				selected_event: false,
				selected_event_url: false
			};
		}

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

		const data = await Promise.all([
			res[0].json(),
			res[1].json(),
		]);
		return {
			selected_event: data[0],
			selected_event_url: data[1],
			user_agent: userAgent,
			is_mobile: isMobile,
		};
	}

	constructor(props) {
		super(props);
		console.log(this.props.selected_event);
		console.log(this.props.selected_event_url);
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
			status: this.props.selected_event_url ? this.props.selected_event_url.status : false,
			screen_width: 320,
			quality_selector_shown: false,
			playing: false,
            user_active: false,
			selected_tab: 'now-playing',
			is_live: this.isLive(),
			action_sheet: false,
			caption: '',
			url: '',
			hashtags: [],
			tab_status: '',
			refreshUrl: null,
			statusError: this.props.selected_event_url && this.props.selected_event_url.status && this.props.selected_event_url.status.code === 12 ? 2 : 0,
      adsOverlayDuration: {
        refreshDuration: 0,
        reloadDuration: 0
      },
		};

		const segments = this.props.router.asPath.split(/\?/);
		this.reference = null;
		this.homepageTitle = null;
		this.tabName = null;
		if (segments.length > 1) {
			const q = queryString.parse(segments[1]);
			if (q.ref) {
				this.reference = q.ref;
			}
			if (q.homepage_title) {
				this.homepageTitle = q.homepage_title;
			}
			if (q.tab_name) {
				this.tabName = q.tab_name;
			}
		}

		this.player = null;
		this.videoNode = null;
		this.convivaTracker = null;
		this.disconnectHandler = null;
		this.currentTime = new Date().getTime();
		this.props.setPageLoader();

		// console.log(this.props.selected_event);
	}
	componentDidUpdate(prevProps, prevState) {
		// console.log(this.playerContainerRef.current.clientHeight, this.titleRef.current.clientHeight)
	}
	componentWillUnmount() {
		for (let key in this.state.snapshots) {
			this.state.snapshots[key]();
		}

		if (this.player) {
			this.player.dispose();
		}
	}
	componentDidMount() {
		// console.log(this.tabName)
		this.getAllLiveEvent();
		if(this.props.router.asPath.match('/live-event/')) this.loadChatMessages(this.props.router.query.id);
		initGA();
		this.props.initializeFirebase();
		this.getAvailable();
		if (this.tabName) {
			this.setState({
				selected_tab: ['now-playing', 'upcoming-events', 'past-events'].includes(this.tabName) ? this.tabName : 'now-playing',
			});
		}
		if (this.props.router.asPath.match('/past-event/')) {
			this.setState({
				selected_tab: 'past-events',
			});
		}
		// console.log(this.state.selected_tab)
		// this.getMissedEvent();
		// this.getLiveEvent();
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

    axios.get('/v1/get-ads-duration')
      .then(response => {
        //console.log('ads duration res', response.data);
        if (response.data.data) {
          this.setState({
            adsOverlayDuration: {
              refreshDuration: response.data.data[0].duration,
              reloadDuration: response.data.data[1].duration
            }
          })
        }
      })
      .catch(error => {
        console.log(error);
      });
	}
	getAllLiveEvent() {
    this.props.setPageLoader();
    this.props.getAllLiveEvent().then((res) => {
			this.props.unsetPageLoader();
			// console.log('resresrrserserser', res.data.data)
			if(res.data.data.now_playing_event.data.length > 0) {
				// this.setState({ selected_tab: 'now-playing' })
				return false
			}
			if(res.data.data.upcoming_event.data.length > 0) {
				// this.setState({ selected_tab: 'upcoming-events' })
				return false
			}
			if(res.data.data.past_event.data.length > 0) {
				// this.setState({ selected_tab: 'past-events' })
				return false
			}
    })
    .catch((err) => {
      this.props.unsetPageLoader();
    })
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
			});
		})
		.catch(error => {
			console.log(error);
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
      console.log(lists);
    })
    .catch((error) => {
			this.props.setSeamlessLoad(false);
			this.props.unsetPageLoader();
      console.log(error);
    });
  }

	isLive() {
		if (this.props.selected_event && this.props.selected_event.data) {
			const { data } = this.props.selected_event;
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
		if (this.props.selected_event && this.props.selected_event.data && this.props.selected_event_url && this.props.selected_event_url.data) {
			// console.log("testt1")
			const { data } = this.props.selected_event;
			const currentTime = new Date().getTime();
			const endTime = new Date(data.end_date).getTime();
			if(this.props.router.asPath.match('/live-event/')) {
				if (endTime < currentTime) {
					this.setState({ isAvailable: true });
				}
			}
			return false;
		}
		if(this.props.router.asPath.match('/past-event/')) {
			// console.log("testt2")
			this.setState({ isAvailable: true })
			return false
		}
		if(this.props.router.asPath.match('/live-event/') || !(this.props.selected_event_url && this.props.selected_event_url.data)) {
			// console.log("testt3")
			this.setState({ errorEnd: true })
			return false
		}
	}

	statusChatBlock(id) {
		// UNCOMMENT LAGI KALO UDAH
		this.props.getLiveChatBlock(id)
			.then(res => {
				console.log(res);
				this.setState({
					block_user: {
						status: res.data.status.code === 0 ? false : true,
						message: res.data.status.message_client,
					},
				});

				console.log('state:', this.state.block_user);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	checkLogin() {
		console.log(this.props.router.asPath)
		if (!this.state.user_data) {
			showSignInAlert(`Please <b>Sign In</b><br/>
				Woops! Gonna sign in first!<br/>
				Only a click away and you<br/>
				can continue to enjoy<br/>
				<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true, 'popup-action-signup', 'popup-action-signin',
				`/login?redirectTo=${this.props.router.asPath}`
				);
			return false;
		}
		return true;
	}

	loadChatMessages(id) {
		this.props.setPageLoader();
		this.setState({ chats: [] }, () => {
			const chatBox = document.getElementById('chat-messages');
			if(chatBox) {
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
										console.log(chats)
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
													chatBox.scrollTop = chatBox?.scrollHeight;
	
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


	loadMore() {
		// TODO
	}

	toggleChat() {
		if (this.checkLogin()) {
			this.setState({ chat_open: !this.state.chat_open }, () => {
				if (this.state.chat_open && !this.state.isAds) {
					if(this.props.selected_event.data) {
						this.getAds(this.props.selected_event.data.id);
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
				const { id } = this.props.selected_event.data;
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

					this.props.setChat(this.props.selected_event.data.id ? this.props.selected_event.data.id : this.props.selected_event.data.content_id, newChat.m, user, this.state.user_data.photo_url)
						.then(response => {
							newChat.sent = true;
							if (response.status !== 200 || response.data.status.code !== 0) {
								newChat.failed = true;
							}
							// chats[chats.length - 1] = newChat;
							console.log('CHATS', chats)
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
			<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true,
			'popup-action-signup', 'popup-action-signin',
			`/login?redirectTo=${this.props.router.asPath}`);
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
		if (!this.state.error || !this.state.errorEnd) {
			playerRef = (
				<>
					<JwPlayer
						data={ this.props.selected_event_url && this.props.selected_event_url.data }
						type={ this.props.router.asPath.match('/past-event/') ? 'missed event' : 'live event' }
						customData={ {
							program_name: this.props.selected_event && this.props.selected_event.data && this.props.selected_event.data.name,
							isLogin: this.props.user.isAuth,
							sectionPage: this.props.router.asPath.match('/past-event/') ? 'missed event' : 'live event' ,
							} }
						geoblockStatus={ this.state.statusError === 2 ? true : false }
						adsOverlayData={ this.state.adsOverlayDuration }
						/>
				</>
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
		const { data, meta } = this.props.selected_event;
		return {
			title: 'Streaming ' + (this.props.router.query.title.replace(/-/gi, ' ') || '') + ' - RCTI+',
			description: 'Nonton streaming online ' + (this.props.router.query.title.replace(/-/gi, ' ') || '') + ' tanggal ' + (data && meta ? data.start_date : '') + ' WIB hanya di RCTI+ ',
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
						RPLUSAdsShowing(data, 'views', 'sticky_ads_showing');
					}
				});
				// console.log(this.state.ads_data);
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}
	callbackAds(e) {
		console.log(e)
		this.setState({
			ads_data: null,
		}, () => {
			setTimeout(() => {
				if (this.props.selected_event.data) {
					this.getAds(this.props.selected_event.data.id);
				}
			}, 100);
		});
	}

	callbackCount(end, current) {
		console.log(this.state.isAds)
		if(this.state.isAds) {
			let distance = getCountdown(end, current)[0] || 100000;
			const countdown = setInterval(() => {
				// console.log("callback from child", distance)
				distance -= 1000
				if (distance < 0 || !this.state.isAds) {
					clearInterval(countdown)
					this.setState({
						ads_data: null,
						isAds: false,
					}, () => {
						if(this.state.chat_open) {
							setTimeout(() => {
								if (this.props.selected_event.data) {
									this.getAds(this.props.selected_event.data.id);
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
			console.log('STCKY-CLOSED',this.state.ads_data)
			stickyAdsClicked(this.state.ads_data, 'sticky_ads_clicked', 'closed')
			appierAdsClicked(this.state.ads_data, 'sticky_ads_clicked', 'closed')
			RPLUSAdsClicked(this.state.ads_data, 'click', 'sticky_ads_clicked', 'closed')
		}
		this.setState({
			isAds: e,
		}, () => { console.log(this.state.isAds)})
	}
	liveEventNow() {
		return (
			this.props.chats?.data?.now_playing_event?.data?.map((list, i) => {
				return (
					<Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event', 'now-playing')}>
						<Thumbnail
						 dateEvent={list.live_at}
						key={list.content_id + list.content_title}
						label="Live"
						backgroundColor="#fa262f"
						statusPlay={false}
						statusLabel="1"
						statusTimer="1"
						src={`${this.props.chats?.data?.now_playing_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
					</Col>
				)
			})
		)
  }
  upcomingEvent() {
    return (
      this.props.chats?.data?.upcoming_event?.data?.map((list, i) => {
        return (
          <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event', 'upcoming-events')}>
            <Thumbnail
      			dateEvent={list.live_at}
            key={list.content_id + list.content_title}
            label="Live"
            timer={getCountdown(list.live_at, list.current_date)[0]}
            timerCurrent={list.current_date}
            statusPlay={getCountdown(list.live_at, list.current_date)[1]}
            backgroundColor="#fa262f"
            statusLabel="1"
            statusTimer="1"
            src={`${this.props.chats?.data?.upcoming_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
          </Col>
        );
      })
    );
  }
  missedEvent() {
    return (
      this.props.chats?.data?.past_event?.data?.map((list, i) => {
        return (
          <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'past-event', 'past-events')}>
            <Thumbnail
            key={list.content_id + list.content_title}
            label="Live"
            backgroundColor="#fa262f"
            statusLabel="0"
            statusTimer="0"
            src={`${this.props.chats?.data?.past_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
          </Col>
        );
      })
    );
  }
	errorEvent() {
    return (<Col xs="12" key="1" className="live-event_error">
			<ErrorIcon />
			<p>Ups! No Data Found</p>
			<Button className="le-error-button">Try Again</Button>
		</Col>)
		}
	getLink(data, params = 'live-event', tabName) {
		Router.push(`/${params}/${data.id}/${data.content_name.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}?tab_name=${tabName}`);
	}
	render() {
		const liveEvent = this.props.chats
		// console.log("LOG", this.props.selected_event, liveEvent)
		const { state } = this;
		const  { selected_event, selected_event_url } = this.props;
		let errorEvent = (<Col xs="12" key="1" className="le-error">
				<LiveIcon />
				<p>Ups! No Data Found</p>
				<p>content isn't available right now</p>
			</Col>
		);
		return (
			<Layout title={this.getMeta().title}>
				<Head>
					<meta name="description" content={this.getMeta().description} />
					<meta name="keywords" content={this.getMeta().title} />
					<meta property="og:title" content={this.getMeta().title} />
					<meta property="og:description" content={this.getMeta().description} />
					<meta property="og:image" itemProp="image" content={this.getMeta().image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
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
					<Online>
						{this.renderPlayer()}
					</Online>
					<Offline>
						<ErrorPlayer
							iconError={<StreamVideoIcon />}
							title="No Internet Connection"
							content1="Please check your connection,"
							content2="you seem to be offline."
							status={ 500 }
							statusCode={ 500 } />
					</Offline>
						{/* {this.renderPlayer()} */}
						{/* <JwPlayer
							data={ selected_event_url && selected_event_url.data }
							type={ this.props.router.asPath.match('/past-event/') ? 'missed event' : 'live event' }
							customData={ {
								program_name: this.props.selected_event && this.props.selected_event.data && this.props.selected_event.data.name,
								isLogin: this.props.user.isAuth,
								sectionPage: this.props.router.asPath.match('/past-event/') ? 'missed event' : 'live event' ,
								} }
							geoblockStatus={ this.state.statusError === 2 ? true : false }
              adsOverlayData={ state.adsOverlayDuration }
							/> */}
					</div>
					<div ref= { this.titleRef } className="title-wrap">
						<div>
						<h1 className="label-title__live-event">
							{this.props.selected_event && this.props.selected_event.data ? this.props.selected_event.data.name : 'Live Streaming'}
						</h1>
						{
							!this.props.router.asPath.match('/missed-event/') && (
								<h2 className="label-title__live-event_date">
								{`${moment.unix(this.props.selected_event?.data?.release_date_quiz)?.format('dddd, DD MMM YYYY - h:mm:ss')} WIB` }
								</h2>
							)
						}
						<div className="flex-countdown_live-event">
							{this.isLive()[0] ? (
									<CountdownTimer
										id= {selected_event.data.id}
										onUrl={this.getPlayNow}
										statusPlay={this.isLive()[1]}
										key={this.isLive()[0]}
										position="relative"
										timer={this.isLive()[0]}
										timerCurrent={ selected_event.data && selected_event.data.current_date }
										statusTimer="1"/>
								) : this.props.router.asPath.match('/live-event/') && !this.isLive()[0] ?
								<CountdownTimer
										id= {selected_event.data?.id}
										onUrl={this.getPlayNow}
										statusPlay={false}
										key={this.isLive()[0]}
										position="relative"
										timer={this.isLive()[0]}
										timerCurrent={ selected_event.data && selected_event.data.current_date }
										statusTimer="1"/>
								: null}
						</div>
						</div>

			
						<div onClick={() => {
							liveShareEvent(selected_event.data && selected_event.data.id || 'error', selected_event.data && selected_event.data.name || 'error');
							this.toggleActionSheet((this.props.selected_event && this.props.selected_event.data ? this.props.selected_event.data.name : 'Live Streaming'), BASE_URL + this.props.router.asPath, ['rctiplus'], 'livetv')
						}}>
							<ShareIcon />
						</div>
					</div>
					<Online>
					<div className="live-event-content-wrap">
						<Nav tabs className="tab-wrap">
								{liveEvent?.data?.now_playing_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'now-playing' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Now Playing');})}
										className={this.state.selected_tab === 'now-playing' ? 'selected' : ''}>
										<NavLink>Now Playing</NavLink>
								</NavItem>) : (<div />)}
								{liveEvent?.data?.upcoming_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'upcoming-events' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Upcoming Events');})}
										className={this.state.selected_tab === 'upcoming-events' ? 'selected' : ''}>
										<NavLink>Upcoming Events</NavLink>
								</NavItem>): (<div />)}
								{liveEvent?.data?.past_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'past-events' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Past Events');})}
										className={this.state.selected_tab === 'past-events' ? 'selected' : ''}>
										<NavLink>Past Events</NavLink>
								</NavItem>): (<div />)}
						</Nav>
						<div className="live-event-menu" id="live-event">
							<TabContent activeTab={this.state.selected_tab}>
								<TabPane tabId={'now-playing'}>
									<Row style={{marginLeft: '0 !important'}}>
										{this.liveEventNow()}
									</Row>
								</TabPane>
								<TabPane tabId={'upcoming-events'}>
									<Row style={{marginLeft: '0 !important'}}>
										{this.upcomingEvent()}
									</Row>
								</TabPane>
								<TabPane tabId={'past-events'}>
									<Row style={{marginLeft: '0 !important'}}>
									{this.missedEvent()}
									</Row>
								</TabPane>
							</TabContent>
						</div>
						</div>
						{ this.props.router.asPath.match('/past-event/') || this.state.selected_tab === 'past-events'  ? (<div />) :
						(<div className={'live-event-chat-wrap ' + (this.state.chat_open ? 'live-event-chat-wrap-open' : '')} style={this.state.chat_open ?
						{height: `calc(100% - ${this.playerContainerRef.current.clientHeight + this.titleRef.current.clientHeight}px)`}
						: null}>
						<div className="btn-chat">
							<Button id="btn-expand" onClick={this.toggleChat.bind(this)} color="link">
								<ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" />
							</Button>
							{this.state.ads_data ? (<Toast callbackCount={this.callbackCount.bind(this)} count={this.callbackAds.bind(this)} data={this.state.ads_data.data} isAds={this.getStatusAds.bind(this)}/>) : (<div/>)}
						</div>
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
        	</Online>
					<Offline>
						<div className="live-event-content-wrap" style={{height: `calc(100vh - ${this.playerContainerRef?.current?.clientHeight + this.titleRef?.current?.clientHeight}px - 50px)`}}>
						<Nav tabs className="tab-wrap">
								{liveEvent?.data?.now_playing_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'now-playing' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Now Playing');})}
										className={this.state.selected_tab === 'now-playing' ? 'selected' : ''}>
										<NavLink>Now Playing</NavLink>
								</NavItem>) : (<div />)}
								{liveEvent?.data?.upcoming_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'upcoming-events' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Upcoming Events');})}
										className={this.state.selected_tab === 'upcoming-events' ? 'selected' : ''}>
										<NavLink>Upcoming Events</NavLink>
								</NavItem>): (<div />)}
								{liveEvent?.data?.past_event?.data.length > 0 ? 
								(<NavItem
										onClick={() => this.setState({ selected_tab: 'past-events' }, () => { liveEventTabClicked('mweb_homepage_live_event_tab_clicked', 'Past Events');})}
										className={this.state.selected_tab === 'past-events' ? 'selected' : ''}>
										<NavLink>Past Events</NavLink>
								</NavItem>): (<div />)}
						</Nav>
							<div className="le-absolute-center">
								{ this.errorEvent() }
							</div>
						</div>
        	</Offline>
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

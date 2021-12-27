import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import nextCookie from 'next-cookies'
import { Picker } from 'emoji-mart';
import Img from 'react-image';
import TimeAgo from 'react-timeago';
import dynamic from 'next/dynamic';

import initialize from '../utils/initialize';
import { getCountdown } from '../utils/helpers';
import { convivaJwPlayer } from '../utils/conviva';
import { urlRegex } from '../utils/regex';

import liveAndChatActions from '../redux/actions/liveAndChatActions';
import pageActions from '../redux/actions/pageActions';
import chatsActions from '../redux/actions/chats';
import userActions from '../redux/actions/userActions';

import Layout from '../components/Layouts/Default_v2';
import SelectDateModal from '../components/Modals/SelectDateModal';
import { GeoblockModal } from '../components/Modals/Geoblock';
import ActionSheet from '../components/Modals/ActionSheet';
import Wrench from '../components/Includes/Common/Wrench';
import MuteChat from '../components/Includes/Common/MuteChat';
import Toast from '../components/Includes/Common/Toast';
import JsonLDVideo from '../components/Seo/JsonLDVideo';

import { formatDate, formatDateWord, formatDateTimeID, getFormattedDateBefore, formatMonthEngToID } from '../utils/dateHelpers';
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
import PauseIcon from '../components/Includes/Common/PauseIcon';
import { isIOS } from 'react-device-detect';
import socketIOClient from 'socket.io-client';
import ax from 'axios';

import { DEV_API, BASE_URL, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, API_TIMEOUT } from '../config';

import '../assets/scss/components/live-tv.scss';
import 'emoji-mart/css/emoji-mart.css';

import { liveTvTabClicked, liveTvShareClicked, liveTvShareCatchupClicked, liveTvLiveChatClicked, liveTvChannelClicked, liveTvCatchupSchedulePlay, liveTvCatchupScheduleClicked, getUserId, appierAdsShow, appierAdsClicked } from '../utils/appier';
import { stickyAdsShowing, stickyAdsClicked, initGA } from '../utils/firebaseTracking';
// import { RPLUSAdsShowing, RPLUSAdsClicked } from '../utils/internalTracking';
import queryString from 'query-string';

import { getCookie, getVisitorToken, checkToken } from '../utils/cookie';

const JwPlayer = dynamic(() => import('../components/Includes/Player/JwPlayer'));
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

class Tv extends React.Component {

	static async getInitialProps(ctx) {
		initialize(ctx);
		// const { VISITOR_TOKEN, ACCESS_TOKEN } = nextCookie(ctx)
		const idEpg = ctx.query.epg_id;
		let dataEpg = null;
		let q = null;
    let seoData = null;
    let seoDate = null;

    const visitorToken = nextCookie(ctx)?.VISITOR_TOKEN
    const userToken = nextCookie(ctx)?.ACCESS_TOKEN
    let token = userToken?.VALUE || visitorToken?.VALUE || ''

		if(idEpg) {
			const findQueryString = ctx.asPath.split(/\?/);
			if(findQueryString.length > 1) {
				q = queryString.parse(findQueryString[1]);
				if(q.date) {
					q = formatMonthEngToID(q.date)
				}
			}

			if(!token) {
				const response_visitor = await fetch(`${DEV_API}/api/v1/visitor?platform=mweb&device_id=69420`);
				if (response_visitor.statusCode === 200) {
						return {};
				}
				const data_visitor = await response_visitor.json();
				token = data_visitor.status.code === 0 ? data_visitor.data.access_token : 'undefined'
			}
			const response_epg = await fetch(`${DEV_API}/api/v1/epg/${idEpg}`, {
					method: 'GET',
					headers: {
							'Authorization': token,
					}
			});
			if (response_epg.statusCode === 200) {
					return {};
			}
			const data_epg = await response_epg.json();
			dataEpg = data_epg.status.code === 0 ? data_epg.data : null
		}

    // getseo
    const id_channel= SITEMAP[`live_tv_${ctx.query.channel?.toLowerCase()}`]?.id_channel;
    const response_seo = await fetch(`${DEV_API}/api/v1/seo/content/live-stream/${id_channel}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
      timeout: API_TIMEOUT
    }).catch(err=> console.log('Error: ' + err));

    if (response_seo && response_seo.status == 200) {
        seoData = await response_seo.json();
    }else{
      seoData ={
        data:{
          title:'Live Streaming RCTI Hari Ini - TV Online Indonesia',
          description:'Nonton tv online bersama Indonesia',
          keywords:'live streaming rcti, rcti live, tv online',
          image:'/files/fta_rcti/SEO Assets/streaming_rcti.jpg'
        },
        meta: {
          image_path: 'https://static.rctiplus.id/media/',
          video_path: 'https://static.rctiplus.id'
        }
      }
    }

    //getdateseo
    const response_date = await fetch(`${DEV_API}/api/v1/live-event/${id_channel}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
      timeout: API_TIMEOUT
    }).catch(err=> console.log('Error: ' + err));

    if (response_date && response_date.status == 200) {
        seoDate = await response_date.json();
    }else{
      seoDate ={
        data:{
          end_date:'2029-04-30 19:00:00'
        }
      }
    }

    return {  context_data: ctx.query, data_epg: dataEpg, params_date: q, data_seo: seoData, meta_seo: seoData.meta, date_seo: seoDate};
	}

	constructor(props) {
		super(props);
		this.chatBoxRef = React.createRef();
		this.playerContainerRef = React.createRef();
		this.tvTabRef = React.createRef();
		this.inputChatBoxRef = React.createRef();
		const now = new Date();
		this.state = {
			data_player: {},
			data_player_type: 'live tv',
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
			selected_dateID: formatDateTimeID(now),
			selected_dateID2: formatDateTimeID(this.props.date_seo.data.end_date),
			select_modal: false,
			player_url: '',
			player_vmap: '',
			action_sheet: false,
			caption: '',
			url: '',
			tabStatus: '',
			pathShare: '',
			hashtags: [],
			chat_open: false,
			channel_code: this.props.context_data ? (this.props.context_data.channel === 'gtv' ? 'globaltv' : this.props.context_data.channel) : 'rcti',
			error: false,
			error_data: {},
			emoji_picker_open: false,
			chats: [],
			ads_data: null,
			isAds: false,
			chat: '',
			user_data: null,
			snapshots: [],
			sending_chat: false,
			block_user: {
				status: false,
				message: '',
			},
			ad_closed: true,
			first_init_player: true,
			status: false,
			screen_width: 320,
			quality_selector_shown: false,
			playing: false,
      user_active: false,
      adsOverlayDuration: {
        refreshDuration: 0,
        reloadDuration: 0
      },
      catchUpIndexing: {},
		};

		this.player = null;
		this.currentDate = now;
		this.pubAdsRefreshInterval = null;
		this.videoNode = null;
		this.convivaTracker = null;
		this.disconnectHandler = null;
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.dispose();
		}
		console.log(this.convivaTracker);
		if (this.convivaTracker) {
			this.convivaTracker.cleanUpSession();
		}
		// if (window.convivaVideoAnalytics) {
		// 	const convivaTracker = convivaJwPlayer();
		// 	convivaTracker.cleanUpSession();
		// }
	}

	componentDidUpdate() {

	}

	componentDidMount() {
		initGA();

		this.props.setPageLoader();
		Promise.all([
			this.props.getLiveEvent('on air'),
			axios.get('/v1/get-ads-duration')
		])
			.then((res) => {
				const [ liveEvent, adsDuration ] = res
				const [ refresh, reload ] = adsDuration.data.data
				const liveEventData = liveEvent.data.data

				this.setState({
					live_events: liveEventData,
					meta: liveEvent.data.meta,
					adsOverlayDuration: {
						refreshDuration: refresh.duration,
						reloadDuration: reload ? reload.duration : refresh.duration
					}
				}, _ => {
					liveEventData.forEach((liveevent, i) => {
						if (liveevent.channel_code === this.state.channel_code) {
							this.selectChannel(i, true);
							return
						}
					})
				})
			})
			.finally(_ => this.props.unsetPageLoader())
	}

	setHeightChatBox() {
		let heightPlayer = this.playerContainerRef.current.clientHeight + this.tvTabRef.current.clientHeight;
		return `calc(100% - ${heightPlayer}px)`;
	}

	isLiveProgram(epg) {
		const currentTime = new Date().getTime();
		const startTime = new Date(formatDate(this.currentDate) + 'T' + epg.s).getTime();
		const endTime = new Date(formatDate(this.currentDate) + 'T' + epg.e).getTime();

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

	loadChatMessages(id) {
		// this.props.setPageLoader();
		this.setState({ chats: [] }, () => {
			const chatBox = document.getElementById('chat-messages');
			chatBox.scrollTop = chatBox.scrollHeight;
			// this.props.unsetPageLoader();
			if (true) {
				let firstLoadChat = true;
				this.props.listenChatMessages(id)
					.then(collection => {
						let snapshots = this.state.snapshots;
						let snapshot = collection.orderBy('ts', 'desc').limit(10).onSnapshot(querySnapshot => {
							querySnapshot.docChanges()
								.map(change => {
									let chats = this.state.chats;
									console.log(chats);
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
												chatInput.style.height = `24px`;
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

	statusChatBlock(id) {
		this.props.getLiveChatBlock(id)
			.then(res => {
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

	selectChannel(index, first = false) {
		this.props.setPageLoader()

		const channelData = this.state.live_events[index]
		const liveEventId = channelData.id || channelData.content_id
		const selectedDate = this.props.params_date
			? formatDateWord(new Date(this.props.params_date))
			: formatDateWord(new Date())

		this.props.setCatchupDate(selectedDate)
		this.props.setChannelCode(channelData.channel_code);

		setTimeout(() => {
			if (this.state.chat_open) {
				if (liveEventId) {
					this.getAds(liveEventId);
				}
			}
		}, 100);

		this.loadChatMessages(liveEventId);
		this.statusChatBlock(liveEventId);

		Promise.all([
			this.props.getLiveEventUrl(liveEventId),
			this.props.getEPG( // Service to get LIVE TV
				formatDate(this.currentDate),
				channelData.channel_code
			),
			this.props.getEPG( // Service to get CATCH UP TV
				formatDate(new Date(selectedDate)),
				channelData.channel_code
			)
		])
			.then(res => {
				const [ liveEventUrl, liveTv, catchUpRes ] = res
				const epg = liveTv.data.data
					.filter(e => (
						e.e < e.s || this.currentDate.getTime() < new Date(formatDate(this.currentDate) + 'T' + e.e).getTime()
					))
				const catchup = catchUpRes.data.data.filter(e => {
					if (e.s > e.e) {
						return this.currentDate.getTime() > new Date(new Date(selectedDate + ' ' + e.e).getTime() + (1 * 24 * 60 * 60 * 1000)).getTime();
					}
					return this.currentDate.getTime() > new Date(selectedDate + ' ' + e.e).getTime();
				})

				if (first != true) {
					let programLive = this.getCurrentLiveEpg();
					liveTvChannelClicked(liveEventId, channelData.name, programLive ? programLive.title : 'N/A', 'mweb_livetv_channel_clicked');
				}

				if (first === true && this.props.context_data.epg_id) {
					this.selectCatchup(this.props.context_data.epg_id, 'url');
				}

				this.props.setCatchupData(catchup)
				this.setState({
					data_player: liveEventUrl.data.data,
					data_player_type: "live_tv",
					selected_live_event: channelData,
					selected_live_event_url: liveEventUrl.data.data,
					player_url: liveEventUrl.data.data.url,
					player_vmap: liveEventUrl.data.data[process.env.VMAP_KEY],
					selected_tab: this.props.params_date ? "catch_up_tv" : "live",
					error: false,
					status: liveEventUrl.data.status.code === 12,
					selected_index: index,
					channel_code: channelData.content_title_code,
					epg,
					catchup
				})
			})
			.catch(error => {
				this.setState({
					error: true,
					first_init_player: true,
					error_data: error.status === 200 ? error.data.status.message_client : '',
					status: error.data && error.data.status.code  === 12 ? true : false,
				});
			})
			.finally(_ => this.props.unsetPageLoader())
	}

	selectCatchup(id, ref = false) {
		// this.props.setPageLoader();

		if (!ref) {
			liveTvCatchupScheduleClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_catchup_schedule_clicked');
		}

		this.props.getCatchupUrl(id)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({
						data_player: response.data.data,
						data_player_type: 'catch up tv',
						player_url: response.data.data.url,
						player_vmap: response.data.data[process.env.VMAP_KEY],
						selected_catchup: response.data.data,
						error: false
						// }, () => this.initVOD());
					// }, () => this.initPlayer());
					});
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

	toggleActionSheet(caption = '', url = '', hashtags = [], tabStatus = '') {
		this.setState({
			tabStatus: tabStatus,
			pathShare: this.state.live_events[this.state.selected_index].name,
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags,
		}, () => {
			if (this.state.action_sheet) {
				switch (this.state.selected_tab) {
					case 'live':
						liveTvShareClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_share_clicked');
						break;

					case 'catch_up_tv':
						liveTvShareCatchupClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'N/A', 'mweb_livetv_share_catchup_clicked');
						break;
				}
			}
		});
	}

	toggleChat() {
		if (this.checkLogin()) {
			this.setState({ chat_open: !this.state.chat_open }, () => {
				if (this.state.chat_open && !this.state.isAds) {
					if (this.state.live_events[this.state.selected_index].id || this.state.live_events[this.state.selected_index].content_id) {
						this.getAds(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
					}
				}
				if (!this.state.chat_open) {
					this.setState((state,props) => ({
						ads_data: null,
					}));
				}
				this.props.toggleFooter(this.state.chat_open);
				if (this.state.chat_open) {
					liveTvLiveChatClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_livechat_clicked');
				}
				const chatBox = document.getElementById('chat-messages');
				chatBox.scrollTop = chatBox.scrollHeight;
			});
		}
	}

	toggleEmoji() {
		this.setState({ emoji_picker_open: !this.state.emoji_picker_open });
	}

	tryAgain() {
		this.setState({ error: false }, () => {
			// this.initVOD();
			// this.initPlayer();
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
		if (!this.props.user.isAuth) {
			showSignInAlert(`Please <b>Sign In</b><br/>
				Woops! Gonna sign in first!<br/>
				Only a click away and you<br/>
				can continue to enjoy<br/>
				<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true, 'popup-action-signup', 'popup-action-signin');
			return false;
		}
		return true;
	}

	sendChat() {
		if (this.props.user.isAuth) {
			if (this.state.chat != '') {
				this.statusChatBlock(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
				const userData = this.props.user;
				let user = userData.nickname ? userData.nickname :
					userData.display_name ? userData.display_name :
						userData.email ? userData.email.replace(/\d{4}$/, '****') :
							userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
				let newChat = {
					ts: Date.now(),
					m: this.state.chat,
					u: user,
					i: this.props.user.photo_url,
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

					this.props.setChat(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, newChat.m, user, this.props.user.photo_url)
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

	resendChat(index) {
		let chats = this.state.chats;
		let lastChat = chats[index];
		lastChat.sent = false;
		lastChat.failed = false;
		chats[index] = lastChat;
		this.setState({ chats: chats, sending_chat: true }, () => {
			const userData = this.props.user;
			let user = userData.nickname ? userData.nickname :
				userData.display_name ? userData.display_name :
					userData.email ? userData.email.replace(/\d{4}$/, '****') :
						userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
			this.props.setChat(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, lastChat.m, user, this.props.user.photo_url)
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

	adsClose() {
		this.setState({ ad_closed: true }, () => {
			clearInterval(this.pubAdsRefreshInterval);
			setTimeout(() => {
				this.setState({ ad_closed: false }, () => {
					this.refreshPubAds();
				});
			}, 3100);
		});
	}

	refreshPubAds() {
		this.pubAdsRefreshInterval = setInterval(() => {
			console.log('refresh');
			googletag.pubads().refresh();
		}, 600000);
	}
	getAds(id) {
		if(id) {
			this.props.getAdsChat(id)
			.then(({data}) => {
				this.setState({
					ads_data: data,
				}, () => {
					if(data.data) {
						stickyAdsShowing(data, 'sticky_ads_showing')
						appierAdsShow(data, 'sticky_ads_showing');
						// RPLUSAdsShowing(data, 'views', 'sticky_ads_showing');
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
				if (this.state.live_events[this.state.selected_index].id || this.state.live_events[this.state.selected_index].content_id) {
					this.getAds(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
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
								if (this.state.live_events[this.state.selected_index].id || this.state.live_events[this.state.selected_index].content_id) {
									this.getAds(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
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

	_metaTags(){
		const [titleChannel, titleEpg] = [SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.title, this.props.router.query.epg_title?.replace(/-/gi, ' ')]
		let [descriptionChannel, channel] = [SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.description , this.props?.data_epg?.channel]
		const [keywordsChannel, paramsDate] = [SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.keywords, this.props.params_date?.replace(/-/gi, ' ')]
		const twitter_img_alt = SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.twitter_img_alt
		channel = channel === 'globaltv' ? 'gtv' : channel
		return {
			title: titleEpg ? `Streaming ${titleEpg} - ${paramsDate} di ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} - RCTI+` : titleChannel,
			image: titleEpg ? SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.image_catchup : SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.image,
			description: titleEpg ? `Nonton streaming ${titleEpg} - ${paramsDate}  online tanpa buffering dan acara favorit lainnya 7 hari kemarin. Dapatkan juga jadwal acara ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} terbaru hanya di RCTI+` : descriptionChannel,
			keywords: titleEpg ? `streaming ${channel}, live streaming ${channel}, ${channel} live, ${channel} streaming, ${channel} live streaming. ${titleEpg}, ${paramsDate}` : keywordsChannel,
			twitter_img_alt: titleEpg ? `Streaming ${titleEpg} - ${paramsDate} di ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} - RCTI+` : twitter_img_alt,
      pathimage:`${this.props?.meta_seo?.image_path+`500`+this.props?.data_seo?.data?.image}`,
		}
	}

  _dscriptionLD(channel){
    let sameas = '';
    let samearr = '';
    let description ='';
    if(channel === 'rcti'){
      sameas = '["https://www.rcti.tv/","https://www.google.com/search?q=RCTI&kponly&kgmid=/m/0824qb "," https://id.wikipedia.org/wiki/RCTI","https://www.wikidata.org/wiki/Q5257835"]';
      description = 'Rajawali Citra Televisi (RCTI) merupakan stasiun TV swasta pertama dan terbesar di Indonesia. Stasiun TV ini resmi mengudara pada Agustus 1989 dengan memegang motto “Kebanggaan Bersama Milik Bangsa”. Pada Oktober 2003, RCTI resmi masuk ke kelompok perusahaaan media yaitu Media Nusantara Citra (MNC). Setelah itu, tumbuhlah menjadi stasiun tv yang besar dan digemari masyarakat indonesia. Seperti halnya vidio com, useetv, k-vision & mivo tv, RCTI+ hadir dengan layanan televisi internet secara live streaming yang dapat dinikmati semua kalangan dengan konten eksklusif dan gratis. Channel RCTI menjadi stasiun TV yang konsisten menghadirkan tayangan televisi berkualitas dan menarik yang dapat di tonton secara live streaming di tv online RCTI+. Di tv internet RCTI+ menyajikan mulai dari program berita, musik, sinetron, sitkom, infotainment, musik, memasak, acara olahraga, kartun dan film lainnya. Salah satu program sinetron populer terkini di RCTI adalah Sinetron Ikatan Cinta, Master Chef Indonesia, Si Doel Anak Sekolahan hingga Preman Pensiun yang telah memberikan kontribusi besar dalam pasar hiburan di Indonesia. Kini, RCTI dengan slogannya “Semakin Oke” menghadirkan program-program pilihan seperti Sinetron Ikatan Cinta, Putri Untuk Pangeran hingga Preman Pensiun. Selain itu info dan update berita terbaru juga disajikan oleh RCTI dengan program Seputar iNews Pagi, Go Spot, Silet dan Seputar iNews Siang.';
      samearr = '["https://www.google.com/search?q=streaming+tv+internet&kponly&kgmid=/m/03x49v","https://id.wikipedia.org/wiki/Televisi_Internet"]';
    }else if(channel === 'mnctv'){
      sameas = '["https://www.google.com/search?q=mnctv&kponly&kgmid=/m/0dvf5k"," http://mnctv.com/ ","https://www.wikidata.org/wiki/Q6683165","https://id.wikipedia.org/wiki/MNCTV"]';
      description = 'Dengan visi menjadi pilihan utama pemirsa Indonesia “Selalu di Hati”, MNCTV terus menghadirkan program yang memanjakan mata mulai dari sinetron, variety show, talent show, animasi dan program seru lainnya. Beberapa program acara yang ditayangkan di MNCTV seperti Upin & Ipin, Raden Kian Santang, Rising Star Dangdut dan masih banyak lainnya. Adapun dalam kategori program berita seperti Lintas iNews Pagi, Lintas iNews Siang & Lintas iNews Malam. Semuanya dapat ditonton melalui siaran live streaming MNCTV hari ini di RCTI+ gratis tanpa buffer.';
      samearr = '[ "https://www.google.com/search?q=streaming+tv+internet&kponly&kgmid=/m/03x49v","https://id.wikipedia.org/wiki/Televisi_Internet"]';
    }else if(channel === 'gtv'){
      sameas = '["https://www.google.com/search?q=global+tv&kponly&kgmid=/m/0b7bnq","https://www.gtv.id/","https://www.wikidata.org/wiki/Q4201809","https://id.wikipedia.org/wiki/GTV_(Indonesia)"]';
      description = 'Live streaming acara Global TV (GTV) online hari ini gratis di RCTI+, tanpa buffer! Daftar acara GTV menyajikan pilihan kategori program menarik yang dapat ditonton secara live stream seperti kartun animasi: Zak Storm, Naruto & SpongeBob. Untuk kategori program film acara saat ini terdapat film premier Big Movies, Family & Platinum. Selain itu pada kategori Berita tersedia Buletin News dan Gerebek. Untuk kategori terakhir yang juga populer yang disiarkan yaitu The Voice Indonesia & The Voice Kids Indonesia';
      samearr = '[ "https://www.google.com/search?q=streaming+tv+internet&kponly&kgmid=/m/03x49v","https://id.wikipedia.org/wiki/Televisi_Internet"]';
    }else if(channel === 'inews'){
      sameas = '["https://www.google.com/search?q=iNews&kponly&kgmid=/m/0gh85nz","https://www.inews.id/","https://id.wikipedia.org/wiki/INews","https://www.wikidata.org/wiki/Q4213609"]';
      description = 'Televisi lokal yang awalnya bernama Sindo TV, pada tanggal 6 April 2015 secara resmi diubah menjadi iNews. iNews merupakan televisi nasional yang memiliki jaringan televisi lokal terbanyak di seluruh Indonesia. Dengan didukung jaringan yang luas, iNews mampu memberikan program-program berita unggulan dan informasi yang cepat, akurat, informatif, mendidik serta menginspirasi. Di RCTI+, kamu bisa nonton live streaming iNews TV hari ini secara langsung yang sudah terjadwal dengan beragam pilihan seperti news berita terkini, sport, religi & entertainment. Salah satu program berita populer terkini yang disajikan oleh iNews adalah iNews Pagi, iNews Siang, iNews Sore & iNews Malam. Untuk program acara lainnya menyiarkan juga Cahaya Hati Indonesia dan beberapa program pilihan lainnya seperti yang sudah dijadwalkan.';
      samearr = '[ "https://www.google.com/search?q=streaming+tv+internet&kponly&kgmid=/m/03x49v","https://id.wikipedia.org/wiki/Televisi_Internet"]';
    }
    return {same: sameas, description: description, samearr: samearr};
	}

	routingQueryGenerator(targetContent) {
    let targetHref = [],
      targetHrefAlias = []

    const query = {
      ...this.props.router.query,
      epg_id: targetContent.id,
      epg_title: targetContent.title.replace(/[^A-z]/ig, "-").toLowerCase(),
			channel: targetContent.channel
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
    const { catchup, catchUpIndexing } = this.state

    const direction = (action === "forward") ? "next" : "prev"
    const targetVideoContent = catchup[catchUpIndexing[direction]]
    const { href, hrefAlias } = this.routingQueryGenerator(targetVideoContent)
		const indexing = this.generateIndexing(catchup, this.state.catchUpIndexing, targetVideoContent.id)

		this.selectCatchup(targetVideoContent.id, 'url');
    this.props.router.push(
			`/tv?${href}`,
			`/tv/${hrefAlias}?date=${this.props.params_date}`
			)
		this.setState({ catchUpIndexing: indexing }, _ => this.props.unsetPageLoader())
  }

	getCurrentViewingVideoIndex() {
		const catchup = this.state.catchup

		if (this.state.catchup.length === 0) return
		if (!this.props.params_date) return

		const currentCatchupId = +this.props.router.query.epg_id
		const indexes = {
			...this.state.catchUpIndexing,
			maxQueue: catchup.length
		}
		const catchUpIndexing = this.generateIndexing(catchup, indexes, currentCatchupId)

    if (this.state.catchUpIndexing.current !== catchUpIndexing.current) {
      this.setState({ catchUpIndexing })
    }
  }

	generateIndexing(queueingContents, indexes, targetId) {
		let output = indexes
		queueingContents.forEach((content, i) => {
			if (targetId === content.id) {
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

		const { props, state } = this
		const contentData = {
			asPath: props.router.asPath,
			title: props.data_seo.data.title,
			description: this._dscriptionLD(props.context_data?.channel).description,
			thumbnailUrl: this._metaTags().pathimage,
			sameAs: this._dscriptionLD(props.context_data?.channel).same,
      startDate : state.selected_dateID+'+07:00',
      endDate : state.selected_dateID2+'+07:00',
			sameAs_arr: this._dscriptionLD(props.context_data?.channel).samearr
		}


		let playerRef = (<div></div>);
		if (this.state.error) {
			playerRef = (
				<div ref={ this.playerContainerRef } style={{
					textAlign: 'center',
					padding: 30,
					minHeight: 180
				}}>
					<Wrench />
					<h5 style={{ color: '#8f8f8f' }}>
						{this.state.status && this.state.status.code === 12 ? (
							<div>
								<span style={{ fontSize: 12 }}>{this.state.status.message_client}</span>
							</div>
						) : (
								<div>
									<strong style={{ fontSize: 14 }}>Cannot load the video</strong><br />
									<span style={{ fontSize: 12 }}>Please try again later,</span><br />
									<span style={{ fontSize: 12 }}>we're working to fix the problem</span>
								</div>
							)}

					</h5>
				</div>
			);
		}
		else {
			playerRef = (
				<div>
					{/* <div style={{ minHeight: 180 }} id="live-tv-player"></div> */}
					<div ref={ this.playerContainerRef } className="player-tv-container">
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
									// minHeight: 180,
									width: '100%'
								}}
								ref={node => this.videoNode = node}
								className="video-js vjs-default-skin vjs-big-play-centered"></video>
						</div>
					</div>
					{/* <!-- /21865661642/RC_MOBILE_LIVE_BELOW-PLAYER --> */}
					{this.state.ad_closed ? null : (
						<div className='ads_wrapper'>
							<div className='close_button' onClick={this.adsClose.bind(this)}>x</div>
							<div id='div-gpt-ad-1581999069906-0' className='adsStyling'>
								<script dangerouslySetInnerHTML={{ __html: `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1581999069906-0'); });` }}></script>
							</div>
						</div>
					)}
				</div>
			);
		}

		return (
			<Layout className="live-tv-layout" title={this._metaTags().title}>
				<Head>
					<JsonLDVideo content={contentData} />
					<meta name="description" content={this._metaTags().description} />
					<meta name="keywords" content={this._metaTags().keywords} />
					<meta property="og:title" content={this._metaTags().title} />
					<meta property="og:description" content={this._metaTags().description} />
					<meta property="og:image" itemProp="image" content={this._metaTags().pathimage} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:type" content="video.tv_show" />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
          <meta property="og:image:alt" content={this._metaTags().twitter_img_alt} />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={this._metaTags().pathimage} />
					<meta name="twitter:image:alt" content={this._metaTags().twitter_img_alt} />
					<meta name="twitter:title" content={this._metaTags().title} />
					<meta name="twitter:description" content={this._metaTags().description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />

					<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
					{/* <script dangerouslySetInnerHTML={{
						__html: `
						window.googletag = window.googletag || {cmd: []};
						var i=2;
						googletag.cmd.push(function() {
							if(i===1){
								googletag.defineSlot('/21865661642/RC_MOBILE_LIVE_BELOW-PLAYER', [[468, 60]], 'div-gpt-ad-1581999069906-0').addService(googletag.pubads());
							}
							else {
								googletag.defineSlot('/21865661642/RC_MOBILE_LIVE_BELOW-PLAYER', [[320, 50]], 'div-gpt-ad-1581999069906-0').addService(googletag.pubads());
							}
							googletag.pubads().addEventListener('slotVisibilityChanged', function(event) {
								console.log(event);
							});
							googletag.pubads().enableSingleRequest();
							googletag.pubads().collapseEmptyDivs();
							googletag.enableServices();
						});
					` }}></script> */}
				</Head>
				<SelectDateModal
					open={this.state.select_modal}
					data={this.state.dates_before}
					toggle={this.toggleSelectModal.bind(this)} />

				<ActionSheet
					tabStatus= {this.state.tabStatus}
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rctiplus'])} />

				<div className="wrapper-content" style={{ padding: 0, margin: 0 }}>
					{/* {playerRef} */}
					{/* <GeoblockModal open={state.status} toggle={() => { this.setState({ status: !state.status }); }} text="Whoops, Your Location doesnt support us to live stream this content"/> */}
					<div ref={this.playerContainerRef}>
						<JwPlayer
							data={ state.data_player }
							type={ state.data_player_type }
							geoblockStatus={state.status}
							customData={{
								isLogin: this.props.user.isAuth,
								sectionPage: state.data_player_type === 'live tv' ? 'live tv' : 'catchup',
							}}
              adsOverlayData={ state.adsOverlayDuration }
							actionBtn={(e) => this.handleActionBtn(e)}
							videoIndexing={state.catchUpIndexing}
							/>
					</div>
					<div ref= {this.tvTabRef} className="tv-wrap">
						<Row>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=rcti" as="/tv/rcti">
									<Button size="sm" color="link" className={this.state.selected_index === 0 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 0)}><h1 className="heading-rplus">RCTI</h1></Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=mnctv" as="/tv/mnctv">
									<Button size="sm" color="link" className={this.state.selected_index === 1 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 1)}><h1 className="heading-rplus">MNCTV</h1></Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=gtv" as="/tv/gtv">
									<Button size="sm" color="link" className={this.state.selected_index === 2 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 2)}><h1 className="heading-rplus">GTV</h1></Button>
								</Link>
							</Col>
							<Col xs={3} className="text-center">
								<Link href="/tv?channel=inews" as="/tv/inews">
									<Button size="sm" color="link" className={this.state.selected_index === 3 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 3)}><h1 className="heading-rplus">INEWS</h1></Button>
								</Link>
							</Col>
						</Row>
					</div>
					<Nav tabs className="tab-wrap">
						<NavItem onClick={() => {
							this.setState({ selected_tab: 'live' }, () => {
								liveTvTabClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'Live', 'mweb_livetv_tab_clicked');
							});
						}} className={this.state.selected_tab === 'live' ? 'selected' : ''}>
							<NavLink><h2 className="heading-rplus">Live</h2></NavLink>
						</NavItem>
						<NavItem onClick={() => {
							this.setState({ selected_tab: 'catch_up_tv' }, () => {
								liveTvTabClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'Catch Up TV', 'mweb_livetv_tab_clicked');
							});
						}} className={this.state.selected_tab === 'catch_up_tv' ? 'selected' : ''}>
							<NavLink><h2 className="heading-rplus">Catch Up TV</h2></NavLink>
						</NavItem>
					</Nav>
					<div className="tab-content-wrap">
						<TabContent activeTab={this.state.selected_tab}>
							<TabPane tabId={'live'}>
								{this.state.epg.map((e, i) => {
									if (this.isLiveProgram(e)) {
										return (<Row key={i} className={'program-item selected'}>
											<Col xs={9}>
												<div className="title"><h3 className="heading-rplus"> {e.title} <FiberManualRecordIcon /> </h3></div>
												<div className="subtitle">{e.s} - {e.e}</div>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Live TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + e.title, BASE_URL + this.props.router.asPath, ['rctiplus', this.props.chats.channel_code],'livetv')} className="share-btn" />
											</Col>
										</Row>);
									}

									return (<Row key={i} className={'program-item'}>
										<Col xs={9}>
											<div className="title"><h3 className="heading-rplus"> {e.title} </h3></div>
											<div className="subtitle">{e.s} - {e.e}</div>
										</Col>
									</Row>);
								})}
							</TabPane>
							<TabPane tabId={'catch_up_tv'}>
								<div className="catch-up-wrapper">
									<div className="catchup-dropdown-menu">
										<Button
											onClick={this.toggleSelectModal.bind(this)} size="sm" color="link">
												{this.props.chats.catchup_date} <ExpandMoreIcon />
										</Button>
									</div>
									{this.props.chats.catchup.map(c => (
										<Row key={c.id} className={'program-item'}>
											<Col xs={9} onClick={this.selectCatchup.bind(this, c.id)}>
												<Link href={`/tv/${this.state.channel_code == 'globaltv' ? 'gtv' : this.state.channel_code}/${c.id}/${c.title.replace(/ +/g, '-').toLowerCase()}?date=${this.props.chats.catchup_date.replace(/ /gi, '-')}`}>
													<a style={{ textDecoration: 'none', color: 'white' }}>
														<div className="title"><h3 className="heading-rplus"> {c.title} </h3></div>
														<div className="subtitle">{c.s} - {c.e}</div>
													</a>
												</Link>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Catch Up TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + c.title, BASE_URL + `/tv/${this.state.channel_code}/${c.id}/${c.title.replace(/ +/g, '-').toLowerCase()}`, ['rctiplus', this.props.chats.channel_code], 'catchup')} className="share-btn" />
											</Col>
										</Row>
									))}
								</div>
							</TabPane>
						</TabContent>
					</div>
					{/* setHeightChatBox */}
					{/* <div ref={ this.chatBoxRef } className={'live-chat-wrap ' + (this.state.chat_open ? 'live-chat-wrap-open' : '')} style={this.state.chat_open ?
						(isIOS ?
							{ height: `calc(100vh - (${innerHeight()}px - 342px))` } :
							{ height: `calc(100vh - (${document.documentElement.clientHeight}px - 342px))` })
						: null}> */}
					<div ref={ this.chatBoxRef } className={'live-chat-wrap ' + (this.state.chat_open ? 'live-chat-wrap-open' : '')} style={this.state.chat_open ?
						{ height: this.setHeightChatBox() }
						: null}>
						<div className="btn-chat">
							<Button id="btn-expand" onClick={this.toggleChat.bind(this)} color="link">
								<ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" />
							</Button>
							{this.state.ads_data ? (<Toast callbackCount={this.callbackCount.bind(this)} count={this.callbackAds.bind(this)} data={this.state.ads_data.data} isAds={this.getStatusAds.bind(this)}/>) : (<div/>)}
						</div>
						{/* <div className="box-chat" style={{ height: 300 }}> */}
						<div className="box-chat">
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
											{chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span>
										</Col>
									</Row>
								))}
							</div>
							<div className="chat-input-box">
								<div ref={ this.inputChatBoxRef } className="chat-box">
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
										this.onSelectEmoji(emoji);
									}}
									showPreview={false}
									darkMode
									style={{ display: this.state.emoji_picker_open ? 'block' : 'none' }} />
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

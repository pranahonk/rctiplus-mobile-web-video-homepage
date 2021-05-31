import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import nextCookie from 'next-cookies' 
import { Picker } from 'emoji-mart';
import Img from 'react-image';
import TimeAgo from 'react-timeago';

import initialize from '../../../utils/initialize';
import { getCountdown } from '../../../utils//helpers';

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import pageActions from '../../../redux/actions/pageActions';
import chatsActions from '../../../redux/actions/chats';
import userActions from '../../../redux/actions/userActions';

import Wrench from '../../../components/Includes/Common/Wrench';
import MuteChat from '../../../components/Includes/Common/MuteChat';
import Toast from '../../../components/Includes/Common/Toast';

import { formatDate, formatDateWord, getFormattedDateBefore, formatMonthEngToID } from '../../../utils/dateHelpers';
import { showAlert, showSignInAlert } from '../../../utils/helpers';

import { Row, Col, Button, Input } from 'reactstrap';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import PauseIcon from '../../../components/Includes/Common/PauseIcon';
import ax from 'axios';

import { DEV_API} from '../../../config';

import '../../../assets/scss/components/live-tv.scss';
import 'emoji-mart/css/emoji-mart.css';

import {  liveTvShareClicked, liveTvShareCatchupClicked, liveTvLiveChatClicked, liveTvChannelClicked, liveTvCatchupSchedulePlay, liveTvCatchupScheduleClicked, getUserId, appierAdsShow, appierAdsClicked } from '../../../utils/appier';
import { stickyAdsShowing, stickyAdsClicked, initGA } from '../../../utils/firebaseTracking';
import queryString from 'query-string';

import { getCookie, getVisitorToken, checkToken } from '../../../utils/cookie';

const axios = ax.create({baseURL: DEV_API + '/api'});

axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
  return request;
});

class Tv extends React.Component {

	static async getInitialProps(ctx) {
		initialize(ctx);
		const idEpg = ctx.query.epg_id;
		let dataEpg = null;
		let q = null;
		if(idEpg) {
			const findQueryString = ctx.asPath.split(/\?/);
			if(findQueryString.length > 1) {
				q = queryString.parse(findQueryString[1]);
				if(q.date) {
					q = formatMonthEngToID(q.date)
				}
			}
			const visitorToken = nextCookie(ctx)?.VISITOR_TOKEN
			const userToken = nextCookie(ctx)?.ACCESS_TOKEN
			let token = userToken?.VALUE || visitorToken?.VALUE || ''
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
		return { context_data: ctx.query, data_epg: dataEpg, params_date: q };
	}

	constructor(props) {
		super(props);
		this.chatBoxRef = React.createRef();
		this.playerContainerRef = React.createRef();
		this.tvTabRef = React.createRef();
		this.inputChatBoxRef = React.createRef();
		const now = new Date();
		this.state = {
			chat_box: false,
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
			total_newChat : [],
			lastScroll: 0,
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
		};

		this.player = null;
		this.currentDate = now;
		this.props.setCatchupDate(formatDateWord(now));
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
	}


	componentDidMount() {
		
		initGA();
		this.props.setPageLoader();
		this.props.getLiveEvent('on air')
			.then(response => {
				this.setState({ live_events: response.data.data, meta: response.data.meta }, () => {
					this.props.unsetPageLoader();
					if (this.state.live_events.length > 0) {
						for (let i = 0; i < this.state.live_events.length; i++) {
							if (this.state.live_events[i].channel_code === this.state.channel_code) {
								this.selectChannel(i, true);
								break;
							}
						}
					}
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

    // this.refreshPubAds();

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
	setHeightChatBox() {
		// let heightPlayer = this.props.playerContainer + this.props.tvTabRef
		// return `calc(100% - ${heightPlayer}px)`;	
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

	handleScroll() {
		const chatBox = document.getElementById('chat-messages');
		if((chatBox.scrollHeight - chatBox.scrollTop) - chatBox.clientHeight <= 25){
			this.setState({ chat_box: false, total_newChat: []})
		}
		else{
			this.setState({ chat_box: true})	
		}
	}

	handleScrollToBottom  () {
		const chatBox = document.getElementById('chat-messages');
		chatBox.scrollTop = chatBox.scrollHeight;
		
		this.setState({chat_box: false, total_newChat: []})
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
												let lastChat = chats
												let newChat = change.doc.data();
												
												if ((lastChat && newChat) && (lastChat.u != newChat.u || lastChat.m != newChat.m || lastChat.i != newChat.i)) {
													if (firstLoadChat) {
														chats.unshift(newChat);
													}
													else {
														chats.push(newChat);
														this.state.total_newChat.push(newChat)
													}
												}
											}
											else {
												if (firstLoadChat) {
													chats.unshift(change.doc.data());	
												}
												else {
													chats.push(change.doc.data());
													this.state.total_newChat.push(change.doc.data())
												}
											}
											
											if(!this.state.chat_box && this.state.total_newChat.length > 0){
												const chatBox = document.getElementById('chat-messages');
												chatBox.scrollTop = chatBox.scrollHeight;
											}

											this.setState({ chats: chats }, () => {
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
		// this.props.setPageLoader();
		this.setState({ selected_index: index, error: false, chats: [], ads_data: null, isAds: false }, () => {
			setTimeout(() => {
				if (this.state.chat_open) {
					if (this.state.live_events[this.state.selected_index].id || this.state.live_events[this.state.selected_index].content_id) {
						this.getAds(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
					}
				}
			}, 100);
			let epgLoaded = false;
			let catchupLoaded = false;

			this.loadChatMessages(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
			this.statusChatBlock(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
			this.props.getLiveEventUrl(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id)
				.then(res => {
					this.setState({
						data_player: res.data.data,
						data_player_type: 'live tv',
						selected_live_event: this.state.live_events[this.state.selected_index],
						selected_live_event_url: res.data.data,
						player_url: res.data.data.url,
						player_vmap: res.data.data[process.env.VMAP_KEY],
						selected_tab: 'live',
						error: false,
						status: res.data.status && res.data.status.code === 12 ? true : false
					}, () => {
						// this.initVOD();

						this.props.getEPG(formatDate(this.currentDate), this.state.live_events[this.state.selected_index].channel_code)
							.then(response => {
								epgLoaded = true;
								let epg = response.data.data.filter(e => e.e < e.s || this.currentDate.getTime() < new Date(formatDate(this.currentDate) + 'T' + e.e).getTime());
								this.setState({ epg: epg }, () => {
									if (first != true) {
										let programLive = this.getCurrentLiveEpg();
										liveTvChannelClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, programLive ? programLive.title : 'N/A', 'mweb_livetv_channel_clicked');
									}

									// if (!this.props.context_data.epg_id) {
									// 	// this.initPlayer();
									// }
									else if (first === true && this.props.context_data?.epg_id) {
										this.selectCatchup(this.props.context_data.epg_id, 'url');
									}
									this.props.setChannelCode(this.state.selected_live_event.channel_code);
									this.props.setCatchupDate(formatDateWord(this.currentDate));
									if (epgLoaded && catchupLoaded) {
										this.props.unsetPageLoader();
									}
								});
							})
							.catch(error => {
								epgLoaded = true;
								console.log(error);
								if (first != true) {
									liveTvChannelClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'N/A', 'mweb_livetv_channel_clicked');
								}

								if (!this.props.context_data.epg_id) {
									// this.initPlayer();
								}
								else if (first === true && this.props.context_data.epg_id) {
									this.selectCatchup(this.props.context_data.epg_id, 'url');
								}
								this.props.setChannelCode(this.state.selected_live_event.channel_code);
								this.props.setCatchupDate(formatDateWord(this.currentDate));
								if (epgLoaded && catchupLoaded) {
									this.props.unsetPageLoader();
								}
							});
					});
				})
				.catch(error => {
					epgLoaded = true;
					console.log(error);
					this.setState({
						error: true,
						first_init_player: true,
						error_data: error.status === 200 ? error.data.status.message_client : '',
						status: error.data && error.data.status.code  === 12 ? true : false,
					});
					this.props.unsetPageLoader();
				});



			this.props.getEPG(formatDate(new Date(this.state.selected_date)), this.state.live_events[this.state.selected_index].channel_code)
				.then(response => {
					catchupLoaded = true;
					let catchup = response.data.data.filter(e => {
						if (e.s > e.e) {
							return this.currentDate.getTime() > new Date(new Date(this.state.selected_date + ' ' + e.e).getTime() + (1 * 24 * 60 * 60 * 1000)).getTime();
						}
						return this.currentDate.getTime() > new Date(this.state.selected_date + ' ' + e.e).getTime();
					});
					this.setState({ catchup: catchup }, () => {
						this.props.setCatchupData(catchup);
						if (epgLoaded && catchupLoaded) {
							this.props.unsetPageLoader();
						}
					});
				})
				.catch(error => {
					catchupLoaded = true;
					console.log(error);
					if (epgLoaded && catchupLoaded) {
						this.props.unsetPageLoader();
					}
				});
		});


	}

	selectCatchup(id, ref = false) {
		// this.props.setPageLoader();
		if (!ref) {
			liveTvCatchupScheduleClicked(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_catchup_schedule_clicked');
		}
		else {
			this.setState({ selected_tab: 'catch_up_tv' });
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
		if (!this.state.user_data) {
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
		if (this.state.user_data) {
			if (this.state.chat != '') {
				this.statusChatBlock(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
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

					this.props.setChat(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, newChat.m, user, this.state.user_data.photo_url)
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
			const userData = this.state.user_data;
			let user = userData.nickname ? userData.nickname :
				userData.display_name ? userData.display_name :
					userData.email ? userData.email.replace(/\d{4}$/, '****') :
						userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
			this.props.setChat(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, lastChat.m, user, this.state.user_data.photo_url)
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
		}
	}
    
	render() {
		const { props, state } = this
		// const contentData = {
		// 	asPath: props.router.asPath,
		// 	title: props.context_data?.epg_title || props.context_data?.channel,
		// 	thumbnailUrl: SITEMAP[`live_tv_${this.state.channel_code?.toLowerCase()}`]?.image
		// }
		console.log(`ini chats props`, this.props.dataChats)
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
			
			<div ref={ this.chatBoxRef } className={'live-chat-wrap ' + (this.state.chat_open ? 'live-chat-wrap-open' : '')} style={this.state.chat_open ? { height: this.props.handleHeightChat() } : null}>
				<div className="btn-chat">
					<Button className="shadow-none" id="btn-expand" onClick={this.toggleChat.bind(this)} color="link">
					    <ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" />
					</Button>
					{this.state.ads_data ? (<Toast callbackCount={this.callbackCount.bind(this)} count={this.callbackAds.bind(this)} data={this.state.ads_data.data} isAds={this.getStatusAds.bind(this)}/>) : (<div/>)}
				</div>
					
				<div onScroll={this.handleScroll.bind(this)}  className="box-chat">
					<div className="wrap-live-chat__block" style={this.state.block_user.status ? { display: 'flex' } : { display: 'none' }}>
						<div className="block_chat" style={this.state.chat_open ? { display: 'block' } : { display: 'none' }}>
							<div>
							    <MuteChat className="icon-block__chat" />
								<p>Sorry, you cannot send the message</p>
								<span>{this.state.block_user.message}</span>
							</div>
						</div>
					</div>

					<div  className="chat-messages" id="chat-messages">
						{this.props.dataChats.map((chat, i) => (
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

						{this.state.chat_open && this.state.chat_box && this.state.total_newChat.length > 0 &&  <div onClick={this.handleScrollToBottom.bind(this)} style={{width: "36px", height: "36px", borderRadius: "50px", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "105px", right: "10px"}}> {this.state.total_newChat.length} </div>}
						{this.state.chat_open && this.state.chat_box &&  <div onClick={this.handleScrollToBottom.bind(this)} style={{width: "36px", height: "36px", borderRadius: "50px", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "65px", right: "10px"}}> <ExpandMoreIcon /> </div>}
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
			
		);
	}
}

export default connect(state => state, {
	...liveAndChatActions,
	...pageActions,
	...chatsActions,
	...userActions
})(withRouter(Tv));

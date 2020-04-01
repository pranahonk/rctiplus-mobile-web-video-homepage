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
import MuteChat from '../components/Includes/Common/MuteChat';

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
import { isIOS } from 'react-device-detect';

import { BASE_URL, SITEMAP } from '../config';

import '../assets/scss/components/live-tv.scss';
import 'emoji-mart/css/emoji-mart.css';

import { liveTvTabClicked, liveTvShareClicked, liveTvShareCatchupClicked, liveTvLiveChatClicked, liveTvChannelClicked, liveTvCatchupSchedulePlay, liveTvCatchupScheduleClicked, getUserId } from '../utils/appier';
import { convivaVideoJs } from '../utils/conviva';

import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'video.js/src/css/video-js.scss';

const innerHeight = require('ios-inner-height');

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
			channel_code: this.props.context_data ? (this.props.context_data.channel === 'gtv' ? 'globaltv' : this.props.context_data.channel) : 'rcti',
			error: false,
			error_data: {},
			emoji_picker_open: false,
			chats: [],
			chat: '',
			user_data: null,
			snapshots: [],
			sending_chat: false,
			block_user: {
				status: false,
				message: '',
			},
			ad_closed: true,
			first_init_player: true
		};

		this.player = null;
		this.currentDate = now;
		this.props.setCatchupDate(formatDateWord(now));
		this.props.setPageLoader();
		this.pubAdsRefreshInterval = null;
		this.videoNode = null;
		this.convivaTracker = null;
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.dispose();
		}
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

		this.refreshPubAds();
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

	initVOD() {
		if (this.player) {
			this.player.remove();
		}
		const playerId = 'live-tv-player';

		this.player = window.jwplayer(playerId);
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
				schedule: this.state.player_vmap
			},
			logo: {
				hide: true
			}
		});

		// this.player.on('adImpression', () => {
		// 	this.setState({ ad_closed: true });
		// });

		// this.player.on('adComplete', () => {
		// 	this.setState({ ad_closed: false }, () => {
		// 		window.googletag = window.googletag || { cmd: [] };
		// 		googletag.cmd.push(function () {
		// 			googletag.defineSlot('/21865661642/RC_MOBILE_LIVE_BELOW-PLAYER', [[468, 60], [320, 50]], 'div-gpt-ad-1581999069906-0').addService(googletag.pubads());
		// 			googletag.pubads().enableSingleRequest();
		// 			googletag.pubads().collapseEmptyDivs();
		// 			googletag.enableServices();
		// 		});
		// 	});
		// });

		const self = this;
		this.player.on('ready', function () {
			const assetName = self.state.selected_live_event.channel_code.toLowerCase() === 'globaltv' ? 'gtv' : self.state.selected_live_event.channel_code;
			switch (self.state.selected_tab) {
				case 'live':
					const currentEpg = self.getCurrentLiveEpg();
					if (currentEpg != null) {
						conviva.startMonitoring(this);
						const assetMetadata = {
							viewer_id: getUserId(),
							application_name: 'RCTI+ MWEB',
							asset_cdn: 'Conversant',
							version: process.env.VERSION,
							start_session: 0,
							playerVersion: process.env.PLAYER_VERSION,
							tv_id: self.state.selected_live_event.id,
							tv_name: assetName.toUpperCase(),
							content_id: currentEpg.id,
							asset_name: assetName.toUpperCase()
						};
						console.log('FIRST FRAME CONVIVA', assetMetadata);
						conviva.updatePlayerAssetMetadata(this, assetMetadata);
					}
					break;

				case 'catch_up_tv':
					conviva.startMonitoring(this);
					const assetMetadata = {
						viewer_id: getUserId(),
						application_name: 'RCTI+ MWEB',
						asset_cdn: 'Conversant',
						version: process.env.VERSION,
						start_session: 0,
						playerVersion: process.env.PLAYER_VERSION,
						tv_id: self.state.selected_live_event.id,
						tv_name: assetName.toUpperCase(),
						content_id: currentEpg.id,
						asset_name: assetName.toUpperCase()
					};
					console.log('FIRST FRAME CONVIVA', assetMetadata);
					conviva.updatePlayerAssetMetadata(this, assetMetadata);
					break;
			}

			if (isIOS) {
				let elementJwplayerInit = document.querySelector(`#${playerId} > .jw-wrapper`);
				let elementCreateWrapper = document.createElement('btn');
				let elementMuteIcon = document.createElement('span');
				elementCreateWrapper.classList.add('jwplayer-vol-off');
				elementCreateWrapper.innerText = 'Tap to unmute ';

				jwplayer().setMute(true);
				elementJwplayerInit.appendChild(elementCreateWrapper);
				elementCreateWrapper.appendChild(elementMuteIcon);
				elementCreateWrapper.addEventListener('click', () => {
					if (elementCreateWrapper === null) {
						jwplayer().setMute(true);
						elementJwplayer[0].classList.add('jwplayer-mute');
						elementJwplayer[0].classList.remove('jwplayer-full');
					}
					else {
						jwplayer().setMute(false);
						elementCreateWrapper.classList.add('jwplayer-full');
						elementCreateWrapper.classList.remove('jwplayer-mute');
					}
				});
			}
		});

		this.player.on('mute', function () {
			let elementJwplayer = document.getElementsByClassName('jwplayer-vol-off');
			if (elementJwplayer[0] !== undefined) {
				if (jwplayer().getMute()) {
					elementJwplayer[0].classList.add('jwplayer-mute');
					elementJwplayer[0].classList.remove('jwplayer-full');
				} else {
					elementJwplayer[0].classList.add('jwplayer-full');
					elementJwplayer[0].classList.remove('jwplayer-mute');
				}
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
				screen.orientation.lock("landscape-primary");
			}
			if (screen.orientation.type === 'landscape-primary') {
				document.querySelector("#live-tv-player").requestFullscreen();
				screen.orientation.lock("portrait-primary");
			}
		});

		this.player.on('play', function () {
			if (self.state.selected_tab === 'catch_up_tv') {
				if (self.state.selected_catchup) {
					liveTvCatchupSchedulePlay(self.state.selected_date, self.state.live_events[self.state.selected_index].id, self.state.live_events[self.state.selected_index].name, self.state.selected_catchup.title, 'mweb_livetv_catchup_schedule_play');
				}
			}
		});
	}

	initPlayer() {
		if (this.videoNode) {
			const assetName = this.state.selected_live_event.channel_code.toLowerCase() === 'globaltv' ? 'gtv' : this.state.selected_live_event.channel_code;
			if (this.state.first_init_player) {
				const self = this;
				this.player = videojs(this.videoNode, {
					autoplay: true,
					controls: true,
					// muted: true,
					sources: [{
						src: this.state.player_url,
						type: 'application/x-mpegURL'
					}]
				}, function onPlayerReady() {
					console.log('onPlayerReady', this);
					const player = this;
					switch (self.state.selected_tab) {
						case 'live':
							const currentEpg = self.getCurrentLiveEpg();
							if (currentEpg != null) {
								this.convivaTracker = convivaVideoJs(assetName, player, true, self.state.player_url, 'Live TV ' + assetName.toUpperCase(), {
									asset_name: assetName.toUpperCase(),
									application_name: 'RCTI+ MWEB',
									asset_cdn: 'Conversant',
									version: process.env.VERSION,
									start_session: '0',
									player_version: process.env.PLAYER_VERSION,
									tv_id: self.state.selected_live_event.id.toString(),
									tv_name: assetName.toUpperCase(),
									content_id: currentEpg.id.toString()
								});
								this.convivaTracker.createSession();
							}

							break;

						case 'catch_up_tv':
							this.convivaTracker = convivaVideoJs(assetName, player, player.duration(), self.state.player_url, 'Catch Up TV ' + assetName.toUpperCase(), {
								asset_name: assetName.toUpperCase(),
								application_name: 'RCTI+ MWEB',
								asset_cdn: 'Conversant',
								version: process.env.VERSION,
								start_session: '0',
								player_version: process.env.PLAYER_VERSION,
								tv_id: self.state.selected_live_event.id.toString(),
								tv_name: assetName.toUpperCase(),
								content_id: self.state.selected_catchup.id.toString()
							});
							this.convivaTracker.createSession();
							break;
					}

				});

				this.player.on('error', () => {
					this.setState({
						error: true,
						first_init_player: false
					});
				});
				this.player.ima({ adTagUrl: this.state.player_vmap });
				this.player.ima.initializeAdDisplayContainer();
			}
			else {
				this.player.src(this.state.player_url);
				this.player.ima.changeAdTag(this.state.player_vmap);
				this.player.ima.initializeAdDisplayContainer();
				this.player.ima.requestAds();

				switch (this.state.selected_tab) {
					case 'live':
						const currentEpg = this.getCurrentLiveEpg();
						if (currentEpg != null) {
							this.convivaTracker = convivaVideoJs(assetName, this.player, true, this.state.player_url, 'Live TV ' + assetName.toUpperCase(), {
								asset_name: assetName.toUpperCase(),
								application_name: 'RCTI+ MWEB',
								asset_cdn: 'Conversant',
								version: process.env.VERSION,
								start_session: '0',
								player_version: process.env.PLAYER_VERSION,
								tv_id: this.state.selected_live_event.id.toString(),
								tv_name: assetName.toUpperCase(),
								content_id: currentEpg.id.toString()
							});
							this.convivaTracker.createSession();
						}

						break;

					case 'catch_up_tv':
						this.convivaTracker = convivaVideoJs(assetName, this.player, this.player.duration(), this.state.player_url, 'Catch Up TV ' + assetName.toUpperCase(), {
							asset_name: assetName.toUpperCase(),
							application_name: 'RCTI+ MWEB',
							asset_cdn: 'Conversant',
							version: process.env.VERSION,
							start_session: '0',
							player_version: process.env.PLAYER_VERSION,
							tv_id: this.state.selected_live_event.id.toString(),
							tv_name: assetName.toUpperCase(),
							content_id: this.state.selected_catchup.id.toString()
						});
						this.convivaTracker.createSession();
						break;
				}
			}


			this.setState({ first_init_player: false });
		}
	}

	loadChatMessages(id) {
		this.props.setPageLoader();
		this.setState({ chats: [] }, () => {
			const chatBox = document.getElementById('chat-messages');
			chatBox.scrollTop = chatBox.scrollHeight;
			this.props.unsetPageLoader();
			if (true) {
				let firstLoadChat = true;
				this.props.listenChatMessages(this.state.live_events[this.state.selected_index].id)
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
		this.props.setPageLoader();
		this.setState({ selected_index: index, error: false, chats: [] }, () => {
			this.loadChatMessages(this.state.live_events[this.state.selected_index].id);
			this.statusChatBlock(this.state.live_events[this.state.selected_index].id);
			this.props.getLiveEventUrl(this.state.live_events[this.state.selected_index].id)
				.then(res => {
					this.setState({
						selected_live_event: this.state.live_events[this.state.selected_index],
						selected_live_event_url: res.data.data,
						player_url: res.data.data.url,
						player_vmap: res.data.data[process.env.VMAP_KEY],
						selected_tab: 'live'
					}, () => {
						// this.initVOD();
						this.initPlayer();
						this.props.setChannelCode(this.state.selected_live_event.channel_code);
						this.props.setCatchupDate(formatDateWord(this.currentDate));
						this.props.unsetPageLoader();
					});
				})
				.catch(error => {
					console.log(error);
					this.setState({
						error: true,
						first_init_player: true,
						error_data: error.status === 200 ? error.data.status.message_client : ''
					});
					this.props.unsetPageLoader();
				});

			this.props.getEPG(formatDate(this.currentDate), this.state.live_events[this.state.selected_index].channel_code)
				.then(response => {
					let epg = response.data.data.filter(e => e.e < e.s || this.currentDate.getTime() < new Date(formatDate(this.currentDate) + 'T' + e.e).getTime());
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

			if (first === true && this.props.context_data.epg_id) {
				this.selectCatchup(this.props.context_data.epg_id, 'url');
			}
		});


	}

	selectCatchup(id, ref = false) {
		this.props.setPageLoader();
		if (!ref) {
			liveTvCatchupScheduleClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_catchup_schedule_clicked');
		}
		else {
			this.setState({ selected_tab: 'catch_up_tv' });
		}

		this.props.getCatchupUrl(id)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({
						player_url: response.data.data.url,
						player_vmap: response.data.data[process.env.VMAP_KEY],
						selected_catchup: response.data.data,
						error: false
						// }, () => this.initVOD());
					}, () => this.initPlayer());
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
						liveTvShareCatchupClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'N/A', 'mweb_livetv_share_catchup_clicked');
						break;
				}
			}
		});
	}

	toggleChat() {
		if (this.checkLogin()) {
			this.setState({ chat_open: !this.state.chat_open }, () => {
				this.props.toggleFooter(this.state.chat_open);
				if (this.state.chat_open) {
					liveTvLiveChatClicked(this.state.live_events[this.state.selected_index].id, this.state.live_events[this.state.selected_index].name, 'mweb_livetv_livechat_clicked');
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
			this.initPlayer();
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
				<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
			return false;
		}
		return true;
	}

	sendChat() {
		if (this.state.user_data) {
			if (this.state.chat != '') {
				this.statusChatBlock(this.state.live_events[this.state.selected_index].id);
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
			playerRef = (
				<div>
					{/* <div style={{ minHeight: 180 }} id="live-tv-player"></div> */}
					<div data-vjs-player>
						<video
							playsInline
							style={{
								minHeight: 180,
								width: '100%'
							}}
							ref={node => this.videoNode = node}
							className="video-js vjs-default-skin vjs-big-play-centered"></video>
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
			<Layout className="live-tv-layout" title={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].title}>
				<Head>
					<meta name="description" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].description} />
					<meta name="keywords" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].keywords} />

					<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
					<script dangerouslySetInnerHTML={{
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
								<Link href="/tv?channel=gtv" as="/tv/gtv">
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
								{this.state.epg.map((e, i) => {
									if (this.isLiveProgram(e)) {
										return (<Row key={i} className={'program-item selected'}>
											<Col xs={9}>
												<div className="title">{e.title} <FiberManualRecordIcon /></div>
												<div className="subtitle">{e.s} - {e.e}</div>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Live TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + e.title, BASE_URL + this.props.router.asPath, ['rctiplus', this.props.chats.channel_code])} className="share-btn" />
											</Col>
										</Row>);
									}

									return (<Row key={i} className={'program-item'}>
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
										<Row key={c.id} className={'program-item'}>
											<Col xs={9} onClick={this.selectCatchup.bind(this, c.id)}>
												<Link href={`/tv?channel=${this.state.channel_code}&id=${c.id}&title=${c.title}`} as={`/tv/${this.state.channel_code}/${c.id}/${c.title.replace(/ +/g, '-').toLowerCase()}`}>
													<a style={{ textDecoration: 'none', color: 'white' }}>
														<div className="title">{c.title}</div>
														<div className="subtitle">{c.s} - {c.e}</div>
													</a>
												</Link>
											</Col>
											<Col className="right-side">
												<ShareIcon onClick={this.toggleActionSheet.bind(this, 'Catch Up TV - ' + this.props.chats.channel_code.toUpperCase() + ': ' + c.title, BASE_URL + `/tv/${this.state.channel_code}/${c.id}/${c.title.replace(/ +/g, '-').toLowerCase()}`, ['rctiplus', this.props.chats.channel_code])} className="share-btn" />
											</Col>
										</Row>
									))}
								</div>
							</TabPane>
						</TabContent>
					</div>
					<div className={'live-chat-wrap ' + (this.state.chat_open ? 'live-chat-wrap-open' : '')} style={this.state.chat_open ?
						(isIOS ?
							{ height: `calc(100vh - (${innerHeight()}px - 342px))` } :
							{ height: `calc(100vh - (${document.documentElement.clientHeight}px - 342px))` })
						: null}>
						<Button onClick={this.toggleChat.bind(this)} color="link"><ExpandLessIcon className="expand-icon" /> Live Chat <FiberManualRecordIcon className="indicator-dot" /></Button>
						<div className="box-chat" style={{ height: 300 }}>
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
})(withRouter(Tv));

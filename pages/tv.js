import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import initialize from '../utils/initialize';

import liveAndChatActions from '../redux/actions/liveAndChatActions';
import pageActions from '../redux/actions/pageActions';

import Layout from '../components/Layouts/Default';
import SelectDateModal from '../components/Modals/SelectDateModal';
import ActionSheet from '../components/Modals/ActionSheet';
import Wrench from '../components/Includes/Common/Wrench';

import { formatDate, formatDateWord, getFormattedDateBefore } from '../utils/dateHelpers';
import { showAlert } from '../utils/helpers';

import { Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import { BASE_URL, SITEMAP } from '../config';

import '../assets/scss/components/live-tv.scss';

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
			error_data: {}
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
								this.selectChannel(i);
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
				client: 'vast',
				tag: this.state.player_vmap
			},
			logo: {
				hide: true
			}
		});
		this.player.on('setupError', error => {
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('error', error => {
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
				// id: 51029
				// url: "https://catchup.rctiplus.id/rctiplus/rctiplus/rcti/20200124/51029/1579804200423/manifest.m3u8"
				// geoblock: "no"
				// title: "Seputar iNews Malam (L)"
				// channel: "rcti"
				// vmap: "https://rc-static.rctiplus.id/vmap/vmap_catchup_0_web_defaultcatchup.xml"
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
				}
			}
		});
	}

	selectChannel(index) {
		this.props.setPageLoader();
		this.setState({ selected_index: index }, () => {
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
						this.props.getEPG(formatDate(this.currentDate), this.state.selected_live_event.channel_code)
							.then(response => {
								let epg = response.data.data.filter(e => e.e < e.s || this.currentDate.getTime() < new Date(formatDate(this.currentDate) + ' ' + e.e).getTime());
								this.setState({ epg: epg }, () => this.props.unsetPageLoader());
							})
							.catch(error => {
								console.log(error);
								this.props.unsetPageLoader();
							});

						this.props.getEPG(formatDate(new Date(this.state.selected_date)), this.state.selected_live_event.channel_code)
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
				})
				.catch(error => {
					console.log(error);
					this.props.unsetPageLoader();
				});
		});
	}

	selectCatchup(id) {
		this.props.setPageLoader();
		this.props.getCatchupUrl(id)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({
						player_url: response.data.data.url,
						player_vmap: response.data.data.vmap,
						selected_catchup: response.data.data
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
		});
	}

	toggleChat() {
		this.setState({ chat_open: !this.state.chat_open });
	}

	tryAgain() {
		this.setState({ error: false }, () => {
            this.initVOD();
        });
	}

	render() {
		let playerRef = (<div style={{ minHeight: 180 }} id="live-tv-player"></div>);
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
						{/* <Button onClick={this.tryAgain.bind(this)} className="btn-next" style={{ width: '50%' }}>Coba Lagi</Button> */}
					</h5>
				</div>
			);
		}

		return (
			<Layout className="live-tv-layout" title={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].title}>
				<Head>
					<meta name="description" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].description}/>
					<meta name="keywords" content={SITEMAP[`live_tv_${this.state.channel_code.toLowerCase()}`].keywords}/>
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
						<NavItem onClick={() => this.setState({ selected_tab: 'live' })} className={this.state.selected_tab === 'live' ? 'selected' : ''}>
							<NavLink>Live</NavLink>
						</NavItem>
						<NavItem onClick={() => this.setState({ selected_tab: 'catch_up_tv' })} className={this.state.selected_tab === 'catch_up_tv' ? 'selected' : ''}>
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
						<div className="box-chat"></div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...liveAndChatActions,
	...pageActions
})(withRouter(Tv));

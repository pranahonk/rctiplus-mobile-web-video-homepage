import React from 'react';
import Router, { withRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { connect } from 'react-redux';

import contentActions from '../redux/actions/contentActions';
import feedActions from '../redux/actions/feedActions';
import pageActions from '../redux/actions/pageActions';

import initialize from '../utils/initialize';
import TimeAgo from 'react-timeago';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import classnames from 'classnames';
import { Carousel } from 'react-responsive-carousel';

import Layout from '../components/Layouts/Default_v2';

import NavDefault from '../components/Includes/Navbar/NavDefault';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';

import PlayerModal from '../components/Modals';
import ActionSheet from '../components/Modals/ActionSheet';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import ShareIcon from '@material-ui/icons/Share';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import '../assets/scss/components/exclusive.scss';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../config';

import { exclusiveGeneralEvent, exclusiveTabEvent, exclusiveContentEvent, exclusiveShareEvent, exclusiveProfileProgramEvent, exclusiveTitleProgramEvent, exclusivePhotoSlideNextEvent, exclusivePhotoSlidePreviousEvent } from '../utils/appier';

class Exclusive extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
		
		return { category: ctx.query.category };
	}

	constructor(props) {
		super(props);
		this.state = {
			active_tab: 1,
			active_tab_name: 'All',
			contents: [],
			meta: null,
			categories: [],
			feeds: {},
			feed_states: {},
			categorical_feeds: {},
			resolution: 393,
			modal: false,
			trailer_url: '',
			action_sheet: false,
			caption: '',
			url: '',
			hashtags: [],
			category: this.props.category,
			selected_program: null,
			pathExlusive: '',
			vmap: '',
			status: false,
			data: null
		};

		this.player = null;
		this.LoadingBar = null;
		this.props.setPageLoader();
		this.swipe = {};
		this.direction = null;
	}

	componentDidMount() {
		this.props.getExclusiveCategory()
			.then(response => {
				const dictFeeds = {};
				
				let selectedCategory = this.props.category ? this.props.category : 'All';
				// replace hyphens with spaces and capitalize the first letter of each word 
				selectedCategory = selectedCategory.replace(/\w\S*/g, function(txt){
					txt = txt.replace(/-+/g, ' ');
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});

				let selectedIndex = -1;

				const categories = [{ name: 'All' }];
				categories.push.apply(categories, response.data.data);
				for (let i = 0; i < categories.length; i++) {
					dictFeeds[categories[i].name] = [];
					if (selectedCategory.toLowerCase() == categories[i].name.toLowerCase()) {
						selectedIndex = i;
					}
				}

				this.setState({ categories: categories }, () => {
					this.props.getExclusives()
						.then(response => {
							const categoricalFeeds = {};
							const feeds = response.data.data;
							for (let i = 0; i < feeds.length; i++) {
								if (feeds[i].type in categoricalFeeds) {
									categoricalFeeds[feeds[i].type].push(feeds[i]);
								}
								else {
									categoricalFeeds[feeds[i].type] = [feeds[i]];
								}
							}

							const dictFeeds = this.state.feeds;
							dictFeeds['All'] = feeds;

							const dictFeedStates = this.state.feed_states;
							dictFeedStates['All'] = response.data.meta;

							this.setState({
								feeds: dictFeeds,
								feed_states: dictFeedStates,
								meta: this.props.feeds.meta
							}, () => {
								if (selectedCategory != 'All') {
									this.toggleTab(selectedIndex + 1, selectedCategory);
								}
								else {
									this.props.unsetPageLoader();
								}
							});
						})
						.catch(error => {
							console.log(error);
							this.props.unsetPageLoader();
						});
				});
			})
			.catch(error => {
				console.log(error)
				this.props.unsetPageLoader();
			});
	}

	onTouchStart(e) {
		const touch = e.touches[0];
		this.swipe = { y: touch.clientY };
	}

	onTouchEnd(e) {
		const touch = e.changedTouches[0];
		const absY = Math.abs(touch.clientY - this.swipe.y);
		if (absY > 50) {
			exclusiveGeneralEvent('mweb_exclusive_scroll_vertical');
		}
	}

	onTouchStartHorizontal(e) {
		const touch = e.touches[0];
		this.swipe = { x: touch.clientX };
	}

	onTouchEndHorizontal(e, program) {
		const touch = e.changedTouches[0];
		const absX = Math.abs(touch.clientX - this.swipe.x);
		if (absX > 50) {
			console.log('prev');
		}
		else {
			console.log('next');
		}
	}

	bottomScrollFetch(tab) {
		if (tab && this.state.feed_states[tab.name]) {
			this.LoadingBar.continuousStart();
			this.props.getExclusives(tab.name, this.state.feed_states[tab.name].pagination.current_page + 1)
				.then(response => {
					const feeds = response.data.data;
					const dictFeeds = this.state.feeds;
					dictFeeds[tab.name].push.apply(dictFeeds[tab.name], feeds);

					const dictFeedStates = this.state.feed_states;
					dictFeedStates[tab.name] = response.data.meta;

					this.setState({
						feeds: dictFeeds,
						feed_states: dictFeedStates,
						meta: this.props.feeds.meta
					});
					this.LoadingBar.complete();
				})
				.catch(error => {
					this.LoadingBar.complete();
					console.log(error);
				});
		}
	}

	toggleTab(tab, tabName = 'All') {
		if (this.state.active_tab !== tab) {
			exclusiveTabEvent(tabName, 'mweb_exclusive_tab_clicked');
			this.setState({ 
				active_tab: tab,
				active_tab_name: tabName
			}, () => {
				if (!this.state.feed_states[tabName]) {
					this.props.setPageLoader();
					this.props.getExclusives(tabName)
						.then(response => {
							const feeds = response.data.data;
							const dictFeeds = this.state.feeds;
							dictFeeds[tabName] = feeds;

							const dictFeedStates = this.state.feed_states;
							dictFeedStates[tabName] = response.data.meta;

							console.log(feeds);
							this.setState({
								feeds: dictFeeds,
								feed_states: dictFeedStates,
								meta: this.props.feeds.meta
							}, () => this.props.unsetPageLoader());
						})
						.catch(error => {
							console.log(error);
							this.props.unsetPageLoader();
						});
				}
			});
		}
	}

	async toggle(program = null, video_url = '') {
		if (program) {
			exclusiveContentEvent(program.type, program.id, program.title, program.program_title, program.genre, this.state.meta.image_path + this.state.resolution + program.portrait_image, this.state.meta.image_path + this.state.resolution + program.landscape_image, 'mweb_exclusive_content_clicked');

			let data = null;
			let status = false;
			try {
				switch (program.type) {
					case 'episode':
						data = await this.props.getEpisodeUrl(program.id);
						break;
	
					case 'extra':
						data = await this.props.getExtraUrl(program.id);
						break;
	
					case 'clip':
						data = await this.props.getClipUrl(program.id);
						break;
	
					case 'photo':
						data = await this.props.getPhotoUrl(program.id);
						break;
				}
			}
			catch (e) {
				console.log(e);
				if (e.data && e.data.status) {
					status = e.data.status;
				}
			}			

			let vmap = '';
			
			if (data && data.status === 200 && data.data.status.code === 0) {
				video_url = data.data.data.url;
				vmap = data.data.data[process.env.VMAP_KEY];
			}

			this.setState({ 
				modal: !this.state.modal,
				trailer_url: video_url,
				vmap: vmap, 
				selected_program: program ,
				status: status,
				data: data
			});
		}
	}

	toggleActionSheet(program = null, caption = '', url = '', hashtags = []) {
		if (program) {
			switch (program.type) {
				case 'photo':
					exclusiveShareEvent(program.program_id, program.program_title, program.title, program.type, 'N/A', this.state.active_tab_name, program.id, this.state.meta.image_path + this.state.resolution + program.list_image, url, 'mweb_exclusive_share_clicked');
					break;

				default:
					exclusiveShareEvent(program.program_id, program.program_title, program.title, program.type, program.id, this.state.active_tab_name, 'N/A', 'N/A', url, 'mweb_exclusive_share_clicked');
					break;
			}
		}

		this.setState({
			pathExlusive: program.title.replace(/\s+/g,''),
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags,
		});
	}

	goToDetail(program, type = '') {
		switch (type) {
			case 'profile':
				exclusiveProfileProgramEvent(program.id, program.title, this.state.active_tab_name, 'mweb_exclusive_profile_program_clicked');
				break;

			case 'title':
				exclusiveTitleProgramEvent(program.id, program.title, this.state.active_tab_name, 'mweb_exclusive_title_program_clicked');
				break;
		}
		Router.push(`/programs/${program.program_id}/${program.title.replace(/ +/g, '-').toLowerCase()}?ref=exclusive`);
	}

	getImageFileName(url) {
		const segments = url.split('/');
		if (segments.length <= 0) {
			return '';
		}

		let filename = segments[segments.length - 1];
		return filename.split('.').slice(0, -1).join('.');
	}

	render() {
		return (
			<Layout title={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].title}>
				<Head>
					<meta name="description" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].description}/>
					<meta name="keywords" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].keywords}/>
					<meta property="og:title" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].title} />
					<meta property="og:description" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].description} />
					<meta property="og:image" itemProp="image" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].image} />
					<meta name="twitter:image:alt" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].title} />
					<meta name="twitter:title" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].title} />
					<meta name="twitter:description" content={SITEMAP[`exclusive_${this.props.category ? this.props.category.replace(/ |-+/g, '_').toLowerCase() : 'all'}`].description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				{process.env.UI_VERSION == '2.0' ? (<NavDefault_v2 disableScrollListener />) : (<NavDefault disableScrollListener />)}

				<LoadingBar
					progress={0}
					height={3}
					color='#fff'
					onRef={ref => (this.LoadingBar = ref)} />

				<BottomScrollListener
					offset={20}
					onBottom={this.bottomScrollFetch.bind(this, this.state.categories[this.state.active_tab - 1])} />

				<PlayerModal
					open={this.state.modal}
					program={this.state.selected_program}
					toggle={this.toggle.bind(this)}
					onReady={() => this.player = window.jwplayer('example-id')}
					playerId="example-id"
					player={this.player}
					vmap={this.state.vmap}
					meta={this.state.meta}
					status={this.state.status}
					data={this.state.data}
					videoUrl={this.state.trailer_url} />

				<ActionSheet
					caption={this.state.caption}
					path={this.state.pathExlusive}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, null, '', '', ['rcti'])} />

				<div className="nav-exclusive-wrapper" onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}>
					<Nav tabs id="exclusive">

						{this.state.categories.map((c, i) => (
							<NavItem key={i} className="exclusive-item">
								<Link href={`/exclusive?category=${c.name.toLowerCase()}`} as={`/exclusive/${c.name.toLowerCase()}?ref=exclusive`}> 
									<NavLink
										onClick={this.toggleTab.bind(this, i + 1, c.name)}
										className={classnames({ active: this.state.active_tab == i + 1 })}>{c.name}</NavLink>
								</Link>
							</NavItem>
						))}

					</Nav>
					<TabContent className="container-box container-box-exclusive" activeTab={this.state.active_tab}>
						{this.state.categories.map((c, i) => (
							<TabPane key={i} tabId={i + 1}>
									<div className="content-tab-exclusive">
										<div className="program-container">
											{this.state.feeds[c.name] && this.state.feeds[c.name].map((feed, idx) => (
												<Row key={feed.id} className={'program-item row-edit ' + (idx % 2 == 0 ? 'row-striped' : '')}>
													<Col className="col-edit">
														<Row className="feed-row">
															<Col xs="2">
																<Img 
																	onClick={this.goToDetail.bind(this, feed, 'profile')}
																	alt={feed.program_title}
																	unloader={<img className="program-rounded-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}
																	loader={<img className="program-rounded-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>} 
																	className="program-rounded-thumbnail" 
																	src={[this.state.meta.image_path + this.state.resolution + feed.program_icon, '/static/placeholders/placeholder_landscape.png']} />
															</Col>
															<Col xs="7">
																<div onClick={this.goToDetail.bind(this, feed, 'title')} className="program-label">
																	<h2 className="program-title">
																		{feed.title.substring(0, 30) + (feed.title.length > 30 ? '...' : '')}
																	</h2>
																	<TimeAgo className="program-subtitle" date={Date.now() - feed.created_at} />
																</div>
															</Col>
															<Col className="program-share-button">
																<ShareIcon onClick={this.toggleActionSheet.bind(this, feed, feed.title, feed.share_link, ['rcti'])} className="program-label-share-btn" />
															</Col>
														</Row>
														{feed.type == 'photo' ?
															(<Carousel
																autoPlay
																statusFormatter={(current, total) => `${current}/${total}`}
																showThumbs={false}
																showIndicators={feed.images.length > 1}
																onSwipeStart={e => {
																	this.swipe = { x: 0 };
																	this.direction = null;
																}}
																onSwipeMove={e => {
																	if (e.touches.length) {
																		const x = e.touches[0].clientX;
																		if (this.swipe.x < x) {
																			this.direction = 'prev';
																		}
																		else {
																			this.direction = 'next';
																		}
																		this.swipe = { x: x };
																	}
																}}
																onSwipeEnd={e => {
																	if (this.direction) {
																		switch (this.direction) {
																			case 'next':
																				exclusivePhotoSlideNextEvent(feed.id, feed.title, this.state.active_tab_name, 'mweb_exclusive_photo_slide_next');
																				break;

																			case 'prev':
																				exclusivePhotoSlidePreviousEvent(feed.id, feed.title, this.state.active_tab_name, 'mweb_exclusive_photo_slide_previous');
																				break;
																		}
																	}
																	this.swipe = { x: 0 };
																}}
																stopOnHover={true}
																showArrows={false}
																showStatus={feed.images.length > 1}
																swipeScrollTolerance={1}
																swipeable={true}>
																{feed.images.map((img, i) => (
																	<Img 
																		key={i} 
																		data-index={i}
																		alt={`${this.getImageFileName(img)} - ${feed.title}`} 
																		className="program-carousel-image" 
																		unloader={<img className="program-carousel-image" src="/static/placeholders/placeholder_landscape.png"/>}
																		loader={<img className="program-carousel-image" src="/static/placeholders/placeholder_landscape.png"/>} 
																		src={[this.state.meta.image_path + this.state.resolution + img, '/static/placeholders/placeholder_potrait.png']} />
																))}
															</Carousel>)
															:
															(
																<div onClick={this.toggle.bind(this, feed, feed.link_video)}>
																	<Img 
																		alt={feed.title} 
																		className="program-thumbnail" 
																		unloader={<img className="program-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}
																		loader={<img className="program-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>} 
																		src={[this.state.meta.image_path + this.state.resolution + feed.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
																	{/* <PlayCircleOutlineIcon className="play-btn-icon" /> */}
																</div>
															)
														}
														
														<span className="program-title program-title-bottom">{feed.summary}</span>
													</Col>
												</Row>
											))}

										</div>
									</div>
							</TabPane>
						))}

					</TabContent>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...contentActions,
	...feedActions,
	...pageActions
})(withRouter(Exclusive));

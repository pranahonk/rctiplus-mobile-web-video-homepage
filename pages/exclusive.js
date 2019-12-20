import React from 'react';
import { connect } from 'react-redux';
import contentActions from '../redux/actions/contentActions';
import feedActions from '../redux/actions/feedActions';
import initialize from '../utils/initialize';
import TimeAgo from 'react-timeago';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import classnames from 'classnames';
import { Carousel } from 'react-responsive-carousel';

import Layout from '../components/Layouts/Default';
import NavDefault from '../components/Includes/Navbar/NavDefault';
import PlayerModal from '../components/Modals';
import ActionSheet from '../components/Modals/ActionSheet';

import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Row,
	Col
} from 'reactstrap';

import ShareIcon from '@material-ui/icons/Share';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import '../assets/scss/components/exclusive.scss';

class Exclusive extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			active_tab: 1,
			contents: [],
			meta: null,
			categories: [],
			feeds: {},
			feed_states: {},
			categorical_feeds: {},
			resolution: 593,
			modal: false,
			trailer_url: '',
			action_sheet: false,
			caption: '',
			url: '',
			hashtags: []
		};

		this.player = null;
		this.LoadingBar = null;
	}

	componentDidMount() {
		this.props.getContents(1).then(() => {
			this.setState({
				contents: this.props.contents.homepage_content,
				meta: this.props.contents.meta
			});
		});

		this.props.getExclusiveCategory()
			.then(response => {
				const dictFeeds = {};
				const categories = [{ name: 'All' }];
				categories.push.apply(categories, response.data.data);
				for (let i = 0; i < categories.length; i++) {
					dictFeeds[categories[i].name] = [];
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

							console.log(categoricalFeeds);

							const dictFeeds = this.state.feeds;
							dictFeeds['All'] = feeds;

							const dictFeedStates = this.state.feed_states;
							dictFeedStates['All'] = response.data.meta;

							this.setState({
								feeds: dictFeeds,
								feed_states: dictFeedStates,
								meta: this.props.feeds.meta
							});
						})
						.catch(error => console.log(error));
				});
			})
			.catch(error => console.log(error));


	}

	bottomScrollFetch(tab) {
		if (tab) {
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
					console.log(error); //
				});
		}
	}

	toggleTab(tab, tabName = 'All') {
		if (this.state.active_tab !== tab) {
			this.setState({ active_tab: tab }, () => {
				if (!this.state.feed_states[tabName]) {
					this.props.getExclusives(tabName)
						.then(response => {
							const feeds = response.data.data;
							const dictFeeds = this.state.feeds;
							dictFeeds[tabName] = feeds;

							const dictFeedStates = this.state.feed_states;
							dictFeedStates[tabName] = response.data.meta;

							this.setState({
								feeds: dictFeeds,
								feed_states: dictFeedStates,
								meta: this.props.feeds.meta
							});
						})
						.catch(error => console.log(error));
				}

			});
		}
	}

	toggle(video_url = '') {
		this.setState({ modal: !this.state.modal }, () => {
			if (this.state.modal) {
				this.setState({ trailer_url: video_url }, () => {
					setTimeout(() => {
						if (this.player != null) {
							this.player.play();
						}
					}, 1000);
				});
			}
		});
	}

	toggleActionSheet(caption = '', url = '', hashtags = []) {
		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		});
	}

	render() {
		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<NavDefault disableScrollListener />

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
					toggle={this.toggle.bind(this)}
					onReady={() => this.player = window.jwplayer('example-id')}
					playerId="example-id"
					videoUrl={this.state.trailer_url} />

				<ActionSheet
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, '', '', ['rcti'])} />

				<div className="nav-exclusive-wrapper">
					<Nav tabs id="exclusive">

						{this.state.categories.map((c, i) => (
							<NavItem key={i} className="exclusive-item">
								<NavLink
									onClick={this.toggleTab.bind(this, i + 1, c.name)}
									className={classnames({ active: this.state.active_tab == i + 1 })}>{c.name}</NavLink>
							</NavItem>
						))}

					</Nav>
					<TabContent className="container-box" activeTab={this.state.active_tab}>
						<TabPane tabId={1}>
							<div className="content-tab-exclusive">
								<div className="content-tab-exclusive">
									<div className="program-container">
										<Row className="program-item row-edit">
											<Col className="col-edit">
												<Row>
													<Col xs="2">
														<Img className="program-rounded-thumbnail" src={['', '/static/placeholders/placeholder_landscape.png']} />
													</Col>
													<Col xs="7">
														<div className="program-label">
															<div className="program-title">
																<strong>
																	Test
																</strong>
															</div>
															<TimeAgo className="program-subtitle" date={Date.now() - 4500000} />
														</div>
													</Col>
													<Col className="program-share-button">
														<ShareIcon className="program-label" />
													</Col>
												</Row>
												<Carousel
													autoPlay
													showThumbs={false}
													showIndicators={false}
													stopOnHover={true}
													showArrows={false}
													showStatus={false}
													swipeScrollTolerance={1}
													swipeable={true}>
													<Img src={['', '/static/placeholders/placeholder_potrait.png']} />
													<Img src={['', '/static/placeholders/placeholder_potrait.png']} />
												</Carousel>
												<span className="program-title program-title-bottom">Summary</span>
											</Col>
										</Row>

									</div>
								</div>
							</div>
						</TabPane>

						{this.state.categories.map((c, i) => (
							<TabPane key={i} tabId={i + 1}>
								<div className="content-tab-exclusive">
									<div className="content-tab-exclusive">
										<div className="program-container">
											{this.state.feeds[c.name] && this.state.feeds[c.name].map(feed => (
												<Row key={feed.id} className="program-item row-edit">
													<Col className="col-edit">
														<Row>
															<Col xs="2">
																<Img className="program-rounded-thumbnail" src={[this.state.meta.image_path + this.state.resolution + feed.program_icon, '/static/placeholders/placeholder_landscape.png']} />
															</Col>
															<Col xs="7">
																<div className="program-label">
																	<div className="program-title">
																		<strong>
																			{feed.title.substring(0, 25) + (feed.title.length > 25 ? '...' : '')}
																		</strong>
																	</div>
																	<TimeAgo className="program-subtitle" date={Date.now() - 4500000} />
																</div>
															</Col>
															<Col className="program-share-button">
																<ShareIcon onClick={this.toggleActionSheet.bind(this, feed.title, feed.share_link, ['rcti'])} className="program-label" />
															</Col>
														</Row>
														<div onClick={this.toggle.bind(this, feed.link_video)}>
															<Img className="program-thumbnail" src={[this.state.meta.image_path + this.state.resolution + feed.portrait_image, '/static/placeholders/placeholder_landscape.png']} />
															<PlayCircleOutlineIcon className="play-btn-icon" />
														</div>
														<span className="program-title program-title-bottom">{feed.summary}</span>
													</Col>
												</Row>
											))}

										</div>
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
	...feedActions
})(Exclusive);

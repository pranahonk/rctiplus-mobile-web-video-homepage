import React from 'react';
import { connect } from 'react-redux';
import contentActions from '../redux/actions/contentActions';
import feedActions from '../redux/actions/feedActions';
import initialize from '../utils/initialize';
import TimeAgo from 'react-timeago';
import Img from 'react-image';
import classnames from 'classnames';
import Lazyload from 'react-lazyload';
import TextTruncate from 'react-text-truncate';

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

//load home page scss
import '../assets/scss/components/homepage.scss';
import '../assets/scss/components/exclusive.scss';

class Exclusive extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			active_tab: '1',
			contents: [],
			meta: null,
			feeds: [],
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
	}

	componentDidMount() {
		this.props.getContents(1).then(() => {
			this.setState({
				contents: this.props.contents.homepage_content,
				meta: this.props.contents.meta,
			});
		});

		this.props.getExclusives()
			.then(response => {
				let categoricalFeeds = {};
				const feeds = this.props.feeds.data;
				for (let i = 0; i < feeds.length; i++) {

				}
				console.log(feeds);
				this.setState({
					feeds: feeds,
					meta: this.props.feeds.meta
				});
			})
			.catch(error => console.log(error));
	}

	toggleTab(tab) {
		if (this.state.active_tab !== tab) {
			this.setState({ active_tab: tab });
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
				<NavDefault disableScrollListener/>
				
				<PlayerModal 
                    open={this.state.modal}
                    toggle={this.toggle.bind(this)}
                    onReady={() => this.player = window.jwplayer('example-id')}
                    playerId="example-id"
                    videoUrl={this.state.trailer_url}/>

				<ActionSheet
                    caption={this.state.caption}
                    url={this.state.url}
                    open={this.state.action_sheet}
                    hashtags={this.state.hashtags}
                    toggle={this.toggleActionSheet.bind(this, '', '', ['rcti'])}/>

				<div className="nav-exclusive-wrapper">
					<Nav tabs id="exclusive">
						<NavItem className="exclusive-item">
							<NavLink 
								onClick={this.toggleTab.bind(this, '1')}
								className={classnames({ active: this.state.active_tab == '1' })}>All</NavLink>
						</NavItem>
						<NavItem className="exclusive-item">
							<NavLink
								onClick={this.toggleTab.bind(this, '2')}
								className={classnames({ active: this.state.active_tab == '2' })}>Clip</NavLink>
						</NavItem>
						<NavItem className="exclusive-item">
							<NavLink
								onClick={this.toggleTab.bind(this, '3')}
								className={classnames({ active: this.state.active_tab == '3' })}>Photo</NavLink>
						</NavItem>
						<NavItem className="exclusive-item">
							<NavLink
								onClick={this.toggleTab.bind(this, '4')}
								className={classnames({ active: this.state.active_tab == '4' })}>Entertainment</NavLink>
						</NavItem>
						<NavItem className="exclusive-item">
							<NavLink
								onClick={this.toggleTab.bind(this, '5')}
								className={classnames({ active: this.state.active_tab == '5' })}>News</NavLink>
						</NavItem>
						<NavItem className="exclusive-item">
							<NavLink
								onClick={this.toggleTab.bind(this, '6')}
								className={classnames({ active: this.state.active_tab == '6' })}>Bloopers</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="container-box" activeTab={this.state.active_tab}>
						<TabPane tabId="1">
							<div className="content-tab-exclusive">
								<div className="program-container">
									{this.state.feeds.map(feed => (
										<Lazyload key={feed.id} height={20}>
											<Row className="program-item row-edit">
												<Col>
													<Row>
														<Col xs="2">
															<Img className="program-rounded-thumbnail" src={[this.state.meta.image_path + this.state.resolution + feed.program_icon, '/static/placeholders/placeholder_landscape.png']} />
														</Col>
														<Col xs="8">
															<div className="program-label">
																<p className="program-title">
																	<strong>
																		<TextTruncate 
																			line={2}
																			element="span"
																			truncateText="..."
																			text={feed.title}/>
																	</strong>
																</p>
																<TimeAgo className="program-subtitle" date={Date.now() - 4500000}/>
															</div>
														</Col>
														<Col>
															<ShareIcon onClick={this.toggleActionSheet.bind(this, feed.title, feed.share_link, ['rcti'])} className="program-label program-share-button"/>
														</Col>
													</Row>
													<div onClick={this.toggle.bind(this, feed.link_video)}>
														<Img className="program-thumbnail" src={[this.state.meta.image_path + this.state.resolution + feed.portrait_image, '/static/placeholders/placeholder_landscape.png']} />
														<PlayCircleOutlineIcon className="play-btn-icon" />
													</div>
													<span className="program-title program-title-bottom">{feed.summary}</span>
												</Col>
											</Row>
										</Lazyload>
									))}
									
								</div>
							</div>
						</TabPane>
						<TabPane tabId="2">
							<div className="content-tab-exclusive">tab Clip</div>
						</TabPane>
						<TabPane tabId="3">
							<div className="content-tab-exclusive">tab Photo</div>
						</TabPane>
						<TabPane tabId="4">
							<div className="content-tab-exclusive">tab Entertainment</div>
						</TabPane>
						<TabPane tabId="5">
							<div className="content-tab-exclusive">tab News</div>
						</TabPane>
						<TabPane tabId="6">
							<div className="content-tab-exclusive">tab Bloopers</div>
						</TabPane>
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

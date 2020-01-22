import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import contentActions from '../redux/actions/trending/content';
import feedActions from '../redux/actions/trending/subCategory';
import initialize from '../utils/initialize';
import TimeAgo from 'react-timeago';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import classnames from 'classnames';
import { Carousel } from 'react-responsive-carousel';

import Layout from '../components/Layouts/Default';
import NavTrending from '../components/Includes/Navbar/NavTrending';
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

// load trending style
import '../assets/scss/components/trending.scss';

class Trending extends React.Component {

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
        this.props.getTrendingSubCategory().then(response => {
            const dictFeeds = {};
            const categories = [];
            categories.push.apply(categories, response.data.data);
            
            this.props.getTrendingContent(categories[0].id).then(res => {
                this.setState({
                    contents: res.data.data,
                    meta: res.data.meta
                });
            })
                    .catch(error => console.log(error));
            for (let i = 0; i < categories.length; i++) {
                dictFeeds[categories[i].name] = [];
            }
            this.setState({categories: categories}, () => {
                this.props.getTrendingSubCategory().then(response => {
                    const categoricalFeeds = {};
                    const feeds = response.data.data;
                    for (let i = 0; i < feeds.length; i++) {
                        if (feeds[i].type in categoricalFeeds) {
                            categoricalFeeds[feeds[i].type].push(feeds[i]);
                        } else {
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
                    });
                }).catch(error => console.log(error));
            });
        }).catch(error => console.log(error));


    }

    bottomScrollFetch(tab) {
        if (tab && this.state.feed_states[tab.name]) {
            this.LoadingBar.continuousStart();
            this.props.getTrendingSubCategory(tab.name, this.state.feed_states[tab.name].pagination.current_page + 1).then(response => {
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
            }).catch(error => {
                this.LoadingBar.complete();
                console.log(error);
            });
        }
    }

    toggleTab(tab, tabName = 'All', id = 0) {
        if (this.state.active_tab !== tab) {
            this.setState({active_tab: tab}, () => {
                if (!this.state.feed_states[tabName]) {
                    this.props.getTrendingSubCategory(tabName).then(response => {
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
                    }).catch(error => console.log(error));
                }
            });
        }
    }

    toggle(video_url = '') {
        this.setState({modal: !this.state.modal}, () => {
            if (this.state.modal) {
                this.setState({trailer_url: video_url}, () => {
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

    goToDetail(programId, programTitle) {
        Router.push('/trending/detail/' + programId + '/' + programTitle);
    }
    
    render() {
        const a = 0; 
        const b = 5;
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <NavTrending disableScrollListener />
                
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
                
                    <div className="nav-trending-wrapper">
                        <Nav tabs id="trending">
                            {this.state.categories.map((c, i) => (
                                <NavItem key={i} className="trending-item">
                                    <NavLink
                                        onClick={this.toggleTab.bind(this, i + 1, c.name, c.id)}
                                        className={classnames({active: this.state.active_tab == i + 1})}>{c.name}</NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <TabContent className="container-box" activeTab={this.state.active_tab}>
                            {this.state.categories.map((c, i) => (
                                <TabPane key={i} tabId={i + 1}>
                                    <div className="content-tab-trending">
                                        <div className="content-tab-trending">
                                            <div className="program-container">
                                                <Row xs="2" className="wrapper-content-trending">
                                                    {this.state.contents.map((d, j) => {
                                                        if (j === a) {
                                                            return (<div className="box-trending" key={j}><img className="box-img-trending" src={d.cover} /><div className="font-trending-title" dangerouslySetInnerHTML={{ __html: d.title }}></div></div>);
                                                        }else if(j === b){
                                                            return(<div className="box-trending" key={j}><img className="box-img-trending" src={d.cover} /><div className="font-trending-title" dangerouslySetInnerHTML={{ __html: d.title }}></div></div>);
                                                        }else{
                                                            return(<Col xs="6" className="box-trending" key={j}><div><img className="box-img-trending" src={d.cover} /><div className="font-trending-title" dangerouslySetInnerHTML={{ __html: d.title }}></div></div></Col>);
                                                        }
                                                    })}
                                                </Row>
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

export default connect(state => state, { ...contentActions, ...feedActions })(Trending);

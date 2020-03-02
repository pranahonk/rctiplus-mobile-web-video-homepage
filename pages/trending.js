import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import Link from 'next/link';
import Head from 'next/head';

//import contentActions from '../redux/actions/contentActions';
//import feedActions from '../redux/actions/feedActions';
import contentActions from '../redux/actions/trending/content';
import feedActions from '../redux/actions/trending/subCategory';
import pageActions from '../redux/actions/pageActions';

import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import classnames from 'classnames';

import Layout from '../components/Layouts/Default';

import NavTrending from '../components/Includes/Navbar/NavTrending';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';

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


import '../assets/scss/components/trending.scss';
import { SITEMAP } from '../config';

import { newsTabClicked, newsArticleClicked, newsSearchClicked } from '../utils/appier';

class Trending extends React.Component {

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
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
        this.props.setPageLoader();
    }

    componentDidMount() {
        this.props.getTrendingSubCategory().then(response => {
            const dictFeeds = {};
            const categories = [];
            let selectedCategory = 'TOP';
            let selectedTab = 1;
            categories.push.apply(categories, response.data.data);
            for (let i = 0; i < categories.length; i++) {
                dictFeeds[categories[i].name] = [];
                if (Object.keys(this.props.query).length > 0 && this.props.query.subcategory_id == categories[i].id) {
                    selectedCategory = categories[i].name;
                    selectedTab = (i + 1);
                }
            }

            this.setState({ categories: categories, active_tab: selectedTab }, () => {
                this.props.getTrendingContent().then(response => {
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
                    dictFeeds[selectedCategory] = feeds;

                    const dictFeedStates = this.state.feed_states;
                    dictFeedStates[selectedCategory] = response.data.meta;

                    this.setState({
                        feeds: dictFeeds,
                        feed_states: dictFeedStates,
                        meta: this.props.feeds.meta
                    }, () => this.props.unsetPageLoader());
                }).catch(error => {
                    console.log(error);
                    this.props.unsetPageLoader();
                });
            });
        }).catch(error => {
            console.log(error);
            this.props.unsetPageLoader();
        });
    }

    getMetadata() {
        if (Object.keys(this.props.query).length > 0) {
            const name = this.props.query.subcategory_title.toLowerCase().replace(/-/g, '_');
            if (SITEMAP[`trending_${name}`]) {
                return SITEMAP[`trending_${name}`];
            }
        }

        return SITEMAP['trending'];
    }

    bottomScrollFetch(tab) {
        if (tab && this.state.feed_states[tab.name]) {
            let actTabNo = this.state.active_tab - 1;
            const active_tab_id = this.state.categories[actTabNo]['id'];
            this.LoadingBar.continuousStart();
            this.props.getTrendingContent(active_tab_id, this.state.feed_states[tab.name].pagination.current_page + 1, 5).then(response => {
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

    toggleTab(tab, tabName = 'All') {
        if (this.state.active_tab !== tab) {
            this.setState({ active_tab: tab }, () => {
                newsTabClicked(tabName, 'mweb_news_tab_clicked');
                if (!this.state.feed_states[tabName]) {
                    this.props.setPageLoader();
                    const actTabNo = (tab - 1);
                    const active_tab_id = this.state.categories[actTabNo]['id'];
                    this.props.getTrendingContent(active_tab_id, 1, 5)
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
                            this.props.unsetPageLoader();
                        }).catch(error => {
                            this.props.unsetPageLoader();
                            console.log(error);
                        });
                }
            });
        }
    }

    toggle(video_url = '') {
        this.setState({ modal: !this.state.modal }, () => {
            if (this.state.modal) {
                this.setState({ trailer_url: video_url }, () => {
                    setTimeout(() => {
                        if (this.player !== null) {
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

    goToDetail(article) {
        newsArticleClicked(article.id, article.title, article.category_source, 'mweb_news_article_clicked');
        Router.push('/trending/detail/' + article.id + '/' + article.title.replace(/ +/g, "-").replace(/\\+/g, '-').replace(/\/+/g, '-').toLowerCase());
    }

    render() {
        const metadata = this.getMetadata();
        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description} />
                    <meta name="keywords" content={metadata.keywords} />
                    {/* <!-- Trending site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9"></script>
                    <script dangerouslySetInnerHTML={{ __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-145455301-9');
                    ` }}></script>
                </Head>

                {/* {process.env.UI_VERSION == '2.0' ? (<NavDefault_v2 disableScrollListener />) : (<NavDefault disableScrollListener />)} */}
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
                                <Link href={`/trending?subcategory_id=${c.id}&subcategory_title=${c.name.toLowerCase().replace(/ +/g, '-')}`} as={`/trending/${c.id}/${c.name.toLowerCase().replace(/ +/g, '-')}`}>
                                    <NavLink onClick={this.toggleTab.bind(this, i + 1, c.name)} className={classnames({ active: this.state.active_tab == i + 1 })}>{c.name}</NavLink>
                                </Link>
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
                                                {this.state.feeds[c.name] && this.state.feeds[c.name].map((feed, idx) => {
                                                    const title = feed.title;
                                                    if (idx % 5 === 0) {
                                                        if (idx === 0) {
                                                            return (<Col xs="12" className="box-trending" key={idx}><div onClick={() => this.goToDetail(feed)}><img className="box-img-trending" src={feed.cover} /><div className="font-trending-title-trending-parent" dangerouslySetInnerHTML={{ __html: title.substring(0, 60) + '...' }}></div></div></Col>);
                                                        } else {
                                                            return (<Col xs="12" className="box-trending" key={idx}><div onClick={() => this.goToDetail(feed)}><img className="box-img-trending" src={feed.cover} /><div className="font-trending-title-trending-child" dangerouslySetInnerHTML={{ __html: title.substring(0, 60) + '...' }}></div></div></Col>);
                                                        }
                                                    } else {
                                                        return (<Col xs="6" className="box-trending" key={idx}><div onClick={() => this.goToDetail(feed)}><img className="box-img-trending" src={feed.cover} /><div className="font-trending-title-trending-default" dangerouslySetInnerHTML={{ __html: title.substring(0, 60) + '...' }}></div></div></Col>);
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

export default connect(state => state, {
    ...contentActions,
    ...feedActions,
    ...pageActions
})(Trending);

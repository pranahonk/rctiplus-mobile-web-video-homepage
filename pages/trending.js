import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import BottomScrollListener from 'react-bottom-scroll-listener';
import Img from 'react-image';

import Layout from '../components/Layouts/Default_v2';
import NavTrending from '../components/Includes/Navbar/NavTrending_v2';
import HeadlineCarousel from '../components/Includes/Gallery/HeadlineCarousel';

import TabLoader from '../components/Includes/Shimmer/TabLoader';
import HeadlineLoader from '../components/Includes/Shimmer/HeadlineLoader';
import ArticleLoader from '../components/Includes/Shimmer/ArticleLoader';
import NoConnectionIcon from '../components/Includes/Common/NoConnection';
import WrenchIcon from '../components/Includes/Common/Wrench';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';

import { SITEMAP } from '../config';
import { formatDateWordID } from '../utils/dateHelpers';
import { removeCookie, getNewsChannels, setNewsChannels, setAccessToken, removeAccessToken } from '../utils/cookie';

import '../assets/scss/components/trending_v2.scss';

import newsv2Actions from '../redux/actions/newsv2Actions';
import userActions from '../redux/actions/userActions';
import { showSignInAlert } from '../utils/helpers';
import { newsTabClicked, newsArticleClicked, newsAddChannelClicked } from '../utils/appier';

import queryString from 'query-string';

class Trending_v2 extends React.Component {

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    state = {
        active_tab: '-1',
        is_tabs_loading: true,
        is_trending_loading: true,
        is_articles_loading: true,
        load_error: false,
        load_content_error: false,
        tabs: [],
        saved_tabs: getNewsChannels(),
        trending_articles: [],
        articles: {},
        pages: {},
        load_more_allowed: {},
        articles_length: 10,
        is_load_more: false,
        user_data: null
    };

    constructor(props) {
        super(props);
        this.accessToken = null;
        this.platform = null;
        const segments = this.props.router.asPath.split(/\?/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }
            if (q.platform) {
                this.platform = q.platform;
            }
        }
        else {
            removeAccessToken();
        }
    }

    bottomScrollFetch() {
        if (!this.state.is_load_more && this.state.load_more_allowed[this.state.active_tab]) {
            this.setState({ is_load_more: true }, () => {
                this.loadArticles(this.state.active_tab, this.state.pages[this.state.active_tab]);
            });
        }
    }

    toggleTab(tab, tabData) {
        newsTabClicked(tabData.name, 'mweb_news_tab_clicked');
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab }, () => {
                if (!this.state.articles[tab]) {
                    this.loadArticles(tab);
                }
            });
        }
    }

    loadArticles(categoryId, page = 1) {
        this.setState({ is_articles_loading: true }, () => {
            this.props.getNews(categoryId, this.state.articles_length, page)
                .then(res => {
                    let articles = this.state.articles;
                    let pages = this.state.pages;
                    let loadMoreAllowed = this.state.load_more_allowed;
                    loadMoreAllowed[categoryId.toString()] = res.data.data.length >= this.state.articles_length

                    if (articles[categoryId.toString()]) {
                        articles[categoryId.toString()].push.apply(articles[categoryId.toString()], res.data.data);
                        pages[categoryId.toString()] = page + 1;
                    }
                    else {
                        articles[categoryId.toString()] = res.data.data;
                        pages[categoryId.toString()] = 2;
                    }
                    this.setState({
                        is_articles_loading: false,
                        articles: articles,
                        load_more_allowed: loadMoreAllowed,
                        is_load_more: false
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        is_articles_loading: false,
                        is_load_more: false
                    });
                });
        });
    }

    loadContents(categoryId) {
        this.setState({ is_trending_loading: true }, () => {
            this.props.getTrending(categoryId)
                .then(res => {
                    this.setState({
                        is_trending_loading: false,
                        trending_articles: res.data.data
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        is_trending_loading: false,
                        load_content_error: true
                    });
                });
            this.loadArticles(categoryId);
        });
    }

    componentDidMount() {
        this.props.getUserData()
            .then(response => {
                console.log(response);
                this.fetchData(true);
            })
            .catch(error => {
                console.log(error);
                this.fetchData();
            });
    }

    fetchData(isLoggedIn = false) {
        const savedCategoriesNews = getNewsChannels();
        this.setState({ saved_tabs: savedCategoriesNews }, () => {
            this.props.getCategory()
                .then(response => {
                    let categories = response.data.data;
                    let sortedCategories = categories;
                    let savedCategories = savedCategoriesNews;
                    for (let i = 0; i < savedCategories.length; i++) {
                        if (categories.findIndex(c => c.id == savedCategories[i].id) != -1) {
                            if (sortedCategories.findIndex(s => s.id == savedCategories[i].id) == -1) {
                                sortedCategories.push(savedCategories[i]);
                            }
                            
                            savedCategories.splice(i, 1);
                            i--;
                        }
                    }

                    if (!isLoggedIn) {
                        for (let i = 0; i < savedCategories.length; i++) {
                            if (categories.findIndex(c => c.id == savedCategories[i].id) == -1) {
                                sortedCategories.push(savedCategories[i]);
                            }
                        }
                    }
                    

                    if (sortedCategories.length <= 0) {
                        setNewsChannels(categories);
                        sortedCategories = getNewsChannels();

                        for (let i = 0; i < sortedCategories.length; i++) {
                            if (categories.findIndex(c => c.id == sortedCategories[i].id) == -1) {
                                sortedCategories.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    if (sortedCategories.length > 0) {
                        this.setState({
                            tabs: sortedCategories,
                            active_tab: Object.keys(this.props.query).length > 0 ? (sortedCategories.findIndex(s => s.id == this.props.query.subcategory_id.toString()) != -1 ? this.props.query.subcategory_id.toString() : sortedCategories[0].id.toString()) : sortedCategories[0].id.toString(),
                            is_tabs_loading: false
                        }, () => {
                            this.loadContents(this.state.active_tab);
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        is_tabs_loading: false,
                        is_articles_loading: false,
                        is_trending_loading: false,
                        load_error: true
                    });
                });
        });
    }

    goToDetail(article) {
        newsArticleClicked(article.id, article.title, article.source, 'mweb_news_article_clicked');
        Router.push('/trending/detail/' + article.id + '/' + encodeURI(article.title.replace(/ +/g, "-").replace(/\\+/g, '-').replace(/\/+/g, '-').toLowerCase()) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
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

    render() {
        const metadata = this.getMetadata();
        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description} />
                    <meta name="keywords" content={metadata.keywords} />
                    {/* <!-- Trending site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9"></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-145455301-9');
                    ` }}></script>
                </Head>
                <NavTrending disableScrollListener />
                <BottomScrollListener
                    offset={50}
                    onBottom={this.bottomScrollFetch.bind(this)} />

                <div className="main-content">
                    {this.state.load_error ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            textAlign: 'center',
                            color: 'white',
                            paddingLeft: '20%',
                            paddingRight: '20%'
                        }}>
                            <NoConnectionIcon /><br />
                            <h4 style={{ fontSize: 14, fontWeight: 600 }}>No Internet Connection</h4>
                            <p style={{ fontSize: 12, fontWeight: 300, }}>Please check your connection, you seem to be offline</p>
                        </div>
                    ) : (
                            this.state.load_content_error ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 300,
                                    textAlign: 'center',
                                    color: 'white',
                                    paddingLeft: '20%',
                                    paddingRight: '20%'
                                }}>
                                    <WrenchIcon /><br />
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Cannot load the content</h4>
                                    <p style={{ fontSize: 12, fontWeight: 300, }}>Please try again later, we're working to fix the problem</p>
                                </div>
                            ) : (
                                    <div>
                                        {this.state.is_tabs_loading ? (
                                            <div>
                                                <TabLoader />
                                            </div>
                                        ) : (
                                                <div className="navigation-container">
                                                    <Nav tabs className="navigation-tabs">
                                                        {this.state.tabs.map((tab, i) => (
                                                            <NavItem
                                                                key={`${i}`}
                                                                className={classnames({
                                                                    active: this.state.active_tab == tab.id,
                                                                    'navigation-tabs-item': true
                                                                })}>
                                                                <Link
                                                                    href={`/trending?subcategory_id=${tab.id}&subcategory_title=${tab.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `&token=${this.accessToken}&platform=${this.platform}` : ''}`}
                                                                    as={`/trending/${tab.id}/${tab.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
                                                                    <NavLink onClick={() => this.toggleTab(tab.id.toString(), tab)} className="item-link">{tab.name}</NavLink>
                                                                </Link>
                                                            </NavItem>
                                                        ))}
                                                    </Nav>
                                                    <div className="add-tab-button">
                                                        <AddIcon onClick={() => {
                                                            removeCookie('NEWS_TOKEN_V2');
                                                            newsAddChannelClicked('mweb_news_add_kanal_clicked');
                                                            // if (this.state.user_data) {
                                                            if (true) {
                                                                Router.push('/trending/channels' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
                                                            }
                                                            else {
                                                                showSignInAlert(`Please <b>Sign In</b><br/>
                                                                Woops! Gonna sign in first!<br/>
                                                                Only a click away and you<br/>
                                                                can continue to enjoy<br/>
                                                                <b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                            )}

                                        {this.state.is_tabs_loading ? (<HeadlineLoader />) : null}
                                        {this.state.is_tabs_loading ? (<ArticleLoader />) : null}

                                        <TabContent activeTab={this.state.active_tab}>
                                            {this.state.tabs.map((tab, i) => (
                                                <TabPane key={i} tabId={tab.id.toString()}>
                                                    {tab.name === 'Berita Utama' ? (this.state.is_trending_loading ? (<HeadlineLoader />) : (<HeadlineCarousel articles={this.state.trending_articles} />)) : null}
                                                    <ListGroup className="article-list">
                                                        {this.state.articles[tab.id.toString()] && this.state.articles[tab.id.toString()].map((article, j) => (
                                                            (j + 1) != 1 && (j + 1) % 5 === 0 ? (
                                                                <ListGroupItem key={j} className="article article-full-width article-no-border" onClick={() => this.goToDetail(article)}>
                                                                    <div className="article-description">
                                                                        <div className="article-thumbnail-container-full-width">
                                                                            <Img
                                                                                alt={article.title}
                                                                                loader={<img alt={article.title} className="article-thumbnail-full-width" src="/static/placeholders/placeholder_landscape.png" />}
                                                                                unloader={<img alt={article.title} className="article-thumbnail-full-width" src="/static/placeholders/placeholder_landscape.png" />}
                                                                                className="article-thumbnail-full-width"
                                                                                src={[article.cover, '/static/placeholders/placeholder_landscape.png']} />
                                                                        </div>
                                                                        <div className="article-title-container">
                                                                            <h4 className="article-title" dangerouslySetInnerHTML={{ __html: article.title.replace(/\\/g, '') }}></h4>
                                                                            <div className="article-source">
                                                                                <p className="source"><strong>{article.source}</strong>&nbsp;&nbsp;</p>
                                                                                <p>{formatDateWordID(new Date(article.pubDate * 1000))}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                </ListGroupItem>
                                                            ) : (
                                                                <ListGroupItem key={j} className={`article ${(j + 1) > 1 && ((j + 2) % 5) == 0 ? 'article-no-border' : ''}`} onClick={() => this.goToDetail(article)}>
                                                                    <div className="article-description">
                                                                        <div className="article-thumbnail-container">
                                                                            <Img
                                                                                alt={article.title}
                                                                                loader={<img alt={article.title} className="article-thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
                                                                                unloader={<img alt={article.title} className="article-thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
                                                                                className="article-thumbnail"
                                                                                src={[article.cover, '/static/placeholders/placeholder_landscape.png']} />
                                                                        </div>
                                                                        <div className="article-title-container">
                                                                            <h4 className="article-title" dangerouslySetInnerHTML={{ __html: article.title.replace(/\\/g, '') }}></h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="article-source">
                                                                        <p><strong>{article.source}</strong>&nbsp;&nbsp;</p>
                                                                        <p>{formatDateWordID(new Date(article.pubDate * 1000))}</p>
                                                                    </div>
                                                                </ListGroupItem>
                                                            )
                                                        ))}
                                                    </ListGroup>
                                                    {this.state.is_articles_loading ? (<ArticleLoader />) : null}
                                                </TabPane>
                                            ))}
                                        </TabContent>
                                    </div>
                                )
                        )}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...newsv2Actions,
    ...userActions
})(withRouter(Trending_v2));
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import BottomScrollListener from 'react-bottom-scroll-listener';
import Img from 'react-image';
import { StickyContainer, Sticky } from 'react-sticky';

import Layout from '../components/Layouts/Default_v2';
import NavTrending from '../components/Includes/Navbar/NavTrending_v2';
import HeadlineCarousel from '../components/Includes/Gallery/HeadlineCarousel';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';

import TabLoader from '../components/Includes/Shimmer/TabLoader';
import HeadlineLoader from '../components/Includes/Shimmer/HeadlineLoader';
import ArticleLoader from '../components/Includes/Shimmer/ArticleLoader';
import NoConnectionIcon from '../components/Includes/Common/NoConnection';
import WrenchIcon from '../components/Includes/Common/Wrench';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP } from '../config';
import { formatDateWordID } from '../utils/dateHelpers';
import { removeCookie, getNewsChannels, setNewsChannels, setAccessToken, removeAccessToken, getNewsTokenV2 } from '../utils/cookie';

import '../assets/scss/components/trending_v2.scss';

import newsv2Actions from '../redux/actions/newsv2Actions';
import userActions from '../redux/actions/userActions';
import { showSignInAlert, humanizeStr } from '../utils/helpers';
import { urlRegex } from '../utils/regex';
import AdsBanner from '../components/Includes/Banner/Ads';
import { newsTabClicked, newsArticleClicked, newsAddChannelClicked } from '../utils/appier';

import queryString from 'query-string';

import $ from 'jquery';

import cookie from 'js-cookie';

const jwtDecode = require('jwt-decode');

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
        user_data: null,
        sticky_category_shown: false
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
        this.iframeAds = React.createRef()
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
                    // console.log(this.state.tabs, articles['20']);
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
    isInViewport(element) {
        if(element) {
            const distance = element.getBoundingClientRect();
            return (
                distance.top >= 0 &&
                distance.left >= 0 &&
                distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                distance.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
    adsDisplay(eventId) {
        let id = false;
        window.addEventListener('scroll', (event) => {
            if(this.isInViewport(document.getElementById(eventId))) {
                // console.log('YESSS', eventId)
                id = true
                if(eventId) {
                    document.getElementById(eventId).innerHTML = `
                    <div id="div-gpt-ad-1591240670591-0">
                    <script dangerouslySetInnerHTML={{ __html: `
                    googletag.cmd.push(function() { googletag.display('div-gpt-ad-1591240670591-0'); });
                ` }}>
                </script>
                    </div>
    
                    `
                }
                // return (<AdsBanner />)
            } else {
                id = false
                // console.log('NOOOOO', eventId)
                if(eventId) {
                    document.getElementById(eventId).innerHTML = `
                    <div></div>
                    `
                }
                // return (<div/>)
                // return (<AdsBanner />)
                // element.innerHTML = `<div></div>`
            }
            // console.log('scrolll')
        })

        // if(id) {
        //     return (<div>bismillah</div>)
        // } else {
        //     return (<div>lalala</div>)
        // }
    }
    componentDidMount() {
        // window.addEventListener('scroll', (event) => {
        //     if(this.isInViewport(document.getElementById('9'))) {
        //         console.log('YESSS')
        //         return ReactDOM.createPortal(<div>dsada</div>, document.getElementById('9'))
        //     } else {
        //         console.log('NOOOOO')
        //     }
        //     console.log('scrolll')
        // }, false)

        if (this.accessToken !== null &&  this.accessToken !== undefined) {
            const decodedToken = jwtDecode(this.accessToken);
            if (decodedToken && decodedToken.uid != '0') {
                this.fetchData(true);
            }
            else {
                this.fetchData();
            }
        }
        else {
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

        
    }

    componentDidUpdate() {
        // console.log(this.iframeAds && this.iframeAds.current && this.iframeAds.current.scrollHeight)
        // console.log(document.getElementById('iframe-ads-1') && document.getElementById('iframe-ads-1').contentWindow && document.getElementById('iframe-ads-1').contentWindow.document.getElementById('div-gpt-ad-1591240670591-0').style.display)
        // console.log(this.iframeAds && this.iframeAds.current && this.iframeAds.current.contentWindow.document.getElementById('__next'))
        // let elemnt = $('#iframe-ads-1').contents().find($('div-gpt-ad-1591240670591-0'))
        // console.log(elemnt.css('display'))
        // console.log($('#iframe-ads-1').contents().find($('div-gpt-ad-1591240670591-0')).css('display'))
    }

    fetchData(isLoggedIn = false) {
        let params = {};
        const savedCategoriesNews = getNewsChannels();
        params['saved_tabs'] = savedCategoriesNews;
        this.setState(params, () => {
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
                        let params = {is_tabs_loading: false};
                        params['active_tab'] = Object.keys(this.props.query).length > 0 ? 
                        (
                            sortedCategories.findIndex(
                                s => s.id == ((this.props.query) && this.props.query.subcategory_id) && parseInt(this.props.query.subcategory_id)
                            ) != -1 ? ((this.props.query && this.props.query.subcategory_id) && this.props.query.subcategory_id.toString()) : sortedCategories[0].id.toString()
                        ) : sortedCategories[0].id.toString();
                
                        this.props.getChannels()
                        .then(response => {
                            let channels = response.data.data;
                            if ((this.props.query) && (this.props.query.subcategory_title)) {
                                let chan = channels.filter((c) => c.name === humanizeStr(this.props.query.subcategory_title));
                                if (chan.length > 0) {
                                    params['active_tab'] = chan[0].id.toString();
                                    let savedTabs = this.state.saved_tabs;
                                    params['saved_tabs'] = savedTabs.filter((st) => st.id === chan[0].id).length === 0 ? (savedTabs).concat(chan) : savedTabs;
                                    sortedCategories = sortedCategories.filter((st) => st.id === chan[0].id).length === 0 ? (sortedCategories).concat(chan) : sortedCategories;
                                    let getListChannels = getNewsChannels();
                                    if (getListChannels.filter((st) => st.id === chan[0].id).length === 0) {
                                        setNewsChannels(getListChannels.concat(chan))
                                    }
                                }
                            }
                            params['tabs'] = sortedCategories;
                            this.setState(params, () => {
                                this.loadContents(this.state.active_tab);
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }
                })
                .catch(error => {
                    if (this.platform && this.accessToken) {
                        switch (this.platform) {
                            case 'android':
                                window.AndroidTokenHandler.action(this.accessToken);
                                break;

                            case 'ios':
                                window.webkit.messageHandlers.IosTokenHandler.postMessage(this.accessToken);
                                break;
                        }
                    }

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
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        newsArticleClicked(article.id, article.title, article.source, 'mweb_news_article_clicked');
        Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
    }

    getMetadata() {
        if (Object.keys(this.props.query).length > 0) {
            const name = this.props && this.props.query && this.props.query.subcategory_title && this.props.query.subcategory_title.toLowerCase().replace(/-/g, '_');
            if (SITEMAP[`trending_${name}`]) {
                return SITEMAP[`trending_${name}`];
            }
        }

        return SITEMAP['trending'];
    }

    // getAds() {
    //     console.log()
    // }

    render() {
        const metadata = this.getMetadata();
        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description} />
                    <meta name="keywords" content={metadata.keywords} />
                    <meta property="og:title" content={metadata.title} />
                    <meta property="og:image" itemProp="image" content={metadata.image}></meta>
                    <meta property="og:url" content={encodeURI(this.props.router.asPath)}></meta>
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={SITE_NAME}></meta>
                    <meta property="fb:app_id" content={GRAPH_SITEMAP.appId}></meta>
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard}></meta>
                    <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator}></meta>
                    <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite}></meta>
                    <meta name="twitter:image" content={metadata.image}></meta>
                    <meta name="twitter:title" content={metadata.title}></meta>
                    <meta name="twitter:description" content={metadata.description}></meta>
                    <meta name="twitter:url" content={encodeURI(this.props.router.asPath)}></meta>
                    <meta name="twitter:domain" content={encodeURI(this.props.router.asPath)}></meta>
                    {/* <!-- Trending site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9"></script>
                    {/* <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
                <script dangerouslySetInnerHTML={{
                        __html: `
                        window.googletag = window.googletag || {cmd: []};
                    googletag.cmd.push(function() {
                        googletag.defineSlot('/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250', [300, 250], 'div-gpt-ad-1591240670591-0').addService(googletag.pubads());
                        googletag.pubads().enableSingleRequest();
                        googletag.pubads().collapseEmptyDivs();
                        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                            if (event.isEmpty) {
                                // document.getElementById('sticky-ads-container').style.display = 'none';
                            }
                        });
                        googletag.enableServices();
                    }); `}}></script> */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-145455301-9');
                    ` }}></script>
                </Head>
                {/* <div style={{ display: 'none' }}>
                    <AdsBanner />
                </div>
                {/* <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} />
                <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} />
                <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} />
                <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} />
                <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} /> */}
                {/* <NavTrending disableScrollListener /> */}
                {this.platform === 'ios' || this.platform === 'android' ? '' : (<NavDefault_v2 disableScrollListener />)}
                <BottomScrollListener
                    offset={50}
                    onBottom={this.bottomScrollFetch.bind(this)} />

                <div className={`main-content ${this.state.sticky_category_shown ? 'sticky-menu-category-active' : ''} ${(this.platform === 'ios' || this.platform === 'android') && 'apps-mode'}`} style={{ marginTop: this.platform === 'ios' ? 26 : this.platform === 'android' ? 15 : '' }}>
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
                                            <StickyContainer>
                                                <Sticky>
                                                    { ({ distanceFromTop }) => {
                                                        const self = this;
                                                        const {sticky_category_shown} = self.state
                                                        setTimeout(() => {
                                                            let distance = this.platform === 'ios' || this.platform === 'android' ? 15 : 110
                                                            self.setState({ sticky_category_shown: distanceFromTop < distance })
                                                        }, 200);
                                                        return (
                                                            <div className={`navigation-container ${sticky_category_shown ? 'sticky-menu-category' : ''}`}>
                                                                <Nav tabs className="navigation-tabs">
                                                                    {this.state.tabs.map((tab, i) => (
                                                                        <NavItem
                                                                            key={`${i}`}
                                                                            className={classnames({
                                                                                active: this.state.active_tab == tab.id,
                                                                                'navigation-tabs-item': true
                                                                            })}>
                                                                            <Link
                                                                                href={`/news?subcategory_id=${tab.id}&subcategory_title=${tab.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `&token=${this.accessToken}&platform=${this.platform}` : ''}`}
                                                                                as={`/news/${tab.id}/${tab.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
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
                                                                            if (this.platform && this.platform === 'android') {
                                                                                if (typeof window.NewsInterface !== 'undefined') {
                                                                                    window.NewsInterface.hideHeader();
                                                                                }

                                                                                Router.push('/news/channels' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
                                                                            }
                                                                            else {
                                                                                Router.push('/news/channels' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
                                                                            }
                                                                            
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
                                                        );
                                                    } }
                                                </Sticky>
                                            </StickyContainer>
                                        )}

                                        {this.state.is_tabs_loading ? (<HeadlineLoader />) : null}
                                        {this.state.is_tabs_loading ? (<ArticleLoader />) : null}

                                        <TabContent activeTab={this.state.active_tab}>
                                            {this.state.tabs.map((tab, i) => (
                                                <TabPane key={i} tabId={tab.id.toString()}>
                                                    {tab.name === 'Berita Utama' ? (this.state.is_trending_loading ? (<HeadlineLoader />) : (<HeadlineCarousel articles={this.state.trending_articles} />)) : null}
                                                    <ListGroup className="article-list">
                                                        {this.state.articles[tab.id.toString()] && this.state.articles[tab.id.toString()].map((article, j) => (
                                                            (j > 6) && (j + 1) != 1 && (j + 1) % 5 === 0 ? (
                                                                <div key={j}>
                                                                    {/* <iframe ref={this.iframeAds} id="iframe-ads-1" src="/dfp" frameBorder="0" style={{ height: '250px', width: '100%' }} /> */}
                                                                    <iframe 
                                                                        onLoad={() => {
                                                                            window.addEventListener('scroll', () => {
                                                                                const element = document.getElementById(article.id).contentWindow && document.getElementById(article.id).contentWindow.document && 
                                                                                document.getElementById(article.id).contentWindow.document.getElementById('div-gpt-ad-1591240670591-0') 
                                                                                const element_2 = document.getElementById(article.id).contentWindow && document.getElementById(article.id).contentWindow.document && 
                                                                                document.getElementById(article.id).contentWindow.document.getElementById('error__page') 
                                                                                const element_3 = document.getElementById(article.id)
                                                                                if(element && element.style.display === 'none' || element_2) {
                                                                                    element_3.style.display = 'none'
                                                                                } else {
                                                                                    element_3.style.display = 'block'
                                                                                }
                                                                                })
                                                                        }}
                                                                        id={article.id} src={`/dfp?platform=${this.platform}`} 
                                                                        frameBorder="0" 
                                                                        style={{ 
                                                                            height: '250px',
                                                                            width: '100%',
                                                                            display: 'none',
                                                                        }} />
                                                                    {/* <iframe 
                                                                        ref={this.iframeAds} 
                                                                        id="iframe-ads-1" src="/dfp" 
                                                                        frameBorder="0" 
                                                                        style={{ 
                                                                            height: '250px',
                                                                            width: '100%',
                                                                            display: this.iframeAds && this.iframeAds.current 
                                                                                        && this.iframeAds.current.contentWindow.document.getElementById('div-gpt-ad-1591240670591-0') 
                                                                                        && this.iframeAds.current.contentWindow.document.getElementById('div-gpt-ad-1591240670591-0').style.display === 'none' || 
                                                                                        this.iframeAds && this.iframeAds.current && this.iframeAds.current.contentWindow.document.getElementById('__next') === null
                                                                                         ? 'none' : 'block', 
                                                                        }} /> */}
                                                                    {/* <div id={j}>
                                                                        { this.adsDisplay(j) }
                                                                    </div> */}
                                                                    {/* <iframe src="" frameborder="0"></iframe> */}
                                                                    {/* <AdsBanner /> */}
                                                                    <ListGroupItem className="article article-full-width article-no-border" onClick={() => this.goToDetail(article)}>
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
                                                                </div>
                                                            ) : (j > 4) ? (
                                                                <ListGroupItem key={j} className={`article ${(j > 4) && (j + 1) > 1 && ((j + 2) % 5) == 0 ? 'article-no-border' : ''}`} onClick={() => this.goToDetail(article)}>
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
                                                            ) : <ListGroupItem key={j} className={`article`} onClick={() => this.goToDetail(article)}>
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
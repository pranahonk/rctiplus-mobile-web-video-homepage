import React from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { StickyContainer, Sticky } from 'react-sticky';

import Layout from '../components/Layouts/DefaultNews';
// import Layout from '../components/Layouts/Default_v2';
// import NavTrending from '../components/Includes/Navbar/NavTrending_v2';
import HeadlineCarousel from '../components/Includes/Gallery/HeadlineCarousel';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';

import TabLoader from '../components/Includes/Shimmer/TabLoader';
import HeadlineLoader from '../components/Includes/Shimmer/HeadlineLoader';
import ArticleLoader from '../components/Includes/Shimmer/ArticleLoader';
import NoConnectionIcon from '../components/Includes/Common/NoConnection';
import WrenchIcon from '../components/Includes/Common/Wrench';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, DEV_API, NEWS_API_V2, BASE_URL, SHARE_BASE_URL } from '../config';
import { formatDateWordID } from '../utils/dateHelpers';
import { removeCookie, getNewsChannels, setNewsChannels, setAccessToken, removeAccessToken, getNewsTokenV2, getUserAccessToken } from '../utils/cookie';

import '../assets/scss/components/trending_v2.scss';

import newsv2Actions from '../redux/actions/newsv2Actions';
import newsv2KanalActions from '../redux/actions/newsv2KanalActions';
import userActions from '../redux/actions/userActions';
import pageActions from '../redux/actions/pageActions';
import { showSignInAlert, humanizeStr, imageNews, imagePath, readMore } from '../utils/helpers';
import { urlRegex } from '../utils/regex';
// import AdsBanner from '../components/Includes/Banner/Ads';
import { newsTabClicked, newsArticleClicked, newsAddChannelClicked } from '../utils/appier';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const Loading = dynamic(() => import('../components/Includes/Shimmer/ListTagLoader'))
const SectionNews = dynamic(() => import('../components/Includes/news/SectionNews'))
const SquareItem = dynamic(() => import('../components/Includes/news/SquareItem'),{loading: () => <Loading />})

import queryString from 'query-string';

import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import remove from 'lodash/remove'

const jwtDecode = require('jwt-decode');

class Trending_v2 extends React.Component {

    static async getInitialProps(ctx) {
        // console.log(isEmpty(ctx.query))
        const queryId = isEmpty(ctx.query) ? 15 : ctx.query.subcategory_id
        const response_visitor = await fetch(`${DEV_API}/api/v1/visitor?platform=mweb&device_id=69420`);
         if (response_visitor.statusCode === 200) {
            return {};
        }
        const data_visitor = await response_visitor.json();
        const response_news = await fetch(`${NEWS_API_V2}/api/v1/token`, {
            method: 'POST',
            body: JSON.stringify({
                merchantName: 'rcti+',
                hostToken: data_visitor.data.access_token,
                platform: 'mweb'
            })
        });
        if (response_news.statusCode === 200) {
            return {};
        }
        const data_news = await response_news.json();

        const res = await fetch(`${NEWS_API_V2}/api/v1/news?subcategory_id=${queryId}&page=1&pageSize=1`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const res_category = await fetch(`${NEWS_API_V2}/api/v1/category`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const res_kanal = await fetch(`${NEWS_API_V2}/api/v1/kanal`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const error_code = res.statusCode > 200 ? true : false;
        const data = await res.json();
        const error_code_category = res_category.statusCode > 200 ? true : false;
        const data_category = await res_category.json();
        const error_code_kanal = res_kanal.statusCode > 200 ? true : false;
        const data_kanal = await res_kanal.json();
        let metaSeo = data_category.data;
        let dataCategory = {}
        if(!error_code_kanal || !error_code_category) {
            dataCategory= { data: [...data_category.data, ...data_kanal.data ] }
        }
        if(isEmpty(ctx.query)) {
            metaSeo = [{title: SITEMAP.trending.title, description: SITEMAP.trending.description, keyword: SITEMAP.trending.keywords}]
        } else {
            metaSeo = remove([...metaSeo, ...data_kanal?.data], (item) => {
            return item.id == queryId;
            });
        }

        const general = await fetch(`${NEWS_API_V2}/api/v2/settings/general`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });

        let gen_error_code = general.statusCode > 200 ? general.statusCode : false;
        let gs = {};
        const data_general = await general.json();
        if (!gen_error_code && isArray(data_general.data) && data_general.data.length > 0){
            const res_gs = data_general.data[0]
            gs['site_name'] = res_gs.site_name
            gs['fb_id'] = res_gs.fb_id
            gs['twitter_creator'] = res_gs.twitter_creator
            gs['twitter_site'] = res_gs.twitter_site
            gs['img_logo'] = res_gs.img_logo
        }

        let newsData = {}
        if (!error_code && isArray(data.data) && data.data.length > 0){
            newsData = data.data[0]
            let siteName = !isEmpty(gs.site_name) ? gs.site_name : 'News+ on RCTI+'
            newsData['title'] = newsData.title + ' - ' + siteName
            newsData['cover'] = imagePath(newsData.cover, newsData.image, 600, data.meta.assets_url, `${data.meta.assets_url}/600/${gs['img_logo']}`)
            newsData['content'] = newsData.content.substring(0, 165) + '....'
        }
        return {
            query: ctx.query,
            metaOg: newsData,
            data_category: error_code_category || error_code_kanal ? [] : dataCategory,
            metaSeo: metaSeo[0] || {},
            general: gs
        };
    }

    state = {
        tab: '',
        active_tab: '-1',
        is_tabs_loading: true,
        is_trending_loading: true,
        is_articles_loading: true,
        load_error: false,
        load_content_error: false,
        tabs: [],
        saved_tabs: getNewsChannels(),
        trending_articles: {},
        articles: {},
        pages: {},
        load_more_allowed: {},
        articles_length: 10,
        is_load_more: false,
        user_data: null,
        sticky_category_shown: false,
        section: 1,
        is_ads_rendered: false,
        device_id: null,
        not_logged_in_category: [],
        is_login: false,
    };

    constructor(props) {
        super(props);
        this.accessToken = null;
        this.platform = null;
        this.core_token = null;
        const segments = this.props.router.asPath.split(/\?/);
        this.segments = segments;
        this.idfa = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                // this.accessToken = q.token;
                // setAccessToken(q.token);
            }
            if(q.core_token){
              this.core_token = q.core_token;
            }
            if (q.platform) {
                this.platform = q.platform;
            }
            if(q.idfa){
              this.idfa = q.idfa;
            }
        }
        else {
            removeAccessToken();
        }
        this.iframeAds = React.createRef();
    }

    bottomScrollFetch() {
        if (!this.state.is_load_more && this.state.load_more_allowed[this.state.active_tab]) {
            this.setState({ is_load_more: true }, () => {
                // this.props.getSectionNews(this.state.active_tab, 3, this.state.pages[this.state.active_tab])
                this.loadArticles(this.state.active_tab, this.state.pages[this.state.active_tab]);
            });
        }
    }
    toggleTab(tab, tabData) {
        newsTabClicked(tabData.name, 'mweb_news_tab_clicked');
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab, sticky_category_shown: false }, () => {
                if (!this.state.articles[tab]) {
                    this.loadArticles(tab);
                }
            });
            this.loadContents(tabData.id);
            const href = `/news?subcategory_id=${tabData.id}&subcategory_title=${tabData.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `&token=${this.accessToken}&platform=${this.platform}&page=home` : ''}`;
            const as = `/news/${tabData.id}/${tabData.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&page=home` : ''}`;
            Router.push(href, as)
        }
    }

    loadArticles(categoryId, page = 1) {
        this.setState({ is_articles_loading: true }, () => {
            this.props.getSectionNews(categoryId, 1, page).then((resSection) => {
            this.props.getNews(categoryId, this.state.articles_length, page)
                .then(res => {
                    const data = res.data.data
                    const pageSection = res.data.meta.pagination.current_page
                    // if(data.length > 6) {
                    //     data[6].section = page
                    // }
                    let articles = this.state.articles;
                    let pages = this.state.pages;
                    let loadMoreAllowed = this.state.load_more_allowed;
                    loadMoreAllowed[categoryId.toString()] = res.data.data.length >= this.state.articles_length
                    const assets_url = res.data.meta.assets_url

                    if (articles[categoryId.toString()]) {
                        articles[categoryId.toString()].push.apply(articles[categoryId.toString()], data);
                        pages[categoryId.toString()] = page + 1;
                    }
                    else {
                        articles[categoryId.toString()] = data;
                        pages[categoryId.toString()] = 2;
                    }

                    articles[categoryId.toString()].forEach((item, i) => {
                        if(((i+1) % 7  === 0) && !item.section) {
                            item.section = resSection.data[0] || []
                        }
                    })
                    // console.log(this.state.tabs, articles['20']);
                    this.setState({
                        is_articles_loading: false,
                        articles: articles,
                        load_more_allowed: loadMoreAllowed,
                        is_load_more: false,
                        assets_url: assets_url,
                        section: pageSection
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        is_articles_loading: false,
                        is_load_more: false
                    });
                });
            })
        });
    }

    loadContents(categoryId) {
        this.setState({ is_trending_loading: true }, () => {
            this.props.getTrending(categoryId)
                .then(res => {
                    this.state.trending_articles[categoryId] = res.data.data
                    this.setState({
                        is_trending_loading: false,
                        trending_articles: this.state.trending_articles
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
    async componentDidMount() {
        // window.addEventListener('scroll', (event) => {
        //     if(this.isInViewport(document.getElementById('9'))) {
        //         console.log('YESSS')
        //         return ReactDOM.createPortal(<div>dsada</div>, document.getElementById('9'))
        //     } else {
        //         console.log('NOOOOO')
        //     }
        //     console.log('scrolll')
        // }, false)
        // console.log(props)

        await this.setState({
          device_id: new DeviceUUID().get(),
        });
        this.props.unsetPageLoader();



      if (this.accessToken !== null &&  this.accessToken !== undefined) {
        const decodedToken = jwtDecode(this.accessToken);
        if (decodedToken && decodedToken.uid != '0') {
          this.fetchData(true);
        }
        else {
          this.fetchData();
          this.props.getSelectedChannelsVisitor(this.state.device_id)
            .then((res) =>{
              this.setState({
                not_logged_in_category: res.data.data,
              });
            })
            .catch((err) =>{
              console.error(err)
            });
        }
      }
      else {
        this.props.getUserData()
          .then(response => {
            // console.log(response);
            this.fetchData(true);
          })
          .catch(error => {
            console.log(error);
            this.fetchData();
            this.props.getSelectedChannelsVisitor(this.state.device_id)
              .then((res) =>{
                this.setState({
                  not_logged_in_category: res.data.data,
                });
              })
              .catch((err) =>{
                console.error(err)
              });
          });
      }


        window.addEventListener('pageshow', function(event) {
          if (event.persisted) {
            Router.reload(window.location.pathname);
          }
        });
    }

    componentDidUpdate() {
        // console.log(this.iframeAds && this.iframeAds.current && this.iframeAds.current.scrollHeight)
        // console.log(document.getElementById('iframe-ads-1') && document.getElementById('iframe-ads-1').contentWindow && document.getElementById('iframe-ads-1').contentWindow.document.getElementById('div-gpt-ad-1591240670591-0').style.display)
        // console.log(this.iframeAds && this.iframeAds.current && this.iframeAds.current.contentWindow.document.getElementById('__next'))
        // let elemnt = $('#iframe-ads-1').contents().find($('div-gpt-ad-1591240670591-0'))
        // console.log(elemnt.css('display'))
        // console.log($('#iframe-ads-1').contents().find($('div-gpt-ad-1591240670591-0')).css('display'))
    }

    async fetchData(isLoggedIn = false) {
        let params = {};
        const savedCategoriesNews = getNewsChannels();
        params['saved_tabs'] = savedCategoriesNews;
        await this.setState(params, () => {
            this.props.getCategoryV2(this.core_token)
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

                      const notLoginResponse = [...sortedCategories, ...this.state.not_logged_in_category]
                      this.getUpdate();
                      sortedCategories = [...notLoginResponse].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);


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

                    this.setState({
                        is_tabs_loading: false,
                        is_articles_loading: false,
                        is_trending_loading: false,
                        load_error: true
                    });
                });
        });
        this.props.getTagTrending().then((res) => console.log(res)).catch((err) => console.log(err))
    }
    goToDetail(article) {
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        newsArticleClicked(article.id, article.title, article.source, 'mweb_news_article_clicked');
        Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&idfa=${this.idfa}&core_token=${this.core_token}` : ''}`);
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
    getOgMetaData() {
        const { articles, active_tab } = this.state
        if(!isEmpty(articles)) {
            return {
                ogTitle: articles[active_tab]?.[0]?.title || '',
                ogImage: articles[active_tab]?.[0]?.cover || '',
                ogDescription: articles[active_tab]?.[0]?.content?.replace(/(<([^>]+)>)/gi, "") || '',
            }
        }
        return {
                ogTitle: '',
                ogImage: '',
                ogDescription: '',
            }
    }

    getUpdate(){
      setTimeout(()=>{
         this.props.getSelectedChannelsVisitor(this.state.device_id)
          .then((res) =>{
            const data = res.data.data;
            const tabs = this.state.tabs.filter(x => x.id === 15 || x.id === 12 || x.id === 1);
            const tabs_not_required = this.state.tabs.filter(x => x.id !== 15 && x.id !== 12 && x.id !== 1);
            if(tabs_not_required.length !== data.length){
              const combine  = [...tabs, ...data];
              this.setState({
                tabs: combine
              })
            }
          })
          .catch((err) =>{
            console.error(err)
          });

      }, 2500);
    }


    render() {
        // const metadata = this.getMetadata();
        // const ogMetaData = this.getOgMetaData();
        const asPath = this.props.router.asPath;
        const oneSegment = SHARE_BASE_URL.indexOf('//dev-') > -1 ? 'https://dev-webd.rctiplus.com' : SHARE_BASE_URL.indexOf('//rc-') > -1 ? 'https://rc-webd.rctiplus.com' : 'https://www.rctiplus.com';
        const mobilePlatform = (this.platform !== null) ? 'mobilePlatform' : '';
        const site_name = this.props?.general?.site_name || SITE_NAME
        const title = (this.props?.metaSeo?.title) + ' - ' + (site_name)
        const widthImg = 600;
        const heightImg = (widthImg*56) / 100;
        const {data} = this.props.data_category
        let {subcategory_id} = this.props.query
        subcategory_id = isEmpty(subcategory_id) ? 15 : subcategory_id;
        const categoryDetail = data.filter((filter) => filter.id === parseInt(subcategory_id))
        let metaSEO = {}
        if (categoryDetail.length > 0){
            metaSEO = categoryDetail[0]
        }

        return (
            <Layout title={metaSEO.title || title}>
                <Head>
                    <meta name="title" content={metaSEO.title || title} />
                    <meta name="description" content={metaSEO.description || this.props?.metaSeo?.description} />
                    <meta name="keywords" content={metaSEO.keyword || this.props?.metaSeo?.keyword} />
                    <meta property="og:title" content={this.props.metaOg?.title} />
                    <meta property="og:description" content={this.props.metaOg?.content?.replace(/(<([^>]+)>)/gi, "") || ''} />
                    <meta property="og:image" itemProp="image" content={this.props.metaOg?.cover || this.props?.general?.img_logo} />
                    <meta property="og:url" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content={widthImg} />
                    <meta property="og:image:height" content={heightImg} />
                    <meta property="og:site_name" content={site_name} />
                    <meta property="fb:app_id" content={this.props?.general?.fb_id || GRAPH_SITEMAP.appId} />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={this.props?.general?.twitter_creator || GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={this.props?.general?.twitter_site || GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={this.props.metaOg?.cover || this.props?.general?.img_logo} />
                    <meta name="twitter:image:alt" content={this.props.metaOg?.title || ''} />
                    <meta name="twitter:title" content={this.props.metaOg?.title || metaSEO.title} />
                    <meta name="twitter:description" content={this.props.metaOg?.content?.replace(/(<([^>]+)>)/gi, "") || ''} />
                    <meta name="twitter:url" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
                    <meta name="twitter:domain" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
                    <link rel="canonical" href={oneSegment + encodeURI(asPath).replace('trending/', 'news/')} />

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

                <div id="container" className={`main-content ${this.state.sticky_category_shown ? 'sticky-menu-category-active' : ''} ${(this.platform === 'ios' || this.platform === 'android') && 'apps-mode'}`} style={{ marginTop: this.platform === 'ios' ? 26 : this.platform === 'android' ? 15 : '110px' }}>
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
                                                        }, 100);
                                                        return (
                                                            <div id="nav-container" className={`navigation-container ${sticky_category_shown ? 'sticky-menu-category' : 'sticky-menu-inactive'}`}>
                                                                <Nav tabs className="navigation-tabs" id="nav-tabs">
                                                                    {this.state.tabs.map((tab, i) => (
                                                                        <NavItem
                                                                            key={`${i}`}
                                                                            className={classnames({
                                                                                active: this.state.active_tab == tab.id,
                                                                                'navigation-tabs-item': true
                                                                            })}>
                                                                            <NavLink onClick={() => this.toggleTab(tab.id.toString(), tab)} className="item-link">{tab.name}</NavLink>
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

                                                                                Router.push('/news/channels' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&core_token=${this.core_token}` : ''}`);
                                                                            }
                                                                            else {
                                                                                Router.push('/news/channels' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&core_token=${this.core_token}` : ''}`);
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

                                        <TabContent id="tab-content" activeTab={this.state.active_tab}>
                                            {this.state.tabs.map((tab, i) => {
                                                return (
                                                <TabPane key={i} tabId={tab.id.toString()}>
                                                    {(this.state.is_trending_loading ? (<HeadlineLoader />) : (
                                                        !isEmpty(this.state.trending_articles[tab.id]) ? <div id="headline"><HeadlineCarousel className="news-carousel" articles={this.state.trending_articles[tab.id]} assets_url={this.state.assets_url} /></div> : null
                                                    ))}
                                                    { !isEmpty(this.props.newsv2.data_topic) ? (
                                                        <div className="interest-topic_wrapper">
                                                            <div className="interest-topic_title">
                                                                <h1>topik menarik</h1>
                                                                <Link href={`/news/interest-topic${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`} className=""><span className="news-more_action">See More <ArrowForwardIosIcon /></span></Link>
                                                            </div>
                                                            <div className="interest-topic_list">
                                                                <Row className="interest-topic_list_row">
                                                                    {this.props.newsv2.data_topic.map((item, i) => {
                                                                        return i > 10 ? ''
                                                                        : (
                                                                        <Col xs="6" className="interest-topic-item" key={i}>
                                                                            <Link href={`/news/topic/tag/${item.tag.toLowerCase()}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
                                                                                {`#${item.tag}`}
                                                                            </Link>
                                                                        </Col>
                                                                        );
                                                                    })}
                                                                </Row>
                                                            </div>
                                                        </div>
                                                    ) : '' }
                                                    <ListGroup className="article-list">
                                                        {this.state.articles[tab.id.toString()] && this.state.articles[tab.id.toString()].map((article, j) => {
                                                            return(((j+1) % 7  === 0) ?
                                                                (<li className="listItems" key={j + article.title}>
                                                                        <ListGroup className="groupNews">
                                                                          <ListGroupItem className={`listNewsAdds ${!this.state.is_ads_rendered ? 'blank-space' : ''}`}>
                                                                                <iframe
                                                                                onLoad={() => {
                                                                                  window.addEventListener('scroll', () => {
                                                                                    const adsFrame = document.getElementById(article.id);
                                                                                    const iframeAdsID = adsFrame.contentWindow.document.getElementById('div-gpt-ad-1606113572364-0');
                                                                                    const element = document.getElementById(article.id).contentWindow && document.getElementById(article.id).contentWindow.document && document.getElementById(article.id).contentWindow.document.getElementById('div-gpt-ad-1591240670591-0')
                                                                                    const element_2 = document.getElementById(article.id).contentWindow && document.getElementById(article.id).contentWindow.document && document.getElementById(article.id).contentWindow.document.getElementById('error__page')
                                                                                    if(adsFrame.contentWindow.document && iframeAdsID && iframeAdsID.style.display !== "none"){
                                                                                      adsFrame.style.display = 'block';
                                                                                      this.setState({
                                                                                        is_ads_rendered: true,
                                                                                      })

                                                                                    }else if(element && element.style.display === 'none' || element_2 || !element){
                                                                                      adsFrame.style.display = 'none';
                                                                                    }else{
                                                                                      adsFrame.style.display = 'none';
                                                                                    }
                                                                                  })
                                                                                }}
                                                                                id={article.id} src={`/dfp?platform=${this.platform}&idfa=${this.idfa}`}
                                                                                frameBorder="0"
                                                                                style={{
                                                                                  height: '250px',
                                                                                  width: '100%',
                                                                                  display: 'none',
                                                                                }} />
                                                                            </ListGroupItem>
                                                                            {
                                                                                article && isArray(article.section) && article.section.length > 0 ? <SectionNews  article={article}/> : <ListGroupItem className="article article-full-width article-no-border" onClick={() => this.goToDetail(article)}>
                                                                                    <div className="article-description">
                                                                                        <div className="article-thumbnail-container-full-width">
                                                                                            {
                                                                                                imageNews(article.title, article.cover, article.image, 400, this.state.assets_url, 'article-thumbnail-full-width')
                                                                                            }
                                                                                        </div>
                                                                                        <div className="article-title-container">
                                                                                            <h4 className="article-title" dangerouslySetInnerHTML={{ __html: article.title.replace(/\\/g, '') }}></h4>
                                                                                            <p style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: readMore(article.content) }}></p>
                                                                                            <div className="article-source">
                                                                                                <p className="source"><strong>{article.source}</strong>&nbsp;&nbsp;</p>
                                                                                                <p>{formatDateWordID(new Date(article.pubDate * 1000))}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </ListGroupItem>
                                                                            }
                                                                        </ListGroup>
                                                                </li>)  :
                                                                (<ListGroupItem className="item_square-wrapper" key={j + article.title}>
                                                                    <SquareItem item={article} assets_url={this.state.assets_url} />
                                                                </ListGroupItem>)

                                                            )})}
                                                    </ListGroup>
                                                    {this.state.is_articles_loading ? (<ArticleLoader />) : null}
                                                </TabPane>
                                            )})}
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
    ...userActions,
    ...newsv2KanalActions,
    ...pageActions,
})(withRouter(Trending_v2));

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
import { removeCookie, getNewsChannels, setNewsChannels, setAccessToken, removeAccessToken, getNewsTokenV2 } from '../utils/cookie';

import '../assets/scss/components/trending_v2.scss';

import newsv2Actions from '../redux/actions/newsv2Actions';
import userActions from '../redux/actions/userActions';
import { showSignInAlert, humanizeStr, imageNews } from '../utils/helpers';
import { urlRegex } from '../utils/regex';
// import AdsBanner from '../components/Includes/Banner/Ads';
import { newsTabClicked, newsArticleClicked, newsAddChannelClicked } from '../utils/appier';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const Loading = dynamic(() => import('../components/Includes/Shimmer/ListTagLoader'))
const SquareItem = dynamic(() => import('../components/Includes/news/SquareItem'),{loading: () => <Loading />})

import queryString from 'query-string';

import isEmpty from 'lodash/isEmpty';
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
    return {
      query: ctx.query, metaOg: error_code ? {} : data.data[0],
      data_category: error_code_category || error_code_kanal ? [] : dataCategory,
      metaSeo: metaSeo[0] || {},
      newsToken: data_news?.data?.news_token || ''
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
    articles_length: 6,
    is_load_more: false,
    user_data: null,
    sticky_category_shown: false,
    assets_url: null
  };

  constructor(props) {
    super(props);
    this.accessToken = null;
    this.platform = null;
    const segments = this.props.router.asPath.split(/\?/);
    if (segments.length > 1) {
      const q = queryString.parse(segments[1]);
      if (q.token) {
        const newsTokenApp = q.token === 'null' ? this.props.newsToken : q.token
        this.accessToken = newsTokenApp;
        setAccessToken(newsTokenApp);
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
      this.setState({ active_tab: tab, sticky_category_shown: false }, () => {
        if (!this.state.articles[tab]) {
          this.loadArticles(tab);
        }
      });
      this.loadContents(tabData.id);
      const href = `/news?subcategory_id=${tabData.id}&subcategory_title=${tabData.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `&token=${this.accessToken}&platform=${this.platform}` : ''}`;
      const as = `/news/${tabData.id}/${tabData.name.toLowerCase().replace(/ +/g, '-')}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`;
      Router.push(href, as)
    }
  }

  loadArticles(categoryId, page = 1) {
    this.setState({ is_articles_loading: true }, () => {
      this.props.getNews(categoryId, this.state.articles_length, page)
        .then(res => {
          const {assets_url} = res.data.meta;
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
            is_load_more: false,
            assets_url: assets_url
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

  componentDidMount() {
    console.log(this.props.metaSeo)
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

  render() {
    // const metadata = this.getMetadata();
    // const ogMetaData = this.getOgMetaData();
    const asPath = this.props.router.asPath;
    const oneSegment = SHARE_BASE_URL.indexOf('//dev-') > -1 ? 'https://dev-webd.rctiplus.com' : SHARE_BASE_URL.indexOf('//rc-') ? 'https://rc-webd.rctiplus.com' : 'https://www.rctiplus.com';
    return (
      <Layout title={this.props?.metaSeo?.title}>
        <Head>
          <meta name="title" content={this.props?.metaSeo?.title} />
          <meta name="description" content={this.props?.metaSeo?.description} />
          <meta name="keywords" content={this.props?.metaSeo?.keyword} />
          <meta property="og:title" content={this.props.metaOg?.title || ''} />
          <meta property="og:description" content={this.props.metaOg?.content?.replace(/(<([^>]+)>)/gi, "") || ''} />
          <meta property="og:image" itemProp="image" content={this.props.metaOg?.cover|| ''} />
          <meta property="og:url" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
          <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
          <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
          <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
          <meta name="twitter:image" content={this.props.metaOg?.cover|| ''} />
          <meta name="twitter:image:alt" content={this.props.metaOg?.title || ''} />
          <meta name="twitter:title" content={this.props.metaOg?.title || ''} />
          <meta name="twitter:description" content={this.props.metaOg?.content?.replace(/(<([^>]+)>)/gi, "") || ''} />
          <meta name="twitter:url" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
          <meta name="twitter:domain" content={`${BASE_URL+encodeURI(this.props.router.asPath)}`} />
          <link rel="canonical" href={oneSegment + encodeURI(asPath).replace('trending/', 'news/')} />
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
        {this.platform === 'ios' || this.platform === 'android' ? '' : (<NavDefault_v2 disableScrollListener />)}
        <div>
          test ini newsv2
        </div>

      </Layout>
    );
  }

}

export default connect(state => state, {
  ...newsv2Actions,
  ...userActions
})(withRouter(Trending_v2));


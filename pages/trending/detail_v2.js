import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { ScrollPercentage } from 'react-scroll-percentage';
import { StickyContainer, Sticky } from 'react-sticky';
import Cookie from 'js-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';

import { DEV_API, BASE_URL, NEWS_API_V2, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, UTM_NAME, SHARE_BASE_URL} from '../../config';

import Layout from '../../components/Layouts/DefaultNews';
// import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';
import NavBackIframe from '../../components/Includes/Navbar/NavIframe';
import AdsBanner from '../../components/Includes/Banner/Ads';
import '../../assets/scss/components/trending_detail.scss';
import '../../assets/scss/responsive.scss';
import NewsDetailContent from "../../components/Includes/news/NewsDetailContent"

import { FacebookShareButton, TwitterShareButton, LineShareButton, WhatsappShareButton } from 'react-share';
// import { ListGroup, ListGroupItem } from 'reactstrap';
// import BottomScrollListener from 'react-bottom-scroll-listener';
import { formatDateWordID } from '../../utils/dateHelpers';
import SquareItem from '../../components/Includes/news/SquareItem';
const HorizontalItem = dynamic(() => import('../../components/Includes/news/HorizontalItem'),{ ssr: false })
import { setAccessToken, removeAccessToken } from '../../utils/cookie';
import { getTruncate, imgURL, imageNews } from '../../utils/helpers';
import { urlRegex } from '../../utils/regex';
import { newsRelatedArticleClicked, newsOriginalArticleClicked, newsArticleShareClicked } from '../../utils/appier';
import newsv2Actions from '../../redux/actions/newsv2Actions';
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray';

// import ShareIcon from '@material-ui/icons/Share';

import queryString from 'query-string';
// import { isIOS } from 'react-device-detect';

class Detail extends React.Component {

    static async getInitialProps(ctx) {
        const programId = ctx.query.id;

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

        const res = await fetch(`${NEWS_API_V2}/api/v2/news/${programId}?page1&pageSize=6`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (data.status.message_client !== "Success") { // server
          ctx.res.writeHead(302, {
            Location: '/news',
          });

          ctx.res.end();
        }
        const res_read_also = await fetch(`${NEWS_API_V2}/api/v1/readalso/${programId}?page1&pageSize=6`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const error_code_read_also = res_read_also.statusCode > 200 ? res_read_also.statusCode : false;
        const read_also = await res_read_also.json();
        // console.log((cdata.content.match(/<p>/g) || []).length)

        if (error_code) {
            return { initial: false };
        }
        if (error_code_read_also) {
            return { read_also: false };
        }

        let kanal = {}
        if (data && data.data && data.data.subcategory_id) {
            const subCategory = await fetch(`${NEWS_API_V2}/api/v1/subcategory/${data.data.subcategory_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': data_news.data.news_token
                }
            });
            let error_code_cat = subCategory.statusCode > 200 ? subCategory.statusCode : false;
            kanal = !error_code_cat ? await subCategory.json() : {}
        }
        return { initial: data, props_id: programId, read_also: read_also, general: gs, kanal: kanal };
    }

    constructor(props) {
        super(props);
        const {props_id, initial} = this.props;
        this.state = {
            trending_detail_id: props_id,
            trending_detail_data: initial.data === undefined ? initial : initial.data,
            assets_url: initial.meta === undefined ? null : (initial.meta.assets_url != undefined ? initial.meta.assets_url : null),
            trending_related: [],
            iframe_opened: false,
            isLike: false,
            scrolled_down: false,
            sticky_share_shown: false,
            listTagByNews: [],
            count: false,
            countLike: 0,
            infographic: this.props.initial.subcategory_id == process.env.NEXT_PUBLIC_INFOGRAPHIC_ID,
            relatedArticlePosition: null,
            documentHeight: null,
        };

        // this.redirectToPublisherIndex = this.getRandom([1, 2, 3, 4], 2);
        this.redirectToPublisherIndex = [0, 1];
        this.accessToken = null;
        this.platform = null;
        this.pushNotif = null;
        const segments = this.props.router.asPath.split(/\?/);
        const segments2 = this.props.router.asPath.split(/\#/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }

            if (q.platform) {
                this.platform = q.platform;
            }
            if(q.push_notif === 'true') {
                this.pushNotif = '/news';
            }
        } else if (segments2.length > 1) {
            const q = queryString.parse(segments2[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }

            if (q.platform) {
                this.platform = q.platform;
            }
            if(q.push_notif === 'true') {
                this.pushNotif = '/news';
            }
        }
        else {
            removeAccessToken();
        }

      this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        const {initial: {data = null}, router: {asPath = null}} = this.props;
        const condition = (!isEmpty(data) && !isEmpty(data.subcategory_name) && !isEmpty(data.title));
        if ((asPath.split('/').length < 6) && condition) {
            location.replace(`${SHARE_BASE_URL}/news/detail/${urlRegex(data.subcategory_name)}/${data.id}/${encodeURI(urlRegex(data.title))}`);
        }

        if(!Cookie.get('uid_ads')) {
            Cookie.set('uid_ads', new DeviceUUID().get())
        }
        if(this.props?.initial?.total_like) {
            this.setState({countLike : this.state.countLike + this.props?.initial?.total_like})
        }
        if(!Cookie.get('is_like_article')) {
          Cookie.set('is_like_article', [{ like: false, news_id: false }])
        }
        const like = JSON.parse(Cookie.get('is_like_article'))

        const cdata = this.state.trending_detail_data;
        const foundLike = like.find(element => element.news_id == cdata.id?.toString())
        this.setState({ isLike: foundLike?.like || false })
        window.onhashchange = () => {
            if (this.state.iframe_opened) {
                this.setState({ iframe_opened: false });
            }
        };
        this.props.getTagByNews(this.state.trending_detail_id).then((res) => {
            this.setState({listTagByNews : res.data})
        }).catch(err => console.err)
        this.props.getRelatedArticles(this.state.trending_detail_id)
            .then(response => {
                // console.log(response);
                if (response.status === 200) {
                    const {assets_url} = response.data.meta
                    this.setState({
                        trending_related: response.data.data,
                        assets_url: assets_url
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
        setTimeout(()=>{
            this.setState({
                documentHeight: document.documentElement.scrollHeight,
            })
        }, 750);
      this.forceUpdateHandler();
    }

    getRandom(arr, n) {
        let result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            let x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
    setLike(e) {
        if(!Cookie.get('is_like_article')) {
          Cookie.set('is_like_article', [{ like: false, news_id: false }])
          return
        }
        let like = JSON.parse(Cookie.get('is_like_article'))
        const device_id = Cookie.get('uid_ads')
        const cdata = this.state.trending_detail_data;

        const id_news = cdata.id?.toString()
        const foundLike = like.find(element => element.news_id == id_news)
        if(like.some((value) => value.news_id == id_news)) {
            const replaceArray = [{ like: !foundLike?.like, news_id: id_news}]
            this.props.setLike(id_news, true, device_id).then((res) => {
                if(!this.state.isLike) {
                    this.setState({countLike : this.state.countLike + 1})
                } else {
                    this.setState({countLike : this.state.countLike - 1})
                }
                Cookie.set('is_like_article', like.map(obj => replaceArray.find(value => value.news_id == obj.news_id || obj)))
                this.setState({ isLike: !foundLike?.like })
            })
            return
        }
        like.push({ like: !foundLike?.like, news_id: id_news})
        this.props.setLike(id_news, true, device_id).then((res) => {
            if(!this.state.isLike) {
                this.setState({countLike : this.state.countLike + 1})
            } else {
                this.setState({countLike : this.state.countLike - 1})
            }
            Cookie.set('is_like_article', like)
            this.setState({ isLike: !foundLike?.like })
        })
    }

    openIframe() {
        this.setState({ iframe_opened: !this.state.iframe_opened }, () => {
            if (this.state.iframe_opened) {
                const cdata = this.state.trending_detail_data;
                newsOriginalArticleClicked(cdata.id, cdata.title, cdata.category_source, 'mweb_news_original_article_clicked');
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            }
        });
    }

    goToDetail(article, index) {
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
        newsRelatedArticleClicked(article.id, article.title, article.category_source, 'mweb_news_related_article_clicked');
        if(this.platform === 'ios') {
            Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
            return false;
        }
        if (this.redirectToPublisherIndex.indexOf(index) != -1) {
            window.open(article.link, '_blank');
        }
        else {
            Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
        }

    }

    newsArticleShareClicked() {
        const cdata = this.state.trending_detail_data;
        newsArticleShareClicked(cdata.id, cdata.title, cdata.category_source, 'mweb_news_share_article_clicked');
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    renderActionButton(scrolledDown) {
        const asPath = this.props.router.asPath;
        const getQryParams = asPath.indexOf('?') > -1 ? asPath.substring(0 , asPath.indexOf('?')) : asPath;
        const URL_SHARE = REDIRECT_WEB_DESKTOP + encodeURI(getQryParams);
        // const URL_SHARE = REDIRECT_WEB_DESKTOP + asPath;
        const cdata = this.state.trending_detail_data;
        let hashtags = ['rcti', 'rctinews'];
        return (
            <div className="sheet-action-button-container" style={{padding: '10px 20px'}}>
              <div className="sheet-wrap-left">
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#034ea1' }}>
                    {this.platform && this.platform == 'ios' ? (
                    <a className="sheet-wrap-link" onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'fb', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-facebook-f"></i>
                    </a>
                    ) : this.platform && (this.platform == 'android') ?
                    (
                        <FacebookShareButton hashtag={hashtags.map(h => '#' + h).join(' ')} quote={`${cdata.title} ${REDIRECT_WEB_DESKTOP + encodeURI(asPath) + UTM_NAME('news', this.props.router.query.id, 'wa', 'android')}`} url={URL_SHARE + UTM_NAME('news', this.props.router.query.id, 'fb', 'android')}>
                            <i className="fab fa-facebook-f"></i>
                        </FacebookShareButton>
                    )
                    :
                    (
                        <FacebookShareButton hashtag={hashtags.map(h => '#' + h).join(' ')} quote={`${cdata.title} ${URL_SHARE + UTM_NAME('news', this.props.router.query.id, 'fb')}`} url={URL_SHARE + UTM_NAME('news', this.props.router.query.id, 'fb')}>
                            <i className="fab fa-facebook-f"></i>
                        </FacebookShareButton>
                    )}

                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#75B73B' }}>
                    {(this.platform) ? (
                        <div onClick={() => {
                            if (this.platform == 'android') {
                                window.open(`https://api.whatsapp.com/send?text=${cdata.title + ' - ' + URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'wa', 'android')}`);
                            }
                            else if (this.platform == 'ios') {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'wa', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                            }
                        }}>
                            <i className="fab fa-whatsapp"></i>
                        </div>
                    ) : (
                        <WhatsappShareButton title={cdata.title} url={REDIRECT_WEB_DESKTOP + encodeURI(asPath) + UTM_NAME('trending', this.props.router.query.id, 'wa')} separator=" - ">
                            <i className="fab fa-whatsapp"></i>
                        </WhatsappShareButton>
                    )}

                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#4a90e2' }}>
                    {this.platform && this.platform == 'ios' ? (
                        <a className="sheet-wrap-link" onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'twit', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-twitter"></i>
                        </a>
                    ) : this.platform && this.platform == 'android' ?
                    (
                        <TwitterShareButton title={cdata.title} url={URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'twit', 'android')} hashtags={hashtags}>
                            <i className="fab fa-twitter"></i>
                        </TwitterShareButton>
                    )
                    :
                    (
                        <TwitterShareButton title={cdata.title} url={REDIRECT_WEB_DESKTOP + encodeURI(asPath) + UTM_NAME('trending', this.props.router.query.id, 'twit')} hashtags={hashtags}>
                            <i className="fab fa-twitter"></i>
                        </TwitterShareButton>
                    )}

                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#75B73B' }}>
                    {this.platform && this.platform == 'ios' ? (
                    <a className="sheet-wrap-link" onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'line', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-line"></i>
                    </a>
                    ) : this.platform && (this.platform == 'android') ?
                        <LineShareButton url={URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'line', 'android')} title={cdata.title}>
                            <i className="fab fa-line"></i>
                        </LineShareButton>
                    : (
                        <LineShareButton url={REDIRECT_WEB_DESKTOP + encodeURI(asPath) + UTM_NAME('trending', this.props.router.query.id, 'line')} title={cdata.title}>
                            <i className="fab fa-line"></i>
                        </LineShareButton>
                    )}

                </div>
                {/* <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: scrolledDown ? '#3a3a3a' : '', float: 'right' }}>
                    <ShareIcon style={{ marginTop: -3 }} onClick={() => {
                        const cdata = this.state.trending_detail_data;
                        if (this.platform && (this.platform == 'android')) {
                            window.AndroidShareHandler.action(URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'all', 'android'), cdata.title);
                        }
                        else {
                            navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'all'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }
                    }}/>
                </div> */}
              </div>
              <div className="sheet-wrap-right">
                { this.state.countLike && this.state.countLike > 0 ? (<div className="total_like">
                    <span>{this.state.countLike}</span>
                </div>) : '' }
                <div onClick={this.setLike.bind(this)} className="sheet-action-button" style={{ background: '#282828', margin: 0 }}>
                    {/*{this.state.isLike ?*/}
                    {/* (<img src={`/share-icon/like.svg`} className="img-height" alt="like-image"/>) :*/}
                    {/* (<img src={`/share-icon/unlike.svg`} className="img-height" alt="unlike-image"/>) }*/}
                    <img src={`/share-icon/like.svg`} className="img-height" alt="like-image"/>
                </div>
                <a className="sheet-wrap-link" onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#282828', marginLeft: 15 }}>
                    <img src="/share-icon/share2.svg" className="img-height" onClick={() => {
                        const cdata = this.state.trending_detail_data;
                        if (this.platform && (this.platform == 'android')) {
                            window.AndroidShareHandler.action(URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'all', 'android'), cdata.title);
                        }
                        else {
                            navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'all'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }
                    }}/>
                </a>
              </div>
            </div>
        );
    }

    shareButtonPosition = el =>{
      window.addEventListener('scroll',()=>{
        const position =  el.getBoundingClientRect().top + window.screen.height;
        this.setState({
          relatedArticlePosition: position,
        });
      });
    }

    render() {
        const cdata = this.state.trending_detail_data;
        const assets_url = this.state.assets_url;
        const isInfographic = this.state.infographic;
        const asPath = this.props.router.asPath;
       // console.log((cdata.content.match(/<p>/g) || []).length)

        const oneSegment = SHARE_BASE_URL.indexOf('//dev-') > -1 ? {
            'desktop': 'https://dev-webd.rctiplus.com',
            'mobile': 'https://dev-webm.rctiplus.com'
        } : SHARE_BASE_URL.indexOf('//rc-') > -1 ? {
            'desktop': 'https://rc-webd.rctiplus.com',
            'mobile': 'https://rc-webm.rctiplus.com'
        } : {
            'desktop': 'https://www.rctiplus.com',
            'mobile': 'https://m.rctiplus.com',
        };

        const currentUrl = oneSegment['mobile'] + encodeURI(asPath).replace('trending/', 'news/');
        const newsTitle = cdata.title.replace(/<\w+>|<\/\w+>/gmi, '');
        const newsContent = cdata.content?.replace( /(<([^>]+)>)/ig, '')
        const coverImg = imgURL(cdata.cover, cdata.image, 100, assets_url, this.props?.general?.img_logo || null)
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "mainEntityOfPage": {
                '@type': 'WebPage',
                "@id": currentUrl
            },
            "headline": newsTitle.replace(/\\/g, ''),
            "image": [coverImg],
            "datePublished": cdata.publish_date, // The date and time the article was first published
            "dateModified": cdata.updated_at, // The date and time the article was most recently modified
            "author": {
                "@type": "Organization",
                "name": cdata.source
            },
            "publisher": {
                "@type": "Organization",
                "name": "RCTI+",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${oneSegment['desktop']}/assets/image/elements/logo.b9f35229.png`
                }
            },
            "description": newsContent
        }
        const canonicalFullUrl = oneSegment['desktop'] + encodeURI(asPath).replace('trending/', 'news/');

        return (
            <Layout title={`${newsTitle} - News+ on RCTI+` || this.props?.kanal?.title}>
                <Head>
                    <meta name="title" content={`${newsTitle} - News+ on RCTI+` || this.props?.kanal?.title} />
                    <meta name="keywords" content={newsTitle || this.props?.kanal?.keyword} />
                    <meta name="description" content={newsContent || this.props?.kanal?.description} />
                    <meta property="og:title" content={`${newsTitle} - News+ on RCTI+`} />
                    <meta property="og:description" content={newsContent} />
                    <meta property="og:image" itemProp="image" content={coverImg} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={this.props?.general?.site_name || SITE_NAME} />
                    <meta property="fb:app_id" content={this.props?.general?.fb_id || GRAPH_SITEMAP.appId} />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={this.props?.general?.twitter_creator || GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={this.props?.general?.twitter_site || GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={cdata.cover} />
                    <meta name="twitter:title" content={`${newsTitle} - News+ on RCTI+`} />
                    <meta name="twitter:image:alt" content={newsTitle} />
                    <meta name="twitter:description" content={newsContent} />
                    <meta name="twitter:url" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <meta name="twitter:domain" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <link rel="canonical" href={canonicalFullUrl} />
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
                {this.state.iframe_opened ? (<NavBackIframe closeFunction={() => {
                    this.setState({ iframe_opened: false });
                }} data={cdata} disableScrollListener />) : (
                    <NavBack
                        pushNotif={this.pushNotif}
                        params={`?token=${this.accessToken}&platform=${this.platform}`}
                        src={`${this.pushNotif}?token=${this.accessToken}&platform=${this.platform}`}
                        data={cdata}
                        titleNavbar={cdata?.source}/>
                )}
                <StickyContainer>
                    <Sticky bottomOffset={100}>
                        { ({ isSticky, wasSticky, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                            const self = this;
                            const hideStickyRatio =  950;
                            if (this.state.relatedArticlePosition < 1400 && this.state.relatedArticlePosition > hideStickyRatio) {
                                // console.log('masuk kondisi if A')
                                setTimeout(() => {
                                    if (self.state.sticky_share_shown) {
                                        self.setState({ sticky_share_shown: false });
                                    }

                                }, 300);
                                return <span></span>;
                            }
                            if (this.state.relatedArticlePosition < hideStickyRatio && this.state.relatedArticlePosition) {
                              // console.log('masuk kondisi if B+')
                                setTimeout(() => {
                                    if (!self.state.sticky_share_shown) {
                                        self.setState({ sticky_share_shown: true });
                                    }

                                }, 300);
                                return (
                                    <div className={`sticky-share-button ${this.state.sticky_share_shown ? 'sticky-share-button-viewed' : ''}`}>
                                        {this.renderActionButton(true)}
                                    </div>
                                );
                            }

                            if (this.state.relatedArticlePosition < this.state.documentHeight && distanceFromTop < -100 && this.state.relatedArticlePosition > 1400 && this.state.relatedArticlePosition) {
                              // console.log('masuk kondisi if B')
                                setTimeout(() => {
                                    if (!self.state.sticky_share_shown) {
                                        self.setState({ sticky_share_shown: true });
                                    }

                                }, 300);
                                return (
                                    <div className={`sticky-share-button ${this.state.sticky_share_shown ? 'sticky-share-button-viewed' : ''}`}>
                                        {this.renderActionButton(true)}
                                    </div>
                                );
                            }
                            if (this.state.relatedArticlePosition < 950 && this.state.relatedArticlePosition) {
                              // console.log('masuk kondisi if C')
                                setTimeout(() => {
                                    if (!self.state.sticky_share_shown) {
                                        self.setState({ sticky_share_shown: true });
                                    }

                                }, 300);
                                return (
                                    <div className={`sticky-share-button ${this.state.sticky_share_shown ? 'sticky-share-button-viewed' : ''}`}>
                                        {this.renderActionButton(true)}
                                    </div>
                                );
                            }
                            // setTimeout(() => {
                            //     console.log('masuk kondisi if Default')
                            //     if (self.state.sticky_share_shown) {
                            //         self.setState({ sticky_share_shown: false });
                            //     }
                            //
                            // }, 300);
                            return <span></span>;
                        } }
                    </Sticky>
                </StickyContainer>
                {this.state.iframe_opened ? (
                    <div className="content-trending-detail" style={{ height: '100vh' }}>
                        <iframe src={cdata.link} style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            margin: 0,
                            padding: 0
                        }} frameBorder="0" type="text/html"></iframe>
                    </div>
                ) : (
                    <ScrollPercentage onChange={(percentage) => {
                        if (percentage > 0.32) {
                            if (!this.state.scrolled_down) {
                                if (!this.state.count) {
                                    this.props.incrementCount(Number(this.state.trending_detail_id))
                                        .then(response => {
                                            console.log(response);
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });

                                    this.setState({ scrolled_down: true, count: true });
                                }
                                else {
                                    this.setState({ scrolled_down: true });
                                }
                            }
                        }
                        else {
                            if (this.state.scrolled_down) {
                                this.setState({ scrolled_down: false });
                            }
                        }
                    }}>
                        {({ ref }) => (
                            <div ref={ref} className="content-trending-detail">
                                <h1 className="content-trending-detail-title"><b dangerouslySetInnerHTML={{ __html: cdata.title?.replace(/\\/g, '') }}></b></h1>
                                <small className="content-trending-detail-create"><strong>{cdata.source}</strong>&nbsp;&nbsp;{formatDateWordID(new Date(cdata.pubDate * 1000))}</small>
                                {this.renderActionButton()}
                                {/* <StickyContainer>
                                    <Sticky>
                                        { ({ distanceFromTop }) => {
                                            if (distanceFromTop < 0) {

                                                return this.renderActionButton();
                                            }
                                            return (this.renderActionButton());
                                        } }
                                    </Sticky>
                                </StickyContainer> */}

                                <div className="content-trending-detail-wrapper">
                                    <div className="content-trending-detail-cover-container">
                                        {
                                            imageNews(cdata.title, cdata.cover, cdata.image, 450, assets_url, 'content-trending-detail-cover')
                                        }
                                    </div>
                                    <NewsDetailContent  item={cdata} />
                                    {/*<div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${cdata.content}` }}></div>*/}
                                    {/* <Link href="#" as={"#"}>
                                        <a> */}
                                            <div onClick={this.openIframe.bind(this)} style={{ color: '#05b5f5', padding: '0 15px' }}>
                                                <i>Original Article</i>
                                            </div>
                                        {/* </a>
                                    </Link> */}
                                    <div className="content-trending-tag" style={{paddingBottom: 0}}>
                                        { this.state.listTagByNews.map((item, index) => {
                                            return (
                                                <div className="content-trending-tag_item" key={index}>
                                                    <Link href={`/news/topic/tag/${item.toLowerCase()}${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
                                                        <h6>{`#${item}`}</h6>
                                                    </Link>
                                                </div>
                                            )
                                        }) }
                                    </div>
                                    <div style={{display: !this.state.sticky_share_shown ? 'block' : 'none', transition: 'all 0.3s ease-in-out'}}>
                                        {this.renderActionButton()}
                                    </div>
                                </div>
                                <div className="ads-banner__detail_news">
                                  <AdsBanner
                                    partner={cdata.source}
                                    path={getPlatformGpt(this.platform)}
                                    size={[300, 250]}
                                    idGpt={process.env.GPT_ID_DETAIL}
                                    setTarget={true}
                                    platform={this.platform}
                                  />
                                  {/* <span>partner: { cdata.source }</span> */}
                                </div>
                                { cdata.exclusive === 'yes' ? (<div />
                                ) : (
                                    <div className="ads-banner__detail_news">
                                        <AdsBanner
                                            partner={cdata.source}
                                            path={getPlatformGpt(this.platform)}
                                            size={[300, 250]}
                                            idGpt={process.env.GPT_ID_DETAIL}
                                            setTarget={true}
                                            platform={this.platform}
                                            idfa={this.state.idfa}
                                            />
                                        {/* <span>partner: { cdata.source }</span> */}
                                    </div>
                                ) }
                                <div className="content-trending-detail-related" ref={this.shareButtonPosition}>
                                    <p className="related-title"><strong>Related Articles</strong></p>
                                    <div className="item_square-wrapper">
                                        {this.state.trending_related.map((item, index) => {
                                            if(index < 4) {
                                                return (
                                                    <SquareItem key={index} item={item} indexKey={index} isIndexKey assets_url={this.state.assets_url} />
                                                );
                                            }
                                        })}
                                    </div>
                                    {!isEmpty(this.state?.trending_related) && this.state?.trending_related.length > 3 && (<div>
                                        <Swiper
                                            spaceBetween={10}
                                            width={242}
                                            height={140}
                                            // onSwiper={(swiper) => console.log(swiper)}
                                            >
                                            {this.state.trending_related.map((item, index) => {
                                                if(index > 4) {
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <HorizontalItem item={item} indexKey={index - 5} isIndexKey assets_url={this.state.assets_url} />
                                                        </SwiperSlide>
                                                    );
                                                }
                                            })}
                                        </Swiper>
                                    </div>)}
                                </div>
                            </div>
                        )}
                    </ScrollPercentage>
                )}
            </Layout>
        );
    }
}

export default connect(state => state, newsv2Actions)(withRouter(Detail));

const getPlatformGpt = (platform) => {
    // webview
      if(platform === 'ios') {
        return process.env.GPT_NEWS_IOS_DETAIL;
      }
      if(platform === 'android') {
        return process.env.GPT_NEWS_ANDROID_DETAIL;
      }
      return process.env.GPT_NEWS_MWEB_DETAIL;
  }

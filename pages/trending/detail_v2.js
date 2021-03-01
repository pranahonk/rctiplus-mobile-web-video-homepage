import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
// import Img from 'react-image';
import { ScrollPercentage } from 'react-scroll-percentage';
import { StickyContainer, Sticky } from 'react-sticky';
import Cookie from 'js-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';

import { DEV_API, BASE_URL, NEWS_API_V2, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, UTM_NAME, SHARE_BASE_URL } from '../../config';

import Layout from '../../components/Layouts/DefaultNews';
// import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';
import NavBackIframe from '../../components/Includes/Navbar/NavIframe';
import AdsBanner from '../../components/Includes/Banner/Ads';
import '../../assets/scss/components/trending_detail.scss';

import { FacebookShareButton, TwitterShareButton, LineShareButton, WhatsappShareButton } from 'react-share';
// import { ListGroup, ListGroupItem } from 'reactstrap';
// import BottomScrollListener from 'react-bottom-scroll-listener';
import { formatDateWordID } from '../../utils/dateHelpers';
import SquareItem from '../../components/Includes/news/SquareItem';
const HorizontalItem = dynamic(() => import('../../components/Includes/news/HorizontalItem'),{ ssr: false })
import { setAccessToken, removeAccessToken } from '../../utils/cookie';
import { getTruncate } from '../../utils/helpers';
import { urlRegex } from '../../utils/regex';
import { newsRelatedArticleClicked, newsOriginalArticleClicked, newsArticleShareClicked } from '../../utils/appier';
import newsv2Actions from '../../redux/actions/newsv2Actions';
import isEmpty from 'lodash/isEmpty'

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

        const res = await fetch(`${NEWS_API_V2}/api/v1/news/${programId}`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        console.log(data);
        if (error_code) {
            return { initial: false };
        }
        return { initial: data, props_id: programId };
    }

    constructor(props) {
        super(props);
        this.state = {
            trending_detail_id: this.props.props_id,
            trending_detail_data: this.props.initial,
            trending_related: [],
            iframe_opened: false,
            isLike: false,
            scrolled_down: false,
            sticky_share_shown: false,
            listTagByNews: [],
            count: false,
            countLike: 0, 
            infographic: this.props.initial.subcategory_id == process.env.NEXT_PUBLIC_INFOGRAPHIC_ID
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
    }

    componentDidMount() {
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
        const foundLike = like.find(element => element.news_id == this.props.initial?.id)
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
                    console.log(response.data.data);
                    this.setState({ trending_related: response.data.data });
                }
            })
            .catch(error => {
                console.log(error);
            });
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
        const id_news = this.props.initial?.id?.toString()
        const foundLike = like.find(element => element.news_id == this.props.initial?.id)
        if(like.some((value) => value.news_id == this.props.initial?.id)) {
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

    renderActionButton(scrolledDown) {
        const asPath = this.props.router.asPath;
        const getQryParams = asPath.indexOf('?') > -1 ? asPath.substring(0 , asPath.indexOf('?')) : asPath;
        const URL_SHARE = REDIRECT_WEB_DESKTOP + encodeURI(getQryParams);
        // const URL_SHARE = REDIRECT_WEB_DESKTOP + asPath;
        const cdata = this.state.trending_detail_data;
        let hashtags = ['rcti', 'rctinews'];
        return (
            <div className="sheet-action-button-container">
              <div className="sheet-wrap-left">
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#034ea1' }}>
                    {this.platform && this.platform == 'ios' ? (
                    <div onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'fb', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-facebook-f"></i>
                    </div>
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
                        <div onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'twit', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-twitter"></i>
                        </div>
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
                    <div onClick={() => {
                                navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: URL_SHARE + UTM_NAME('trending', this.props.router.query.id, 'line', 'ios'),
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }}>
                            <i className="fab fa-line"></i>
                    </div>
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
                    {this.state.isLike ?
                     (<img src={`/share-icon/like.svg`} className="img-height" alt="like-image"/>) :
                     (<img src={`/share-icon/unlike.svg`} className="img-height" alt="unlike-image"/>) }
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#282828', marginLeft: 15 }}>
                    <img src="/share-icon/share.svg" className="img-height" onClick={() => {
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
                </div>
              </div>
            </div>
        );
    }

    render() {
        const cdata = this.state.trending_detail_data;
        const isInfographic = this.state.infographic;
        const asPath = this.props.router.asPath;
        const oneSegment = SHARE_BASE_URL.indexOf('//dev-') > -1 ? 'https://dev-webd.rctiplus.com' : SHARE_BASE_URL.indexOf('//rc-') ? 'https://rc-webd.rctiplus.com' : 'https://www.rctiplus.com';
        const fullUrl = oneSegment + encodeURI(asPath).replace('trending/', 'news/');
        const newsTitle = cdata.title
        const newsContent = cdata.content?.replace( /(<([^>]+)>)/ig, '')
        const converImg = cdata.cover
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "mainEntityOfPage": {
                '@type': 'WebPage',
                "@id": fullUrl
            },
            "headline": newsTitle.replace(/\\/g, ''),
            "image": [converImg],
            "datePublished": cdata.publish_date, // The date and time the article was first published
            "dateModified": cdata.updated_at, // The date and time the article was most recently modified
            "author": {
                "@type": "Person",
                "name": cdata.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "rcti+",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${oneSegment}/assets/image/elements/logo.b9f35229.png`
                }
            },
            "description": newsContent
        }

        return (
            <Layout title={`${newsTitle} - News+ on RCTI+`}>
                <Head>
                    <meta name="title" content={`${newsTitle} - News+ on RCTI+`} />
                    <meta name="keywords" content={newsTitle} />
                    <meta name="description" content={newsContent} />
                    <meta property="og:title" content={`${newsTitle} - News+ on RCTI+`} />
                    <meta property="og:description" content={newsContent} />
                    <meta property="og:image" itemProp="image" content={converImg} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={SITE_NAME} />
                    <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={converImg} />
                    <meta name="twitter:title" content={`${newsTitle} - News+ on RCTI+`} />
                    <meta name="twitter:image:alt" content={newsTitle} />
                    <meta name="twitter:description" content={newsContent} />
                    <meta name="twitter:url" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <meta name="twitter:domain" content={BASE_URL + encodeURI(this.props.router.asPath)} />
                    <link rel="canonical" href={fullUrl} />
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
                        titleNavbar={this.props?.initial?.source}/>
                )}
                <StickyContainer>
                    <Sticky bottomOffset={100}>
                        { ({ isSticky, wasSticky, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                            const self = this;
                            {/* console.log(isSticky, wasSticky, distanceFromTop, distanceFromBottom, calculatedHeight) */}
                            if (distanceFromTop < -650) {
                                setTimeout(() => {
                                    if (self.state.sticky_share_shown) {
                                        self.setState({ sticky_share_shown: false });
                                    }
                                
                                }, 300);
                                return <span></span>;
                            }
                            if (distanceFromTop < -100) {
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
                            setTimeout(() => {
                                if (self.state.sticky_share_shown) {
                                    self.setState({ sticky_share_shown: false });
                                }
                                
                            }, 300);
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
                                    <div className="content-trending-detail-cover-container" style={isInfographic ? null : { paddingBottom: '56.25%' }}>
                                        <img alt={cdata.title} 
                                        style={isInfographic ? null : {
                                            height: '100%',
                                            position: 'absolute'
                                        }}
                                        className="content-trending-detail-cover" src={cdata.cover} />
                                    </div>
                                    <div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${cdata.content}` }}></div>
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
                                { cdata.exclusive === 'yes' ? (<div /> 
                                ) : (
                                    <div className="ads-banner__detail_news">
                                        <AdsBanner 
                                            partner={cdata.source}
                                            path={getPlatformGpt(this.platform)}
                                            size={[300, 250]}
                                            idGpt="div-gpt-ad-1591241112683-0"
                                            />
                                        {/* <span>partner: { cdata.source }</span> */}
                                    </div>
                                ) }
                                <div className="content-trending-detail-related">
                                    <p className="related-title"><strong>Related Articles</strong></p>
                                    <div className="item_square-wrapper">
                                        {this.state.trending_related.map((item, index) => {
                                            if(index < 4) {
                                                return (
                                                <>
                                                    <SquareItem key={index + item.title} item={item} indexKey={index} isIndexKey/>
                                                </>
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
                                                            <HorizontalItem item={item} />
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

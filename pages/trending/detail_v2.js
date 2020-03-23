import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Img from 'react-image';
import { ScrollPercentage } from 'react-scroll-percentage';

import { DEV_API, BASE_URL, NEWS_API_V2 } from '../../config';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';
import NavBackIframe from '../../components/Includes/Navbar/NavIframe';
import '../../assets/scss/components/trending_detail.scss';

import { FacebookShareButton, TwitterShareButton, LineShareButton, WhatsappShareButton } from 'react-share';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { formatDateWordID } from '../../utils/dateHelpers';
import { setAccessToken, removeAccessToken } from '../../utils/cookie';
import { newsRelatedArticleClicked, newsOriginalArticleClicked, newsArticleShareClicked } from '../../utils/appier';
import newsv2Actions from '../../redux/actions/newsv2Actions';

import ShareIcon from '@material-ui/icons/Share';

import queryString from 'query-string';

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
            scrolled_down: false,
            count: false
        };

        this.redirectToPublisherIndex = this.getRandom([1, 2, 3, 4], 2);
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

    componentDidMount() {
        window.onhashchange = () => {
            if (this.state.iframe_opened) {
                this.setState({ iframe_opened: false });
            }
        };

        this.props.getRelatedArticles(this.state.trending_detail_id)
            .then(response => {
                console.log(response);
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

    openIframe() {
        this.setState({ iframe_opened: !this.state.iframe_opened }, () => {
            if (this.state.iframe_opened) {
                const cdata = this.state.trending_detail_data;
                newsOriginalArticleClicked(cdata.id, cdata.title, cdata.category_source, 'mweb_news_original_article_clicked');
            }
        });
    }

    goToDetail(article, index) {
        newsRelatedArticleClicked(article.id, article.title, article.category_source, 'mweb_news_related_article_clicked');
        if (this.redirectToPublisherIndex.indexOf(index) != -1) {
            window.open(article.link, '_blank');
        }
        else {
            Router.push('/trending/detail/' + article.id + '/' + article.title.replace(/ +/g, "-").toLowerCase() + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
        }

    }

    newsArticleShareClicked() {
        const cdata = this.state.trending_detail_data;
        newsArticleShareClicked(cdata.id, cdata.title, cdata.category_source, 'mweb_news_share_article_clicked');
    }

    renderActionButton() {
        const cdata = this.state.trending_detail_data;
        let hashtags = ['rcti', 'rctinews'];
        return (
            <div className="sheet-action-button-container">
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#034ea1' }}>
                    <FacebookShareButton hashtag={hashtags.map(h => '#' + h).join(' ')} quote={`${cdata.title} ${BASE_URL + this.props.router.asPath}`} url={BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))}>
                        <i className="fab fa-facebook-f"></i>
                    </FacebookShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#75B73B' }}>
                    {(this.platform) ? (
                        <div onClick={() => window.open(`https://api.whatsapp.com/send?text=${cdata.title + ' - ' + BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))}`)}>
                            <i className="fab fa-whatsapp"></i>
                        </div>
                    ) : (
                        <WhatsappShareButton title={cdata.title} url={BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))} separator=" - ">
                            <i className="fab fa-whatsapp"></i>
                        </WhatsappShareButton>
                    )}
                    
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#4a90e2' }}>
                    <TwitterShareButton title={cdata.title} url={BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))} hashtags={hashtags}>
                        <i className="fab fa-twitter"></i>
                    </TwitterShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#75B73B' }}>
                    <LineShareButton url={BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))} title={cdata.title}>
                        <i className="fab fa-line"></i>
                    </LineShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: this.state.scrolled_down ? '#3a3a3a' : '', float: 'right' }}>
                    <ShareIcon style={{ marginTop: -3 }} onClick={() => {
                        const cdata = this.state.trending_detail_data;
                        if (this.platform && (this.platform == 'android' || this.platform == 'ios')) {
                            window.AndroidShareHandler.action(BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1)), cdata.title);
                        }
                        else {
                            navigator.share({
                                    title: cdata.title,
                                    text: "",
                                    url: BASE_URL + encodeURI(this.props.router.asPath.substring(0 , this.props.router.asPath.indexOf('?') + 1))
                                })
                                .then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }
                    }}/>
                </div>
            </div>
        );
    }

    render() {
        const cdata = this.state.trending_detail_data;
        // cdata.link = 'https://m.rctiplus.com';

        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <Head>
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
                    <NavBack data={cdata} disableScrollListener />
                )}

                <div className={`sticky-share-button ${this.state.scrolled_down ? 'sticky-share-button-viewed' : ''}`}>
                    {this.renderActionButton()}
                </div>

                {this.state.iframe_opened ? (<iframe src={cdata.link} style={{ width: '100%', minHeight: (this.platform && (this.platform == 'android' || this.platform == 'ios') ? 'calc(100vh)' : 'calc(100vh - 45px)'), paddingTop: 65, marginBottom: (this.platform && (this.platform == 'android' || this.platform == 'ios') ? -55 : 0) }} frameBorder="0" type="text/html"></iframe>) : (
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
                                <h1 className="content-trending-detail-title"><b dangerouslySetInnerHTML={{ __html: cdata.title }}></b></h1>
                                <small className="content-trending-detail-create"><strong>{cdata.source}</strong>&nbsp;&nbsp;{formatDateWordID(new Date(cdata.pubDate * 1000))}</small>
                                {this.renderActionButton()}
                                <div className="content-trending-detail-wrapper">
                                    <div className="content-trending-detail-cover-container">
                                        <img alt={cdata.title} className="content-trending-detail-cover" src={cdata.cover} />
                                    </div>
                                    <div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${cdata.content}` }}></div>
                                    {/* <Link href="#" as={"#"}>
                                        <a> */}
                                            <div onClick={this.openIframe.bind(this)} style={{ color: '#05b5f5', margin: 10, paddingBottom: 20 }}>
                                                <i>Original Article</i>
                                            </div>
                                        {/* </a>
                                    </Link> */}
                                </div>
                                <div className="content-trending-detail-related">
                                    <p className="related-title"><strong>Related Articles</strong></p>
                                    <ListGroup>
                                        {this.state.trending_related.map((article, j) => (
                                            <ListGroupItem key={j} className={`article ${j == this.state.trending_related.length - 1 ? 'article-no-border' : ''}`} onClick={() => this.goToDetail(article, j)}>
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
                                                        <h4 className="article-title" dangerouslySetInnerHTML={{ __html: article.title }}></h4>
                                                    </div>
                                                </div>
                                                <div className="article-source">
                                                    <p><strong>{article.source ? article.source : article.category_source}</strong>&nbsp;&nbsp;</p>
                                                    <p>{formatDateWordID(new Date(article.pubDate * 1000))}</p>
                                                </div>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
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

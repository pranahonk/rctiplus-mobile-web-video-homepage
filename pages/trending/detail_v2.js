import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Img from 'react-image';

import { DEV_API, NEWS_API, BASE_URL, NEWS_API_V2 } from '../../config';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';
import NavBackIframe from '../../components/Includes/Navbar/NavIframe';
import '../../assets/scss/components/trending_detail.scss';

import { FacebookShareButton, TwitterShareButton, EmailShareButton, LineShareButton, WhatsappShareButton } from 'react-share';
import { Row, Col } from 'reactstrap';

import { formatDateTime } from '../../utils/dateHelpers';
import { newsRelatedArticleClicked, newsRateArticleClicked, newsOriginalArticleClicked, newsArticleShareClicked } from '../../utils/appier';
import newsv2Actions from '../../redux/actions/newsv2Actions';

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
            iframe_opened: false
        };

        this.redirectToPublisherIndex = this.getRandom([1, 2, 3, 4], 2);
    }

    componentDidMount() {
        window.onhashchange = () => {
            if (this.state.iframe_opened) {
                this.setState({ iframe_opened: false });
            }
        };

        this.props.incrementCount(Number(this.state.trending_detail_id))
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });

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

        // this.props.getNewsFavoriteStatus(this.state.trending_detail_id)
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
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
            Router.push('/trending/detail/' + article.id + '/' + article.title.replace(/ +/g, "-").toLowerCase());
        }
        
    }

    setNewsFavorite() {
        const cdata = this.state.trending_detail_data;
        // newsRateArticleClicked(cdata.id, cdata.title, 'status_like', 'N/A', 'mweb_news_rate_article_clicked');
        // this.props.setNewsFavorite(this.state.trending_detail_id);
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
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#7ed321' }}>
                    <WhatsappShareButton title={cdata.title} url={BASE_URL + this.props.router.asPath} separator=" - ">
                        <i className="fab fa-whatsapp"></i>
                    </WhatsappShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#034ea1' }}>
                    <FacebookShareButton hashtag={hashtags.map(h => '#' + h).join(' ')} quote={`${cdata.title} ${BASE_URL + this.props.router.asPath}`} url={BASE_URL + this.props.router.asPath}>
                        <i className="fab fa-facebook-f"></i>
                    </FacebookShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#4a90e2' }}>
                    <TwitterShareButton title={cdata.title} url={BASE_URL + this.props.router.asPath} hashtags={hashtags}>
                        <i className="fab fa-twitter"></i>
                    </TwitterShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#b8e986' }}>
                    <LineShareButton url={BASE_URL + this.props.router.asPath} title={cdata.title}>
                        <i className="fab fa-line"></i>
                    </LineShareButton>
                </div>
                <div onClick={this.newsArticleShareClicked.bind(this)} className="sheet-action-button" style={{ background: '#3a3a3a' }}>
                    <EmailShareButton url={BASE_URL + this.props.router.asPath} subject={cdata.title} body={cdata.title + ' ' + BASE_URL + this.props.router.asPath} separator=" - " openWindow>
                        <i className="far fa-envelope"></i>
                    </EmailShareButton>
                </div>

                <div onClick={this.setNewsFavorite.bind(this)} className="sheet-action-button" style={{ float: 'right' }}>
                    {/* <i className="fas fa-heart"></i> */}
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
                    <script dangerouslySetInnerHTML={{ __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-145455301-9');
                    ` }}></script>
                </Head>
                {this.state.iframe_opened ? (<NavBackIframe closeFunction={() => {
                    this.setState({ iframe_opened: false });
                }} data={cdata} disableScrollListener/>) : (
                    <NavBack data={cdata} disableScrollListener/>
                )}
                
                {this.state.iframe_opened ? (<iframe src={cdata.link} style={{ width: '100%', minHeight: 'calc(100vh - 50px)', paddingTop: 65 }} frameBorder="0" type="text/html"></iframe>) : (
                    <div className="content-trending-detail">
                        <h1 className="content-trending-detail-title"><b dangerouslySetInnerHTML={{ __html: cdata.title }}></b></h1>
                        <p className="content-trending-detail-title-src-auth">{cdata.source} | {cdata.author}</p>
                        <small className="content-trending-detail-create">Publish Date : {formatDateTime(new Date(cdata.pubDate * 1000))}</small>
                        {this.renderActionButton()}
                        <div className="content-trending-detail-wrapper">
                            <div className="content-trending-detail-cover-container">
                                <img alt={cdata.title} className="content-trending-detail-cover" src={cdata.cover} />
                            </div>
                            <div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${cdata.content}` }}></div>
                            <Link href="#">
                                <a>
                                    <div onClick={this.openIframe.bind(this)} style={{ color: '-webkit-link', margin: 10, paddingBottom: 20 }}>Original article &gt;</div>
                                </a>
                            </Link>
                        </div>
                        {this.renderActionButton()}
                        <div className="content-trending-detail-related">
                            <p className="related-title"><strong>Related Articles</strong></p>
                            <Row className="related-content" style={{ marginLeft: 0, marginRight: 0 }}>
                                {this.state.trending_related.map((tr, i) => (
                                    <Col xs={6} key={i}>
                                        <div onClick={() => this.goToDetail(tr, i)}><Img className="box-img-trending" 
                                        alt={tr.title}
                                        unloader={<img alt={tr.title} className="box-img-trending" src="/static/placeholders/placeholder_potrait.png"/>}
										loader={<img alt={tr.title} className="box-img-trending" src="/static/placeholders/placeholder_potrait.png"/>}
                                        src={[tr.cover, '/static/placeholders/placeholder_potrait.png']} /><h2 className="font-trending-title-trending-default" dangerouslySetInnerHTML={{ __html: `${tr.title.substring(0, 35)}...` }}></h2></div>
                                    </Col>
                                ))}
                                
                            </Row>
                        </div>
                    </div>
                )}
                
            </Layout>
        );
    }
}

export default connect(state => state, newsv2Actions)(withRouter(Detail));

import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import dynamic from "next/dynamic"
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import Head from 'next/head'
import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, DEV_API, NEWS_API_V2 } from '../../config';

import newsv2Actions from '../../redux/actions/newsv2Actions';
import pageActions from '../../redux/actions/pageActions';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingSearch_v2';

import { Row, Col } from 'reactstrap';
import CloseIcon from '@material-ui/icons/Close';
import '../../assets/scss/components/trending_search.scss';
import { urlRegex } from '../../utils/regex';

import { getCookie, setCookie, removeCookie, removeAccessToken, setAccessToken } from '../../utils/cookie';
import { Subject } from 'rxjs';

import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty'

const Loading = dynamic(() => import('../../components/Includes/Shimmer/ListTagLoader'))
const SquareItem = dynamic(() => import('../../components/Includes/news/SquareItem'),{loading: () => <Loading />})

class Search extends React.Component {
    static async getInitialProps(ctx) {
       const findQueryString = ctx.asPath.split(/\?/);
        if (findQueryString.length > 1) {
            const q = queryString.parse(findQueryString[1]);
            if(q.keyword) {
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

                const res = await fetch(`${NEWS_API_V2}/api/v1/search?q=${q.keyword}&page=1&pageSize=10`, {
                    method: 'GET',
                    headers: {
                        'Authorization': data_news.data.news_token
                    }
                });
                const error_code = res.statusCode > 200 ? res.statusCode : false;
                const data = await res.json();
                // console.log(data)
                return { dataSearch: error_code ? {} : {...data, keyword: q.keyword} }
            }
        }
        return { dataSearch : {} };
    }
    constructor(props) {
        super(props);
        this.state = {
            length: 10,
            search_history: null,
            q: ''
        };

        this.subject = new Subject();
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
        this.props.setQuery(this.props.dataSearch?.keyword || '');
        this.props.getSearchFromServer(this.props.dataSearch)
        const searchHistory = getCookie('SEARCH_HISTORY');
        if (searchHistory) {
            this.setState({ search_history: JSON.parse(searchHistory) });
        }
    }

    link(article) {
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
    }

    bottomScrollFetch() {
        if (this.props.newsv2.query && this.props.newsv2.search_show_more_allowed) {
            this.LoadingBar.continuousStart();
            this.props.searchNews(this.props.newsv2.query, this.props.newsv2.search_page, this.state.length)
                .then(response => {
                    this.LoadingBar.complete();
                })
                .catch(error => {
                    console.log(error);
                    this.LoadingBar.complete();
                });
        }
    }

    deleteSearchHistory(index) {
        let searchHistory = this.state.search_history;
        if (searchHistory && searchHistory.length > 0) {
            searchHistory.splice(index, 1);
            setCookie('SEARCH_HISTORY', searchHistory);
            this.setState({ search_history: searchHistory });
        }
    }

    clearSearchHistory() {
        removeCookie('SEARCH_HISTORY');
        this.setState({ search_history: [] });
    }

    renderSearchHistory() {
        const searchHistory = this.state.search_history;
        if (searchHistory && searchHistory.length > 0) {
            if (this.props.newsv2.search_result.length <= 0 && this.props.newsv2.query.length > 0 && !this.props.newsv2.is_searching) {
                return (<div className="not-found-message">No results found</div>);
            }

            return (
                <div style={{ fontSize: 14 }} className="search-history">
                    <Row>
                        <Col xs={6}>
                            Search History
                        </Col>
                        <Col xs={6} style={{ textAlign: 'right', paddingRight: 15 }}>
                            Clear History
                        </Col>
                    </Row>
                    {searchHistory.map((h, i) => (
                        <Row key={i} style={{ marginTop: 10, opacity: 0.5 }}>
                            <Col xs={6} onClick={() => {
                                this.props.setPageLoader();
                                // TODO:
                                this.props.setSearch(h, this.subject);
                            }}>{h}</Col>
                            <Col xs={6} style={{ textAlign: 'right', paddingRight: 15 }}><CloseIcon onClick={() => this.deleteSearchHistory(i)}/></Col>
                        </Row>
                    ))}
                    
                </div>
            );
        }

        return (
            <div className="not-found-message">
                There is no search history
            </div>
        );
    }

    renderContent() {
        const {search_result, meta = null} = this.props.newsv2
        const assetsUrl = !isEmpty(meta) ? meta.assets_url : null
        if (search_result.length > 0) {
            return (
                <div className="result-content">
                    {search_result.map((article, i) => (
                        <div className="item_square-wrapper" key={i + article.title}>
                            <SquareItem item={article} assets_url={assetsUrl}/>
                        </div>
                    ))}
                </div>
            );
        }
    }

    render() {
        return (
            <Layout title={`Cari berita ${this.props.dataSearch?.keyword || ''} terbaru - News+ on RCTI+`}>
                <Head>
                    <meta name="title" content={`Cari berita ${this.props.dataSearch?.keyword || ''} terbaru - News+ on RCTI+`} />
                    <meta name="description" content={`RCTI+ - Portal berita terbaru dan terpercaya | ${this.props.dataSearch?.keyword || ''}`} />
                    <meta name="keywords" content={'rctiplus'} />
                    <meta property="og:title" content={`Cari berita ${this.props.dataSearch?.keyword || ''} terbaru - News+ on RCTI+`} />
                    <meta property="og:description" content={`RCTI+ - Portal berita terbaru dan terpercaya | ${this.props.dataSearch?.keyword || ''}`} />
                    <meta property="og:image" itemProp="image" content={'https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png'} />
                    <meta property="og:url" content={encodeURI(this.props.router.asPath)} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={'RCTI+'} />
                    <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={'https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png'} />
                    <meta name="twitter:image:alt" content={'News RCTIPlus'} />
                    <meta name="twitter:title" content={`Cari berita ${this.props.dataSearch?.keyword || ''} terbaru - News+ on RCTI+`} />
                    <meta name="twitter:description" content={`RCTI+ - Portal berita terbaru dan terpercaya | ${this.props.dataSearch?.keyword || ''}`} />
                    <meta name="twitter:url" content={encodeURI(this.props.router.asPath)} />
                    <meta name="twitter:domain" content={encodeURI(this.props.router.asPath)} />
                </Head>
                <BottomScrollListener offset={80} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
                <NavBack subject={'ronaldo'}/>
                <main className="content-trending-search">
                    {this.renderContent()}
                </main>
            </Layout>
        );
    }
}

export default connect(state => state, {
    ...newsv2Actions,
    ...pageActions
})(withRouter(Search));

import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import newsv2Actions from '../../redux/actions/newsv2Actions';
import pageActions from '../../redux/actions/pageActions';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavTrendingSearch_v2';

import { Row, Col } from 'reactstrap';
import CloseIcon from '@material-ui/icons/Close';
import '../../assets/scss/components/trending_search.scss';

import { getCookie, setCookie, removeCookie, removeAccessToken, setAccessToken } from '../../utils/cookie';
import { Subject } from 'rxjs';

import queryString from 'query-string';

class Search extends React.Component {

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
        const searchHistory = getCookie('SEARCH_HISTORY');
        if (searchHistory) {
            this.setState({ search_history: JSON.parse(searchHistory) });
        }
    }

    link(article) {
        Router.push('/trending/detail/' + article.id + '/' + article.title.replace(/ +/g, "-").toLowerCase() + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
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
        if (this.props.newsv2.search_result.length > 0) {
            return (
                <div className="result-content">
                    {this.props.newsv2.search_result.map((n, i) => (
                        <Row key={i}>
                            <Col xs={6} onClick={() => this.link(n)}>
                                <Img
                                    alt={n.title}
                                    className="list-item-thumbnail"
                                    src={[n.cover, '/static/placeholders/placeholder_landscape.png']}
                                    loader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
                                    unloader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png" />} />
                            </Col>
                            <Col xs={6}>
                                <p className="item-title" dangerouslySetInnerHTML={{ __html: n.title.length > 60 ? n.title.substring(0, 60).replace(/\\/g, '') + '...' : n.title.replace(/\\/g, '') }} onClick={() => this.link(n)}></p>
                                <p className="item-subtitle"><small>{n.source}</small></p>
                            </Col>
                        </Row>
                    ))}
                </div>
            );
        }

        return this.renderSearchHistory();
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <BottomScrollListener offset={80} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
                <NavBack subject={this.subject}/>
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

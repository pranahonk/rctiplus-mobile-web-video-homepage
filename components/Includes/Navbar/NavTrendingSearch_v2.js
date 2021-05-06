import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import LoadingBar from 'react-top-loading-bar';

import newsv2Actions from '../../../redux/actions/newsv2Actions';
import pageActions from '../../../redux/actions/pageActions';

import '../../../assets/scss/components/navbar-search.scss';

import { Navbar, NavbarBrand, Input } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

import queryString from 'query-string';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { libraryGeneralEvent, searchKeywordEvent, searchBackClicked, newsSearchClicked } from '../../../utils/appier';
import { getCookie, setCookie, removeAccessToken, setAccessToken } from '../../../utils/cookie';


class NavbarTrendingSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
            length: 10
        };

        this.subject = this.props.subject;

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
        // this.props.setQuery(this.props.subject);
        // this.subject
        //     .pipe(debounceTime(1))
        //     .subscribe(() => {
        //         this.props.toggleIsSearching(true);
        //         if (this.props.newsv2.query) {
        //             searchKeywordEvent(this.props.newsv2.query, 'mweb_search_keyword');
        //         }

        //         this.props.searchNews(this.props.newsv2.query, 1, this.state.length)
        //             .then(responses => {
        //                 console.log(responses);
        //                 this.props.unsetPageLoader();
        //                 this.props.toggleIsSearching(false);
        //             })
        //             .catch(error => {
        //                 console.log(error);
        //                 this.props.unsetPageLoader();
        //                 this.props.toggleIsSearching(false);
        //             });
        //     });
      this.props.onRef(this);
    }

  componentWillUnmount() {
      this.props.onRef(undefined);
  }


  saveSearchHistory(q) {
        let searchHistory = getCookie('SEARCH_HISTORY');
        console.log(q);
        if (!searchHistory) {
            setCookie('SEARCH_HISTORY', [q]);
        }
        else {
            searchHistory = JSON.parse(searchHistory);
            if (searchHistory.indexOf(q) === -1) {
                if (searchHistory.length >= 5) {
                    searchHistory.pop();
                }
            }
            else {
                searchHistory.splice(searchHistory.indexOf(q), 1);
            }

            searchHistory.unshift(q);
            setCookie('SEARCH_HISTORY', searchHistory);
        }
    }

    onChangeQuery(e) {
        this.changeQuery(e.target.value);
    }

    changeQuery(q) {
        // this.setState({ q: q });
        this.props.setQuery(q);
    }
    initSearch(q) {
        if (q) {
            let queryParams = `keyword=${q || ''}`
            if (this.accessToken) {
                queryParams += `&token=${this.accessToken}`
                queryParams += `&platform=${this.platform}`
                queryParams += '&footer=0'
            }
            Router.push('/news/search', `/news/search?${queryParams}`)
            this.props.clearSearch();
        }
    }
    search() {
        newsSearchClicked(this.props.newsv2.query, 'mweb_news_search_clicked');
        let q = this.props.newsv2.query.trim();
        this.initSearch(q)
    }

    clearKeyword() {
        this.props.clearSearch();
        this.props.setQuery('');
        searchKeywordEvent(this.props.newsv2.query, 'mweb_search_clear_keyword_clicked');
        this.initSearch('')
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.search()
        }
    }
  handleFocusParent = (e) =>{
      this.props.isChildFocus(true)
      e.preventDefault();
  }

    render() {
        const { forwardedRef } = this.props;
        return (
            <div className="nav-home-container nav-fixed-top">
                <Navbar style={{ backgroundColor: '#171717' }} expand="md" className={'nav-container nav-shadow nav-search'}>
                    <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand onClick={() => {
                                if (this.props.router.asPath.indexOf('/explores') === 0) {
                                    searchBackClicked(this.props.newsv2.query, 'mweb_search_back_clicked');
                                }
                                Router.back();
                            }} style={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="middle-top">
                        <Input
                            style={{ backgroundColor: '#171717 !important', borderBottom: '1px solid white !important', borderRadius: '0 !important' }}
                            onClick={() => libraryGeneralEvent('mweb_library_search_form_clicked')}
                            placeholder="Search"
                            onChange={this.onChangeQuery.bind(this)}
                            value={this.props.newsv2.query}
                            onKeyPress={this.handleKeyPress}
                            id="search-news-input"
                            className="search-input"
                            onFocus={this.handleFocusParent}
                            ref={forwardedRef}
                        />
                    </div>
                    <div className="right-top-link">
                        <div className="btn-link-top-nav">
                            <NavbarBrand style={{ color: 'white' }}>
                                <CloseIcon style={{ fontSize: 20, marginRight: 10, visibility: (this.props.newsv2.query?.length > 0 ? 'visible' : 'hidden') }} onClick={this.clearKeyword.bind(this)}/>
                                <SearchIcon style={{ fontSize: 20 }} onClick={() => this.search()} />
                            </NavbarBrand>
                        </div>
                    </div>
                </Navbar>
                <StatusNotification />
            </div>
        );
    }
}
export default connect(state => state, {
    ...newsv2Actions,
    ...pageActions
})(withRouter(NavbarTrendingSearch));

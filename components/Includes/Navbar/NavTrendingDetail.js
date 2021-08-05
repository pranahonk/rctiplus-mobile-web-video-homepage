import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie, setAccessToken } from '../../../utils/cookie';
import { newsArticleBackClicked } from '../../../utils/appier';

import '../../../assets/scss/components/navbar_trending_detail.scss';
import '../../../assets/scss/responsive.scss';

import { Navbar, NavbarBrand, Col, Row } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StatusNotification from './StatusNotification';
import { isIOS, isAndroid } from 'react-device-detect';
import queryString from "query-string";

class NavTrendingSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };
        this.accessToken = null;
        this.platform = null;
        this.core_token = null;
        const segments = this.props.router.asPath.split(/\?/);
        this.idfa = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }
            if (q.core_token) {
                this.core_token = q.core_token;
            }
            if (q.platform) {
                this.platform = q.platform;
            }
            if (q.idfa) {
                this.idfa = q.idfa;
            }
        }
    }

    signOut() {
        if (this.state.token) {
            this.props.setPageLoader();
            const deviceId = new DeviceUUID().get();
            this.props
                .logout(deviceId)
                .then(() => {
                    this.props.unsetPageLoader();
                    Router.push('/login');
                })
                .catch(error => {
                    console.log(error);
                    this.props.unsetPageLoader();
                    removeCookie('ACCESS_TOKEN');
                });
        }
        else {
            Router.push('/login');
        }
    }

    redirectURL(){
        return '/news' + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&header=0&idfa=${this.idfa ? this.idfa : '00000000-0000-0000-0000-000000000000'}&core_token=${this.core_token ? this.core_token : process.env.CORE_TOKEN}` : ''}`
    }

    componentDidMount() {
        if (!this.props.disableScrollListener) {
            document.addEventListener('scroll', () => {
                const isTop = window.scrollY < 10;
                if (isTop !== this.state.is_top) {
                    this.setState({is_top: isTop});
                }
            });
        } else {
            this.setState({is_top: false});
        }
    }

    render() {
        return (
                <div className={"nav-home-container nav-fixed-top"}>
                    <Navbar expand="md" className={'nav-trending-detail nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                        <div className="wr-col-trn-search">
                            <Col xs="12">
                                {
                                    this.platform === 'android' ?
                                        <a href={this.redirectURL()} style={{color: 'white'}} className="navbar-brand"> <ArrowBackIcon/> <span className="trendingHeader"></span> </a> :
                                        <NavbarBrand onClick={() => {
                                            this.props.setPageLoader();
                                            let platform = isIOS ? 'ios' : isAndroid ? 'android' : 'mweb';
                                            const params = new URLSearchParams(window.location.search);
                                            if (this.props.data && this.props.router.asPath.indexOf('/news/detail') === 0 && this.props.router.asPath.indexOf('utm_source') === -1) {
                                                newsArticleBackClicked(this.props.data.id, this.props.data.title, this.props.data.category_source, 'mweb_news_article_back_clicked');
                                                if(!document.referrer.includes("rctiplus")){
                                                    Router.push('/news' + `${params.get('token') ? `?token=${params.get('token')}&platform=${params.get('platform')}&header=0&idfa=${params.get('idfa') ? params.get('idfa') : '00000000-0000-0000-0000-000000000000'}&core_token=${params.get('core_token') ? params.get('core_token') : process.env.CORE_TOKEN}` : ''}`);
                                                }else{
                                                    Router.back();
                                                }

                                            }
                                            else if (this.props.router.asPath.indexOf('utm_source') > -1) {
                                                let Isplatform = this.props.router.asPath.indexOf('RplusaOsApp') > -1 ? `?platform=${platform}` : '';
                                                Router.push('/news' + `${params.get('token') ? `?token=${params.get('token')}&platform=${params.get('platform')}&header=0&idfa=${params.get('idfa') ? params.get('idfa') : '00000000-0000-0000-0000-000000000000'}&core_token=${params.get('core_token') ? params.get('core_token') : process.env.CORE_TOKEN}` : ''}`);
                                            }
                                            else {
                                                Router.back();
                                            }
                                        }} style={{color: 'white'}}>
                                            <ArrowBackIcon/> <span className="trendingHeader"></span>
                                        </NavbarBrand>
                                }
                            </Col>
                            <div className="navbar-interest__topic" >
                                <h1>{!this.state.is_top ? this.props.titleNavbar || '' : ''}</h1>
                            </div>
                        </div>
                    </Navbar>
                    <StatusNotification />
                </div>
                );
    }
}
export default connect(state => state, {
    ...actions,
    ...pageActions
})(withRouter(NavTrendingSearch));

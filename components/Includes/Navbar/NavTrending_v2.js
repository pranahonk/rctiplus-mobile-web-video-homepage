import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Link from 'next/link';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie, removeAccessToken, setAccessToken } from '../../../utils/cookie';
import '../../../assets/scss/components/navbar.scss';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';

import { newsGeneralEvent } from '../../../utils/appier';

import queryString from 'query-string';

class NavTrending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };
        
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

    signOut() {
        if (this.state.token) {
            this.props.setPageLoader();
            const deviceId = new DeviceUUID().get();
            this.props
                .logout(deviceId)
                .then(response => {
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

    goToHome() {
        newsGeneralEvent('mweb_news_logo_clicked');
        if (!this.platform) {
            Router.push('/');
        }
        
    }

    componentDidMount() {
        if (!this.props.disableScrollListener) {
            document.addEventListener('scroll', () => {
                const isTop = window.scrollY < 150;
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
                <div className="nav-home-container nav-fixed-top">
                    <Navbar expand="md" className={'nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                        <div className="left-top-link">
                            <div className="logo-top-wrapper">
                                <NavbarBrand onClick={this.goToHome.bind(this)}>
                                    <img className="logo-top" src="/static/logo/rcti-sm.png" alt="Logo RCTI+"/>
                                </NavbarBrand>
                            </div>
                        </div>
                        <div className="right-top-link">
                            {this.state.token ? (
                                <div className="btn-link-top-nav">
                                    <Link href={"/trending/search" + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
                                        <SearchIcon style={{fontSize: 20, marginRight: 10}}/>
                                    </Link>
                                </div>
                            ) : (
                                <div className="btn-link-top-nav">
                                    <NavbarBrand style={{color: 'white'}} href={"/trending/search_v2" + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`}>
                                        <SearchIcon style={{fontSize: 20}}/>
                                    </NavbarBrand>
                                </div>
                            )}
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
})(withRouter(NavTrending));

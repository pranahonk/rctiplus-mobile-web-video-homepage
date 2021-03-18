import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import Link from 'next/link';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import '../../../assets/scss/components/navbar.scss';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';

import { newsGeneralEvent } from '../../../utils/appier';

class NavTrending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };
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
        Router.push('/');
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
                                    <Link href="/news/search">
                                        <SearchIcon style={{fontSize: 20, marginRight: 10}}/>
                                    </Link>
                                </div>
                            ) : (
                                <div className="btn-link-top-nav">
                                    <NavbarBrand style={{color: 'white'}} href="/news/search">
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
})(NavTrending);

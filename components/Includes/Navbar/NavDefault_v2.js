import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Image from "next/image"
import Link from "next/link"

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';
import cookie from 'js-cookie';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent, newsGeneralEvent } from '../../../utils/appier';
import '../../../assets/scss/components/navbar-v2.scss';

import { Navbar, NavbarBrand, Button, Row, Col } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import {LINK_RADIO, LINK_GAMES, LINK_HOT, LINK_NEWS} from '../../../config';
import { isIOS, isAndroid } from 'react-device-detect';



class NavbarDef_v2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };
    }

    goToHome() {
        switch (this.props.router.asPath) {
            case '/exclusive':
                exclusiveGeneralEvent('mweb_exclusive_logo_clicked');
                break;

            case '/profile':
                accountGeneralEvent('mweb_account_logo_clicked');
                break;

            default:
                if (this.props.router.asPath.indexOf('/news') === 0) {
                    newsGeneralEvent('mweb_news_logo_clicked');
                }
                else {
                    homeGeneralClicked('mweb_homepage_logo_clicked');
                }
                break;
        }

        Router.push('/');
    }

    goToExplore(e) {
        if(e.includes('/news')) {
          const params = new URLSearchParams(window.location.search);
          Router.push('/news/search' + `${params.get('token') ? `?token=${params.get('token')}&platform=${params.get('platform')}&core_token=${params.get('core_token')}` : ''}`);
        } else {
            Router.push('/explores/search');
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
                    this.props.unsetPageLoader();
                    removeCookie('ACCESS_TOKEN');
                });
        }
        else {
            Router.push('/login');
        }
    }

    componentDidMount() {
        this.setState({token: this.getToken()});
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

    getToken() {
        const accessToken = cookie.getJSON('ACCESS_TOKEN');
        const visitorToken = cookie.getJSON('VISITOR_TOKEN') && cookie.getJSON('VISITOR_TOKEN').VALUE
        return accessToken ? accessToken : visitorToken;
    }

    navMenuIcons() {
        const iconData = [
            {
                href: "/",
                service: "video",
                isActive: true,
                newPage: false
            },
            {
                href: "https://m.rctiplus.com/news",
                service: "news",
                isActive: false,
                newPage: false
            },
            {
                href: `${LINK_RADIO}/?token=${this.getToken()}`,
                service: "audio",
                isActive: false,
                newPage: false
            },
            {
                href: LINK_HOT,
                service: "hot",
                isActive: false,
                newPage: false
            },
            {
                href: LINK_GAMES,
                service: "games",
                isActive: false,
                newPage: true
            },
        ]
        return iconData.map(({ href, service, isActive, newPage }, i) => {
            const activeSrcSuffix = isActive ? "_active" : ""
            return (
                <Link href={href} key={i} passHref>
                    <a href={href} target={newPage ? "_blank" : "_self"}>
                        <Image
                            src={`/icons-menu/${service}plus${activeSrcSuffix}.svg`}
                            alt={`${service}+`}
                            width={67}
                            height={20}
                            />
                    </a>
                </Link>
            )
        })
    }

    render() {
        return (
            <div className="nav-home-container-v2 nav-fixed-top" id="navbar">
                <div style={{ display: this.props.showStickyInstall ? 'block' : 'none' }} className="sticky-install-menu">
                    <Row style={{ height: '100%', paddingRight: 5 }}>
                        <Col xs={2} className="center-content" style={{ paddingRight: 0 }}>
                            <CloseIcon onClick={() => {
                                homeGeneralClicked('mweb_homepage_close_install_button_clicked');
                                this.props.closeStickyInstallFunction(this.props.parent);
                            }}/>
                        </Col>
                        <Col xs={6} className="center-content install-description">
                            <img className="install-logo" src="/static/logo/rcti-sm.png" alt="Logo RCTI+"/>
                            Lebih Asyik Nonton dengan Aplikasi RCTI+
                        </Col>
                        <Col xs={4} className="center-content" >
                            <Button onClick={() => {
                                homeGeneralClicked('mweb_homepage_install_button_clicked');
                                window.open('https://onelink.to/apprctiplus', '_blank');
                            }} className="btn-next" style={{ borderRadius: 3 }} size="sm">Install</Button>
                        </Col>
                    </Row>
                </div>
                <Navbar expand="md" className={'nav-container nav-shadow'}>
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand>
                                <img id="logo-rcti" className="logo-top" src="/static/logo/rcti-sm.png" width="28" height="28" alt="logo RCTI+" />
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="middle-top">
                        <div
                            id="search-input"
                            className="search-input"
                            onClick={this.goToExplore.bind(this, this.props.router.asPath)}>
                            <div className="search-input-placeholder">rctiplus.com</div> <SearchIcon style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div>
                    <div id="menu-allpillars" className="nav-menu-container">
                        {this.navMenuIcons()}
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
})(withRouter(NavbarDef_v2));

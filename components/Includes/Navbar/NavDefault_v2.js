import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';
import cookie from 'js-cookie';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent, newsGeneralEvent } from '../../../utils/appier';
import '../../../assets/scss/components/navbar-v2.scss';
import ActiveLink from '../Navbar/ActiveLink';

import { Navbar, NavbarBrand, Button, Row, Col } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { json } from 'body-parser';
import {LINK_RADIO, LINK_GAMES, LINK_HOT, LINK_NEWS} from '../../../config';


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
        // switch (e) {
        //     case ['/' , '/explores' , '/live-event' , '/exclusive'].includes(e) :
        //         Router.push('/explores/search');
        //     break;
        //     case '/radio' :
        //         Router.push('/radio/search');
        //     break;
        //     default:
        //         Router.push('/news/search');
        // }
        // switch (this.props.router.asPath) {
        //     case '/exclusive':
        //         exclusiveGeneralEvent('mweb_exclusive_library_clicked');
        //         break;

        //     case '/profile':
        //         accountGeneralEvent('mweb_account_library_clicked');
        //         break;

        //     case '/':
        //         homeGeneralClicked('mweb_search_clicked');
        //         break;
        //     case '/news':
        //         Router.push('/news/search');
        //         // homeGeneralClicked('mweb_search_clicked');
        //         break;

        //     // default:
        //     //     if (this.props.router.asPath.indexOf('/news') === 0) {
        //     //         // newsGeneralEvent('mweb_news_search_clicked');
        //     //     }
        //     //     else {
        //     //         homeGeneralClicked('mweb_library_clicked');
        //     //     }
        //     //     break;
        // }
        // if (e.includes('/news/')) {
        //     Router.push('/news/search');
        //     return;
        // }
        // switch (e) {
        //     case '/' || '/explores' || '/live-event' || '/exclusive' :
        //         Router.push('/explores/search');
        //     break;
        //     case '/radio' :
        //         Router.push('/radio/search');
        //     break;
        //     default:
        //         Router.push('/news/search');
        // }
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

    componentDidMount() {
        // console.log(cookie.getJSON('ACCESS_TOKEN'))
        // console.log(cookie.getJSON('VISITOR_TOKEN').VALUE)
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
        // const accessToken = cookie.getJSON('ACCESS_TOKEN') && cookie.getJSON('ACCESS_TOKEN').VALUE
        const visitorToken = cookie.getJSON('VISITOR_TOKEN') && cookie.getJSON('VISITOR_TOKEN').VALUE
        return accessToken ? accessToken : visitorToken;
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
                                window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank');
                            }} className="btn-next" style={{ borderRadius: 3 }} size="sm">Install</Button>
                        </Col>
                    </Row>
                </div>
                <Navbar expand="md" className={'nav-container nav-shadow'}>
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand>
                                <img className="logo-top" src="/static/logo/rcti-sm.png" width="28" height="28" alt="logo RCTI+" />
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="middle-top">
                        <div className="search-input" onClick={this.goToExplore.bind(this, this.props.router.asPath)}>
                            <div className="search-input-placeholder">rctiplus.com</div> <SearchIcon style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="nav-menu-container">
                        <ActiveLink activeClassName="active" href="/" activeMenu={'home' + this.props.router.asPath}>
                            <Button outline className="btn-nav-menu">
                                <img alt="Video+" className="icon-menu-top" src={'/icons-menu/videoIcon.svg'} alt="video" width="30" height="30" />
                                <label>Video+</label>
                            </Button>
                        </ActiveLink>
                        <Button outline className="btn-nav-menu" onClick={() => window.location.href = `${LINK_NEWS}`}>
                            <img alt="News+" className="icon-menu-top" src={'/icons-menu/newsIcon.svg'}  width="30" height="30" />
                            <label>News+</label>
                        </Button>
                        {/* <ActiveLink activeClassName="active" href="/radio" activeMenu={'radio' + this.props.router.asPath}>
                            <Button outline className="btn-nav-menu">
                                <img className="img-menu-icon" src={'/radio.png'}/>
                                Radio +
                            </Button>
                        </ActiveLink> */}
                        <Button outline className="btn-nav-menu" onClick={() => window.location.href = `${LINK_RADIO}?token=${this.state.token}`}>
                            <img alt="Radio+" className="icon-menu-top" src={'/icons-menu/radioIcon.svg'} alt="radio" width="30" height="30" />
                            <label>Radio+</label>
                        </Button>
                        <Button outline className="btn-nav-menu" onClick={() => window.location.href = `${LINK_HOT}?token=${this.state.token}`}>
                            <img className="icon-menu-top" src={'/icons-menu/hotIcon.svg'} alt="hot" width="30" height="30" />
                            <label>HOT</label>
                        </Button>
                        <Button outline className="btn-nav-menu" onClick={() => window.open(LINK_GAMES, "_blank").focus()}>
                            <img className="icon-menu-top" src={'/icons-menu/gamesIcon.svg'} alt="games" width="30" height="30" />
                            <label>Games+</label>
                        </Button>
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

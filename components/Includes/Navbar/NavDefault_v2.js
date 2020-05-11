import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent, newsGeneralEvent } from '../../../utils/appier';
import '../../../assets/scss/components/navbar-v2.scss';

import { Navbar, NavbarBrand, Button, Row, Col } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';


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
                if (this.props.router.asPath.indexOf('/trending') === 0) {
                    newsGeneralEvent('mweb_news_logo_clicked');
                }
                else {
                    homeGeneralClicked('mweb_homepage_logo_clicked');
                }
                break;
        }
        
        Router.push('/');
    }

    goToExplore() {
        switch (this.props.router.asPath) {
            case '/exclusive':
                exclusiveGeneralEvent('mweb_exclusive_library_clicked');
                break;

            case '/profile':
                accountGeneralEvent('mweb_account_library_clicked');
                break;

            case '/':
                homeGeneralClicked('mweb_search_clicked');
                break;
            
            default:
                if (this.props.router.asPath.indexOf('/trending') === 0) {
                    // newsGeneralEvent('mweb_news_search_clicked');
                }
                else {
                    homeGeneralClicked('mweb_library_clicked');
                }
                break;
        }
        
        Router.push('/explores')
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
            <div className="nav-home-container-v2 nav-fixed-top">
                <div style={{ display: this.props.showStickyInstall ? 'block' : 'none' }} className="sticky-install-menu">
                    <Row style={{ height: '100%', paddingRight: 5 }}>
                        <Col xs={2} className="center-content" style={{ paddingRight: 0 }}>
                            <CloseIcon onClick={() => {
                                homeGeneralClicked('mweb_homepage_close_install_button_clicked');
                                this.props.closeStickyInstallFunction(this.props.parent);
                            }}/>
                        </Col>
                        <Col xs={6} className="center-content install-description">
                            <img className="install-logo" src="/static/logo/rcti-sm.png" />
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
                <Navbar expand="md" className={'nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand onClick={this.goToHome.bind(this)}>
                                <img className="logo-top" src="/static/logo/rcti-sm.png" />
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="middle-top">
                        <div className="search-input" onClick={this.goToExplore.bind(this)}>
                            <div className="search-input-placeholder">rctiplus.com</div> <SearchIcon style={{ fontSize: '1.5rem' }} />
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
})(withRouter(NavbarDef_v2));

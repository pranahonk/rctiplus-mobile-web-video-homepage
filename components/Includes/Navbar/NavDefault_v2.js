import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';
import '../../../assets/scss/components/navbar-v2.scss';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';


class NavbarDef_v2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };

        console.log();
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
                homeGeneralClicked('mweb_homepage_logo_clicked');
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

            default:
                homeGeneralClicked('mweb_library_clicked');
                break;
        }
        
        homeGeneralClicked('mweb_search_clicked');
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
                <Navbar expand="md" className={'nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand onClick={this.goToHome.bind(this)}>
                                <img className="logo-top" src="/static/logo/rcti.png" />
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

import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import { getCookie, removeCookie } from '../../../utils/cookie';
//import '../../../assets/scss/components/navbar.scss';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';


class NavbarDef extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true
        };
    }

    signOut() {
        const deviceId = 1;
        this.props
                .logout(deviceId)
                .then(() => {
                    Router.push('/signin');
                })
                .catch(error => {
                    removeCookie('ACCESS_TOKEN');
                });
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
                                <NavbarBrand href="/">
                                    <img className="logo-top" src="/static/logo/rcti.png" />
                                </NavbarBrand>
                            </div>
                        </div>
                        <div className="right-top-link">
                            <div className="btn-link-top-nav">
                                {this.state.token ? (
                                    <NavbarBrand style={{color: 'white', fontSize: 13}} onClick={this.signOut.bind(this)} href="#">
                                        Sign Out
                                    </NavbarBrand>
                                ) : (
                                    <NavbarBrand style={{color: 'white', fontSize: 13}} href="/signin">Sign In</NavbarBrand>
                                )}
                                <NavbarBrand style={{color: 'white'}} href="/explore">
                                    <SearchIcon style={{fontSize: 20}}/>
                                </NavbarBrand>
                            </div>
                        </div>
                    </Navbar>
                    <StatusNotification />
                </div>
                );
    }
}
export default connect(state => state, actions)(NavbarDef);

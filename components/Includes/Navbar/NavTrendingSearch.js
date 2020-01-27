import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import '../../../assets/scss/components/navbar_trending_search.scss';

//load reactstrap
import { Navbar, NavbarBrand, Col, Row } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';


class NavTrendingSearch extends Component {
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
                        <Row className="wr-col-trn-search">
                            <Col xs="2">
                                <NavbarBrand onClick={() => Router.back()} style={{color: 'white'}}>
                                <ArrowBackIcon/>
                            </NavbarBrand>
                            </Col>
                            <Col xs="8" className="input_trending_search">
                                <input type="text" name="trending_search" className="trending_search"/>
                            </Col>
                            <Col xs="2" className="btn-link-top-nav">
                                <NavbarBrand style={{color: 'white'}} href="/trending/search">
                                    <SearchIcon style={{fontSize: 20}}/>
                                </NavbarBrand>
                            </Col>
                        </Row>
                    </Navbar>
                    <StatusNotification />
                </div>
                );
    }
}
export default connect(state => state, {
    ...actions,
    ...pageActions
})(NavTrendingSearch);

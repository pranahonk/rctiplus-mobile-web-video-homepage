import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { newsArticleBackClicked } from '../../../utils/appier';

import '../../../assets/scss/components/navbar_trending_detail.scss';

import { Navbar, NavbarBrand, Col, Row } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StatusNotification from './StatusNotification';
import { isIOS, isAndroid } from "react-device-detect";

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
                <div className={"nav-home-container nav-fixed-top"}>
                    <Navbar expand="md" className={'nav-container nav-trending-detail nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                        <Row className="wr-col-trn-search">
                            <Col xs="12">
                                <NavbarBrand onClick={() => {
                                    if (this.props.data && this.props.router.asPath.indexOf('/news/detail') === 0) {
                                        newsArticleBackClicked(this.props.data.id, this.props.data.title, this.props.data.category_source, 'mweb_news_article_back_clicked');
                                    }
                                    if (
                                        this.props.router.asPath.indexOf('utm_source') > -1 &&
                                        this.props.router.asPath.indexOf('platform') > -1 &&
                                        this.props.router.asPath.indexOf('utm_medium') > -1
                                    ) {
                                        let platform = isIOS ? 'ios' : isAndroid ? 'android' : 'mweb';
                                        Router.push(`/news?platform=${platform}`);
                                    } else {
                                        document.referrer.length === 0 || document.referrer.indexOf(Router.router.query.id) > -1 ? Router.push('/news'): Router.back()
                                    }
                                }} style={{color: 'white'}}>
                                <ArrowBackIcon/> <span className="trendingHeader"></span>
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
})(withRouter(NavTrendingSearch));

import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import pageActions from '../../../redux/actions/pageActions';

import { getCookie, removeCookie } from '../../../utils/cookie';
import { newsArticleBackClicked } from '../../../utils/appier';

import '../../../assets/scss/components/navbar_iframe.scss';

import { Navbar, NavbarBrand, Col, Row } from 'reactstrap';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CloseIcon from '@material-ui/icons/Close';
import StatusNotification from './StatusNotification';


class NavTrendingSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: getCookie('ACCESS_TOKEN'),
            is_top: true,
            title_max_length: 30
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
                <Navbar expand="md" className={'navbar-iframe nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
                    <Row>
                        <Col xs="12">
                            <NavbarBrand style={{color: 'white'}}>
                                <ArrowBackIosIcon onClick={() => {
                                    if (this.props.data && this.props.router.asPath.indexOf('/news/detail') === 0) {
                                        newsArticleBackClicked(this.props.data.id, this.props.data.title, this.props.data.category_source, 'mweb_news_article_back_clicked');
                                    }
                                    this.props.closeFunction();
                                }}/> 
                                <ArrowForwardIosIcon style={{ visibility: 'hidden' }}/> 
                                <div className="trendingHeader">
                                    <span style={{ color: '#282828', fontWeight: 600 }}>{this.props.data.title.length > this.state.title_max_length ? this.props.data.title.substring(0, this.state.title_max_length) + '...' : this.props.data.title}</span><br/>
                                    <span>{this.props.data.link.length > this.state.title_max_length ? this.props.data.link.substring(0, this.state.title_max_length) + '...' : this.props.data.link}</span>
                                </div>
                                <img src="/share-ios.png" style={{ minWidth: 20, maxWidth: 20, height: 20, marginLeft: 5, marginRight: 5 }} onClick={() => {
                                    navigator.share({
                                        title: this.props.data.title,
                                        text: "",
                                        url: this.props.data.link
                                    }).then(() => console.log('Successful share'))
                                    .catch(error => console.log('Error sharing:', error));
                                }}/>
                                <CloseIcon onClick={() => this.props.closeFunction()} style={{ fontSize: '2rem', color: '#393939' }}/>
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

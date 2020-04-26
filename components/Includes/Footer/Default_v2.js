import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';

import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import { Badge } from 'reactstrap';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import LiveEventIcon from '../Common/LiveEventIcon';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';
import LiveStreamIcon from '../Common/LiveStream';

import { getCookie } from '../../../utils/cookie';

class FooterNav_v2 extends Component {

    isProfileComplete() {
        if (this.props.user && this.props.user.data) {
            const data = this.props.user.data
			return data.nickname && data.display_name && data.email && data.phone_number && data.dob && data.gender && data.photo_url;
        }

        return true;
	}

    componentDidMount() {
        this.props.getUserData();
        Router.events.on("routeChangeStart", () => {
            const convivaSessionId = getCookie('CONVIVA_SESSION_ID');
            if (convivaSessionId != null) {
                Conviva.LivePass.cleanupSession(convivaSessionId);
            }
        });
    }

    render() {
        return (
            <div className="nav-footer-v2">
                <div className="footer-wrapper-list">
                    <div onClick={() => {
                        homeGeneralClicked('mweb_home_clicked');
                        switch (this.props.router.asPath) {
                            case '/radio':
                                window.location.href = '/';
                                break

                            default:
                                Router.push('/');
                                break;
                        }
                    }}>
                        <a>
                            <HomeIcon className="nav-footer-icon" />
                            <br />
                            Home
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div onClick={() => {
                        homeGeneralClicked('mweb_liveevent_clicked');
                        Router.push('/live-event');
                    }}>
                        <a>
                            <LiveEventIcon marginBottom="3px" />
                            <br />
                            Live Event
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div onClick={() => {
                        homeGeneralClicked('mweb_livetv_clicked');
                        Router.push('/tv/rcti');
                    }}>
                        <a>
                            <ImportantDevicesIcon className="nav-footer-icon" />
                            <br />
                            LiveTV
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div onClick={() => {
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

                        switch (this.props.router.asPath) {
                            case '/radio':
                            case '/profile':
                                window.location.href = '/explores';
                                break

                            default:
                                Router.push('/explores');
                                break;
                        }
                    }}>
                        <a>
                            <ImportContactsTwoToneIcon className="nav-footer-icon"/>
                            <br />
                            Library
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div
                        style={{ position: 'relative' }}
                        onClick={() => {
                            homeGeneralClicked('mweb_account_clicked');
                            switch (this.props.router.asPath) {
                                case '/radio':
                                    window.location.href = '/profile';
                                    break
    
                                default:
                                    Router.push('/profile');
                                    break;
                            }
                        }
                    }>
                        <a>
                            <AccountCircleOutlinedIcon className="nav-footer-icon" />
                            {!this.isProfileComplete() ? (<Badge className="ribbon" color="danger"> </Badge>) : null}
                            <br />
                            Account
                        </a>
                    </div>
                </div>

                <script src="/static/js/fontawesome.js" crossOrigin="anonymous"></script>
            </div>
        );
    }
}
export default connect(state => state, userActions)(withRouter(FooterNav_v2));

import React, { useEffect, useState } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';
import chatsActions from '../../../redux/actions/chats';

import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import { Badge } from 'reactstrap';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import LiveEventIcon from '../Common/LiveEventIcon';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';
import LiveStreamIcon from '../Common/LiveStream';

// import { getCookie } from '../../../utils/cookie';

const FooterNav_v2 = (props) => {

    const isProfileComplete = () => {
        if (props.user && props.user.data) {
            const data = props.user.data
			return data.nickname && data.display_name && data.email && data.phone_number && data.dob && data.gender && data.photo_url;
        }
        return true;
	}

    useEffect(() =>{
        props.getUserData()
        .then(response => console.log(response))
        .catch(error => console.log(error));
        Router.events.on("routeChangeStart", () => {
            // const convivaSessionId = getCookie('CONVIVA_SESSION_ID');
            // if (convivaSessionId != null) {
            //     Conviva.LivePass.cleanupSession(convivaSessionId);
            // }
        });
    }, [])

        return (
            <>
                <div className="nav-footer-v2">
                    <div className="footer-wrapper-list">
                        <div id="action-home" onClick={() => {
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
                        <div id="action-live-event" onClick={() => {
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
                        <div id="action-live-tv" onClick={() => {
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
                        <div id="action-library" onClick={() => {
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
                            id="action-account"
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

                    <script src="/static/js/fontawesome.min.js" crossOrigin="anonymous"></script>
                </div>
            </>
        );
}
export default connect(state => state, {
    ...userActions,
    ...chatsActions
})(withRouter(FooterNav_v2));

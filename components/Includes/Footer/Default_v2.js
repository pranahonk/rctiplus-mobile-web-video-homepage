import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';

import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import { Badge } from 'reactstrap';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';

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
    }

    render() {
        return (
            <div className="nav-footer-v2">
                <div className="footer-wrapper-list">
                    <div onClick={() => {
                        homeGeneralClicked('mweb_home_clicked');
                        Router.push('/');
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
                        homeGeneralClicked('mweb_livetv_clicked');
                        Router.push('/tv/rcti');
                    }}>
                        <a>
                            <ImportantDevicesIcon className="nav-footer-icon" />
                            <br />
                            Live TV
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
                        
                        Router.push('/explores');
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
                            Router.push('/profile');
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

                <script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
            </div>
        );
    }
}
export default connect(state => state, userActions)(withRouter(FooterNav_v2));

import React, { Component } from 'react';
import Router from 'next/router';

import { homeGeneralClicked } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';

class FooterNav_v2 extends Component {


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
                        homeGeneralClicked('mweb_library_clicked');
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
                    <div onClick={() => {
                        homeGeneralClicked('mweb_account_clicked');
                        Router.push('/profile');
                    }}>
                        <a>
                            <AccountCircleOutlinedIcon className="nav-footer-icon" />
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
export default FooterNav_v2;

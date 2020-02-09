import React, { Component } from 'react';
import Link from 'next/link';
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
                    <Link href="/">
                        <a>
                            <HomeIcon className="nav-footer-icon" />
                            <br />
                            Home
                        </a>
                    </Link>
                </div>

                <div className="footer-wrapper-list">
                    <Link href="/tv/rcti">
                        <a>
                            <ImportantDevicesIcon className="nav-footer-icon" />
                            <br />
                            Live TV
                        </a>
                    </Link>
                </div>

                <div className="footer-wrapper-list">
                    <Link href="/explores">
                        <a>
                            <ImportContactsTwoToneIcon className="nav-footer-icon"/>
                            <br />
                            Library
                        </a>
                    </Link>
                </div>

                <div className="footer-wrapper-list">
                    <Link href="/profile">
                        <a>
                            <AccountCircleOutlinedIcon className="nav-footer-icon" />
                            <br />
                            Account
                        </a>
                    </Link>
                </div>

                <script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
            </div>
        );
    }
}
export default FooterNav_v2;

import React, { useEffect, useState } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';
import chatsActions from '../../../redux/actions/chats';

import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import { Badge } from 'reactstrap';
import { bottomMenuClick } from '../../../utils/firebaseTracking';
import { gaTrackerNavbarTrack } from '../../../utils/ga-360';

// import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
// import LiveEventIcon from '../Common/LiveEventIcon';
// import HomeIcon from '@material-ui/icons/Home';
// import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
// import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';
// import LiveStreamIcon from '../Common/LiveStream';

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
        .then(response => {})
        .catch(error => {});
        Router.events.on("routeChangeStart", () => {
            // const convivaSessionId = getCookie('CONVIVA_SESSION_ID');
            // if (convivaSessionId != null) {
            //     Conviva.LivePass.cleanupSession(convivaSessionId);
            // }
        });
    }, [])

        return (
            <div className="nav-footer-v2">
                <div className="footer-wrapper-list">
                    <div id="action-home" onClick={() => {
                        homeGeneralClicked('mweb_home_clicked');
                        switch (props.router.asPath) {
                            case '/radio':
                                window.location.href = '/';
                                break

                            default:
                                Router.push('/');
                                break;
                        }
                    }}>
                        <a>
                            <div >
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
                                    <g fill="none" fillRule="evenodd">
                                        <g fill={props.router.asPath === "/" ? "#FFF" : "#8F8F8F"} fillRule="nonzero">
                                            <g>
                                                <path d="M27.328 13.874l-.001-.002-10.2-10.198C16.694 3.24 16.116 3 15.5 3s-1.193.24-1.628.674L3.68 13.867l-.01.01c-.893.898-.892 2.355.004 3.25.409.41.95.647 1.527.671.024.003.047.004.071.004h.407v7.505C5.678 26.792 6.886 28 8.372 28h3.99c.404 0 .732-.328.732-.732v-5.884c0-.678.552-1.23 1.23-1.23h2.353c.678 0 1.229.552 1.229 1.23v5.884c0 .404.328.732.732.732h3.99c1.486 0 2.695-1.208 2.695-2.693v-7.505h.377c.614 0 1.192-.24 1.627-.674.897-.897.897-2.357.001-3.254z" transform="translate(-22 -613) translate(22 613)"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            {/* <HomeIcon className="nav-footer-icon" /> */}
                            {/* <br /> */}
                            <span className={props.router.asPath === "/" ? "footer-icon-active" : ""}>Home</span>
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div id="action-live-event" onClick={() => {
                        homeGeneralClicked('mweb_liveevent_clicked');
                        Router.push('/live-event');
                    }}>
                        <a>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
                                    <g fill="none" fillRule="evenodd">
                                        <g fill={props.router.asPath === "/live-event" ? "#FFF" : "#8F8F8F"} fillRule="nonzero">
                                            <g>
                                                <path d="M30.945 26.452l-1.926-7.33c-.03-.114-.077-.22-.137-.319.11-.29.17-.604.17-.93V5.79c0-1.516-1.294-2.748-2.886-2.748H4.833c-1.592 0-2.887 1.232-2.887 2.748v12.083c0 .326.06.64.17.93-.06.098-.106.205-.136.32L.039 26.51c-.097.368-.01.758.235 1.057.245.299.622.474 1.02.474h28.412c.715 0 1.294-.552 1.294-1.232 0-.124-.02-.244-.055-.358zm-12.166-1.167H12.22c-.076 0-.147-.033-.196-.091-.048-.058-.069-.135-.055-.21l.51-2.835c.023-.122.128-.21.252-.21h5.535c.123 0 .23.088.251.21l.507 2.813c.006.022.009.044.009.068 0 .141-.114.255-.255.255zm7.752-6.66c0 .147-.088.274-.214.332H4.682c-.126-.058-.215-.185-.215-.333V5.93c0-.202.165-.366.366-.366h21.333c.201 0 .365.164.365.366v12.695z" transform="translate(-97 -613) translate(97 613)"/>
                                                <g>
                                                    <path d="M7.284 7.24c-.68 0-1.334.287-1.796.79-.228.248-.212.633.035.861.117.108.265.161.413.161.164 0 .328-.066.448-.197.236-.256.556-.397.9-.397.345 0 .665.141.9.397.228.248.614.264.861.036.248-.228.264-.613.036-.861-.462-.503-1.117-.79-1.797-.79z" transform="translate(-97 -613) translate(97 613) translate(8 8)"/>
                                                    <path d="M9.96 7.222c.12.13.284.197.449.197.147 0 .295-.053.412-.161.248-.228.264-.614.036-.861-.919-.998-2.22-1.57-3.573-1.57-1.351 0-2.654.572-3.572 1.57-.228.247-.212.633.035.86.248.229.634.213.862-.035.688-.748 1.663-1.177 2.675-1.177 1.012 0 1.988.429 2.676 1.177z" transform="translate(-97 -613) translate(97 613) translate(8 8)"/>
                                                    <path d="M7.268 2.373l.147.001-.171-.001c.099 0 .198.002.296.006.206.007.412.023.615.048.026.003.052.008.077.014 1.66.23 3.21 1.034 4.36 2.283.228.248.212.633-.036.861-.117.108-.265.161-.413.161-.164 0-.328-.066-.448-.197-1.143-1.24-2.76-1.954-4.44-1.957-1.678.003-3.295.716-4.438 1.957-.12.13-.284.197-.448.197-.148 0-.296-.053-.413-.161-.248-.228-.263-.613-.036-.861 1.15-1.249 2.7-2.052 4.359-2.283.025-.006.052-.01.078-.014.203-.025.41-.041.615-.049.098-.003.197-.005.296-.005l-.17.001.146-.001z" transform="translate(-97 -613) translate(97 613) translate(8 8)"/>
                                                    <path d="M.61 4.153c.164 0 .328-.066.448-.196 1.601-1.74 3.87-2.738 6.226-2.738s4.626.998 6.227 2.738c.228.247.614.263.861.035.248-.228.264-.613.036-.86C12.576 1.141 9.98 0 7.284 0 4.59 0 1.993 1.141.161 3.131c-.228.248-.212.633.036.861.117.108.265.161.412.161z" transform="translate(-97 -613) translate(97 613) translate(8 8)"/>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            {/* <LiveEventIcon marginBottom="3px" />
                            <br /> */}
                            <span className={props.router.asPath === "/live-event" ? "footer-icon-active" : ""}>LiveEvent</span>
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div id="action-live-tv" onClick={() => {
                        homeGeneralClicked('mweb_livetv_clicked');
                        Router.push('/tv/rcti');
                    }}>
                        <a>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
                                    <g fill="none" fillRule="evenodd">
                                        <g fill={props.router.asPath === "/tv/rcti" || props.router.asPath === "/tv/mnctv" || props.router.asPath === "/tv/gtv" || props.router.asPath === "/tv/inews"  ? "#FFF" : "#8F8F8F"}>
                                            <g>
                                                <path d="M25.966 26c.571 0 1.034.448 1.034 1 0 .515-.403.94-.921.994l-.113.006H6.034C5.463 28 5 27.552 5 27c0-.515.403-.94.921-.994L6.034 26h19.932zM28 3c1.657 0 3 1.343 3 3v15c0 1.657-1.343 3-3 3H3c-1.657 0-3-1.343-3-3V6c0-1.657 1.343-3 3-3h25zm-14.5 7.253h-5c-.552 0-1 .447-1 1 0 .552.448 1 1 1l1.5-.001v4.5c0 .553.448 1 1 1s1-.447 1-1v-4.5h1.5c.552 0 1-.447 1-1 0-.552-.448-1-1-1zm8.69.122c-.5-.234-1.095-.017-1.328.483L19 14.85l-1.862-3.992c-.233-.5-.828-.717-1.328-.483-.501.233-.718.828-.484 1.329l2.536 5.438c.204.438.686.659 1.138.55.453.108.934-.112 1.138-.55l2.536-5.438.043-.109c.158-.475-.062-1.003-.527-1.22z" transform="translate(-172 -613) translate(172 613)"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            {/* <ImportantDevicesIcon className="nav-footer-icon" />
                            <br /> */}
                            <span className={props.router.asPath === "/tv/rcti" || props.router.asPath === "/tv/mnctv" || props.router.asPath === "/tv/gtv" || props.router.asPath === "/tv/inews" ? "footer-icon-active" : ""}>LiveTV</span>
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div id="action-library" onClick={() => {
                        switch (props.router.asPath) {
                            case '/exclusive':
                                exclusiveGeneralEvent('mweb_exclusive_library_clicked');
                                break;

                            case '/profile':
                                accountGeneralEvent('mweb_account_library_clicked');
                                break;

                            default:
                                gaTrackerNavbarTrack('menu_navbar_tracking','click_bottom_menu', 'trebel');
                                homeGeneralClicked('mweb_library_clicked');
                                break;
                        }

                        bottomMenuClick(props?.user?.data, { pillar: 'general', button_name: 'trebel' })
                        Router.push('/explores_revamp', "/explores")
                    }}>
                        <a>
                            <div>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M28.9894 9.63589C28.9894 8.83637 28.922 8.04009 28.7311 7.2617C28.3882 5.84384 27.5798 4.76074 26.37 3.96528C25.7477 3.55902 25.0627 3.30957 24.3348 3.17794C23.7757 3.08013 23.2099 3.02634 22.6424 3.01706C22.6001 3.013 22.5538 3.00406 22.5067 3H9.48192C9.31699 3.013 9.15206 3.02113 8.98713 3.02925C8.17871 3.07556 7.37518 3.16007 6.61307 3.46476C5.16606 4.03597 4.1204 5.03456 3.51105 6.47355C3.2998 6.96025 3.19337 7.4762 3.11781 8.00109C3.05444 8.42442 3.02031 8.85181 3.00812 9.2792C3.00812 9.31332 3 9.34664 3 9.38076V22.6225L3.02519 23.0799C3.08043 23.9648 3.19418 24.8407 3.56711 25.6532C4.2699 27.1897 5.45042 28.2005 7.07131 28.6872C7.52386 28.8269 7.99834 28.8903 8.47202 28.9326C9.07325 28.9919 9.67367 29 10.2749 29H22.2248C22.7919 29 23.359 28.9618 23.9261 28.8903C24.819 28.7757 25.6567 28.5133 26.4147 28.0144C27.312 27.4331 28.0195 26.6018 28.45 25.6231C28.6531 25.1657 28.7676 24.6798 28.8521 24.1882C28.9748 23.4561 29 22.7151 29 21.9749C28.9959 17.8611 29 13.7481 28.9959 9.63427L28.9894 9.63589Z" fill={props.router.asPath === "/explores" ? "#FFF" : "#8F8F8F"} />
                                    <g clip-path="url(#clip0_40_3263)">
                                        <path d="M17.3616 10V20.5443C17.3616 20.5443 17.3616 21.3054 18.0578 21.3054H19.1039V23.9977H17.2666C17.2666 23.9977 14.1631 24.1865 14.1631 20.8942C14.1631 17.5995 14.1804 10 14.1804 10H17.3616Z" fill="black" />
                                        <path d="M10.5 13.1568H11.4511V16.2812H10.5V13.1568Z" fill="black" />
                                        <path d="M13.2861 13.1568H12.3373V16.2812H13.2861V13.1568Z" fill="black" />
                                        <path d="M18.249 16.5117V13.0514L21.1833 14.7821L18.249 16.5117Z" fill="black" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_40_3263">
                                            <rect width="10.6833" height="14" fill="white" transform="translate(10.5 10)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            {/* <ImportContactsTwoToneIcon className="nav-footer-icon"/>
                                <br /> */}
                            <span className={props.router.asPath === "/explores" ? "footer-icon-active" : ""}>TREBEL</span>
                        </a>
                    </div>
                </div>

                <div className="footer-wrapper-list">
                    <div
                        id="action-account"
                        style={{ position: 'relative' }}
                        onClick={() => {
                            homeGeneralClicked('mweb_account_clicked');
                            switch (props.router.asPath) {
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
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
                                    <g fill="none" fillRule="evenodd">
                                        <g fill={props.router.asPath === "/profile" ? "#FFF" : "#8F8F8F"} fillRule="nonzero">
                                            <g>
                                                <g transform="translate(-322 -613) translate(322 613) translate(3 3)">
                                                    <circle cx="12.912" cy="5.592" r="5.592"/>
                                                    <path d="M12.912 12.5c-5.45 0-9.868 4.418-9.868 9.868C3.044 23.822 4.222 25 5.675 25H20.15c1.453 0 2.632-1.178 2.632-2.632 0-5.45-4.419-9.868-9.869-9.868z"/>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            {/* <AccountCircleOutlinedIcon className="nav-footer-icon" /> */}
                            {!isProfileComplete() ? (<Badge className="ribbon" color="danger"> </Badge>) : null}
                            {/* <br /> */}
                            <span className={props.router.asPath === "/profile" ? "footer-icon-active" : ""}>Account</span>
                        </a>
                    </div>
                </div>

                <script src="/static/js/fontawesome.min.js" crossOrigin="anonymous"></script>
            </div>
        );
}
export default connect(state => state, {
    ...userActions,
    ...chatsActions
})(withRouter(FooterNav_v2));

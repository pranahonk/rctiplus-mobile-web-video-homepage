import React, { useEffect, useState } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';
import chatsActions from '../../../redux/actions/chats';

import { homeGeneralClicked, exclusiveGeneralEvent, accountGeneralEvent } from '../../../utils/appier';

import '../../../assets/scss/components/footer-v2.scss';

import { Badge } from 'reactstrap';

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
            <div id="nav-footer" className="nav-footer-v2">
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
                                homeGeneralClicked('mweb_library_clicked');
                                break;
                        }

                        Router.push('/explores_revamp', "/explores")
                    }}>
                        <a>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
                                    <g fill="none" fillRule="evenodd">
                                        <g fill={props.router.asPath === "/explores" ? "#FFF" : "#8F8F8F"} fillRule="nonzero">
                                            <g>
                                                <g>
                                                    <path d="M23.09 0H15.68c-1.1 0-1.996.895-1.996 1.995v8.553c0 1.1.895 1.995 1.996 1.995h7.412c1.1 0 1.995-.895 1.995-1.995V1.995c0-1.1-.895-1.995-1.995-1.995zm-1.708 6.908l-2.85 2.565c-.548.492-1.428.106-1.428-.636V3.706c0-.739.88-1.128 1.428-.636l2.85 2.565c.378.341.378.932 0 1.273z" transform="translate(-247 -613) translate(247 613) translate(4 3)"/>
                                                    <path d="M20.525 14.824h-4.846c-2.36 0-4.276-1.916-4.276-4.276V1.995c0-.718.182-1.402.502-1.995H3.42C1.539 0 0 1.54 0 3.42v16.535c0 1.117 1.527 2.85 3.42 2.85h3.422v1.574c0 .744.887 1.128 1.425.639l1.996-1.779 1.995 1.779c.518.48 1.425.124 1.425-.639v-1.573h5.702c.627 0 1.14-.514 1.14-1.14v-6.842zM6.842 20.525H3.42c-.627 0-1.14-.513-1.14-1.14 0-.627.513-1.14 1.14-1.14h3.42v2.28zm11.402 0h-4.56v-2.28h4.56v2.28z" transform="translate(-247 -613) translate(247 613) translate(4 3)"/>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            {/* <ImportContactsTwoToneIcon className="nav-footer-icon"/>
                            <br /> */}
                            <span className={props.router.asPath === "/explores" ? "footer-icon-active" : ""}>Library</span>
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

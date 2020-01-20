import React, { Component } from 'react';
import '../../../assets/scss/components/footer.scss';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';

/*
 *load reactstrap
 *start here
 */
import { Badge }
    from 'reactstrap';
/*
 *load reactstrap
 *end here
 */
class FooterNav extends Component {


    render() {
        return (
            <div className="nav-footer">
                <div className="footer-wrapper-list">
                    <a href="/">
                        <HomeIcon className="nav-footer-icon"/>
                        <br/>
                        Home
                    </a>
                </div>

                <div className="footer-wrapper-list">
                    <a href="/exclusive">
                    <svg className="nav-footer-icon" height="18px" width="18px" viewBox="0 0 1000 1000">
                        <path transform="scale(1,-1) translate(0,-750)" fill="white" stroke="white" strokeWidth="1" d="M835 517l-670 0 0 84 670 0 0-84z m-84 251l0-83-502 0 0 83 502 0z m167-417l0-334c0-46-37-84-83-84l-670 0c-46 0-83 38-83 84l0 334c0 46 37 84 83 84l670 0c46 0 83-38 83-84z m-195-103c11 4 19 15 19 28 0 16-13 29-28 29-16 0-29-13-29-29 0-9 4-17 11-23l-38-38c-9-10-22-16-36-16-16 0-31 8-40 21l-61 84c0 0 0 0 0 0 5 5 8 12 8 20 0 16-13 29-29 29-16 0-28-13-28-29 0-8 3-15 8-21l-62-83c-9-13-24-21-40-21-14 0-27 6-36 16l-37 38c6 6 10 14 10 23 0 16-13 29-29 29-15 0-28-13-28-29 0-13 8-24 20-28 0-1 0-3 0-4l30-123c2-6 7-10 13-10l180 0c0 0 0 0 0 0l179 1c6 0 11 4 13 10l30 122c0 2 0 3 0 4z m-33-181c0 8-6 14-14 14l-351 0c-7 0-13-6-13-14l0-33c0-8 6-14 13-14l351 0c8 0 14 6 14 14l0 33z"/>
                    </svg>
                    <br/>
                    Exclusive
                    </a>
                </div>

                <div className="footer-wrapper-list">
                    <a href="/live-tv">
                        <ImportantDevicesIcon className="nav-footer-icon"/>
                        <br/>
                        Live TV
                    </a>
                </div>

                <div className="footer-wrapper-list">
                    <a href="/trending">
                        <img
                            className="nav-footer-icon"
                            src="/static/btn/trending_2.svg"
                        />
                        <br/>
                        Trending
                    </a>
                </div>

                <div className="footer-wrapper-list">
                    <a href="/more">
                        <MenuIcon className="nav-footer-icon"/>
                        <br/>
                        More
                    </a>
                </div>


                {/* <script dangerouslySetInnerHTML={{__html: `
             var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"9013027"}),function(){var c=document.createElement("script"),e=document.getElementsByTagName("script")[0];c.async=!0,c.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",e.parentNode.insertBefore(c,e)}();
             `}}></script>
             <noscript><img alt="Share" src="https://b.scorecardresearch.com/p?c1=2&c2=9013027&cv=2.0&cj=1" /></noscript> */}
                {/* <script dangerouslySetInnerHTML={{__html: `
             !function(e,n,t){!function(e,n,t,a,r){var s=(e[n]=e[n]||{})[t]=function(){(s._q=s._q||[]).push(Array.prototype.slice.call(arguments))};s.webkey=r;for(var c=0;c<a.length;c++)s[a[c]]=function(n){return function(){var e=Array.prototype.slice.call(arguments);return e.unshift(n),(s._q=s._q||[]).push(e),s}}(a[c])}(e,"AF","Banner",["showBanner","hideBanner","disableBanners","disableTracking","setAdditionalParams"],t),function(e,n,t){var a=e.createElement("script");a.type="text/javascript",a.async=!0,a.src=n+(t?"?webkey="+t:"");var r=e.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r)}(n,"https://cdn.appsflyer.com/web-sdk/banner/latest/sdk.min.js",t)}(window,document,"e8ab6120-aa95-45c1-826c-20e3966b6290");
             window.AF.Banner.showBanner();
             `}}></script> */}

                <script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
            </div>
        );
    }
}
export default FooterNav;

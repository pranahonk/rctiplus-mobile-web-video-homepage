import React, { Component, Children } from 'react';
import '../../../assets/scss/components/footer.scss';

/*
 *load reactstrap
 *start here
 */
import { Badge } from 'reactstrap';
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
						<img className="nav-footer-icon" src="/static/btn/home/nav.png" />
					</a>
				</div>

				<div className="footer-wrapper-list">
					<a href="/exclusive">
						<img
							className="nav-footer-icon"
							src="/static/btn/exclusive/nav.png"
						/>
					</a>
				</div>

				<div className="footer-wrapper-list">
					<a href="/live-tv">
						<img
							className="nav-footer-icon"
							src="/static/btn/live-tv/nav.png"
						/>
					</a>
				</div>

				<div className="footer-wrapper-list">
					<a href="/trending">
						<img
							className="nav-footer-icon"
							src="/static/btn/trending/nav.png"
						/>
					</a>
				</div>

				<div className="footer-wrapper-list">
					<a href="/more">
						<img className="nav-footer-icon" src="/static/btn/more/nav.png" />
					</a>
				</div>
				{/* <script dangerouslySetInnerHTML={{__html: `
					var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"9013027"}),function(){var c=document.createElement("script"),e=document.getElementsByTagName("script")[0];c.async=!0,c.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",e.parentNode.insertBefore(c,e)}();
				`}}></script>
				<noscript><img alt="Share" src="https://b.scorecardresearch.com/p?c1=2&c2=9013027&cv=2.0&cj=1" /></noscript> */}
				<script dangerouslySetInnerHTML={{__html: `
					!function(e,n,t){!function(e,n,t,a,r){var s=(e[n]=e[n]||{})[t]=function(){(s._q=s._q||[]).push(Array.prototype.slice.call(arguments))};s.webkey=r;for(var c=0;c<a.length;c++)s[a[c]]=function(n){return function(){var e=Array.prototype.slice.call(arguments);return e.unshift(n),(s._q=s._q||[]).push(e),s}}(a[c])}(e,"AF","Banner",["showBanner","hideBanner","disableBanners","disableTracking","setAdditionalParams"],t),function(e,n,t){var a=e.createElement("script");a.type="text/javascript",a.async=!0,a.src=n+(t?"?webkey="+t:"");var r=e.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r)}(n,"https://cdn.appsflyer.com/web-sdk/banner/latest/sdk.min.js",t)}(window,document,"e8ab6120-aa95-45c1-826c-20e3966b6290");
					window.AF.Banner.showBanner();
				`}}></script>
			</div>
		);
	}
}
export default FooterNav;

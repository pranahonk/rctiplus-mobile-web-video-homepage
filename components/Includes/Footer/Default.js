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
				<script dangerouslySetInnerHTML={{__html: `
					var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"9013027"}),function(){var c=document.createElement("script"),e=document.getElementsByTagName("script")[0];c.async=!0,c.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",e.parentNode.insertBefore(c,e)}();
				`}}></script>
				<noscript><img alt="Share" src="https://b.scorecardresearch.com/p?c1=2&c2=9013027&cv=2.0&cj=1" /></noscript>
			</div>
		);
	}
}
export default FooterNav;

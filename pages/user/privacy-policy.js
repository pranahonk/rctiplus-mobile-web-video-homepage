import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';
import { withRouter } from 'next/router';
import queryString from 'query-string';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';
import { GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, SITE_NAME, SITEMAP } from '../../config';

import miscActions from '../../redux/actions/miscActions';
import pageActions from '../../redux/actions/pageActions';

class PrivacyPolicy extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	state = {
		privacy_policy: ''
	};

	constructor(props) {
		super(props);
		this.platform = null;
        this.header = null;
        const segments = this.props.router.asPath.split(/\?/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.platform) {
                this.platform = q.platform;
            }

            if (q.header) {
                this.header = q.header;
            }
		}

		console.log(this.platform);
	}

	componentDidMount() {
		if (this.platform && (this.platform == 'android' || this.platform == 'ios')) {
			const nextWrapper = document.getElementById('__next');
			if (nextWrapper) {
				nextWrapper.style.height = '100%';
			}
		}

		this.props.setPageLoader();
		this.props.getPrivacyPolicy()
			.then(response => {
				this.props.unsetPageLoader();
				console.log(response);
				this.setState({ privacy_policy: response.data.data.value });
			})
			.catch(error => {
				this.props.unsetPageLoader();
				console.log(error);
			});
	}

	render() {
		return (
			<Layout title={SITEMAP.privacy_policy.title}>
				<Head>
					<meta name="description" content={SITEMAP.privacy_policy.description}/>
					<meta name="keywords" content={SITEMAP.privacy_policy.keywords}/>
					<meta property="og:title" content={SITEMAP.privacy_policy.title} />
					<meta property="og:description" content={SITEMAP.privacy_policy.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.privacy_policy.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:type" content="article" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.privacy_policy.image} />
					<meta name="twitter:image:alt" content={SITEMAP.privacy_policy.title} />
					<meta name="twitter:title" content={SITEMAP.privacy_policy.title} />
					<meta name="twitter:description" content={SITEMAP.privacy_policy.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				<NavBack title="Privacy Policy"/>
				<div className="wrapper-content container-box-pp">
					{/* <iframe src="https://ssr.rctiplus.com/privacy-policy" width="100%" height="100%" frameBorder="0"></iframe> */}
					<h3 style={{ textAlign: 'center', fontWeight: 900, marginBottom: 20 }}>PRIVACY_POLICY</h3>
					<div style={{ padding: 10 }} dangerouslySetInnerHTML={{ __html: this.state.privacy_policy }}></div>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {
	...miscActions,
	...pageActions
})(withRouter(PrivacyPolicy));

import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';
import Router, { withRouter } from 'next/router';


import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';


import '../../assets/scss/components/privacy-policy.scss';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';


class Faq extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	render() {
		return (
			<Layout title={SITEMAP.faq.title}>
				<Head>
					<meta name="description" content={SITEMAP.faq.description}/>
					<meta name="keywords" content={SITEMAP.faq.keywords}/>
					<meta property="og:title" content={SITEMAP.faq.title} />
					<meta property="og:description" content={SITEMAP.faq.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.faq.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.faq.image} />
					<meta name="twitter:image:alt" content={SITEMAP.faq.title} />
					<meta name="twitter:title" content={SITEMAP.faq.title} />
					<meta name="twitter:description" content={SITEMAP.faq.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				<NavBack title="Faq"/>
				<div className="wrapper-content container-box-pp">
					<iframe src="https://ssr.rctiplus.com/faq" width="100%" height="100%" frameBorder="0"></iframe>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {})(withRouter(Faq));

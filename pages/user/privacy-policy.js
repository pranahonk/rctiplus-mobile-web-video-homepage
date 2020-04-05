import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';
import { SITEMAP } from '../../config';

class PrivacyPolicy extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Layout title={SITEMAP.privacy_policy.title}>
				<Head>
					<meta name="description" content={SITEMAP.privacy_policy.description}/>
					<meta name="keywords" content={SITEMAP.privacy_policy.keywords}/>
				</Head>
				<NavBack title="Privacy Policy"/>
				<div className="wrapper-content container-box-pp">
					<iframe src="https://ssr.rctiplus.com/privacy-policy" width="100%" height="100%" frameBorder="0"></iframe>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {})(PrivacyPolicy);

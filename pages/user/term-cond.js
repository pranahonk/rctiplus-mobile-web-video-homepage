import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';
import { SITEMAP } from '../../config';

class TermCond extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	render() {
		return (
			<Layout title={SITEMAP.terms_and_conditions.title}>
				<Head>
					<meta name="description" content={SITEMAP.terms_and_conditions.description}/>
					<meta name="keywords" content={SITEMAP.terms_and_conditions.keywords}/>
				</Head>
				<NavBack title="Terms and Conditions"/>
				<div className="wrapper-content container-box-pp">
					<iframe src="https://ssr.rctiplus.com/terms-&-conditions" width="100%" height="100%" frameBorder="0"></iframe>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {})(TermCond);

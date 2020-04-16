import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';
import { SITEMAP } from '../../config';

import miscActions from '../../redux/actions/miscActions';
import pageActions from '../../redux/actions/pageActions';

class PrivacyPolicy extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	state = {
		privacy_policy: ''
	};

	componentDidMount() {
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
})(PrivacyPolicy);

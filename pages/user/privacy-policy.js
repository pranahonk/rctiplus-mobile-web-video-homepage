import React from 'react'
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';

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
			<Layout title="RCTI+ - Privacy Policy">
				<NavBack title="Privacy Policy"/>
				<div className="wrapper-content container-box-pp">
					<iframe src="https://ssr.rctiplus.com/privacy-policy" width="100%" height="100%" frameBorder="0"></iframe>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {})(PrivacyPolicy);

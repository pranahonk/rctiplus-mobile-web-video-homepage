import React from 'react'
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/privacy-policy.scss';

class Faq extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	render() {
		return (
			<Layout title="RCTI+ - Faq">
				<NavBack title="Faq"/>
				<div className="wrapper-content container-box-pp">
					<iframe src="https://ssr.rctiplus.com/faq" width="100%" height="100%" frameBorder="0"></iframe>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {})(Faq);

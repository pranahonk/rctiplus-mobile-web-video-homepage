import React from 'react'
import { connect } from 'react-redux';
import ReactJWPlayer from 'react-jw-player';
import initialize from '../utils/initialize';
import liveAndChatActions from '../redux/actions/liveAndChatActions';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavDefault from '../components/Includes/Navbar/NavDefault';

class Live extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			contents: [],
			meta: null,
		};
	}

	componentDidMount() {
		
	}

	render() {
		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<NavDefault />
				<div className="wrapper-content">
					Live TV
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, liveAndChatActions)(Live);

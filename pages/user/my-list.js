import React from 'react'
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import contentActions from '../../redux/actions/contentActions';
import initialize from '../../utils/initialize';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import Nav from '../../components/Includes/Navbar/NavDefault';

class MyList extends React.Component {

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
		this.props.getContents(1)
			.then(response => {
				this.setState({ contents: this.props.contents.homepage_content, meta: this.props.contents.meta });
			});
	}

	render() {
		const contents = this.state.contents;
		const meta = this.state.meta;

		return (
			<Layout title="RCTI+ - My - List">
				<div>
					<Nav />
					<div className="wrapper-content">My - List</div>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, contentActions)(MyList);

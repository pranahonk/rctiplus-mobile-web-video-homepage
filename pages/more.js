import React from 'react'
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';
import Nav from '../components/Nav/NavDefault';
import Layout from '../components/Templates/Layout';
import Stories from '../components/Stories';

/*
 *load carousel
 *start here
 */
import Carousel from '../components/Gallery/Carousel';
import '../assets/scss/carousel.scss';
/*
 *load carousel
 *end here
 */

// https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2


class More extends React.Component {

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
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<div>
					<Nav />
					
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, contentActions)(More);

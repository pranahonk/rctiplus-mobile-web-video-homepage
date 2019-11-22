import React from 'react'
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';
import Stories from '../components/Stories';

// https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2


class Home extends React.Component {

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
			<Layout title="Home">
				<Head>
					<script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
				</Head>
				<div>
					<i className="fas fa-play-circle" aria-hidden="true"></i>
					<Stories />
					{contents.map(row => (
						<div key={row.id}>
							<h4>{row.title}</h4>
							{row.content.map(c => (
								<div key={c.content_id}>
									<h5>{c.content_title}</h5>
									<Lazyload>
										<img src={meta.image_path + '300' + c.landscape_image} />
									</Lazyload>
								</div>
							))}
						</div>
					))}
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, contentActions)(Home);

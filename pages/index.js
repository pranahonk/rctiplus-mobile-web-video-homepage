import React from 'react'
import { connect } from 'react-redux';
import Lazyload from 'react-lazyload';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

//load download app el
import NavDownloadApp from '../components/Includes/Navbar/NavDownloadApp';

//load navbar default
import Nav from '../components/Includes/Navbar/NavDefault';

//load carousel gallery (only in home page)
import Carousel from '../components/Includes/Gallery/Carousel';

//load stories zuck js (only in home page)
import Stories from '../components/Includes/Gallery/Stories';

//load stories panel 1 (only in home page)
import Panel1 from '../components/Panels/Pnl_1';

//load stories panel 2 (only in home page)
import Panel2 from '../components/Panels/Pnl_2';

//load stories panel 3 (only in home page)
import Panel3 from '../components/Panels/Pnl_3';

//load stories panel 4 (only in home page)
import Panel4 from '../components/Panels/Pnl_4';

//load home page scss
import '../assets/scss/components/homepage.scss';

class Index extends React.Component {

	static async getInitialProps(ctx) {
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
					<NavDownloadApp />
					<Nav />
					<Carousel />
					<i className="fas fa-play-circle" aria-hidden="true"></i>
					<Stories />
					<Panel1 />
					<Panel2 />
					<Panel3 />
					<Panel4 />
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, contentActions)(Index);

import React from 'react'
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

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
			page: 1,
			fetchAllowed: true,
			meta: null,
			resolution: 593
		};
	}

	componentDidMount() {
		this.props.getContents(this.state.page)
			.then(response => {
				this.setState({ contents: this.props.contents.homepage_content, meta: this.props.contents.meta });
			});
	}

	bottomScrollFetch() {
		const page = this.state.page + 1;
		if (this.state.fetchAllowed) {
			this.props.getContents(page)
				.then(response => {
					const homepageContents = this.state.contents;
					if (this.props.contents.homepage_content.length > 0) {
						homepageContents.push.apply(homepageContents, this.props.contents.homepage_content);
						this.setState({
							contents: homepageContents,
							page: page
						});
					}
					else {
						this.setState({ fetchAllowed: false });
					}
					
				});
		}
	}

	render() {
		const contents = this.state.contents;
		const meta = this.state.meta;

		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<div>
					<BottomScrollListener 
						offset={20}
						onBottom={this.bottomScrollFetch.bind(this)} />
					<Nav />
					<Carousel />
					<i className="fas fa-play-circle" aria-hidden="true"></i>
					<Stories />
					{contents.map(content => {
						switch (content.display_type) {
							case 'horizontal_landscape_large':
								return <Panel1 
											key={content.id} 
											title={content.title}
											content={content.content}
											imagePath={meta.image_path}
											resolution={this.state.resolution}/>;

							case 'horizontal_landscape':
									return <Panel2 
												key={content.id} 
												title={content.title}
												content={content.content}
												imagePath={meta.image_path}
												resolution={this.state.resolution}/>;

							case 'horizontal':
									return <Panel3 
												key={content.id} 
												title={content.title}
												content={content.content}
												imagePath={meta.image_path}
												resolution={this.state.resolution}/>;

							case 'vertical':
									return <Panel4 
											key={content.id} 
											title={content.title} 
											content={content.content}
											imagePath={meta.image_path}
											resolution={this.state.resolution}/>;
						}
					})}
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, contentActions)(Index);

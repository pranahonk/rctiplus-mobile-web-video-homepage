import React, { Component, Children } from 'react';
import { connect } from 'react-redux';
import contentActions from '../../../redux/actions/contentActions';
import { Carousel } from 'react-responsive-carousel';
import '../../../assets/scss/plugins/carousel/carousel.scss';


class Crs extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			banner: [],
			meta: null
		};
	}

	componentDidMount() {
		this.props.getBanner()
			.then(response => {
				const contents = this.props.contents;
				this.setState({
					banner: contents.banner,
					meta: contents.meta
				});
			});
	}
	
	render() {
		return (
			<Carousel autoPlay showThumbs={false} showIndicators={false} stopOnHover={true} infiniteLoop={true}>
				{this.state.banner.map(b => (
					<div key={b.id}>
						<img src={this.state.meta.image_path + '593' + b.portrait_image} />
						<p className="legend">{b.title}</p>
					</div>
				))}
			</Carousel>
		);
	}
}
export default connect(state => state, contentActions)(Crs);

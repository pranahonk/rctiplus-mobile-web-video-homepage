import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Img from 'react-image';

import pageActions from '../redux/actions/pageActions';
import userActions from '../redux/actions/userActions';
import searchActions from '../redux/actions/searchActions';

import Layout from '../components/Layouts/Default';
import NavSearch from '../components/Includes/Navbar/NavSearch';

import { Row, Col } from 'reactstrap';

import '../assets/scss/components/explore.scss';

class Explore extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			interests: [],
			recommendations: [],
			meta: {},
			resolution: 593,
			page: 1,
			length: 9
		};
		this.props.setPageLoader();
	}

	componentDidMount() { 
		Promise.all([
			this.props.getInterests(),
			this.props.getRecommendation(this.state.page, this.state.length)])
			.then(responses => {
				const response_interests = responses[0];
				const response_recommendation = responses[1];

				if (
					response_interests.status === 200 && 
					response_interests.data.status.code === 0 && 
					response_recommendation.status === 200 && 
					response_recommendation.data.status.code === 0) {
					this.setState({
						interests: response_interests.data.data,
						recommendations: response_recommendation.data.data,
						meta: response_interests.data.meta
					});
					console.log(response_recommendation.data.data);
				}
				this.props.unsetPageLoader();
			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
			});
	}

	render() {
		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<NavSearch />
				<div className="container-box-e">
					<div className="interest-swiper-container">
						<div className="swiper-slide">
							<Img 
								alt={'Alt'} 
								className="content-image"
								unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
								loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
								src={['/static/placeholders/placeholder_landscape.png']} />
							<p className="slide-title selected-slide-title">For You</p>
						</div>
						{this.state.interests.map((interest, i) => (
							<div className="swiper-slide" key={i}>
								<Img 
									alt={interest.name} 
									className="content-image"
									unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									src={[this.state.meta.image_path + 100 + interest.image, '/static/placeholders/placeholder_landscape.png']} />
								<div className="bg-black"></div>
								<p className="slide-title">{interest.name}</p>
							</div>
						))}
						
					</div>
					<div className="content-search">
						<div className="header-list">
							<p className="title">For You</p>
						</div>
						<div className="content-list">
							<Row>
								{this.state.recommendations.map((r, i) => (
									<Col xs={4} key={i}>
										<Img 
											alt={r.title} 
											className="content-image"
											unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
											loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
											src={[this.state.meta.image_path + this.state.resolution + r.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
									</Col>
								))}
							</Row>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...userActions,
	...pageActions,
	...searchActions
})(Explore);

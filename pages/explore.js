import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

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
			recommendations: {},
			meta: {},
			resolution: 140,
			page: {},
			show_more_allowed: {},
			length: 9,
			selected_genre_name: 'For You',
			selected_genre_id: -1
		};
		this.props.setPageLoader();
	}

	componentDidMount() { 
		this.LoadingBar.continuousStart();
		Promise.all([
			this.props.getInterests(),
			this.props.getRecommendation(1, this.state.length)])
			.then(responses => {
				const response_interests = responses[0];
				const response_recommendation = responses[1];

				if (
					response_interests.status === 200 && 
					response_interests.data.status.code === 0 && 
					response_recommendation.status === 200 && 
					response_recommendation.data.status.code === 0) {
					
					let recommendations = this.state.recommendations;
					recommendations[`genre-${this.state.selected_genre_id}`] = response_recommendation.data.data;
					
					let pages = {};
					pages[`genre-${this.state.selected_genre_id}`] = 1;
					
					let showMoreAllowed = this.state.show_more_allowed;
					showMoreAllowed[`genre-${this.state.selected_genre_id}`] = response_recommendation.data.data.length >= this.state.length;

					this.setState({
						interests: response_interests.data.data,
						recommendations: recommendations,
						meta: response_interests.data.meta,
						page: pages,
						show_more_allowed: showMoreAllowed
					});
				}
				this.props.unsetPageLoader();
				this.LoadingBar.complete();
			})
			.catch(error => {
				console.log(error);
				this.LoadingBar.complete();
			});
	}

	selectGenre(genre, category = 'program') {
		let recommendations = this.state.recommendations;
		if (!recommendations[`genre-${genre.id}`]) {
			this.props.setPageLoader();
			this.LoadingBar.continuousStart();
			const page = this.state.page[`genre-${genre.id}`] ? this.state.page[`genre-${genre.id}`] : 1;

			if (genre.id !== -1 ){
				this.props.searchByGenre(genre.id, category, page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							recommendations[`genre-${genre.id}`] = response.data.data;
							
							let pages = this.state.page;
							pages[`genre-${genre.id}`] = page;

							let showMoreAllowed = this.state.show_more_allowed;
							showMoreAllowed[`genre-${genre.id}`] = response.data.data.length >= this.state.length;

							this.setState({
								recommendations: recommendations,
								selected_genre_id: genre.id,
								selected_genre_name: genre.name,
								page: pages,
								show_more_allowed: showMoreAllowed	
							});
						}
						this.props.unsetPageLoader();
						this.LoadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.props.unsetPageLoader();
						this.LoadingBar.complete();
					});
			}
			else {
				this.props.getRecommendation(page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							recommendations[`genre-${genre.id}`] = response.data.data;
							
							let pages = {};
							pages[`genre-${genre.id}`] = page;

							let showMoreAllowed = this.state.show_more_allowed;
							showMoreAllowed[`genre-${genre.id}`] = response.data.data.length >= this.state.length;

							this.setState({
								recommendations: recommendations,
								page: pages,
								selected_genre_id: genre.id,
								selected_genre_name: genre.name,
								show_more_allowed: showMoreAllowed
							});
							this.props.unsetPageLoader();
							this.LoadingBar.complete();
						}
					})
					.catch(error => {
						console.log(error);
						this.props.unsetPageLoader();
						this.LoadingBar.complete();
					});
			}
		}
		else {
			this.setState({
				selected_genre_id: genre.id,
				selected_genre_name: genre.name
			});
		}
	}

	bottomScrollFetch() {
		console.log(this.state.show_more_allowed);
		if (this.state.show_more_allowed[`genre-${this.state.selected_genre_id}`]) {
			this.LoadingBar.continuousStart();
			const page = this.state.page[`genre-${this.state.selected_genre_id}`] ? this.state.page[`genre-${this.state.selected_genre_id}`] + 1 : 1;
			let recommendations = this.state.recommendations;

			if (this.state.selected_genre_id === -1) {
				this.props.getRecommendation(page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							recommendations[`genre-${this.state.selected_genre_id}`].push.apply(recommendations[`genre-${this.state.selected_genre_id}`], response.data.data);
							
							let pages = this.state.page;
							pages[`genre-${this.state.selected_genre_id}`] = page;

							let showMoreAllowed = this.state.show_more_allowed;
							showMoreAllowed[`genre-${this.state.selected_genre_id}`] = response.data.data.length >= this.state.length;

							this.setState({
								recommendations: recommendations,
								page: pages,
								show_more_allowed: showMoreAllowed
							});
							this.LoadingBar.complete();
						}
					})
					.catch(error => {
						console.log(error);
						this.LoadingBar.complete();
					});
			}
			else {
				this.props.searchByGenre(this.state.selected_genre_id, 'program', page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							recommendations[`genre-${this.state.selected_genre_id}`].push.apply(recommendations[`genre-${this.state.selected_genre_id}`], response.data.data);
							
							let pages = this.state.page;
							pages[`genre-${this.state.selected_genre_id}`] = page;

							let showMoreAllowed = this.state.show_more_allowed;
							showMoreAllowed[`genre-${this.state.selected_genre_id}`] = response.data.data.length >= this.state.length;

							this.setState({
								recommendations: recommendations,
								page: pages,
								show_more_allowed: showMoreAllowed	
							});
						}
						this.LoadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.LoadingBar.complete();
					});
			}
		}
		
	}

	render() {
		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<NavSearch />
				<div className="container-box-e">
					<div className="interest-swiper-container">
						<div className="swiper-slide" onClick={() => this.selectGenre({ id: -1, name: 'For You' })}>
							<Img 
								alt={'Alt'} 
								className="content-image"
								unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
								loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
								src={['/static/placeholders/placeholder_landscape.png']} />
							<p className={`slide-title ${this.state.selected_genre_id == -1 ? 'selected-slide-title' : ''}`}>For You</p>
						</div>
						{this.state.interests.map((interest, i) => (
							<div className="swiper-slide" key={i} onClick={() => this.selectGenre(interest)}>
								<Img 
									alt={interest.name} 
									className="content-image"
									unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									src={[this.state.meta.image_path + 100 + interest.image, '/static/placeholders/placeholder_landscape.png']} />
								<div className="bg-black"></div>
								<p className={`slide-title ${this.state.selected_genre_id == interest.id ? 'selected-slide-title' : ''}`}>{interest.name}</p>
							</div>
						))}
						
					</div>
					<div className="content-search">
						<div className="header-list">
							<p className="title">{this.state.selected_genre_name}</p>
						</div>
						<div className="content-list">
							<Row>
								{this.state.recommendations[`genre-${this.state.selected_genre_id}`] && this.state.recommendations[`genre-${this.state.selected_genre_id}`].map((r, i) => (
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

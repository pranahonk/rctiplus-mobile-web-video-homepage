import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

import pageActions from '../redux/actions/pageActions';
import userActions from '../redux/actions/userActions';
import searchActions from '../redux/actions/searchActions';

import Layout from '../components/Layouts/Default_v2';
import NavSearch from '../components/Includes/Navbar/NavSearch';
import SearchResults from './search/result';

import { Row, Col } from 'reactstrap';

import '../assets/scss/components/explore.scss';

import { VISITOR_TOKEN, DEV_API, SITEMAP } from '../config';
import { getCookie } from '../utils/cookie';
import { libraryGeneralEvent, libraryProgramClicked } from '../utils/appier';

class Explores extends React.Component {
	
	static async getInitialProps(ctx) {
		const accessToken = getCookie('ACCESS_TOKEN');
		const status = 'active';
        const res = await fetch(`${DEV_API}/api/v1/genre?status=${status}&infos=id,name,image`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        
        if (error_code) {
            return { initial: false };
        }

        const data = await res.json();
        if (data.status.code === 1) {
            return { initial: false };
		}
		
		const segments = ctx.asPath.split(/\?/);
        let genreId = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.id) {
                genreId = q.id;
            }
		}
		ctx.query.id = genreId ? Number(genreId) : genreId;
		return { query: ctx.query, interests: data };
	}

	constructor(props) {
		super(props);
		let selectedGenreName = 'For You';
		let selectedGenre;
		const interests = this.props.interests.data;
		for (let i = 0; i < interests.length; i++) {
			if (interests[i].id == this.props.query.id) {
				selectedGenre = interests[i];
				selectedGenreName = interests[i].name;
				break;
			}
		}

		this.state = {
			interests: interests,
			recommendations: {},
			meta: this.props.interests.meta,
			resolution: 140,
			page: {},
			show_more_allowed: {},
			length: 9,
			selected_genre: selectedGenre,
			selected_genre_name: selectedGenreName,
			selected_genre_id: this.props.query.id ? this.props.query.id : -1
		};
		this.props.setPageLoader();
	}

	componentDidMount() { 
		if (this.state.selected_genre_id != -1) {
			this.selectGenre(this.state.selected_genre, 'program', true);
		}
		else {
			this.LoadingBar.continuousStart();
			this.props.getRecommendation(1, this.state.length)
				.then(response => {
					if (response.status === 200 && response.data.status.code === 0) {
						let recommendations = this.state.recommendations;
						recommendations[`genre-${this.state.selected_genre_id}`] = response.data.data;
						
						let pages = {};
						pages[`genre-${this.state.selected_genre_id}`] = 1;

						let showMoreAllowed = this.state.show_more_allowed;
						showMoreAllowed[`genre-${this.state.selected_genre_id}`] = response.data.data.length >= this.state.length;

						this.setState({
							recommendations: recommendations,
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

		
	}

	selectGenre(genre, category = 'program', first = false) {
		if (first == false) {
			libraryGeneralEvent('mweb_library_category_clicked');
		}
		
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
		if (!this.props.searches.query && this.state.show_more_allowed[`genre-${this.state.selected_genre_id}`]) {
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

	link(data) {
		libraryProgramClicked(data.title, data.id, data.type ? data.type : 'program', 'mweb_library_program_clicked');

		if (!data.type) {
			Router.push(`/programs/${data.id}/${data.title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}?ref=library`);
			return;
		}

		switch (data.type) {
			case 'program':
				
				Router.push(`/programs/${data.id}/${data.title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}?ref=library`);
				break;
			default:
				Router.push(`/programs/${data.id}/${data.title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}/${data.type}/${data.content_id}/${data.content_title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}?ref=library`);
				break;
		}
	}

	getMetadata() {
		const name = this.state.selected_genre_name.toLowerCase().replace(/ /g, '_');
		if (SITEMAP[`explore_${name}`]) {
			return SITEMAP[`explore_${name}`];
		}
		
		return SITEMAP['explore_for_you'];
	}

	getImageFileName(url) {
		const segments = url.split('/');
		if (segments.length <= 0) {
			return '';
		}

		let filename = segments[segments.length - 1];
		return filename.split('.').slice(0, -1).join('.');
	}

	render() {
		const metadata = this.getMetadata();
		return (
			<Layout title={metadata.title}>
				<Head>
					<meta name="description" content={metadata.description}/>
					<meta name="keywords" content={metadata.keywords}/>
				</Head>
				<BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<NavSearch />
				<div className="container-box-e">
					{this.props.searches.query ? (<SearchResults resolution={this.state.resolution}/>) : (
						<div>
							<div className="interest-swiper-container">
								<Link href={`/explores`} scroll={false}>
									<div className="swiper-slide" onClick={() => this.selectGenre({ id: -1, name: 'For You' })}>
										<Img 
											alt={'For You'} 
											className="content-image"
											unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
											loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
											src={['/static/placeholders/placeholder_landscape.png']} />
										<p className={`slide-title ${this.state.selected_genre_id == -1 ? 'selected-slide-title' : ''}`}>For You</p>
									</div>
								</Link>
								{this.state.interests.map((interest, i) => (
									<Link href={`/explores?id=${interest.id}`} as={`/explores/search?id=${interest.id}`} scroll={false} key={i}>
										<div className="swiper-slide" onClick={() => this.selectGenre(interest)}>
											<Img 
												alt={interest.name} 
												className="content-image"
												unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												src={[this.state.meta.image_path + 100 + interest.image, '/static/placeholders/placeholder_landscape.png']} />
											<div className="bg-black"></div>
											<p className={`slide-title ${this.state.selected_genre_id == interest.id ? 'selected-slide-title' : ''}`}>{interest.name}</p>
										</div>
									</Link>
								))}
								
							</div>
							<div className="content-search">
								<div className="header-list">
									<h2 className="title">{this.state.selected_genre_name}</h2>
								</div>
								<div className="content-list">
									<Row>
										{this.state.recommendations[`genre-${this.state.selected_genre_id}`] && this.state.recommendations[`genre-${this.state.selected_genre_id}`].map((r, i) => (
											<Col xs={4} key={i} onClick={this.link.bind(this, r)}>
												<Img 
													alt={this.getImageFileName(r.portrait_image)} 
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
					)}
					
					
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...userActions,
	...pageActions,
	...searchActions
})(withRouter(Explores));

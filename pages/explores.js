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
import { urlRegex } from '../utils/regex'

import pageActions from '../redux/actions/pageActions';
import userActions from '../redux/actions/userActions';
import searchActions from '../redux/actions/searchActions';

import Layout from '../components/Layouts/Default_v2';
import NavSearch from '../components/Includes/Navbar/NavSearch';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';
import SearchResults from './search/result';

import { Row, Col } from 'reactstrap';

import '../assets/scss/components/explore.scss';

import { VISITOR_TOKEN, DEV_API, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../config';
import { getCookie } from '../utils/cookie';
import { libraryGeneralEvent, libraryProgramClicked } from '../utils/appier';

class Explores extends React.Component {
	
	static async getInitialProps(ctx) {
		const accessToken = getCookie('ACCESS_TOKEN');
		console.log(ctx)
		const status = 'active';
				let resContent = null
        const res = await fetch(`${DEV_API}/api/v1/genre?status=${status}&infos=id,name,image`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });
				if(ctx.asPath) {
					if(ctx.asPath === '/explores') {
						resContent = await fetch(`${DEV_API}/api/v1/recommendation?page=1&length=1`, {
								method: 'GET',
								headers: {
										'Authorization': accessToken ? accessToken : VISITOR_TOKEN
								}
						});
						resContent = resContent.status === 200 ? await resContent.json() : null
					} else {
						resContent = await fetch(`${DEV_API}/api/v1/search/${ctx.query.id}/program?page=1&length=1`, {
								method: 'GET',
								headers: {
										'Authorization': accessToken ? accessToken : VISITOR_TOKEN
								}
						});
						resContent = resContent.status === 200 ? await resContent.json() : null
					}
				}
				// console.log(resContent)
				// resContent = null
				resContent = resContent && resContent.status.code === 0 ? resContent : null
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        
        if (error_code) {
            return { initial: false };
        }

        const data = await res.json();
        if (data.status.code === 1) {
            return { initial: false };
		}
		console.log(resContent)
		return { query: ctx.query, interests: data, genre_name: ctx.query.genre_name, meta_content: resContent };
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
			resolution: RESOLUTION_IMG,
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
		if(this.props.genre_name) {
			const parentElement = document.getElementById('parent-swiper')
			const childElement = document.getElementById(this.props.genre_name)
			parentElement.scrollLeft = childElement?.offsetLeft - 10
		}
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
		const name = this.state.selected_genre_name;
		if (this.state.selected_genre_name.includes('for you') > -1) {
			return {
				title: `Nonton Streaming ${name} Sub Indo Gratis Terlengkap di Indonesia - RCTI+`,
				description: `Nonton kumpulan ${name} program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
				image: '',
				twitter_img_alt: `${name} Di RCTIPlus`
			}
		}
		
		return SITEMAP['explore_for_you'];
	}
	getMetaOg() {
		if(Array.isArray(this.props.meta_content?.data) && this.props.meta_content?.data?.length > 0) {
			const [metaOg, imgPath] = [this.props.meta_content.data[0], this.props.meta_content?.meta?.image_path]
			return {
				title: metaOg.title,
				description: metaOg.summary,
				image: `${imgPath}${metaOg.portrait_image}`,
			}
		}
		return {
				title: '',
				description: '',
				image: '',
			}
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
		const [metadata, ogMetaData] = [this.getMetadata(), this.getMetaOg()];
		return (
			<Layout title={metadata.title}>
				<Head>
					<meta name="description" content={metadata.description}/>
					<meta name="keywords" content={metadata.keywords}/>
					<meta property="og:title" content={ogMetaData.title} />
					<meta property="og:description" content={ogMetaData.description} />
					<meta property="og:image" itemProp="image" content={ogMetaData.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:type" content="website" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={ogMetaData.image} />
					<meta name="twitter:image:alt" content={metadata.twitter_img_alt} />
					<meta name="twitter:title" content={ogMetaData.title} />
					<meta name="twitter:description" content={ogMetaData.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				<BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				{/* <NavSearch /> */}
				{process.env.UI_VERSION == '2.0' ? (<NavDefault_v2 disableScrollListener />) : (<NavDefault disableScrollListener />)}
				<div className="container-box-e" style={{ marginTop: 83 }}>
						<div>
							<div className="interest-swiper-container" id="parent-swiper">
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
									<Link href={`/explores/${interest.id}/${urlRegex(interest.name)}`} scroll={false} key={i}>
										<div className="swiper-slide" id={interest.name} onClick={() => this.selectGenre(interest)}>
											<Img 
												alt={`Genre ${interest.name}`} 
												className="content-image"
												unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												src={[this.state.meta.image_path + RESOLUTION_IMG + interest.image, '/static/placeholders/placeholder_landscape.png']} />
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
											{	r.premium  ? (
													<div className="paid-label">
														<div style={{ position: 'relative', display: 'flex' }}>
															<span className="title-paid-video">Premium</span>
															<span className="icon-paid-video">
																<img src="/icons-menu/crown_icon@3x.png" alt="icon-video"/>
															</span>
														</div>
													</div>
												) : r.label !== undefined || r.label !== '' ? (
													<div className="new-label" style={r.label === undefined || r.label === '' ? { display: 'none' } : { display: 'block' }}>{ r.label }</div>
												) : ''
											}
											{/* <div className="new-label" style="">label</div> */}
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

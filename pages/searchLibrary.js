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
			resolution: RESOLUTION_IMG,
			page: {},
			show_more_allowed: {},
			length: 9,
			selected_genre: selectedGenre,
			selected_genre_name: selectedGenreName,
			selected_genre_id: this.props.query.id ? this.props.query.id : -1
		};
		// this.props.setPageLoader();
	}

	componentWillUnmount() {
		// this.props.searches.setStatusSearch();
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

	getImageFileName(url) {
		const segments = url.split('/');
		if (segments.length <= 0) {
			return '';
		}

		let filename = segments[segments.length - 1];
		return filename.split('.').slice(0, -1).join('.');
	}

	getMetadata() {
		const keyword = this.props.router.query.q || '';
		return {
				title: `Cari konten ${keyword} terbaru - RCTI+`,
				description: `RCTI+ - Pencarian Kumpulan konten terbaru dan terpercaya | ${keyword}`,
				keywords: `rcti plus, rcti+`,
				image: 'https://rctiplus.com/assets/image/elements/logo.b9f35229.png',
				twitter_img_alt: `Hasil Pencarian ${keyword}`,
				url: REDIRECT_WEB_DESKTOP + this.props.router.asPath
			}
	}

	render() {
		const metadata = this.getMetadata();
		return (
			<Layout title={metadata.title}>
				<Head>
					<meta name="description" content={metadata.description}/>
					<meta name="keywords" content={metadata.keywords}/>
					<meta property="og:title" content={metadata.title} />
					<meta property="og:description" content={metadata.description} />
					<meta property="og:image" itemProp="image" content={metadata.image} />
					<meta property="og:url" content={metadata.url} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="og:type" content="article" />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={metadata.image} />
					<meta name="twitter:image:alt" content={metadata.title} />
					<meta name="twitter:title" content={metadata.title} />
					<meta name="twitter:description" content={metadata.description} />
					<meta name="twitter:url" content={metadata.url} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				<BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<NavSearch />
				<div className="container-box-e">
          <SearchResults resolution={this.state.resolution}/>
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

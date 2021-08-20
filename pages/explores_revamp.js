import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Head from 'next/head';
import LoadingBar from 'react-top-loading-bar';
import fetch from 'isomorphic-unfetch';

import pageActions from '../redux/actions/pageActions';
import userActions from '../redux/actions/userActions';
import searchActions from '../redux/actions/searchActions';
import { initGA, redirectToVisionPlus } from '../utils/firebaseTracking';

import Layout from '../components/Layouts/Default_v2';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';
import NavDefault from "../components/Includes/Navbar/NavDefault"

import '../assets/scss/components/explore.scss';

import { VISITOR_TOKEN, DEV_API, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../config';
import { getCookie } from '../utils/cookie';

class ExploresRevamp extends React.Component {
	
	static async getInitialProps(ctx) {
		const accessToken = getCookie('ACCESS_TOKEN');
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
		resContent = resContent && resContent.status.code === 0 ? resContent : null
		const error_code = res.statusCode > 200 ? res.statusCode : false;
		
		if (error_code) return { initial: false }

		const data = await res.json();
		if (data.status.code === 1) return { initial: false }

		return {
      query: ctx.query,
      interests: data, 
      genre_name: ctx.query.genre_name, 
      meta_content: resContent
    };
	}

  state = {
    recommendations: {},
    meta: this.props.interests.meta,
    resolution: RESOLUTION_IMG,
    page: {},
    show_more_allowed: {},
    length: 9,
    selected_genre: "",
    selected_genre_name: "For You",
    selected_genre_id: this.props.query.id ? this.props.query.id : -1
  }

	componentDidMount() {
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

    this.setState({
      selected_genre: selectedGenre,
      selected_genre_name: selectedGenreName
    })
	}

	getMetadata() {
		const name = this.state.selected_genre_name;
		const nameLowercase = this.state.selected_genre_name?.toLowerCase()?.replace(/ /g, '_') || 'rctiplus'
		if (!this.state.selected_genre_name.includes('For You')) {
			return {
				title: `Nonton Streaming ${name} Sub Indo Gratis Terlengkap di Indonesia - RCTI+`,
				description: `Nonton kumpulan ${name} program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
				image: '',
				keywords: SITEMAP[`explore_${nameLowercase}`]?.keywords || 'rctiplus',
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

	redirectToVideoPlus() {
		redirectToVisionPlus(this.props.user.data)
		const isAndroid = /android|windows/ig.test(navigator.userAgent)
		const href = isAndroid ? "https://www.visionplus.id/page?src=rpl" : "https://www.visionplus.id/?src=rpl"
		window.open(href, "_blank").focus()
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
					<meta property="og:type" content="article" />
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
				<LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
        
        {process.env.UI_VERSION == '2.0' 
          ? (<NavDefault_v2 disableScrollListener />) 
          : (<NavDefault disableScrollListener />)
        }

				<div id="library-revamp">
					<figure style={{width: "100%", margin: "0 0 1rem 0"}}>
						<img src="static/img/homepage_revamp_library.svg" width="100%" />
					</figure>
					<button onClick={_ => this.redirectToVideoPlus()}>
						Go To Vision+
					</button>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...userActions,
	...pageActions,
	...searchActions
})(withRouter(ExploresRevamp));

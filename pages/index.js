import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import { StickyContainer, Sticky } from 'react-sticky';
import dynamic from "next/dynamic"

import contentActions from '../redux/actions/contentActions';
import pageActions from '../redux/actions/pageActions';
import adsActions from '../redux/actions/adsActions';

import initialize from '../utils/initialize';
import { homeGeneralClicked } from '../utils/appier';

import Layout from '../components/Layouts/Default_v2';
import Nav from '../components/Includes/Navbar/NavDefault_v2';
import Carousel from '../components/Includes/Gallery/Carousel_v2';
import Stories from '../components/Includes/Gallery/Stories_v2';
import StickyAds from '../components/Includes/Banner/StickyAds';
import GridMenu from '../components/Includes/Common/HomeCategoryMenu';
import HomeLoader from '../components/Includes/Shimmer/HomeLoader';
import JsonLDWebsite from '../components/Seo/JsonLDWebsite';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../config';
import { setCookie, getCookie, getVisitorToken } from '../utils/cookie';
import { RPLUSAppVisit } from '../utils/internalTracking';
import { GET_LINEUPS } from "../graphql/queries/homepage"
import { client } from "../graphql/client"

// NEW RPLUS LINEUP CONTENTS
const VideoLandscapeMiniWtView = dynamic(() => import("../components/lineups/LandscapeMiniWt"))
const VideoLandscapeMiniView = dynamic(() => import("../components/lineups/LandscapeMini"))
const VideoLandscapeLgWsView = dynamic(() => import("../components/lineups/LandscapeLgWs"))
const VideoLandscape219View = dynamic(() => import("../components/lineups/Landscape219"))
const VideoLandscapeLgView = dynamic(() => import("../components/lineups/LandscapeLg"))
const VideoLandscapeMiniLiveView = dynamic(() => import("../components/lineups/LandscapeMiniLive"))
const VideoPortraitView = dynamic(() => import("../components/lineups/Portrait"))
const VideoSquareMiniView = dynamic(() => import("../components/lineups/SquareMini"))
const VideoSquareView = dynamic(() => import("../components/lineups/Square"))
const NewsHorizontalLandscape = dynamic(() => import("../components/lineups/news/HorizontalLandscape"));
const HorizontalHastags = dynamic(() => import("../components/lineups/news/HorizontalHastags"));
const LandscapeHotCompetition = dynamic(() => import("../components/lineups/hot/LandscapeHotCompetition"));
const HorizontalMutipleLandscape = dynamic(() => import("../components/lineups/news/HorizontalMutipleLandscape"));
const LandscapeHotVideo = dynamic(() => import("../components/lineups/hot/LandscapeHotVideo"));
const ComingSoonModal = dynamic(() => import("../components/Modals/ComingSoonModal"))

class Index_v2 extends React.Component {
    static async getInitialProps(ctx) {
        initialize(ctx);
    }

    state = {
        lineups: [],
        meta: {},
        length: 10,
        show_sticky_install: false,
        sticky_ads_closed: false,
        isShimmer: true,
        token: "",
        openComingSoonModal: false,
        contentComingSoonModal: {}
    }

    LoadingBar = null
    swipe = {}

    onTouchStart(e) {
		const touch = e.touches[0];
		this.swipe = { y: touch.clientY };
	}

	onTouchEnd(e) {
		const touch = e.changedTouches[0];
		const absY = Math.abs(touch.clientY - this.swipe.y);
		if (absY > 50) {
			homeGeneralClicked('mweb_homepage_scroll_vertical');
        }
	}

    componentDidMount() {
        RPLUSAppVisit();

        const accessToken = getCookie('ACCESS_TOKEN');
        this.setState({
            token: (accessToken == undefined) ? getVisitorToken() : accessToken
        })
        window.onbeforeunload = _ => {
            homeGeneralClicked('mweb_homepage_refresh');
        };

        this.getHomePageLineups(1, this.state.length)

        if (getCookie('STICKY_INSTALL_CLOSED')) {
            this.setState({ show_sticky_install: !getCookie('STICKY_INSTALL_CLOSED') });
        }
        else {
            this.setState({ show_sticky_install: true });
        }
    }

    getHomePageLineups(page, pageSize) {
        this.LoadingBar.continuousStart();
        client.query({ query: GET_LINEUPS(page, pageSize) })
            .then(({ data }) => {
                const mappedContents = new Map()
                this.state.lineups.concat(data.lineups.data).forEach(content => {
                    mappedContents.set(content.id, content)
                })
                this.setState({
                    lineups: [ ...mappedContents.values() ],
                    meta: data.lineups.meta
                })
            })
            .finally(_ => {
                if (page === 1) this.setState({ isShimmer: false })
                this.LoadingBar.complete();
            })
    }

    bottomScrollFetch() {
        const { pagination } = this.state.meta
        if (pagination.total_page === pagination.current_page) return

        this.getHomePageLineups(pagination.current_page + 1, this.state.length);
    }

    closeStickyInstall(self) {
        setCookie('STICKY_INSTALL_CLOSED', 1);
        self.setState({ show_sticky_install: false });
    }

    setComingSoonModalState(open, content) {
        this.setState({
            openComingSoonModal: open,
            contentComingSoonModal: content
        })
    }

    renderLineup(lineups, meta) {
        return lineups.map((lineup, index) => {
            switch(lineup.display_type) {
                case "portrait" :
                    return (
                        <VideoPortraitView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large_ws" :
                    return (
                        <VideoLandscapeLgWsView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            showComingSoonModal={(open, content) => this.setComingSoonModalState(open, content)}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large" :
                    return (
                        <VideoLandscapeLgView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_219" :
                    return (
                        <VideoLandscape219View
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_wt" :
                    return (
                        <VideoLandscapeMiniWtView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini" :
                    return (
                        <VideoLandscapeMiniView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "square_mini" :
                    return (
                        <VideoSquareMiniView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "square" :
                    return (
                        <VideoSquareView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_live" :
                    return (
                        <VideoLandscapeMiniLiveView
                            token={this.state.token}
                            key={lineup.id}
                            loadingBar={this.LoadingBar}
                            contentId={lineup.id}
                            showComingSoonModal={(open, content) => this.setComingSoonModalState(open, content)}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
              case 'tag':
                return (
                  <HorizontalHastags key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} />
                )

           case 'landscape_news':
             return (
               <NewsHorizontalLandscape key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} />
             )
           case "square_list_news":
             return (
               <HorizontalMutipleLandscape key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} />
             )
           case "landscape_hot_competition":
             return(
               <LandscapeHotCompetition key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} />
             )
           case "portrait_hot":
             return(
               <LandscapeHotVideo key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} />
             )
         }
        })
    }

    render() {
        return (
            <Layout title={SITEMAP.home.title}>
                <Head>
                    <JsonLDWebsite keyword={'Home'} />
                    <meta name="description" content={SITEMAP.home.description} />
                    <meta name="keywords" content={SITEMAP.home.keywords} />
                    <meta property="og:title" content={SITEMAP.home.title} />
                    <meta property="og:description" content={SITEMAP.home.description} />
                    <meta property="og:image" itemProp="image" content={SITEMAP.home.image} />
                    <meta property="og:url" content={REDIRECT_WEB_DESKTOP} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={SITE_NAME} />
                    <meta property="og:type" content="article" />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={SITEMAP.home.image} />
                    <meta name="twitter:title" content={SITEMAP.home.title} />
                    <meta name="twitter:description" content={SITEMAP.home.description} />
                    <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
                    <meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
                </Head>

                <BottomScrollListener
                  offset={150}
                  onBottom={this.bottomScrollFetch.bind(this)} />

                <LoadingBar
                    progress={0}
                    height={3}
                    color={this.state.show_sticky_install ? '#000' : '#fff'}
                    onRef={ref => (this.LoadingBar = ref)} />

                {this.state.isShimmer
                    ? (<HomeLoader/>)
                    : (
                        <div>
                            <Nav
                                parent={this}
                                closeStickyInstallFunction={this.closeStickyInstall}
                                showStickyInstall={this.state.show_sticky_install}/>
                            <Carousel showStickyInstall={this.state.show_sticky_install} >
                                <GridMenu />
                            </Carousel>

                            <div style={{marginTop: "25px"}}>
                                <Stories loadingBar={this.LoadingBar} homepage={true}/>
                            </div>

                            <StickyContainer>
                                <Sticky disableHardwareAcceleration>
                                    { ({ distanceFromTop, isSticky, wasSticky, distanceFromBottom, calculatedHeight, ...rest }) => {
                                        const topDistance = this.state.show_sticky_install ? 120 : 40;
                                        if (distanceFromTop < topDistance) {
                                            if (!this.props.ads.ads_displayed) {
                                                return (
                                                    <div {...rest} >
                                                        <StickyAds/>
                                                    </div>
                                                );
                                            }
                                            const adsContents = document.getElementById(process.env.MODE === 'PRODUCTION' ? 'div-gpt-ad-1584677487159-0' : 'div-gpt-ad-1584677577539-0').childNodes;
                                            if (adsContents.length > 0) {
                                                if (adsContents[0].tagName == 'SCRIPT') {
                                                    const stickyAds = document.getElementById('sticky-ads-container');
                                                    if (stickyAds) {
                                                        stickyAds.style.display = 'none'
                                                    }
                                                }
                                            }
                                            return (
                                                <div {...rest} >
                                                    <StickyAds sticky/>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div {...rest} >
                                                <StickyAds id='div-gpt-ad-1584677577539-0'/>
                                            </div>
                                        );
                                    } }
                                </Sticky>
                            </StickyContainer>

                            <div
                                style={{marginBottom: 45, paddingTop: 10}}
                                onTouchStart={this.onTouchStart.bind(this)}
                                onTouchEnd={this.onTouchEnd.bind(this)}>
                                { this.renderLineup(this.state.lineups, this.state.meta) }
                            </div>
                            <ComingSoonModal
                                open={this.state.openComingSoonModal}
                                onClose={_ => this.setState({ openComingSoonModal: false })}
                                content={this.state.contentComingSoonModal} />
                        </div>
                    )
                }
        </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...pageActions,
    ...adsActions
})(Index_v2);

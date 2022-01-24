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

import { SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG, STATIC } from '../config';
import { setCookie, getCookie, getVisitorToken } from '../utils/cookie';
import { RPLUSAppVisit } from '../utils/internalTracking';
import { gaTrackerScreenView } from '../utils/ga-360';

const Panel1 = dynamic(() => import("../components/Panels/Pnl_1"))
const Panel2 = dynamic(() => import("../components/Panels/Pnl_2"))
const Panel3 = dynamic(() => import("../components/Panels/Pnl_3"))
const Panel4 = dynamic(() => import("../components/Panels/Pnl_4"))
const Panel5 = dynamic(() => import("../components/Panels/Pnl_5"))
const SquareImage = dynamic(() => import("../components/Panels/SquareImage"))

class Index_v2 extends React.Component {
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
            resolution: 320,
            is_loading: false,
            length: 10,
            show_sticky_install: false,
            sticky_ads_closed: false,
            isShimmer: true,
        };

        // this.props.setPageLoader();
        this.swipe = {};
        this.token = '';
    }

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
        gaTrackerScreenView()

        const accessToken = getCookie('ACCESS_TOKEN');
        this.token = accessToken == undefined ? getVisitorToken() : accessToken;
        window.onbeforeunload = e => {
            homeGeneralClicked('mweb_homepage_refresh');
        };

        this.props.getContents(this.state.page, this.state.length)
            .then(response => {
                this.setState({ contents: this.props.contents.homepage_content, meta: this.props.contents.meta, isShimmer:false }, () => this.props.unsetPageLoader());
            })
            .catch(error => {
                this.props.unsetPageLoader();
                this.setState({ isShimmer: false });
            });

        if (getCookie('STICKY_INSTALL_CLOSED')) {
            this.setState({ show_sticky_install: !getCookie('STICKY_INSTALL_CLOSED') });
        }
        else {
            this.setState({ show_sticky_install: true });
        }
    }

    bottomScrollFetch() {
        const page = this.state.page + 1;
        if (this.state.fetchAllowed && !this.state.is_loading) {
            this.setState({ is_loading: true }, () => {
                this.LoadingBar.continuousStart();
                this.props.getContents(page, this.state.length)
                    .then(response => {
                        const homepageContents = this.state.contents;
                        if (this.props.contents.homepage_content.length > 0) {
                            homepageContents.push.apply(homepageContents, this.props.contents.homepage_content);
                            this.setState({
                                contents: homepageContents,
                                page: page,
                                fetchAllowed: page != this.state.meta.pagination.total_page,
                                is_loading: false
                            });
                        }
                        else {
                            this.setState({ fetchAllowed: false, is_loading: false });
                        }
                        this.LoadingBar.complete();
                    })
                    .catch(error => {
                        this.LoadingBar.complete();
                        this.setState({ is_loading: false });
                    });
            });
        }
    }

    closeStickyInstall(self) {
        setCookie('STICKY_INSTALL_CLOSED', 1);
        self.setState({ show_sticky_install: false });
    }

    render() {
        const contents = this.state.contents;
        const meta = this.state.meta || {};

        return (
            <Layout title={"RCTI+ - Satu Aplikasi, Semua Hiburan"}>
                <Head>
                    <JsonLDWebsite keyword={'Home'} />
                    <meta name="description" content={"Nonton Film & Live Streaming TV Online di RCTI Plus. Satu Aplikasi, Semua Hiburan: Video, Berita, Radio, Podcast, Games, dan Ajang Pencarian Bakat. Download sekarang."} />
                    <meta name="keywords" content={"rcti plus, rcti+, tv online, streaming tv, live streaming, nonton film"} />
                    <meta property="og:title" content={"RCTI+ - Satu Aplikasi, Semua Hiburan"} />
                    <meta property="og:description" content={"Nonton Film & Live Streaming TV Online di RCTI Plus. Satu Aplikasi, Semua Hiburan: Video, Berita, Radio, Podcast, Games, dan Ajang Pencarian Bakat. Download sekarang."} />
                    <meta property="og:image" itemProp="image" content={`${STATIC}/media/600/files/fta_rcti/metaimages/Home-RCTIPlus-compress.jpg`} />
                    <meta property="og:url" content={REDIRECT_WEB_DESKTOP} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="315" />
                    <meta property="og:site_name" content={SITE_NAME} />
                    <meta property="og:type" content="article" />
                    <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
                    <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
                    <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
                    <meta name="twitter:image" content={`${STATIC}/media/600/files/fta_rcti/metaimages/Home-RCTIPlus-compress.jpg`} />
                    <meta name="twitter:title" content={"RCTI+ - Satu Aplikasi, Semua Hiburan"} />
                    <meta name="twitter:description" content={"Nonton Film & Live Streaming TV Online di RCTI Plus. Satu Aplikasi, Semua Hiburan: Video, Berita, Radio, Podcast, Games, dan Ajang Pencarian Bakat. Download sekarang."} />
                    <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
                    <meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
                </Head>
                <BottomScrollListener offset={150} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color={this.state.show_sticky_install ? '#000' : '#fff'} onRef={ref => (this.LoadingBar = ref)} />
                {this.state.isShimmer ? (<HomeLoader/>) : (
                <div>
                    <Nav parent={this} closeStickyInstallFunction={this.closeStickyInstall} showStickyInstall={this.state.show_sticky_install}/>
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
                        <div style={{marginBottom: 45, paddingTop: 10}} onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}>
                            {contents.map((content, i) => {
                                if(content.content_type === "story"){
                                    return <Panel5 token={this.token} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;
                                }
                                switch (content.display_type) {
                                    case 'horizontal_landscape_large':
                                        return <Panel1 token={this.token} type={content.type} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                                    case 'horizontal_landscape':
                                        return <Panel2 token={this.token} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                                    case 'horizontal':
                                        return <Panel3 token={this.token} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                                    case 'vertical':
                                        return <Panel4 token={this.token} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                                    case 'horizontal_square':
                                        return (
                                            <SquareImage
                                                token={this.token}
                                                loadingBar={this.LoadingBar}
                                                key={content.id}
                                                contentId={content.id}
                                                title={content.title}
                                                content={content.content}
                                                imagePath={meta.image_path}
                                                type={content.type}
                                                resolution={RESOLUTION_IMG}
                                                displayType={content.display_type}/>
                                        );
                                }

                            })}
                        </div>
                </div>
                )}
        </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...pageActions,
    ...adsActions
})(Index_v2);

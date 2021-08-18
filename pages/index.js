import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import { StickyContainer, Sticky } from 'react-sticky';

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
import MainPanels from '../components/Panels/MainPanels';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../config';
import { setCookie, getCookie, getVisitorToken } from '../utils/cookie';
import { RPLUSAppVisit } from '../utils/internalTracking';

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
        
        const accessToken = getCookie('ACCESS_TOKEN');
        this.token = accessToken == undefined ? getVisitorToken() : accessToken;
        window.onbeforeunload = e => {
            homeGeneralClicked('mweb_homepage_refresh');
        };

        this.props.getContents(this.state.page, this.state.length)
            .then(_ => {
                this.setState({ 
                    contents: this.props.contents.homepage_content, 
                    meta: this.props.contents.meta, 
                    isShimmer: false
                });
            })
            .catch(_ => this.setState({ isShimmer: false }))
            .finally(_ => this.props.unsetPageLoader())

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
                        console.log(error);
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
                <BottomScrollListener offset={150} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color={this.state.show_sticky_install ? '#000' : '#fff'} onRef={ref => (this.LoadingBar = ref)} />
                
                {this.state.isShimmer 
                    ? (<HomeLoader/>) 
                    : (
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
                                <MainPanels 
                                    contents={contents}
                                    token={this.token}
                                    loadingBar={this.LoadingBar}
                                    imagePath={meta.image_path}
                                    resolution={RESOLUTION_IMG} />
                            </div>
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

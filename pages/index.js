import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import { Sticky, StickyContainer } from 'react-sticky';
import dynamic from 'next/dynamic';

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

import { GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, SITE_NAME, SITEMAP } from '../config';
import { getCookie, setCookie, setVisitorToken } from '../utils/cookie';
import { RPLUSAppVisit } from '../utils/internalTracking';
import { GET_LINEUPS } from '../graphql/queries/homepage';
import { client } from '../graphql/client';
import { gaTrackerScreenView } from '../utils/ga-360';

// NEW RPLUS LINEUP CONTENTS
const PortraitShortView = dynamic(() => import("../components/lineups/PortraitShort"))
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
const ComingSoonModal = dynamic(() => import("../components/Modals/ComingSoonModal"));
const AudioHorizontalDisc = dynamic(() => import("../components/lineups/audio_lineup/Disc"));
const AudioHorizontalList = dynamic(() => import("../components/lineups/audio_lineup/List"));

class Index_v2 extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
  }

  state = {
    lineups: [],
    gpt: {},
    meta: {},
    length: 5,
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
    gaTrackerScreenView();


    window.onbeforeunload = _ => {
      homeGeneralClicked('mweb_homepage_refresh');
    };

    this.getHomePageLineups()

    if (getCookie('STICKY_INSTALL_CLOSED')) {
      this.setState({ show_sticky_install: !getCookie('STICKY_INSTALL_CLOSED') });
    }
    else {
      this.setState({ show_sticky_install: true });
    }
  }

  async getHomePageLineups(page = 1, pageSize = 5) {
    this.LoadingBar.continuousStart();
    await setVisitorToken()

    client.query({ query: GET_LINEUPS(page, pageSize) })
      .then(({ data }) => {
        const mappedContents = new Map()
        this.state.lineups.concat(data.lineups.data).forEach(content => {
          if (content.lineup_type_detail.detail) {
            mappedContents.set(content.id, content)
          }
        })
        console.log(data)
        this.setState({
          lineups: [ ...mappedContents.values() ],
          meta: data.lineups.meta,
          gpt: data.gpt.data
        })
      })
      .finally(_ => {
        if (page === 1) this.setState({ isShimmer: false })
        this.LoadingBar.complete();
      })
  }

  bottomScrollFetch() {
    const { pagination = {} } = this.state.meta
    if (pagination.total_page === pagination.current_page) return

    this.getHomePageLineups(pagination.current_page + 1)
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
        case "portrait_short" :
          return (
            <PortraitShortView
              lineup={lineup}
              key={lineup.id}
              imagePath={meta.image_path} />
          )
        case "portrait" :
          return (
            <VideoPortraitView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "landscape_large_ws" :
          return (
            <VideoLandscapeLgWsView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              showComingSoonModal={(open, content) => this.setComingSoonModalState(open, content)}
              imagePath={meta.image_path} />
          )
        case "landscape_large" :
          return (
            <VideoLandscapeLgView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "landscape_219" :
          return (
            <VideoLandscape219View
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "landscape_mini_wt" :
          return (
            <VideoLandscapeMiniWtView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "landscape_mini" :
          return (
            <VideoLandscapeMiniView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "square_mini" :
          return (
            <VideoSquareMiniView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "square" :
          return (
            <VideoSquareView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              imagePath={meta.image_path} />
          )
        case "landscape_mini_live" :
          return (
            <VideoLandscapeMiniLiveView
              key={lineup.id}
              loadingBar={this.LoadingBar}
              lineup={lineup}
              showComingSoonModal={(open, content) => this.setComingSoonModalState(open, content)}
              imagePath={meta.image_path} />
          )
        case 'tag':
          return (
            <HorizontalHastags
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              data={lineup}
              id={lineup.id} />
          )
        case 'landscape_news':
          return (
            <NewsHorizontalLandscape
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              data={lineup}
              id={lineup.id} />
          )
        case "square_list_news":
          return (
            <HorizontalMutipleLandscape
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              data={lineup}
              id={lineup.id} />
          )
        case "landscape_hot_competition":
          return(
            <LandscapeHotCompetition
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              id={lineup.id}
              data={lineup} />
          )
        case "portrait_hot":
          return(
            <LandscapeHotVideo
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              id={lineup.id}
              data={lineup} />
          )
        case "square_list_audio":
          return(
            <AudioHorizontalList
              key={lineup.id}
              title={lineup.title}
              indexTag={index}
              id={lineup.id}
              data={lineup} />
          );
        case "portrait_disc":
          return(
            <AudioHorizontalDisc
              title={lineup.title}
              key={lineup.id}
              data={lineup}
              indexTag={index}
              id={lineup.id}
            />
          );
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
          color="#05B5F5"
          onRef={ref => (this.LoadingBar = ref)} />

          {this.state.isShimmer
            ? (<HomeLoader/>)
            : (
              <>
                <div>
                  <Nav
                    parent={this}
                    closeStickyInstallFunction={this.closeStickyInstall}
                    showStickyInstall={this.state.show_sticky_install}/>

                  <Carousel showStickyInstall={this.state.show_sticky_install} />

                  <GridMenu />

                  <Stories />

                  <StickyContainer>
                    <Sticky disableHardwareAcceleration>
                      { ({ distanceFromTop, isSticky, wasSticky, distanceFromBottom, calculatedHeight, ...rest }) => {
                        const topDistance = this.state.show_sticky_install ? 120 : 40;
                        if (distanceFromTop < topDistance) {
                          if (!this.props.ads.ads_displayed) {
                            return (
                              <div {...rest} >
                                <StickyAds
                                  path={this.state.gpt.path}
                                  id={this.state.gpt.div_gpt}
                                  targettingAdsData={this.state.gpt.cust_params}/>
                              </div>
                            );
                          }
                          const adsContents = document.getElementById(this.state.gpt.div_gpt).childNodes;
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
                              <StickyAds
                                path={this.state.gpt.path}
                                id={this.state.gpt.div_gpt} sticky
                                targettingAdsData={this.state.gpt.cust_params} />
                            </div>
                          );
                        }
                        else if (!this.props.ads.ads_displayed) {
                          this.props.toggleAds(true)
                        }
                        return (
                          <div {...rest} >
                            <StickyAds
                              path={this.state.gpt.path}
                              id={this.state.gpt.div_gpt}
                              targettingAdsData={this.state.gpt.cust_params} />
                          </div>
                        );
                      }}
                    </Sticky>
                  </StickyContainer>
                </div>

                <div
                  style={{marginBottom: this.props.ads.ads_displayed ? 80 : 45, paddingTop: 10}}
                  onTouchStart={this.onTouchStart.bind(this)}
                  onTouchEnd={this.onTouchEnd.bind(this)}>
                  { this.renderLineup(this.state.lineups, this.state.meta) }
                </div>
                <ComingSoonModal
                  open={this.state.openComingSoonModal}
                  onClose={_ => this.setState({ openComingSoonModal: false })}
                  content={this.state.contentComingSoonModal} />
              </>
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

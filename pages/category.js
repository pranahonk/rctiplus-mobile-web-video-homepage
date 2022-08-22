import React, {useEffect, useRef, useState } from 'react'
import router, { Router, useRouter, withRouter } from 'next/router'
import { connect } from "react-redux"
import BottomScrollListener from 'react-bottom-scroll-listener'
import LoadingBar from 'react-top-loading-bar'
import { StickyContainer, Sticky } from 'react-sticky'
import dynamic from 'next/dynamic'

import HomeLoader from '../components/Includes/Shimmer/HomeLoader'
import Layout from '../components/Layouts/Default_v2'
import { gaTrackerScreenView } from '../utils/ga-360'

import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2'
import GridMenu from '../components/Includes/Common/HomeCategoryMenu'
import Stories from '../components/Includes/Gallery/Stories_v2'
import StickyAds from '../components/Includes/Banner/StickyAds'
import { client } from "../graphql/client"
import { GET_LINEUPS } from "../graphql/queries/homepage"
import adsActions from '../redux/actions/adsActions'
import { setVisitorToken } from '../utils/cookie'
import Cookies from 'js-cookie'
import { titleStringUrlRegex, urlRegex } from '../utils/regex'

const VideoLandscapeMiniWtView = dynamic(() => import("../components/lineups/LandscapeMiniWt"))
const VideoLandscapeMiniView = dynamic(() => import("../components/lineups/LandscapeMini"))
const VideoLandscapeLgWsView = dynamic(() => import("../components/lineups/LandscapeLgWs"))
const VideoLandscape219View = dynamic(() => import("../components/lineups/Landscape219"))
const VideoLandscapeLgView = dynamic(() => import("../components/lineups/LandscapeLg"))
const VideoLandscapeMiniLiveView = dynamic(() => import("../components/lineups/LandscapeMiniLive"))
const VideoPortraitView = dynamic(() => import("../components/lineups/Portrait"))
const VideoSquareMiniView = dynamic(() => import("../components/lineups/SquareMini"))
const VideoSquareView = dynamic(() => import("../components/lineups/Square"))
const ComingSoonModal = dynamic(() => import("../components/Modals/ComingSoonModal"))
const PortraitShortView = dynamic(() => import("../components/lineups/PortraitShort"))
const NewsHorizontalLandscape = dynamic(() => import("../components/lineups/news/HorizontalLandscape"))
const HorizontalHastags = dynamic(() => import("../components/lineups/news/HorizontalHastags"))
const LandscapeHotCompetition = dynamic(() => import("../components/lineups/hot/LandscapeHotCompetition"))
const HorizontalMutipleLandscape = dynamic(() => import("../components/lineups/news/HorizontalMutipleLandscape"))
const LandscapeHotVideo = dynamic(() => import("../components/lineups/hot/LandscapeHotVideo"))
const AudioHorizontalDisc = dynamic(() => import("../components/lineups/audio_lineup/Disc"))
const AudioHorizontalList = dynamic(() => import("../components/lineups/audio_lineup/List"))

function Category (props) {
    const [ isShimmer, setIsShimmer ] = useState(false)
    const [ lineups, setLineups ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ openComingSoonModal, setOpenComingSoonModal ] = useState(false)
    const [ contentComingSoonModal, setContentComingSoonModal ] = useState({})
    const router = useRouter();
    const loadingBar = useRef(null)

    const bottomScrollFetch = () => {
        if (!meta.pagination) return

        const { total_page, current_page } = meta.pagination
        if (total_page === current_page) return

        getCategoryLineups(current_page + 1)
    }

    useEffect(() => {
        getCategoryLineups()
        gaTrackerScreenView()
    }, [ props.router.query.category_id ])

    useEffect(() => {
        const { category_id, category_title} = props.router.query
        let href, as

        href = `/category?category_id=${category_id}&category_title=${(category_title)}`;
        as = `/category/${category_id}/${titleStringUrlRegex(category_title).toLowerCase()}`;

        router.push(href, as, { shallow: true });
    },[])

    const getCategoryLineups = async (page = 1, pageSize = 5) => {
        await setVisitorToken()
        if(Cookies.get('VISITOR_TOKEN') || Cookies.get('ACCESS_TOKEN')) {
        if (page === 1) setIsShimmer(true)
            client
                .query({ query: GET_LINEUPS(page, pageSize, props.router.query.category_id) })
                .then(({ data }) => {
                    let newLineups = data.lineups.data

                    if (page > 1) {
                        newLineups = lineups.concat(newLineups)
                    }

                    const mappedContents = new Map()
                    newLineups.forEach(content => {
                        if (content.lineup_type_detail.detail) {
                            mappedContents.set(content.id, content)
                        }
                    })
                    setLineups([ ...mappedContents.values() ])
                    setMeta(data.lineups.meta)
                })
                .catch(_ => {})
                .finally(_ => {
                    if (page === 1) setIsShimmer(false)
            })
        }
    }

    const setComingSoonModalState = (open, content) => {
        setOpenComingSoonModal(open)
        setContentComingSoonModal(content)
    }

    const renderLineups = () => {
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
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large_ws" :
                    return (
                        <VideoLandscapeLgWsView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            showComingSoonModal={(open, content) => setComingSoonModalState(open, content)}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large" :
                    return (
                        <VideoLandscapeLgView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "landscape_219" :
                    return (
                        <VideoLandscape219View
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_wt" :
                    return (
                        <VideoLandscapeMiniWtView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini" :
                    return (
                        <VideoLandscapeMiniView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "square_mini" :
                    return (
                        <VideoSquareMiniView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "square" :
                    return (
                        <VideoSquareView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_live" :
                    return (
                        <VideoLandscapeMiniLiveView
                            key={lineup.id}
                            loadingBar={loadingBar.current}
                            lineup={lineup}
                            showComingSoonModal={(open, content) => setComingSoonModalState(open, content)}
                            imagePath={meta.image_path} />
                    )
                case 'tag':
                  return (
                    <HorizontalHastags key={lineup.id} title={lineup.title} indexTag={index} data={lineup} id={lineup.id} />
                  )
                case 'landscape_news':
                  return (
                    <NewsHorizontalLandscape key={lineup.id} title={lineup.title} indexTag={index} data={lineup} id={lineup.id} />
                  )
                case "square_list_news":
                  return (
                    <HorizontalMutipleLandscape key={lineup.id} title={lineup.title} indexTag={index} data={lineup} id={lineup.id} />
                  )
                case "landscape_hot_competition":
                  return(
                    <LandscapeHotCompetition key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} data={lineup} />
                  )
                case "portrait_hot":
                  return(
                    <LandscapeHotVideo key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} data={lineup} />
                  )
                case "square_list_audio":
                  return(
                    <AudioHorizontalList  key={lineup.id} title={lineup.title} indexTag={index} id={lineup.id} data={lineup} />
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

    return (
        <Layout >
            <LoadingBar
                progress={0}
                height={3}
                color={'#fff'}
                ref={loadingBar} />

            <BottomScrollListener
                offset={150}
                onBottom={bottomScrollFetch} />

            { isShimmer
                ? <HomeLoader />
                : (
                    <>
                        <div style={{marginTop: "56px"}}>
                            <Header title={ props.router.query.category_title.replace(/[^a-z0-9A-Z]/g, ' ')} />

                            <div style={{marginTop: -3}}>
                                <Carousel category />
                            </div>

                            <GridMenu />

                            <Stories />

                            <StickyContainer>
                                <Sticky disableHardwareAcceleration>
                                    { ({ distanceFromTop, isSticky, wasSticky, distanceFromBottom, calculatedHeight, ...rest }) => {
                                        const topDistance = 40;
                                        if (distanceFromTop < topDistance) {
                                            if (!props.ads.ads_displayed) {
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
                                        else if (!props.ads.ads_displayed) {
                                          props.toggleAds(true)
                                        }
                                        return (
                                            <div {...rest} >
                                                <StickyAds id='div-gpt-ad-1584677577539-0'/>
                                            </div>
                                        );
                                    } }
                                </Sticky>
                            </StickyContainer>

                            <div style={{ marginBottom: 45}}>
                                <div style={{marginTop: 10}}>
                                    { renderLineups() }
                                </div>
                            </div>
                        </div>
                        <ComingSoonModal
                            open={openComingSoonModal}
                            onClose={_ => setOpenComingSoonModal(false)}
                            content={contentComingSoonModal} />
                    </>
                )
            }
        </Layout>
    )
}

export default connect(state => state, {
    ...adsActions,
})(withRouter(Category))

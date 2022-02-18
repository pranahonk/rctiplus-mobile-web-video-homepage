import React, {useEffect, useRef, useState } from 'react'
import { withRouter } from 'next/router'
import { useSelector } from "react-redux"
import BottomScrollListener from 'react-bottom-scroll-listener'
import LoadingBar from 'react-top-loading-bar'
import { StickyContainer, Sticky } from 'react-sticky'
import dynamic from 'next/dynamic'

import HomeLoader from '../components/Includes/Shimmer/HomeLoader'
import Layout from '../components/Layouts/Default_v2'
import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2'
import GridMenu from '../components/Includes/Common/HomeCategoryMenu'
import Stories from '../components/Includes/Gallery/Stories_v2'
import StickyAds from '../components/Includes/Banner/StickyAds'
import { client } from "../graphql/client" 
import { GET_LINEUPS } from "../graphql/queries/homepage"
import { getCookie, getVisitorToken } from "../utils/cookie"

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

function Category (props) {
    const { ads_displayed } = useSelector(state => state.ads)
    const [ isShimmer, setIsShimmer ] = useState(false)
    const [ lineups, setLineups ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ openComingSoonModal, setOpenComingSoonModal ] = useState(false)
    const [ contentComingSoonModal, setContentComingSoonModal ] = useState({})

    const loadingBar = useRef(null)

    const bottomScrollFetch = () => {
        if (!meta.pagination) return
        
        const { total_page, current_page } = meta.pagination
        if (total_page === current_page) return

        getCategoryLineups(current_page + 1)
    }

    useEffect(() => {
        getCategoryLineups()
    }, [ props.router.query.category_id ])

    const getCategoryLineups = (page = 1, pageSize = 5) => {
        if (page === 1) setIsShimmer(true)
        client
            .query({ query: GET_LINEUPS(page, pageSize, props.router.query.category_id) })
            .then(({ data }) => {
                const mappedContents = new Map()
                lineups.concat(data.lineups.data).forEach(content => {
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
                            <Header title={props.router.query.category_title} />
                            
                            <div style={{marginTop: -3}}>
                                <Carousel category >
                                    <GridMenu />
                                </Carousel>
                            </div>

                            <div style={{marginTop: "25px"}}>
                                <Stories />
                            </div>

                            <StickyContainer>
                                <Sticky disableHardwareAcceleration>
                                    { ({ distanceFromTop, isSticky, wasSticky, distanceFromBottom, calculatedHeight, ...rest }) => {
                                        const topDistance = 40;
                                        if (distanceFromTop < topDistance) {
                                            if (!ads_displayed) {
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

export default withRouter(Category)

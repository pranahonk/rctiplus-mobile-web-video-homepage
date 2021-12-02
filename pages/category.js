import React, {useEffect, useState, useRef } from 'react';
import { withRouter } from 'next/router';
import { useSelector } from "react-redux"
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import { StickyContainer, Sticky } from 'react-sticky';
import HomeLoader from '../components/Includes/Shimmer/HomeLoader';
import Layout from '../components/Layouts/Default_v2';

import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2';
import GridMenu from '../components/Includes/Common/HomeCategoryMenu';
import Stories from '../components/Includes/Gallery/Stories_v2';
import StickyAds from '../components/Includes/Banner/StickyAds';
import { client } from "../graphql/client" 
import { GET_LINEUPS } from "../graphql/queries/homepage"
import { getCookie, getVisitorToken } from "../utils/cookie"

function category (props) {
    const loadingBar = useRef(null)
    const { ads_displayed } = useSelector(state => state.ads)
    const [ isShimmer, setIsShimmer ] = useState(false)
    const [ lineups, setLineups ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ nextPage, setNextPage ] = useState(1)
    const [ categoryId, setCategoryId ] = useState(props.router.query.category_id)
    const [ token, setToken ] = useState("")
    const length = 10

    const bottomScrollFetch = () => {
        if (meta.pagination.total_page === nextPage) return
        getCategoryLineups()
    }

    useEffect(() => {
        getCategoryLineups()
        const accessToken = getCookie('ACCESS_TOKEN')
        setToken((accessToken == undefined) ? getVisitorToken() : accessToken)
    }, [ categoryId ])

    useEffect(() => {
        if (props.router.query.category_id !== categoryId) {
            setCategoryId(props.router.query.category_id)
        }
    })

    const getCategoryLineups = () => {
        if (nextPage === 1) setIsShimmer(true)
        client
            .query({ query: GET_LINEUPS(nextPage, length, categoryId) })
            .then(({ data }) => {
                setLineups(data.lineups.data)
                setMeta(data.lineups.meta)

                const { pagination } = data.lineups.meta
                if (pagination.current_page < pagination.total_page) setNextPage(nextPage + 1)
            })
            .catch(e => {})
            .finally(_ => {
                if (nextPage === 1) setIsShimmer(false)
            })
    }

    const renderLineups = () => {
        return lineups.map((lineup) => {
            switch(lineup.display_type) {
                case "portrait" :
                    return (
                        <VideoPortraitView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large_ws" :
                    return (
                        <VideoLandscapeLgWsView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_large" :
                    return (
                        <VideoLandscapeLgView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_219" :
                    return (
                        <VideoLandscape219View
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_wt" :
                    return (
                        <VideoLandscapeMiniWtView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini" :
                    return (
                        <VideoLandscapeMiniView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "square_mini" :
                    return (
                        <VideoSquareMiniView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "square" :
                    return (
                        <VideoSquareView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
                            imagePath={meta.image_path} />
                    )
                case "landscape_mini_live" :
                    return (
                        <VideoLandscapeMiniLiveView
                            token={token}
                            key={lineup.id}
                            loadingBar={loadingBar}
                            contentId={lineup.id}
                            title={lineup.title}
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
                    <div style={{marginTop: "56px"}}>
                        <Header title={props.router.query.category_title} />
                        
                        <div style={{marginTop: -3}}>
                            <Carousel detailCategory={true}>
                                <GridMenu />
                            </Carousel>
                        </div>

                        <div style={{marginTop: "25px"}}>
                            <Stories 
                                loadingBar={loadingBar.current} 
                                detailCategory={true} 
                                id={props.router.query.category_id} />
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
                )
            }  
        </Layout>
    )
}

export default withRouter(category)

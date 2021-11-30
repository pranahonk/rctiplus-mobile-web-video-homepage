import React, { useState, useRef } from 'react';
import { useSelector } from "react-redux"
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import { withRouter } from 'next/router';

import { StickyContainer, Sticky } from 'react-sticky';
import HomeLoader from '../components/Includes/Shimmer/HomeLoader';
import Layout from '../components/Layouts/Default_v2';

import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2';
import GridMenu from '../components/Includes/Common/HomeCategoryMenu';
import Stories from '../components/Includes/Gallery/Stories_v2';
import StickyAds from '../components/Includes/Banner/StickyAds';

function category (props) {
    const loadingBar = useRef(null)
    const { ads_displayed } = useSelector(state => state.ads)
    const [ isShimmer, setIsShimmer ] = useState(false)

    const bottomScrollFetch = () => {}

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

            {isShimmer 
                ? <HomeLoader /> 
                : (
                    <div style={{marginTop: "56px"}}>
                        <Header title={props.router.query.category_title} />
                    
                        <div style={{marginTop: -3}}>
                            <Carousel detailCategory={true} >
                                <GridMenu />
                            </Carousel>
                        </div>

                        <div style={{ marginTop: "25px" }}>
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
                    </div>
                )
            }
        </Layout>
    )
}

export default withRouter(category)

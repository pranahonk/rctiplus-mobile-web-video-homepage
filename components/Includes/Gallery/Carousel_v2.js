import React, { useEffect, useState } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import contentActions from '../../../redux/actions/contentActions';
import { Carousel } from 'react-responsive-carousel';
import Img from 'react-image';

import { RESOLUTION_IMG } from '../../../config';
import { homeBannerEvent } from '../../../utils/appier';
import { titleStringUrlRegex } from '../../../utils/regex';
import { client } from "../../../graphql/client"
import { GET_BANNERS } from "../../../graphql/queries/homepage" 

import '../../../assets/scss/plugins/carousel/carousel.scss';

function carouselBanner(props) {
    const placeholderImg = "/static/placeholders/placeholder_landscape.png"
    const [ banners, setBanners ] = useState([])
    const [ meta, setMeta ] = useState({})

    useEffect(() => {
        getBanners()
    }, [])

    const getBanners = _ => {
        const categoryId = props.router.query.category_id || 0
        client.query({ query: GET_BANNERS(categoryId) })
            .then(({ data }) => {
                setBanners(data.banners.data)
                setMeta(data.banners.meta)
            })
            .catch(e => {})
    }

    const goToProgram = (banner) => {
        sendTracker(homeBannerEvent, "homeBanner", banner)

        if (!banner.permalink) return
        Router.push(banner.permalink)

        // switch (banner.type) {
        //     case 'live_streaming' : 
        //         const channels = {
        //             "1": "rcti",
        //             "2": "mnctv",
        //             "3": "gtv",
        //             "4": "inews"
        //         }
        //         return Router.push(`/tv/${channels[banner.type_value]}`);
        //     case 'url':
        //         return window.open(banner.type_value, '_blank')
        //     case 'episode':
        //         if(banner.type_value && banner.program_id) {
        //             const title = titleStringUrlRegex(banner.title)
        //             Router.push(`/programs/${banner.program_id}/${title}/episode/${banner.type_value}/${title}`)
        //         }
        //         break;
        //     case 'catchup':
        //         if(banner.type_value && banner.channel && banner.catchup_date) {
        //             const title = titleStringUrlRegex(banner.title)
        //             Router.push(`/tv/${banner.channel}/${banner.type_value}/${title}?date=${banner.catchup_date}`)
        //         }
        //         break;
        //     case 'live_event':
        //         if (banner.type_value) {
        //             Router.push(`/live-event/${banner.type_value}/${titleStringUrlRegex(banner.title)}`);
        //         }
        //         break;
        //     case 'program':
        //         return Router.push(`/programs/${banner.type_value}/${titleStringUrlRegex(banner.title)}`); 
        //     default:
        //         return Router.push(`/tv/rcti`);
        // }    
    }

    const sendTracker = (func, type, banner) => {
        const eventArgs = {
            homeBanner: [
                banner.id, 
                banner.type, 
                banner.title, 
                `${meta.image_path}${RESOLUTION_IMG}${banner.portrait_image}`, 
                `${meta.image_path}${RESOLUTION_IMG}${banner.landscape_image}`, 
                'mweb_homepage_banner_clicked'
            ]
        }
        func(...eventArgs[type])
    }

    return (
        <div style={{ position: 'relative', paddingTop: props.showStickyInstall ? 135 : props.detailCategory? 0 : 70,}}>
            {banners.length === 0 
                ? (
                    <div 
                        className="banner-carousel" 
                        style={{ width: '100%', minHeight: 320,display: "flex", justifyContent:"center", alignItems:"center"}}>
                        <Img 
                            alt="placeholder"
                            src={<img alt="placeholder" src={placeholderImg}/>}
                            unloader={<img alt="placeholder" src={placeholderImg}/>}
                            loader={<img alt="placeholder" src={placeholderImg}/>}/>
                    </div>
                )
                : (
                    <Carousel 
                        className="banner-carousel"
                        statusFormatter={(current, total) => `${current}/${total}`} 
                        autoPlay 
                        showThumbs={false} 
                        showIndicators 
                        stopOnHover 
                        showArrows={false} 
                        showStatus={false} 
                        swipeScrollTolerance={1} 
                        infiniteLoop
                        swipeable 
                        onSwipeEnd={(e) => {
                            const swipedIndex = e.target.getAttribute('data-index');
                            if (banners[swipedIndex]) {
                                const banner = banners[swipedIndex];
                                sendTracker(homeBannerEvent, "homeBanner", banner)
                            }
                        }}>
                        {banners.map((banner, i) => {
                            const imgSrc = meta.image_path ? `${meta.image_path}${RESOLUTION_IMG}${banner.square_image}` : placeholderImg
                            return (
                                <div 
                                    data-index={i} 
                                    onClick={_ => goToProgram(banner)} 
                                    key={banner.id} 
                                    style={{  width: '100%', minHeight: 320}}>
                                    <Img 
                                        alt={banner.title}
                                        src={imgSrc}
                                        unloader={<img alt={banner.title} src={placeholderImg}/>}
                                        loader={<img alt={banner.title} src={placeholderImg}/>}/>
                                </div>
                            )
                        })}
                    </Carousel>
                )
            }
            {props.children}
            <div style={{ position: 'absolute', bottom: -1.5, background: 'linear-gradient(180deg, #282828 9.89%, rgba(0, 0, 0, 0.0001) 100%)', transform: 'matrix(1, 0, 0, -1, 0, 0)', width: '100%', height: 136 }}></div>
        </div>
    );
}

export default connect(state => state, contentActions)(withRouter(carouselBanner));

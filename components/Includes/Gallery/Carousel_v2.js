import React, { useEffect } from 'react';
import Router from 'next/router';
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
    const landscapePlaceholderImg = "/static/placeholders/placeholder_landscape.png"

    useEffect(() => {
        if (props.contents.banner.length === 0) getBanners()
    }, [])

    const getBanners = _ => {
        client.query({ query: GET_BANNERS })
            .then(({ data }) => {
                props.setBanner({ 
                    data: data.banners.data, 
                    meta: data.banners.meta
                })
            })
            .catch(e => console.log(e))
    }

    const goToProgram = (program) => {
        sendTracker(homeBannerEvent, "homeBanner", program)

        switch (program.type) {
            case 'live_streaming' : 
                const channels = {
                    "1": "rcti",
                    "2": "mnctv",
                    "3": "gtv",
                    "4": "inews"
                }
                return Router.push(`/tv/${channels[program.type_value]}`);
            case 'url':
                return window.open(program.type_value, '_blank')
            case 'episode':
                if(program.type_value && program.program_id) {
                    const title = titleStringUrlRegex(program.title)
                    Router.push(`/programs/${program.program_id}/${title}/episode/${program.type_value}/${title}`)
                }
                break;
            case 'catchup':
                if(program.type_value && program.channel && program.catchup_date) {
                    const title = titleStringUrlRegex(program.title)
                    Router.push(`/tv/${program.channel}/${program.type_value}/${title}?date=${program.catchup_date}`)
                }
                break;
            case 'live_event':
                if (program.type_value) {
                    Router.push(`/live-event/${program.type_value}/${titleStringUrlRegex(program.title)}`);
                }
                break;
            case 'program':
                return Router.push(`/programs/${program.type_value}/${titleStringUrlRegex(program.title)}`); 
            default:
                return Router.push(`/tv/rcti`);
        }    
    }

    const sendTracker = (func, type, program) => {
        const eventArgs = {
            homeBanner: [
                program.id, 
                program.type, 
                program.title, 
                `${props.contents.meta.image_path}${RESOLUTION_IMG}${program.portrait_image}`, 
                `${props.contents.meta.image_path}${RESOLUTION_IMG}${program.landscape_image}`, 
                'mweb_homepage_banner_clicked'
            ]
        }
        func(...eventArgs[type])
    }

    return (
        <div style={{ position: 'relative', paddingTop: props.showStickyInstall ? 135 : props.detailCategory? 0 : 70,}}>
            {props.contents.banner.length === 0 ? 
                <div 
                    className="banner-carousel" 
                    style={{ width: '100%', minHeight: 320,display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <Img 
                        alt="placeholder"
                        src={<img alt="placeholder" src={landscapePlaceholderImg}/>}
                        unloader={<img alt="placeholder" src={landscapePlaceholderImg}/>}
                        loader={<img alt="placeholder" src={landscapePlaceholderImg}/>}/>
                </div>
                :
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
                        if (props.contents.banner[swipedIndex]) {
                            const program = props.contents.banner[swipedIndex];
                            sendTracker(homeBannerEvent, "homeBanner", program)
                        }
                    }}>
                    {props.contents.banner.map((banner, i) => (
                        <div 
                            data-index={i} 
                            onClick={_ => goToProgram(banner)} 
                            key={banner.id} 
                            style={{  width: '100%', minHeight: 320}}>
                            <Img 
                                alt={banner.title}
                                src={[`${props.contents.meta.image_path}${RESOLUTION_IMG}${banner.square_image}`, landscapePlaceholderImg]}
                                unloader={<img alt={banner.title} src={landscapePlaceholderImg}/>}
                                loader={<img alt={banner.title} src={landscapePlaceholderImg}/>}/>
                        </div>
                    ))}
                </Carousel>
            }
            {props.children}
            <div style={{ position: 'absolute', bottom: -1.5, background: 'linear-gradient(180deg, #282828 9.89%, rgba(0, 0, 0, 0.0001) 100%)', transform: 'matrix(1, 0, 0, -1, 0, 0)', width: '100%', height: 136 }}></div>
        </div>
    );
}

export default connect(state => state, contentActions)(carouselBanner);

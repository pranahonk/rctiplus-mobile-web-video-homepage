import React, { useEffect, useState } from 'react'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'
import Img from 'react-image'

import contentActions from '../../../redux/actions/contentActions'
import newsCountViewTag from "../../../redux/actions/newsCountView"
import { RESOLUTION_IMG } from '../../../config'
import { homeBannerEvent } from '../../../utils/appier'
import { client } from "../../../graphql/client"
import { GET_BANNERS } from "../../../graphql/queries/homepage"

import '../../../assets/scss/plugins/carousel/carousel.scss'

function carouselBanner(props) {
  const placeholderImg = "/static/placeholders/placeholder_landscape.png"
  const [ banners, setBanners ] = useState([])
  const [ meta, setMeta ] = useState({})

  useEffect(() => {
    getBanners()
  }, [])

  const getBanners = _ => {
    const categoryId = props.router.query.category_id || 0
    client.query({ query: GET_BANNERS(1, categoryId) })
      .then(({ data }) => {
        setBanners(data.banners.data)
        setMeta(data.banners.meta)
      })
      .catch(_ => {})
  }

  const goToProgram = (banner) => {
    sendTracker(homeBannerEvent, "homeBanner", banner)
    let url = banner.permalink

    switch (banner.type) {
      case "url":
        url = banner.external_link
        break
      case "news_tags": {
        const tag = banner.permalink.split('/')[6]
        props.newsCountViewTag({ tag })
        break
      }
      case "news_detail" : {
        const id = banner.permalink.split('/')[6] || 0
        props.newsCountViewDetail(new DeviceUUID().get(), +id)
        break
      }
      case "scan_qr":
        url = "/qrcode"
        break
    }

    if (!Boolean(url)) return
    Router.push(url)
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
                  id={`banner-${i}`}
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

export default connect(state => state, {
  ...contentActions,
  ...newsCountViewTag
})(withRouter(carouselBanner));

import React, { useEffect } from 'react'
import Img from 'react-image'
import { connect } from 'react-redux'
import BottomScrollListener from 'react-bottom-scroll-listener'
import dynamic from 'next/dynamic'

import contentActions from '../../redux/actions/contentActions'
import useVideoLineups from "../hooks/lineups/useVideoLineups"
import { RESOLUTION_IMG } from "../../config"
import { parseDateObject } from "../../utils/helpers"

const CountDownTimer = dynamic(() => import("../Includes/Common/CountdownTimer"))


import '../../assets/scss/components/panel.scss'

function landscapeLgWs (props) {
  const { 
    generateLink, 
    onTouchStart, 
    onTouchEnd, 
    fetchLineupContent, 
    loadMore, 
    contents 
  } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_landscape.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    fetchLineupContent()
  }, [])

  const renderDescription = (contentDetail) => {
    if (contentDetail.countdown === 0 || contentDetail.is_live) return null
    const { year, month, date, day } = parseDateObject(contentDetail.start_ts * 1000)
    return(
    <div>
      <p className="desc-title">{`${day}, ${date} ${month} ${year} - ${contentDetail.start}`}</p>
      <CountDownTimer time={contentDetail.countdown} />
    </div>
    )
  }

  if (contents.length === 0) return null
  
  return (
    <div
      id="lineup-landscapelgws"
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="lineup_panels">
      <h2 className="content-title">
        {props.title}
      </h2>
      <BottomScrollListener offset={40} onBottom={() => loadMore()}>
        {scrollRef => (
          <div ref={scrollRef} className="lineup-containers">
            {contents.map((content, i) => {
              return (
                <div
                  onClick={() => generateLink(content)}
                  id={`${i}-landscapelgws-video`}
                  key={`${i}-landscapelgws-video`}
                  className="lineup-contents">
                  <div>
                    <Img 
                      className="lineup-image"
                      alt={props.title} 
                      unloader={<img src={placeHolderImgUrl} />}
                      loader={<img src={placeHolderImgUrl} />}
                      width={336}
                      height={189}
                      src={[`${rootImageUrl}${content.content_type_detail.detail.data.landscape_image}`, placeHolderImgUrl]} />
                  </div>
                  {renderDescription(content.content_type_detail.detail.data)}
                </div>
              )
            })}
          </div>
        )}
      </ BottomScrollListener>
    </div>
  );
}

export default connect(state => state, contentActions)(landscapeLgWs)
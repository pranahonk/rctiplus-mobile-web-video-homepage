import React, { useEffect } from 'react'
import Img from 'react-image'
import { connect } from 'react-redux'
import BottomScrollListener from 'react-bottom-scroll-listener'
import dynamic from 'next/dynamic'

import contentActions from '../../redux/actions/contentActions'
import useVideoLineups from "../hooks/lineups/useVideoLineups"
import { RESOLUTION_IMG } from "../../config"

import '../../assets/scss/components/panel.scss'

const PremiumIcon = dynamic(() => import("../Includes/Common/PremiumIcon"))

function landscapeMiniWtView (props) {
  const { generateLink, onTouchStart, onTouchEnd, setInitialContents, loadMore, contents } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_landscape.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    setInitialContents()
  }, [])

  const renderDescription = (content) => {
    if (props.lineup.lineup_type === "custom") return null

    return(
      <div className="desc-wrapper">
        <div className="dashline"></div>
        <p className="desc-title mini"> { content.title } </p>
        <div className="desc-summary"> {content.summary} </div>
      </div>
    )
  }

  const renderContinueWatchProgress = (content) => {
    if (props.lineup.lineup_type !== "custom") return null

    const lastProgress = (content.last_duration / content.duration) * 100
    return (
      <div className="continue-watch-bar">
        <div style={{ width: `${lastProgress}%` }}></div>
      </div>
    )
  }

  if (contents.length === 0) return null
  
  return (
    <div
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="lineup_panels">
      <h2 className="content-title">
        {props.lineup.title}
      </h2>
      <BottomScrollListener offset={40} onBottom={() => loadMore()}>
        {scrollRef => (
          <div
            ref={scrollRef} 
            className="lineup-containers">
            {contents.map((content, i) => {
              return (
                <div
                  id={`landscapeminiwt-video-${i}`}
                  onClick={() => generateLink(content)}
                  key={i}
                  className="lineup-contents">

                  <PremiumIcon premium={content.premium} />

                  <div>
                    <Img
                      className="lineup-image with-schedule"
                      alt={props.lineup.title} 
                      unloader={<img src={placeHolderImgUrl} width={180} height={101} />}
                      loader={<img src={placeHolderImgUrl} width={180} height={101} />}
                      width={180}
                      height={101}
                      src={content.landscape_image ? `${rootImageUrl}${content.landscape_image}` : placeHolderImgUrl} />
                  </div>
                  { renderDescription(content) }
                  { renderContinueWatchProgress(content) }
                </div>
              )
            })}
          </div>
        )}
      </ BottomScrollListener>
    </div>
  );
}

export default connect(state => state, contentActions)(landscapeMiniWtView)
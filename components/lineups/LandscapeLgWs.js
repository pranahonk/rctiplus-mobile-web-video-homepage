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
    setInitialContents, 
    loadMore, 
    contents 
  } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_landscape.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    setInitialContents()
  }, [])

  const renderDescription = (content) => {
    if (props.lineup.lineup_type === "custom") return null
    if (content.countdown === 0 || content.is_live) return null

    const startTime = content.start_ts || content.live_at
    const { year, month, date, day, time } = parseDateObject(startTime * 1000)
    return(
    <div>
      <p className="desc-title">{`${day}, ${date} ${month} ${year} - ${time}`}</p>
      <CountDownTimer time={content.countdown} />
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
      id="lineup-landscapelgws"
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="lineup_panels">
      <h2 className="content-title">
        {props.lineup.title}
      </h2>
      <BottomScrollListener offset={40} onBottom={() => loadMore()}>
        {scrollRef => (
          <div ref={scrollRef} className="lineup-containers">
            {contents.map((content, i) => {
              return (
                <div
                  onClick={() => generateLink({ ...content, rootImageUrl })}
                  id={`${i}-landscapelgws-video`}
                  key={`${i}-landscapelgws-video`}
                  className="lineup-contents">
                  <div>
                    <Img 
                      className="lineup-image"
                      alt={props.lineup.title} 
                      unloader={<img src={placeHolderImgUrl} />}
                      loader={<img src={placeHolderImgUrl} />}
                      width={336}
                      height={189}
                      src={[`${rootImageUrl}${content.landscape_image}`, placeHolderImgUrl]} />
                  </div>
                  {renderDescription(content)}
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

export default connect(state => state, contentActions)(landscapeLgWs)
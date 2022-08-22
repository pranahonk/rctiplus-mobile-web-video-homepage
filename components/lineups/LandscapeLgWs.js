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
const PremiumIcon = dynamic(() => import("../Includes/Common/PremiumIcon"))

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

    let liveLabel = null,
      playingNow = <CountDownTimer time={content.countdown} />

    if (content.countdown === 0 || content.is_live) {
      liveLabel = <span className="live-badge"></span>
      playingNow = <p className='playing-now'>Playing Now</p>
    }

    let interactive = null
    if(content.is_interactive) {
      interactive = (
        <span className='interactive'>
          <div className='row align-items-center'>
            <img 
              src='/static/player_icons/quiz_icon.svg	'
              width={20}
              height={20}
              alt="desc"
              />
            <p className='ml-2 text-white' style={{fontSize: '12px'}}>INTERACTIVE</p>
          </div>
        </span>
      )
    }


    const startTime = content.start_ts || content.live_at
    const { year, month, date, day, time } = parseDateObject(startTime * 1000)
    return(
      <>
        {interactive}
        {liveLabel}
        <div>
          <p className="desc-title large">{`${day}, ${date} ${month} ${year} - ${time} WIB`}</p>
          { playingNow }
        </div>
      </>
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
                  id={`landscapelgws-video-${i}`}
                  onClick={() => generateLink({ ...content, rootImageUrl })}
                  key={i}
                  className="lineup-contents">
                  
                  <PremiumIcon premium={content.premium} />

                  <div>
                    <Img 
                      className="lineup-image"
                      alt={props.lineup.title} 
                      unloader={<img src={placeHolderImgUrl} width={336} height={189} />}
                      loader={<img src={placeHolderImgUrl} width={336} height={189} />}
                      width={336}
                      height={189}
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

export default connect(state => state, contentActions)(landscapeLgWs)
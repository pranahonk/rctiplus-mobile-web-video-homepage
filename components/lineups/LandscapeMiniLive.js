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

function landscapeMiniLiveView (props) {
  const { generateLink, onTouchStart, onTouchEnd, setInitialContents, loadMore, contents } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_landscape.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    setInitialContents()
  }, [])

  const renderDescription = (contentDetail) => {
    if (props.lineup.lineup_type === "custom") return null

    const isLive = (contentDetail.countdown === 0 || contentDetail.is_live)
    const startTime = contentDetail.start_ts || contentDetail.live_at
    const { year, month, date, day, time } = parseDateObject(startTime * 1000)

    let component = (
      <p className="desc-text">
        <strong>{day}</strong> 
        {` • ${date} ${month} ${year} - ${time} WIB`}
      </p>
    )
    let liveBadge = <span className="live-badge"></span>

    if (!isLive) {
      component = <CountDownTimer time={contentDetail.countdown} />
      liveBadge = null
    }

    let interactive = null
    if(contentDetail.is_interactive) {
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

    return(
      <>
        {interactive}
        { liveBadge }
        <div>
          <p className="desc-title mini">{ contentDetail.title }</p>
          { component }
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
                  id={`landscapeminilive-video-${i}`}
                  onClick={() => generateLink({ ...content, rootImageUrl })}
                  key={i}
                  className="lineup-contents">
                  <div>
                    <Img 
                      className="lineup-image"
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

export default connect(state => state, contentActions)(landscapeMiniLiveView)
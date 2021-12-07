import React, { useEffect } from 'react'
import Img from 'react-image'
import { connect } from 'react-redux'
import BottomScrollListener from 'react-bottom-scroll-listener'

import contentActions from '../../redux/actions/contentActions'
import useVideoLineups from "../hooks/lineups/useVideoLineups"
import { RESOLUTION_IMG } from "../../config"

import '../../assets/scss/components/panel.scss'

function landscapeMiniWtView (props) {
  const { generateLink, onTouchStart, onTouchEnd, fetchLineupContent, loadMore, contents } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_landscape.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    fetchLineupContent()
  }, [])

  const renderDescription = (contentDetail) => {
    return(
      <div className="desc-wrapper">
        <div className="dashline"></div>
        <p className="desc-title mini"> { contentDetail.title } </p>
        <div className="desc-summary"> {contentDetail.summary} </div>
      </div>
    )
  }

  if (contents.length === 0) return null
  
  return (
    <div
      id="lineup-landscapeminiwt"
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
                  key={`${i}-landscapeminiwt-video`}
                  id={`${i}-landscapeminiwt-video`}
                  className="lineup-contents">
                  <div>
                    <Img
                      className="lineup-image with-schedule"
                      alt={props.title} 
                      unloader={<img src={placeHolderImgUrl} />}
                      loader={<img src={placeHolderImgUrl} />}
                      width={180}
                      height={101}
                      src={[`${rootImageUrl}${content.content_type_detail.detail.data.landscape_image}`, placeHolderImgUrl]} />
                  </div>
                  { renderDescription(content.content_type_detail.detail.data) }
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
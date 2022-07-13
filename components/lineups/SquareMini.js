import React, { useEffect } from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import dynamic from 'next/dynamic';

import contentActions from '../../redux/actions/contentActions';
import useVideoLineups from '../hooks/lineups/useVideoLineups';
import { RESOLUTION_IMG } from '../../config';

import '../../assets/scss/components/panel.scss';

const PremiumIcon = dynamic(() => import("../Includes/Common/PremiumIcon"))

function squareMiniView (props) {
  const { generateLink, onTouchStart, onTouchEnd, setInitialContents, loadMore, contents } = useVideoLineups(props)
  const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    setInitialContents()
  }, [])

  const renderContinueWatchProgress = (content) => {
    if (props.lineup.lineup_type !== "custom") return null

    const lastProgress = (content.last_duration / content.duration) * 100
    return (
      <div className="continue-watch-bar">
        <div style={{ width: `${lastProgress}%` }}></div>
      </div>
    )
  }

  const getImageLink = (content) => {
    switch (props.lineup.display_type) {
      case "square_list_audio":
        return `${props.imagePath}${content.image_banner}`;
      case "square_mini":
        if(content?.content_type === "live_music"){
          return `${content?.content_type_detail?.detail?.meta?.assets_url}/200/${content.portrait_image}`;
        }
        else if(content?.content_type === "live_radio"){
          return `${content?.content_type_detail?.detail?.meta?.assets_url}/200/${content.portrait_image}`;
        }
        else{
          return `${rootImageUrl}${content.square_image}`;
        }
        return false;
      default:
        return `${rootImageUrl}${content.square_image}`;
    }
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
                  id={`squaremini-video-${i}`}
                  onClick={() => generateLink(content)}
                  key={i}
                  className="lineup-contents">

                  <PremiumIcon premium={content.premium} />

                  <div>
                    <Img
                      className="lineup-image"
                      alt={props.lineup.title}
                      unloader={<img src={content ? getImageLink(content) : placeHolderImgUrl} width={100} height={100} />}
                      loader={<img src={content ? getImageLink(content) : placeHolderImgUrl} width={100} height={100} />}
                      width={100}
                      height={100}
                      src={content ? getImageLink(content) : placeHolderImgUrl} />
                  </div>
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

export default connect(state => state, contentActions)(squareMiniView)

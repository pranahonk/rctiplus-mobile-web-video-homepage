import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../../redux/actions/contentActions'
import useVideoLineups from "../../hooks/lineups/useVideoLineups"
import { RESOLUTION_IMG } from "../../../config"

import '../../../assets/scss/components/panel.scss'

function SquareView (props) {
  const [ contents, setContents ] = useState(props.content)
  const [ page, setPage ] = useState(1)
  const [ endPage, setEndPage ] = useState(false)
  const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props)

  const pageLength = 7
  const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

	const loadMore = () => {
    if (endPage) return

    const currPage = page + 1;
    props.loadingBar.continuousStart();

    props.getHomepageContents(props.contentId, 'mweb', currPage, pageLength)
      .then(({ status, data }) => {
        if (status === 200 && data.status.code === 0) {
          setContents([ ...contents, ...data.data ])
          setPage(currPage)

          const { total_page } = data.meta.pagination
          if (currPage === total_page) setEndPage(true)
        }
        else throw new Error()
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
	}
  return (
    <div
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="pnl_video_square">
      <h2 className="content-title">
        {props.title}
      </h2>
      <BottomScrollListener offset={40} onBottom={() => loadMore()}>
        {scrollRef => (
          <div ref={scrollRef} className="swiper-container">
            {contents.map((content, i) => (
              <div
                onClick={() => generateLink(content)}
                key={`${i}-square-video`}
                className="swiper-slide">
                <div>
                  <Img 
                    alt={props.title} 
                    unloader={<img src={placeHolderImgUrl} />}
                    loader={<img src={placeHolderImgUrl} />}
                    src={[`${rootImageUrl}${content.content_type_detail.detail.data.square_image}`, placeHolderImgUrl]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </ BottomScrollListener>
    </div>
  );
}

export default connect(state => state, contentActions)(SquareView)

import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../../redux/actions/contentActions'
import useVideoLineups from "../../hooks/lineups/useVideoLineups"
import { RESOLUTION_IMG } from "../../../config"
import { client } from "../../../graphql/client"
import { GET_LINEUP_CONTENT_VIDEO } from "../../../graphql/queries/homepage"

import '../../../assets/scss/components/panel.scss'

function horizontalLandscaoeMediumView (props) {
  const [ contents, setContents ] = useState([])
  const [ nextPage, setNextPage ] = useState(1)
  const [ endPage, setEndPage ] = useState(false)
  const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props)

  const pageLength = 7
  const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
  const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

  useEffect(() => {
    fetchLineupContent()
  }, [])

  const fetchLineupContent = () => {
    props.loadingBar.continuousStart()
    client.query({ query: GET_LINEUP_CONTENT_VIDEO(nextPage, pageLength, props.contentId) })
      .then(({ data }) => {
        const lineupContents = data.lineup_contents.data
          .filter(({ content_type_detail }) => content_type_detail.detail)
        const { pagination } = data.lineup_contents.meta 

        setContents(contents.concat(lineupContents))
        setEndPage(pagination.current_page === pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
  }

	const loadMore = () => {
    if (endPage) return

    fetchLineupContent()
	}

  if (contents.length === 0) return null
  
  return (
    <div
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="pnl_horizontal_content">
      <h2 className="content-title">
        {props.title}
      </h2>
      <BottomScrollListener offset={40} onBottom={() => loadMore()}>
        {scrollRef => (
          <div ref={scrollRef} className="swiper-container">
            {contents.map((content, i) => {
              return (
                <div
                  onClick={() => generateLink(content)}
                  key={`${i}-hlm-video`}
                  className="swiper-slide">
                  <div>
                    <Img 
                      alt={props.title} 
                      unloader={<img src={placeHolderImgUrl} />}
                      loader={<img src={placeHolderImgUrl} />}
                      src={[`${rootImageUrl}${content.content_type_detail.detail.data.square_image}`, placeHolderImgUrl]} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ BottomScrollListener>
    </div>
  );
}

export default connect(state => state, contentActions)(horizontalLandscaoeMediumView)
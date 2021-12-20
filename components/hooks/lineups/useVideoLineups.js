

import { useState } from 'react';
import Router from 'next/router';

import { contentGeneralEvent, homeGeneralClicked, homeProgramClicked } from '../../../utils/appier'
import { showSignInAlert } from '../../../utils/helpers';
import { urlRegex, titleStringUrlRegex } from '../../../utils/regex';
import { GET_LINEUP_CONTENT_VIDEO } from "../../../graphql/queries/homepage"
import { client } from "../../../graphql/client"

export default function useVideoLineups(props) {
  const [ contents, setContents ] = useState([])
  const [ nextPage, setNextPage ] = useState(1)
  const [ endPage, setEndPage ] = useState(false)
  const pageLength = 7

  let swipe = {}

  const onTouchStart = (e) => {
		const touch = e.touches[0];
		swipe = { x: touch.clientX };
  }

  const onTouchEnd = (e) => {
		const touch = e.changedTouches[0];
		const absX = Math.abs(touch.clientX - swipe.x);
		if (absX > 50) {
			homeGeneralClicked('mweb_homepage_scroll_horizontal');
		}
  }

  const fetchLineupContent = () => {
    if (nextPage > 1) props.loadingBar.continuousStart()

    client.query({ query: GET_LINEUP_CONTENT_VIDEO(nextPage, pageLength, props.contentId) })
      .then(({ data }) => {
        const { pagination } = data.lineup_contents.meta

        const mappedContents = new Map()
        contents.concat(data.lineup_contents.data).forEach(content => {
          if (content.content_type_detail.detail && content.content_type_detail.detail.status.code === 0) {
            mappedContents.set(content.content_type_detail.detail.data.id, content)
          }
        })

        setContents([ ...mappedContents.values() ])
        setEndPage(pagination.current_page === pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => {
        if (nextPage > 1) props.loadingBar.complete()
      })
  }

	const loadMore = () => {
    if (endPage) return

    fetchLineupContent()
	}

  const generateLink = (content) => {
    let url = content.content_type_detail.detail.data.permalink || "/"

    if (url !== "/") {
      url = `${location.origin}${url.split("rctiplus.com")[1]}`
    }

    if (content.content_type.includes("live")) {
      const started = content.content_type_detail.detail.data.countdown === 0

      if (started) Router.push(url)
      else if (props.showComingSoonModal) {
        const contentDetail = content.content_type_detail.detail.data
        const image = contentDetail.landscape_image 
          ? `${content.rootImageUrl}${contentDetail.landscape_image}` 
          : "../static/placeholders/placeholder_landscape.png"
  
        props.showComingSoonModal(true, {
          countdown: contentDetail.countdown,
          start: contentDetail.start_ts || contentDetail.live_at,
          title: contentDetail.title,
          start_time: contentDetail.start,
          image
        })
      }
    }
    else Router.push(url)
	}

  return {
    generateLink,
    onTouchStart,
    onTouchEnd,
    loadMore,
    fetchLineupContent,
    contents
  }
}
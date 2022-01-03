

import { useState } from 'react';
import Router from 'next/router';

import { contentGeneralEvent, homeGeneralClicked, homeProgramClicked } from '../../../utils/appier'
import { GET_LINEUP_CONTENT_VIDEO, GET_CONTINUE_WATCHING } from "../../../graphql/queries/homepage"
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

  const loadMore = () => {
    if (endPage) return

    switch (props.lineup.lineup_type) {
      case "custom":
        return getContinueWatching()
      default:
        return getLineupContents()
    }
  }

  const setInitialContents = () => {
    const { data, meta } = props.lineup.lineup_type_detail.detail
    const mappedContents = new Map()

    switch (props.lineup.lineup_type) {
      case "custom":
        contents.concat(data)
          .forEach(content => mappedContents.set(content.id, content))
        break
    
      case "default":
        contents.concat(data).forEach(content => {
          if (content.content_type_detail.detail) {
            mappedContents.set(
              content.content_type_detail.detail.data.id, 
              { ...content, ...content.content_type_detail.detail.data }
            )
          }
        })
        break
    }

    setContents([ ...mappedContents.values() ])
    setEndPage(meta.pagination.current_page === meta.pagination.total_page)
    setNextPage(meta.pagination.current_page + 1)
  }

  const getContinueWatching = () => {
    props.loadingBar.continuousStart()

    client.query({ query: GET_CONTINUE_WATCHING(nextPage, pageLength, props.lineup.id)})
      .then(({ data }) => {
        const { pagination } = data.lineup_continue_watching.meta

        const mappedContents = new Map()
        contents.concat(data.lineup_continue_watching.data)
          .forEach(content => mappedContents.set(content.id, content))

        setContents([ ...mappedContents.values() ])
        setEndPage(pagination.current_page === pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
  }

  const getLineupContents = () => {
    props.loadingBar.continuousStart()

    client.query({ query: GET_LINEUP_CONTENT_VIDEO(nextPage, pageLength, props.lineup.id)})
      .then(({ data }) => {
        const { pagination } = data.lineup_contents.meta

        const mappedContents = new Map()
        contents.concat(data.lineup_contents.data).forEach(content => {
          if (content.content_type_detail.detail && content.content_type_detail.detail.status.code === 0) {
            mappedContents.set(
              content.content_type_detail.detail.data.id, 
              { ...content, ...content.content_type_detail.detail.data }
            )
          }
        })

        setContents([ ...mappedContents.values() ])
        setEndPage(pagination.current_page === pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
  }

  const generateLink = (content) => {
    let url = content.permalink || "/"

    if (url !== "/") {
      url = `${location.origin}${url.split("rctiplus.com")[1]}`
    }

    switch(props.lineup.lineup_type) {
      case "custom":
        if (props.lineup.content_type === "continue_watching") Router.push(`${url}?ref=continue_watching`)
        else Router.push(url)
        break

      default: 
        if (content.content_type.includes("live")) {
          const started = content.countdown === 0

          if (started) Router.push(url)
          else if (props.showComingSoonModal) {
            const image = content.landscape_image 
              ? `${content.rootImageUrl}${content.landscape_image}` 
              : "../static/placeholders/placeholder_landscape.png"
      
            props.showComingSoonModal(true, {
              countdown: content.countdown,
              start: content.start_ts || content.live_at,
              title: content.title,
              start_time: content.start,
              image
            })
          }
        }
        else Router.push(url)
        break
    }
	}

  return {
    generateLink,
    onTouchStart,
    onTouchEnd,
    loadMore,
    setInitialContents,
    contents
  }
}
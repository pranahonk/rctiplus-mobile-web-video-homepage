import { useState } from 'react';
import Router from 'next/router';

import { homeGeneralClicked } from '../../../utils/appier';
import { GET_CONTINUE_WATCHING, GET_LINEUP_CONTENT_VIDEO } from '../../../graphql/queries/homepage';
import { client } from '../../../graphql/client';
import { getUserAccessToken } from '../../../utils/cookie';
import { showSignInAlert } from '../../../utils/helpers';

export default function useVideoLineups(props) {
  const [ contents, setContents ] = useState([])
  const [ nextPage, setNextPage ] = useState(1)
  const [ endPage, setEndPage ] = useState(false)

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
    const { data, meta } = props.lineup.lineup_type_detail.detail;
    const mappedContents = new Map();

    switch (props.lineup.lineup_type) {
      case "custom":
        contents.concat(data)
          .forEach(content => mappedContents.set(content.id, content))
        break

      case "default":
        contents.concat(data).forEach(content => {
          if (content.content_type_detail.detail && content.content_type_detail.detail.status.code === 0) {
            mappedContents.set(
              content.content_type_detail.detail.data.id,
              { ...content, ...content.content_type_detail.detail.data }
            )
          }
        })
        break
    }
    
    setContents([ ...mappedContents.values() ])
    setEndPage(meta?.pagination?.current_page === meta?.pagination?.total_page)
    setNextPage(meta?.pagination?.current_page + 1)
  }



  const  getContinueWatching = () => {
    props.loadingBar.continuousStart()

    client.query({ query: GET_CONTINUE_WATCHING(nextPage, 5, props.lineup.id)})
      .then(({ data }) => {
        const { pagination } = data.lineup_continue_watching.meta

        const mappedContents = new Map()
        contents.concat(data.lineup_continue_watching.data)
          .forEach(content => mappedContents.set(content.id, content))

        setContents([ ...mappedContents.values() ])
        setEndPage(pagination.current_page >= pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
  }

  const getLineupContents = () => {
    props.loadingBar.continuousStart()

    client.query({ query: GET_LINEUP_CONTENT_VIDEO(nextPage, 5, props.lineup.id)})
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
        setEndPage(pagination.current_page >= pagination.total_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch(_ => setEndPage(true))
      .finally(_ => props.loadingBar.complete())
  }

  const generateLink = (content) => {
    let url = (Boolean(content.permalink) === /^http:|^https:/.test(content.permalink))
      ? `${location.origin}${content.permalink.split("rctiplus.com")[1]}`
      : "/"

    switch(props.lineup.lineup_type) {
      case "custom":
        if (props.lineup.content_type === "continue_watching") Router.push(`${url}?ref=continue_watching`)
        else Router.push(url)
        break;
      default:
<<<<<<< HEAD
        if (content.content_type.includes("live")
          && content.content_type !== "live_radio"
          && content.content_type !== "live_music") {
=======
        if (content.content_type.includes("live")) {
>>>>>>> fc579c4874a8d7a441ea7c2a557d04efaeeae355
          const started = content.countdown === 0

          if (started) Router.push(url)
          else if (props.showComingSoonModal) {
            const image = content.landscape_image
              ? `${content.rootImageUrl}${content.landscape_image}`
              : "../static/placeholders/placeholder_landscape.png"

            props.showComingSoonModal(true, {
              is_interactive: content.is_interactive,
              countdown: content.countdown,
              start: content.start_ts || content.live_at,
              title: content.title,
              start_time: content.start
            })
          }
        }
        else if (content.content_type === "special") {
          const isUrl = /^http:|^https:/.test(content.external_link)

          if (!isUrl) return
          let url = `${content.external_link}${getUserAccessToken()}`

          if (!getUserAccessToken() && content.mandatory_login) return showSignInAlert(
            `Please <b>Sign In</b><br/>
            Woops! Gonna sign in first!<br/>
            Only a click away and you<br/>
            can continue to enjoy<br/>
            <b>RCTI+</b>`, '', () => {}, true, 'Register', 'Login', true, true
          )
          else if (!content.mandatory_login) url = content.external_link

          Router.push(url)
        }
        else if (content.content_type === "podcast" || content.content_type === "spiritual"
        || content.content_type === "live_radio" || content.content_type === "live_music"){
          Router.push(content.permalink)
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

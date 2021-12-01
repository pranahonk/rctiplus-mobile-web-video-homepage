

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
    const url = content.content_type_detail.detail.data.permalink || "/"
    Router.push(url)
    // const contentGeneralEventArgs = [
    //   props.title,
    //   data.content_type,
    //   data.content_id,
    //   data.content_title,
    //   data.program_title ? data.program_title : 'N/A',
    //   data.genre ? data.genre : 'N/A', 
    //   `${props.imagePath}${props.resolution}${data.portrait_image}`, 
    //   `${props.imagePath}${props.resolution}${data.landscape_image}`, 
    // ]

    // const signInAlertArgs = [
    //   `Please <b>Sign In</b><br/>
		//   Woops! Gonna sign in first!<br/>
    //   Only a click away and you<br/>
    //   can continue to enjoy<br/>
    //   <b>RCTI+</b>`,
    //   "",
    //   () => {},
    //   true,
    //   "Sign Up",
    //   "Sign In",
    //   true,
    //   true
    // ]

		// switch (data.content_type) {
		// 	case 'special':
		// 		contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_special_event_clicked')
		// 		let url = data.url ? data.url : data.link;
		// 		if (data.mandatory_login && props.user.isAuth) {
		// 			url += props.token;
		// 		}

		// 		try {
		// 			jwtDecode(props.token);
		// 			if (data.mandatory_login && !props.user.isAuth) {
		// 				showSignInAlert(...signInAlertArgs)
		// 			}
		// 			else {
		// 				handleActionClick(data, url)
		// 			}
		// 		}
		// 		catch (e) {
		// 			if (data.mandatory_login && !props.user.isAuth) showSignInAlert(...signInAlertArgs)
		// 		}
		// 		break;

		// 	case 'program':
		// 		homeProgramClicked(
    //       props.title,
    //       data.program_id,
    //       data.program_title ? data.program_title : 'N/A',
    //       data.genre ? data.genre : 'N/A',
    //       `${props.imagePath}${props.resolution}${data.portrait_image}`,
    //       `${props.imagePath}${props.resolution}${data.landscape_image}`,
    //       'mweb_homepage_program_clicked'
    //     )
		// 		Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}?ref=homepage&homepage_title=${props.title}`);
		// 		break;

		// 	case 'live':
		// 		contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_live_event_clicked')
		// 		Router.push(`/live-event/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${props.title}`);
		// 		break;

		// 	default:
		// 		contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_content_clicked')
		// 		Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}/${data.content_type}/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${props.title}`);
		// 		break;
		// }
	}

  const handleActionClick = (program, url) => {
    switch (program.action_type) {
      case 'live_streaming' : {
          const channels = {
            "1": "rcti",
            "2": "mnctv",
            "3": "gtv",
            "4": "inews",
          }
          Router.push(`/tv/${channels[program?.link]}`)
        }
        break;
      case 'catchup': {
          if (!program.link || !program.channel || !program.catchup_date) break
          const title = titleStringUrlRegex(program?.content_title)
          Router.push(`/tv/${program.channel}/${program.link}/${title}?date=${program.catchup_date}`)
        }
        break;
      case 'scan_qr':
        Router.push("/qrcode")
        break;
      case 'homepage_news':
        Router.push("/news")
        break;
      case 'news_tags' :
        window.open(program.link, '_parent');
        break;
      case 'episode': {
          if(!program.link || !program.program_id) return
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/programs/${program.program_id}/${title}/episode/${program.link}/${title}`)
        }
        break;
      case 'live_event': {
          if (!program.link) return
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/live-event/${program.link}/${title}`);
        }
        break;
      case 'genre': {
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/explores/${program.link}/${title}`);
        }
        break;  
      case 'program': {
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/programs/${program.link}/${title}`);
        }
        break;  
      case 'popup':
        window.open(url, '_parent');
        break;  
      default:
        Router.push(url);
		} 
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
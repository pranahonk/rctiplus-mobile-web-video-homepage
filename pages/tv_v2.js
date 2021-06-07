import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { withRouter } from 'next/router';
import { HeadMetaTv } from "../components/pages/live-tv"
import { DEV_API, BASE_URL, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../config';
import { formatDate, formatDateWord, getFormattedDateBefore, formatMonthEngToID } from '../utils/dateHelpers';

import dynamic from "next/dynamic"
import Layout from "../components/Layouts/Default_v2"
import TvProvider from "../utils/contexts/tvContext"
import nextCookie from 'next-cookies' 
import queryString from 'query-string';

const ChannelList = dynamic(() => import("../components/pages/live-tv").then(mod => mod.ChannelList))
const WeekList = dynamic(() => import("../components/pages/live-tv").then(mod => mod.WeekList))
const ListItem = dynamic(() => import("../components/pages/live-tv").then(mod => mod.ListItem))
const PlayerTv = dynamic(() => import("../components/pages/live-tv").then(mod => mod.PlayerTv))

import "../assets/scss/components/tv-v2.scss"

class TV_V2 extends React.Component {
  static async getInitialProps(ctx) {
		const idEpg = ctx.query.epg_id;
		let dataEpg = null;
		let q = null;
		if(idEpg) {
			const findQueryString = ctx.asPath.split(/\?/);
			if(findQueryString.length > 1) {
				q = queryString.parse(findQueryString[1]);
				if(q.date) {
					q = formatMonthEngToID(q.date)
				}
			}
			const visitorToken = nextCookie(ctx)?.VISITOR_TOKEN
			const userToken = nextCookie(ctx)?.ACCESS_TOKEN
			let token = userToken?.VALUE || visitorToken?.VALUE || ''
			if(!token) {
				const response_visitor = await fetch(`${DEV_API}/api/v1/visitor?platform=mweb&device_id=69420`);
				if (response_visitor.statusCode === 200) {
						return {};
				}
				const data_visitor = await response_visitor.json();
				token = data_visitor.status.code === 0 ? data_visitor.data.access_token : 'undefined'
			}
			const response_epg = await fetch(`${DEV_API}/api/v1/epg/${idEpg}`, {
					method: 'GET',
					headers: {
							'Authorization': token,
					}
			});
			if (response_epg.statusCode === 200) {
					return {};
			}
			const data_epg = await response_epg.json();
			dataEpg = data_epg.status.code === 0 ? data_epg.data : null
		}
    return { dataEpg, params_date: q }
  }

  constructor(props) {
		super(props);
    this.listContainer = React.createRef();
    this.channelContainer = React.createRef();
    this.state={heightList: 390}
	}

  componentDidMount() {
    if(this.channelContainer?.current?.clientHeight) {
      this.setState({heightList: this.channelContainer?.current?.clientHeight})
    }
  }
  

  render() {
    const router = this.props.router
    const channelMain = router?.query?.channel || null
    const handleMeta = () => {
      const [titleChannel, titleEpg] = [SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.title, router.query.epg_title?.replace(/-/gi, ' ')]
      let [descriptionChannel, channel] = [SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.description , channelMain]
      const [keywordsChannel, paramsDate] = [SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.keywords, this.props.params_date?.replace(/-/gi, ' ')]
      const twitter_img_alt = SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.twitter_img_alt
      channel = channel === 'globaltv' ? 'gtv' : channel
      return {
        jsonLd: {
          asPath: router.asPath,
          title: router?.query?.epg_title || router?.query?.channel,
          thumbnailUrl: SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.image
        },
        title: titleEpg ? `Streaming ${titleEpg} - ${paramsDate} di ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} - RCTI+` : titleChannel,
        image: titleEpg ? SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.image_catchup : SITEMAP[`live_tv_${channelMain?.toLowerCase()}`]?.image,
        description: titleEpg ? `Nonton streaming ${titleEpg} - ${paramsDate}  online tanpa buffering dan acara favorit lainnya 7 hari kemarin. Dapatkan juga jadwal acara ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} terbaru hanya di RCTI+` : descriptionChannel,
        keywords: titleEpg ? `streaming ${channel}, live streaming ${channel}, ${channel} live, ${channel} streaming, ${channel} live streaming. ${titleEpg}, ${paramsDate}` : keywordsChannel,
        twitter_img_alt: titleEpg ? `Streaming ${titleEpg} - ${paramsDate} di ${channel == 'inews' ? 'iNEWS' : channel?.toUpperCase()} - RCTI+` : twitter_img_alt,
        url: REDIRECT_WEB_DESKTOP + router.asPath
      }
    }
    console.log(handleMeta())
    return(
      <>
        <HeadMetaTv meta={handleMeta()}/>
        <Layout title={handleMeta().title}>
          <TvProvider>
            <div id="tv-v2" className="tv_wrapper">
              <div ref={this.channelContainer}>
                <PlayerTv />
                <ChannelList />
                <WeekList />
              </div>
              <div style={{height: `calc(100vh - ${this.state.heightList + 70}px)`, width: "100%", overflow: "scroll"}}>
                <ListItem />
              </div>
            </div>
          </TvProvider>
        </Layout>
      </>
    )
  }
}

export default withRouter(TV_V2)
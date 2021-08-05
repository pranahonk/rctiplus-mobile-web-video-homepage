import { useState, createContext, useEffect } from 'react'
import { useRouter } from "next/router"
import { liveTvTabClicked, liveTvShareClicked, liveTvShareCatchupClicked, liveTvLiveChatClicked, liveTvChannelClicked, liveTvCatchupSchedulePlay, liveTvCatchupScheduleClicked, getUserId, appierAdsShow, appierAdsClicked } from '../appier';

import * as dayjs from "dayjs"
import dynamic from "next/dynamic"

const ActionSheet = dynamic(() => import("../../components/Modals/ActionSheet"))

export const TvContext = createContext(null)

const TvProvider = ({children}) => {
  const today = dayjs().day()
  const router = useRouter()
  const [tab, setTab] = useState(today)
  const [selectItem, setSelectItem] = useState(false)
  const [meta, setMeta] = useState(null)
  const [selectDate, setSelectDate] = useState(dayjs().format("DD-MMMM-YYYY"))
  const [liveContent, setLiveContent] = useState(null)
  const [shareContent, setShareContent] = useState({
    tabStatus: "live",
    caption: "RCTIPLUS",
    url: "www.rctiplus.com",
    hashtags: ["RCTIPLUS"],
    openShare: false
  })

  const toggleActionSheet = () => {
    setShareContent({...shareContent, openShare: !shareContent.openShare})
  }
  const handleShare = (item) => {
    const url = `${item.share_link.replace("webd", "webm")}?date=${item.date}`
    const prefixText = item.type === "live" ? "Live TV  - " : "Catch Up TV - "
    let idChannel = 1
    if(item.channel === 'rcti') idChannel = 1
    if(item.channel === 'mnctv') idChannel = 2
    if(item.channel === 'globaltv') idChannel = 3
    if(item.channel === 'inews') idChannel = 4
    setShareContent({
    tabStatus: "",
    caption: `${prefixText} ${item.title}`,
    url: item.share_link,
    hashtags: ["rctiplus", item.channel],
    openShare: !shareContent.openShare})
      
    if(item.type === "live" ) {
      liveTvShareClicked(item.id, item.title, 'mweb_livetv_share_clicked');
    }
    if(item.type === "catchup") {
      liveTvShareCatchupClicked(item.id, item.title, 'N/A', 'mweb_livetv_share_catchup_clicked');
    }
  }

  // useEffect(() => {
  //   setMeta = 
  // }, [])
  return(
    <TvContext.Provider value={{tab, setTab, selectItem, setSelectItem, selectDate, setSelectDate, liveContent, setLiveContent, shareContent, setShareContent, toggleActionSheet, handleShare}}>
      {children}
      <ActionSheet
      tabStatus= {shareContent.tabStatus}
      caption={shareContent.caption}
      url={shareContent.url}
      open={shareContent.openShare}
      hashtags={shareContent.hashtags}
      toggle={toggleActionSheet} />
    </TvContext.Provider>
  )
}

export default TvProvider
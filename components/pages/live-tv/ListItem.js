import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { CirclePauseIcon, CircleTimeIcon, CirclePlayIcon, ShareIcon } from "../../IconComponents"
import { TvContext } from "../../../utils/contexts/tvContext"


import cookies from "js-cookie"
import slug from "slugify"

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import * as dayjs from "dayjs"

const listChannel = [
  {id: 1, channel: "rcti"},
  {id: 2, channel: "mnctv"},
  {id: 3, channel: "gtv"},
  {id: 4, channel: "inews"},
]
export default function ListItem({activeItem, activePlayCatchup, activePlayTv, activePause}) {
  const { getLiveEvent, getLiveEventDetail, getEPG, getLiveEventUrl } = liveAndChatActions
  const { tab, selectItem, setSelectItem, selectDate, setSelectDate, liveContent, setLiveContent, shareContent, setShareContent, toggleActionSheet, handleShare } = useContext(TvContext)
  const { live_event: { detail_live, data_live, data_epg, channel_code, data_epg_v2 } } = useSelector(state => state)
  const [list, setList] = useState(null)

  const dispatch = useDispatch()
  const router = useRouter()
  const channel = router.query.channel || ""

  useEffect(() => {
    const id = listChannel.filter((item) => item.channel == channel.toLowerCase())
    const channel_code = id.length > 0 ? id[0].id : 0
    const dateNow = dayjs().format('YYYY-MM-DD')

    dispatch(getLiveEvent('on air', channel))
    dispatch(getLiveEventDetail(channel_code))
    // dispatch(getEPG(dateNow, channel))
  }, [router.query.channel])

  useEffect(() => {
      if(tab !== null) {
        const filterList = data_epg_v2?.filter((item) => {
          return item.date === tab || item.day === tab
        })
        setList(filterList?.[0])
      }
  }, [tab, data_epg_v2])


const Description = ({item, selected, onClick}) => {
  return(
    <>
      <div className={`item-title-icon ${selected ? "active-item" : ""}`}>
        <div className="item-title_wrap" onClick={onClick}>
          <h2 className="item-title">{item.title}</h2>
          <span className="item_time_title">{item.s} - {item.e}</span>
        </div>
        <div className="item-icon">
          <button className="btn-share" onClick={() => handleShare(item)}>
            <ShareIcon color={`${selected ? "#3a3a3a" : "#ffffff"}`}/>
          </button>
        </div>
      </div>
    </>
  )
}
  const IconStatus = ({children, item}) => {
    return (
      <>
        {children}
      </>
    )
  }
  
  const handleClickItem = (item, status) => {
    if(status) {
      const title = slug(item.title, {replacement: "-", lower: true})
      setSelectItem(item)
      router.push(`/tv_v2?channel=${channel_code}&epg_id=${item.id}&epg_title=${title}&`,`/tv/${channel_code}/${item.id}/${title}?date=${selectDate}`)
    }
  }
  const HandleItemSelected = ({item}) => {
    let icon = <CirclePlayIcon />
    let activeItem = false 
    let activePlay = false 
    const activeSelected = selectItem.id == item.id || false
    if(item.live && item.type === "live") {
      if(item.live) {
        setLiveContent(item)
      }
      if(!selectItem) {
        activeItem = true
        icon =  <CirclePauseIcon circleColor="#FA262F" color="#ffffff"/>
      } else {
        if(activeSelected) {
          icon = <CirclePauseIcon circleColor="#FA262F" color="#ffffff"/>
        } else {
          icon =  <CirclePlayIcon circleColor="#FA262F" color="#ffffff"/>
        }
        activeItem = false
        activePlay = true
      }
    }
    else if(item.type === "live") {
      icon =  <CircleTimeIcon />
    }
    else if(item.type === "catchup") {
      activePlay = true
      if(activeSelected) {
        icon = <CirclePauseIcon circleColor="#3A3A3A" color="#1A1A1A"/>
      } else {
        icon =  <CirclePlayIcon />
      }
    } else {
      activePlay = true
      if(activeSelected) {
        icon = <CirclePauseIcon circleColor="#3A3A3A" color="#1A1A1A"/>
      } else {
        icon =  <CirclePlayIcon />
      }
    }

    if(activeSelected) {
      activeItem = activeSelected
    }
    // <CirclePlayIcon />}\
    return(
      <div className="item-tv">
        <div className="item-left-section">
          <IconStatus item={item}>
            {icon}
          </IconStatus>
        </div>
        <div className="item-right-section">
          <Description item={item} selected={activeItem} onClick={() => handleClickItem(item, activePlay)}/>
        </div>
      </div>
    )
  }
  return(
    <>
      <section className="list-item_tv-wrapper">
        {list?.epg?.map((item, index) => {
          return(
            <HandleItemSelected key={index} item={item}/>
          )
        })}
      </section>
    </>
  )
} 

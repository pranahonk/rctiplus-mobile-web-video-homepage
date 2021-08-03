import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { TvContext } from "../../../utils/contexts/tvContext"
import { liveTvCatchupScheduleClicked } from '../../../utils/appier';
import { CirclePlayIcon } from "../../IconComponents"

import * as dayjs from "dayjs"
import liveAndChatActions from '../../../redux/actions/liveAndChatActions';

const channelMain = ["RCTI", "MNCTV", "GTV", "iNEWS"]
export default function WeekList() {
  const { tab, setTab, selectItem } = useContext(TvContext)
  const { live_event: { data_epg_v2 } } = useSelector(state => state)
  // const { getEPG } = liveAndChatActions

  const handleToday = dayjs().format('DD')
  const dispatch = useDispatch()
  const router = useRouter()
  const channel = router.query.channel || ""

  const handleDate = (index, day) => {
    // dispatch(getEPG(dateChange, channel))
    channelMain.map((item, index) => {
      if(item.toLowerCase() === channel) {
        liveTvCatchupScheduleClicked(index+1, channel)
      }
    })
    setTab(day)
  }

  useEffect(() => {
    setTab(handleToday.toUpperCase())
  }, [])
  
  return(
    <>
      <section>
        <div className="list-week_wrapper">
          {data_epg_v2?.map((week, index) => {
            console.log(week, "anung")
            let activeItem = dayjs(selectItem?.date || null).format('DD')
            activeItem = activeItem === "Invalid Date" ? null : activeItem
            console.log(activeItem, "anung")
            return(
              <div className="day-item_wrapper" key={index} onClick={() => handleDate(index, week.day)}>
                {activeItem === week.date && !week.active && (
                  <>
                    <label>
                      <CirclePlayIcon circleColor="#ffffff" color="#FA262F" style={{width: 14 }}/>
                    </label>
                  </>
                )}
                {week.active && (
                  <>
                    <label className="day-item_today">
                      { activeItem === null || activeItem === week.date ? <CirclePlayIcon circleColor="#ffffff" color="#FA262F" style={{width: 10, marginRight: 2}}/> : "" }
                      <span>TODAY</span>
                    </label>
                  </>
                )}
                <div className={`day-item_text ${tab === week.date || tab === week.day ? "active" : " "}`}>{week.day}</div>
                <div className={`day-item_date ${tab === week.date || tab === week.day ? "active" : " "}`}>{week.date}</div>
                <span className={`day-item_line ${tab === week.date || tab === week.day ? "active" : " "}`}/>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
} 
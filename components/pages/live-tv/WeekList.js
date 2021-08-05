import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { TvContext } from "../../../utils/contexts/tvContext"
import { liveTvCatchupScheduleClicked } from '../../../utils/appier';

import * as dayjs from "dayjs"
import liveAndChatActions from '../../../redux/actions/liveAndChatActions';

const channelMain = ["RCTI", "MNCTV", "GTV", "iNEWS"]
export default function WeekList() {
  const { tab, setTab, selectDate, setSelectDate } = useContext(TvContext)
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
  },[])

  return(
    <>
      <section>
        <div className="list-week_wrapper">
          {data_epg_v2?.map((week, index) => {
            return(
              <div className="day-item_wrapper" key={index} onClick={() => handleDate(index, week.day)}>
                {week.active && (
                  <>
                    <label className="day-item_today">TODAY</label>
                  </>
                )}
                <div className="day-item_text">{week.day}</div>
                <div className="day-item_date">{week.date}</div>
                <span className={`day-item_line ${tab === week.date || tab === week.day ? "active" : " "}`}/>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
} 
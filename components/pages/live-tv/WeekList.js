import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import { TvContext } from "../../../utils/contexts/tvContext"

import * as dayjs from "dayjs"

const weeks = [
    {name: "SU", tab: "Sun"},
    {name: "MO", tab: "Mon"}, 
    {name: "TU", tab: "Tue"}, 
    {name: "WE", tab: "Wed"}, 
    {name: "TH", tab: "Thu"}, 
    {name: "FR", tab: "Fri"}, 
    {name: "SA", tab: "Sat"}]
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
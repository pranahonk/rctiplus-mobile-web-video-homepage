import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import dynamic from "next/dynamic"
import Layout from "../components/Layouts/Layout"
import * as dayjs from "dayjs"

import "../assets/scss/components/tv-v2.scss"

const channel = ["RCTI", "MNCTV", "GTV", "iNEWS"]
const weeks = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]


function TV_V2 (props) {
  const [tabChannel, setTabChannel] = useState("RCTI")

  console.log(dayjs().day())
  return(
    <>
      <Layout>
        <div id="tv-v2" className="tv_wrapper">
          <section>player</section>
          <section className="list-channel_wrapper">
            {channel.map((item, index) => {
              return(
                <div key={index} className={`channel-border ${tabChannel == item ? "active" : ""}`}>
                  <button className="channel-item" onClick={() => setTabChannel(item)}>
                    {item}
                  </button>
                </div>
              )
            })}
          </section>
          <section>
            <div className="list-week_wrapper">
              {weeks.map((week, index) => {
                return(
                  <div className="day-item_wrapper" key={index}>
                    {index === dayjs().day() && (
                      <>
                        <label className="day-item_today">TODAY</label>
                      </>
                    )}
                    <div className="day-item_text">{week}</div>
                    <div className="day-item_date">{dayjs().day(index).format("DD")}</div>
                    <span className="day-item_line active"/>
                  </div>
                )
              })}
            </div>
          </section>
          <section>list item play</section>
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      test: 1234
    }, // will be passed to the page component as props
  }
}

export default TV_V2
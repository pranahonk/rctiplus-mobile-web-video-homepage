import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"

const channel = ["RCTI", "MNCTV", "GTV", "iNEWS"]
export default function ChannelList() {
  const router = useRouter()
  const channelCode = router.query.channel || "RCTI"
  const [tabChannel, setTabChannel] = useState(channelCode)

  const handleTab = (item) => {
    setTabChannel(item)
    router.push(`tv_v2?channel=${item.toLowerCase()}`, `tv/${item.toLowerCase()}`)
  }
  return(
    <>
      <section className="list-channel_wrapper">
        {channel.map((item, index) => {
          return(
            <div key={index} className={`channel-border ${tabChannel.toLowerCase() == item.toLowerCase() ? "active" : ""}`}>
              <button className="channel-item" onClick={() => handleTab(item)}>
                {item}
              </button>
            </div>
          )
        })}
      </section>
    </>
  )
} 
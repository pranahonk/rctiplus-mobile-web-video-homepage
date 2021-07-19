import { useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { TvContext } from "../../../utils/contexts/tvContext"
import { liveTvChannelClicked } from '../../../utils/appier';

const channel = ["RCTI", "MNCTV", "GTV", "iNEWS"]
export default function ChannelList({toggle}) {
  const router = useRouter()
  const channelCode = router.query.channel || "RCTI"
  const [tabChannel, setTabChannel] = useState(channelCode)
  const { liveContent } = useContext(TvContext)

  const handleTab = (id, channel) => {
    liveTvChannelClicked(id , channel, liveContent?.title, 'mweb_livetv_channel_clicked');
    setTabChannel(channel)
    router.push(`tv_v2?channel=${channel.toLowerCase()}`, `tv/${channel.toLowerCase()}`)
    toggle()
  }

  return(
    <>
      <section className="list-channel_wrapper">
        {channel.map((item, index) => {
          return(
            <div key={index} className={`channel-border ${tabChannel.toLowerCase() == item.toLowerCase() ? "active" : ""}`}>
              <button className="channel-item" onClick={() => handleTab(index + 1, item)}>
                {item}
              </button>
            </div>
          )
        })}
      </section>
    </>
  )
} 
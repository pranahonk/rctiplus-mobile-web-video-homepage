import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"

import cookies from "js-cookie"
import dynamic from "next/dynamic"
import axios from "axios"

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import pageActions from '../../../redux/actions/pageActions';

const JwPlayer = dynamic(() => import('../../Includes/Player/JwPlayer'));

const listChannel = [
  {id: 1, channel: "rcti"},
  {id: 2, channel: "mnctv"},
  {id: 3, channel: "gtv"},
  {id: 4, channel: "inews"},
]

export default function ListItem({activeItem, activePlayCatchup, activePlayTv, activePause}) {
  const { getLiveEventUrl, getCatchupUrl, getAdsDuration, getAllEpg } = liveAndChatActions
  const { setPageLoader, unsetPageLoader } = pageActions
  const dispatch = useDispatch()
  const { live_event: { detail_live, data_live, duration_ads } } = useSelector(state => state)
  const router = useRouter()
  const [statusLogin, setStatusLogin] = useState(false)
  const [typePlayer, setTypePlayer] = useState("live tv")

  useEffect(() => {
    // dispatch(setPageLoader())
    // setTimeout(() => dispatch(unsetPageLoader()), 4000)
    const channel = router.query.channel || ""
    const id = listChannel.filter((item) => item.channel == channel.toLowerCase())
    const channel_code = id.length > 0 ? id[0].id : 0
    dispatch(getLiveEventUrl(channel_code))
    dispatch(getAllEpg(channel))
    dispatch(getAdsDuration())
    if(cookies.get("ACCESS_TOKEN")) {
        try {
          const id = jwtDecode(ACCESS_TOKEN)?.vid;
          if(id > 0) {
            setStatusLogin(true)
          }
        }
        catch (e) {
            console.log(e);
        }
    }
  }, [router.query?.channel])

  useEffect(() => {
    if(router.query?.epg_id) {
      setTypePlayer("catch up tv")
      dispatch(getCatchupUrl(router.query?.epg_id))
    }
  }, [router.query?.epg_id])
  return(
    <>
      <section className="player_tv-wrapper">
        <JwPlayer
          data={ detail_live }
          type={ typePlayer }
          // geoblockStatus={state.status}
          customData={ {
            isLogin: statusLogin,
            sectionPage: typePlayer === 'live tv' ? 'live tv' : 'catchup',
            } }
          adsOverlayData={ duration_ads }
        />
      </section>
    </>
  )
} 
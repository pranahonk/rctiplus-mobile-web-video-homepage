import { useEffect, useState } from "react"

export default function useCustomPlayerButton (props) {
  const [bitrateLevels, setBitrateLevels] = useState([])

  useEffect(() => {
    if (props.player && bitrateLevels.length > 0) setUpBitrate()
  }, [ props.player, bitrateLevels ])
  
  const setUpBitrate = () => {
    props.player.setCurrentQuality(0)
  }

  return [ setBitrateLevels ]
}
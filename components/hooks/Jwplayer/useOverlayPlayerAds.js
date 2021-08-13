import React, { useEffect, useState } from "react"
import { hydrate } from "react-dom"


export default function useOverlayPlayerAds(props) {
  const stateOfAds = {
    NONE: "none",
    INIT: "init",
    START: "start",
  }
  const [ slotDivGPT, setSlotDivGPT ] = useState(null)
  const [ adsState, setAdsState ] = useState(stateOfAds.NONE)

  useEffect(() => {
    if (props.data && adsState === stateOfAds.INIT) initialSetup()
    adsStatusListener()
  }, [
    props.data,
    props.player,
    adsState
  ])

  const adsStatusListener = () => {
    if (!props.player) return
    if (!slotDivGPT) return

    const playerContainer = props.player.getContainer()
    const adsWrapper = playerContainer.querySelector(".jw-ads-overlay")
    if (!adsWrapper) return
    
    if (adsState.includes("start")) {
      adsWrapper.style.display = ""
      defineAds()
    }
    else {
      adsWrapper.style.display = "none"
    }
  }

  const defineAds = () => {
    const { gpt } = props.data
    window.googletag = window.googletag || {cmd: []}
    
    const slot = googletag.defineSlot(gpt.path, [ gpt.size_width_1, gpt.size_height_1 ], slotDivGPT)
    if (slot) {
      slot.addService(googletag.pubads())

      gpt.cust_params
        .forEach(({ name, value }) => googletag.pubads().setTargeting(name, value))

      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      googletag.pubads().disableInitialLoad();
      googletag.enableServices();
    }
    
    googletag.display(slotDivGPT)
    googletag.pubads().refresh()
  }

  const initialSetup = () => {
    if (!props.player) return
    if (!props.type.includes("live")) return
    if (!props.data.gpt) return
    
    const { gpt } = props.data
    if (!gpt.path) return

    createOverlayAdsComponent()
  }

  const overlayAdsComponent = (slotDivGPT) => {
    return (
      <div className="jw-overlay-wrapper">
        <div
          id={slotDivGPT}
          className="jw-overlay-container"></div>
        <button
          className="jw-close-overlay"
          onClick={(e) => handleClickOverlayAds(e)}>
          x
        </button>
      </div>
    )
  }

  const handleClickOverlayAds = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const playerContainer = props.player.getContainer()
    const adsWrapper = playerContainer.querySelector(".jw-ads-overlay")
    adsWrapper.style.display = "none"
  }

  const createOverlayAdsComponent = () => {
    const adsOverlayElement = document.createElement('div')
    adsOverlayElement.classList.add('jw-ads-overlay')
    adsOverlayElement.style.display = "none"
    
    const { gpt } = props.data
    const envDivGPTString = (props.type === 'live tv') 
      ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV_DIV 
      : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV;
    
    const divGPTString = gpt.div_gpt ? gpt.div_gpt : envDivGPTString
    refreshOverlayChildNodes(adsOverlayElement)

    hydrate(
      <>{overlayAdsComponent(divGPTString)}</>,
      adsOverlayElement,
      () => setSlotDivGPT(divGPTString)
    )
  }

  const refreshOverlayChildNodes = (adsWrapperNode) => {
    const playerContainer = props.player.getContainer()
    const uniqueChildNode = new Map()

    for (const childNode of Array.from(playerContainer.children)) {
      playerContainer.removeChild(childNode)
      uniqueChildNode.set(childNode.className, childNode)
    }
    uniqueChildNode.set(adsWrapperNode.className, adsWrapperNode)
    
    Array.from([ ...uniqueChildNode.values() ])
      .forEach(childNode => playerContainer.appendChild(childNode))
  }

  return [ adsState, setAdsState, stateOfAds ]
}
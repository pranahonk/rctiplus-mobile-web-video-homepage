import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import { RESOLUTION_IMG } from '../../config'
import newsCountView from "../../redux/actions/newsCountView"

import "../../assets/scss/components/stories.scss"

function storyModal(props) {
  const progressBarWrapper = useRef(null)
  const modal = useRef(null)
  const [ activeIndex, setActiveIndex ] = useState(0)
  const [ player, setPlayer ] = useState(null)

  const timesec = 5
  const storyModalPlayerID = "storymodal-player"
  const options = {
    autostart: true,
    mute: false,
    file: null,
    hlsjsdefault: true,
    aspectratio: '16:9',
    stretching: 'uniform',
    width: '100%',
    height: 180,
    controls: false
  }
  const swipe = {
    clientX: 0
  }

  // effect that triggered when active progress bar changed by next/back/swipe action
  useEffect(() => {
    if (props.story.story) setActiveProgressbar()

    return () => {
      window.googletag = window.googletag || { destroySlots: () => {} }
      googletag.destroySlots()
    }
  }, [
    props.story.program_id,
    activeIndex,
  ])

  useEffect(() => {
    window.addEventListener("message", event => {
      if (!event.data) return
      if (!progressBarWrapper.current) return
      const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
      const currentIndex = event.data.index || 0
  
      switch(event.data.state) {
        case "RUN": {
          progressBars[currentIndex].classList.add("active")
          progressBars[currentIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
          return
        }
        case "PAUSE": {
          progressBars[currentIndex].children[0].style.animationPlayState = "paused"
          return
        }
        case "RERUN": {
          progressBars[currentIndex].children[0].style.animationPlayState = "running"
          return
        }
        default: return
      }
    })
  }, [])

  if (!props.story.story) return null

  const setActiveProgressbar = () => {

    // function to listen between switching of story contents
    if (!progressBarWrapper.current) return
    if (activeIndex > props.story.story.length - 1) return
    document.getElementById("nav-footer").style.display = "none"
    
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    
    if (props.story.story[activeIndex].seen) {
      progressBars[activeIndex].classList.add("active")
      progressBars[activeIndex].children[0].style.animation = `unset`
      setActiveIndex(activeIndex + 1)
      return
    }
    
    mountJwplayer()
  }

  const handleAnimationEnd = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    if ((activeIndex === props.story.story.length - 1)) {
      navigateStory(progressBars, "right")
      setActiveIndex(0)
    }
    else if (activeIndex < props.story.story.length - 1) {
      setActiveIndex(activeIndex + 1)
      progressBars[activeIndex].children[0].style.animation = "unset"
    }
  }

  const touchStart = (e) => {
    pauseProgressBar()
    if (player) player.pause()
    swipe.clientX = e.touches[0].clientX
  }

  const touchMove = (e) => {
    const distance = e.touches[0].clientX - swipe.clientX
    modal.current.style.transform = `translateX(${distance}px)`
  }

  const touchEnd = (e) => {
    const distance = e.changedTouches[0].clientX - swipe.clientX
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    runProgressBar()
    if (player) player.play()

    modal.current.style.transform = `unset`
    swipe.clientX = 0

    if (distance < -100) {
      navigateStory(progressBars, "right")
      setActiveIndex(0)
    }
    if (distance > 100) {
      navigateStory(progressBars, "left")
      setActiveIndex(0)
    }
  }

  const closeModal = () => {
    props.onClose()
    setActiveIndex(0)
  }

  const removeModalPlayer = _ => {
    player.remove()
    setPlayer(null)
  }

  const renderImageStory = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].classList.add("active")
    progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
  }

  const mountJwplayer = () => {
    const linkVideo = props.story.story[activeIndex].link_video
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    if (player) removeModalPlayer()

    if (props.story.is_ads) return injectAdsComponent()
    if (!linkVideo) return renderImageStory()

    // code below is used for render video story by jwplayer
    toggleLoading(true)

    const jwplayer = window.jwplayer(storyModalPlayerID).setup({
      ...options,
      file: linkVideo
    })
    setPlayer(jwplayer)

    jwplayer.on("ready", _ => {
      toggleLoading(false)
      
      progressBars[activeIndex].classList.add("active")
      progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
      pauseProgressBar()
    })

    jwplayer.on("play", _ => {
      const duration = jwplayer.getDuration()
      progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${duration}s`
      runProgressBar()
    })

    jwplayer.on("error", _ => {
      progressBars[activeIndex].children[0].style.animation = "unset"
    })

    jwplayer.on("buffer", _ => {
      pauseProgressBar()
    })
  }

  const injectAdsComponent = _ => {
    if (!props.story.is_ads) return
    const { div_gpt, path } = props.story.story[activeIndex]
    if (!div_gpt) return

    const adsChildren = document.getElementById(div_gpt)
    if (adsChildren.children[0]) adsChildren.removeChild(adsChildren.children[0])

    window.googletag = window.googletag || {cmd: []}
    googletag.cmd.push(function(){
      googletag
        .defineSlot(path, ["fluid"], div_gpt)
        .addService(googletag.pubads())
      googletag.pubads().enableSingleRequest()
      googletag.pubads().collapseEmptyDivs()
      googletag.pubads().addEventListener('slotRenderEnded', e => {
        const iframeAds = document.querySelector(`#${div_gpt} iframe`)
        if (!iframeAds) return

        iframeAds.style.width = "100vw"
        iframeAds.style.height = "100vh"
        iframeAds.contentWindow.postMessage({ state: "CREATED", index: activeIndex }, "*")
      })
      googletag.enableServices()
    })
    
    googletag.cmd.push(function(){
      googletag.display(div_gpt)
    })
  }
  
  const toggleLoading = (isLoading) => {

    // function to load content
    const storiesContentEl = document.getElementById("stories-content")
    if (isLoading) storiesContentEl.style.display = "none"
    else storiesContentEl.style.removeProperty("display")
  }

  const pauseProgressBar = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "paused"
  }

  const runProgressBar = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "running"
  }

  const navigateStory = (progressBars, direction) => {
    
    // navigate to the next story
    progressBars[activeIndex].classList.remove("active")
    progressBars[activeIndex].children[0].style.animation = "unset"

    let seenStories = null
    seenStories = {
      ...props.story,
      story: props.story.story.map((item, i) => {
        let story = item
        if (i < activeIndex) story = { ...item, seen: true }
        return story
      })
    }

    // destroy all ads on every story change
    window.googletag = window.googletag || { destroySlots: () => {} }
    googletag.destroySlots()

    props.onSwipe(direction, seenStories)

    setTimeout(() => {
      progressBars[activeIndex].classList.add("active")
    }, 100);
  }

  const divideComponentOnClick = (e) => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    const componentWidth = e.target.offsetWidth
    const isBackward = e.clientX < ( componentWidth / 4 )
    const isForward = e.clientX > ((componentWidth / 4) * 3)

    let targetIndex = activeIndex

    if (!isForward && !isBackward) return

    if (isForward) targetIndex = activeIndex + 1
    if (isBackward) targetIndex = activeIndex - 1

    if (isBackward) {
      progressBars[activeIndex].classList.remove("active")
      if (activeIndex - 1 >= 0 && props.story.story[activeIndex - 1].seen) {
        props.story.story[activeIndex - 1].seen = false
      }
    }

    if (targetIndex < 0) {
      navigateStory(progressBars, "left")
      targetIndex = 0
    }
    if (targetIndex > props.story.story.length - 1) {
      navigateStory(progressBars, "right")
      targetIndex = 0
    }
    setActiveIndex(targetIndex)
    setTimeout(() => {
      progressBars[activeIndex].children[0].style.animation = "unset"
    }, 100)
  }

  const renderCTAButton = _ => {
    const { type, external_link, permalink } = props.story.story[activeIndex]
    let href = (/^http:|^https:/.test(permalink)) ? permalink : "",
      onClick = () => {}

    switch (type) {
      case "url":
        if (!external_link) break

        if (/^http:|^https:/.test(external_link)) href = external_link
        else href = `https://${external_link}`
        break
      case "scan_qr":
        href = "/qrcode"
        break
      case "news_tags":
        {
          const tag = permalink.split("/").reverse()[0]
          onClick =  () => props.newsCountViewTag(tag)
        }
        break
      case "news_detail":
        {
          const detailId = +(permalink.split("/").reverse()[1])
          onClick = () => props.newsCountViewDetail(new DeviceUUID().get(), detailId)
        }
        break
    }

    if (!href) return null

    return (
      <a href={href} onClick={onClick}>
        Click Here
      </a>
    )
  }

  const storyImageSrc = props.story.story[activeIndex].story_img 
    ? `${props.story.image_path}${RESOLUTION_IMG}${props.story.story[activeIndex].story_img}`
    : "" 
  const storyVideoUrl = props.story.story[activeIndex].link_video

  return (
    <div className="modalview-wrapper">
      <div
        id="modalview-stories"
        ref={modal}
        onTouchStart={e => touchStart(e)}
        onTouchEnd={e => touchEnd(e)}
        onTouchMove={e => touchMove(e)}>
        <div className="progressbar-stories" ref={progressBarWrapper}>
          {props.story.story.map((e, i) => {
            return (
              <div key={`story-${e.id}-${i}`} className="progressbars">
                <span onAnimationEnd={_ => handleAnimationEnd()}></span>
              </div>
            )
          })}
        </div>

        <div className="story-head">
          <div>
            { !props.story.is_ads 
              ? (
                <>
                  <img
                    src={`${props.story.image_path}${RESOLUTION_IMG}${props.story.program_img}`}
                    alt="story-avatar"
                    width="50"
                    height="50" />
                  <label>
                    { props.story.story[activeIndex].title }
                  </label>
                </>
              ) 
              : <div></div>
            }
          </div>
          <button
            id="close-stories"
            className="close-stories"
            onClick={_ => closeModal()}>X</button>
        </div>

        <div
          id="stories-content"
          onClick={e => divideComponentOnClick(e)}
          className="stories-content" >

          <div 
            className="content-noads" 
            style={{ display: props.story.is_ads ? "none" : ""}}>
            <div 
              className="content-no-link"
              style={{ display: !storyVideoUrl && !storyImageSrc ? "" : "none" }}>
              Sorry, there is no link provided to show the story :(  
            </div>
            <img
              src={storyImageSrc}
              alt="story-image"
              width="100%"
              height="auto"
              style={{ display: storyImageSrc ? "" : "none" }}/>
            <div 
              id={storyModalPlayerID}
              style={{ display: storyVideoUrl ? "" : "none" }}/>
          </div>

          <div 
            id={props.story.story[activeIndex].div_gpt}
            style={{ display: props.story.is_ads ? "" : "none" }}></div>
        </div>

        <div
          id="stories-cta"
          className="stories-cta">
          { renderCTAButton() }
        </div>
      </div>

      <div className="placeholder-story">
        <div></div>
      </div>
    </div>
  )
}

export default connect(state => state, {
  ...newsCountView
})(storyModal)

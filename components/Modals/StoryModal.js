import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import { RESOLUTION_IMG } from '../../config'
import newsCountView from "../../redux/actions/newsCountView"
import StoryModalHeading from "../misc/StoryModalHeading"

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

  useEffect(() => {
    if (props.story.story) setActiveProgressbar()
  }, [
    props.story.program_id,
    activeIndex,
  ])

  if (!props.story.story) return null

  const setActiveProgressbar = () => {
    if (!progressBarWrapper.current) return
    if (activeIndex > props.story.story.length - 1) return
    document.getElementById("nav-footer").style.display = "none"

    mountJwplayer()

    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    if (props.story.story[activeIndex].seen) {
      progressBars[activeIndex].classList.add("active")
      progressBars[activeIndex].children[0].style.animation = `unset`
      setActiveIndex(activeIndex + 1)

      return
    }

    progressBars[activeIndex].classList.add("active")
    progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
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

  const mountJwplayer = () => {
    const linkVideo = props.story.story[activeIndex].link_video

    if (!linkVideo) {
      if (player) removeModalPlayer()
      return
    }

    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    const jwplayer = window.jwplayer(storyModalPlayerID).setup({
      ...options,
      file: linkVideo
    })
    progressBars[activeIndex].children[0].style.animation = "unset"
    setPlayer(jwplayer)
    pauseProgressBar()

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

  const pauseProgressBar = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "paused"
  }

  const runProgressBar = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "running"
  }

  const navigateStory = (progressBars, direction) => {
    progressBars[activeIndex].classList.remove("active")
    progressBars[activeIndex].children[0].style.animation = "unset"

    let seenStories = null
    if (direction === "right") {
      seenStories = {
        ...props.story,
       story: props.story.story.map((item, i) => {
         let story = item
         if (i < activeIndex) story = { ...item, seen: true }
         return story
        })
      }
    }

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

    if (isBackward) targetIndex = activeIndex - 1
    if (isForward) targetIndex = activeIndex + 1

    if (!isForward) {
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
          { !props.story.is_ads 
            ? (
              <>
                <div
                  id={storyModalPlayerID}
                  style={{ display: props.story.story[activeIndex].story_img ? "none" : ""}} />
                <img
                  src={`${props.story.image_path}${RESOLUTION_IMG}${props.story.story[activeIndex].story_img}`}
                  alt="story-image"
                  width="100%"
                  height="auto"
                  style={{ display: props.story.story[activeIndex].story_img ? "" : "none" }} />
              </>
            ) 
            : <div></div>
          }
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

import React, { useEffect, useRef, useState } from "react"

import { RESOLUTION_IMG } from '../../config'

import "../../assets/scss/components/stories.scss"

function storyModal(props) {
  const progressBarWrapper = useRef(null)
  const modal = useRef(null)
  const [ activeIndex, setActiveIndex ] = useState(0)

  const timesec = 5

  const swipe = {
    clientX: 0
  }

  useEffect(() => {
    if (props.story) setActiveProgressbar()
  }, [
    props.story,
    props.storyIndex,
    activeIndex
  ])

  const setActiveProgressbar = () => {
    if (!progressBarWrapper.current) return

    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].classList.add("active")
    progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
    progressBars[activeIndex].children[0].addEventListener("animationend", _ => {
      if ((activeIndex + 1 === props.story.story.length)) {
        // setActiveIndex(0)
        // props.onswipe("right")
        // progressBars[0].children[0].style.animation
      }
      else if ((activeIndex + 1) < props.story.story.length) setActiveIndex(activeIndex + 1)
    })
  }

  if (!props.story) return null

  const touchStart = (e) => {
    const activeProgressBar = progressBarWrapper.current.querySelectorAll(".progressbars")[activeIndex].children[0]
    activeProgressBar.style.animationPlayState = "paused"

    swipe.clientX = e.touches[0].clientX
  }

  const touchMove = (e) => {
    const distance = e.touches[0].clientX - swipe.clientX

    modal.current.style.transform = `translateX(${distance}px)`
  }

  const touchEnd = (e) => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    const distance = e.changedTouches[0].clientX - swipe.clientX
    
    progressBars[activeIndex].children[0].style.animationPlayState = "running"
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
    props.onclose()
    setActiveIndex(0)
  }

  const renderImageOrVideo = (storyContent) => {
    if (!storyContent) return

    const isVideo = storyContent.story_img ? false : true

    if (isVideo) return (
      <video width="100%" height="300" controls>
        <source 
          src={`${props.story.image_path}${RESOLUTION_IMG}${storyContent.link_video}`} 
          type="video/*" />
      </video>
    )

    return (
      <img 
        src={`${props.story.image_path}${RESOLUTION_IMG}${storyContent.story_img}`}
        alt="story-image"
        width="100%"
        height="auto" />
    )
  }

  const navigateStory = (progressBars, direction) => {
    progressBars[activeIndex].classList.remove("active")
    progressBars[activeIndex].children[0].style.animation = "unset"

    props.onswipe(direction)
    setTimeout(() => {
      progressBars[activeIndex].classList.add("active")
      progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
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
    progressBars[activeIndex].children[0].style.animation = "unset"

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
              <div key={`story-content-${i}`} className="progressbars">
                <span></span>
              </div>
            )
          })}
        </div>

        <button 
          className="close-stories"
          onClick={_ => closeModal()}>X</button>

        <div 
          onClick={e => divideComponentOnClick(e)}
          className="stories-content" >
          { renderImageOrVideo(props.story.story[activeIndex]) }
        </div>

        <div></div>
      </div>

      <div className="placeholder-story">
        <div></div>
      </div>
    </div>
  )
}

export default storyModal
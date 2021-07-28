import React, { useEffect, useRef, useState } from "react"
import { hydrate } from "react-dom"

export default function useCustomPlayerButton (props) {
  const [ isPlayerReady, setIsPlayerReady ] = useState(false)
  const fastForwardContainer = useRef()
  const fastBackwardContainer = useRef()

  useEffect(() => {
    if (isPlayerReady) setUpCustomBtns(props)
  }, [
    props.player,
    isPlayerReady,
    props.data && props.data.url,
    props.videoIndexing
  ])

  const setUpCustomBtns = ({ type }) => {
    if (!props.player) return
    const playerContainer = props.player.getContainer()
    const overlayButtonContainer = playerContainer.querySelector(".jw-display.jw-reset")

    if (!overlayButtonContainer) return

    // Set all display controls to be visible and put buttom control to the front
    playerContainer.querySelector(".jw-display.jw-reset").style.display = "flex"
   
    // Setup the margin of each controls to zero to prevent overlapping per element
    Array.from(playerContainer.querySelectorAll(".jw-display-icon-container.jw-reset"))
      .forEach(iconContainer => {
        iconContainer.style.margin = 0
        iconContainer.style.display = "flex"
      })

    injectCustomBtns([
      {
        className: "icon-next",
        direction: "forward",
        skipPosIconContainer: fastForwardContainer,
      }, {
        className: "icon-rewind",
        direction: "backward",
        skipPosIconContainer: fastBackwardContainer
      }
    ])
  
    if (type.includes("live")) {
      // Undisplay and empty the container
      playerContainer.querySelector(".jw-display-container.jw-reset").innerHTML = ""
    }
  }

  const createButtonContents = (rawContent, index, disabledDirection) => {
    const { className, direction, skipPosIconContainer } = rawContent
    const disabled = direction === disabledDirection

    const skipBtn = (
      <figure
        key={`${index}-skipbtn`}
        ref={skipPosIconContainer}
        className="jwplayer-action jw-icon"
        role="button"
        onClick={() => fastForwardBackwardClicked(direction)}>
        <img
          src={`/static/player_icons/player_fast${direction}.svg`}
          alt={`fast-${direction}-btn`} />
      </figure>
    )
    const navBtn = (
      <div
        key={`${index}-navbtn`}
        className={`jw-icon jw-${className} jw-button-color jw-reset`}
        role="button"
        onClick={() => handleClick(direction)}>
        <img
          src={`/static/player_icons/player_${direction}.svg`}
          alt={`${direction}-btn`} />
      </div>
    )
    const disabledNavBtn = <div key={`${index}-navbtn`}></div>

    const contents = [ skipBtn, disabled ? disabledNavBtn : navBtn ]
    if (direction === "forward") contents.reverse()

    return contents
  }

  const injectCustomBtns = (buttonContents) => {
    const playerContainer = props.player.getContainer()
    
    let disabledDirection = ""
    if (props.videoIndexing) {
      const { prev, current, maxQueue } = props.videoIndexing
      if (current === (maxQueue - 1)) disabledDirection = "forward"
      if (current === prev) disabledDirection = "backward"
    }

    Array.from(buttonContents).forEach((buttonContent, i) => {
      const { className } = buttonContent
      
      const contents = createButtonContents(buttonContent, i, disabledDirection)
      const parentIconsContainer = playerContainer
        .querySelector(`.jw-display-icon-container.jw-display-${className}.jw-reset`)

      if (!parentIconsContainer) return
      hydrate(<>{ contents.map(content => (content)) }</>, parentIconsContainer)
    })
  }

  const handleClick = (direction) => {
    if (props.actionBtn) props.actionBtn(direction)
  }

  const fastForwardBackwardClicked = (direction) => {
    if (!props.player) return

    const maxDuration = props.player.getDuration()
    let position = props.player.getPosition()
    let refContainer = null

    switch(direction) {
      case "forward":
        position = position + 10 > maxDuration ? maxDuration : position + 10
        refContainer = fastForwardContainer
        break
      case "backward":
        position = position - 10 < 0 ? 0 : position - 10
        refContainer = fastBackwardContainer
        break
    }
    props.player.seek(position)
    refContainer.current.classList.remove("fading")
    setTimeout(() => {
      refContainer.current.classList.add("fading")
    }, 10)
  }

  return {
    setIsPlayerReady,
  }
}
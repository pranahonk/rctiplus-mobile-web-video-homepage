import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { parseDateObject } from "../../utils/helpers"

import "../../assets/scss/components/modal.scss"

const CountdownTimer = dynamic(() => import("../../components/Includes/Common/CountdownTimer"))

export default function comingSoonModal(props) {
  let swipe = {}
  const ref = useRef(null)
  const [ open, setOpen ] = useState(props.open)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const onTouchStart = (e) => {
		const touch = e.touches[0];
		swipe = { y: touch.clientY };
	}

  const listenTouchModalComingSoon =  (e) => {
		const touch = e.touches[0]
    const distance = touch.clientY - swipe.y
    if (distance < 0) return
    ref.current.style.transform = `translateY(${distance}px)`
  }

  const closeComingSoonModal = (e) => {
    ref.current.style.transform = "unset"
    const touch = e.changedTouches[0]
    const distance = touch.clientY - swipe.y
    
    if (distance > 100) {
      props.onClose()
    }
  }

  const renderDateDetail = () => {
    const { year, month, date, day } = parseDateObject(props.content.start * 1000)
    return `${day}, ${date} ${month} ${year} - ${props.content.start_time}`
  }

  if (!open) return null

  return (
    <div id="modal-comingsoon" className="modal-comingsoon">
      <div ref={ref}>
        <div 
          id="close-bar" 
          className="close-bar"
          onTouchMove={e => listenTouchModalComingSoon(e)}
          onTouchStart={e => onTouchStart(e)}
          onTouchEnd={e => closeComingSoonModal(e)}>
          <div></div>
        </div>
        <img
          className="img-comingsoon"
          src={"../static/placeholders/placeholder_landscape.png"} 
          alt="modal coming soon"
          width="328"
          height="185" />
        <div className="desc-comingsoon">
          <p>{ props.content.title }</p>
          <p>{ renderDateDetail() }</p>
          <div>
            <CountdownTimer time={props.content.countdown} />
            <span>
              This program hasn't started yet.<br/>
              Please comeback later.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
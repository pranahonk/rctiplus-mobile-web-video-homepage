import { useEffect, useRef, useState } from "react"

import { parseDateObject } from "../../utils/helpers"
import CountdownTimer from "../../components/Includes/Common/CountdownTimer"

import "../../assets/scss/components/modal.scss"

export default function comingSoonModal(props) {
  let swipe = {}
  const ref = useRef(null)
  const [ open, setOpen ] = useState(props.open)

  useEffect(() => {
    setOpen(props.open)
    if (props.open) {

      // disable scroll event
      document.getElementById("nav-footer").style.display = "none"
      document.body.style.overflow = "hidden"
    }
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
    
    if (distance > 100) destroyModal()
  }

  const destroyModal = _ => {
    props.onClose()

    // enable scroll event
    document.body.style.removeProperty("overflow")
    document.getElementById("nav-footer").style.removeProperty("display")
  }

  const renderDateDetail = () => {
    const { year, month, date, day, time } = parseDateObject(props.content.start * 1000)
    return `${day}, ${date} ${month} ${year} - ${time}`
  }

  if (!open) return null

  return (
    <div 
      id="modal-comingsoon" 
      className="modal-comingsoon">
      <div>
        <div 
          id="destroy-modal-area" 
          onClick={_ => destroyModal()}></div>
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
            src={ props.content.image } 
            alt="modal coming soon"
            width="328"
            height="185" />
          <div className="desc-comingsoon">
            <p>{ props.content.title }</p>
            <p>{ renderDateDetail() }</p>
            <div>
              <CountdownTimer 
                time={props.content.countdown} 
                name={"Live In"} />
              <span>
                This program hasn't started yet.<br/>
                Please comeback later.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
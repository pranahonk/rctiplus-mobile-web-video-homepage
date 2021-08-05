import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { useSpring, a, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { showAlert } from '../../../utils/helpers';
import clamp from 'lodash/clamp'
import { Button } from 'reactstrap';
import { isIOS } from 'react-device-detect';
import CloseIcon from '@material-ui/icons/Close';


const height =  245;

const PaidVideo = (props) => {
  const sheetRef = useRef()
  const wrapperRef = useRef()
  const draggingRef = useRef(false)
  const [tnc, setTnc] = useState(false)
  const [styleHeight, setStyleHeight] = useState(200);
  const [swipe, setSwipe] = useState(false);
  const [{ y }, set] = useSpring(() => ({ y: height }))
  const open = ({ canceled }) => {
    // console.log('OPEN')
    setSwipe(true)
    // when the user opens the sheet, we disable the body from scrolling
    // disableBodyScroll(sheetRef.current)
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect

    set({ y: 0, config: canceled ? config.wobbly : config.stiff })
  }
  const close = (velocity = 0) => {
    // console.log('CLOSE')
    setSwipe(false)
    // when the user opens the sheet, we enable the body scroll
    // clearAllBodyScrollLocks()
    set({ y: height, config: { ...config.stiff, velocity } })
  }
  const bind = useDrag(({ first, last, vxvy: [, vy], movement: [, my], memo = y.get(), cancel, canceled }) => {
    let newY = memo + my

    // console.log(wrapperRef.current.clientHeight)
    // if(first) {
    //   console.log('first')
    // }
    // if(last) {
    //   console.log('last')
    // }
    // if(newY < 0) {
    //   console.log('<0')
    // }
    // if(newY < -120) {
    //   console.log('<-120')
    // }
    if (first) draggingRef.current = true
    // if this is not the first or last frame, it's a moving frame
    // then it means the user is dragging
    else if (last) draggingRef.current = false
    // adds friction when dragging the sheet upward
    // the more the user drags up, the more friction
    if (newY < 0) newY = newY / (1 - newY * 0.005)

    // if the user drags up passed a threshold, then we cancel
    // the drag so that the sheet resets to its open position
    if (newY < -120) cancel()

    // when the user releases the sheet, we check whether it passed
    // the treshold for it to close, or if we reset it to its open positino
    if (last) newY > height * 0.75 || vy > 0.5 ? close(vy) : open({ canceled })
    // when the user keeps dragging, we just move the sheet according to
    // the cursor position
    else {
      set({ y: clamp(newY, -400, height), immediate: true, config: config.stiff })
    }
    return memo
  })

  const display = y.to((py) => (py < height ? 'block' : 'block'))
  const _openApp = () => {
    showAlert('To be able to watch this episode offline, please download RCTI+ application on ' + (isIOS ? 'App Store' : 'Playstore'),
    '',
    'Open ' + (isIOS ? 'App Store' : 'Playstore'),
    'Cancel', () => { window.open((isIOS ? 'https://apps.apple.com/us/app/rcti/id1472168599' : 'https://play.google.com/store/apps/details?id=com.fta.rctitv'), '_blank'); });
  }
  return (
    <>
      {/* <a.div ref={sheetRef} className="paid__video-wrapper" {...bind()} style={{display, bottom: `calc(-100vh + ${height - 100}px)`, y }}> */}
      {tnc && (
        <div className="bg-overlay-paid__video">
          <div className="bg-overlay-paid__video-wraper">
            <div className="bg-overlay-paid__video-tnc">
              <div className="bg-overlay-paid__video-close">
                <div onClick={() => {setTnc(!tnc)}}><CloseIcon /></div>
              </div>
              <h1 className="bg-overlay-paid__video-text-title">Terms & Conditions</h1>
              <div className="bg-overlay-paid__video-text-content" dangerouslySetInnerHTML={{ __html: `${props.data['tracking-program']?.data?.package?.disclaimer}` }} />
          </div>
          </div>
        </div>
      )}
      <a.div ref={sheetRef} className="paid__video-wrapper" {...bind()} style={{display, bottom: `-90vh`, y }}>
        { swipe ? (<div className="paid__video-disclamer" ref={wrapperRef}>
          <h1>DISCLAMER</h1>
          <div className="paid__disclamer-list">
            <div dangerouslySetInnerHTML={{ __html: `${props.data['tracking-program']?.data?.package?.disclaimer}` }} />
          </div>
          <div className="paid__video-tnc">
            By tapping Purchase button, you agree to our 
            <div className="paid_action-tnc" onClick={() => {setTnc(!tnc), setSwipe(false)}}>Terms & Conditions</div>
          </div>
          <div className="paid__video-info">
            <h2>{ props.data['tracking-program']?.data?.package?.name }</h2>
            <h1>Rp. { props.data['tracking-program']?.data?.package.price }</h1>
          </div>
          <div className="action">
            <Button color="danger" className="btn-paid__video" onClick={() => _openApp()}>Purchase</Button>
          </div>
        </div>) :
        (<div className="paid__video-content">
          <div className="content-wrapper">
            <h1 className="content-title">
              { props.data['tracking-program']?.data?.package?.name }
            </h1>
            <h2 className="content-price">
              Rp. { props.data['tracking-program']?.data?.package.price }
            </h2>
          </div>
          <div className="action">
            <Button color="danger" className="btn-paid__video" onClick={() => _openApp()}>Purchase</Button>
          </div>
        </div>) }
      </a.div>
    </>
  )
}

const mapStateToProps = state => {
  const { Program, user } = state;
  return { data: Program, auth: user };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaidVideo));

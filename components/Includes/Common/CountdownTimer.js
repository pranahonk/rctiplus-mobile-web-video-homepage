import React, { useEffect, useState } from 'react';

import '../../../assets/scss/components/countdown.scss';

function countdownTimer (props) {
  // NOTE: props.time has to be in milliseconds and is result of start date - end date !!
  // other than that it would return inappropriate time/countdown
  const [ hour, setHour ] = useState(Math.floor(props.time / (1000 * 3600)))
  const [ minutes, setMinutes ] = useState(Math.floor(((props.time / (1000 * 3600)) - hour) * 60 ))
  const [ seconds, setSeconds ] = useState(Math.floor(((((props.time / (1000 * 3600)) - hour) * 60) - minutes) * 60))
  
  useEffect(() => {
    timer()
  }, [])

  const timer = () => {
    let sec = seconds
    let min = minutes
    let hrs = hour
    const interval = setInterval(() => {
      if (sec === 0 && min > 0) {
        sec = 60
        min -= 1
        if (min === 0 && hrs > 0) {
          min = 60
          hrs -= 1
          setHour(hrs)
        }
        setMinutes(min)
      }
      if (sec > 0) {
        sec -= 1
        setSeconds(sec)
      }
    }, 1000)

    if (Array.from([ sec, min, hrs ]).every(num => num === 0)) clearInterval(interval)
  }

  const renderCountDownTimer = () => {
    return Array.from([ hour, minutes, seconds ])
      .map(num => {
        if (num < 10) return `0${num}`
        return num
      }).join(":")
  } 

  return (
    <div className="countdown">
      <p>COMING SOON</p>
      <p>{renderCountDownTimer()}</p>
    </div>
  )
}

export default countdownTimer;

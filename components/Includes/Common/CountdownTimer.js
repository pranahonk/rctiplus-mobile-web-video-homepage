import React from 'react';
import Countdown, { zeroPad } from 'react-countdown-now';

import '../../../assets/scss/components/thumbnail.scss';

class CountdownTimer extends React.Component {
  render() {
    return (
        <Countdown
          key="1"
          // eslint-disable-next-line radix
          date={Date.now() + parseInt(this.props.timer)}
          renderer= {({hours, minutes, seconds, completed}) => {
            if (completed) {
              console.log('completed');
              return '';
            }
            return (<div className="thumb-timer" style={{opacity: this.props.statusTimer}}>Coming soon <span>{zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds)}</span></div>);
          }}
           />
    );
  }
}

export default CountdownTimer;

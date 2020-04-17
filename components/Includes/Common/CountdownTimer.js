import React from 'react';
import Countdown, { zeroPad } from 'react-countdown-now';

import '../../../assets/scss/components/thumbnail.scss';

class CountdownTimer extends React.Component {

  now = Date.now();

  render() {
    return (
        <Countdown
          key="1"
          // eslint-disable-next-line radix
          date={this.now + parseInt(this.props.timer)}
          renderer= {({hours, minutes, seconds, completed}) => {
            if (completed) {
              console.log('completed');
              return '';
            }
            return (<div className="thumb-timer" style={{opacity: this.props.statusTimer, position: this.props.position ? this.props.position + ' !important' : 'absolute', ...{ bottom: this.props.position ? 0 : 10 }}}>Coming soon <span>{zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds)}</span></div>);
          }}
           />
    );
  }
}

export default CountdownTimer;

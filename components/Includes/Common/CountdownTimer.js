import React from 'react';
import Countdown, { zeroPad } from 'react-countdown-now';

import '../../../assets/scss/components/thumbnail.scss';

class CountdownTimer extends React.Component {

  now = Date.now();

  render() {
    return (
      <div>
      {!this.props.statusPlay ?
        <div className="thumb-timer" style={{opacity: this.props.statusTimer, position: this.props.position ? this.props.position + ' !important' : 'absolute', ...{ bottom: this.props.position ? 0 : 10 }}}><span>PLAYING NOW</span></div>
         : this.props.statusTimer === '1' ?
          (<Countdown
            key={this.props.key}
            // eslint-disable-next-line radix
            intervalDelay={0}
            precision={3}
            date={this.now + parseInt(this.props.timer)}
            renderer= {({total, days, hours, minutes, seconds, milliseconds, completed}) => {
              if (completed) {
                if (this.props.onUrl !== undefined) this.props.onUrl(true);
                {/* this.props.onUrl(true); */}
                console.log('completed');
                return '';
              }
              return (<div className="thumb-timer" style={{opacity: this.props.statusTimer, position: this.props.position ? this.props.position + ' !important' : 'absolute', ...{ bottom: this.props.position ? 0 : 10 }}}>Coming soon <span>{zeroPad(hours + (days * 24)) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds)}</span></div>);
            }}
            />) : (<div />)
        }
      </div>
    );
  }
}

export default CountdownTimer;

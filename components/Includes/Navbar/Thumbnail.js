import React from 'react';

import Countdown, { zeroPad } from 'react-countdown-now';
import Img from 'react-image';

import '../../../assets/scss/components/thumbnail.scss';

class Thumbnail extends React.Component {
  render() {
    return (
      <div className="thumb-container">
        <div className={'thumb-label'} style={{backgroudColor: this.props.backgroudColor, opacity: this.props.statusLabel}}>
          {this.props.label}
        </div>
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
           <Img
              alt={this.props.src}
              className="thumb-img"
              unloader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
              loader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
              src={[this.props.src]} />
      </div>
    );
  }
}

export default Thumbnail;


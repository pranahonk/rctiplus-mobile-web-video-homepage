import React from 'react';

import Img from 'react-image';
import CountdownTimer from '../Common/CountdownTimer';

import '../../../assets/scss/components/thumbnail.scss';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="thumb-container">
        <div className={'thumb-label'} style={{backgroudColor: this.props.backgroudColor, opacity: this.props.statusLabel }}>
          {this.props.label}
        </div>
            <CountdownTimer timer={this.props.timer} timerCurrent={this.props.timerCurrent} statusTimer={this.props.statusTimer} statusPlay={this.props.statusPlay}/>
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


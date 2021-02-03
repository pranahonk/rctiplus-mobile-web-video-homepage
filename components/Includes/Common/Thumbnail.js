import React from 'react';

import Img from 'react-image';
import CountdownTimer from '../Common/CountdownTimer';
import moment from 'moment'

import '../../../assets/scss/components/thumbnail.scss';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className="thumb-container">
          <div className={'thumb-label'} style={{backgroudColor: this.props.backgroudColor, opacity: this.props.statusLabel }}>
            {this.props.label}
          </div>
            <Img
                alt={this.props.src}
                className="thumb-img"
                unloader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
                loader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
                src={[this.props.src]} />
        </div>
        {this.props.dateEvent && (
          <h2 className="thumb-text_date">{`${moment.unix(this.props.dateEvent ).format('dddd, DD MMM YYYY - h:mm')} WIB`}</h2>
        )}
        {
          this.props.timer && (
          <div className="thumb-status_play">
            <CountdownTimer timer={this.props.timer} timerCurrent={this.props.timerCurrent} statusTimer={this.props.statusTimer} statusPlay={this.props.statusPlay}/>
          </div>
          )
        }
      </>
    );
  }
}

export default Thumbnail;


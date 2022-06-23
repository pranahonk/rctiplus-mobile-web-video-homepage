import React from 'react';

import Img from 'react-image';
import {Button, Row} from 'reactstrap'
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
        {this.props?.isInteractive !== 'false' && (
          <div className='thumb-label-interactive interactive'>
              <Row className='justify-content-center px-2'>
                <img 
                  src='/static/player_icons/quiz_icon.svg	'
                  width={20}
                  height={20}
                  alt="desc"
                  style={{marginTop: '2px'}}
                  />
                <p className='ml-2 text-white' style={{fontSize: '12px', marginTop: '5px'}}>INTERACTIVE</p>
              </Row>
            {/* <Button color="link px-4">
            </Button> */}
          </div>
        )}
      <CountdownTimer timer={this.props.timer} timerCurrent={this.props.timerCurrent} statusTimer={this.props.statusTimer} statusPlay={this.props.statusPlay}/>
      <Img
        alt={this.props.alt}
        className="thumb-img"
        unloader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
        loader={<img className="thumb-img" src="/static/placeholders/placeholder_landscape.png"/>}
        src={[this.props.src]} />
      </div>
    );
  }
}

export default Thumbnail;


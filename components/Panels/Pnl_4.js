import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';
import initialize from '../../utils/initialize';

/* vertical  */

class Pnl_4 extends React.Component {
  render() {
    return (
      <div className="homepage-content" id="vertical">
        <h4 className="content-title">Panel vertical</h4>
        <Carousel
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          showArrows={false}
          showStatus={false}
          swipeScrollTolerance={1}
        >
          <Lazyload height={200}>
            <img src="/static/sample/live1.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={200} once>
            <img src="/static/sample/live2.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
        </Carousel>
      </div>
    );
  }
}

export default connect(state => state, contentActions)(Pnl_4);

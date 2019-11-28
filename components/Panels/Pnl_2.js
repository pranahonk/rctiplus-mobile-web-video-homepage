import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';
import initialize from '../../utils/initialize';

/* horizontal_landscape  */

class Pnl_1 extends React.Component {
  render() {
    return (
      <div className="homepage-content" id="pnl_horizontal_landscape">
        <h4 className="content-title">Panel horizontal_landscape</h4>
        <Carousel
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          showArrows={false}
          showStatus={false}
          swipeScrollTolerance={1}
		  swipeable={true}
        >
          <Lazyload height={100} className="pnl_2">
            <img src="/static/sample/live1.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={100} className="pnl_2">
            <img src="/static/sample/live2.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={100} className="pnl_2">
            <img src="/static/sample/live1.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={100} className="pnl_2">
            <img src="/static/sample/live2.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={100} className="pnl_2">
            <img src="/static/sample/live1.jpg" />
            <div className="txt-slider-panel">
              <h5>Title top</h5>
              <p>this is just short desc</p>
            </div>
          </Lazyload>
          <Lazyload height={100} className="pnl_2">
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

export default connect(state => state, contentActions)(Pnl_1);

import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';
import initialize from '../../utils/initialize';

/* horizontal  */

class Pnl_3 extends React.Component {
  render() {
    return (
      <div className="homepage-content" id="pnl_horizontal">
        <h4 className="content-title">Panel horizontal</h4>
        <Carousel
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          showArrows={false}
          showStatus={false}
          swipeScrollTolerance={1}
		  swipeable={true}
        >
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl1.jpg" />
          </Lazyload>
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl2.jpg" />
          </Lazyload>
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl1.jpg" />
          </Lazyload>
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl2.jpg" />
          </Lazyload>
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl1.jpg" />
          </Lazyload>
          <Lazyload height={100} className="pnl_3">
            <img src="/static/sample/hl2.jpg" />
          </Lazyload>
        </Carousel>
      </div>
    );
  }
}

export default connect(state => state, contentActions)(Pnl_3);

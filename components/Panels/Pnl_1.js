import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';
import initialize from '../../utils/initialize';

/* horizontal_landscape_large  */

class Pnl_1 extends React.Component {
  render() {
    return (
      <div className="homepage-content" id="horizontal_landscape_large">
        <h4 className="content-title">Panel horizontal_landscape_large</h4>
        <Carousel
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          showArrows={false}
          showStatus={false}
          swipeScrollTolerance={1}
          swipeable={true}
        >
          <Lazyload height={200}>
            <a href="#">
              <img src="/static/sample/live1.jpg" />
            </a>
          </Lazyload>
          <Lazyload height={200} once>
            <a href="#">
              <img src="/static/sample/live2.jpg" />
            </a>
          </Lazyload>
        </Carousel>
      </div>
    );
  }
}

export default connect(state => state, contentActions)(Pnl_1);

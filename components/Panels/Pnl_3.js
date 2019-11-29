import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';

/* horizontal  */

class Pnl_3 extends React.Component {
  render() {
    return (
      <div className="homepage-content" id="pnl_horizontal">
        <h4 className="content-title">{this.props.title}</h4>
        <Carousel
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          showArrows={false}
          showStatus={false}
          swipeScrollTolerance={1}
          swipeable={true}
        >
          {this.props.content.map(c => (
            <Lazyload key={c.content_id} height={100} className="pnl_3">
              <Img src={[this.props.imagePath + this.props.resolution + c.portrait_image, '/static/placeholders/placeholder_landscape.png']} />
            </Lazyload>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default connect(state => state, contentActions)(Pnl_3);

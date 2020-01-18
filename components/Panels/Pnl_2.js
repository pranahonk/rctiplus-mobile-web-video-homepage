import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import contentActions from '../../redux/actions/contentActions';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import '../../assets/scss/components/panel.scss';

/* horizontal_landscape  */

class Pnl_1 extends React.Component {
	render() {
		return (
			<div className="homepage-content" id="pnl_horizontal_landscape" style={{ marginBottom: 20 }}>
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
						<Lazyload key={c.content_id} height={100} className="pnl_2">
							<div>
								<Img 
									alt={c.program_title} 
									unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
									src={[this.props.imagePath + this.props.resolution + c.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
								<PlayCircleOutlineIcon className="play-btn-2" />
							</div>

							<div className="txt-slider-panel">
								<p><strong>{c.program_title ? c.program_title : this.props.title}</strong></p>
								<p>{c.content_title}</p>
							</div>
						</Lazyload>
					))}
				</Carousel>
			</div>
		);
	}
}

export default connect(state => state, contentActions)(Pnl_1);

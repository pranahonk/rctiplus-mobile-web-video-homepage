import React, {Component, Children} from 'react';
import { Carousel } from 'react-responsive-carousel';

class Crs extends Component {
	static propTypes = {
		showThumbs: false
	}
	render() {
		return (
			<Carousel autoPlay>
				<div>
				<img src="static/sample/1.jpg" />
				<p className="legend">Legend 1</p>
				</div>
				<div>
				<img src="static/sample/2.jpg" />
				<p className="legend">Legend 2</p>
				</div>
				<div>
				<img src="static/sample/3.jpg" />
				<p className="legend">Legend 3</p>
				</div>
			</Carousel>
		);
	}
}
export default Crs;

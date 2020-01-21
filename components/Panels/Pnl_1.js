import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../redux/actions/contentActions';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import '../../assets/scss/components/panel.scss';

/* horizontal_landscape_large  */

class Pnl_1 extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id: this.props.contentId,
			contents: this.props.content,
			loading: false,
			page: 1,
			length: 7,
			endpage: false
		};
	}

	loadMore() {
		if (!this.state.loading && !this.state.endpage) {
			const page = this.state.page + 1;
			this.setState({ loading: true }, () => {
				this.props.loadingBar && this.props.loadingBar.continuousStart();
				this.props.getHomepageContents(this.state.id, 'mweb', page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							const contents = this.state.contents;
							contents.push.apply(contents, response.data.data);
							this.setState({ loading: false, contents: contents, page: page, endpage: response.data.data.length < this.state.length });
						}
						else {
							this.setState({ loading: false });
						}
						this.props.loadingBar && this.props.loadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.setState({ loading: false, endpage: true })
						this.props.loadingBar && this.props.loadingBar.complete();
					});
			});
		}
	}

	render() {
		return (
			<div className="homepage-content horizontal_landscape_large">
				<h4 className="content-title">{this.props.title}</h4>
				<BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
					{scrollRef => (
						<div ref={scrollRef} className="swiper-container">
							{this.state.contents.map(c => (
								<div key={c.content_id} className="swiper-slide">
									<div >
										<Img 
											alt={c.program_title} 
											unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
											loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
											src={[this.props.imagePath + this.props.resolution + c.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
										<PlayCircleOutlineIcon className="play-btn-1" />
									</div>
									<div className="txt-slider-panel no-bg">
										<h5>{c.program_title ? c.program_title : this.props.title}</h5>
										<p>{c.content_title}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</BottomScrollListener>
				
			</div>
		);
	}
}

export default connect(state => state, contentActions)(Pnl_1);

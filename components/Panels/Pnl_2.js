import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../redux/actions/contentActions';
import { contentGeneralEvent, homeGeneralClicked } from '../../utils/appier';

import '../../assets/scss/components/panel.scss';

class Pnl_2 extends React.Component {

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

		this.swipe = {};
	}

	onTouchStart(e) {
		const touch = e.touches[0];
		this.swipe = { x: touch.clientX };
	}

	onTouchEnd(e) {
		const touch = e.changedTouches[0];
		const absX = Math.abs(touch.clientX - this.swipe.x);
		if (absX > 50) {
			homeGeneralClicked('mweb_homepage_scroll_horizontal');
		}
	}

	link(data) {
		console.log('PANEL 2', data);
		switch (data.content_type) {
			case 'special':
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', data.portrait_image, data.landscape_image, 'mweb_homepage_special_event_clicked');

				window.open(data.link, '_blank');
				break;

			case 'program':
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', data.portrait_image, data.landscape_image, 'mweb_homepage_program_clicked');

				Router.push(`/programs/${data.program_id}/${data.program_title.replace(/ +/g, '-').toLowerCase()}?ref=homepage&homepage_title=${this.props.title}`);
				break;

			case 'live':
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', data.portrait_image, data.landscape_image, 'mweb_homepage_live_event_clicked');
				
				Router.push(`/live-event/${data.content_id}/${data.content_title.replace(/ +/g, '-').toLowerCase()}?ref=homepage&homepage_title=${this.props.title}`);
				break;

			default:
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', data.portrait_image, data.landscape_image, 'mweb_homepage_content_clicked');
				
				Router.push(`/programs/${data.program_id}/${data.program_title.replace(/ +/g, '-').toLowerCase()}/${data.content_type}/${data.content_id}/${data.content_title.replace(' ', '-').toLowerCase()}?ref=homepage&homepage_title=${this.props.title}`);
				break;
		}
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
						this.setState({ loading: false })
						this.props.loadingBar && this.props.loadingBar.complete();
					});
			});
		}
	}

	render() {
		return (
			<div onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} className="homepage-content pnl_horizontal_landscape" id="pnl_horizontal_landscape" style={{ marginBottom: 20 }}>
				<h4 className="content-title">{this.props.title}</h4>
				<BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
					{scrollRef => (
						<div ref={scrollRef} className="swiper-container">
							{this.state.contents.map(c => (
									<div onClick={() => this.link(c)}  key={`${this.props.contentId}-${c.content_id}`} className="swiper-slide">
										<div>
											<Img 
												alt={c.program_title} 
												unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
												src={[this.props.imagePath + this.props.resolution + c.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
											{/* <PlayCircleOutlineIcon className="play-btn-2" /> */}
										</div>
		
										<div className="txt-slider-panel">
											<p><strong>{c.program_title ? c.program_title : this.props.title}</strong></p>
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

export default connect(state => state, contentActions)(Pnl_2);

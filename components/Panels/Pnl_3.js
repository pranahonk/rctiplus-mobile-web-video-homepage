import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../redux/actions/contentActions';
import { contentGeneralEvent, homeGeneralClicked, homeProgramClicked } from '../../utils/appier';
import { urlRegex } from '../../utils/regex';
import { showSignInAlert } from '../../utils/helpers';
import { gaTrackerLineUp, gaTrackerProgram } from '../../utils/ga-360';
const jwtDecode = require('jwt-decode');
class Pnl_3 extends React.Component {

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
	handleActionClick(program, url) {
			switch (program.action_type) {
				case 'live_streaming' :
					let channel = 'rcti'
					if(program?.link === '1') {
							channel = 'rcti'
					}
					if(program?.link === '2') {
							channel = 'mnctv'
					}
					if(program?.link === '3') {
							channel = 'gtv'
					}
					if(program?.link === '4') {
							channel = 'inews'
					}
					Router.push(`/tv/${channel}`);
				break;
				case 'catchup':
				if(program.link && program.channel && program.catchup_date) {
						const title = program?.content_title?.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')
						Router.push(`/tv/${program.channel}/${program.link}/${title}?date=${program.catchup_date}`)
				}
				break;
				case 'scan_qr':
					Router.push("/qrcode")
				break;
				case 'homepage_news':
					Router.push("/news")
				break;
				case 'news_detail' :
				case 'news_category':
				case 'news_tags' :
						window.open(program.link, '_parent');
						break;
				case 'episode':
						if(program.link && program.program_id) {
								const title = program.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')
								Router.push(`/programs/${program.program_id}/${title}/episode/${program.link}/${title}`)
						}
						break;
				case 'live_event':
						if (program.link) {
								Router.push(`/live-event/${program.link}/${program.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')}`);
						}
						break;
				case 'genre':
							Router.push(`/explores/${program.link}/${program.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')}`);
						break;
				case 'program':
						Router.push(`/programs/${program.link}/${program.content_title.replace(/ +/g, '-')}`);
						break;
				case 'popup':
						window.open(url, '_parent');
						break;
				default:
						Router.push(url);
		}
	}
	link(data) {

		switch (data.content_type) {
			case 'special':
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', this.props.imagePath + this.props.resolution + data.portrait_image, this.props.imagePath + this.props.resolution + data.landscape_image, 'mweb_homepage_special_event_clicked');
        gaTrackerProgram('video_interaction','video_click_program_list', data.content_title,
          'not_available', data.program_id, 'not_available', 'not_available', 'not_available',
          'not_available', 'not_available', 'not_available', 'not_available', 'not_available', 'not_available', data.premium === 0 ? 'no' : 'yes')
				window.open(data.link, '_blank');
				let url = data.url ? data.url : data.link;
				// console.log('token:', this.props.token);
				if (data.mandatory_login && this.props.user.isAuth) {
					url += this.props.token;
				}

				let payload = {};
				try {
					payload = jwtDecode(this.props.token);
					// console.log(payload && !payload.vid);
					if (data.mandatory_login && !this.props.user.isAuth) {
						showSignInAlert(`Please <b>Sign In</b><br/>
							Woops! Gonna sign in first!<br/>
							Only a click away and you<br/>
							can continue to enjoy<br/>
							<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
					}
					else {
						this.handleActionClick(data, url)
						// window.open(url, '_blank');
						// window.location.href = url;
					}
				}
				catch (e) {
					if (data.mandatory_login && !this.props.user.isAuth) {
						showSignInAlert(`Please <b>Sign In</b><br/>
							Woops! Gonna sign in first!<br/>
							Only a click away and you<br/>
							can continue to enjoy<br/>
							<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
					}
				}
				break;

			case 'live':
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', this.props.imagePath + this.props.resolution + data.portrait_image, this.props.imagePath + this.props.resolution + data.landscape_image, 'mweb_homepage_live_event_clicked');

				Router.push(`/live-event/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${this.props.title}`);
				break;

			case 'program':
				homeProgramClicked(this.props.title, data.program_id, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A',  this.props.imagePath + this.props.resolution + data.portrait_image, this.props.imagePath + this.props.resolution + data.landscape_image, 'mweb_homepage_program_clicked');
        gaTrackerProgram('video_interaction','video_click_program_list', data.content_title,
          'not_available', data.program_id, 'not_available', 'not_available', 'not_available',
          'not_available', 'not_available', 'not_available', 'not_available', 'not_available', 'not_available', data.premium === 0 ? 'no' : 'yes')

				if (data.program_id) {
					Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}?ref=homepage&homepage_title=${this.props.title}`);
				}
				else if (data.content_id) {
					Router.push(`/programs/${data.content_id}/${urlRegex(data.program_title)}?ref=homepage&homepage_title=${this.props.title}`);
				}
				break;

			default:
				contentGeneralEvent(this.props.title, data.content_type, data.content_id, data.content_title, data.program_title ? data.program_title : 'N/A', data.genre ? data.genre : 'N/A', this.props.imagePath + this.props.resolution + data.portrait_image, this.props.imagePath + this.props.resolution + data.landscape_image, 'mweb_homepage_content_clicked');

				Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}/${data.content_type}/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${this.props.title}`);
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
						this.setState({ loading: false, endpage: true })
						this.props.loadingBar && this.props.loadingBar.complete();
					});
			});
		}
	}

	render() {

		return (
			<div onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} className="homepage-content pnl_horizontal">
				<h2 className="content-title">{this.props.title}</h2>
				<BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
					{scrollRef => (
						<div ref={scrollRef} className="swiper-container">
							{this.props.content.map((c, i) => (
								<div onClick={() => this.link(c)}  key={`${this.props.contentId}-${c.content_id}-${i}`} className="swiper-slide">
								{c?.premium ? (
									<div className="paid-label">
										<div style={{ position: 'relative', display: 'flex' }}>
											<span className="title-paid-video">Premium</span>
											<span className="icon-paid-video">
												<img src="/icons-menu/crown_icon@3x.png" alt="icon-video"/>
											</span>
										</div>
									</div>
								) : ''}
									<div>
										<Img
											alt={c.program_title || c.content_title}
											unloader={<img src="/static/placeholders/placeholder_potrait.png"/>}
											loader={<img src="/static/placeholders/placeholder_potrait.png"/>}
											src={[this.props.imagePath + this.props.resolution + c.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
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

export default connect(state => state, contentActions)(Pnl_3);

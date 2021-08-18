import React from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';

import contentActions from '../../redux/actions/contentActions';
import { contentGeneralEvent, homeGeneralClicked, homeProgramClicked } from '../../utils/appier';
import { showSignInAlert } from '../../utils/helpers';
import { urlRegex, titleStringUrlRegex } from '../../utils/regex';

import '../../assets/scss/components/panel.scss';

const jwtDecode = require('jwt-decode');

class SquareImage extends React.Component {
  state = {
    id: this.props.contentId,
    contents: this.props.content,
    loading: false,
    page: 1,
    length: 7,
    endpage: false
  };
  swipe = {};

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
      case 'live_streaming' : {
          const channels = {
            "1": "rcti",
            "2": "mnctv",
            "3": "gtv",
            "4": "inews",
          }
          Router.push(`/tv/${channels[program?.link]}`)
        }
        break;
      case 'catchup': {
          if (!program.link || !program.channel || !program.catchup_date) break
          const title = titleStringUrlRegex(program?.content_title)
          Router.push(`/tv/${program.channel}/${program.link}/${title}?date=${program.catchup_date}`)
        }
        break;
      case 'scan_qr':
        Router.push("/qrcode")
        break;
      case 'homepage_news':
        Router.push("/news")
        break;
      case 'news_tags' :
        window.open(program.link, '_parent');
        break;
      case 'episode': {
          if(!program.link || !program.program_id) return
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/programs/${program.program_id}/${title}/episode/${program.link}/${title}`)
        }
        break;
      case 'live_event': {
          if (!program.link) return
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/live-event/${program.link}/${title}`);
        }
        break;
      case 'genre': {
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/explores/${program.link}/${title}`);
        }
        break;  
      case 'program': {
          const title = titleStringUrlRegex(program.content_title)
          Router.push(`/programs/${program.link}/${title}`);
        }
        break;  
      case 'popup':
        window.open(url, '_parent');
        break;  
      default:
        Router.push(url);
		}       
	}
  
	link(data) {
    const contentGeneralEventArgs = [
      this.props.title,
      data.content_type,
      data.content_id,
      data.content_title,
      data.program_title ? data.program_title : 'N/A',
      data.genre ? data.genre : 'N/A', 
      `${this.props.imagePath}${this.props.resolution}${data.portrait_image}`, 
      `${this.props.imagePath}${this.props.resolution}${data.landscape_image}`, 
    ]

    const signInAlertArgs = [
      `Please <b>Sign In</b><br/>
		  Woops! Gonna sign in first!<br/>
      Only a click away and you<br/>
      can continue to enjoy<br/>
      <b>RCTI+</b>`,
      "",
      () => {},
      true,
      "Sign Up",
      "Sign In",
      true,
      true
    ]

		switch (data.content_type) {
			case 'special':
				contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_special_event_clicked')
				let url = data.url ? data.url : data.link;
				if (data.mandatory_login && this.props.user.isAuth) {
					url += this.props.token;
				}

				try {
					jwtDecode(this.props.token);
					if (data.mandatory_login && !this.props.user.isAuth) {
						showSignInAlert(...signInAlertArgs)
					}
					else {
						this.handleActionClick(data, url)
					}
				}
				catch (e) {
					if (data.mandatory_login && !this.props.user.isAuth) showSignInAlert(...signInAlertArgs)
				}
				break;

			case 'program':
				homeProgramClicked(
          this.props.title,
          data.program_id,
          data.program_title ? data.program_title : 'N/A',
          data.genre ? data.genre : 'N/A',
          `${this.props.imagePath}${this.props.resolution}${data.portrait_image}`,
          `${this.props.imagePath}${this.props.resolution}${data.landscape_image}`,
          'mweb_homepage_program_clicked'
        )
				Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}?ref=homepage&homepage_title=${this.props.title}`);
				break;

			case 'live':
				contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_live_event_clicked')
				Router.push(`/live-event/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${this.props.title}`);
				break;

			default:
				contentGeneralEvent(...contentGeneralEventArgs, 'mweb_homepage_content_clicked')
				Router.push(`/programs/${data.program_id}/${urlRegex(data.program_title)}/${data.content_type}/${data.content_id}/${urlRegex(data.content_title)}?ref=homepage&homepage_title=${this.props.title}`);
				break;
		}
	}

	loadMore() {
    if (this.state.loading || this.state.endpage) return

    const page = this.state.page + 1;
    this.setState({ loading: true }, () => {
      this.props.loadingBar.continuousStart();

      this.props.getHomepageContents(this.state.id, 'mweb', page, this.state.length)
        .then(response => {
          if (response.status === 200 && response.data.status.code === 0) {
            this.setState({
              loading: false,
              contents: [ ...this.state.contents, ...response.data.data ],
              endpage: response.data.data.length < this.state.length,
              page,
            });
          }
          else {
            this.setState({ loading: false });
          }
        })
        .catch(_ => this.setState({ loading: false, endpage: true }))
        .finally(_ => this.props.loadingBar.complete())
    });
	}

	render() {
    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    const rootImageUrl = `${this.props.imagePath}${this.props.resolution}`
		return (
			<div
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
        className="pnl_square">
				<h2 className="content-title">
          {this.props.title}
        </h2>
        <BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
					{scrollRef => (
						<div ref={scrollRef} className="swiper-container">
              {this.state.contents.map((c, i) => (
                <div
                  style={{ width: '96%' }}
                  onClick={() => this.link(c)}
                  key={`${this.state.id}-${i}-square`}
                  className="swiper-slide">
                  <div>
                    <Img 
                      alt={c.program_title || c.content_title} 
                      unloader={<img src={placeHolderImgUrl} />}
                      loader={<img src={placeHolderImgUrl} />}
                      src={[`${rootImageUrl}${c.square_image}`, placeHolderImgUrl]} />
                  </div>
                </div>
              ))}
						</div>
          )}
        </ BottomScrollListener>
			</div>
		);
	}
}

export default connect(state => state, contentActions)(SquareImage);

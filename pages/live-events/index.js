import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import { Offline, Online } from "react-detect-offline";

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';
import Thumbnail from '../../components/Includes/Common/Thumbnail';

// redux
import liveAndChatActions from '../../redux/actions/liveAndChatActions';
import pageActions from '../../redux/actions/pageActions';
import { getCountdown } from '../../utils/helpers';
import { RESOLUTION_IMG } from '../../config';
import NavDefault_v2 from '../../components/Includes/Navbar/NavDefault_v2';
import ErrorIcon from '../../components/Includes/Common/ErrorLiveEvent';

import { Container, Row, Col, Button } from 'reactstrap';
import '../../assets/scss/components/live-event.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      live_event : [],
      missed_event: [],
      meta : '',
    };
  }
  componentDidMount() {
    this.getAllLiveEvent();
  }
  getAllLiveEvent() {
    this.props.setPageLoader();
    this.props.getAllLiveEvent().then((res) => {
      this.props.unsetPageLoader();
    })
    .catch((err) => {
      this.props.unsetPageLoader();
    });
  }
  getLink(data, params = 'live-event', tabName) {
    Router.push(`/${params}/${data.id}/${data.content_name.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}?tab_name=${tabName}`);
  }

  errorEvent() {
    return (<Col xs="12" key="1" className="le-error">
    {/* <img className="le-error-img" src={errorIcon()} alt="error-live-event" /> */}
      <div className="le-error-img">
        <ErrorIcon />
      </div>
     <p>Ups! No Data Found</p>
     <Button className="le-error-button" onClick={() => this.props.router.push('/live-event')}>Try Again</Button>
  </Col>);
  }
  liveEventNow() {
    return (
      this.props.liveEvent?.data?.now_playing_event?.data?.map((list, i) => {
        return (
          <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event', 'now-playing')}>
            <Thumbnail
            dateEvent={list.live_at}
            key={list.content_id + list.content_title}
            label="Live"
            backgroundColor="#fa262f"
            statusPlay={false}
            statusLabel="1"
            statusTimer="1"
            src={`${this.props.liveEvent?.data?.now_playing_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
          </Col>
        );
      })
    );
  }
  upcomingEvent() {
    return (
      this.props.liveEvent?.data?.upcoming_event?.data?.map((list, i) => {
        return (
          <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event', 'upcoming-events')}>
            <Thumbnail
            dateEvent={list.live_at}
            key={list.content_id + list.content_title}
            label="Live"
            timer={getCountdown(list.live_at, list.current_date)[0]}
            timerCurrent={list.current_date}
            statusPlay={getCountdown(list.live_at, list.current_date)[1]}
            backgroundColor="#fa262f"
            statusLabel="1"
            statusTimer="1"
            src={`${this.props.liveEvent?.data?.upcoming_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
          </Col>
        );
      })
    );
  }
  missedEvent() {
    return (
      this.props.liveEvent?.data?.past_event?.data?.map((list, i) => {
        return (
          <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'past-event', 'past-events')}>
            <Thumbnail
            key={list.content_id + list.content_title}
            label="Live"
            backgroundColor="#fa262f"
            statusLabel="0"
            statusTimer="0"
            src={`${this.props.liveEvent?.data?.past_event?.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.name}/>
          </Col>
        );
      })
    );
  }

  render() {
    return (
      <Layout title={this.props.router.asPath.match('past-event') ? 'Past events - RCTI+' : 'Live event - RCTI+'}>
        <Head>
          <meta name="description" content={this.props.router.asPath.match('past-event') ? 'Past events' : 'Live event'}/>
        </Head>
        {/* <NavBack title="Live Event"/> */}
        {process.env.UI_VERSION == '2.0' ? (<NavDefault_v2 disableScrollListener />) : (<NavDefault disableScrollListener />)}
        <div id="live-event" className="le-container">
        {/* <div className="le-absolute-center">
            <ErrorIcon />
        </div> */}
        <Online>
        {
          this.props.liveEvent?.loading_live_event ? (<div />) :
          this.props.liveEvent?.error_live_event ? (<div className="le-full__error">{ this.errorEvent() }</div>) : (<div />)
        }
        { this.props.liveEvent?.data?.now_playing_event?.data?.length > 0 ? (
          <section className="le-live">
            <div className="le-title">
              <h1>Now Playing</h1>
            </div>
            <Container>
              <Row>
                { this.liveEventNow()}
              </Row>
            </Container>
          </section>
        ) : (<div />)}
        { this.props.liveEvent?.data?.upcoming_event?.data?.length > 0 ? (
          <section className="le-live">
            <div className="le-title">
              <h1>Upcoming Events</h1>
            </div>
            <Container>
              <Row>
                {this.upcomingEvent()}
              </Row>
            </Container>
          </section>
        ) : (<div />)}
        { this.props.liveEvent?.data?.past_event?.data?.length > 0 ? (
          <section className="le-missed_event">
            <div className="le-title">
              <h1>Past Events</h1>
            </div>
            <Container>
              <Row>
                { this.missedEvent() }
              </Row>
            </Container>
          </section>
        ) : (<div />)}
        </Online>
        <Offline>
          <div className="le-absolute-center">
            { this.errorEvent() }
          </div>
        </Offline>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    liveEvent: state.chats,
  };
};
export default connect(mapStateToProps, {
  ...liveAndChatActions,
  ...pageActions,
})(withRouter(Index));

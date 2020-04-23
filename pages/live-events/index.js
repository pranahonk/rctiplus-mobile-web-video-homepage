import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';
import Thumbnail from '../../components/Includes/Common/Thumbnail';
import LiveIcon from '../../components/Includes/Common/LiveIcon';

// redux
import liveAndChatActions from '../../redux/actions/liveAndChatActions';
import pageActions from '../../redux/actions/pageActions';

import { Container, Row, Col } from 'reactstrap';
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
    this.getLiveEvent();
    this.getMissedEvent();
  }
  getLiveEvent() {
    this.props.setPageLoader();
    this.props.getLiveEvent('non on air')
    .then(({data: lists}) => {
      this.setState({
        live_event: lists.data,
        meta: lists.meta,
      });
      console.log(lists);
      this.props.unsetPageLoader();
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getMissedEvent() {
    this.props.setPageLoader();
    this.props.getMissedEvent()
    .then(({data: lists}) => {
      this.setState({
        missed_event: lists.data,
      });
      console.log(lists);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getLink(data, params = 'live-event') {
    Router.push(`/${params}/${data.content_id}/${data.content_title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}`);
  }
  getTimer(value) {
    const time = new Date();
    const date = new Date(parseInt(value) * 1000);
    const resultTime = Math.floor((date.getTime() - time.getTime()) / 1000);
    if ((date.getTime() > time.getTime())) {
      return resultTime;
    }
    return 0;
  }
  getDetailEvent() {
    console.log(this.state.live_event)
    if (this.state.live_event === 0) {
      return (
        <Col xs="12" key="1" className="le-error">
          <LiveIcon />
          <p>Ups! No Data Found</p>
          <p>content isn't available right now</p>
        </Col>
      );
    }
    this.state.live_event.map((list, i) => {
      return (
        <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event')}>
          <Thumbnail
          label="Live"
          timer={this.getTimer(list.release_date_quiz)}
          backgroundColor="#fa262f"
          statusLabel="1"
          statusTimer="1"
          src={`${this.state.meta.image_path}/250/${list.landscape_image}`} alt={list.name}/>
        </Col>
      );
    });
  }

  render() {
    let liveEvent = this.state.live_event.map((list, i) => {
      return (
        <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event')}>
          <Thumbnail
          label="Live"
          timer={this.getTimer(list.release_date_quiz)}
          backgroundColor="#fa262f"
          statusLabel="1"
          statusTimer="1"
          src={`${this.state.meta.image_path}/250/${list.landscape_image}`} alt={list.name}/>
        </Col>
      );
    });
    let missedEvent = this.state.missed_event.map((list, i) => {
      return (
        <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'missed-event')}>
          <Thumbnail
          label="Live"
          backgroundColor="#fa262f"
          statusLabel="0"
          statusTimer="0"
          src={`${this.state.meta.image_path}/250/${list.landscape_image}`} alt={list.name}/>
        </Col>
      );
    });
    let errorEvent = (<Col xs="12" key="1" className="le-error">
          <LiveIcon />
          <p>Ups! No Data Found</p>
          <p>content isn't available right now</p>
        </Col>
      );
    return (
      <Layout title="Live event - RCTI+">
        <Head>
          <meta name="description" content="LALALALA"/>
        </Head>
        <NavBack title="Live Event"/>
        <div id="live-event" className="le-container">
          <section className="le-live">
            <div className="le-title">
              <h1>Live Event</h1>
            </div>
            <Container>
              <Row>
                { this.state.live_event.length > 0 ? liveEvent : errorEvent }
              </Row>
            </Container>
          </section>
          <section className="le-missed_event">
            <div className="le-title">
              <h1>Missed Event</h1>
            </div>
            <Container>
              <Row>
                { this.state.missed_event.length > 0 ? missedEvent : errorEvent }
              </Row>
            </Container>
          </section>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, {
  ...liveAndChatActions,
  ...pageActions,
})(withRouter(Index));

import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import Layout from '../../components/Layouts/Default_v2';
import Thumbnail from '../../components/Includes/Common/Thumbnail';
import LiveIcon from '../../components/Includes/Common/LiveIcon';

// redux
import liveAndChatActions from '../../redux/actions/liveAndChatActions';
import pageActions from '../../redux/actions/pageActions';
import { getCountdown } from '../../utils/helpers';
import { GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG, SITE_NAME, SITEMAP } from '../../config';
import NavDefault_v2 from '../../components/Includes/Navbar/NavDefault_v2';

import { Col, Container, Row } from 'reactstrap';
import '../../assets/scss/components/live-event.scss';
import { gaVideoInteraction } from '../../utils/ga-360';

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
    this.props.setSeamlessLoad(true);
    this.props.setPageLoader();
    this.props.getLiveEvent('non on air')
    .then(({data: lists}) => {
      this.props.setSeamlessLoad(false);
      this.props.unsetPageLoader();
      this.setState({
        live_event: lists.data,
        meta: lists.meta,
      });
      console.log(lists)
    })
    .catch((error) => {
      this.props.setSeamlessLoad(false);
      this.props.unsetPageLoader();
      console.log(error);
    });
  }
  getMissedEvent() {
    this.props.setSeamlessLoad(true);
    this.props.setPageLoader();
    this.props.getMissedEvent()
    .then(({data: lists}) => {
      this.props.setSeamlessLoad(false);
      this.props.unsetPageLoader();
      this.setState({
        missed_event: lists.data,
        meta: lists.meta,
      });
    })
    .catch((error) => {
      this.props.setSeamlessLoad(false);
      this.props.unsetPageLoader();
      console.log(error);
    });
  }
  getLink(data, params = 'live-event') {
    gaVideoInteraction(data?.content_id, data?.content_title,
      "video | live event", data?.content_type ,
      "not_available", "not_available",
      data?.id, data?.assets_name, "not_available",
      "not_available", "not_available",
      data?.channel_code, "not_available", "not_available",
      "not_available", "not_available", "not_available",
      "no", "homepage_liveevent _clicked", "video_interaction",
      "video_click_content_list", data?.content_title);
     Router.push(`/${params}/${data.content_id}/${data.content_title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`);
  }

  render() {
    let liveEvent = this.state.live_event.map((list, i) => {
      return (
        <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'live-event')}>
          <Thumbnail
          key={list.content_id + list.content_title}
          isInteractive={list.is_interactive}
          label="Live"
          timer={getCountdown(list.release_date_quiz, list.current_date)[0]}
          timerCurrent={list.current_date}
          statusPlay={getCountdown(list.release_date_quiz, list.current_date)[1]}
          backgroundColor="#fa262f"
          statusLabel="1"
          statusTimer="1"
          src={`${this.state.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.content_title}/>
        </Col>

      );
    });
    let missedEvent = this.state.missed_event.map((list, i) => {
      return (
        <Col xs="6" key={i} onClick={this.getLink.bind(this, list, 'missed-event')}>
          <Thumbnail
          key={list.content_id + list.content_title}
          label="Live"
          backgroundColor="#fa262f"
          isInteractive='false'
          statusLabel="0"
          statusTimer="0"
          src={`${this.state.meta.image_path}${RESOLUTION_IMG}${list.landscape_image}`} alt={list.content_title}/>
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
      <Layout title={this.props.router.asPath.includes('/missed-event') ? SITEMAP.missed_event_index.title : SITEMAP.live_event_index.title}>
        <Head>
					  <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>
            <meta name="description" content={this.props.router.asPath.includes('/missed-event') ? SITEMAP.missed_event_index.description : SITEMAP.live_event_index.description} />
            <meta name="keywords" content={SITEMAP.live_event_index.keywords} />
            <meta property="og:title" content={this.props.router.asPath.includes('/missed-event') ? SITEMAP.missed_event_index.title : SITEMAP.live_event_index.title} />
            <meta property="og:image" itemProp="image" content={SITEMAP.live_event_index.image} />
            <meta property="og:url" content={REDIRECT_WEB_DESKTOP} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content='article' />
            <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
            <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
            <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
            <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
            <meta name="twitter:image" content={SITEMAP.live_event_index.image} />
            <meta name="twitter:title" content={this.props.router.asPath.includes('/missed-event') ? SITEMAP.missed_event_index.title : SITEMAP.live_event_index.title} />
            <meta name="twitter:image:alt" content="streaming rctiplus" />
            <meta name="twitter:description" content={this.props.router.asPath.includes('/missed-event') ? SITEMAP.missed_event_index.description : SITEMAP.live_event_index.description} />
            <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
            <meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
        </Head>
        {/* <NavBack title="Live Event"/> */}
        {process.env.UI_VERSION == '2.0' ? (<NavDefault_v2 disableScrollListener />) : (<NavDefault disableScrollListener />)}
        <div id="live-event" className="le-container">
          {this.state.live_event.length > 0 || this.state.missed_event.length > 0 ?
            (<div>
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
              </div>)
              : this.props.pages.status
              ? (<div />)
              : (<div className="le-full__error">
                  { errorEvent }
                </div>)
          }
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, {
  ...liveAndChatActions,
  ...pageActions,
})(withRouter(Index));

import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';
import Thumbnail from '../../components/Includes/Common/Thumbnail';

import { Container, Row, Col } from 'reactstrap';
import '../../assets/scss/components/live-event.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                <Col xs="6">
                  <Thumbnail label="Live" timer="1000000000" backgroundColor="#fa262f" statusLabel="1" statusTimer="1" src="https://rc-statsfsdfic.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" timer="1000000000" backgroundColor="#fa262f" statusLabel="1" statusTimer="1" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" timer="1000000000" backgroundColor="#fa262f" statusLabel="1" statusTimer="1" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" timer="10000" backgroundColor="#fa262f" statusLabel="1" statusTimer="1" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
              </Row>
            </Container>
          </section>
          <section className="le-missed_event">
            <div className="le-title">
              <h1>Missed Event</h1>
            </div>
            <Container>
              <Row>
                <Col xs="6">
                  <Thumbnail label="Live" backgroundColor="#fa262f" statusLabel="0" statusTimer="0" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" backgroundColor="#fa262f" statusLabel="0" statusTimer="0" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" backgroundColor="#fa262f" statusLabel="0" statusTimer="0" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" backgroundColor="#fa262f" statusLabel="0" statusTimer="0" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
                <Col xs="6">
                  <Thumbnail label="Live" backgroundColor="#fa262f" statusLabel="0" statusTimer="0" src="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg" alt="https://rc-static.rctiplus.id/media/250/files/fta_rcti/Landscape/4_anak_rantau/anakrantau_landscape.jpg"/>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </Layout>
    );
  }
}

export default connect(state => {})(withRouter(Index));

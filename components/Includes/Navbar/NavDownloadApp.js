import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import { getCookie, removeCookie } from '../../../utils/cookie';
// import '../../../assets/scss/components/navbar.scss';
import { Button,  Row, Col } from 'reactstrap';

class NavDownloadApp extends Component {
  render() {
    return (
        <div className="topDownload">
          <Row>
            <Col xs="1">
              <img className="logo-close" src="/static/btn/close@2x.png" />
            </Col>
			<Col xs="7">
              <img className="logo-topDownload" src="/static/logo/rcti-sm.png" alt="Logo RCTI+"/>
			  <div className="topDownload-txt">Lebih asyik nonton dengan aplikasi RCTI+</div>
			  </Col>
            <Col xs="4">
              <Button color="danger">Install</Button>
            </Col>
          </Row>
        </div>
    );
  }
}
export default connect(state => state, actions)(NavDownloadApp);

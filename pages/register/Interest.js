import React, { Component } from 'react';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBackInterest';

//load reactstrap components
import { Button, Form, FormGroup, Row, Col } from 'reactstrap';

export default class Interest extends Component {
  render() {
    return (
      <Layout title="Your Interest">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <div className="choose_interest">
              <p className="txt-content-interest">
                <h2>Welcome, </h2>
                Thank you, your account has been successfully registered.
                <br /> <br />
                Help us, select 3 category interests:
              </p>

              <div className="interest-list">
                <FormGroup className="ls-inter">
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                  <Row className="list-detail-interest">
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                    <Button outline color="secondary" xs="6">
                      secondary
                    </Button>
                  </Row>
                </FormGroup>
              </div>
              <FormGroup className="btn-next-position">
                <Button className="btn-next">Save</Button>
              </FormGroup>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

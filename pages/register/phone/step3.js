import React, { Component } from 'react';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBackInterest';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';

export default class Step1 extends Component {
  render() {
    return (
      <Layout title="Register Step 1">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <div className="imgSuccess">
              <h3>
                Thank You For <br /> Registration
              </h3>
              <img className="icn_success" src="/static/icons/success.png" />
            </div>
          </div>
        </div>

        <FormGroup className="btn-next-position">
          <Button className="btn-next">NEXT</Button>
        </FormGroup>
      </Layout>
    );
  }
}

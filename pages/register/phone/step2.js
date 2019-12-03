import React, { Component } from 'react';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBackVerification';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';

export default class Step1 extends Component {
  render() {
    return (
      <Layout title="Register Step 1">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <Form>
              <FormGroup>
                <Input
                  className="inpt-form-token-code"
                  type="number"
                  name="token_code_1"
                  id="token_code_1"
                  maxLength="1"
                  max="1"
                />

                <Input
                  className="inpt-form-token-code "
                  type="number"
                  name="token_code_2"
                  id="token_code_2"
                  maxLength="1"
                  max="1"
                />

                <Input
                  className="inpt-form-token-code "
                  type="number"
                  name="token_code_3"
                  id="token_code_3"
                  maxLength="1"
                  max="1"
                />
                <Input
                  className="inpt-form-token-code "
                  type="number"
                  name="token_code_4"
                  id="token_code_4"
                  maxLength="1"
                  max="1"
                />
              </FormGroup>

              <FormGroup>
                <label className="lbl_rsndcode">
                    Resend code <span className="time-resendcode">00:45</span>
                </label>
              </FormGroup>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

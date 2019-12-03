import React, { Component } from 'react';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBackVerification';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Step1 extends Component {
  render() {
    return (
      <Layout title="Register Step 1">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <Form>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  className="inpt-form"
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Insert your fullname"
                />
              </FormGroup>
              <FormGroup>
                <Label>Birth Date</Label>
                <Input
                  className="inpt-form "
                  type="text"
                  name="birthdate"
                  id="BirthDate"
                />
              </FormGroup>
              <FormGroup>
                <Label>Gender</Label>
                <Input
                  className="inpt-form "
                  type="text"
                  name="gender"
                  id="gender"
                />
              </FormGroup>

              <FormGroup className="btn-next-position">
                <Button className="btn-next">NEXT</Button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

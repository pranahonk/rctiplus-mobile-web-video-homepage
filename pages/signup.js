import React from 'react';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import NavBack from '../components/NavBack';
import TabSignup from '../components/TabSignup';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Signup extends React.Component {
  static getInitialProps(ctx) {
    initialize(ctx);
  }

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email_id: '',
      mobile_no: '',
      password: '',
      confirm_password: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.register(
      {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email_id: this.state.email_id,
        mobile_no: this.state.mobile_no,
        password: this.state.password,
        confirm_password: this.state.confirm_password,
      },
      'register',
    );
  }

  render() {
    return (
      <Layout title="Sign Up">
        <NavBack />
        <div className="login-box">
          <Form>
            <TabSignup />
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                className="inpt-form"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
              />
            </FormGroup>
            <Button className="btn-next">NEXT</Button>
            <p class="text-center">
              Have an account?{' '}
              <a href="/signin" class="text-red">
                Sign In
              </a>{' '}
              here
            </p>
          </Form>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, actions)(Signup);

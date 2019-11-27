import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import Layout from '../components/Templates/Layout';
import NavBack from '../components/Nav/NavBack';
import { Button, Form, FormGroup, Label, Input, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { getCookie } from '../utils/cookie';

import '../assets/scss/login.scss';

class Signin extends React.Component {
  static getInitialProps(ctx) {
    initialize(ctx);
  }

  constructor(props) {
    super(props);
    this.state = {
      emailphone: 'user.test@rctiplus.com',
      password: 'user.123',
      is_password_invalid: false,
      view_raw: false
    };

    const token = getCookie('ACCESS_TOKEN');
    if (token) {
      Router.push('/');
    }
  }

  componentDidMount() {
    this.props.test();
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = {
      emailphone: this.state.emailphone,
      password: this.state.password,
    };
    this.props.login(data).then(response => {
      console.log(this.props.authentication);
      if (this.props.authentication.data != null && this.props.authentication.data.status.code === 0) {
        Router.push('/');
      }
      else {
        this.setState({ is_password_invalid: true });
      }
    });
  }

  togglePassword(e) {
    e.preventDefault();
    this.setState({ view_raw: !this.state.view_raw });
  }

  render() {
    return (
      <Layout title="Sign In">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <h3>Sign In</h3>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup>
                <Label for="email">Email or Phone Number</Label>
                <Input
                  className="inpt-form"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter email or phone number"
                  defaultValue={this.state.emailphone}
                  onChange={e => this.setState({ emailphone: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <InputGroup>
                  <Input
                    className="inpt-form"
                    type={this.state.view_raw ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    defaultValue={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                    invalid={this.state.is_password_invalid}
                  />
                  <div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye')}></div>
                  <FormFeedback>Wrong password, please try again</FormFeedback>
                </InputGroup>
              </FormGroup>
              <p className="text-center">
                <a href="/forgot-password" className="text-white fnt-12">
                  Forgot Password?
                </a>
              </p>
              <Button className="btn-next">Login</Button>
              <p className="text-center">
                Dont have an account?
                <a href="/signup" className="text-red fnt-12">
                  Sign up
                </a>
                here
              </p>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, actions)(Signin);

import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavBack from '../components/Includes/Navbar/NavBack';

//load signin scss
import '../assets/scss/components/signin.scss';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class Signin extends React.Component {
  static getInitialProps(ctx) {
    initialize(ctx);
  }

  constructor(props) {
    super(props);
    this.state = {
      emailphone: '',
      password: '',
      is_password_invalid: false,
    };
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
      if (this.props.authentication.code === 7) {
        this.setState({ is_password_invalid: true });
      }
    });
  }

  render() {
    return (
      <Layout title="Sign In">
        <NavBack />
        <div className="wrapper-content">
          <div className="login-box">
            <Form>
              <FormGroup>
                <Label for="email">Email or Phone Number</Label>
                <Input
                  className="inpt-form"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter email or phone number"
                />
              </FormGroup>
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

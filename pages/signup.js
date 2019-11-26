import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavBack from '../components/Includes/Navbar/NavBack';

//load tab signup 
import TabSignup from '../components/Includes/Tab/TabSignup';

//load reactstrap components
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
			<FormGroup>
              <Label for="password">Re-Type Password</Label>
              <Input
                className="inpt-form"
                type="password"
                name="password2"
                id="password2"
                placeholder="Re-Type Password"
              />
            </FormGroup>
            <Button className="btn-next">NEXT</Button>
			<p className="text-center fnt-10 el-margin-20 el-white">By clicking the Sign Up button, you agree to our 
			<a href="/terms-&amp;-conditions" className="text-red fnt-11">Terms &amp; Conditions</a> and <a href="/privacy-policy" className="text-red fnt-11">Privacy Policy</a></p>
            <p className="text-center fnt-12">
              Have an account ? 
              <a href="/signin" className="text-red">
                Sign In 
              </a>
              here
            </p>
          </Form>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, actions)(Signup);

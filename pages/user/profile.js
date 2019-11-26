import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Templates/Layout';
import Nav from '../../components/Nav/NavDefault';
import TabSignup from '../../components/Tab/TabSignup';
import actions from '../../redux/actions';
import initialize from '../../utils/initialize';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

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
        <Nav />
        <div>
          <div className="header-user-profile">
            <i className="fas fa-user-circle fa-2x"></i>
            <span className="header-user-profle-title">User Name</span>
          </div>
          <ListGroup>
            <ListGroupItem tag="a" href="/user/detail-points" action>
              Points
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/history" action>
              <i class="fas fa-history"></i> History
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/download" action>
              <i class="fas fa-download"></i> Download
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/my-list" action>
              <i class="fas fa-list"></i> My List
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/continue-watching" action>
              <i class="far fa-clock"></i> Continue Watching
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/term&cond" action>
            <i class="fas fa-exclamation-circle"></i>  Term & Conditions
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/privacy-policy" action>
            <i class="fas fa-lock"></i>  Privacy Policy
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/help" action>
            <i class="far fa-comment-alt"></i>  Help
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/faq" action>
            <i class="far fa-question-circle"></i>  FAQ
            </ListGroupItem>
			<ListGroupItem tag="a" href="/user/faq" action>
            <center>Version 1.2</center>
            </ListGroupItem>
          </ListGroup>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, actions)(Signup);

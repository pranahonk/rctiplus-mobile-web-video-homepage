import React from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import initialize from '../../utils/initialize';

//load default layout
import Layout from '../../components/Layouts/Default_v2';

//load navbar default
import Nav from '../../components/Includes/Navbar/NavDefault';

//load reactstrap
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

class Profile extends React.Component {
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
              <i className="fas fa-history"></i> History
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/download" action>
              <i className="fas fa-download"></i> Download
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/my-list" action>
              <i className="fas fa-list"></i> My List
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/continue-watching" action>
              <i className="far fa-clock"></i> Continue Watching
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/term&cond" action>
            <i className="fas fa-exclamation-circle"></i>  Term & Conditions
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/privacy-policy" action>
            <i className="fas fa-lock"></i>  Privacy Policy
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/help" action>
            <i className="far fa-comment-alt"></i>  Help
            </ListGroupItem>
            <ListGroupItem tag="a" href="/user/faq" action>
            <i className="far fa-question-circle"></i>  FAQ
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

export default connect(state => state, actions)(Profile);

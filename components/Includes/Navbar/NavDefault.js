import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import { getCookie, removeCookie } from '../../../utils/cookie';
import '../../../assets/scss/components/navbar.scss';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

class NavbarDef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie('ACCESS_TOKEN'),
    };
  }

  signOut() {
    const deviceId = 1;
    console.log(getCookie('ACCESS_TOKEN'));
    this.props
      .logout(deviceId)
      .then(() => {
        Router.push('/signin');
      })
      .catch(error => {
        removeCookie('ACCESS_TOKEN');
      });
  }

  render() {
    return (
      <Navbar expand="md">
        <div className="left-top-link">
          <div className="logo-top-wrapper">
            <NavbarBrand href="/">
              <img className="logo-top" src="/static/logo/rcti.png" />
            </NavbarBrand>
          </div>
        </div>
        <div className="right-top-link">
          <div className="btn-link-top-nav">
            {this.state.token ? (
              <NavbarBrand onClick={this.signOut.bind(this)} href="#">
                Sign Out
              </NavbarBrand>
            ) : (
              <NavbarBrand href="/signin">Sign In</NavbarBrand>
            )}
            <NavbarBrand href="/explore">
              <i className="fas fa-search" aria-hidden></i>
            </NavbarBrand>
          </div>
        </div>
      </Navbar>
    );
  }
}
export default connect(state => state, actions)(NavbarDef);

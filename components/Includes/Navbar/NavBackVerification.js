import React, { Component } from 'react';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

class NavBackVerification extends Component {
  render() {
    return (
      <Navbar expand="md">
        <div className="top-link">
          <div className="logo-top-wrapper">
            <NavbarBrand href="/">
              <i className="fas fa-arrow-left" aria-hidden></i>
            </NavbarBrand>
          </div>
        </div>
        <div className="header-nav-verif"> Verification</div>
      </Navbar>
    );
  }
}
export default NavBackVerification;

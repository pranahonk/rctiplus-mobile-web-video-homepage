import React, { Component } from 'react';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

class NavbarDef extends Component {
  render() {
    return (
      <Navbar expand="md">
        <div className="left-top-link">
          <div className="logo-top-wrapper">
            <NavbarBrand href="/">
              <i className="fas fa-arrow-left" aria-hidden></i>
            </NavbarBrand>
          </div>
        </div>
      </Navbar>
    );
  }
}
export default NavbarDef;

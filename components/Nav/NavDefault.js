import React, { Component, Children } from 'react';

/*
 *load reactstrap
 *start here
 */
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
/*
 *load reactstrap
 *end here
 */
class NavbarDef extends Component {
  render() {
    return (
      <Navbar color="dark" dark expand="md">
        <div className="left-top-link">
          <div className="logo-top-wrapper">
            <NavbarBrand href="/">
              <img className="logo-top" src="/static/logo/rcti.png" />
            </NavbarBrand>
          </div>
        </div>
        <div className="right-top-link">
          <div className="btn-link-top-nav">
            <NavbarBrand href="/signin">Sign In</NavbarBrand>
            <NavbarBrand href="/explore"><i class="fas fa-search"></i></NavbarBrand>
          </div>
        </div>
      </Navbar>
    );
  }
}
export default NavbarDef;

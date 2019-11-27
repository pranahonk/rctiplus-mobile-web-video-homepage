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
			        <i className="fas fa-arrow-left" aria-hidden></i>
            </NavbarBrand>
          </div>
        </div>
      </Navbar>
    );
  }
}
export default NavbarDef;

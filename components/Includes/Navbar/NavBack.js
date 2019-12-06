import React, { Component } from 'react';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class NavbarDef extends Component {
	render() {
		return (
			<Navbar expand="md" className="nav-container nav-shadow">
				<div className="left-top-link">
					<div className="logo-top-wrapper">
						<NavbarBrand href="/" style={{ color: 'white' }}>
							<ArrowBackIcon />
						</NavbarBrand>
					</div>
				</div>
			</Navbar>
		);
	}
}
export default NavbarDef;

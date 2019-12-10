import React, { Component } from 'react';
import Router from 'next/router';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class NavBackVerification extends Component {
	render() {
		return (
			<Navbar expand="md" className="nav-container nav-shadow">
				<div className="top-link">
					<div className="logo-top-wrapper">
						<NavbarBrand onClick={() => Router.back()} style={{ color: 'white' }}>
							<ArrowBackIcon />
						</NavbarBrand>
					</div>
				</div>
				<div className="header-nav-verif">
					<p>Verification</p>
				</div>
			</Navbar>
		);
	}
}
export default NavBackVerification;

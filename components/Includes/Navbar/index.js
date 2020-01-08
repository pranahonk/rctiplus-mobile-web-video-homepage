import React, { Component } from 'react';
import Router from 'next/router';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StatusNotification from './StatusNotification';

class AppNavbar extends Component {
	render() {
		return (
			<div className="nav-fixed-top">
				<Navbar expand="md" className="nav-container nav-shadow">
					<div className="top-link">
						<div className="logo-top-wrapper">
							<NavbarBrand onClick={() => Router.back()} style={{ color: 'white' }}>
								<ArrowBackIcon/>
							</NavbarBrand>
						</div>
					</div>
					<div className="header-nav-verif">
						<p>{this.props.title}</p>
					</div>
				</Navbar>
				<StatusNotification/>
			</div>
		);
	}
}
export default AppNavbar;

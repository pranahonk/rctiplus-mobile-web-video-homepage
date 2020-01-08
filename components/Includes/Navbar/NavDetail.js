import React, { Component } from 'react';
import Router from 'next/router';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

import '../../../assets/scss/components/navbar.scss';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StatusNotification from './StatusNotification';

class NavbarDetail extends Component {

    constructor(props) {
		super(props);
		this.state = {
			is_top: true
		};
	}

    componentDidMount() {
		document.addEventListener('scroll', () => {
			const isTop = window.scrollY < 150;
			if (isTop !== this.state.is_top) {
				this.setState({ is_top: isTop });
			}
		});
	}

	render() {
		return (
			<div className="nav-home-container nav-fixed-top">
				<Navbar expand="md" className={'nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
					<div className="top-link">
						<div className={'logo-top-wrapper ' + (this.state.is_top ? 'back-arrow-transparent' : '')}>
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
export default NavbarDetail;

import React, { Component } from 'react';
import Router from 'next/router';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

import Checkmark from '../../../components/Includes/Common/Checkmark';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';

export default class Step1 extends Component {

	goToHome() {
		console.log('Go to home');
		Router.push('/register/Interest');
	}

	render() {
		return (
			<Layout title="Registration Completed">
				<NavBack title="Verification" />
				<div className="wrapper-content">
					<div style={{ textAlign: 'center', marginTop: 65 }}>
						<h4 style={{ marginBottom: 45 }}>
							<strong>Thank You</strong><br />
							for Registration.
						</h4>
						<Checkmark />
					</div>
					<FormGroup className="btn-next-position" style={{ marginTop: 50, width: '80%', margin: '50px auto' }}>
						<Button id="button-next-verification" onClick={this.goToHome.bind(this)} className="btn-next">Done</Button>
					</FormGroup>
				</div>
			</Layout>
		);
	}
}

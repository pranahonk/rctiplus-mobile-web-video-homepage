import React, { Component } from 'react';
import Router from 'next/router';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

import Checkmark from '../../../components/Includes/Common/Checkmark';

//load reactstrap components
import { Button, FormGroup } from 'reactstrap';

export default class VerificationSuccess extends Component {

	goToEditProfile() {
		Router.push('/user/edit-profile');
    }
    
    componentDidMount() {
        setTimeout(() => this.goToEditProfile(), 4000);
    }

	render() {
		return (
			<Layout title="Registration Completed">
				<NavBack title="Verification" />
				<div className="wrapper-content">
					<div style={{ textAlign: 'center', marginTop: 65 }}>
						<h4 style={{ marginBottom: 45 }}>
							<strong>Thank You</strong><br />
							Verification is successful.
						</h4>
						<Checkmark />
					</div>
					<FormGroup className="btn-next-position" style={{ marginTop: 50, width: '80%', margin: '50px auto' }}>
						<Button onClick={this.goToEditProfile.bind(this)} className="btn-next">Done</Button>
					</FormGroup>
				</div>
			</Layout>
		);
	}
}

import React, { Component } from 'react';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBackVerification from '../../../components/Includes/Navbar/NavBackVerification';

//load reactstrap components
import { Button, Form, FormGroup } from 'reactstrap';

import ReactCodeInput from 'react-verification-code-input';
import Countdown from 'react-countdown-now';
import '../../../assets/scss/components/signup.scss';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default class Step1 extends Component {

	constructor(props) {
		super(props);
		this.state = {
			otp: ''
		};
	}

	submitOtp(e) {
		e.preventDefault();
		console.log(this.state.otp);
	}

	componentDidMount() {
		Swal.fire({
			title: 'OTP Limits',
			text: 'Carefully check your Email for verification code. You only have 3 attempts',
			showCancelButton: true,
			confirmButtonText: 'Not Now',
			cancelButtonText: 'Request New OTP',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn-next block-btn btn-primary-edit',
				cancelButton: 'btn-outline block-btn btn-link-edit',
				header: 'alert-header'
			},
			width: '85%'
		})
		.then(result => {
			// not now clicked
			if (!result.value) {
				console.log('request new otp');
			}
		});
	}

	render() {
		return (
			<Layout title="Register Step 2">
				<NavBackVerification />
				<div className="wrapper-content container" style={{ width: '100%' }}>
					<div className="login-box" style={{ width: '100%' }}>
						<p className="text-default-rcti">Verify your account, enter your code below</p>
						<p style={{ fontSize: 14 }} className="text-default-rcti">Verification code was sent via SMS to your phone number: <span style={{ color: 'white' }}>+62 822 7883 3803</span></p>
						<Form onSubmit={this.submitOtp.bind(this)}>
							<FormGroup>
								<ReactCodeInput
									fields={4}
									onChange={otp => this.setState({ otp: otp })}
									className="otp-input" />
							</FormGroup>
							<FormGroup>
								<label className="lbl_rsndcode">
									Resend code <Countdown
										date={Date.now() + 450000}
										renderer={({ hours, minutes, seconds, completed }) => (<span>{minutes}:<span className="time-resendcode">{seconds}</span></span>)}></Countdown>
								</label>
							</FormGroup>
							<FormGroup>
								<p className="text-default-rcti" style={{ fontSize: 12, textAlign: 'center' }}><span className="el-red">Change Phone Number</span> or <span className="el-red">Resend Code</span></p>
							</FormGroup>
							<FormGroup className="btn-next-position">
								<Button className="btn-next block-btn">Verify</Button>
							</FormGroup>
						</Form>
					</div>
				</div>
			</Layout>
		);
	}
}

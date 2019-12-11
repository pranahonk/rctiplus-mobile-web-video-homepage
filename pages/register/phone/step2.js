import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import registerActions from '../../../redux/actions/registerActions';
import notificationActions from '../../../redux/actions/notificationActions';
import { showConfirmAlert } from '../../../utils/helpers';



//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBackVerification from '../../../components/Includes/Navbar';

//load reactstrap components
import { Button, Form, FormGroup } from 'reactstrap';

import ReactCodeInput from 'react-verification-code-input';
import '../../../assets/scss/components/otp_steps.scss'; // TODO: kadang tidak ke-load

import Countdown, { zeroPad } from 'react-countdown-now';




class Step2 extends Component {

	constructor(props) {
		super(props);
		this.state = {
			otp: '',
			username: '',
			alert_message: 'Carefully check your Email for verification code. You only have 3 attempts',
			interval: 60,
			countdown_key: 0,
			current_time: Date.now()
		};

	}

	componentDidMount() {
		console.log(this.props.registration);
		this.setState({ username: this.props.registration.username }, () => {
			let username = this.state.username;
			if (this.props.registration.username_type === 'PHONE_NUMBER') {
				username = '62' + username;
			}
			this.props.getOtp(username);
		});
	}

	submitOtp(e) {
		e.preventDefault();
		let username = this.state.username;
		if (this.props.registration.username_type === 'PHONE_NUMBER') {
			username = '62' + username;
		}

		this.props.verifyOtp(username, this.state.otp)
			.then(response => {
				if (response.data.status.code != 0) {
					this.props.showNotification(response.data.status.message_client, false);
					setTimeout(() => {
						this.props.hideNotification();
					}, 5000);
				}
				else {
					this.props.register({
						username: username,
						password: this.props.registration.password,
						fullname: this.props.registration.fullname,
						gender: this.props.registration.gender,
						dob: this.props.registration.dob,
						otp: this.state.otp,
						device_id: '1'
					})
					.then(response => {
						Router.push('/register/Interest');
					})
					.catch(error => {
						if (error.status == 200) {
							this.props.showNotification(error.data.status.message_client, false);
							setTimeout(() => {
								this.props.hideNotification();
							}, 5000);
							if (error.data.status.code === 0) {
								Router.push('/register/Interest');
							}
						}
						
						console.log(error);
					});
					
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	showAlert() {
		let username = this.state.username;
		if (this.props.registration.username_type === 'PHONE_NUMBER') {
			username = '62' + username;
		}

		showConfirmAlert(this.state.alert_message, 'OTP Limits', () => {
			// code = 1 (please wait a minute)
			this.props.getOtp(username)
				.then(response => {
					let newState = {};
					if (response.status === 200 && response.data.status.message_client != 'You have reached maximum attempts. please, try again later after 1 hours') {
						newState = {
							current_time: Date.now(),
							countdown_key: this.state.countdown_key + 1
						};
					}

					newState['alert_message'] = response.data.status.message_client;
					this.setState(newState);
				})
				.catch(error => {
					console.log(error);
				});
		}, true, 'Not Now', 'Request New OTP');
	}

	render() {
		let text = 'Verification code was sent to your email';
		let username = this.state.username;

		if (this.props.registration.username_type === 'PHONE_NUMBER') {
			text = 'Verification code was sent via SMS to your phone number';
			let newUsername = '';
			for (let i = 0; i < username.length; i++) {
				newUsername += username[i];
				if (i == 2 || i == 6) {
					newUsername += ' ';
				}
			}

			username = '+62 ' + newUsername;
		}

		return (
			<Layout title="Register Step 2">
				<NavBackVerification title="Verification"/>
				<div className="wrapper-content" style={{ width: '100%', marginTop: 50 }}>
					<div className="login-box" style={{ width: '100%' }}>
						<p className="text-default-rcti">Verify your account, enter your code below</p>
						<p style={{ fontSize: 14 }} className="text-default-rcti">{text} <span style={{ color: 'white' }}>{username}</span></p>
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
										key={this.state.countdown_key}
										date={this.state.current_time + (this.state.interval * 1000)}
										renderer={({ hours, minutes, seconds, completed }) => {
											if (completed) {
												return (<p className="text-default-rcti" style={{ fontSize: 12, textAlign: 'center' }}><span className="el-red">Change Phone Number</span> or <span onClick={this.showAlert.bind(this)} className="el-red">Resend Code</span></p>);
											}

											return (<span>{zeroPad(minutes)}:<span className="time-resendcode">{zeroPad(seconds)}</span></span>);
										}}></Countdown>
								</label>
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

export default connect(state => state, {
	...registerActions,
	...notificationActions
})(Step2);
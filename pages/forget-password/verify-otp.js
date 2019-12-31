import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import ReactCodeInput from 'react-verification-code-input';
import Countdown, { zeroPad } from 'react-countdown-now';

import registrationActions from '../../redux/actions/registerActions';

import { showConfirmAlert } from '../../utils/helpers';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup } from 'reactstrap';

import '../../assets/scss/components/verify-otp-password.scss';


class VerifyOtp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            alert_message: 'Carefully check your Email for verification code. You only have 3 attempts',
            otp: '',
            interval: 60,
			countdown_key: 0,
            current_time: Date.now(),
            submit_message: '',
			is_submitting: false
        };
    }

    componentDidMount() {
        console.log(this.props.registration);
        this.setState({ username: this.props.registration.username }, () => {
            this.props.getOtp(this.state.username);
        });
    }

    submitOtp(e) {
        e.preventDefault();
        Router.push('/forget-password/change-password');
    }

    onChangeOtp(otp) {
        this.setState({ otp: otp }, () => {
            this.props.setOtp(this.state.otp);
        });
    }

    showAlert() {
        let username = this.state.username;
        console.log(username);
		showConfirmAlert(this.state.alert_message, 'OTP Limits', () => {
            this.props.getOtp(username)
                .then(response => {
                    let newState = {};
                    if (response.status === 200) {
                        newState = {
                            current_time: Date.now(),
                            countdown_key: this.state.countdown_key + 1
                        };
                    }
                })
                .catch(error => console.log(error));

        }, true, 'Not Now', 'Request New OTP');
    }

    render() {
        let text = 'Please enter verification code, <br>sent via email:';
		let username = this.state.username || '';

		let actionElement = null;
		if (this.state.is_submitting) {
			actionElement = <p className="text-default-rcti" style={{ textAlign: 'center', color: '#6dd400' }}>verifying...</p>;
		}
		else {
			actionElement = (
				<div>
					<p className="text-default-rcti" style={{ textAlign: 'center' }}>{this.state.submit_message}</p>
	
					<FormGroup>
						<label className="lbl_rsndcode">
							<Countdown
								key={this.state.countdown_key}
								date={this.state.current_time + (this.state.interval * 1000)}
								renderer={({ hours, minutes, seconds, completed }) => {
									if (completed) {
										return (<p className="text-default-rcti" style={{ textAlign: 'center' }}>did not receive any code<br/><span onClick={this.showAlert.bind(this)} className="el-red">send me code</span></p>);
									}
	
									return (<span>Resend code <span className="time-resendcode">{zeroPad(minutes)}:<span>{zeroPad(seconds)}</span></span></span>);
								}}></Countdown>
						</label>
					</FormGroup>
					<FormGroup className="btn-next-position">
						<Button className="btn-next block-btn">Verify</Button>
					</FormGroup>
				</div>
			);
		}
		

		if (this.props.registration.username_type === 'PHONE_NUMBER') {
			text = 'Please enter verification code, <br>sent via SMS:';
			let newUsername = '';
			for (let i = 0; i < username.length; i++) {
				newUsername += username[i];
				if (i == 2 || i == 6) {
					newUsername += ' ';
				}
			}

			username = '';
		}

        return (
            <Layout title="Verify OTP">
                <NavBack title="Verify OTP"/>
                <div className="container-box-c">
                    <p style={{ fontSize: 14 }} className="text-default-rcti" dangerouslySetInnerHTML={{__html: text}}></p>
                    <Form onSubmit={this.submitOtp.bind(this)}>
                        <FormGroup>
                            <ReactCodeInput
                                fields={4}
                                onChange={this.onChangeOtp.bind(this)}
                                className="otp-input-c" />
                        </FormGroup>
                        {actionElement}
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, registrationActions)(VerifyOtp);
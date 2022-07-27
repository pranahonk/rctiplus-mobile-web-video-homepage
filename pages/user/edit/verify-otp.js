import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import ReactCodeInput from 'react-verification-code-input';
import Countdown, { zeroPad } from 'react-countdown-now';

import registrationActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import othersActions from '../../../redux/actions/othersActions';
import notificationActions from '../../../redux/actions/notificationActions';

import { showConfirmAlert } from '../../../utils/helpers';

import Layout from '../../../components/Layouts/Default';
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Form, FormGroup } from 'reactstrap';

import '../../../assets/scss/components/verify-otp-password.scss';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RE_CAPTCHA_SITE_KEY } from '../../../config';


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
            is_submitting: false,
            req_otp_status: 0,
            token: null,
        };
    }

    componentDidMount() {
        // console.log(this.props)
        const {username, token} = this.props.registration

        if(!token) Router.back()    
        this.setState({ username, token }, () => {
            this.props.getOtp(this.state.username, 'edit-profile', this.props.registration.phone_code, token)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ 
                            alert_message: response.data.status.code !== 0 ? response.data.status.message_client : this.generateAlertMessage(response.data.status.message_client),
							req_otp_status: response.data.status.code,
                            token: null, 
                        });
                    }
                })
                .catch(error => {
                    Router.back()    
                    console.log(error)
                });
        });
    }

    submitOtp() {
        // console.log('PHONE CODE: ',this.props.registration.phone_code)
        this.props.updateUserData(this.props.user.data_key[this.props.others.index], this.state.username, this.state.otp, this.props.registration.phone_code)
            .then(response => {
                this.props.showNotification('*Your data is saved');
                setTimeout(() => this.props.hideNotification(), 3000);
                Router.push('/user/edit/verification-success');
            })
            .catch(error => {
                if (error.status == 200) {
                    this.props.showNotification(error.data.status.message_server, false);
                }
                setTimeout(() => this.props.hideNotification(), 3000);
                console.log(error);
            });
        
    }

    onChangeOtp(otp) {
        this.setState({ otp: otp, is_submitting: otp && otp.length >= 4 }, () => {
            this.props.setOtp(this.state.otp);
            if (this.state.is_submitting) {
                console.log(this.props)
                this.props.verifyOtp(this.state.username, this.state.otp, this.props.registration.phone_code)
                    .then(response => {
                        if (response.status === 200) {
                            switch (response.data.status.code) {
                                case 0:
                                    this.submitOtp();
                                    break;

                                default:
                                    this.setState({  
                                        is_submitting: false,
                                        submit_message: 'Invalid verification code'
                                    });
                                    break;
                            }
                            
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({ is_submitting: false });
                    });
            }
        });
    }

    showAlert() {
        let username = this.state.username;
        let token = this.state.token;
		showConfirmAlert(this.state.alert_message, 'OTP Limits', () => {
            this.props.getOtp(username, 'edit-profile', this.props.registration.phone_code, token)
                .then(response => {
                    let newState = {};
                    if (response.status === 200 && response.data.status.message_client != 'You have reached maximum attempts. please, try again later after 1 hours') {
						newState = {
							current_time: Date.now(),
							countdown_key: this.state.countdown_key + 1
						};
					}

					newState['alert_message'] = response.data.status.code !== 0 ? response.data.status.message_client : this.generateAlertMessage(response.data.status.message_client);
					this.setState(newState);
                })
                .catch(error => console.log(error));

        }, true, this.state.req_otp_status == 0 ? 'Not Now' : 'OK', this.state.req_otp_status == 0 ? 'Request New OTP' : '');
    }

    generateAlertMessage(message) {
		let attempts = '';
		let index = -1;
		if ((index = message.indexOf('You have')) != -1) {
			if (message.indexOf('You have 1') != -1) {
				attempts = 'This is your last attempts';
			}
			else {
				attempts = message.substring(index);
			}
			
			if (this.props.registration.username_type === 'PHONE_NUMBER') {
				attempts = 'Carefully check your sms for verification code. ' + attempts;
			}
			else {
				attempts = 'Carefully check your email for verification code. ' + attempts;
			}

			if (message.indexOf('You have 0') != -1) {
				attempts = 'You have reached maximum attempts. please, try again later after 1 hours';
				this.setState({ req_otp_status: 1 });
			}
		}
		else {
			attempts = message;
		}
		return attempts;
	}


	handleChangeToken(token) {
		if(this.state.token) return;

		this.setState({ token });
		this.props.setToken(token);
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
					{/* <FormGroup className="btn-next-position">
						<Button className="btn-next block-btn">Verify</Button>
					</FormGroup> */}
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
                    <GoogleReCaptchaProvider
						language="id"
						reCaptchaKey={RE_CAPTCHA_SITE_KEY}
						
					>
                        <Form onSubmit={this.submitOtp.bind(this)}>
                            <FormGroup>
                                <ReactCodeInput
                                    fields={6}
                                    fieldWidth={40}
                                    onChange={this.onChangeOtp.bind(this)}
                                    className="otp-input-c" />
                            </FormGroup>
                            {actionElement}
                        </Form>
                        <FormGroup>
                            <GoogleReCaptcha
                                onVerify={this.handleChangeToken.bind(this)}
                            />
						</FormGroup>
                    </GoogleReCaptchaProvider>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registrationActions,
    ...userActions,
    ...othersActions,
    ...notificationActions
})(VerifyOtp);
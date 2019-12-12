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

import '../../assets/scss/components/verify-otp.scss';


class VerifyOtp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            alert_message: 'Carefully check your Email for verification code. You only have 3 attempts',
            otp: '',
            interval: 60,
			countdown_key: 0,
			current_time: Date.now()
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
        let text = 'Verification code was sent to your email';
        let username = this.state.username || '';
        
        // set phone number format
        if (this.props.registration.username_type === 'PHONE_NUMBER') {
            text = 'Verification code was sent via SMS to your phone number';
            let newUsername = '';
			for (let i = 2; i < username.length; i++) {
				newUsername += username[i];
				if (i == 2 + 2 || i == 6 + 2) {
					newUsername += ' ';
				}
			}

			username = '+62 ' + newUsername;
        }

        return (
            <Layout title="Verify OTP">
                <NavBack title="Verify OTP"/>
                <div className="container-box">
                    <p>Verify your account, enter your code below</p>
                    <p style={{ fontSize: 14 }} className="text-default-rcti">{text} <span style={{ color: 'white' }}>{username}</span></p>
                    <Form onSubmit={this.submitOtp.bind(this)}>
                        <FormGroup>
                            <ReactCodeInput
                                fields={4}
                                onChange={this.onChangeOtp.bind(this)}
                                className="otp-input" />
                        </FormGroup>
                        <FormGroup>
                            <label className="lbl_rsndcode">
                                Resend code <Countdown
                                    key={this.state.countdown_key}
                                    date={this.state.current_time + (this.state.interval * 1000)}
                                    renderer={({ hours, minutes, seconds, completed }) => {
                                        if (completed) {
                                            return (<p className="text-default-rcti" style={{ fontSize: 12, textAlign: 'center' }}><span onClick={() => Router.push('/forget-password')} className="el-red">Change {this.props.registration.username_type === 'PHONE_NUMBER' ? 'Phone Number' : 'Email'}</span> or <span onClick={this.showAlert.bind(this)} className="el-red">Resend Code</span></p>);
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
            </Layout>
        );
    }

}

export default connect(state => state, registrationActions)(VerifyOtp);
import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

import registerActions from '../../redux/actions/registerActions';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import '../../assets/scss/components/change-password.scss';

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm_password: '',
            password_match_invalid: false,
            at_least_eight_invalid: false,
            view_raw: false,
        };
    }

    componentDidMount() {
        console.log(this.props.registration);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.createForgotPassword(this.props.registration.username, this.state.password, this.props.registration.otp)
            .then(response => {
                const hideNotification = this.props.hideNotification;
                if (response.data.status.code === 0) {
                    this.props.showNotification('Your new password successfully created. Please login.');
                    setTimeout(function() {
						hideNotification();
					}, 3000);
                    Router.push('/signin');
                }
                else {
                    this.props.showNotification(response.data.status.message_client + '. Please try again! (Response code = ' + response.data.status.code + ')', false);
                    setTimeout(function() {
						hideNotification();
					}, 3000);
                }
                
            })
            .catch(error => console.log(error));
        
    }

    togglePassword(e) {
		e.preventDefault();
		this.setState({ view_raw: !this.state.view_raw });
	}

    onPasswordChange(e) {
		let password = e.target.value;
		const passwordLength = password.length;
		this.setState({
			password: password,
			at_least_eight_invalid: !(passwordLength >= 8)
		}, () => {
			this.props.setPassword(this.state.password);
		});
	}

	onConfirmPasswordChange(e) {
		let confirmPassword = e.target.value;
		this.setState({
			confirm_password: confirmPassword,
			password_match_invalid: !(this.state.password === confirmPassword)
		});
	}

    render() {
        return (
            <Layout title="Change Password">
                <NavBack title="Forget Password"/>
                <div className="container-box">
                    <p>Please enter your new password</p>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup>
                            <Label className="label" for="password">Password</Label>
                            <InputGroup>
                                <Input
                                    className="inpt-form"
                                    type={this.state.view_raw ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="Enter password"
                                    invalid={this.state.at_least_eight_invalid}
                                    onChange={this.onPasswordChange.bind(this)} />
                                <div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.at_least_eight_invalid ? 'invalid-border-color' : '')}></div>
                                <FormFeedback>Password must at least 8 characters</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="label" for="password">Re-type Password</Label>
                            <InputGroup>
                                <Input
                                    className="inpt-form"
                                    type={this.state.view_raw ? 'text' : 'password'}
                                    name="password2"
                                    id="password2"
                                    placeholder="Re-type password"
                                    invalid={this.state.password_match_invalid}
                                    onChange={this.onConfirmPasswordChange.bind(this)} />
                                <div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.password_match_invalid ? 'invalid-border-color' : '')}></div>
                                <FormFeedback>Password must match</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={this.state.password == '' || this.state.confirm_password == '' || (this.state.password != this.state.confirm_password) || this.state.password_match_invalid || this.state.at_least_eight_invalid} className="btn-next block-btn">Submit</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registerActions,
    ...userActions,
    ...notificationActions
})(ChangePassword);
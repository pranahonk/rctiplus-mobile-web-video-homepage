import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import registerActions from '../redux/actions/registerActions';
import userActions from '../redux/actions/userActions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavBack from '../components/Includes/Navbar/NavBack';

//load tab signup
import TabSignup from '../components/Includes/Tab/TabSignup';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

class Signup extends React.Component {
	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirm_password: '',
			view_raw: false,
			start_date: new Date(),
			password_match_invalid: false,
			at_least_eight_invalid: false
		};
	}

	

	handleSubmit(e) {
		e.preventDefault();
		console.log(this.props.registration);
	}

	handleChange = date => {
		this.setState({
			start_date: date,
		});
	};

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

	next(e) {
		e.preventDefault();
		if (this.state.password === this.state.confirm_password && this.props.registration.username !== null && this.props.registration.password !== null && !this.state.password_match_invalid && !this.state.at_least_eight_invalid) {
			Router.push('/register/phone/step1');
		}
	}

	render() {
		return (
			<Layout title="Sign Up">
				<NavBack title="Register"/>
				<div className="wrapper-content" style={{ marginTop: 40 }}>
					<div className="login-box">
						<Form onSubmit={this.next.bind(this)}>
							<TabSignup />
							<FormGroup>
								<Label for="password">Password</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type="password"
										name="password"
										id="password"
										placeholder="Enter password"
										invalid={this.state.at_least_eight_invalid}
										onChange={this.onPasswordChange.bind(this)} />
									<div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye')}></div>
									<FormFeedback>Password must at least 8 characters</FormFeedback>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label for="password">Re-type Password</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type="password"
										name="password2"
										id="password2"
										placeholder="Re-type password"
										invalid={this.state.password_match_invalid}
										onChange={this.onConfirmPasswordChange.bind(this)} />
									<div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye')}></div>
									<FormFeedback>Password must match</FormFeedback>
								</InputGroup>
							</FormGroup>
							<Button className="btn-next block-btn">NEXT</Button>
							<p className="text-center fnt-10 el-margin-20 el-white">
								By clicking the Sign Up button, you agree to our&nbsp;
								<a href="/terms-&amp;-conditions" className="text-red fnt-11">
									Terms &amp; Conditions
								</a>&nbsp;
								and&nbsp;
								<a href="/privacy-policy" className="text-red fnt-11">
									Privacy Policy
								</a>&nbsp;
							</p>
							<p className="text-center fnt-12">
								Have an account?&nbsp;
								<a href="/signin" className="text-red">
									Sign In
								</a>&nbsp;
								here
							</p>
						</Form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...registerActions,
	...userActions
})(Signup);

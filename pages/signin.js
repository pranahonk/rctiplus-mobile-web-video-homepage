import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import { getCookie } from '../utils/cookie';
import LoadingBar from 'react-top-loading-bar';

import { showAlert } from '../utils/helpers';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavBack from '../components/Includes/Navbar/NavBack';

//load signin scss
import '../assets/scss/components/signin.scss';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, FormFeedback, InputGroup } from 'reactstrap';


class Signin extends React.Component {
	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			emailphone: '',
			password: '',
			is_password_invalid: false,
			password_invalid_message: '',
			is_username_invalid: false,
			username_invalid_message: '',
			view_raw: false,
			progress_bar: 30
		};

		
	}

	componentDidMount() {
		setTimeout(() => {
			const token = getCookie('ACCESS_TOKEN');
			if (token) {
				Router.push('/');
			}
		}, 500);
		this.LoadingBar.complete();
	}

	onChangeUsername(e) {
		this.setState({ emailphone: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const data = {
			emailphone: this.state.emailphone,
			password: this.state.password,
		};
		this.props.login(data).then(response => {
			console.log(this.props.authentication);
			if (this.props.authentication.data != null && this.props.authentication.data.status.code === 0) {
				Router.push('/');
			}
			else {
				
				switch (this.props.authentication.code) {
					case 7: // code = 7 (Please Try Again Password Is Incorrect)
						this.setState({
							is_username_invalid: false,
							is_password_invalid: true,
							password_invalid_message: this.props.authentication.message
						});
						break;
					
					case 1: // code = 1 (Please try again, username is incorrect)
						this.setState({
							is_password_invalid: false,
							is_username_invalid: true,
							username_invalid_message: this.props.authentication.message
						});
						break;
					case 9: // code = 9 (Invalid, User Has Not Been Registered)
						this.setState({
							is_password_invalid: false,
							is_username_invalid: false,
							username_invalid_message: this.props.authentication.message
						}, () => {
							showAlert('User has not been registered', 'Invalid', 'OK', '', () => {}, true);
						});
						break;
				}

			}
		});
	}

	togglePassword(e) {
		e.preventDefault();
		this.setState({ view_raw: !this.state.view_raw });
	}

	render() {
		return (
			<Layout title="Sign In">
				<LoadingBar
					progress={this.state.progress_bar}
					height={3}
					color='#fff'
					onRef={ref => (this.LoadingBar = ref)}/>
				<NavBack title="Login"/>
				<div className="wrapper-content" style={{ marginTop: 40 }}>
					<div className="login-box">
						<Form onSubmit={this.handleSubmit.bind(this)}>
							<FormGroup>
								<Label for="email">Email or Phone Number</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type="text"
										name="email"
										id="email"
										placeholder="insert email or phone number"
										defaultValue={this.state.emailphone}
										invalid={this.state.is_username_invalid}
										onChange={this.onChangeUsername.bind(this)}/>
									<FormFeedback>{this.state.username_invalid_message}</FormFeedback>
								</InputGroup>
								
							</FormGroup>
							<FormGroup>
								<Label for="password">Password</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type={this.state.view_raw ? 'text' : 'password'}
										name="password"
										id="password"
										placeholder="insert password"
										defaultValue={this.state.password}
										onChange={e => this.setState({ password: e.target.value })}
										invalid={this.state.is_password_invalid}/>
									<div onClick={this.togglePassword.bind(this)} className={'view-raw ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye')}></div>
									<FormFeedback>{this.state.password_invalid_message}</FormFeedback>
								</InputGroup>
							</FormGroup>
							<p className="text-center">
								<a href="/forget-password" className="text-white fnt-12">
									Forgot Password?
								</a>
							</p>
							<Button disabled={this.state.emailphone.length < 6} className="btn-next block-btn" style={{ marginTop: 20 }}>Log In</Button>
							<p className="text-center fnt-10 el-margin-20 el-white" style={{ fontSize: 12 }}>
								Don't have an account?<br/>
								<a href="/signup" className="text-red">
									Register
								</a> here.&nbsp;
							</p>
							<p className="text-center fnt-10 el-margin-20 el-white" style={{ fontSize: 11, marginTop: 50 }}>
								By clicking the Log In button, you agree to our&nbsp;
								<a href="/terms-&amp;-conditions" className="text-red fnt-11">
									Terms &amp; Conditions
								</a>&nbsp;
								and&nbsp;
								<a href="/privacy-policy" className="text-red fnt-11">
									Privacy Policy
								</a>&nbsp;
							</p>
						</Form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, actions)(Signin);

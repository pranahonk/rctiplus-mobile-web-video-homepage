import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import { getCookie, removeCookie } from '../utils/cookie';
import LoadingBar from 'react-top-loading-bar';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import countryList from '../redux/actions/othersActions';
import registerActions from '../redux/actions/registerActions';
import queryString from 'query-string';

import { showAlert } from '../utils/helpers';
import q from 'query-string';

import Layout from '../components/Layouts/Default_v2';
import NavBack from '../components/Includes/Navbar/NavBack';

import '../assets/scss/components/signin.scss';

import { Button, Form, FormGroup, Label, Input, FormFeedback, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../config';

const CountryList = dynamic(() => import('../components/Modals/CountryList'));

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
			progress_bar: 30,
			status: false,
			codeCountry: 'ID',
			phone_code: '62',
			isPhoneNumber: false,
		};


	}

	componentDidMount() {
		this.props.getListCountry();
		setTimeout(() => {
			const token = getCookie('ACCESS_TOKEN');
			if (token) {
				const query = this.props.router.query;
				if (query && Object.keys(query).length > 0 && query.referrer) {
					removeCookie('ACCESS_TOKEN')
					// window.location.href = this.constructReferrerUrl(token);
				}
				else {
					Router.push('/');
				}
			}
		}, 500);
		this.LoadingBar.complete();
	}

	constructReferrerUrl(token) {
		const query = this.props.router.query;
		if (query && query.referrer) {
			const referrerToken = query.referrer.split('?');
			if (referrerToken.length > 1) {
				const qs = q.parse(referrerToken[1]);
				qs['token'] = token;
				return referrerToken[0] + '?' + q.stringify(qs);
			}
			else {
				return referrerToken[0] + '?token=' + token;
			}
		}
		return '';
	}

	onChangeUsername(e) {
		const regex = /^[0-9]+$/;
		let value = e.target.value;
			this.setState({ is_username_invalid: false });
		if (regex.test(value) && value.length >= 3) {
			if (value) {
				if (value.charAt(0) === '0') {
					value = value.slice(1);
				}
				// console.log('VALUE', value)
			this.setState({ isPhoneNumber: true, emailphone: value});
			this.props.setPhoneCode(this.state.phone_code);
			// console.log('PHONE');
		}
	} else {
			this.setState({ isPhoneNumber: false, emailphone: value });
			this.props.setPhoneCode();
			// console.log('EMAIL');
		}
}
	

	handleSubmit(e) {
		e.preventDefault();
		const data = {
			emailphone: this.state.emailphone,
			password: this.state.password,
			phone_code: this.state.isPhoneNumber ? this.state.phone_code : '',
		};
		// console.log(data)
		this.props.login(data).then(response => {
			if(this.props?.authentication?.code === 8) {
				return this.setState({
							is_password_invalid: false,
							is_username_invalid: true,
							username_invalid_message: this.props.authentication.message,
						});
			}
			if (this.props.authentication.data != null && this.props.authentication.data.status.code === 0) {
				console.log(this.props.authentication)
				const query = this.props.router.query;
				if (query && Object.keys(query).length > 0 && query.referrer) {
					window.location.href = this.constructReferrerUrl(this.props.authentication.token);
				}
				else {
					const redirect = queryString.parse(location?.search)
					if(redirect.redirectTo) {
						Router.push(redirect.redirectTo)
					} else {
						Router.push('/');
					}
				}
			}
			else {
				switch (this.props.authentication.code) {
					case 7: // code = 7 (Please Try Again Password Is Incorrect)
						this.setState({
							is_username_invalid: false,
							is_password_invalid: true,
							password_invalid_message: this.props.authentication.message,
						});
						break;

					case 1: // code = 1 (Please try again, username is incorrect)
						this.setState({
							is_password_invalid: false,
							is_username_invalid: true,
							username_invalid_message: this.props.authentication.message,
						});
						break;
					case 9: // code = 9 (Invalid, User Has Not Been Registered)
						this.setState({
							is_password_invalid: false,
							is_username_invalid: false,
							username_invalid_message: this.props.authentication.message,
						}, () => {
							showAlert('User has not been registered', 'Invalid', 'OK', '', () => {}, true, 'not-registered');
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

	removeCountryCode(value, phone_code) {
		let result = value;
				result = value.slice(phone_code.length - 1)
				// console.log('RESULT: ',result, phone_code)
		return result;
}

	render() {
		const { state, props } = this;
		return (
			<Layout title={SITEMAP.login.title}>
				<Head>
					<meta name="description" content={SITEMAP.login.description}/>
					<meta name="keywords" content={SITEMAP.login.keywords}/>
					<meta property="og:title" content={SITEMAP.login.title} />
					<meta property="og:description" content={SITEMAP.login.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.login.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:type" content="article" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.login.image} />
					<meta name="twitter:image:alt" content={SITEMAP.login.title} />
					<meta name="twitter:title" content={SITEMAP.login.title} />
					<meta name="twitter:description" content={SITEMAP.login.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				<LoadingBar
					progress={this.state.progress_bar}
					height={3}
					color="#fff"
					onRef={ref => (this.LoadingBar = ref)}/>
				<NavBack title="Login"/>
				<div className="wrapper-content" style={{ marginTop: 40 }}>
					<div className="login-box">
						<Form onSubmit={this.handleSubmit.bind(this)}>
							<FormGroup>
								<Label for="email">Email or Phone Number</Label>
								<InputGroup>
									<Input
										className={'inpt-form ' + (!state.isPhoneNumber ? 'right-border-radius ' : 'none-border-right') }
										type="text"
										name="email"
										id="email"
										placeholder="insert email or phone number"
										defaultValue={this.state.emailphone}
										invalid={this.state.is_username_invalid}
										onChange={this.onChangeUsername.bind(this)}/>
										{ state.isPhoneNumber ? (
											<InputGroupAddon onClick={ () => this.setState({ status: !state.status }) } addonType="append" id="action-country-code">
											<InputGroupText className={'append-input right-border-radius ' + (state.is_username_invalid ? ' invalid-border-color' : '')}>
												{this.state.codeCountry}<KeyboardArrowDownIcon/>
											</InputGroupText>
											</InputGroupAddon>
										) : '' }
									<FormFeedback id="invalid-username">{this.state.username_invalid_message}</FormFeedback>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label for="password">Password</Label>
								<InputGroup>
									<Input
										className="inpt-form none-border-right"
										type={this.state.view_raw ? 'text' : 'password'}
										name="password"
										id="password"
										placeholder="insert password"
										defaultValue={this.state.password}
										onChange={e => this.setState({ password: e.target.value, is_password_invalid: false })}
										invalid={this.state.is_password_invalid}/>
									<div
										onClick={this.togglePassword.bind(this)}
										className={'view-raw right-border-radius none-border-left ' +
												(this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye ') +
												(this.state.is_password_invalid ? ' invalid-border-color' : '')
												} />
									<FormFeedback id="invalid-password">{this.state.password_invalid_message}</FormFeedback>
								</InputGroup>
							</FormGroup>
							<p className="text-center">
								<a id="forgot-password-link" href="/forget-password" className="text-white fnt-12">
									Forgot Password?
								</a>
							</p>
							<Button id="submit-login" disabled={this.state.emailphone.length < 6} className="btn-next block-btn" style={{ marginTop: 20 }}>Log In</Button>
							<p className="text-center fnt-10 el-margin-20 el-white" style={{ fontSize: 12 }}>
								Don't have an account?<br/>
								<a id="register-link" href="/register" className="text-red">
									Register
								</a> here.&nbsp;
							</p>
							<p className="text-center fnt-10 el-margin-20 el-white" style={{ fontSize: 11, marginTop: 50 }}>
								By clicking the Log In button, you agree to our&nbsp;
								<a href="/terms-&-conditions" className="text-red fnt-11">
									Terms &amp; Conditions
								</a>&nbsp;
								and&nbsp;
								<a href="/privacy-policy" className="text-red fnt-11">
									Privacy Policy
								</a>&nbsp;
							</p>
						</Form>
					</div>
					{this.state.status ? (
					<CountryList
						data={this.props.others.list_country}
						modal={state.status}
						toggle={() => this.setState({ status: !state.status })}
						getCountryCode={(e) => {
								this.props.setPhoneCode(e.phone_code);
								this.setState({ 
									codeCountry: e.code, 
									phone_code: e.phone_code,
									emailphone: state.emailphone,
									});}
							}
						className="country-list-modal"/>) : ''}
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...actions, 
	...countryList,
	...registerActions,
})(withRouter(Signin));

import React from 'react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import registerActions from '../redux/actions/registerActions';
import countryList from '../redux/actions/othersActions';
import userActions from '../redux/actions/userActions';

import initialize from '../utils/initialize';

import Layout from '../components/Layouts/Default_v2';
import NavBack from '../components/Includes/Navbar/NavBack';
import TabSignup from '../components/Includes/Tab/TabSignup';

import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../config';

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
			view_raw_re: false,
			start_date: new Date(),
			password_match_invalid: false,
			at_least_eight_invalid: false
		};
	}

	componentDidMount() {
		this.props.getListCountry();
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

	togglePassword(type = '') {
		if (type === 're') {
			this.setState({ view_raw_re: !this.state.view_raw_re });
		}
		else {
			this.setState({ view_raw: !this.state.view_raw });
		}
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
		console.log(this.props.registration);
		if (this.state.password === this.state.confirm_password && this.props.registration.username !== null && this.props.registration.password !== null && !this.state.password_match_invalid && !this.state.at_least_eight_invalid && ((this.props.registration.active_tab == '1' && !this.props.registration.phone_invalid) || (this.props.registration.active_tab == '2' && !this.props.registration.email_invalid))) {
			Router.push('/register/phone/step1');
		}
	}

	render() {
		return (
			<Layout title={SITEMAP.register.title}>
				<Head>
					<meta name="description" content={SITEMAP.register.description}/>
					<meta name="keywords" content={SITEMAP.register.keywords}/>
					<meta property="og:title" content={SITEMAP.register.title} />
					<meta property="og:description" content={SITEMAP.register.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.register.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.register.image} />
					<meta name="twitter:image:alt" content={SITEMAP.register.title} />
					<meta name="twitter:title" content={SITEMAP.register.title} />
					<meta name="twitter:description" content={SITEMAP.register.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
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
										type={this.state.view_raw ? 'text' : 'password'}
										name="password"
										id="password"
										placeholder="insert password"
										invalid={this.state.at_least_eight_invalid}
										onChange={this.onPasswordChange.bind(this)} />
									<div onClick={this.togglePassword.bind(this)} className={'view-raw right-border-radius ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.at_least_eight_invalid ? 'invalid-border-color' : '')}></div>
									<FormFeedback id="invalid-password-num-chars">Password must at least 8 characters</FormFeedback>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label for="password">Re-type Password</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type={this.state.view_raw_re ? 'text' : 'password'}
										name="password2"
										id="password2"
										placeholder="insert password"
										invalid={this.state.password_match_invalid}
										onChange={this.onConfirmPasswordChange.bind(this)} />
									<div onClick={this.togglePassword.bind(this, 're')} className={'view-raw right-border-radius ' + (this.state.view_raw_re ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.password_match_invalid ? 'invalid-border-color' : '')}></div>
									<FormFeedback id="invalid-password-not-match">Password must match</FormFeedback>
								</InputGroup>
							</FormGroup>
							<Button id="button-next" disabled={!this.props.registration.username || this.props.registration.username.length < 6} className="btn-next block-btn">NEXT</Button>
							{/* <p className="text-center fnt-10 el-margin-20 el-white">
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
								<a href="/login" className="text-red">
									Sign In
								</a>&nbsp;
								here
							</p> */}
						</Form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...registerActions,
	...userActions,
	...countryList,
})(withRouter(Signup));

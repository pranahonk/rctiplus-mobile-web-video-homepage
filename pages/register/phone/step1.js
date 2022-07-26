import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import registerActions from '../../../redux/actions/registerActions';
import DatePicker from 'react-mobile-datepicker';

import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from 'reactstrap';

import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';

import '../../../assets/scss/components/signup.scss';
import { showConfirmAlert } from '../../../utils/helpers';
import { RE_CAPTCHA_SITE_KEY } from '../../../config';

class Step1 extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fullname: '',
			fullname_invalid: false,
			fullname_invalid_message: '',
			birthdate: '',
			birthdate_invalid: false,
			birthdate_invalid_message: '',
			formatted_date: '',
			gender: '',
			gender_invalid: false,
			gender_invalid_message: '',
			datepicker_open: false,
			genderpicker_open: false,
			token: null
		};

		const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		this.genderMap = {
			'0': 'Female',
			'1': 'Male'
		};

		this.dateConfig = {
			year: {
				format: 'YYYY',
				caption: 'Year',
				step: 1
			},
			month: {
				format: value => monthMap[value.getMonth()],
				caption: 'Mon',
				step: 1
			},
			date: {
				format: 'DD',
				caption: 'Day',
				step: 1
			}
		};

		this.genderConfig = {
			month: {
				format: value => this.genderMap[value.getMonth() % 2],
				caption: 'Mon',
				step: 1
			}
		};

		// console.log(this.genderConfig);
	}

	handleSelectBirthdate(date) {
		const formattedDate = this.formatDate(date);
		this.setState({ birthdate: date, formatted_date: formattedDate, datepicker_open: false });
		this.props.setDob(formattedDate);
	}

	handleCancelBirthdate() {
		this.setState({ datepicker_open: false });
	}

	handleOpenBirthdate() {
		this.setState({ datepicker_open: true });
	}

	handleSelectGender(gender) {
		const g = gender.getMonth() % 2;
		this.setState({ gender: this.genderMap[g], genderpicker_open: false });
		this.props.setGender(this.genderMap[g].toLowerCase());
	}

	onChangeGender(e) {
		if (e.target.value && e.target.value != 'Select gender') {
			this.setState({ gender: e.target.value });
		}
		else {
			this.setState({ gender: '' });
		}
    }

	handleFullnameChange(e) {
		this.setState({ fullname: e.target.value });
		this.props.setFullname(e.target.value);
	}

	handleChangeToken(token) {
		if(this.state.token) return;

		this.setState({ token });
		this.props.setToken(token);
	}

	handleCancelGender() {
		this.setState({ genderpicker_open: false });
	}

	handleOpenGender() {
		this.setState({ genderpicker_open: true });
	}

	formatDate(date) {
		let dd = date.getDate();
		let mm = date.getMonth() + 1;
		const yyyy = date.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}

		return yyyy + '-' + mm + '-' + dd;
	}

	next(e) {
		e.preventDefault();
		let formValid = true;
		let fullnameValid = true;
		let birthdateValid = true;
		let genderValid = true;

		// if (this.state.fullname == '') {
		// 	formValid = false;
		// 	fullnameValid = false;
		// }

		// if (this.state.birthdate == '') {
		// 	formValid = false;
		// 	birthdateValid = false;
		// }

		// if (this.state.gender == '') {
		// 	formValid = false;
		// 	genderValid = false;
		// }

		if (formValid) {
			// showConfirmAlert('Are you sure you want to continue? Make sure to check your entry before continue.', '', () => {
			// 	Router.push('/register/phone/step2');
			// });

			Router.push('/register/phone/step2');
		}
		else {
			let newState = {};
			
			if (!fullnameValid) {
				newState['fullname_invalid'] = true;
				newState['fullname_invalid_message'] = 'Please insert fullname';
			}
			else {
				newState['fullname_invalid'] = false;
			}
			
			if (!birthdateValid) {
				newState['birthdate_invalid'] = true;
				newState['birthdate_invalid_message'] = 'Please insert birthdate';
			}
			else {
				newState['birthdate_invalid'] = false;
			}

			if (!genderValid) {
				newState['gender_invalid'] = true;
				newState['gender_invalid_message'] = 'Please insert gender';
			}
			else {
				newState['gender_invalid'] = false;
			}

			this.setState(newState);
		}
	}

	render() {
		return (
			<Layout title="Register Step 1">
				<NavBack title="Verification" />
				<DatePicker
					dateConfig={this.dateConfig}
					headerFormat="YYYY-MM-DD"
					theme="android-dark"
					confirmText="Done"
					cancelText="Cancel"
					max={new Date()}
					onSelect={this.handleSelectBirthdate.bind(this)}
					onCancel={this.handleCancelBirthdate.bind(this)}
					value={new Date()}
					isOpen={this.state.datepicker_open} />

				<DatePicker
					dateConfig={this.genderConfig}
					headerFormat="Gender"
					theme="android-dark"
					confirmText="Done"
					cancelText="Cancel"
					onSelect={this.handleSelectGender.bind(this)}
					onCancel={this.handleCancelGender.bind(this)}
					isOpen={this.state.genderpicker_open} />

				<div className="wrapper-content" style={{ marginTop: 50 }}>
					<div className="login-box">
					<GoogleReCaptchaProvider
						language="id"
						reCaptchaKey={RE_CAPTCHA_SITE_KEY}
						
					>
						<Form onSubmit={this.next.bind(this)}>
							<FormGroup>
								<Label>Full Name</Label>
								<InputGroup>
									<Input
										className="inpt-form"
										type="text"
										name="fullname"
										id="fullname"
										maxLength="25"
										placeholder="Insert full name"
										onChange={this.handleFullnameChange.bind(this)}
										invalid={this.state.fullname_invalid}/>
									<FormFeedback>{this.state.fullname_invalid_message}</FormFeedback>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label>Birth Date</Label>
								<InputGroup>
									<Input
										className="inpt-form addon-right-input"
										type="text"
										name="birthdate"
										id="BirthDate"
										readOnly
										placeholder="yyyy-mm-dd"
										defaultValue={this.state.formatted_date}
										invalid={this.state.birthdate_invalid}
										onClick={this.handleOpenBirthdate.bind(this)} />
									<InputGroupAddon addonType="append">
										<InputGroupText className="inpt-form addon-right">
											<ArrowDropdownIcon />
										</InputGroupText>
									</InputGroupAddon>
									<FormFeedback>{this.state.birthdate_invalid_message}</FormFeedback>
								</InputGroup>

							</FormGroup>
							<FormGroup>
								<Label>Gender</Label>
								<InputGroup>
									<Input
										type="select"
										id="gender"
										value={this.state.gender ? this.state.gender.charAt(0).toUpperCase() + this.state.gender.substring(1) : ''}
										onChange={this.onChangeGender.bind(this)}
										invalid={this.state.gender_invalid}
										placeholder="Select gender"
										className="inpt-form"
										style={{ backgroundColor: '#272727', color: 'white', WebkitAppearance: 'none' }}>
										<option>Select gender</option>
										<option>Male</option>
										<option>Female</option>
									</Input>
									{/* <Input
										className="inpt-form addon-right-input"
										type="text"
										name="gender"
										placeholder="Select gender"
										id="gender"
										readOnly
										defaultValue={this.state.gender}
										invalid={this.state.gender_invalid}
										onClick={this.handleOpenGender.bind(this)} />
									<InputGroupAddon addonType="append">
										<InputGroupText className="inpt-form addon-right">
											<ArrowDropdownIcon />
										</InputGroupText>
									</InputGroupAddon> */}
									<FormFeedback>{this.state.gender_invalid_message}</FormFeedback>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<GoogleReCaptcha
									onVerify={this.handleChangeToken.bind(this)}
								/>
							</FormGroup>
							<FormGroup className="btn-next-position">
								<Button id="button-next" disabled={Boolean(this.state.fullname.length < 4)} className="btn-next block-btn">NEXT</Button>
							</FormGroup>
						</Form>
						</GoogleReCaptchaProvider>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, registerActions)(Step1);
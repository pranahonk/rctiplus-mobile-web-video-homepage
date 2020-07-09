import React from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import registerActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../../../assets/scss/components/signup.scss';

const CountryList = dynamic(() => import('../../Modals/CountryList'));

import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	FormGroup,
	Label,
	Input,
	Row,
	Col,
	FormFeedback,
	InputGroup,
	InputGroupAddon,
	InputGroupText
} from 'reactstrap';
import classnames from 'classnames';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

class TabSignup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: '2',
			phone_number_invalid: false,
			phone_invalid_message: '',
			email_invalid: false,
			email_invalid_message: '',
			status: false,
		};

		this.subject = new Subject();
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({ activeTab: tab }, () => {
				this.props.setActiveTab(tab);
				if (this.state.activeTab == '1') {
					this.props.setUsernameType('PHONE_NUMBER');
				}
				else {
					this.props.setUsernameType('EMAIL');
				}
			});
		}
	}

	onChangeUsername(e) {
		this.props.setUsername(e.target.value);
		this.subject.next();
	}

	validateUsername(response) {
		const message = response.data.status.message_client;
		if (response.data.status.code === 0) {
			if (this.state.activeTab == '1') {
				this.setState({
					phone_number_invalid: message != 'Your phone is Available',
					phone_invalid_message: message
				}, () => {
					this.props.setPhoneInvalid(message != 'Your phone is Available');
				});
			}
			else if (this.state.activeTab == '2') {
				this.setState({
					email_invalid: message != 'Your email is Available',
					email_invalid_message: message
				}, () => {
					this.props.setEmailInvalid(message != 'Your email is Available');
				});
			}
		}
		else if (response.data.status.code === 1 || response.data.status.code === 2) {
			if (this.state.activeTab == '1') {
				this.setState({
					phone_number_invalid: true,
					phone_invalid_message: message
				}, () => {
					this.props.setPhoneInvalid(true);
				});
			}
			else if (this.state.activeTab == '2') {
				this.setState({
					email_invalid: true,
					email_invalid_message: message
				}, () => {
					this.props.setEmailInvalid(true);
				});
			}
		}
	}

	componentDidMount() {
		if (this.state.activeTab == '1') {
			this.props.setUsernameType('PHONE_NUMBER');
		}
		else {
			this.props.setUsernameType('EMAIL');
		}

		this.subject
			.pipe(debounceTime(500))
			.subscribe(() => {
				let username = this.props.registration.username;
				if (this.state.activeTab == '1') {
					username = '62' + username;
				}

				if (this.props.registration.username) {
					this.props.checkUser(username)
						.then(response => {
							if (response.status === 200) {
								this.validateUsername(response);
							}
						})
						.catch(error => {
							console.log(error);
						});
				}
			});
	}

	render() {
		const { state, props } = this;
		return (
			<div className="nav-tab-wrapper">
				<Nav tabs>
					<NavItem className="nav-signup-item">
						<NavLink
							id="register-email"
							style={{ fontSize: '0.8rem' }}
							className={classnames({ active: this.state.activeTab === '2' })}
							onClick={() => {
								this.toggle('2');
							}}>
							Email
						</NavLink>
					</NavItem>
					<NavItem className="nav-signup-item">
						<NavLink
							id="register-phone"
							style={{ fontSize: '0.8rem' }}
							className={classnames({ active: this.state.activeTab === '1' })}
							onClick={() => {
								this.toggle('1');
							}}>
							Phone Number
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab} className="tab-signup">
					<TabPane tabId="1">
						<FormGroup className="frmInput1">
							<Label for="email">Phone Number</Label>
							<InputGroup>
								{/* <InputGroupAddon addonType="prepend">
									<InputGroupText className={'inpt-form addon-left ' + (!this.state.phone_number_invalid && !!this.props.registration.username ? 'valid-border-color..' : (this.state.phone_number_invalid ? 'invalid-border-color' : ''))}>+62</InputGroupText>
								</InputGroupAddon> */}
								<Input
									className="inpt-form right-none"
									type="number"
									name="text"
									id="phone_number"
									placeholder="insert phone number"
									invalid={this.state.phone_number_invalid}
									onChange={this.onChangeUsername.bind(this)} />
									<InputGroupAddon onClick={ () => this.setState({ status: !state.status }) } addonType="append">
										<InputGroupText className={'append-input right-border-radius  ' + (!this.state.phone_number_invalid && !!this.props.registration.username ? 'valid-border-color..' : (this.state.phone_number_invalid ? 'invalid-border-color' : ''))}>ID <KeyboardArrowDownIcon/></InputGroupText>
									</InputGroupAddon>
								<FormFeedback
								id="invalid-phone-number"
								// valid={!this.state.phone_number_invalid && !!this.props.registration.username}
								>{this.state.phone_invalid_message}</FormFeedback>
							</InputGroup>
						</FormGroup>
					</TabPane>
					<TabPane tabId="2">
						<FormGroup className="frmInput1">
							<Label for="email">Email</Label>
							<InputGroup>
								<Input
									className="inpt-form right-border-radius "
									type="email"
									name="email"
									id="email"
									placeholder="insert email"
									invalid={this.state.email_invalid}
									onChange={this.onChangeUsername.bind(this)} />
								<FormFeedback id="invalid-email">{this.state.email_invalid_message}</FormFeedback>
							</InputGroup>
						</FormGroup>
					</TabPane>
				</TabContent>
				<CountryList modal={state.status} toggle={() => this.setState({ status: !state.status })} className="country-list-modal"/>
			</div>
		);
	}
}

export default connect(state => state, {
	...registerActions,
	...userActions
})(TabSignup);

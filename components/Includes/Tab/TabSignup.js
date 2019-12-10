import React from 'react';
import { connect } from 'react-redux';
import registerActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import '../../../assets/scss/components/signup.scss';
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

import { Subject }  from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

class TabSignup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: '1',
			phone_number_invalid: false,
			phone_invalid_message: '',
			email_invalid: false,
			email_invalid_message: ''
		};

		this.subject = new Subject();
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({ activeTab: tab }, () => {
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
							if (response.status === 200 && response.data.status.code === 1) {
								const message = response.data.status.message_client;
								if (this.state.activeTab == '1') {
									this.setState({
										phone_number_invalid: message != 'Your Username is Available',
										phone_invalid_message: message
									});
								}
								else if (this.state.activeTab == '2') {
									this.setState({
										email_invalid: message != 'Your Username is Available',
										email_invalid_message: message
									});
								}
							}
						})
						.catch(error => {
							if (error.status === 200 && error.data.status.code === 1) {
								if (this.state.activeTab == '1') {
									this.setState({
										phone_number_invalid: true,
										phone_invalid_message: error.data.status.message_client
									});
								}
								else if (this.state.activeTab == '2') {
									this.setState({
										email_invalid: true,
										email_invalid_message: error.data.status.message_client
									});
								}
							}
						});
				}
			});
	}

	render() {
		return (
			<div className="nav-tab-wrapper">
				<Nav tabs>
					<NavItem className="nav-signup-item">
						<NavLink
							style={{ fontSize: '0.8rem' }}
							className={classnames({ active: this.state.activeTab === '1' })}
							onClick={() => {
								this.toggle('1');
							}}>
							Phone Number
						</NavLink>
					</NavItem>
					<NavItem className="nav-signup-item">
						<NavLink
							style={{ fontSize: '0.8rem' }}
							className={classnames({ active: this.state.activeTab === '2' })}
							onClick={() => {
								this.toggle('2');
							}}>
							Email
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
						<Row>
							<Col sm="12">
								<FormGroup className="frmInput1">
									<Label for="email">Phone Number</Label>
									<InputGroup>
										<InputGroupAddon addonType="prepend">
											<InputGroupText className="inpt-form addon-left">+62</InputGroupText>
										</InputGroupAddon>
										<Input
											className="inpt-form addon-left-input"
											type="number"
											name="text"
											id="phone_number"
											placeholder="Enter your phone number"
											valid={!this.state.phone_number_invalid && !!this.props.registration.username}
											invalid={this.state.phone_number_invalid}
											onChange={this.onChangeUsername.bind(this)} />
										<FormFeedback valid={!this.state.phone_number_invalid && !!this.props.registration.username}>{this.state.phone_invalid_message}</FormFeedback>
									</InputGroup>
								</FormGroup>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="2">
						<Row>
							<Col sm="12">
								<FormGroup className="frmInput1">
									<Label for="email">Email</Label>
									<InputGroup>
										<Input
											className="inpt-form"
											type="email"
											name="email"
											id="email"
											placeholder="Enter email"
											invalid={this.state.email_invalid}
											onChange={this.onChangeUsername.bind(this)} />
										<FormFeedback>{this.state.email_invalid_message}</FormFeedback>
									</InputGroup>
								</FormGroup>
							</Col>
						</Row>
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

export default connect(state => state, {
	...registerActions,
	...userActions
})(TabSignup);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBackInterest from '../../components/Includes/Navbar/NavBackInterest';

//load reactstrap components
import { Button, Form, FormGroup, Row, Col, Container } from 'reactstrap';

import '../../assets/scss/components/interest.scss';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

class Interest extends Component {

	constructor(props) {
		super(props);
		this.state = {
			interests: [],
			selected_interests: [],
			selected_interest_components: []
		};

		this.dummyInterests = [
			{
				id: 1,
				name: 'Comedy'
			},
			{
				id: 2,
				name: 'Drama'
			},
			{
				id: 3,
				name: 'Horror'
			},
			{
				id: 4,
				name: 'Thriller'
			},
			{
				id: 5,
				name: 'Romance'
			},
			{
				id: 6,
				name: 'Entertainment'
			}
		];
	}

	componentDidMount() {
		this.props.getInterests()
			.then(response => {
				console.log(this.props.user);
				this.setState({ interests: this.props.user.data });
			})
			.catch(error => {
				console.log(error);
			});
	}

	selectInterest(interest, order) {
		let selectedInterests = this.state.selected_interests;
		let selectedInterestComponents = this.state.selected_interest_components;

		let alreadySelected = false;
		let selectedIndex = -1;

		for (let i = 0; i < selectedInterests.length; i++) {
			if (interest.id == selectedInterests[i].id) {
				alreadySelected = true;
				selectedIndex = i;
				break;
			}
		}

		if (selectedInterests.length >= 3) {
			if (alreadySelected) {
				selectedInterests.splice(selectedIndex, 1);
				selectedInterestComponents.splice(selectedIndex, 1);
			}
			else {
				this.showAlert();
			}
		}
		else {
			if (alreadySelected) {
				selectedInterests.splice(selectedIndex, 1);
				selectedInterestComponents.splice(selectedIndex, 1);
			}
			else {
				selectedInterests.push(interest);
				selectedInterestComponents.push(order);
			}
		}

		this.setState({ 
			selected_interests: selectedInterests,
			selected_interest_components: selectedInterestComponents
		});
	}

	showNotification() {
		this.props.showNotification('Your data has been saved');
		const hideNotification = this.props.hideNotification;
		setTimeout(function() {
			hideNotification();
		}, 3000);
	}

	showAlert() {
		Swal.fire({
			title: 'Choose Interests',
			text: 'Cannot choose more than 3 interests',
			confirmButtonText: 'OK',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn-next block-btn btn-primary-edit',
				header: 'alert-header',
				content: 'alert-content'
			},
			width: '85%'
		});
	}

	render() {
		return (
			<Layout title="Your Interest">
				<NavBackInterest />
				<div className="wrapper-content">
					<div className="login-box">
						<div className="choose_interest">
							<p className="txt-content-interest">
								Welcome,
								Thank you, your account has been successfully registered.
								<br /><br />
								Help us, select 3 category interests:
							</p>

						</div>
						<FormGroup>
							<Container>
								<Row>
									{this.dummyInterests.map((interest, index) => (
										<Col xs="6" key={index}>
											<Button onClick={this.selectInterest.bind(this, interest, index)} className={'interest' + ' ' + (this.state.selected_interest_components.indexOf(index) != -1 ? 'interest-selected' : '')}>{interest.name}</Button>
										</Col>
									))}
								</Row>
							</Container>
						</FormGroup>
						<FormGroup className="btn-next-position">
							<Button onClick={this.showNotification.bind(this)} className="btn-next">Save</Button>
						</FormGroup>
					</div>
				</div>
			</Layout>
		);
	}
}

export default connect(state => state, {
	...userActions,
	...notificationActions
})(Interest);
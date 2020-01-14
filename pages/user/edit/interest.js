import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { showAlert } from '../../../utils/helpers';
import userActions from '../../../redux/actions/userActions';
import notificationActions from '../../../redux/actions/notificationActions';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, FormGroup, Row, Col, Container } from 'reactstrap';

import '../../../assets/scss/components/interest.scss';

class Interest extends Component {

	constructor(props) {
		super(props);
		this.state = {
			interests: [],
			selected_interests: [],
			selected_interest_components: []
		};
	}

	componentDidMount() {
		this.props.getInterests()
			.then(response => {
				this.setState({ interests: this.props.user.data }, () => {
                    this.props.getUserInterest()
                        .then(res => {
                            this.setState({ selected_interests: res.data.data }, () => {
                                const interests = this.state.interests;
                                const selectedId = this.state.selected_interests.map(s => s.id);
                                const order = [];
                                for (let i = 0; i < interests.length; i++) {
                                    if (selectedId.indexOf(interests[i].id) != -1) {
                                        order.push(i);
                                    }
                                }

                                this.setState({ selected_interest_components: order });
                            });
                        })
                        .catch(error => console.log(error));
                });
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
				showAlert('Cannot choose more than 3 interests', 'Choose Interests');
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

	showNotification(e) {
		e.preventDefault();
		console.log('SELECTED INTERESTS:', this.state.selected_interests);
		const hideNotification = this.props.hideNotification;
		if (this.state.selected_interests.length < 3) {
			this.props.showNotification('You must select 3 interests', false);
			setTimeout(function() {
				hideNotification();
			}, 3000);
		}
		else {
			let interestsId = [];
			for (let i = 0; i < this.state.selected_interests.length; i++) {
				interestsId.push(this.state.selected_interests[i].id);
			}
			this.props.setInterest(interestsId)
				.then(response => {
					if (response.data.status.code === 0) {
						this.props.showNotification('Your data has been saved');
						Router.push('/user/edit-profile');
					}
					else {
						this.props.showNotification(response.data.status.message_client + '. Please try again! (Response code = ' + response.data.status.code + ')', false);
					}
					setTimeout(function() {
						hideNotification();
					}, 3000);
				})
				.catch(error => {
					this.props.showNotification('Error while saving interests. Please try again!', false);
					setTimeout(function() {
						hideNotification();
					}, 3000);
				});
		}
		
	}

	render() {
		return (
			<Layout title="Your Interest">
				<NavBack title="Choose Interest" />
				<div className="wrapper-content" style={{ marginTop: 40 }}>
					<div className="login-box" style={{ width: '100%' }}>
                        <div className="choose_interest">
							<p className="txt-content-interest">
								<strong>Welcome!</strong><br/>
								Thank you, your account has been successfully registered.
								<br/><br/>
								Help us, select 3 category interests:
							</p>
						</div>
						<FormGroup>
							<Container>
								<Row>
									{this.state.interests.map((interest, index) => (
										<Col xs="6" key={index}>
											<Button onClick={this.selectInterest.bind(this, interest, index)} className={'interest' + ' ' + (this.state.selected_interest_components.indexOf(index) != -1 ? 'interest-selected' : '')}>{interest.name}</Button>
										</Col>
									))}
								</Row>
							</Container>
						</FormGroup>
						<FormGroup className="btn-next-position">
							<Button disabled={this.state.selected_interests.length < 3} onClick={this.showNotification.bind(this)} className="btn-next">Save</Button>
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
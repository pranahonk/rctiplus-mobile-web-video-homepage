import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { showAlert } from '../../utils/helpers';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';

//load default layout
import Layout from '../../components/Layouts/Default_v2';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, FormGroup, Row, Col, Container } from 'reactstrap';
import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';


import '../../assets/scss/components/interest.scss';
// import '../../assets/scss/components/signin.scss';

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
						Router.push('/');
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
			<Layout title={SITEMAP.interest.title}>
				<meta name="description" content={SITEMAP.interest.description}/>
				<meta name="keywords" content={SITEMAP.interest.keywords}/>
				<meta property="og:title" content={SITEMAP.interest.title} />
				<meta property="og:description" content={SITEMAP.interest.description} />
				<meta property="og:image" itemProp="image" content={SITEMAP.interest.image} />
				<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
				<meta property="og:image:type" content="image/jpeg" />
				<meta property="og:image:width" content="600" />
				<meta property="og:image:height" content="315" />
				<meta property="og:site_name" content={SITE_NAME} />
				<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
				<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
				<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
				<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
				<meta name="twitter:image" content={SITEMAP.interest.image} />
				<meta name="twitter:image:alt" content={SITEMAP.interest.title} />
				<meta name="twitter:title" content={SITEMAP.interest.title} />
				<meta name="twitter:description" content={SITEMAP.interest.description} />
				<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
				<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				<NavBack title="Choose Interest" />
				<div className="wrapper-content" style={{ marginTop: 40 }}>
					<div className="login-box" style={{ width: '100%' }}>
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
})(withRouter(Interest));
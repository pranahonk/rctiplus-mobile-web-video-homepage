import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import userActions from '../../redux/actions/userActions';
import pageActions from '../../redux/actions/pageActions';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import { showAlert } from '../../utils/helpers';
import { accountContactUsFormEvent } from '../../utils/appier';

import '../../assets/scss/components/contact-us.scss';
import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';

import { Form, FormGroup, Label, Input, InputGroup, FormFeedback, Button } from 'reactstrap';

class ContactUs extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            fullname_invalid: false,
            fullname_invalid_message: '',
            email: '',
            email_invalid: false,
            email_invalid_message: '',
            phone: '',
            phone_invalid: false,
            phone_invalid_message: '',
            comment: '',
            comment_invalid: false,
            comment_invalid_message: ''
        };

        this.props.setPageLoader();
    }

    componentDidMount() {
        this.props.getUserData()
            .then(response => {
                const data = response.data.data;
                this.setState({
                    fullname: data.display_name,
                    email: data.email,
                    phone: data.phone_number
                }, () => this.props.unsetPageLoader());
            })
            .catch(error => {
                console.log(error);
                this.props.unsetPageLoader();
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.setPageLoader();
        this.props.contactUs({
                name: this.state.fullname,
                phone: this.state.phone,
                email: this.state.email,
                comment: this.state.comment
            })
            .then(response => {
                this.props.unsetPageLoader();
                if (response.status === 200) {
                    accountContactUsFormEvent(this.state.comment, 'mweb_account_contact_us_form');
                    showAlert(response.data.status.message_client, 'Success', 'OK', '', () => Router.push('/profile'));
                }
                else {
                    showAlert(response.data.status.message_client, 'Error', 'OK');
                }
            })
            .catch(error => {
                this.props.unsetPageLoader();
                console.log(error);
                if (error.status === 200) {
                    showAlert(response.data.status.message_client, 'Error', 'OK');
                }

                showAlert('Unknown error occured. Please try again.', 'Error', 'OK');
            });
    }

    onChangeFullname(e) {
        this.setState({ fullname: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePhone(e) {
        this.setState({ phone: e.target.value });
    }

    onChangeComment(e) {
        this.setState({ comment: e.target.value });
    }

    render() {
        return (
            <Layout title={SITEMAP.contact_us.title}>
				<Head>
					<meta name="description" content={SITEMAP.contact_us.description}/>
					<meta name="keywords" content={SITEMAP.contact_us.keywords}/>
                    <meta property="og:title" content={SITEMAP.contact_us.title} />
					<meta property="og:description" content={SITEMAP.contact_us.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.contact_us.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
                    <meta property="og:type" content="website" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.contact_us.image} />
					<meta name="twitter:image:alt" content={SITEMAP.contact_us.title} />
					<meta name="twitter:title" content={SITEMAP.contact_us.title} />
					<meta name="twitter:description" content={SITEMAP.contact_us.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
                <NavBack title="Contact Us"/>
                <div className="wrapper-content container-box-cu">
                    <div className="description-cu">
                        We're happy to listen to your stories and help your problem.
                    </div>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup>
                            <Label className="form-label-cu" for="fullname">Fullname</Label>
                            <InputGroup>
                                <Input
                                    value={this.state.fullname}
                                    onChange={this.onChangeFullname.bind(this)}
                                    invalid={this.state.fullname_invalid}
                                    className="form-control-cu" />
                                <FormFeedback valid={!this.state.fullname_invalid && !!this.state.fullname}>{this.state.fullname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-cu" for="email">Email</Label>
                            <InputGroup>
                                <Input
                                    value={this.state.email}
                                    type="email"
                                    onChange={this.onChangeEmail.bind(this)}
                                    invalid={this.state.email_invalid}
                                    className="form-control-cu" />
                                <FormFeedback valid={!this.state.email_invalid && !!this.state.email}>{this.state.email_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-cu" for="phone">Phone Number</Label>
                            <InputGroup>
                                <Input
                                    value={this.state.phone}
                                    onChange={this.onChangePhone.bind(this)}
                                    invalid={this.state.phone_invalid}
                                    className="form-control-cu" />
                                <FormFeedback valid={!this.state.phone_invalid && !!this.state.phone}>{this.state.phone_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-cu" for="comment">Your Stories</Label>
                            <InputGroup>
                                <Input
                                    type="textarea"
                                    rows={4}
                                    value={this.state.comment}
                                    onChange={this.onChangeComment.bind(this)}
                                    invalid={this.state.comment_invalid}
                                    className="form-control-cu" />
                                <FormFeedback valid={!this.state.comment_invalid && !!this.state.comment}>{this.state.comment_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={!this.state.fullname || !this.state.phone || !this.state.email || !this.state.comment} className="btn-next btn-block">Save</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...userActions,
    ...pageActions
})(withRouter(ContactUs));
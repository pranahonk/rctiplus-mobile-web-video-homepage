import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import registerActions from '../../redux/actions/registerActions';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from 'reactstrap';

import '../../assets/scss/components/change-username.scss';

class ChangeUsername extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username_invalid: false,
            username_invalid_message: '',
            username: this.props.registration.username
        };
        this.subject = new Subject();
        this.props.setUsernameType('PHONE_NUMBER');
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value }, () => {
            this.subject.next();
        });

    }

    submitChangeUsername(e) {
        e.preventDefault();
        this.props.setUsername(this.state.username);
        Router.push('/register/phone/step2');
    }

    componentDidMount() {
        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                let username = this.state.username;
                if (this.props.registration.username_type == 'PHONE_NUMBER') {
                    username = '62' + username;
                }

                if (this.state.username) {
                    this.props.checkUser(username)
                        .then(response => {
                            if (response.status === 200) {
                                const message = response.data.status.message_client;
                                if (this.props.registration.username_type == 'PHONE_NUMBER') {
                                    this.setState({
                                        username_invalid: message != 'Your phone is Available' || response.data.status.code == 1,
                                        username_invalid_message: message
                                    });
                                    this.props.showNotification(message, message == 'Your phone is Available' && response.data.status.code == 0);
                                }
                                else {
                                    this.setState({
                                        username_invalid: message != 'Your email is Available' || response.data.status.code == 1,
                                        username_invalid_message: message
                                    });
                                    this.props.showNotification(message, message == 'Your email is Available' || response.data.status.code == 0);
                                }

                                setTimeout(() => {
                                    this.props.hideNotification();
                                }, 5000);
                            }
                        })
                        .catch(error => console.log(error));
                }
            });
    }

    render() {
        return (
            <Layout title={'Change ' + (this.props.registration.username_type == 'PHONE_NUMBER' ? 'Phone Number' : 'Email')}>
                <NavBack title={'Change ' + (this.props.registration.username_type == 'PHONE_NUMBER' ? 'Phone Number' : 'Email')} />
                <div className="container-box-c">
                    <Form onSubmit={this.submitChangeUsername.bind(this)}>
                        <FormGroup>
                            <Label className="form-label-c" for="phone">{(this.props.registration.username_type == 'PHONE_NUMBER' ? 'Phone Number' : 'Email')}</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText className="form-control-c addon-left-c">+62</InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    onChange={this.onChangeUsername.bind(this)}
                                    valid={!this.state.username_invalid && !!this.state.username}
                                    invalid={this.state.username_invalid}
                                    className="form-control-c" />
                                {/* <FormFeedback valid={!this.state.username_invalid && !!this.state.username}>{this.state.username_invalid_message}</FormFeedback> */}
                            </InputGroup>
                            <FormText className="form-text-c">
                                <ul>
                                    <li>Make sure the phone number is active because we will sent you verification code to verified and secure your account</li>
                                </ul>
                            </FormText>
                        </FormGroup>
                        <FormGroup>
                            <Button className="btn-next block-btn">Save</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registerActions,
    ...notificationActions,
    ...userActions
})(ChangeUsername);
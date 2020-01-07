import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import registerActions from '../../redux/actions/registerActions';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import '../../assets/scss/components/forget-password.scss';

class ForgetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            username_invalid: false,
            username_invalid_message: ''
        };

        this.subject = new Subject();
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value }, () => {
            this.props.setUsername(this.state.username);
            if (this.state.username.length < 6) {
                this.setState({
                    username_invalid: true,
                    username_invalid_message: 'Username must at least 6 characters'
                }, () => this.subject.next());
            }
            else {
                this.setState({
                    username_invalid_message: ''
                }, () => this.subject.next());
            }
        });
    }

    submitUsername(e) {
        e.preventDefault();
        Router.push('/forget-password/verify-otp');
    }

    componentDidMount() {
        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                if (this.state.username && this.state.username.length >= 6) {
                    this.props.checkUser(this.state.username)
                        .then(response => {
                            if (response.status === 200) {
                                const message = response.data.status.message_client;
                                if (message == 'please try again, phone has been taken' || message == 'please try again, email has been taken') {
                                    this.setState({
                                        username_invalid: false,
                                        username_invalid_message: 'Username exist'
                                    });
                                    this.props.setUsernameType(message == 'please try again, email has been taken' ? 'EMAIL' : 'PHONE_NUMBER');
                                }
                                else {
                                    if (response.data.status.code != 0) {
                                        this.setState({
                                            username_invalid: true,
                                            username_invalid_message: message
                                        });
                                    }
                                    else {
                                        this.setState({
                                            username_invalid: true,
                                            username_invalid_message: ''
                                            // username_invalid_message: 'Username does not exist'
                                        });
                                        
                                    }
                                    
                                }
                                
                            }
                        })
                        .catch(error => console.log(error));
                }
            });
    }

    render() {
        return (
            <Layout title="Forget Password">
                <NavBack title="Forget Password"/>
                <div className="container-box-cp">
                    <Form onSubmit={this.submitUsername.bind(this)}>
                        <FormGroup>
                            <Label for="username">Email or Phone Number</Label>
                            <InputGroup>
                                <Input 
                                    onChange={this.onChangeUsername.bind(this)}
                                    valid={false && !this.state.username_invalid && !!this.state.username}
                                    invalid={this.state.username_invalid}
                                    className="form-control-cp"/>
                                <FormFeedback valid={false && !this.state.username_invalid && !!this.state.username}>{this.state.username_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={this.state.username == '' || this.state.username_invalid} className="btn-next block-btn">Next</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registerActions,
    ...userActions,
    ...notificationActions
})(ForgetPassword);
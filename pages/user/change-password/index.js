import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

import registerActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import notificationActions from '../../../redux/actions/notificationActions';

import Layout from '../../../components/Layouts/Default_v2';
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import '../../../assets/scss/components/change-password.scss';

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current_password: '',
            password: '',
            confirm_password: '',
            current_password_invalid: false,
            password_match_invalid: false,
            at_least_eight_invalid: false,
            password_cannot_same:false,
            view_raw: false,
            view_raw_re: false,
            view_raw_cu: false,
            user: this.props.user,
        };
    }

    componentDidMount() {
        console.log(this.props);
    }
    
    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.props.user) {
            this.setState({
                user: nextProps.user.data,
            });
        }
      }

    handleSubmit(e) {
        console.log(this.state.user)
        e.preventDefault();
        this.props.verify({ password: this.state.current_password })
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    this.props.setChangePasswordData(this.state.current_password, this.state.password, this.state.confirm_password);
                    if (this.state.user.email) {
                        this.props.setUsernameType('EMAIL');
                        this.props.setUsername(this.state.user.email);
                    }
                    else {
                        this.props.setUsernameType('PHONE_NUMBER');
                        this.props.setUsername(this.state.user.phone_number);
                    }
                    Router.push('/user/change-password/verify-otp');
                }
                else {
                    this.setState({ current_password_invalid: true });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ current_password_invalid: true });
            });
    }

    togglePassword(type = '') {
        if (type == 're') {
            this.setState({ view_raw_re: !this.state.view_raw_re });
        }
        else if (type == 'cu') {
            this.setState({ view_raw_cu: !this.state.view_raw_cu });
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
            at_least_eight_invalid: !(passwordLength >= 8),
            password_cannot_same: !(password !== this.state.current_password),
		}, () => {
			this.props.setPassword(this.state.password);
		});
    }
    
    onCurrentPasswordChange(e) {
        let currentPassword = e.target.value;
        this.setState({
            current_password: currentPassword
        });
    }

	onConfirmPasswordChange(e) {
		let confirmPassword = e.target.value;
		this.setState({
			confirm_password: confirmPassword,
			password_match_invalid: !(this.state.password === confirmPassword)
		});
    }

    render() {
        return (
            <Layout title="Change Password">
                <NavBack title="Change Password"/>
                <div className="container-box-c">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormGroup>
                            <Label className="label-c" for="password">Current Password</Label>
                            <InputGroup>
                                <Input
                                    className="form-control-cp"
                                    type={this.state.view_raw_cu ? 'text' : 'password'}
                                    name="password"
                                    id="current-password"
                                    placeholder="insert password"
                                    invalid={this.state.current_password_invalid}
                                    onChange={this.onCurrentPasswordChange.bind(this)} />
                                <div onClick={this.togglePassword.bind(this, 'cu')} className={'view-raw-c ' + (this.state.view_raw_cu ? 'fas_fa-eye-slash' : 'fas_fa-eye')}></div>
                                <FormFeedback>please try again again, password is incorrect</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="label-c" for="password">New Password</Label>
                            <InputGroup>
                                <Input
                                    className="form-control-cp"
                                    type={this.state.view_raw ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="insert password"
                                    invalid={this.state.at_least_eight_invalid || this.state.password_cannot_same}
                                    onChange={this.onPasswordChange.bind(this)} />
                                <div onClick={this.togglePassword.bind(this)} className={'view-raw-c ' + (this.state.view_raw ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.at_least_eight_invalid ? 'invalid-border-color' : '')}></div>
                                <FormFeedback>
                                    {this.state.password === this.state.current_password ? `Password can't same with old password` : 'Password must at least 8 character'}
                                </FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="label-c" for="password">Re-type New Password</Label>
                            <InputGroup>
                                <Input
                                    className="form-control-cp"
                                    type={this.state.view_raw_re ? 'text' : 'password'}
                                    name="password2"
                                    id="password2"
                                    placeholder="insert password"
                                    invalid={this.state.password_match_invalid}
                                    onChange={this.onConfirmPasswordChange.bind(this)} />
                                <div onClick={this.togglePassword.bind(this, 're')} className={'view-raw-c ' + (this.state.view_raw_re ? 'fas_fa-eye-slash' : 'fas_fa-eye') + ' ' + (this.state.password_match_invalid ? 'invalid-border-color' : '')}></div>
                                <FormFeedback>Password must match</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={this.state.password == '' || this.state.confirm_password == '' || (this.state.password != this.state.confirm_password) || this.state.password_match_invalid || this.state.at_least_eight_invalid} className="btn-next block-btn">Save</Button>
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
})(ChangePassword);
import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import dynamic from 'next/dynamic';

import registerActions from '../../redux/actions/registerActions';
import userActions from '../../redux/actions/userActions';
import notificationActions from '../../redux/actions/notificationActions';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import countryList from '../../redux/actions/othersActions';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback, InputGroupAddon, InputGroupText } from 'reactstrap';

import '../../assets/scss/components/forget-password.scss';

const CountryList = dynamic(() => import('../../components/Modals/CountryList'));

class ForgetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            username_invalid: false,
            username_invalid_message: '',
            status: false,
			codeCountry: 'ID',
			phone_code: '62',
            isPhoneNumber: false,
            changeCode: 0,
        };

        this.subject = new Subject();
    }

    onChangeUsername(e) {
        const regex = /^[0-9]+$/;
        let value = e.target.value;
		if (regex.test(value) && value.length >= 3) {
			if (value) {
				if (value.charAt(0) === '0') {
					value = value.slice(1);
                }
            this.setState({ isPhoneNumber: true });
            this.props.setPhoneCode(this.state.phone_code);
            // console.log('PHONE');
            }
        } 
        if(!(regex.test(value) && value.length >= 3)) {
            this.setState({ isPhoneNumber: false });
            this.props.setPhoneCode('');
			// console.log('EMAIL');
        }
        // console.log(value)
        this.setState({ username: value }, () => {
            this.props.setUsername(value);
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

    checkUser () {
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
                        else if (message == 'Your phone is Available' || message == 'Your email is Available') {
                            this.setState({
                                username_invalid: true,
                                username_invalid_message: 'Please Check Your Email'
                            });
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
    }
    componentDidMount() {
        this.props.getListCountry();
        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.checkUser()
            });
    }

    // componentDidUpdate() {
    //     console.log(this.state.username)
    // }

    removeCountryCode(value, phone_code) {
        if (this.state.changeCode === 0 ) {
            return value;
        }
        console.log('REMOVE NUMBER: ', value, phone_code)
        let result = value;
            result = value.slice(phone_code.length)
        console.log('RESULT: ', result)
        return result;
    }

    render() {
        const { state, props } = this;
        return (
            <Layout title="Lupa Password - RCTI+">
                <NavBack title="Forget Password"/>
                <div className="container-box-cp">
                    <Form onSubmit={this.submitUsername.bind(this)}>
                        <FormGroup>
                            <Label for="username">Email or Phone Number</Label>
                            <InputGroup>
                                <Input 
                                    id="input-email-phone"
                                    onChange={this.onChangeUsername.bind(this)}
                                    valid={false && !this.state.username_invalid && !!this.state.username}
                                    invalid={this.state.username_invalid}
                                    className={'form-control-cp ' + (state.isPhoneNumber ? 'none-border-right' : 'right-border-radius')}/>
                                    { state.isPhoneNumber ? (
                                        <InputGroupAddon onClick={ () => this.setState({ status: !state.status }) } addonType="append" id="action-country-code">
                                            <InputGroupText className={'append-input right-border-radius ' + (state.username_invalid ? 'invalid-border-color' : '')}>
                                                {this.state.codeCountry}<KeyboardArrowDownIcon/>
                                            </InputGroupText>
                                        </InputGroupAddon>
										) : '' }
                                <FormFeedback id="invalid-feedback" valid={false && !this.state.username_invalid && !!this.state.username}>{this.state.username_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button id="button-next" disabled={this.state.username == '' || this.state.username_invalid} className="btn-next block-btn">Next</Button>
                        </FormGroup>
                    </Form>
                </div>
                {this.state.status ? (
					<CountryList
						data={this.props.others.list_country}
						modal={state.status}
						toggle={() => this.setState({ status: !state.status })}
						getCountryCode={(e) => {
								this.props.setPhoneCode(e.phone_code);
								this.setState({ 
                                    changeCode: state.changeCode + 1,
                                    codeCountry: e.code, 
                                    phone_code: e.phone_code, 
                                    username: e.phone_code + this.removeCountryCode(state.username, state.phone_code) }, () => {
                                        {/* this.subject.next() */}
                                        this.checkUser()
                                    });}
							}
						className="country-list-modal"/>) : ''}
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registerActions,
    ...userActions,
    ...notificationActions,
    ...countryList,
})(ForgetPassword);
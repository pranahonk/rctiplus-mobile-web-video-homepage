import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import dynamic from 'next/dynamic';
import queryString from 'query-string';

import registerActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import notificationActions from '../../../redux/actions/notificationActions';
import othersActions from '../../../redux/actions/othersActions';

import Layout from '../../../components/Layouts/Default';
import NavBack from '../../../components/Includes/Navbar/NavBack';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback, InputGroupAddon, InputGroupText } from 'reactstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../../../assets/scss/components/form-field.scss';

import { accountGeneralEvent } from '../../../utils/appier';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RE_CAPTCHA_SITE_KEY } from '../../../config';

const CountryList = dynamic(() => import('../../../components/Modals/CountryList'));

class FormField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.user[this.props.user.data_key[this.props.others.index]],
            value_invalid: false,
            value_invalid_message: '',
            status: false,
			codeCountry: 'ID',
			phone_code: '62',
            token: null,
        };

        this.subject = new Subject();
        this.ref = null;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    onChange(e) {
        this.setState({token: null})
        this.props.hideNotification()
        if (this.props.others.label === 'Full Name' && e.target.value.length > 25) {
            this.props.showNotification('full name: max length is 25', false);
            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
        }
        else if (this.props.others.label === 'Phone Number' && e.target.value.length > 15) {
            this.props.showNotification('phone number: max length is 15', false);
            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
        }
        else {
            this.setState({ value: this.props.user.data_key[this.props.others.index] == 'dob' ? e : e.target.value, value_invalid: false }, () => {
                this.props.setValue(this.props.others.index, this.state.value);
                switch (this.props.others.label) {
                    case 'Nickname (Live Chat)':
                        this.subject.next();
                        break;

                    case 'Full Name':
                        if (this.state.value.length < 4) {
                            this.props.showNotification('full name: min length is 4', false);
                            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
                            this.setState({ value_invalid: true });
                        }
                        break;

                    case 'Phone Number':
                        if (this.state.value.length < 9) {
                            this.props.showNotification('phone number: min length is 9', false);
                            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
                            this.setState({ value_invalid: true });
                        }
                        break;
                }
            });
        }
        
    }
    isUser(value, phone_code = null) {
        this.props.checkUser(value, phone_code )
        .then(response => {
            // console.log(response);
            if (response.status === 200 && response.data.status.code !== 0) {
                this.props.showNotification(response.data.status.message_server, false);
            }
            else {
                accountGeneralEvent('mweb_account_edit_profile_form');
                this.props.setUsername(value);
                if (this.props.user.data_key[this.props.others.index] === 'phone_number') {
                    this.props.setUsernameType('PHONE_NUMBER');
                    this.props.setPhoneCode(this.state.phone_code);
                }
                else {
                    this.props.setUsernameType('EMAIL');
                    this.props.setPhoneCode('');
                }
                Router.push('/user/edit/verify-otp');
            }
            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
        })
        .catch(error => {
            if (error.status == 200) {
                this.props.showNotification(error.data.status.message_server, false);
            }
            setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
            console.log(error);
        });
    }

    handleChangeToken(token) {
		if(this.state.token) return;

		this.setState({ token });
		this.props.setToken(token);
	}


    onSubmit(e) {
        e.preventDefault();
        // this.props.showNotification('*Checking nickname availability...');
        let value = this.state.value;
        
        switch (this.props.user.data_key[this.props.others.index]) {
            case 'dob':
                value = this.formatDate(this.state.value);
                break;

            case 'gender':
                value = value.toLowerCase();
                break;

            case 'phone_number':
                if(value) {
                    if (value.charAt(0) === '0') {
                        value = value.slice(1);
                    } else {
                        value = value;
                    }
                } else {
                    value = value;
                }
                this.isUser(value, this.state.phone_code)
                return;
            case 'email':
                this.isUser(value)
                return;
        }


        this.props.updateUserData(this.props.user.data_key[this.props.others.index], value)
            .then(response => {
                accountGeneralEvent('mweb_account_edit_profile_form');
                this.props.showNotification('*Your data is saved');
                setTimeout(() => { 
                    this.props.hideNotification() 
                    Router.back();
                }, 1500);
            })
            .catch(error => {
                if (error.status == 200) {
                    this.props.showNotification(error.data.status.message_server, false);
                }
                setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
                console.log(error);
            });
    }
    componentDidUpdate() {
        // console.log(this.props.user.data)
    }
    componentDidMount() {
        // console.log(this.props)
        this.setState({ codeCountry: (this.props.user && this.props.user.data && this.props.user.data?.country_code === '') ||
                                    (this.props.user && this.props.user.data && this.props.user.data?.country_code === null) ? this.state.codeCountry : this.props?.user?.data?.country_code,
                        phone_code: (this.props.user && this.props.user.data && this.props.user.data?.phone_code === '') ||
                                    (this.props.user && this.props.user.data && this.props.user.data?.phone_code === null) ? this.state.phone_code : this.props.user.data?.phone_code});
        console.log(this.props.user && this.props.user.data)
        this.ref = queryString.parse(location.search).ref
        this.props.getListCountry();
        let value = this.state.value;
        if (this.props.user.data_key[this.props.others.index] == 'gender') {
            value = value.charAt(0).toUpperCase() + value.substring(1);
        }
        else if (this.props.user.data_key[this.props.others.index] == 'phone_number' && value && value.length > 2) {
            // value = value.substring(2);
            value = value;
        }

        this.setState({ value: value }, () => {
            if (this.props.others.label === 'Nickname (Live Chat)') {
                this.subject
                    .pipe(debounceTime(500))
                    .subscribe(() => {
                        
                            this.props.verify({ nickname: this.state.value })
                                .then(response => {
                                    // console.log('test', response);
                                    if (response.data.status.code !== 0) {
                                        // console.log('nickname false')
                                        this.setState({ value_invalid: true });
                                        this.props.showNotification(response.data.status.message_server, false);
                                        return false;
                                    }
                                    // console.log('nickname true')
                                    this.setState({ value_invalid: false });
                                    this.props.hideNotification()
                                    // this.props.showNotification(response.data.status.message_server, true);
                                })
                                .catch(error => {
                                    // console.log('test2', error);
                                    if (error.status === 200) {
                                        this.props.showNotification(error.data.status.message_server, false);
                                        setTimeout(() => this.props.hideNotification(), 2 * 60 * 1000);
                                        this.setState({ value_invalid: true });
                                    }
                                });
                    });
                
                this.subject.next();
            }
        });
    }
    componentWillUnmount() {
        this.props.hideNotification()
    }
    render() {
        const { state, props } = this;
        let formField = null;
        // console.log(this.props.others)
        switch (this.props.others.field_type) {
            case 'text':
                formField = (
                    <FormGroup>
                            <Label for={this.props.others.label}>{this.props.others.label}</Label>
                            <InputGroup>
                                <Input
                                    id="form-field"
                                    value={this.state.value}
                                    onChange={this.onChange.bind(this)}
                                    valid={false && !this.state.value_invalid && !!this.state.value}
                                    // invalid={this.state.value_invalid}
                                    placeholder={this.props.others.placeholder}
                                    className="form-control-ff" />
                                <FormFeedback valid={false && !this.state.value_invalid && !!this.state.value}>{this.state.text_data_invalid_message}</FormFeedback>
                            </InputGroup>
                            <div id="notes" dangerouslySetInnerHTML={{ __html: this.props.others.notes }}></div>
                        </FormGroup>
                )
                break;
            case 'email':
                formField = (
                    <GoogleReCaptchaProvider
                    language="id"
                    reCaptchaKey={RE_CAPTCHA_SITE_KEY}
                    >
                        <FormGroup>
                            <Label for={this.props.others.label}>{this.props.others.label}</Label>
                            <InputGroup>
                                <Input
                                    id="form-field"
                                    value={this.state.value}
                                    onChange={this.onChange.bind(this)}
                                    valid={false && !this.state.value_invalid && !!this.state.value}
                                    // invalid={this.state.value_invalid}
                                    placeholder={this.props.others.placeholder}
                                    className="form-control-ff" />
                                <FormFeedback valid={false && !this.state.value_invalid && !!this.state.value}>{this.state.text_data_invalid_message}</FormFeedback>
                            </InputGroup>
                            <div id="notes" dangerouslySetInnerHTML={{ __html: this.props.others.notes }}></div>
                            <FormGroup>
                                <GoogleReCaptcha
                                    onVerify={this.handleChangeToken.bind(this)}
                                />
                            </FormGroup>
                        </FormGroup>
                    </GoogleReCaptchaProvider>
                );
                break;

            case 'select':
                formField = (
                    <FormGroup>
                        <Label for={this.props.others.label}>{this.props.others.label}</Label>
                        <InputGroup>
                            <Input
                                id="form-field"
                                type="select"
                                value={this.state.value}
                                onChange={this.onChange.bind(this)}
                                invalid={this.state.value_invalid}
                                className="form-control-ff">
                                {this.props.others.option_data.map((d, i) => <option key={i}>{d}</option>)}
                            </Input>
                        </InputGroup>
                    </FormGroup>
                );
                break;

            case 'phone':
                formField = (
                    <GoogleReCaptchaProvider
                    language="id"
                    reCaptchaKey={RE_CAPTCHA_SITE_KEY}
                    >
                        <FormGroup className="frmInput1">
                            <Label for={this.props.others.label}>{this.props.others.label}</Label>
                            <InputGroup>
                                {/* <InputGroupAddon addonType="prepend">
                                    <InputGroupText className={'form-control-ff addon-left'}>+62</InputGroupText>
                                </InputGroupAddon> */}
                                <Input
                                    className="form-control-ff none-border-radius"
                                    type="number"
                                    name="text"
                                    id="phone_number"
                                    value={this.state.value}
                                    placeholder={this.props.others.placeholder}
                                    onChange={this.onChange.bind(this)}
                                    invalid={this.state.value_invalid} 
                                    />
                                    <InputGroupAddon onClick={ () => this.setState({ status: !state.status }) } addonType="append" id="action-country-code">
                                        <InputGroupText className={'append-input rplus-border-bottom ' + (state.is_username_invalid ? 'invalid-border-color' : '')}>
                                            {this.state.codeCountry}<KeyboardArrowDownIcon/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                <FormFeedback>{this.state.value_invalid_message}</FormFeedback>
                            </InputGroup>
                            <div id="notes" dangerouslySetInnerHTML={{ __html: this.props.others.notes }}></div>
                        </FormGroup>
                        <FormGroup>
                            <GoogleReCaptcha
                                onVerify={this.handleChangeToken.bind(this)}
                            />
                        </FormGroup>
                    </GoogleReCaptchaProvider>
                );
                break;

            case 'date':
                formField = (
                    <FormGroup>
                        <Label className="form-label" for="birthdate">Birthdate</Label>
                        <DatePicker
                            id="form-field"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            maxDate={Date.now()}
                            onChange={this.onChange.bind(this)}
                            invalid={this.state.value_invalid}
                            selected={this.state.value}
                            withPortal />
                    </FormGroup>
                );
                break;
        }

        let saveButton = (<Button id="save-edit" disabled={this.state.value == '' || this.state.value_invalid} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
        if (this.props.others.disabled_condition != null) {
            switch (this.props.others.disabled_condition.type) {
                case 'min':
                    saveButton = (<Button id="save-edit" disabled={this.state.value == '' || this.state.value_invalid || this.state.value.length <= this.props.others.disabled_condition.length} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
                    break;

                case 'max':
                    saveButton = (<Button id="save-edit" disabled={this.state.value == '' || this.state.value_invalid || this.state.value.length > this.props.others.disabled_condition.length} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
                    break;
            }
            
        }

        return (
            <Layout title={this.props.others.label}>
                <NavBack title="Edit Profile" />
                <div className="container-box-ff">
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        {formField}                        
                        <FormGroup>
                            {saveButton}
                        </FormGroup>
                    </Form>
                    {this.state.status ? (
					<CountryList
						data={this.props.others.list_country}
						modal={state.status}
						toggle={() => this.setState({ status: !state.status })}
						getCountryCode={(e) => {
								this.props.setPhoneCode(e.phone_code);
								this.setState({ 
									codeCountry: e.code, 
									phone_code: e.phone_code,
									});}
							}
						className="country-list-modal"/>) : ''}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...registerActions,
    ...userActions,
    ...notificationActions,
    ...othersActions
})(FormField);
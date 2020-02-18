import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import registerActions from '../../../redux/actions/registerActions';
import userActions from '../../../redux/actions/userActions';
import notificationActions from '../../../redux/actions/notificationActions';
import othersActions from '../../../redux/actions/othersActions';

import Layout from '../../../components/Layouts/Default';
import NavBack from '../../../components/Includes/Navbar/NavBack';

import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback, InputGroupAddon, InputGroupText } from 'reactstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../../../assets/scss/components/form-field.scss';

import { accountGeneralEvent } from '../../../utils/appier';

class FormField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.user[this.props.user.data_key[this.props.others.index]],
            value_invalid: false,
            value_invalid_message: ''
        };

        this.subject = new Subject();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    onChange(e) {
        if (this.props.others.label === 'Full Name' && e.target.value.length > 25) {
            this.props.showNotification('full name: max length is 25', false);
            setTimeout(() => this.props.hideNotification(), 3000);
        }
        else if (this.props.others.label === 'Phone Number' && e.target.value.length > 15) {
            this.props.showNotification('phone number: max length is 15', false);
            setTimeout(() => this.props.hideNotification(), 3000);
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
                            setTimeout(() => this.props.hideNotification(), 3000);
                            this.setState({ value_invalid: true });
                        }
                        break;

                    case 'Phone Number':
                        if (this.state.value.length < 9) {
                            this.props.showNotification('phone number: min length is 9', false);
                            setTimeout(() => this.props.hideNotification(), 3000);
                            this.setState({ value_invalid: true });
                        }
                        break;
                }
            });
        }
        
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.showNotification('*Checking nickname availability...');
        let value = this.state.value;
        
        switch (this.props.user.data_key[this.props.others.index]) {
            case 'dob':
                value = this.formatDate(this.state.value);
                break;

            case 'gender':
                value = value.toLowerCase();
                break;

            case 'phone_number':
                value = '62' + value;
            case 'email':
                this.props.checkUser(value)
                    .then(response => {
                        console.log(response);
                        if (response.status === 200 && response.data.status.code !== 0) {
                            this.props.showNotification(response.data.status.message_server, false);
                        }
                        else {
                            accountGeneralEvent('mweb_account_edit_profile_form');
                            this.props.setUsername(value);
                            if (this.props.user.data_key[this.props.others.index] === 'phone_number') {
                                this.props.setUsernameType('PHONE_NUMBER');
                            }
                            else {
                                this.props.setUsernameType('EMAIL');
                            }
                            Router.push('/user/edit/verify-otp');
                        }
                        setTimeout(() => this.props.hideNotification(), 3000);
                    })
                    .catch(error => {
                        if (error.status == 200) {
                            this.props.showNotification(error.data.status.message_server, false);
                        }
                        setTimeout(() => this.props.hideNotification(), 3000);
                        console.log(error);
                    });
                return;
        }


        this.props.updateUserData(this.props.user.data_key[this.props.others.index], value)
            .then(response => {
                accountGeneralEvent('mweb_account_edit_profile_form');
                this.props.showNotification('*Your data is saved');
                setTimeout(() => this.props.hideNotification(), 3000);
                Router.back();
            })
            .catch(error => {
                if (error.status == 200) {
                    this.props.showNotification(error.data.status.message_server, false);
                }
                setTimeout(() => this.props.hideNotification(), 3000);
                console.log(error);
            });
    }

    componentDidMount() {
        let value = this.state.value;
        if (this.props.user.data_key[this.props.others.index] == 'gender') {
            value = value.charAt(0).toUpperCase() + value.substring(1);
        }
        else if (this.props.user.data_key[this.props.others.index] == 'phone_number' && value && value.length > 2) {
            value = value.substring(2);
        }

        this.setState({ value: value }, () => {
            if (this.props.others.label === 'Nickname (Live Chat)') {
                this.subject
                    .pipe(debounceTime(500))
                    .subscribe(() => {
                        
                            this.props.verify({ nickname: this.state.value })
                                .then(response => {
                                    console.log(response);
                                    this.setState({ value_invalid: false });
                                })
                                .catch(error => {
                                    if (error.status === 200) {
                                        this.setState({ value_invalid: true });
                                    }
                                });
                    });
                
                this.subject.next();
            }
        });
    }

    render() {
        let formField = null;
        switch (this.props.others.field_type) {
            case 'text':
            case 'email':
                formField = (
                    <FormGroup>
                        <Label for={this.props.others.label}>{this.props.others.label}</Label>
                        <InputGroup>
                            <Input
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
                );
                break;

            case 'select':
                formField = (
                    <FormGroup>
                        <Label for={this.props.others.label}>{this.props.others.label}</Label>
                        <InputGroup>
                            <Input
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
                    <FormGroup className="frmInput1">
                        <Label for={this.props.others.label}>{this.props.others.label}</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText className={'form-control-ff addon-left'}>+62</InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-ff"
                                type="number"
                                name="text"
                                id="phone_number"
                                value={this.state.value}
                                placeholder={this.props.others.placeholder}
                                onChange={this.onChange.bind(this)}
                                invalid={this.state.value_invalid} 
                                />
                            <FormFeedback>{this.state.value_invalid_message}</FormFeedback>
                        </InputGroup>
                        <div id="notes" dangerouslySetInnerHTML={{ __html: this.props.others.notes }}></div>
                    </FormGroup>
                );
                break;

            case 'date':
                formField = (
                    <FormGroup>
                        <Label className="form-label" for="birthdate">Birthdate</Label>
                        <DatePicker
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            onChange={this.onChange.bind(this)}
                            invalid={this.state.value_invalid}
                            selected={this.state.value}
                            withPortal />
                    </FormGroup>
                );
                break;
        }

        let saveButton = (<Button disabled={this.state.value == '' || this.state.value_invalid} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
        if (this.props.others.disabled_condition != null) {
            switch (this.props.others.disabled_condition.type) {
                case 'min':
                    saveButton = (<Button disabled={this.state.value == '' || this.state.value_invalid || this.state.value.length <= this.props.others.disabled_condition.length} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
                    break;

                case 'max':
                    saveButton = (<Button disabled={this.state.value == '' || this.state.value_invalid || this.state.value.length > this.props.others.disabled_condition.length} className="btn-next block-btn">{this.props.others.need_otp ? 'Verify' : 'Save'}</Button>);
                    break;
            }
            
        }

        return (
            <Layout title={this.props.others.label}>
                <NavBack title={this.props.others.label} />
                <div className="container-box-ff">
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        {formField}                        
                        <FormGroup>
                            {saveButton}
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
    ...notificationActions,
    ...othersActions
})(FormField);
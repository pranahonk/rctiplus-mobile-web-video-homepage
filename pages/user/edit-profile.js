import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import initialize from '../../utils/initialize';
import Actionsheet from '../../assets/js/react-actionsheet/lib';

import userActions from '../../redux/actions/userActions';
import othersActions from '../../redux/actions/othersActions';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import '../../assets/scss/components/edit-profile.scss';


class EditProfile extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            nickname_invalid: false,
            nickname_invalid_message: '',
            email: '',
            email_invalid: false,
            email_invalid_message: '',
            phone_number: '',
            phone_number_invalid: false,
            phone_number_invalid_message: '',
            fullname: '',
            fullname_invalid: false,
            fullname_invalid_message: '',
            birthdate: new Date(),
            birthdate_invalid: false,
            birthdate_invalid_message: '',
            gender: '',
            gender_invalid: false,
            gender_invalid_message: '',
            location: '',
            location_invalid: false,
            location_invalid_message: '',
            location_data: [],
            otp: '',
            show_action_sheet: false
        };
    }

    componentDidMount() {
        this.props.getUserData()
            .then(response => {
                if (response.status === 200) {
                    const data = response.data.data;
                    console.log(data);
                    this.setState({
                        email: data.email,
                        phone_number: data.phone_number,
                        nickname: data.nickname ? data.nickname : '',
                        fullname: data.display_name,
                        birthdate: new Date(data.dob ? data.dob * 1000 : Date.now()),
                        gender: data.gender,
                        location: data.location
                    }, () => {
                        this.props.setUserProfile(this.state.nickname, this.state.fullname, this.state.birthdate, this.state.gender, this.state.phone_number, this.state.email, this.state.otp, this.state.location);
                    });
                }
            })
            .catch(error => console.log(error));

        this.props.getLocations()
            .then(response => {
                if (response.status === 200) {
                    this.setState({ location_data: response.data.data });
                }
            })
            .catch(error => console.log(error));
    }

    handleSubmit(e) {
        e.preventDefault();

    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return day + '/' + month + '/' + year;
    }

    onChangeNickname(e) {
        this.setState({ nickname: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePhoneNumber(e) {
        this.setState({ phone_number: e.target.value });
    }

    onChangeFullname(e) {
        this.setState({ fullname: e.target.value });
    }

    onChangeBirthdate(date) {
        this.setState({ birthdate: date });
    }

    onChangeGender(e) {
        this.setState({ gender: e.target.value });
    }

    onChangeLocation(e) {
        console.log(e.target.value);
        this.setState({ location: e.target.value });
    }

    goToFormField(index, label, fieldType, notes, placeholder, needOtp = false, selectData = []) {
        this.props.setField(index, label, fieldType, notes, placeholder, needOtp, selectData);
        Router.push('/user/edit/form-field');
    }

    handleCameraTakePhoto(dataUri) {
        console.log('take photo');
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Edit Profile" />
                {/* <Camera style={{ zIndex: 999 }} isFullscreen onTakePhoto={(dataUri) => { handleCameraTakePhoto(dataUri); }}/> */}
                <Actionsheet show={this.state.show_action_sheet} menus={[{ content: 'Camera', onClick: () => console.log('camera') }, { content: 'Gallery', onClick: () => console.log('gallery') }]} onRequestClose={() => this.setState({ show_action_sheet: !this.state.show_action_sheet })} cancelText="Cancel"/>
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                <input type="file" accept="image/*;capture=camera"/>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup className="profile-photo-container">
                            <div className="profile-photo" onClick={() => this.setState({ show_action_sheet: !this.state.show_action_sheet })}>
                                <img className="profile-photo" src="http://placehold.it/100"/>
                                <CameraAltIcon className="profile-photo-button"/>
                            </div>
                            
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="nickname">Nickname (Live Chat)</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 0, 'Nickname (Live Chat)', 'text', `
                                        <ul>
                                            <li>You may change your username back after 14 days</li>
                                            <li>Username has never been used with another user</li>
                                        </ul>
                                    `, 'insert nickname', false)}
                                    value={this.state.nickname}
                                    onChange={this.onChangeNickname.bind(this)}
                                    invalid={this.state.nickname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.nickname_invalid && !!this.state.nickname}>{this.state.nickname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="fullname">Full Name</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 1, 'Full Name', 'text', ``, 'insert full name', false)}
                                    value={this.state.fullname}
                                    onChange={this.onChangeFullname.bind(this)}
                                    invalid={this.state.fullname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.fullname_invalid && !!this.state.fullname}>{this.state.fullname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="birthdate">Birthdate</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 2, 'Birthdate', 'date', ``, 'dd/mm/yy', false)}
                                    value={this.formatDate(this.state.birthdate)}
                                    onChange={this.onChangeBirthdate.bind(this)}
                                    invalid={this.state.birthdate_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.birthdate_invalid && !!this.state.birthdate}>{this.state.birthdate_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="gender">Gender</Label>
                            <InputGroup>
                                <Input
                                    type="select"
                                    onClick={this.goToFormField.bind(this, 3, 'Gender', 'select', ``, 'select gender', false, ['select gender', 'Male', 'Female'])}
                                    value={this.state.gender ? this.state.gender.charAt(0).toUpperCase() + this.state.gender.substring(1) : ''}
                                    onChange={this.onChangeGender.bind(this)}
                                    invalid={this.state.gender_invalid}
                                    className="form-control-ep">
                                    <option></option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </Input>
                                <FormFeedback valid={!this.state.gender_invalid && !!this.state.gender}>{this.state.gender_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        {/* <FormGroup>
                            <Label className="form-label" for="location">Location</Label>
                            <InputGroup>
                                <Input
                                    type="select"
                                    onClick={this.goToFormField.bind(this, 7, 'Location', 'select', ``, 'select location', false, this.state.location_data)}
                                    value={this.state.location ? this.state.location : ''}
                                    onChange={this.onChangeLocation.bind(this)}
                                    invalid={this.state.location_invalid}
                                    className="form-control-ep">
                                    <option></option>
                                    {this.state.location_data.map((l, i) => <option key={i}>{l}</option>)}
                                </Input>
                                <FormFeedback valid={!this.state.location_invalid && !!this.state.location}>{this.state.location_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup> */}
                        <FormGroup>
                            <Label className="form-label" for="email">Email</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 5, 'Email', 'email', ``, 'insert email', true)}
                                    value={this.state.email}
                                    onChange={this.onChangeEmail.bind(this)}
                                    invalid={this.state.email_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.email_invalid && !!this.state.email}>{this.state.email_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="phone_number">Phone Number</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 4, 'Phone Number', 'phone', `
                                        <ul>
                                            <li>Make sure the phone number is active because we will sent you verification code to verify and secure your account</li>
                                        </ul>
                                    `, 'insert phone number', true)}
                                    value={this.state.phone_number ? this.state.phone_number : ''}
                                    onChange={this.onChangePhoneNumber.bind(this)}
                                    invalid={this.state.phone_number_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.phone_number_invalid && !!this.state.phone_number}>{this.state.phone_number_invalid_message}</FormFeedback>
                            </InputGroup>
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
    ...userActions,
    ...othersActions
})(EditProfile);

import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import initialize from '../../utils/initialize';
import Actionsheet from '../../assets/js/react-actionsheet/lib';

import actions from '../../redux/actions';
import userActions from '../../redux/actions/userActions';
import othersActions from '../../redux/actions/othersActions';
import pageActions from '../../redux/actions/pageActions';

import { removeCookie } from '../../utils/cookie';
import { accountGeneralEvent } from '../../utils/appier';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

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
            interest_data: [],
            interests: '',
            interests_invalid: false,
            interests_invalid_message: '',
            otp: '',
            show_action_sheet: false,
            input_photo_accept: 'image/*',
            profile_photo_src: 'https://cdn.zeplin.io/5c7fab96082323628629989f/assets/DDD7D5C6-7114-402B-A0C4-4EC7DE7707BC.svg'
        };

        this.inputPhotoElement = null;
        this.props.setPageLoader();
    }

    componentDidMount() {
        this.props.getUserData()
            .then(response => {
                if (response.status === 200) {
                    const data = response.data.data;
                    const interests = [];
                    for (let i = 0; i < data.interest.length; i++) {
                        interests.push(data.interest[i].name);
                    }

                    this.setState({
                        email: data.email,
                        phone_number: data.phone_number,
                        nickname: data.nickname ? data.nickname : '',
                        fullname: data.display_name,
                        birthdate: new Date(data.dob ? data.dob * 1000 : Date.now()),
                        gender: data.gender,
                        location: data.location,
                        profile_photo_src: data.photo_url ? data.photo_url : this.state.profile_photo_src,
                        interest_data: data.interest,
                        interests: interests.join(',')
                    }, () => {
                        this.props.setUserProfile(this.state.nickname, this.state.fullname, this.state.birthdate, this.state.gender, this.state.phone_number, this.state.email, this.state.otp, this.state.location);
                    });
                }
                this.props.unsetPageLoader();
            })
            .catch(error => {
                this.props.unsetPageLoader();
                console.log(error);
            });

        // this.props.getLocations()
        //     .then(response => {
        //         if (response.status === 200) {
        //             this.setState({ location_data: response.data.data });
        //         }
        //     })
        //     .catch(error => console.log(error));
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

    onChangeInterests(e) {
        this.setState({ interests: e.target.value });
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
        this.setState({ location: e.target.value });
    }

    goToFormField(index, label, fieldType, notes, placeholder, needOtp = false, selectData = [], disabledCondition = null) {
        this.props.setField(index, label, fieldType, notes, placeholder, needOtp, selectData, disabledCondition);
        Router.push('/user/edit/form-field');
    }

    handleCameraTakePhoto(e, index) {
        const reader = new FileReader();
        const self = this;
        reader.onload = function(x) {
            self.setState({ profile_photo_src: x.target.result }, () => {
                self.props.setUserProfilePhoto(self.state.profile_photo_src);
                Router.push('/user/photo/crop');
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack 
                    visible 
                    title="Edit Profile"
                    dropdownMenu={[
                        {
                            label: 'Change Password',
                            callback: () => { Router.push('/user/change-password') }
                        },
                        {
                            label: 'Log Out',
                            callback: () => {
                                accountGeneralEvent('mweb_account_signout_clicked');
                                const deviceId = new DeviceUUID().get();
                                this.props.logout(deviceId)
                                    .then(() => Router.push('/login'))
                                    .catch(() => removeCookie('ACCESS_TOKEN'));
                            }
                        }
                    ]}/>
                <Actionsheet show={this.state.show_action_sheet} menus={[{ content: 'Camera', onClick: () => {
                    this.setState({ input_photo_accept: 'image/*;capture=camera' }, () => this.inputPhotoElement.click());
                } }, { content: 'Gallery', onClick: () => {
                    this.setState({ input_photo_accept: 'image/*' }, () => this.inputPhotoElement.click());
                } }]} onRequestClose={() => this.setState({ show_action_sheet: !this.state.show_action_sheet })} cancelText="Cancel"/>
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <input onChange={this.handleCameraTakePhoto.bind(this)} ref={input => this.inputPhotoElement = input} id="profile-photo-data" type="file" accept={this.state.input_photo_accept} style={{ display: 'none' }}/>
                    
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup className="profile-photo-container">
                            <div className="profile-photo" onClick={() => this.setState({ show_action_sheet: !this.state.show_action_sheet })}>
                                <img className="profile-photo" src={this.state.profile_photo_src}/>
                                <CameraAltIcon className="profile-photo-button"/>
                            </div>
                            
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-ep" for="nickname">Nickname (Live Chat)</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 0, 'Nickname (Live Chat)', 'text', `
                                        <ul>
                                            <li>You may change your username back after 14 days</li>
                                            <li>Username has never been used with another user</li>
                                        </ul>
                                    `, 'insert nickname', false, [], { length: 4, type: 'min' })}
                                    value={this.state.nickname}
                                    onChange={this.onChangeNickname.bind(this)}
                                    invalid={this.state.nickname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.nickname_invalid && !!this.state.nickname}>{this.state.nickname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-ep" for="fullname">Full Name</Label>
                            <InputGroup>
                                <Input
                                    onClick={this.goToFormField.bind(this, 1, 'Full Name', 'text', ``, 'insert full name', false, [], { length: 25, type: 'max' })}
                                    value={this.state.fullname}
                                    onChange={this.onChangeFullname.bind(this)}
                                    invalid={this.state.fullname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.fullname_invalid && !!this.state.fullname}>{this.state.fullname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label-ep" for="birthdate">Birthdate</Label>
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
                            <Label className="form-label-ep" for="gender">Gender</Label>
                            <InputGroup>
                                <Input
                                    type="select"
                                    onClick={this.goToFormField.bind(this, 3, 'Gender', 'select', ``, 'select gender', false, ['Male', 'Female'])}
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
                            <Label className="form-label-ep" for="location">Location</Label>
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
                            <Label className="form-label-ep" for="phone_number">Phone Number</Label>
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
                            <Label className="form-label-ep" for="email">Email</Label>
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
                            <Label className="form-label-ep" for="nickname">Interests</Label>
                            <InputGroup>
                                <Input
                                    onClick={() => Router.push('/user/edit/interest')}
                                    value={this.state.interests}
                                    onChange={this.onChangeInterests.bind(this)}
                                    invalid={this.state.interests_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.interests_invalid && !!this.state.interests}>{this.state.interests_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            {/* <Button className="btn-next block-btn">Save</Button> */}
                        </FormGroup>
                    </Form>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...userActions,
    ...othersActions,
    ...actions,
    ...pageActions
})(EditProfile);

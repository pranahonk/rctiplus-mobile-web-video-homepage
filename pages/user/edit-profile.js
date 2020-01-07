import React from 'react'
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../../assets/scss/components/edit-profile.scss';

class EditProfile extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
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
            location_invalid_message: ''
        };
    }

    handleSubmit(e) {

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

    onChangeBirthdate(e) {
        this.setState({ birthdate: e.target.value });
    }

    onChangeGender(e) {
        this.setState({ gender: e.target.value });
    }

    onChangeLocation(e) {
        this.setState({ location: e.target.value });
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Edit Profile" />
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <DatePicker
                            selected={this.state.birthdate}
                            onChange={this.onChangeBirthdate.bind(this)}
                            withPortal
                        />
                        <FormGroup>
                            <Label className="form-label" for="email">Email</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangeEmail.bind(this)}
                                    valid={!this.state.email_invalid && !!this.state.email}
                                    invalid={this.state.email_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.email_invalid && !!this.state.email}>{this.state.email_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="phone_number">Phone Number</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangePhoneNumber.bind(this)}
                                    valid={!this.state.phone_number_invalid && !!this.state.phone_number}
                                    invalid={this.state.phone_number_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.phone_number_invalid && !!this.state.phone_number}>{this.state.phone_number_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="fullname">Full Name</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangeFullname.bind(this)}
                                    valid={!this.state.fullname_invalid && !!this.state.fullname}
                                    invalid={this.state.fullname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.fullname_invalid && !!this.state.fullname}>{this.state.fullname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="birthdate">Birth Date</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangeBirthdate.bind(this)}
                                    valid={!this.state.birthdate_invalid && !!this.state.birthdate}
                                    invalid={this.state.birthdate_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.birthdate_invalid && !!this.state.birthdate}>{this.state.birthdate_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="gender">Gender</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangeGender.bind(this)}
                                    valid={!this.state.gender_invalid && !!this.state.gender}
                                    invalid={this.state.gender_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.gender_invalid && !!this.state.gender}>{this.state.gender_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="location">Location</Label>
                            <InputGroup>
                                <Input
                                    onChange={this.onChangeLocation.bind(this)}
                                    valid={!this.state.location_invalid && !!this.state.location}
                                    invalid={this.state.location_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.location_invalid && !!this.state.location}>{this.state.location_invalid_message}</FormFeedback>
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

export default connect(state => state, {})(EditProfile);

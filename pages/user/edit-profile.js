import React from 'react'
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';
import userActions from '../../redux/actions/userActions';
import othersActions from '../../redux/actions/othersActions';

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
            location_invalid_message: '',
            location_data: []
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
                        fullname: data.display_name,
                        birthdate: new Date(data.dob * 1000),
                        gender: data.gender,
                        location: data.location
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
        
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
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

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Edit Profile" />
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup>
                            
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="email">Email</Label>
                            <InputGroup>
                                <Input
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
                                    value={this.state.phone_number ? this.state.phone_number : ''}
                                    onChange={this.onChangePhoneNumber.bind(this)}
                                    invalid={this.state.phone_number_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.phone_number_invalid && !!this.state.phone_number}>{this.state.phone_number_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="fullname">Full Name</Label>
                            <InputGroup>
                                <Input
                                    value={this.state.fullname}
                                    onChange={this.onChangeFullname.bind(this)}
                                    invalid={this.state.fullname_invalid}
                                    className="form-control-ep" />
                                <FormFeedback valid={!this.state.fullname_invalid && !!this.state.fullname}>{this.state.fullname_invalid_message}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="birthdate">Birth Day</Label>
                            <DatePicker
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                invalid={this.state.birthdate_invalid}
                                selected={this.state.birthdate}
                                onChange={this.onChangeBirthdate.bind(this)}
                                withPortal/>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="gender">Gender</Label>
                            <InputGroup>
                                <Input
                                    type="select"
                                    value={this.state.gender}
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
                        <FormGroup>
                            <Label className="form-label" for="location">Location</Label>
                            <InputGroup>
                                <Input
                                    type="select"
                                    value={this.state.location ? this.state.location : ''}
                                    onChange={this.onChangeLocation.bind(this)}
                                    invalid={this.state.location_invalid}
                                    className="form-control-ep">
                                    <option></option>
                                    {this.state.location_data.map((l, i) => <option key={i}>{l}</option>)}
                                </Input>
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

export default connect(state => state, {
    ...userActions,
    ...othersActions
})(EditProfile);

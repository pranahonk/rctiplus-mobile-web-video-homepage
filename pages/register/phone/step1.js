import React, { Component } from 'react';
import DatePicker from 'react-mobile-datepicker';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBackVerification';

//load reactstrap components
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';

import '../../../assets/scss/components/signup.scss';

export default class Step1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      birthdate: '',
      formatted_date: '',
      gender: '',
      datepicker_open: false,
      genderpicker_open: false
    };

    const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.genderMap = {
      '5': 'Male',
      '11': 'Female'
    };

    this.dateConfig = {
      year: {
        format: 'YYYY',
        caption: 'Year',
        step: 1
      },
      month: {
        format: value => monthMap[value.getMonth()],
        caption: 'Mon',
        step: 1
      },
      date: {
        format: 'DD',
        caption: 'Day',
        step: 1
      }
    };

    this.genderConfig = {
      month: {
        format: value => this.genderMap[value.getMonth()],
        caption: 'Mon',
        step: 6
      }
    };
    
  }

  handleSelectBirthdate(date) {
    this.setState({ birthdate: date, formatted_date: this.formatDate(date), datepicker_open: false });
  }

  handleCancelBirthdate() {
    this.setState({ datepicker_open: false });
  }

  handleOpenBirthdate() {
    this.setState({ datepicker_open: true });
  }

  handleSelectGender(gender) {
    const g = gender.getMonth();
    this.setState({ gender: this.genderMap[g], genderpicker_open: false });
  }

  handleCancelGender() {
    this.setState({ genderpicker_open: false });
  }

  handleOpenGender() {
    this.setState({ genderpicker_open: true });
  }

  formatDate(date) {
    let dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
  }

  render() {
    return (
      <Layout title="Register Step 1">
        <NavBack />
        <DatePicker 
          dateConfig={this.dateConfig}
          headerFormat="YYYY-MM-DD"
          theme="android-dark"
          confirmText="Done"
          cancelText="Cancel"
          max={new Date()}
          onSelect={this.handleSelectBirthdate.bind(this)}
          onCancel={this.handleCancelBirthdate.bind(this)}
          value={new Date()}
          isOpen={this.state.datepicker_open}/>

        <DatePicker 
          dateConfig={this.genderConfig}
          headerFormat="Gender"
          theme="android-dark"
          confirmText="Done"
          cancelText="Cancel"
          onSelect={this.handleSelectGender.bind(this)}
          onCancel={this.handleCancelGender.bind(this)}
          isOpen={this.state.genderpicker_open}/>

        <div className="wrapper-content">
          <div className="login-box">
            <Form>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  className="inpt-form"
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Insert full name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Birth Date</Label>
                <InputGroup>
                  <Input
                    className="inpt-form addon-right-input"
                    type="text"
                    name="birthdate"
                    id="BirthDate"
                    placeholder="yyyy-mm-dd"
                    defaultValue={this.state.formatted_date}
                    onClick={this.handleOpenBirthdate.bind(this)}/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="inpt-form addon-right">
                      <ArrowDropdownIcon/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                
              </FormGroup>
              <FormGroup>
                <Label>Gender</Label>
                <InputGroup>
                  <Input
                    className="inpt-form addon-right-input"
                    type="text"
                    name="gender"
                    placeholder="Select gender"
                    id="gender"
                    defaultValue={this.state.gender}
                    onClick={this.handleOpenGender.bind(this)}/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="inpt-form addon-right">
                      <ArrowDropdownIcon/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup className="btn-next-position">
                <Button className="btn-next block-btn">NEXT</Button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

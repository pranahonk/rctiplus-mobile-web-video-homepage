import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';
import NavBack from '../components/NavBack';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import '../assets/scss/login.scss';

class Signin extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    };

    constructor(props) {
        super(props);
        this.state = {
            email_id: '',
            password: ''
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.authenticate({
            email_id: this.state.email_id, 
            password: this.state.password
        }, 'login');
    }

    render() {
        return (
            <Layout title="Sign In">
				<NavBack />
                <div className="login-box">
                    <h3>Sign In</h3>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email or Phone Number</Label>
                            <Input className="inpt-form" type="text" name="email" id="email" placeholder="Enter email or phone number" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input className="inpt-form" type="password" name="password" id="password" placeholder="Enter password" />
                        </FormGroup>
						<p class="text-center"><a href="/forgot-password" class="text-white fnt-12">Forgot Password?</a></p>
                        <Button className="btn-next">Login</Button>
						<p class="text-center">Dont have an account? <a href="/signup" class="text-red fnt-12">Sign up</a> here</p>
                    </Form>
                </div> 
            </Layout>
        );
    }

}

export default connect(state => state, actions)(Signin);
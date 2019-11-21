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
                    <h3>Login</h3>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email or Phone Number</Label>
                            <Input type="text" name="email" id="email" placeholder="Enter email" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="Enter password" />
                        </FormGroup>
                        <Button>Login</Button>
						<p class="text-center">Dont have an account? <a href="/signup" class="text-red">Sign up</a> here</p>
                    </Form>
                </div> 
            </Layout>
        );
    }

}

export default connect(state => state, actions)(Signin);
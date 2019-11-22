import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import Link from 'next/link';

import '../assets/scss/login.scss';

class Signin extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    };

    constructor(props) {
        super(props);
        this.state = {
            emailphone: '',
            password: '',
            is_password_invalid: false
        };
    }

    componentDidMount() {
        this.props.test();
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            emailphone: this.state.emailphone,
            password: this.state.password
        };
        this.props.login(data)
            .then(response => {
                if (this.props.authentication.code === 7) {
                    this.setState({ is_password_invalid: true });
                }
            });
    }

    render() {
        return (
            <Layout title="Sign In">
                <Row>
                    <Col md={{ size: 6, offset: 6 }}>
                        <div className="login-box">
                            <h3>Login</h3>
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <FormGroup>
                                    <Label for="email">Email or Phone Number</Label>
                                    <Input type="text" name="email" id="email" placeholder="Insert email or phone number" onChange={e => this.setState({ emailphone: e.target.value })} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input invalid={this.state.is_password_invalid} type="password" name="password" id="password" placeholder="Insert password" onChange={e => this.setState({ password: e.target.value })} />
                                    <FormFeedback id="password-feedback">Password is incorrect</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <div className="form-text">
                                        <Link href=""><a>Forget password?</a></Link>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Button id="login-button" className="btn btn-primary">Log In</Button>
                                </FormGroup>
                                <FormGroup>
                                    <div className="form-text">
                                        <p>Don't have an account? <Link href="/signup"><a>Register</a></Link> here</p>
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>

                    </Col>
                </Row>
            </Layout>
        );
    }

}

export default connect(state => state, actions)(Signin);
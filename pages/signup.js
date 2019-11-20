import React from 'react';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import actions from '../redux/actions';
import initialize from '../utils/initialize';

class Signup extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email_id: '',
            mobile_no: '',
            password: '',
            confirm_password: ''
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        this.props.register({
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email_id: this.state.email_id,
            mobile_no: this.state.mobile_no,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        }, 'register');
    }

    render() {
        return (
            <Layout title="Sign Up">
                <h3 className="title is-3">Sign Up</h3>
                
            </Layout>
        );
    }

}

export default connect(state => state, actions)(Signup);
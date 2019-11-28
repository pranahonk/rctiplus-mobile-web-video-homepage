import React from 'react';
import { connect } from 'react-redux';
import initialize from '../utils/initialize';
import Layout from '../components/Templates/Layout';
import actions from '../redux/actions';

class Users extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        await this.props.getUser({
            token: this.props.authentication.token
        }, 'profile');
    }

    render() {
        return (
            <div>

            </div>
        );
    }

}

export default connect(state => state, actions)(Users);
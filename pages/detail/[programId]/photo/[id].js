import React from 'react';
import { connect } from 'react-redux';

class Photo extends React.Component {

    static async getInitialProps(ctx) {

    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div></div>
        );
    }

}

export default connect(state => state, {})(Photo);
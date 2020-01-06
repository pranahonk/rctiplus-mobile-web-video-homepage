import React from 'react';
import { connect } from 'react-redux';

import ReactJWPlayer from 'react-jw-player';

class Episode extends React.Component {

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

export default connect(state => state, {})(Episode);
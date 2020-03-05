import React from 'react';
import { connect } from 'react-redux';
import initialize from '../utils/initialize';
import Layout from '../components/Layouts/Default_v2';

import { SITEMAP } from '../config';

class Roov extends React.Component {

    static async getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Layout title={SITEMAP.home.title}>
                <iframe src="https://rctiplus.roov.id/" frameBorder="0" style={{ width: '100%', minHeight: 'calc(100vh - 47px)'}}></iframe>
            </Layout>
        );
    }

}

export default connect(state => state, {})(Roov);
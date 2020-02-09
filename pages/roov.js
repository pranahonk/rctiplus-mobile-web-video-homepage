import React from 'react';

import Layout from '../components/Layouts/Default_v2';

import { SITEMAP } from '../config';

class Roov extends React.PureComponent {

    render() {
        return (
            <Layout title={SITEMAP.home.title}>
                <iframe src="https://rctiplus.roov.id/" frameBorder="0" style={{ width: '100%', minHeight: 'calc(100vh)'}}></iframe>
            </Layout>
        );
    }

}

export default Roov;
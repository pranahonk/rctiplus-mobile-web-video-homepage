import React from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layouts/Default_v2';

class List extends React.Component {

    render() {
        return <h2>HEHE</h2>;
    }

}

export default connect(state => state, {})(List);
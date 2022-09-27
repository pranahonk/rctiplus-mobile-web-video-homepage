import React from 'react';
import { connect } from 'react-redux';

class List extends React.Component {

    render() {
        return <h2>HEHE</h2>;
    }

}

export default connect(state => state, {})(List);

import React from 'react';
import fetch from 'isomorphic-unfetch';


export default class Default extends React.Component {
    state = {
        posts: []
    };
    static async getInitialProps({ req }) {
        const res = await fetch('https://rc-api.rctiplus.com/api/v1/visitor?platform=mweb&device_id=0089821')
        const data = await res.json();
        const response = '';
        if (data.status.code === 0) {
            response = data.data.access_token;
        }
        this.setState({ posts });
        console.log(response);
        return ({
            response
        })
    }
    render() {
        const { posts } = this.state;
        return (
            <div>
            </div>
        )
    }
}


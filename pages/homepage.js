import React from 'react';
import fetch from 'isomorphic-unfetch';


export default class Homepage extends React.Component {
//    static async getInitialProps() {
//        const res = await fetch('https://rc-api.rctiplus.com/api/v1/visitor?platform=mweb&device_id=0089821')
//        const data = await res.json();
//        const token = '';
//        if (data.status.code === 0) {
//            token = data.data.access_token;
//        }
//        
//        const responseHomepage = await fetch('https://rc-api.rctiplus.com/api/v1/homepage?platform=mweb&page=1&length=20',{
//            method: 'GET',
//            headers: {
//                'Authorization':token
//            }
//        })
//        const dataHomepage = await res.json();
//        return { dataHomepage }
//    }
//    componentWillMount() {
//        this.setState({
//            dataHomepage: this.props.dataHomepage
//        })
//    }
    render() {
        return (
                <div>
        <h3>{process.env.STORIES_SHOWN}</h3>
                </div>
                )
    }
}

    
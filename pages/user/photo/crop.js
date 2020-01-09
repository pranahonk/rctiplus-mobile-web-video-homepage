import React from 'react';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class Crop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile_photo_src: this.props.user.profile_photo_src
        };
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Crop Photo" />
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <ReactCrop src={this.state.profile_photo_src}/>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...userActions
})(Crop);
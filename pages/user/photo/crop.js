import React from 'react';
import { connect } from 'react-redux';

import userActions from '../../../redux/actions/userActions';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button, ButtonGroup } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import '../../../assets/scss/components/crop.scss';

class Crop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile_photo_src: this.props.user.profile_photo_src,
            crop: {
                aspect: 1,
                unit: '%',
                width: 100
            },
            cropped_photo_url: ''
        };

        this.imageRef = null;
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
        let size = image.width;
        if (size < image.height) {
            size = image.height;
        }
        this.setState({ crop: { aspect: 1, unit: 'px', width: size, height: size } });
        return false;
    }

    onCropChange = (crop) => {
        this.setState({ crop });
    }

    onCropComplete = crop => {
        this.makeCrop(crop);
    }

    async makeCrop(crop) {
        if (crop.width && crop.height) {
            const croppedPhotoUrl = await this.getCroppedPhoto(this.imageRef, crop, 'cropped-photo.jpeg');
            this.setState({ cropped_photo_url: croppedPhotoUrl }, () => console.log(this.state.cropped_photo_url));
        }
    }

    getCroppedPhoto(image, crop, filename) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = filename;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Crop Photo" />
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <ReactCrop className="crop-image" src={this.state.profile_photo_src} crop={this.state.crop} onChange={this.onCropChange} circularCrop onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete}/>
                    <div className="btn-group-crop">
                        <Button className="btn-cancel-crop">Cancel</Button>
                        <Button className="btn-next btn-save-crop">Save</Button>
                    </div>
                    
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...userActions
})(Crop);
import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import userActions from '../../../redux/actions/userActions';
import notificationActions from '../../../redux/actions/notificationActions';

//load default layout
import Layout from '../../../components/Layouts/Default';

//load navbar default
import NavBack from '../../../components/Includes/Navbar/NavBack';

//load reactstrap components
import { Button } from 'reactstrap';
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
            cropped_photo_url: '',
            blob: null
        };

        this.imageRef = null;
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
        let size = {};
        if (image.width < image.height) {
            size['width'] = 100;
        }
        else {
            size['height'] = 100;
        }
        this.setState({ crop: { aspect: 1, unit: '%', ...size } });
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
        console.log(crop.width, crop.height);

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

        return new Promise((resolve) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = filename;
                this.setState({ blob: blob });
                resolve(blob);
            }, 'image/jpeg');
        });
    }

    uploadProfilePhoto() {
        this.props.progressNotification('Uploading...');
        let file = new File([this.state.blob], 'cropped-photo.jpeg');
        this.props.uploadProfilePhoto(file)
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    this.props.showNotification('Upload success');
                    setTimeout(() => this.props.hideNotification(), 3000);
                    Router.back();
                }
                else {
                    this.props.showNotification('Upload error, please try again later', false);
                    setTimeout(() => this.props.hideNotification(), 3000);
                }
                
            })
            .catch(error => {
                console.log(error);
                this.props.showNotification('Upload error, please try again later', false);
                setTimeout(() => this.props.hideNotification(), 3000);
            });
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <NavBack title="Crop Photo" />
                <div className="wrapper-content container-box-ep" style={{ marginTop: 50 }}>
                    <ReactCrop className="crop-image" src={this.state.profile_photo_src} crop={this.state.crop} onChange={this.onCropChange} circularCrop onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete}/>
                    <div className="btn-group-crop">
                        <Button onClick={() => Router.back()} className="btn-cancel-crop">Cancel</Button>
                        <Button onClick={this.uploadProfilePhoto.bind(this)} className="btn-next btn-save-crop">Save</Button>
                    </div>
                    
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...userActions,
    ...notificationActions
})(Crop);
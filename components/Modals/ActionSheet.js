import React from 'react';
import { connect } from 'react-redux';
import notificationActions from '../../redux/actions/notificationActions';

import { Modal, ModalBody } from 'reactstrap';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, LineShareButton, WhatsappShareButton } from 'react-share';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';

class ActionSheet extends React.Component {

    constructor(props) {
        super(props);
    }

    copyToClipboard() {
        const url = document.getElementById('url-copy');
        url.type = 'text';
        url.select();

        document.execCommand('Copy', false, null);
        url.type = 'hidden';

        // this.props.showNotification('Link copied to clipboard');
        // setTimeout(() => this.props.hideNotification(), 1500);
        alert('Link copied to clipboard');
        this.props.toggle();
    }

    render() {
        return (
            <Modal className="modal-edit" isOpen={this.props.open} toggle={this.props.toggle}>
                <CloseIcon className="close-icon-button" onClick={this.props.toggle}/>
                <ModalBody className="modal-body-edit">
                    
                    <p className="sheet-title">
                        <strong>Share this program</strong>
                    </p>
                    <div className="sheet-action-button-container">
                        <div className="sheet-action-button-share">
                            <FacebookShareButton hashtag={this.props.hashtags.map(h => '#' + h).join(' ')} quote={this.props.caption + ' ' + this.props.url} url={this.props.url}>
                                <i className="fab fa-facebook-f"></i>
                            </FacebookShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <TwitterShareButton title={this.props.caption} url={this.props.url} hashtags={this.props.hashtags}>
                                <i className="fab fa-twitter"></i>
                            </TwitterShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <LineShareButton url={this.props.url} title={this.props.caption}>
                                <i className="fab fa-line"></i>
                            </LineShareButton>
                        </div>
                        <br/>
                        <div className="sheet-action-button-share">
                            <EmailShareButton url={this.props.url} subject={this.props.caption} body={this.props.caption + ' ' + this.props.url} separator=" - " openWindow>
                                <i className="far fa-envelope"></i>
                            </EmailShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <WhatsappShareButton title={this.props.caption} url={this.props.url} separator=" - ">
                                <i className="fab fa-whatsapp"></i>
                            </WhatsappShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <i onClick={this.copyToClipboard.bind(this)} className="far fa-copy"></i>
                            <input type="hidden" id="url-copy" value={this.props.url}/>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, notificationActions)(ActionSheet);
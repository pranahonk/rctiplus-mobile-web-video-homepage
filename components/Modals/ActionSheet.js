import React from 'react';
import { connect } from 'react-redux';
import notificationActions from '../../redux/actions/notificationActions';

import Router, { withRouter } from 'next/router';

import { Modal, ModalBody } from 'reactstrap';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, LineShareButton, WhatsappShareButton } from 'react-share';

import { SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';

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

    shareUtm(share, title) {
        const path = this.props.router.asPath;
        if (path.includes('programs')) {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=programs' + title;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=programs' + title;
        }
        if (path.includes('exclusive')) {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=exclusive' + title;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=exclusive' + title;
        }
    }
    render() {
        const urlShare = REDIRECT_WEB_DESKTOP + this.props.url.substring(this.props.url.indexOf('rctiplus.com') + 12) || ''
        return (
            <Modal className="modal-edit" isOpen={this.props.open} toggle={this.props.toggle}>
                <CloseIcon className="close-icon-button" onClick={this.props.toggle}/>
                <ModalBody className="modal-body-edit">
                    
                    <p className="sheet-title">
                        <strong>Share this program</strong>
                    </p>
                    <div className="sheet-action-button-container-share">
                        <div className="sheet-action-button-share">
                            <FacebookShareButton hashtag={this.props.hashtags.map(h => '#' + h).join(' ')} quote={this.props.caption + ' ' + urlShare + this.shareUtm('fb', this.props.path)} url={urlShare + this.shareUtm.bind(this,'fb', this.props.path)}>
                                <i className="fab fa-facebook-f"></i>
                            </FacebookShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <TwitterShareButton title={this.props.caption} url={urlShare + this.shareUtm('twit', this.props.path)} hashtags={this.props.hashtags}>
                                <i className="fab fa-twitter"></i>
                            </TwitterShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <LineShareButton url={urlShare + this.shareUtm('line', this.props.path)} title={this.props.caption}>
                                <i className="fab fa-line"></i>
                            </LineShareButton>
                        </div>
                        <br/>
                        <div className="sheet-action-button-share">
                            <EmailShareButton url={urlShare + this.shareUtm('msg', this.props.path)} subject={this.props.caption} body={this.props.caption + ' ' + urlShare + this.shareUtm('fb', this.props.path)} separator=" - " openWindow>
                                <i className="far fa-envelope"></i>
                            </EmailShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <WhatsappShareButton title={this.props.caption} url={urlShare + this.shareUtm('wa', this.props.path)} separator=" - ">
                                <i className="fab fa-whatsapp"></i>
                            </WhatsappShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <i onClick={this.copyToClipboard.bind(this)} className="far fa-copy"></i>
                            <input type="hidden" id="url-copy" value={urlShare + this.shareUtm('copy', this.props.path)}/>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, notificationActions)(withRouter(ActionSheet));

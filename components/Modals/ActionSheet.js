import React from 'react';
import { connect } from 'react-redux';
import notificationActions from '../../redux/actions/notificationActions';

import Router, { withRouter } from 'next/router';

import { Modal, ModalBody } from 'reactstrap';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, LineShareButton, WhatsappShareButton } from 'react-share';

import { SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, SHARE_BASE_URL } from '../../config';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';

class ActionSheet extends React.Component {
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
        const camppaignName = title.replace(/\s/g, '-');
        const { tabStatus } = this.props;
        if (tabStatus === 'program' || tabStatus === '/programs') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=programs' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=programs' + camppaignName;
        }
        if (tabStatus === 'episode' || tabStatus === 'episodes') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodEpisodes' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodEpisodes' + camppaignName;
        }
        if (tabStatus === 'extra' && tabStatus === 'extras') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodExtras' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodExtras' + camppaignName;
        }
        if (tabStatus === 'clip' && tabStatus === 'clips') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodClips' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodClips' + camppaignName;
        }
        if (tabStatus === 'photo') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodPhoto' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + camppaignName + '&utm_campaign=vodPhoto' + camppaignName;
        }
        if (path.includes('rcti') && tabStatus === 'livetv') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingRCTI' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingRCTI' + camppaignName;
        }
        if (path.includes('mnctv') && tabStatus === 'livetv') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingMNCTV' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingMNCTV' + camppaignName;
        }
        if (path.includes('gtv') && tabStatus === 'livetv') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streaminGTV' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingGTV' + camppaignName;
        }
        if (path.includes('inews') && tabStatus === 'livetv') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingINEWS' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingINEWS' + camppaignName;
        }
        if (tabStatus === 'catchup') {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingINEWS' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=streamingINEWS' + camppaignName;
        }
        if (path.includes('exclusive')) {
            if (path.includes('?ref=')) {
                return '&utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=exclusive' + camppaignName;
            }
            return '?utm_source=Rplusmweb&utm_medium=share_' + share + '&utm_campaign=exclusive' + camppaignName;
        }
        if (tabStatus === 'live-event') {
            if (path.includes('?ref=')) {
                return '&type=live-event&utm_source=Rplusmweb&utm_medium=share_' + share;
            }
            return '?type=live-event&utm_source=Rplusmweb&utm_medium=share_' + share;
        }
        if (tabStatus === 'missed-event') {
            if (path.includes('?ref=')) {
                return '&type=missed-event&utm_source=Rplusmweb&utm_medium=share_' + share;
            }
            return '?type=missed-event&utm_source=Rplusmweb&utm_medium=share_' + share;
        }
        if (path.includes('?ref=')) {
            return '&utm_source=Rplusmweb&utm_medium=share_' + share; // + '&utm_campaign=gue-ganteng';
        }
        return '?utm_source=Rplusmweb&utm_medium=share_' + share; // + '&utm_campaign=gue-ganteng';
    }
    render() {
        let hashtag = ['rctiplus'];
        if (this.props.hashtags) {
            this.props.hashtags.map((item) => {
                if (item.name) {
                    hashtag = [item.name, ...hashtag];
                } else {
                    hashtag = this.props.hashtags;
                }

            });
        }
        // const urlShare = SHARE_BASE_URL + `${this.props.url}`;
        const urlShare = this.props.url;
        console.log(urlShare, "uhuyyy")

        return (
            <Modal className="modal-edit" isOpen={this.props.open} toggle={this.props.toggle}>
                <CloseIcon id="close-action-sheet" className="close-icon-button" onClick={this.props.toggle}/>
                <ModalBody className="modal-body-edit">
                    
                    <p className="sheet-title">
                        <strong>Share this program</strong>
                    </p>
                    <div className="sheet-action-button-container-share">
                        <div className="sheet-action-button-share">
                            <FacebookShareButton 
                                hashtag={hashtag.map(h => '#' + h).join(' ')} 
                                quote={this.props.caption + ' ' + urlShare + this.shareUtm('fb', this.props.caption)} 
                                url={urlShare + this.shareUtm.bind(this,'fb', this.props.caption)}>
                                <i className="fab fa-facebook-f"></i>
                            </FacebookShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <TwitterShareButton title={this.props.caption} url={urlShare + this.shareUtm('twit', this.props.caption)} hashtags={hashtag}>
                                <i className="fab fa-twitter"></i>
                            </TwitterShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <LineShareButton url={urlShare + this.shareUtm('line', this.props.caption)} title={this.props.caption}>
                                <i className="fab fa-line"></i>
                            </LineShareButton>
                        </div>
                        <br/>
                        <div className="sheet-action-button-share">
                            <EmailShareButton url={urlShare + this.shareUtm('msg', this.props.caption)} subject={this.props.caption} body={this.props.caption + ' ' + urlShare + this.shareUtm('fb', this.props.caption)} separator=" - " openWindow>
                                <i className="far fa-envelope"></i>
                            </EmailShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <WhatsappShareButton title={this.props.caption} url={urlShare + this.shareUtm('wa', this.props.caption)} separator=" - ">
                                <i className="fab fa-whatsapp"></i>
                            </WhatsappShareButton>
                        </div>
                        <div className="sheet-action-button-share">
                            <i onClick={this.copyToClipboard.bind(this)} className="far fa-copy"></i>
                            <input type="hidden" id="url-copy" value={urlShare + this.shareUtm('copy', this.props.caption)}/>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, notificationActions)(withRouter(ActionSheet));

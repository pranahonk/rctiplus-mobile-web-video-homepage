import React from 'react';
import { connect } from 'react-redux';

import { Modal, ModalBody } from 'reactstrap';

import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';

class ActionSheet extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalBody>
                    <p className="sheet-title">Share this program</p>
                    <div className="sheet-action-button-container">
                        <div className="sheet-action-button">
                            <i className="fa fa-facebook"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fa fa-twitter"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fab fa-line"></i>
                        </div>
                        <br/>
                        <div className="sheet-action-button">
                            <i className="fa fa-envelope"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fa fa-whatsapp"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fa fa-copy"></i>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {})(ActionSheet);
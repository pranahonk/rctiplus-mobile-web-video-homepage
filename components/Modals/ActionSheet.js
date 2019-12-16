import React from 'react';
import { connect } from 'react-redux';

import { Modal, ModalBody } from 'reactstrap';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';

class ActionSheet extends React.Component {

    constructor(props) {
        super(props);
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
                        <div className="sheet-action-button">
                            <i className="fab fa-facebook-f"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fab fa-twitter"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fab fa-line"></i>
                        </div>
                        <br/>
                        <div className="sheet-action-button">
                            <i className="far fa-envelope"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="fab fa-whatsapp"></i>
                        </div>
                        <div className="sheet-action-button">
                            <i className="far fa-copy"></i>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {})(ActionSheet);
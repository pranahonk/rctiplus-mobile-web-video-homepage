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
                    <ThumbUpAltOutlinedIcon className="modal-icon"/>
                    <ThumbDownOutlinedIcon className="modal-icon"/>
                    <div className="close-container">
                        <CancelIcon className="close-icon" onClick={this.props.toggle}/>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {})(ActionSheet);
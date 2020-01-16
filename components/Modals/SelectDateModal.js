import React from 'react';
import { connect } from 'react-redux';

import contentActions from '../../redux/actions/contentActions';
import liveAndChatActions from '../../redux/actions/liveAndChatActions';

import { Modal, ModalBody } from 'reactstrap';

import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/select-modal.scss';

class SelectDateModal extends React.Component {

    constructor(props) {
        super(props);
    }

    selectDate(date) {
        this.props.setCatchupDate(date);
        this.props.toggle();
    }

    render() {
        return (
            <Modal className="select-modal" isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalBody>
                    <div className="season-list">
                        {this.props.data.map((d, i) => (<h4 key={i} onClick={this.selectDate.bind(this, d)}>{d}</h4>))}
                    </div>
                    <div className="close-container-select">
                        <CancelIcon className="close-icon-select" onClick={this.props.toggle}/>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...liveAndChatActions
})(SelectDateModal);
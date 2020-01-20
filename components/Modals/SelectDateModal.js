import React from 'react';
import { connect } from 'react-redux';

import contentActions from '../../redux/actions/contentActions';
import liveAndChatActions from '../../redux/actions/liveAndChatActions';

import { formatDate } from '../../utils/dateHelpers';

import { Modal, ModalBody } from 'reactstrap';

import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/select-modal.scss';

class SelectDateModal extends React.Component {

    constructor(props) {
        super(props);
    }

    selectDate(date) {
        const currentDate = new Date();
        this.props.setCatchupDate(date);
        this.props.getEPG(formatDate(new Date(date)), this.props.chats.channel_code)
            .then(response => {
                let catchup = response.data.data.filter(e => {
                    if (e.s > e.e) {
                        return currentDate.getTime() > new Date(new Date(date + ' ' + e.e).getTime() + (1 * 24 * 60 * 60 * 1000)).getTime();
                    }
                    return currentDate.getTime() > new Date(date + ' ' + e.e).getTime();
                });
                this.setState({ catchup: catchup }, () => {
                    this.props.setCatchupData(catchup);
                    this.props.toggle();
                });
            })
            .catch(error => {
                console.log(error);
                this.props.toggle();
            });
        
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
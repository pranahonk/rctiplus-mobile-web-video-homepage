import React from 'react';
import { connect } from 'react-redux';

import { Modal, ModalBody } from 'reactstrap';

import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/select-modal.scss';

class SelectModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal className="select-modal" isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalBody>
                    <div className="season-list">
                        {this.props.data.map((d, i) => (<h4 key={i}>Season {d.season}</h4>))}
                    </div>
                    <div className="close-container-select">
                        <CancelIcon className="close-icon-select" onClick={this.props.toggle}/>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

// redux for passing the selected data
export default connect(state => state, {})(SelectModal);
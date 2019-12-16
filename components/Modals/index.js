import React from 'react';
import { connect } from 'react-redux';

import ReactJWPlayer from 'react-jw-player';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import '../../assets/scss/components/modal.scss';

class PlayerModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    <ArrowBackIcon onClick={this.props.toggle}/>
                </ModalHeader>
                <ModalBody>
                    <ReactJWPlayer 
                        playerId={this.props.playerId} 
                        isAutoPlay={false}
                        onReady={this.props.onReady}
                        playerScript="https://cdn.jwplayer.com/libraries/Vp85L1U1.js"
                        file={this.props.videoUrl}/>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {})(PlayerModal);
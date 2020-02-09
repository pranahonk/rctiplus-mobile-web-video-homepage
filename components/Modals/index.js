import React from 'react';
import { connect } from 'react-redux';
import ReactJWPlayer from 'react-jw-player';

import pageActions from '../../redux/actions/pageActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import Wrench from '../Includes/Common/Wrench';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

import '../../assets/scss/components/modal.scss';

class PlayerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            error_data: {}
        };
    }

    tryAgain() {
        this.props.setPageLoader();
        this.setState({ error: false }, () => {
            this.props.unsetPageLoader();
        });
    }

    render() {
        let playerRef = (<ReactJWPlayer 
            playerId={this.props.playerId} 
            isAutoPlay={false}
            onReady={this.props.onReady}
            playerScript="https://cdn.jwplayer.com/libraries/Vp85L1U1.js"
            onSetupError={error => {
                console.log(error);
                this.setState({
                    error: true,
                    error_data: error
                });
            }}
            file={this.props.videoUrl}/>);
        if (this.state.error) {
            playerRef = (
                <div className="wrapper-content" style={{ margin: 0 }}>
                    <div style={{ 
                        textAlign: 'center',
                        position: 'fixed', 
                        top: '50%', 
                        left: '50%',
                        transform: 'translate(-50%, -50%)' 
                        }}>
                        <Wrench/>
                        <h5 style={{ color: '#8f8f8f' }}>
                            <strong style={{ fontSize: 14 }}>Cannot load the video</strong><br/>
                            <span style={{ fontSize: 12 }}>Please try again later,</span><br/>
                            <span style={{ fontSize: 12 }}>we're working to fix the problem</span>
                            {/* <Button onClick={this.tryAgain.bind(this)} className="btn-next" style={{ width: '50%' }}>Coba Lagi</Button> */}
                        </h5>
                        {/* <SentimentVeryDissatisfiedIcon style={{ fontSize: '4rem' }}/>
						<h5>
							<strong>{this.state.error_data.message}</strong><br/><br/>
							<Button onClick={this.tryAgain.bind(this)} className="btn-next block-btn">Coba Lagi</Button>
						</h5> */}
					</div>
                </div>
            );
        }

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    <ArrowBackIcon onClick={this.props.toggle}/>
                </ModalHeader>
                <ModalBody>
                    {playerRef}
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, pageActions)(PlayerModal);
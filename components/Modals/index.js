import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import queryString from 'query-string';

import pageActions from '../../redux/actions/pageActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Wrench from '../Includes/Common/Wrench';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import '../../assets/scss/components/modal.scss';

import { exclusiveContentPlayEvent, libraryProgramTrailerPlayEvent, searchProgramTrailerPlayEvent } from '../../utils/appier';

class PlayerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            error_data: {}
        };
        this.player = null;
        this.intervalFn = null;

        const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
        }
    }

    tryAgain() {
        this.props.setPageLoader();
        this.setState({ error: false }, () => {
            this.props.unsetPageLoader();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.open && !prevProps.open) {
            this.setState({ error: false }, () => this.initVOD());
        }
        else if (!this.props.open && prevProps.open) {
            if (this.player) {
                clearInterval(this.intervalFn);
                this.player.remove();
            }
        }
    }
    
    initVOD() {
        this.player = window.jwplayer(this.props.playerId);
		this.player.setup({
			autostart: true,
			file: this.props.videoUrl,
			primary: 'html5',
			width: '100%',
			aspectratio: '16:9',
			displaytitle: true,
			setFullscreen: true,
			stretching:'fill',
			advertising: {
				client: process.env.ADVERTISING_CLIENT,
				tag: this.props.vmap
			},
			logo: {
				hide: true
			}
        });
        
        this.player.on('setupError', error => {
            console.log('SETUP ERROR');
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('error', error => {
            console.log('ERROR');
            this.player.remove();
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('play', () => {
            this.intervalFn = setInterval(() => {
                if (this.props.program) {
                    if (this.reference) {
                        switch (this.reference) {
                            case 'library':
                                libraryProgramTrailerPlayEvent(this.props.program.title, this.props.program.id, 'program', this.player.getPosition(), this.player.getDuration(), 'mweb_library_program_trailer_play');
                                break;

                            case 'search':
                                searchProgramTrailerPlayEvent(this.props.program.id, this.props.program.title, 'program', this.player.getPosition(), this.player.getDuration(), 'mweb_search_program_trailer_play');
                                break;
                        }
                    }
                    else {
                        exclusiveContentPlayEvent(this.props.program.type, this.props.program.id, this.props.program.title, this.props.program.program_title, this.props.program.genre, this.props.meta.image_path + '300' + this.props.program.portrait_image, this.props.meta.image_path + '300' + this.props.program.landscape_image, this.player.getPosition(), this.player.getDuration(), 'mweb_exclusive_content_play');
                    }
                    if (this.props.program.type) {
                        this.props.postHistory(this.props.program.id, this.props.program.type, this.player.getPosition())
                            .then(response => {
                                // console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            }, 2500);
        });

        this.player.on('fullscreen', () => {
			if (screen.orientation.type === 'portrait-primary') {
				document.querySelector(this.props.playerId).requestFullscreen();
				screen.orientation.lock("landscape-primary")
			}
			if (screen.orientation.type === 'landscape-primary') {
				document.querySelector(this.props.playerId).requestFullscreen();
				screen.orientation.lock("portrait-primary")
			}
		});
    }

    renderPlayer() {
        let playerRef = (<div></div>);
        let errorRef = (<div></div>);

        if (this.state.error) {
            errorRef = (
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
                        </h5>
					</div>
                </div>
            );
            this.player.remove();
        }
        else {
            playerRef = (<div id={this.props.playerId}></div>);
        }

        return this.state.error ? errorRef : playerRef;
    }

    render() {
        

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    <ArrowBackIcon onClick={this.props.toggle}/>
                </ModalHeader>
                <ModalBody>
                    {this.renderPlayer()}
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, {
    ...pageActions,
    ...historyActions
})(withRouter(PlayerModal));
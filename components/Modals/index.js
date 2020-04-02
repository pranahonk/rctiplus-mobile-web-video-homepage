import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import queryString from 'query-string';
import { isIOS } from 'react-device-detect';

import pageActions from '../../redux/actions/pageActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Wrench from '../Includes/Common/Wrench';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import '../../assets/scss/components/modal.scss';

import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'video.js/src/css/video-js.scss';
import 'videojs-hls-quality-selector';
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';
import 'videojs-youtube';

import { exclusiveContentPlayEvent, libraryProgramTrailerPlayEvent, searchProgramTrailerPlayEvent } from '../../utils/appier';
import { convivaVideoJs } from '../../utils/conviva';

class PlayerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            error_data: {}
        };
        this.player = null;
        this.intervalFn = null;
        this.videoNode = null;
        this.convivaTracker = null;

        const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
        }
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
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
            // this.setState({ error: false }, () => this.initVOD());
            this.setState({ error: false }, () => this.initPlayer());
        }
        else if (!this.props.open && prevProps.open) {
            if (this.player) {
                clearInterval(this.intervalFn);
                // this.player.remove();
                if (this.convivaTracker) {
                    this.convivaTracker.cleanUpSession();
                }
                this.player.dispose();
            }
        }
    }

    initPlayer() {
        if (this.videoNode) {
            const self = this;
            videojs.registerPlugin('hlsQualitySelector', qualitySelector);
            this.player = videojs(this.videoNode, {
                autoplay: true,
                controls: true,
                fluid: true,
                aspectratio: '16:9',
                fill: true,
                html5: {
                    hls: {
                        overrideNative: true,
                    },
                },
                sources: [{
                    src: this.props.videoUrl,
                    type: 'application/x-mpegURL',
                }],
            }, function onPlayerReady() {
                const vm = this
                console.log('onPlayerReady', vm.landscapeFullscreen);
                // vm.landscapeFullscreen({
                //     fullscreen: {
                //         enterOnRotate: true,
                //         alwaysInLandscapeMode: true,
                //         iOS: true,
                //     },
                // });

                const player = this;
                const assetName = self.props.program ? self.props.program.title : 'N/A';
                self.convivaTracker = convivaVideoJs(assetName, player, true, self.props.videoUrl, assetName.toUpperCase(), {
					asset_name: assetName.toUpperCase(),
					application_name: 'RCTI+ MWEB',
					player_type: 'VideoJS',
					content_id: (self.props.program ? self.props.program.id : 'N/A').toString(),
					program_name: assetName,
					version: process.env.VERSION,
					playerVersion: process.env.PLAYER_VERSION,
					content_name: assetName.toUpperCase()
                });
                self.convivaTracker.createSession();
            });

            this.player.on('fullscreenchange', () => {
                if (screen.orientation.type === 'portrait-primary') {
                    screen.orientation.lock("landscape-primary");
                }
                if (screen.orientation.type === 'landscape-primary') {
                    screen.orientation.lock("portrait-primary");
                }
            });
            this.player.on('error', () => {
                this.setState({
                    error: true,
                });
            });
            this.player.hlsQualitySelector({ displayCurrentQuality: true }); 
            this.player.ima({ adTagUrl: this.props.vmap });
            this.player.ima.initializeAdDisplayContainer();
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
			stretching: 'exactfit',
			advertising: {
				client: process.env.ADVERTISING_CLIENT,
				tag: this.props.vmap
			},
			logo: {
				hide: true
			}
        });

        const self = this;
        this.player.on('ready', function() {
            conviva.startMonitoring(this);
            conviva.updatePlayerAssetMetadata(this, {
                playerType: 'JWPlayer',
                content_type: 'Program',
                program_id: self.props.program ? self.props.program.id : 'N/A',
                program_name: self.props.program ? self.props.program.title : 'N/A',
                date_video: 'N/A',
                time_video: 'N/A',
                page_title: 'N/A',
                genre: self.props.program ? self.props.program.genre : 'N/A',
                page_view: 'N/A',
                app_version: 'N/A',
                group_content_page_title: 'N/A',
                group_content_name: 'N/A',
                exclusive_tab_name: 'N/A',
                asset_name: self.props.program ? self.props.program.title : 'N/A'
            });

            if (isIOS) {
				let elementJwplayerInit = document.querySelector(`#${this.props.playerId} > .jw-wrapper`);
				let elementCreateWrapper = document.createElement('btn');
				let elementMuteIcon = document.createElement('span');
				elementCreateWrapper.classList.add('jwplayer-vol-off');
				elementCreateWrapper.innerText = 'Tap to unmute ';

				jwplayer().setMute(true);
				elementJwplayerInit.appendChild(elementCreateWrapper);
				elementCreateWrapper.appendChild(elementMuteIcon);
				elementCreateWrapper.addEventListener('click', () => {
					if (elementCreateWrapper === null) {
						jwplayer().setMute(true);
						elementJwplayer[0].classList.add('jwplayer-mute');
						elementJwplayer[0].classList.remove('jwplayer-full');
					} 
					else {
						jwplayer().setMute(false);
						elementCreateWrapper.classList.add('jwplayer-full');
						elementCreateWrapper.classList.remove('jwplayer-mute');
					}
				});
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

        this.player.on('play', function() {
            self.intervalFn = setInterval(() => {
                if (self.props.program) {
                    if (self.reference) {
                        switch (self.reference) {
                            case 'library':
                                libraryProgramTrailerPlayEvent(self.props.program.title, self.props.program.id, 'program', self.player.getPosition(), self.player.getDuration(), 'mweb_library_program_trailer_play');
                                break;

                            case 'search':
                                searchProgramTrailerPlayEvent(self.props.program.id, self.props.program.title, 'program', self.player.getPosition(), self.player.getDuration(), 'mweb_search_program_trailer_play');
                                break;
                        }
                    }
                    else {
                        exclusiveContentPlayEvent(self.props.program.type, self.props.program.id, self.props.program.title, self.props.program.program_title, self.props.program.genre, self.props.meta.image_path + '300' + self.props.program.portrait_image, self.props.meta.image_path + '300' + self.props.program.landscape_image, self.player.getPosition(), self.player.getDuration(), 'mweb_exclusive_content_play');
                    }
                    if (self.props.program.type) {
                        self.props.postHistory(self.props.program.id, self.props.program.type, self.player.getPosition())
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
				document.querySelector('#' + this.props.playerId).requestFullscreen();
				screen.orientation.lock("landscape-primary")
			}
			if (screen.orientation.type === 'landscape-primary') {
				document.querySelector('#' + this.props.playerId).requestFullscreen();
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
                    .
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
            // this.player.remove();
        }
        else {
            playerRef = (
            <div>
                <div data-vjs-player>
                    <video 
                        playsInline
                        style={{ 
                            width: '100%',
                        }}
                        ref={ node => this.videoNode = node } 
                        className="video-js vjs-default-skin vjs-big-play-centered"
                        ></video>
                </div>
            </div>
            );
        }

        return this.state.error ? errorRef : playerRef;
    }

    render() {
        return (
            <Modal className="player-modal" isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    {/* <ArrowBackIcon onClick={this.props.toggle}/> */}
                </ModalHeader>
                <ModalBody className="modal-body-edited">
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
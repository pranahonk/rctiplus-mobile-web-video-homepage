import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import queryString from 'query-string';
import { isIOS } from 'react-device-detect';

import pageActions from '../../redux/actions/pageActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Wrench from '../Includes/Common/Wrench';
import PauseIcon from '../../components/Includes/Common/PauseIcon';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import '../../assets/scss/components/modal.scss';

import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'video.js/src/css/video-js.scss';
import 'videojs-hls-quality-selector';
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';
// import 'videojs-youtube';

import 'videojs-seek-buttons';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';

import { exclusiveContentPlayEvent, libraryProgramTrailerPlayEvent, searchProgramTrailerPlayEvent, getUserId } from '../../utils/appier';
import { convivaVideoJs } from '../../utils/conviva';

class PlayerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            error_data: {},
            playing: false,
            user_active: false,
            quality_selector_shown: false,
            screen_width: 320
        };
        this.player = null;
        this.intervalFn = null;
        this.videoNode = null;
        this.convivaTracker = null;
        this.disconnectHandler = null;

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
                if (this.disconnectHandler) {
                    clearTimeout(this.disconnectHandler);
                    this.disconnectHandler = null;
                }

                this.player.dispose();
            }
        }

    }

    changeQualityIconButton() {
        const self = this;
        setTimeout(() => {
            const qualitySelectorElement = document.getElementsByClassName('vjs-quality-selector');
            if (qualitySelectorElement.length > 0) {
                const childs = qualitySelectorElement[0].childNodes;
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].className == 'vjs-menu-button vjs-menu-button-popup vjs-button') {
                        childs[i].addEventListener('touchstart', function() {
                            console.log('touch');
                            self.setState({ quality_selector_shown: !self.state.quality_selector_shown });
                        });
                        const qualityItems = document.querySelectorAll('li[role=menuitemradio]');
                        for (let j = 0; j < qualityItems.length; j++) {
                            qualityItems[j].addEventListener('touchstart', function() {
                                console.log('touch');
                                self.setState({ quality_selector_shown: false });
                            });
                        }
                        childs[i].addEventListener('click', function() {
                            console.log('click');
                            self.setState({ quality_selector_shown: !self.state.quality_selector_shown });
                        });
                        
                        const grandChilds = childs[i].childNodes;
                        for (let j = 0; j < grandChilds.length; j++) {
                            if (grandChilds[j].className == 'vjs-icon-placeholder' || grandChilds[j].className == 'vjs-icon-placeholder vjs-icon-hd' ) {
                                grandChilds[j].classList.remove('vjs-icon-hd');
                                grandChilds[j].innerHTML = '<i style="transform: scale(1.5)" class="fas fa-cog"></i>';
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }, 1000);
    }

    triggerQualityButtonClick(type = '') {
        const qualitySelectorElement = document.getElementsByClassName('vjs-quality-selector');
        if (qualitySelectorElement.length > 0) {
            const childs = qualitySelectorElement[0].childNodes;
            for (let i = 0; i < childs.length; i++) {
                if (childs[i].className == 'vjs-menu-button vjs-menu-button-popup vjs-button' && type == 'inactive') {
                    childs[i].click();
                    break;
                }
            }
        }
    }

    setSkipButtonCentered(orientation = 'portrait') {
        const playerHeight = document.getElementById(this.player.id()).clientHeight;
        const seekButtons = document.getElementsByClassName('vjs-seek-button');
        for (let i = 0; i < seekButtons.length; i++) {
            seekButtons[i].style.bottom = (Math.floor(playerHeight / 2) - 5) + 'px';

            if (i == 0) {
                seekButtons[i].style.left = (this.state.screen_width - ((this.state.screen_width / 3) * (orientation == 'portrait' ? 2.35 : 2.20))) + 'px';
            }
            else if (i == 1) {
                seekButtons[i].style.left = (this.state.screen_width - (this.state.screen_width / 3)) + 'px';
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
                muted: isIOS,
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
                const vm = this;
                console.log('onPlayerReady', vm.landscapeFullscreen);
                if(isIOS) {
                    vm.muted(true)
                    const wrapElement = document.getElementsByClassName('video-js');
                    const elementCreateWrapper = document.createElement('btn');
                    const elementMuteIcon = document.createElement('span');
                    elementCreateWrapper.classList.add('jwplayer-vol-off');
                    elementCreateWrapper.innerText = 'Tap to unmute ';
                    wrapElement[0].appendChild(elementCreateWrapper);
                    elementCreateWrapper.appendChild(elementMuteIcon);
                    elementCreateWrapper.addEventListener('click', function() {
                        console.log('mute video')
                        if (elementCreateWrapper === null) {
                            vm.muted(false);
                            elementCreateWrapper.classList.add('jwplayer-mute');
                            elementCreateWrapper.classList.remove('jwplayer-full');
                        } 
                        else {
                            vm.muted(false);
                            elementCreateWrapper.classList.add('jwplayer-full');
                            elementCreateWrapper.classList.remove('jwplayer-mute');
                        }
                    });
                }

                const player = this;
                const assetName = self.props.program ? self.props.program.title : 'N/A';

                let videoData = null;
                let genre = '';
                if (self.props.data && self.props.data.data && self.props.data.data.data) {
                    videoData = self.props.data.data.data;
                    if (videoData && videoData.genre.length > 0) {
                        for (let i = 0; i < videoData.genre.length; i++) {
                            genre += videoData.genre[i].name;
                        }
                    }
                }

                const customTags = {
                    app_version: process.env.APP_VERSION,
                    carrier: 'N/A',
                    connection_type: 'N/A',
                    content_type: (videoData ? videoData.content_type : 'N/A'),
                    content_id: (videoData ? videoData.id : 'N/A').toString(),
					program_name: (videoData ? videoData.program_title : 'N/A'),
                    tv_id: 'N/A',
                    tv_name: 'N/A',
                    date_video: 'N/A',
                    genre: (genre ? genre : 'N/A'),
                    page_title: 'N/A',
                    page_view: 'N/A',
                    program_id: (videoData ? videoData.program_id : 'N/A').toString(),
                    screen_mode: 'portrait',
                    time_video: 'N/A',
                    viewer_id: getUserId().toString(),
                    application_name: 'RCTI+ MWEB',
                    section_page: 'N/A'
                };
                // self.convivaTracker = convivaVideoJs(assetName, player, player.duration(), self.props.videoUrl, assetName.toUpperCase(), {
				// 	asset_name: assetName.toUpperCase(),
				// 	application_name: 'RCTI+ MWEB',
				// 	player_type: 'VideoJS',
				// 	content_id: (self.props.program ? self.props.program.id : 'N/A').toString(),
				// 	program_name: assetName,
				// 	version: process.env.VERSION,
				// 	playerVersion: process.env.PLAYER_VERSION,
				// 	content_name: assetName.toUpperCase()
                // });

                self.convivaTracker = convivaVideoJs(assetName, player, player.duration(), self.props.videoUrl, assetName.toUpperCase(), customTags);
                self.convivaTracker.createSession();
                
                setTimeout(() => {
                    self.setSkipButtonCentered(); // set centered with delay
                }, 2000);
            });

            this.player.seekButtons({
                forward: 10,
                back: 10
            });

            window.onorientationchange = () => {
                if (!isIOS) {
                    this.player.userActive(false);
                    setTimeout(() => {
                        this.setState({ screen_width: window.outerWidth }, () => {
                            let orientation = document.documentElement.clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';
                            this.setSkipButtonCentered(orientation);
                        });
                    }, 1000);
                }
            };

            this.player.on('fullscreenchange', () => {
                if (screen.orientation.type === 'portrait-primary') {
                    screen.orientation.lock("landscape-primary");
                }
                if (screen.orientation.type === 'landscape-primary') {
                    screen.orientation.lock("portrait-primary");
                }
            });

            this.player.ready(function() {
                const vm = this;
                if(isIOS) {
                    vm.muted(true)
                    const wrapElement = document.getElementsByClassName('video-js');
                    const elementCreateWrapper = document.createElement('btn');
                    const elementMuteIcon = document.createElement('span');
                    elementCreateWrapper.classList.add('jwplayer-vol-off');
                    elementCreateWrapper.innerText = 'Tap to unmute ';
                    wrapElement[0].appendChild(elementCreateWrapper);
                    elementCreateWrapper.appendChild(elementMuteIcon);
                    elementCreateWrapper.addEventListener('click', function() {
                        console.log('mute video')
                        if (elementCreateWrapper === null) {
                            vm.muted(false);
                            elementCreateWrapper.classList.add('jwplayer-mute');
                            elementCreateWrapper.classList.remove('jwplayer-full');
                        } 
                        else {
                            vm.muted(true);
                            elementCreateWrapper.classList.add('jwplayer-full');
                            elementCreateWrapper.classList.remove('jwplayer-mute');
                        }
                    });
                }
                const promise = vm.play();
                if(promise !== undefined) {
                    promise.then(() => console.log('play'))
                    .catch((err) => console.log('err'))
                }

                setTimeout(() => {
                    self.changeQualityIconButton();
                }, 100);
            });

            this.player.hlsQualitySelector({ displayCurrentQuality: true }); 

            this.player.on('error', () => {
                this.setState({
                    error: true,
                });
            });

            this.player.on('useractive', () => {
                if (!this.player.paused()) {
                    const seekButtons = document.getElementsByClassName('vjs-seek-button');
                    for (let i = 0; i < seekButtons.length; i++) {
                        seekButtons[i].style.display = 'block';
                    }

                    this.setState({ user_active: true });
                }
            });

            this.player.on('userinactive', () => {
                if (!this.player.paused()) {
                    const seekButtons = document.getElementsByClassName('vjs-seek-button');
                    for (let i = 0; i < seekButtons.length; i++) {
                        seekButtons[i].style.display = 'none';
                    }

                    this.setState({ user_active: false });
                }

                if (this.state.quality_selector_shown) {
                    this.triggerQualityButtonClick('inactive');
                }
            });

            this.player.on('ads-ad-started', () => {
                const playButton = document.getElementsByClassName('vjs-big-play-button');
                if (playButton.length > 0) {
                    playButton[0].style.display = 'none';
                }
            });

            this.player.on('play', () => {
                const seekButtons = document.getElementsByClassName('vjs-seek-button');
                for (let i = 0; i < seekButtons.length; i++) {
                    seekButtons[i].style.display = 'none';
                }

                const playButton = document.getElementsByClassName('vjs-big-play-button');
                if (playButton.length > 0) {
                    playButton[0].style.display = 'none';
                }

                this.setState({ playing: true });
            });

            let pauseCounter = 0; // avoid trigger first pause
            this.player.on('pause', () => {
                const seekButtons = document.getElementsByClassName('vjs-seek-button');
                for (let i = 0; i < seekButtons.length; i++) {
                    seekButtons[i].style.display = 'none';
                }

                if (pauseCounter++ > 0) {
                    const playButton = document.getElementsByClassName('vjs-big-play-button');
                    if (playButton.length > 0) {
                        playButton[0].style.display = 'block';
                    }
                }

                this.setState({ playing: false });
            });

            this.setSkipButtonCentered();
            window.onresize = () => {
                this.setSkipButtonCentered();
            };

            this.disconnectHandler = null;
            this.player.on('waiting', (e) => {
                const playButton = document.getElementsByClassName('vjs-big-play-button');
                if (playButton.length > 0) {
                    playButton[0].style.display = 'none';
                }
                if (this.disconnectHandler) {
                    clearTimeout(this.disconnectHandler);
                    this.disconnectHandler = null;
                }
                
                this.disconnectHandler = setTimeout(() => {
                    this.setState({
                        error: true,
                    });
                }, 40000);
            })

            this.player.on('playing', () => {
                if (this.disconnectHandler) {
                    clearTimeout(this.disconnectHandler);
                }

                this.setState({ playing: true });
            });

            this.player.ima({ adTagUrl: this.props.vmap });
            this.player.ima.initializeAdDisplayContainer();
            this.setState({ screen_width: window.outerWidth });
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
                            {this.props.status && this.props.status.code === 12 ? (
                                <div>
                                    <span style={{ fontSize: 12 }}>{this.props.status.message_client}</span>
                                </div>
                            ) : (
                                <div>
                                    <strong style={{ fontSize: 14 }}>Cannot load the video</strong><br />
                                    <span style={{ fontSize: 12 }}>Please try again later,</span><br />
                                    <span style={{ fontSize: 12 }}>we're working to fix the problem</span>
                                </div>
                            )}
                        </h5>
					</div>
                </div>
            );
            // this.player.remove();
        }
        else {
            playerRef = (
            <div className="player-modal-container">
                <div data-vjs-player>
                    <div
                        onClick={() => {
                            if (this.player) {
                                this.player.pause();
                            }
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: this.state.screen_width / 2,
                            marginTop: '-0.81666em',
                            display: this.state.playing && this.state.user_active ? 'block' : 'none',
                            transform: 'scale(1.5) translateX(-30%) translateY(-30%)',
                            padding: 0
                        }}>
                        <PauseIcon/>
                    </div>
                    <video 
                        autoPlay
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
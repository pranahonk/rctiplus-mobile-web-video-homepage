import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';
import { isIOS, isAndroid } from 'react-device-detect';

import initialize from '../../utils/initialize';
import contentActions from '../../redux/actions/contentActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Wrench from '../../components/Includes/Common/Wrench';
import PauseIcon from '../../components/Includes/Common/PauseIcon';

import Layout from '../../components/Layouts/Default_v2';

import '../../assets/scss/components/content.scss';

import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'video.js/src/css/video-js.scss';
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';
// import 'videojs-youtube';

import 'videojs-seek-buttons';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';

import { DEV_API, VISITOR_TOKEN, SITE_NAME } from '../../config';
import { getCookie } from '../../utils/cookie';
import { programContentPlayEvent, homepageContentPlayEvent, accountHistoryContentPlayEvent, accountMylistContentPlayEvent, accountContinueWatchingContentPlayEvent, libraryProgramContentPlayEvent, searchProgramContentPlayEvent, accountVideoProgress } from '../../utils/appier';
import { convivaVideoJs } from '../../utils/conviva';

class Content extends React.Component {

    static async getInitialProps(ctx) {
        initialize(ctx);

        const accessToken = getCookie('ACCESS_TOKEN');
        const res = await fetch(`${DEV_API}/api/v1/${ctx.query.type}/${ctx.query.content_id}/url`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });

        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (error_code || data.status.code != 0) {
            return { initial: false, content_url: {}, content: {}, status: data.status };
        }

        const res_2 = await fetch(`${DEV_API}/api/v1/${ctx.query.type}/${ctx.query.content_id}`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });

        const error_code_2 = res_2.statusCode > 200 ? res_2.statusCode : false;
        const data_2 = await res_2.json();
        if (error_code_2 || data_2.status.code != 0) {
            return { initial: false, content_url: {}, content: {}, status: data.status };
        }

        return {
            context_data: ctx.query,
            content_url: data,
            content: data_2,
            status: false
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            player_url: '',
            player_vmap: '',
            start_duration: 0,
            error: false,
            error_data: {},
            end_duration: 0,
            hide_footer: false,
            playing: false,
            user_active: false,
            quality_selector_shown: false
        };
        this.player = null;
        this.videoNode = null;
        this.convivaTracker = null;

        const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        this.homepageTitle = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
            if (q.homepage_title) {
                this.homepageTitle = q.homepage_title;
            }
        }

        this.historyHandler = null;
        this.historyAppierHandler = null;
        this.disconnectHandler = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.end_duration != nextState.end_duration) {
            return false;
        }

        return true;
    }

    setSkipButtonCentered() {
        const playerHeight = document.getElementById(this.player.id()).clientHeight;
        const seekButtons = document.getElementsByClassName('vjs-seek-button');
        for (let i = 0; i < seekButtons.length; i++) {
            seekButtons[i].style.bottom = (Math.floor(playerHeight / 2) - 5) + 'px';
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
                        if (isAndroid || isIOS) {
                            console.log('test');
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
                        }
                        else {
                            childs[i].addEventListener('click', function() {
                                console.log('click');
                                self.setState({ quality_selector_shown: !self.state.quality_selector_shown });
                            });
                        }
                        
                        
                        const grandChilds = childs[i].childNodes;
                        for (let j = 0; j < grandChilds.length; j++) {
                            if (grandChilds[j].className == 'vjs-icon-placeholder') {
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

    initPlayer() {
        const content = this.props.content_url;
        let genre = [];
        for (let i = 0; i < content.data.genre.length; i++) {
            genre.push(content.data.genre[i].name);
        }
        const self = this
        if (this.videoNode) {
            videojs.registerPlugin('hlsQualitySelector', qualitySelector)
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
                    src: this.state.player_url,
                    type: 'application/x-mpegURL',
                }]
            }, function onPlayerReady() {
                const vm = this
                console.log('onPlayerReady2', vm);
                // const bpb = vm.getChild('bigPlayButton');
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
                
                self.historyAppierHandler = setInterval(() => {
                    self.setState({ end_duration: vm.currentTime() });
                    if (self.reference) {
                        const data = self.props.context_data;
                        if (data) {
                            switch (self.reference) {
                                case 'homepage_program':
                                    programContentPlayEvent(data.id, data.title, data.content_id, data.content_title, data.type, vm.currentTime(), content.data.duration, 'mweb_homepage_program_content_play');
                                    break;
    
                                case 'exclusive_program':
                                    break;
    
                                case 'mylist_program':
                                    accountMylistContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, vm.currentTime(), content.data.duration, 'mweb_account_mylist_content_play');
                                    break;
    
                                case 'library_program':
                                    libraryProgramContentPlayEvent(content.data.program_title, content.data.program_id, data.content_title, data.type, data.content_id, vm.currentTime(), content.data.duration, 'mweb_library_program_content_play');
                                    break;
    
                                case 'search_program':
                                    searchProgramContentPlayEvent(data.program_id, content.data.program_title, data.content_title, data.type, data.content_id, vm.currentTime(), content.data.duration, 'mweb_search_program_content_play');
                                    break;
    
                                case 'homepage':
                                    homepageContentPlayEvent(self.homepageTitle ? self.homepageTitle : 'N/A', data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, vm.currentTime(), content.data.duration, 'mweb_homepage_content_play');
                                    break;
    
                                case 'history':
                                    accounselftoryContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, vm.currentTime(), content.data.duration, 'mweb_account_history_content_play');
                                    break;
    
                                case 'continue_watching':
                                    accountContinueWatchingContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, vm.currentTime(), content.data.duration, 'mweb_account_continue_watching_content_play');
                                    break;
                            }
                        }
    
                    }
                }, 2500);
                self.historyHandler = setInterval(() => {
                    if (vm) {
                        console.log('POST HISTORY');
    
                        self.props.postHistory(self.props.context_data.content_id, self.props.context_data.type, vm.currentTime())
                            .then(response => {
                                // console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                    
                }, 10000);

                const player = this;
                const assetName = content && content.data ? content.data.content_name : 'N/A';
                self.convivaTracker = convivaVideoJs(assetName, player, true, this.state.player_url, assetName.toUpperCase(), {
					asset_name: assetName.toUpperCase(),
					application_name: 'RCTI+ MWEB',
					player_type: 'VideoJS',
					content_id: (self.props.context_data.content_id ? self.props.context_data.content_id : 'N/A').toString(),
					program_name: assetName,
					version: process.env.VERSION,
					playerVersion: process.env.PLAYER_VERSION,
                    content_name: assetName.toUpperCase(),
                    start_session: self.state.start_duration.toString()
                });
                self.convivaTracker.createSession();

                setTimeout(() => {
                    self.setSkipButtonCentered(); // set centered with delay
                }, 2000);
            });

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
                vm.on('error', e => {
                    if (self.historyHandler) {
                        clearInterval(self.historyHandler);
                    }
                    if (self.historyAppierHandler) {
                        clearInterval(self.historyAppierHandler);
                    }
                    console.log(e);
                });

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
                    promise.then(() => {
                        vm.play()
                        console.log('autoplay')
                    })
                    .catch((err) => console.log(err))
                }

                self.changeQualityIconButton();
            });

            this.player.on('error', (e) => {
                console.log(e);
                if (this.historyHandler) {
                    clearInterval(self.historyHandler);
                }
                if (this.historyAppierHandler) {
                    clearInterval(self.historyAppierHandler);
                }
                this.setState({
                    error: true,
                });
            });
            this.player.hlsQualitySelector({
                displayCurrentQuality: true,
            });
            
            this.player.seekButtons({
                forward: 10,
                back: 10
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

            this.player.currentTime(this.state.start_duration);

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
                    if (this.historyHandler) {
                        clearInterval(this.historyHandler);
                    }
                    if (this.historyAppierHandler) {
                        clearInterval(this.historyAppierHandler);
                    }
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
            
            this.player.ima({ adTagUrl: this.state.player_vmap });
            this.player.ima.initializeAdDisplayContainer();
        }
    }

    initVOD() {
        const content = this.props.content_url;
        const playerId = 'app-jwplayer';
        this.player = window.jwplayer(playerId);
        this.player.setup({
            autostart: true,
            mute: true, //optional, but recommended
            floating: false,
            file: this.state.player_url,
            title: '',
            primary: 'html5',
            width: '100%',
            aspectratio: '16:9',
            displaytitle: true,
            setFullscreen: true,
            stretching: 'exactfit',
            advertising: {
                client: process.env.ADVERTISING_CLIENT,
                tag: this.state.player_vmap
            },
            logo: {
                hide: true
            }
        }).seek(this.state.start_duration);

        const self = this;
        this.player.on('ready', function() {
            conviva.startMonitoring(this);
            conviva.updatePlayerAssetMetadata(this, {
                viewer_id: Math.random().toString().substr(2, 9),
                application_name: 'MWEB',
                asset_cdn: 'Conversant',
                version: process.env.VERSION,
                start_session: self.state.start_duration,
                playerVersion: process.env.PLAYER_VERSION,
                tv_id: content ? content.tv_id : 'N/A',
                tv_name: content ? content.tv_name : 'N/A',
                content_id: self.props.context_data.content_id ? self.props.context_data.content_id : 'N/A',
                asset_name: content && content.data ? content.data.content_name : 'N/A'
            });

            if (isIOS) {
				let elementJwplayerInit = document.querySelector(`#${playerId} > .jw-wrapper`);
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
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('error', error => {
            console.log(error);
            this.player.remove();
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('fullscreen', () => {
            if (screen.orientation.type === 'portrait-primary') {
                if (document.documentElement.requestFullscreen) {
                    document.querySelector(`#${playerId}`).requestFullscreen();
                    console.log('REQ');
                }
                else if (document.documentElement.webkitRequestFullScreen) {
                    document.querySelector(`#${playerId}`).webkitRequestFullScreen();
                    console.log('WEBKIT');
                }
                screen.orientation.lock("landscape-primary");
                this.setState({ hide_footer: false });
            }
            if (screen.orientation.type === 'landscape-primary') {
                if (document.documentElement.requestFullscreen) {
                    document.querySelector(`#${playerId}`).requestFullscreen();
                    console.log('REQ');
                }
                else if (document.documentElement.webkitRequestFullScreen) {
                    document.querySelector(`#${playerId}`).webkitRequestFullScreen();
                    console.log('WEBKIT');
                }
                screen.orientation.lock("portrait-primary");
                this.setState({ hide_footer: true });
            }
		});

        this.player.on('play', function() {
            let genre = [];
            for (let i = 0; i < content.data.genre.length; i++) {
                genre.push(content.data.genre[i].name);
            }

            setInterval(() => {
                self.setState({ end_duration: self.player.getPosition() });
                if (self.reference) {
                    const data = self.props.context_data;
                    if (data) {
                        switch (self.reference) {
                            case 'homepage_program':
                                programContentPlayEvent(data.id, data.title, data.content_id, data.content_title, data.type, self.player.getPosition(), content.data.duration, 'mweb_homepage_program_content_play');
                                break;

                            case 'exclusive_program':
                                break;

                            case 'mylist_program':
                                accountMylistContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, self.player.getPosition(), content.data.duration, 'mweb_account_mylist_content_play');
                                break;

                            case 'library_program':
                                libraryProgramContentPlayEvent(content.data.program_title, content.data.program_id, data.content_title, data.type, data.content_id, self.player.getPosition(), content.data.duration, 'mweb_library_program_content_play');
                                break;

                            case 'search_program':
                                searchProgramContentPlayEvent(data.program_id, content.data.program_title, data.content_title, data.type, data.content_id, self.player.getPosition(), content.data.duration, 'mweb_search_program_content_play');
                                break;

                            case 'homepage':
                                homepageContentPlayEvent(self.homepageTitle ? self.homepageTitle : 'N/A', data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, self.player.getPosition(), content.data.duration, 'mweb_homepage_content_play');
                                break;

                            case 'history':
                                accounselftoryContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, self.player.getPosition(), content.data.duration, 'mweb_account_history_content_play');
                                break;

                            case 'continue_watching':
                                accountContinueWatchingContentPlayEvent(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), self.props.content.meta.image_path + '593' + self.props.content.data.portrait_image, self.props.content.meta.image_path + '593' + self.props.content.data.landscape_image, self.player.getPosition(), content.data.duration, 'mweb_account_continue_watching_content_play');
                                break;
                        }
                    }

                }
            }, 2500);

            setInterval(() => {
                console.log('POST HISTORY');

                self.props.postHistory(self.props.context_data.content_id, self.props.context_data.type, self.player.getPosition())
                    .then(response => {
                        // console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }, 10000);
        });
    }

    tryAgain() {
        this.setState({ error: false }, () => {
            // this.initVOD();
            this.initPlayer();
        });
    }

    getMetadata() {
        const content = this.props.content_url;
        let metadata = {
            title: `${content.data.content_name} - ${SITE_NAME}`,
            description: ''
        };
        switch (this.props.context_data.type) {
            case 'episode':
                metadata.description = `Nonton ${content.data.content_name} Online - Season ${this.props.content.data.season} - Episode ${this.props.content.data.episode} - RCTI+`;
                break;

            case 'extra':
            case 'clip':
                metadata.description = `${content.data.content_name} - ${content.data.program_title} - ${SITE_NAME}`;
                break;
        }
        return metadata;
    }

    async componentDidMount() {
        Router.events.on("routeChangeStart", () => {
            if (this.player && this.videoNode) {
                if (this.historyHandler) {
                    console.log('clear');
                    clearInterval(this.historyHandler);
                }
                if (this.historyAppierHandler) {
                    clearInterval(this.historyAppierHandler);
                }
                this.player.dispose();
            }
        });

        const content = this.props.content_url;
        if (Object.keys(content).length > 0 && content.status.code === 0) {
            this.props.getContinueWatchingByContentId(this.props.context_data.content_id, this.props.context_data.type)
                .then(response_2 => {
                    let startDuration = 0;
                    if (response_2 && response_2.status === 200 && response_2.data.status.code === 0) {
                        startDuration = response_2.data.data.last_duration;
                    }

                    
                    this.setState({
                        player_url: content.data.url,
                        player_vmap: content.data[process.env.VMAP_KEY],
                        start_duration: startDuration
                    // }, () => this.initVOD());
                    }, () => this.initPlayer());
                })
                .catch(() => {
                    this.setState({
                        player_url: content.data.url,
                        player_vmap: content.data[process.env.VMAP_KEY],
                        start_duration: 0
                    // }, () => this.initVOD());
                    }, () => this.initPlayer());
                });

        }

        const data = this.props.context_data;
        if (data && this.reference && this.reference === 'continue_watching') {
            window.onbeforeunload = () => {

                console.log('close', this.state.end_duration);
                const progress = (this.state.end_duration / this.player.getDuration()) * 100;
                console.log(progress);
                let progressStatus = false;
                if (progress >= 100) {
                    progressStatus = 'finished';
                }
                else if (progress >= 90) {
                    progressStatus = 90;
                }
                else if (progress >= 75) {
                    progressStatus = 75;
                }
                else if (progress >= 50) {
                    progressStatus = 50;
                }
                else if (progress >= 25) {
                    progressStatus = 25;
                }

                let genre = [];
                for (let i = 0; i < content.data.genre.length; i++) {
                    genre.push(content.data.genre[i].name);
                }
                if (progressStatus) {
                    if (progressStatus === 'finished') {
                        accountVideoProgress(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), this.props.content.meta.image_path + '593' + this.props.content.data.portrait_image, this.props.content.meta.image_path + '593' + this.props.content.data.landscape_image, this.state.start_duration, this.state.end_duration, content.data.duration, 'mweb_account_video_finished');
                    }
                    else {
                        accountVideoProgress(data.type, data.content_id, data.content_title, content.data.program_title, genre.join(','), this.props.content.meta.image_path + '593' + this.props.content.data.portrait_image, this.props.content.meta.image_path + '593' + this.props.content.data.landscape_image, this.state.start_duration, this.state.end_duration, content.data.duration, 'mweb_account_video_completed_' + progressStatus);
                    }
                }
            };
        }
    }

    render() {
        let playerRef = (<div></div>);
        let errorRef = (<div></div>);
        let title = '';

        if (this.state.error || Object.keys(this.props.content_url).length <= 0) {
            title = 'Data Not Found';
            console.log(this.state.error_data);
            errorRef = (
                <div className="wrapper-content" style={{ margin: 0 }}>
                    <div style={{
                        textAlign: 'center',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <Wrench />
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
        }
        else {
            const metadata = this.getMetadata();
            title = metadata.title;
            playerRef = (
                <div>
                    <Head>
                        <meta name="description" content={metadata.description} />
                    </Head>
                    <div className="player-container">
                        <div data-vjs-player>
                            <div
                                onClick={() => {
                                    if (this.player) {
                                        this.player.pause();
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    marginTop: '-0.81666em',
                                    marginLeft: '-1.5em',
                                    display: this.state.playing && this.state.user_active ? 'block' : 'none',
                                    transform: 'scale(1.5)',
                                    height: '1.63332em',
                                    width: '3em'
                                }}>
                                <PauseIcon/>
                            </div>
                            <video 
                                preload="auto"
                                autoPlay
                                playsInline
                                style={{ 
                                    width: '100%'
                                }}
                                ref={ node => this.videoNode = node } 
                                className="video-js vjs-default-skin vjs-big-play-centered"></video>
                        </div>
                    </div>
                </div>
            );
        }



        return (
            <Layout title={title} hideFooter={this.state.hide_footer}>
                <ArrowBackIcon className="back-btn" onClick={() => Router.back()} />
                {(this.state.error || Object.keys(this.props.content_url).length <= 0) ? errorRef : playerRef}
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...historyActions
})(withRouter(Content));
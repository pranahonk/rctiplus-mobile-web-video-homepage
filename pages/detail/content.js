import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import initialize from '../../utils/initialize';
import contentActions from '../../redux/actions/contentActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Layout from '../../components/Layouts/Default';

import '../../assets/scss/components/content.scss';

class Content extends React.PureComponent {

    static getInitialProps(ctx) {
		initialize(ctx);
		return { context_data: ctx.query };
	}

    constructor(props) {
        super(props);
        this.state = {
            player_url: '',
            player_vmap: '',
            start_duration: 0
        };
        this.player = null;
    }

    initVOD() {
		this.player = window.jwplayer('app-jwplayer');
		this.player.setup({
			autostart: true,
			file: this.state.player_url,
			primary: 'html5',
			width: '100%',
			aspectratio: '16:9',
			displaytitle: true,
			setFullscreen: true,
			stretching:'fill',
			advertising: {
				client: 'vast',
				tag: this.state.player_vmap
			},
			logo: {
				hide: true
			}
        }).seek(this.state.start_duration);
        
        this.player.on('firstFrame', () => {
            console.log('FIRST FRAME');
            conviva.startMonitoring(this);
            conviva.updatePlayerAssetMetadata(this, {
                // viewer_id:vm.$store.getters['auth/isAuthenticated'] ? vm.$store.getters['auth/getVid'] : vm.uniqueId(),
                viewer_id: 1,
                application_name: 'MWEB',
                asset_cdn: 'Conversant',
                // version: process.env.VERSION,
                version: '0.9.2',
                // start_session: this.getPosition(),
                start_session: 1,
                playerVersion: '8.7.6',
                // tv_id: vm.getChanelId(vm.$route.params.channel),
                tv_id: 3,
                // tv_name: vm.$route.params.channel,
                tv_name: 'GTV',
                // content_id: vm.$route.params.newid === undefined ? 'N/A' : vm.$route.params.newid  
                content_id: this.props.context_data.content_id
            });
        });

        this.player.on('play', () => {
            setInterval(() => {
                this.props.postHistory(this.props.context_data.content_id, this.props.context_data.type, this.player.getPosition())
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }, 10000);
        });

        
	}

    async componentDidMount() {
        let response = null;
        try {
            switch (this.props.context_data.type) {
                case 'episode':
                    response = await this.props.getEpisodeUrl(this.props.context_data.content_id);
                    break;

                case 'extra':
                    response = await this.props.getExtraUrl(this.props.context_data.content_id);
                    break;
                    
                case 'clip':
                    response = await this.props.getClipUrl(this.props.context_data.content_id);
                    break;
            }    
        }
        catch (error) {
            console.log(error);
        }
        
        if (response && response.status === 200 && response.data.status.code === 0) {
            const data = response.data.data;
            this.props.getContinueWatchingByContentId(this.props.context_data.content_id, this.props.context_data.type)
                .then(response_2 => {
                    let startDuration = 0;
                    if (response_2 && response_2.status === 200 && response_2.data.status.code === 0) {
                        startDuration = response_2.data.data.last_duration;
                    }

                    this.setState({
                        player_url: data.url,
                        player_vmap: data.vmap,
                        start_duration: startDuration
                    }, () => this.initVOD());
                })
                .catch(error => {
                    this.setState({
                        player_url: data.url,
                        player_vmap: data.vmap,
                        start_duration: 0
                    }, () => this.initVOD());
                });
            
        }
    }

    render() {
        return (
            <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                <ArrowBackIcon className="back-btn" onClick={() => Router.back()}/>
                <div className="player-container">
                    <div id="app-jwplayer"></div>
                </div>
            </Layout>
        );
    }    

}

export default connect(state => state, {
    ...contentActions,
    ...historyActions
})(withRouter(Content));
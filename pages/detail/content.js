import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import initialize from '../../utils/initialize';
import contentActions from '../../redux/actions/contentActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Layout from '../../components/Layouts/Default';

import '../../assets/scss/components/content.scss';

import { DEV_API, VISITOR_TOKEN, SITE_NAME } from '../../config';
import { getCookie } from '../../utils/cookie';

class Content extends React.PureComponent {

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
            return { initial: false, content_url: {}, content: {} };
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
            return { initial: false, content_url: {}, content: {} };
        }

		return { 
            context_data: ctx.query, 
            content_url: data,
            content: data_2
        };
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
    
    getMetadata() {
        let metadata = {
            title: `${this.props.content_url.data.content_name} - ${SITE_NAME}`,
            description: ''
        };
        switch (this.props.context_data.type) {
            case 'episode':
                metadata.description = `Nonton ${this.props.content_url.data.content_name} Online - Season ${this.props.content.data.season} - Episode ${this.props.content.data.episode} - RCTI+`;
                break;

            case 'extra':
            case 'clip':
                metadata.description = `${this.props.content_url.data.content_name} - ${this.props.content_url.data.program_title} - ${SITE_NAME}`;
                break;
        }
        return metadata;
    }

    async componentDidMount() {
        if (this.props.content_url && this.props.content_url.status.code === 0) {
            this.props.getContinueWatchingByContentId(this.props.context_data.content_id, this.props.context_data.type)
                .then(response_2 => {
                    let startDuration = 0;
                    if (response_2 && response_2.status === 200 && response_2.data.status.code === 0) {
                        startDuration = response_2.data.data.last_duration;
                    }

                    this.setState({
                        player_url: this.props.content_url.data.url,
                        player_vmap: this.props.content_url.data.vmap,
                        start_duration: startDuration
                    }, () => this.initVOD());
                })
                .catch(error => {
                    this.setState({
                        player_url: this.props.content_url.data.url,
                        player_vmap: this.props.content_url.data.vmap,
                        start_duration: 0
                    }, () => this.initVOD());
                });
            
        }
    }

    render() {
        const metadata = this.getMetadata();

        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description}/>
                </Head>
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
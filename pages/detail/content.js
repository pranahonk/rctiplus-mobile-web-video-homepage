import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import initialize from '../../utils/initialize';
import contentActions from '../../redux/actions/contentActions';
import historyActions from '../../redux/actions/historyActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import { Button } from 'reactstrap';

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
            start_duration: 0,
            error: false,
            error_data: {}
        };
        this.player = null;
        console.log(this.props.content_url);
    }

    initVOD() {
        const content = this.props.content_url;
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
        
        this.player.on('setupError', error => {
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('error', error => {
            this.player.remove();
            this.setState({
                error: true,
                error_data: error
            });
        });

        this.player.on('firstFrame', () => {
            console.log('FIRST FRAME');
            conviva.startMonitoring(this);
            conviva.updatePlayerAssetMetadata(this, {
                viewer_id: Math.random().toString().substr(2, 9),
                application_name: 'MWEB',
                asset_cdn: 'Conversant',
                version: process.env.VERSION,
                start_session: this.state.start_duration,
                playerVersion: process.env.PLAYER_VERSION,
                tv_id: content ? content.tv_id : 'N/A',
                tv_name: content ? content.tv_name : 'N/A',
                content_id: this.props.context_data.content_id ? this.props.context_data.content_id  : 'N/A'
            });
        });

        this.player.on('play', () => {
            conviva.updatePlayerAssetMetadata(this, {
                playerType: 'JWPlayer',
                content_type: content ? content.content_type : 'N/A',
                program_id: content ? content.program_id : 'N/A', 
                program_name: content ? content.program_title : 'N/A',
                date_video: 'N/A',
                time_video: 'N/A',
                page_title:'N/A',
                genre: content && content.genre && content.genre.length > 0 ? content.genre[0].name : 'N/A',
                page_view: 'N/A',
                app_version: 'N/A',
                group_content_page_title: 'N/A',
                group_content_name: 'N/A',
                exclusive_tab_name: 'N/A'
            });
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

    tryAgain() {
        this.setState({ error: false }, () => {
            this.initVOD();
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
        const content = this.props.content_url;
        if (content && content.status.code === 0) {
            this.props.getContinueWatchingByContentId(this.props.context_data.content_id, this.props.context_data.type)
                .then(response_2 => {
                    let startDuration = 0;
                    if (response_2 && response_2.status === 200 && response_2.data.status.code === 0) {
                        startDuration = response_2.data.data.last_duration;
                    }

                    this.setState({
                        player_url: content.data.url,
                        player_vmap: content.data.vmap,
                        start_duration: startDuration
                    }, () => this.initVOD());
                })
                .catch(error => {
                    this.setState({
                        player_url: content.data.url,
                        player_vmap: content.data.vmap,
                        start_duration: 0
                    }, () => this.initVOD());
                });
            
        }
    }

    render() {
        const metadata = this.getMetadata();

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
                        <img src={`/static/icons/wrench.svg`}/>
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
        else {
            playerRef = (
                <div className="player-container">
                    <div id="app-jwplayer"></div>
                </div>
            );
        }

        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description}/>
                </Head>
                <ArrowBackIcon className="back-btn" onClick={() => Router.back()}/>
                {this.state.error ? errorRef : playerRef}
            </Layout>
        );
    }    

}

export default connect(state => state, {
    ...contentActions,
    ...historyActions
})(withRouter(Content));
import React from 'react'
import { connect } from 'react-redux';
import Img from 'react-image';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

import { showAlert } from '../../utils/helpers';

import Error from '../error';

import contentActions from '../../redux/actions/contentActions';
import searchActions from '../../redux/actions/searchActions';

//load default layout
import Layout from '../../components/Layouts/Default';
import Navbar from '../../components/Includes/Navbar/NavDetail';
import PlayerModal from '../../components/Modals';
import ActionModal from '../../components/Modals/ActionModal';
import SelectModal from '../../components/Modals/SelectModal';
import ActionSheet from '../../components/Modals/ActionSheet';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Button, Row, Col } from 'reactstrap';

import '../../assets/scss/plugins/carousel/carousel.scss';
import '../../assets/scss/components/detail.scss';

import { BASE_URL, DEV_API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

class Detail extends React.Component {

    static async getInitialProps(ctx) {
        const programId = ctx.query.id;
        const accessToken = getCookie('ACCESS_TOKEN');
        const res = await fetch(`${DEV_API}/api/v1/program/${programId}/detail`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (error_code || data.status.code == 1) {
            return { initial: false };
        }

        return { initial: data };
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            summary: '',
            portrait_image: '',
            starring: [],
            trailer_url: '',
            genre: [],
            release_date: '',
            meta: {},
            resolution: 152,
            episodes: [],
            seasons: [],
            related_programs: [],
            modal: false,
            rate_modal: false,
            select_modal: false,
            action_sheet: false,
            selected_season: 1,
            episode_page: 1,
            length: 5,
            show_more_allowed: true,
            caption: '',
            url: '',
            hashtags: []
        };

        this.player = null;
    }

    showMore() {
        this.props.getProgramEpisodes(this.props.router.query.id, this.state.season, this.state.episode_page + 1, this.state.length)
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    let episodes = this.state.episodes;
                    episodes.push.apply(episodes, response.data.data);
                    this.setState({ 
                        episodes: episodes,
                        episode_page: this.state.episode_page + 1,
                        show_more_allowed: response.data.data.length >= this.state.length 
                    });
                }
            })
            .catch(error => console.log(error));
    }

    showOpenPlaystoreAlert() {
        showAlert('To be able to watch this episode offline, please download RCTI+ application on Playstore', '', 'Open Playstore', 'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); });
    }

    componentDidMount() {
        
        this.props.getProgramDetail(this.props.router.query.id)
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    const data = response.data.data;
                    this.setState({
                        title: data.title,
                        summary: data.summary,
                        portrait_image: data.portrait_image,
                        starring: data.starring,
                        genre: data.genre,
                        release_date: data.release_date,
                        trailer_url: data.trailer_url,
                        meta: response.data.meta
                    });

                    this.props.getProgramEpisodes(this.props.router.query.id, this.state.selected_season, this.state.episode_page, this.state.length)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                this.setState({ 
                                    episodes: response.data.data,
                                    show_more_allowed: response.data.data.length >= this.state.length 
                                });
                            }
                        })
                        .catch(error => console.log(error));

                    this.props.getRelatedProgram(this.props.router.query.id)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                this.setState({ related_programs: response.data.data });
                            }
                        })
                        .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error));
    
        this.props.getProgramSeason(this.props.router.query.id)
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    const data = response.data.data;
                    this.setState({ seasons: data }, () => console.log(this.state.seasons));
                }
            })
            .catch(error => console.log(error));
    }

    toggle() {
        this.setState({ modal: !this.state.modal }, () => {
            if (this.state.modal) {
                setTimeout(() => {
                    if (this.player != null) {
                        this.player.play();
                    }
                }, 1000);
            }
        });
    }

    toggleRateModal() {
        this.setState({ rate_modal: !this.state.rate_modal });
    }

    toggleActionSheet(caption = '', url = '', hashtags = []) {
        this.setState({ 
            action_sheet: !this.state.action_sheet,
            caption: caption,
            url: url,
            hashtags: hashtags
        });
    }

    toggleSelectModal() {
        this.setState({ select_modal: !this.state.select_modal });
    }

    render() {
        if (this.props.initial == false) {
            return (
                <div>
                    <Error/>
                </div>
            );
        }

        let showMoreButton = '';
        if (this.state.show_more_allowed) {
            showMoreButton = (<div className="list-footer">
                                <Button onClick={this.showMore.bind(this)} size="sm" className="show-more-button">
                                    <ExpandMoreIcon /> Show More
                                </Button>
                            </div>);
        }

        // https://www.it-consultis.com/blog/best-seo-practices-for-react-websites
        return (
            <Layout title={this.props.initial.data.title + ' | Program Pilihan'}>
                <Head>
                    <meta name="description" content={this.props.initial.data.summary}/>
                </Head>
                <Navbar />
                <PlayerModal 
                    open={this.state.modal}
                    toggle={this.toggle.bind(this)}
                    onReady={() => this.player = window.jwplayer('example-id')}
                    playerId="example-id"
                    videoUrl={this.state.trailer_url}/>

                <ActionModal 
                    open={this.state.rate_modal}
                    toggle={this.toggleRateModal.bind(this)}/>

                <SelectModal 
                    open={this.state.select_modal}
                    data={this.state.seasons}
                    toggle={this.toggleSelectModal.bind(this)}/>

                <ActionSheet
                    caption={this.state.caption}
                    url={this.state.url}
                    open={this.state.action_sheet}
                    hashtags={this.state.hashtags}
                    toggle={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rcti'])}/>

                <div style={{ backgroundImage: 'url(' + (this.state.meta.image_path + this.state.resolution + this.state.portrait_image) + ')' }} className="bg-jumbotron"></div>
                <div className="content">
                    <div className="content-thumbnail">
                        <Img className="content-thumbnail-image" src={[this.state.meta.image_path + this.state.resolution + this.state.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
                    </div>
                    <div className="watch-button-container">
                        <Button onClick={this.toggle.bind(this)} className="watch-button">
                            <PlayCircleFilledIcon /> Watch Trailer
                        </Button>
                    </div>
                    <p className="content-title"><strong>{this.state.title}</strong></p>
                    <p className="content-genre">| {this.state.release_date} |
                        &nbsp;{this.state.genre.map((g, i) => {
                        let str = g.name;
                        if (i < this.state.genre.length - 1) {
                            str += ' - ';
                        }
                        return str;
                    })}&nbsp;
                    |</p>
                    <p className="content-description">{this.state.summary}</p>
                    <p className="content-description">Starring: {this.state.starring.map((s, i) => {
                        let str = s.name;
                        if (i < this.state.starring.length - 1) {
                            str += ', ';
                        }
                        return str;
                    })}</p>
                    <div className="action-buttons">
                        <div className="action-button">
                            <ThumbUpIcon onClick={this.toggleRateModal.bind(this)} className="action-icon" />
                            <p>Rate</p>
                        </div>
                        <div className="action-button">
                            <PlaylistAddIcon className="action-icon" />
                            <p>My List</p>
                        </div>
                        <div className="action-button">
                            <ShareIcon onClick={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rcti'])} className="action-icon" />
                            <p>Share</p>
                        </div>
                    </div>
                </div>
                <div className="list-box">
                    <div className="list-menu">
                        <p className="menu-title">Episode</p>
                    </div>
                    <div className="list-content">
                        <p className="list-expand" onClick={this.toggleSelectModal.bind(this)}>
                            Season {this.state.selected_season} <ExpandMoreIcon />
                        </p>
                        {this.state.episodes.map(e => (
                            <div key={e.id}>
                                <Row>
                                    <Col xs={6}>
                                        <Img className="list-item-thumbnail" src={[this.state.meta.image_path + '140' + e.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
                                    </Col>
                                    <Col xs={6}>
                                        <p className="item-title">S{e.season}:E{e.episode} {e.title}</p>
                                        <div className="item-action-buttons">
                                            <div className="action-button">
                                                <PlaylistAddIcon className="action-icon" />
                                            </div>
                                            <div className="action-button">
                                                <ShareIcon onClick={this.toggleActionSheet.bind(this, 'S' + e.season + ':E' + e.episode + ' ' + e.title, BASE_URL + this.props.router.asPath, ['rcti'])} className="action-icon" />
                                            </div>
                                            <div className="action-button">
                                                <GetAppIcon onClick={this.showOpenPlaystoreAlert.bind(this)} className="action-icon" />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className="item-description">{e.summary}</p>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                    {showMoreButton}
                    
                </div>
                
                <div className="related-box">
                    <div className="related-menu">
                        <p className="related-title"><strong>Related</strong></p>
                        {/* <p className="related-subtitle">Show more &gt;</p> */}
                        <div className="related-slider">
                            <Carousel
                                id="detail-carousel"
                                showThumbs={false}
                                showIndicators={false}
                                stopOnHover={true}
                                showArrows={false}
                                showStatus={false}
                                swipeScrollTolerance={1}
                                onClickItem={(index) => {
                                    Router.push('/detail/' + this.state.related_programs[index].id);
                                }}
                                swipeable={true}>
                                {this.state.related_programs.map(rp => (
                                    <Lazyload key={rp.id} height={100}>
                                        <Img src={[this.state.meta.image_path + '140' + rp.portrait_image, '/static/placeholders/placeholder_potrait.png']} className="related-program-thumbnail" />
                                    </Lazyload>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...searchActions
})(withRouter(Detail));
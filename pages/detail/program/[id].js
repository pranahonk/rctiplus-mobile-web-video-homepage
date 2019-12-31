import React from 'react'
import { connect } from 'react-redux';
import Img from 'react-image';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import classnames from 'classnames';

import { showAlert } from '../../../utils/helpers';

import Error from '../../error';

import contentActions from '../../../redux/actions/contentActions';
import searchActions from '../../../redux/actions/searchActions';
import likeActions from '../../../redux/actions/likeActions';

//load default layout
import Layout from '../../../components/Layouts/Default';
import Navbar from '../../../components/Includes/Navbar/NavDetail';
import PlayerModal from '../../../components/Modals';
import ActionModal from '../../../components/Modals/ActionModal';
import SelectModal from '../../../components/Modals/SelectModal';
import ActionSheet from '../../../components/Modals/ActionSheet';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import '../../../assets/scss/plugins/carousel/carousel.scss';
import '../../../assets/scss/components/detail.scss';

import { BASE_URL, DEV_API, VISITOR_TOKEN } from '../../../config';
import { getCookie } from '../../../utils/cookie';

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
            active_tab: '1',
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
            player_modal: false,
            rate_modal: false,
            select_modal: false,
            action_sheet: false,
            selected_season: 1,
            episode_page: 1,
            extra_page: 1,
            photo_page: 1,
            clip_page: 1,
            length: 5,
            extra_length: 5,
            photo_length: 5,
            clip_length: 5,
            caption: '',
            url: '',
            hashtags: [],
            contents: {
                'episode': [],
                'extra': [],
                'clip': [],
                'photo': []
            },
            like_history: [],
            tabs: [],
            response_data: {},
            selected_episode: {}
        };

        this.player = this.player2 = null;
        this.tabs = ['episode', 'extra', 'clip', 'photo'];
    }

    showMore() {
        this.props.getProgramEpisodes(this.props.router.query.id, this.props.contents.selected_season, this.props.contents.current_page, this.state.length)
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    let episodes = this.props.contents.episodes;
                    this.setState({ 
                        episodes: episodes,
                        episode_page: this.props.contents.current_page,
                        selected_season: this.props.contents.selected_season
                    });
                    this.props.setShowMoreAllowed(response.data.data.length >= this.state.length )
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
                        meta: response.data.meta,
                        tabs: [],
                        response_data: response.data.data
                    });

                    this.props.getLikeHistory(this.props.router.query.id);

                    this.props.getProgramEpisodes(this.props.router.query.id, this.props.contents.selected_season, this.props.contents.current_page, this.state.length)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                const contents = this.state.contents;
                                contents['episode'] = this.props.contents.episodes;
                                this.setState({ 
                                    contents: contents,
                                    episodes: this.props.contents.episodes,
                                    selected_season: this.props.contents.selected_season, 
                                    episode_page: this.props.contents.current_page
                                });
                                console.log(this.props.contents.episodes);
                                this.props.setShowMoreAllowed(this.props.contents.episodes.length >= this.state.length, 'EPISODES');
                            }
                        })
                        .catch(error => console.log(error));

                    this.props.getProgramExtra(this.props.router.query.id, this.props.contents.current_extra_page, this.state.extra_length)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                const contents = this.state.contents;
                                contents['extra'] = this.props.contents.extras;
                                this.setState({
                                    contents: contents,
                                    extras: this.props.contents.extras,
                                    extra_page: this.props.contents.current_extra_page
                                });
                                this.props.setShowMoreAllowed(this.props.contents.extras.length >= this.state.extra_length, 'EXTRAS');
                            }
                        })
                        .catch(error => console.log(error));

                    this.props.getProgramPhoto(this.props.router.query.id, this.props.contents.current_photo_page, this.state.photo_length)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                const contents = this.state.contents;
                                contents['photo'] = this.props.contents.photos;
                                this.setState({
                                    contents: contents,
                                    photos: this.props.contents.photos,
                                    photo_page: this.props.contents.current_photo_page
                                });
                                this.props.setShowMoreAllowed(this.props.contents.photos.length >= this.state.photo_length, 'PHOTOS');
                            }
                        })
                        .catch(error => console.log(error));

                    this.props.getProgramClip(this.props.router.query.id, this.props.contents.current_clip_page, this.state.clip_length)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                const contents = this.state.contents;
                                contents['clip'] = this.props.contents.clips;
                                this.setState({
                                    contents: contents,
                                    clips: this.props.contents.clips,
                                    clip_page: this.props.contents.current_clip_page
                                });
                                this.props.setShowMoreAllowed(this.props.contents.clips.length >= this.state.clip_length, 'CLIPS');
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
                    this.setState({ seasons: data });
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
        if (this.props.likes.data && this.props.likes.data.length > 0 && !this.state.rate_modal) {
            this.props.postLike(this.props.router.query.id, 'program', 'INDIFFERENT');
        }
        else {
            this.setState({ rate_modal: !this.state.rate_modal });
        }
    }

    togglePlayerModal(data, type = 'episode') {
        console.log(data);
        this.setState({ player_modal: !this.state.player_modal }, () => {
            if (this.state.player_modal) {
                switch (type) {
                    case 'episode':
                        this.props.getEpisodeUrl(data.id)
                            .then(response => {
                                this.setState({ selected_episode: response.data.data });
                            })
                            .catch(error => console.log(error));
                        break;

                    case 'extra':
                        this.props.getExtraUrl(data.id)
                            .then(response => {
                                this.setState({ selected_episode: response.data.data });
                            })
                            .catch(error => console.log(error));
                        break;

                    case 'clip':
                        this.props.getClipUrl(data.id)
                            .then(response => {
                                this.setState({ selected_episode: response.data.data });
                            })
                            .catch(error => console.log(error));
                        break;
                }
                
            }
        });
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

    toggleTab(tab, tabName = 'Episode') {
        if (this.state.active_tab !== tab) {
            this.setState({ active_tab: tab }, () => {
                // TODO
            });
        }
    }

    checkLikeStatus() {
        let thumbs = null;
        if (this.props.likes.data && this.props.likes.data.length > 0) {
            const likeStatus = this.props.likes.data[0];
            if (likeStatus.status === 'LIKE') {
                thumbs = <ThumbUpIcon onClick={this.toggleRateModal.bind(this)} className="action-icon" />;
            }
            else if (likeStatus.status === 'DISLIKE') {
                thumbs = <ThumbDownIcon onClick={this.toggleRateModal.bind(this)} className="action-icon" />;
            }
        }
        else {
            thumbs = <ThumbUpAltOutlinedIcon onClick={this.toggleRateModal.bind(this)} className="action-icon" />;
        }

        return thumbs;
    }

    render() {
        const { episode, extra, clip, photo } = this.state.response_data;
        const tabs = [];

        if (episode > 0) {
            tabs.push(<NavItem key={'nav-1'} className="menu-title">
                        <NavLink onClick={this.toggleTab.bind(this, '1', 'Episode')} className={classnames({ active: this.state.active_tab === '1' })}>Episode</NavLink>
                    </NavItem>);
        }
        if (extra > 0) {
            tabs.push(<NavItem key={'nav-2'} className="menu-title">
                        <NavLink onClick={this.toggleTab.bind(this, '2', 'Extra')} className={classnames({ active: this.state.active_tab === '2' })}>Extras</NavLink>
                    </NavItem>);
        }
        if (clip > 0) {
            tabs.push(<NavItem key={'nav-3'} className="menu-title">
                        <NavLink onClick={this.toggleTab.bind(this, '3', 'Clip')} className={classnames({ active: this.state.active_tab === '3' })}>Clips</NavLink>
                    </NavItem>);
        }
        if (photo > 0) {
            tabs.push(<NavItem key={'nav-4'} className="menu-title">
                        <NavLink onClick={this.toggleTab.bind(this, '4', 'Photo')} className={classnames({ active: this.state.active_tab === '4' })}>Photos</NavLink>
                    </NavItem>);
        }

        if (this.props.initial == false) {
            return (
                <div>
                    <Error/>
                </div>
            );
        }

        let showMoreButton = '';
        if (this.props.contents.show_more_allowed) {
            showMoreButton = (<div className="list-footer">
                                <Button onClick={this.showMore.bind(this)} size="sm" className="show-more-button">
                                    <ExpandMoreIcon /> Show More
                                </Button>
                            </div>);
        }

        const thumbs = this.checkLikeStatus();

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

                <PlayerModal 
                    open={this.state.player_modal}
                    toggle={this.togglePlayerModal.bind(this)}
                    onReady={() => this.player2 = window.jwplayer('example-id2')}
                    playerId="example-id2"
                    videoUrl={this.state.selected_episode ? this.state.selected_episode.url : ''}/>

                <ActionModal 
                    open={this.state.rate_modal}
                    programId={this.props.router.query.id}
                    type={'program'}
                    toggle={this.toggleRateModal.bind(this)}/>

                <SelectModal 
                    episodeListLength={this.state.length}
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
                            {thumbs}
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
                    <Nav tabs className="list-menu">
                        {tabs}
                    </Nav>
                    <TabContent className="list-content" activeTab={this.state.active_tab}>
                        <TabPane tabId={'1'}>
                            <p className="list-expand" onClick={this.toggleSelectModal.bind(this)}>
                                Season {this.props.contents.selected_season} <ExpandMoreIcon />
                            </p>
                            {this.state.contents['episode'].map(e => (
                                <div key={e.id} onClick={this.togglePlayerModal.bind(this, e, 'episode')}>
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
                        </TabPane>
                        <TabPane tabId={'2'}>
                            {this.state.contents['extra'].map(e => (
                                <div key={e.id} onClick={this.togglePlayerModal.bind(this, e, 'extra')}>
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
                                </div>
                            ))}
                        </TabPane>
                        <TabPane tabId={'3'}>
                            {this.state.contents['clip'].map(e => (
                                <div key={e.id} onClick={this.togglePlayerModal.bind(this, e, 'clip')}>
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
                                </div>
                            ))}
                        </TabPane>
                        <TabPane tabId={'4'}>
                            <Row>
                                {this.state.contents['photo'].map(e => (
                                    <Col xs={6} key={e.id}>
                                        <div>
                                            <Img className="list-item-thumbnail list-item-photo" src={[this.state.meta.image_path + '140' + e.program_icon_image, '/static/placeholders/placeholder_landscape.png']} />
                                            <PhotoLibraryIcon className="img-icon"/>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </TabPane>
                    </TabContent>
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
                                    Router.push('/detail/program/' + this.state.related_programs[index].id);
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
    ...searchActions,
    ...likeActions
})(withRouter(Detail));
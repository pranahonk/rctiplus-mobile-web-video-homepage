import React from 'react';
import { connect } from 'react-redux';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import classnames from 'classnames';

import { showAlert } from '../utils/helpers';

import Error from './error';

import contentActions from '../redux/actions/contentActions';
import searchActions from '../redux/actions/searchActions';
import likeActions from '../redux/actions/likeActions';
import bookmarkActions from '../redux/actions/bookmarkActions';
import pageActions from '../redux/actions/pageActions';

import Layout from '../components/Layouts/Default';
import Navbar from '../components/Includes/Navbar/NavDetail';
import PlayerModal from '../components/Modals';
import ActionModal from '../components/Modals/ActionModal';
import SelectModal from '../components/Modals/SelectModal';
import ActionSheet from '../components/Modals/ActionSheet';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import '../assets/scss/plugins/carousel/carousel.scss';
import '../assets/scss/components/detail.scss';

import { BASE_URL, DEV_API, VISITOR_TOKEN, SITE_NAME } from '../config';
import { getCookie } from '../utils/cookie';

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
        if (error_code || data.status.code === 1) {
            return { initial: false };
        }

        return { initial: data, query: ctx.query };
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
            resolution: 130,
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
            selected_episode: {},
            mylist_data: {},
            program_in_list: false,
            bookmarked_episode: [],
            bookmarked_extra: [],
            bookmarked_clip: [],
            loading: false,
            endpage: false,
            page: 1
        };

        this.player = this.player2 = null;
        this.tabs = ['episode', 'extra', 'clip', 'photo'];
        this.props.setPageLoader();
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

    loadMore() {
		if (!this.state.loading && !this.state.endpage) {
			const page = this.state.page + 1;
			this.setState({ loading: true }, () => {
				this.LoadingBar && this.LoadingBar.continuousStart();
				this.props.getRelatedProgram(this.props.router.query.id, page, 10)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							const contents = this.state.related_programs;
							contents.push.apply(contents, response.data.data);
							this.setState({ loading: false, related_programs: contents, page: page, endpage: response.data.data.length < 10 });
						}
						else {
							this.setState({ loading: false });
						}
						this.LoadingBar && this.LoadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.setState({ loading: false, endpage: true })
						this.LoadingBar && this.LoadingBar.complete();
					});
			});
		}
	}

    componentDidMount() {
        this.props.getMyList(this.props.router.query.id)
            .then(response => {
                this.setState({ mylist_data: response.data.data }, () => {
                    const bookmarkIndex = this.state.mylist_data.program.findIndex(b => b.id == this.props.router.query.id);
                    if (bookmarkIndex !== -1) {
                        this.setState({ program_in_list: this.state.mylist_data.program[bookmarkIndex].is_bookmark == 1 });
                    }

                    this.setState({
                        bookmarked_episode: this.state.mylist_data.episode,
                        bookmarked_extra: this.state.mylist_data.extra,
                        bookmarked_clip: this.state.mylist_data.clip
                    });
                });
            })
            .catch(error => console.log(error));

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

                    this.props.getLikeHistory(this.props.router.query.id)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));

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

                    this.props.unsetPageLoader();
                    if (this.props.query.content_type) {
                        const selectedTabName = this.props.query.content_type.substring(0, this.props.query.content_type.length - 1);
                        const tabIndex = this.tabs.indexOf(selectedTabName);
                        if (tabIndex !== -1) {
                            this.toggleTab((tabIndex + 1).toString(), selectedTabName[0].toUpperCase() + selectedTabName.substring(1));
                        }
                    }
                    
                }
            })
            .catch(error => {
                console.log(error);
                this.props.unsetPageLoader();
            });
    
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

    goToPhotoList(id) {
        Router.push('/detail/' + this.props.router.query.id + '/photo/' + id);
    }

    addToMyList(id, type) {
        this.props.bookmark(id, type)
            .then(response => {
                switch (type) {
                    case 'program':
                        this.setState({ program_in_list: true });
                        break;
                    
                    case 'episode':
                        const bookmarkedEpisode = this.state.bookmarked_episode;
                        bookmarkedEpisode.push({ id: id, last_duration: 0, is_bookmark: 1 });
                        this.setState({ bookmarked_episode: bookmarkedEpisode });
                        break;

                    case 'extra':
                        const bookmarkedExtra = this.state.bookmarked_extra;
                        bookmarkedExtra.push({ id: id, last_duration: 0, is_bookmark: 1 });
                        this.setState({ bookmarked_extra: bookmarkedExtra });
                        break;

                    case 'clip':
                        const bookmarkedClip = this.state.bookmarked_clip;
                        bookmarkedClip.push({ id: id, last_duration: 0, is_bookmark: 1 });
                        this.setState({ bookmarked_clip: bookmarkedClip });
                        break;
                }
                
            })
            .catch(error => {
                console.log(error);
                if (error.status === 200) {
                    showAlert(error.data.status.message_client, '', 'Login', '', () => Router.push('/login'));
                }
            });
    }

    deleteFromMyList(id, type) {
        this.props.deleteBookmark(id, type)
            .then(response => {
                switch (type) {
                    case 'program':
                        this.setState({ program_in_list: false });
                        break;

                    case 'episode':
                        const bookmarkedEpisode = this.state.bookmarked_episode;
                        const indexEpisode = bookmarkedEpisode.findIndex(b => b.id == id);
                        if (indexEpisode !== -1) {
                            bookmarkedEpisode.splice(indexEpisode, 1);
                            this.setState({ bookmarked_episode: bookmarkedEpisode });
                        }
                        break;

                    case 'extra':
                        const bookmarkedExtra = this.state.bookmarked_extra;
                        const indexExtra = bookmarkedExtra.findIndex(b => b.id == id);
                        if (indexExtra !== -1) {
                            bookmarkedExtra.splice(indexExtra, 1);
                            this.setState({ bookmarked_extra: bookmarkedExtra });
                        }
                        break;

                    case 'clip':
                        const bookmarkedClip = this.state.bookmarked_clip;
                        const indexClip = bookmarkedClip.findIndex(b => b.id == id);
                        if (indexClip !== -1) {
                            bookmarkedClip.splice(indexClip, 1);
                            this.setState({ bookmarked_clip: bookmarkedClip });
                        }
                        break;
                }
                
            })
            .catch(error => console.log(error));
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

    link(cw, type) {
		Router.push(`/programs/${cw.program_id}/${this.props.initial.data.title.replace(/ +/g, '-').toLowerCase()}/${type}/${cw.id}/${cw.title.replace(/ +/g, '-').toLowerCase()}`);
	}

    render() {
        const { episode, extra, clip, photo } = this.state.response_data;
        const tabs = [];
        const tabsObj = {
            'Episode': episode,
            'Extra': extra,
            'Clip': clip,
            'Photo': photo
        };

        let idx = 1;
        for (let key in tabsObj) {
            if (tabsObj[key] > 0) {
                tabs.push(<NavItem key={key} className="menu-title">
                            <Link scroll={false} href={`/programs?id=${this.props.query.id}&title=${this.props.query.title}&content_type=${key.toLowerCase()}s`} as={`/programs/${this.props.query.id}/${this.props.query.title}/${key.toLowerCase()}s`}>
                                <NavLink onClick={this.toggleTab.bind(this, idx.toString(), key)} className={classnames({ active: this.state.active_tab === idx.toString() })}>{key}</NavLink>
                            </Link>
                        </NavItem>);
                idx++;
            }
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

        let title = `Nonton Streaming Program ${this.props.initial.data.title} Online - ${SITE_NAME}`;
        let metaDescription = `Nonton streaming online ${this.props.initial.data.title} ${this.props.initial.data.tv_name} full episode lengkap dengan cuplikan video menarik lainnya hanya di ${SITE_NAME}. Lihat selengkapnya disini`;
        
        if (this.props.query.content_type) {
            switch (this.props.query.content_type) {
                case 'episodes':
                    title = `Nonton ${this.props.initial.data.title} Online Full Episode - ${SITE_NAME}`;
                    metaDescription = `Kumpulan cuplikan video ${this.props.initial.data.title} ${this.props.initial.data.tv_name} online per episode lengkap hanya di ${SITE_NAME}`;
                    break;

                case 'extras':
                    if (this.props.initial.data.program_type_name === 'Entertainment' || this.props.initial.data.program_type_name === 'News') {
                        title = `Lihat Berita Terbaru Program ${this.props.initial.data.title} - ${SITE_NAME}`;
                    }
                    else {
                        title = `Nonton Video Extra Program ${this.props.initial.data.title} Lainnya - ${SITE_NAME}`;
                    }
                    metaDescription = `Nonton online kumpulan video extra lengkap program ${this.props.initial.data.title} - ${SITE_NAME}`;
                    break;

                case 'clips':
                    title = `Tonton Potongan Video Menarik dan Lucu ${this.props.initial.data.title} - ${SITE_NAME}`;
                    metaDescription = `Nonton kumpulan potongan video lucu dan menarik dari program ${this.props.initial.data.title}, ${this.props.initial.data.tv_name} - ${SITE_NAME}`;
                    break;

                case 'photos':
                    title = `Kumpulan Foto Lengkap Program ${this.props.initial.data.title} - ${SITE_NAME}`;
                    metaDescription = `Lihat kumpulan foto menarik para pemain dan artis ${this.props.initial.data.title}, ${this.props.initial.data.tv_name} - ${SITE_NAME}`;
                    break;
            }
        }

        // https://www.it-consultis.com/blog/best-seo-practices-for-react-websites
        return (
            <Layout title={title}>
                <Head>
                    <meta name="description" content={metaDescription}/>
                </Head>
                <Navbar />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)}/>
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
                <div className="content content-programs">
                    <div className="content-thumbnail">
                        <Img alt={this.state.title} className="content-thumbnail-image" src={[this.state.meta.image_path + this.state.resolution + this.state.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
                    </div>
                    <div className="watch-button-container">
                        <Button onClick={this.toggle.bind(this)} className="watch-button">
                            <PlayCircleFilledIcon /> Watch Trailer
                        </Button>
                    </div>
                    <h1 className="content-title-detail">{this.state.title}</h1>
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
                        <div className="action-button-container">
                            <div className="action-button">
                                {thumbs}
                                <p>Rate</p>
                            </div>
                            <div className="action-button">
                                {this.state.program_in_list ? (<PlaylistAddCheckIcon className="action-icon action-icon__playlist-check" onClick={this.deleteFromMyList.bind(this, this.props.router.query.id, 'program')} />) : (<PlaylistAddIcon className="action-icon" onClick={this.addToMyList.bind(this, this.props.router.query.id, 'program')} />)}
                                <p>My List</p>
                            </div>
                            <div className="action-button">
                                <ShareIcon onClick={this.toggleActionSheet.bind(this, this.state.title, BASE_URL + this.props.router.asPath, ['rcti'])} className="action-icon" />
                                <p>Share</p>
                            </div>
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
                            {this.props.contents.episodes.map(e => (
                                <div key={e.id}>
                                    <Row>
                                        <Col xs={6} onClick={() => this.link(e, 'episode')}>
                                            <Img alt={e.title} className="list-item-thumbnail" src={[this.state.meta.image_path + '140' + e.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
                                        </Col>
                                        <Col xs={6}>
                                            <p onClick={() => this.link(e, 'episode')} className="item-title">S{e.season}:E{e.episode} {e.title}</p>
                                            <div className="item-action-buttons">
                                                <div className="action-button">
                                                    {this.state.bookmarked_episode.findIndex(b => b.id == e.id) !== -1 ? (<PlaylistAddCheckIcon className="action-icon action-icon__playlist-check" onClick={this.deleteFromMyList.bind(this, e.id, 'episode')} />) : (<PlaylistAddIcon className="action-icon" onClick={this.addToMyList.bind(this, e.id, 'episode')} />)}
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
                                <div key={e.id}>
                                    <Row>
                                        <Col xs={6} onClick={() => this.link(e, 'extra')}>
                                            <Img alt={e.title} className="list-item-thumbnail" src={[this.state.meta.image_path + '140' + e.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
                                        </Col>
                                        <Col xs={6}>
                                            <p onClick={() => this.link(e, 'extra')} className="item-title">S{e.season}:E{e.episode} {e.title}</p>
                                            <div className="item-action-buttons">
                                                <div className="action-button">
                                                    {this.state.bookmarked_extra.findIndex(b => b.id == e.id) !== -1 ? (<PlaylistAddCheckIcon className="action-icon action-icon__playlist-check" onClick={this.deleteFromMyList.bind(this, e.id, 'extra')} />) : (<PlaylistAddIcon className="action-icon" onClick={this.addToMyList.bind(this, e.id, 'extra')} />)}
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
                                <div key={e.id}>
                                    <Row>
                                        <Col xs={6} onClick={() => this.link(e, 'clip')}>
                                            <Img alt={e.title} className="list-item-thumbnail" src={[this.state.meta.image_path + '140' + e.landscape_image, '/static/placeholders/placeholder_landscape.png']} />
                                        </Col>
                                        <Col xs={6}>
                                            <p onClick={() => this.link(e, 'clip')} className="item-title">S{e.season}:E{e.episode} {e.title}</p>
                                            <div className="item-action-buttons">
                                                <div className="action-button">
                                                    {this.state.bookmarked_clip.findIndex(b => b.id == e.id) !== -1 ? (<PlaylistAddCheckIcon className="action-icon action-icon__playlist-check" onClick={this.deleteFromMyList.bind(this, e.id, 'clip')} />) : (<PlaylistAddIcon className="action-icon" onClick={this.addToMyList.bind(this, e.id, 'clip')} />)}
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
                                    <Col xs={6} key={e.id} onClick={this.goToPhotoList.bind(this, e.id)}>
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
                        <BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
                            {scrollRef => (
                                <div ref={scrollRef} className="related-slider">
                                    {this.state.related_programs.map(rp => (
                                        <div onClick={() => Router.push(`/programs/${rp.id}/${rp.title.replace(/ +/g, '-').toLowerCase()}`)} key={rp.id} className="related-slide">
                                            <Img alt={rp.title} src={[this.state.meta.image_path + '140' + rp.portrait_image, '/static/placeholders/placeholder_potrait.png']} className="related-program-thumbnail" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </BottomScrollListener>
                        
                    </div>
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...searchActions,
    ...likeActions,
    ...bookmarkActions,
    ...pageActions
})(withRouter(Detail));
import React from 'react'
import { connect } from 'react-redux';
import Img from 'react-image';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';

import contentActions from '../redux/actions/contentActions';
import searchActions from '../redux/actions/searchActions';

//load default layout
import Layout from '../components/Layouts/Default';
import Navbar from '../components/Includes/Navbar/NavDetail';
import PlayerModal from '../components/Modals';
import ActionModal from '../components/Modals/ActionModal';
import ActionSheet from '../components/Modals/ActionSheet';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Button, Row, Col } from 'reactstrap';

import '../assets/scss/plugins/carousel/carousel.scss';
import '../assets/scss/components/detail.scss'

class Detail extends React.Component {

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
            related_programs: [],
            modal: false,
            rate_modal: false,
            action_sheet: false
        };

        this.player = null;
    }

    componentDidMount() {
        this.props.getProgramDetail(23)
            .then(response => {
                console.log(response);
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

                    this.props.getProgramEpisodes(23)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                this.setState({ episodes: response.data.data });
                            }
                        })
                        .catch(error => console.log(error));

                    this.props.getRelatedProgram(23)
                        .then(response => {
                            if (response.status === 200 && response.data.status.code === 0) {
                                this.setState({ related_programs: response.data.data });
                            }
                        })
                        .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error));

        this.setState({ action_sheet: true });
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

    render() {
        return (
            <Layout title="Program Detail">
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

                <ActionSheet
                    open={this.state.action_sheet}
                    toggle={() => {}}/>

                <div style={{ backgroundImage: 'url(' + (this.state.meta.image_path + this.state.resolution + this.state.portrait_image) + ')' }} className="bg-jumbotron"></div>
                <div className="content">
                    <div className="content-thumbnail">
                        <Img src={[this.state.meta.image_path + this.state.resolution + this.state.portrait_image, 'https://placehold.it/152x227']} />
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
                            <ShareIcon className="action-icon" />
                            <p>Share</p>
                        </div>
                    </div>
                </div>
                <div className="list-box">
                    <div className="list-menu">
                        <p className="menu-title">Episode</p>
                    </div>
                    <div className="list-content">
                        <p className="list-expand">
                            Season 1 <ExpandMoreIcon />
                        </p>
                        {this.state.episodes.map(e => (
                            <div key={e.id}>
                                <Row>
                                    <Col>
                                        <Img src={[this.state.meta.image_path + '140' + e.landscape_image, 'https://placehold.it/140x84']} />
                                    </Col>
                                    <Col>
                                        <p className="item-title">S{e.season}:E{e.episode} {e.title}</p>
                                        <div className="item-action-buttons">
                                            <div className="action-button">
                                                <ThumbUpIcon className="action-icon" />
                                            </div>
                                            <div className="action-button">
                                                <PlaylistAddIcon className="action-icon" />
                                            </div>
                                            <div className="action-button">
                                                <GetAppIcon className="action-icon" />
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
                    <div className="list-footer">
                        <Button size="sm" className="show-more-button">
                            <ExpandMoreIcon /> Show More
                        </Button>
                    </div>
                </div>

                <div className="related-box">
                    <div className="related-menu">
                        <p className="related-title"><strong>Related</strong></p>
                        <p className="related-subtitle">Show more &gt;</p>
                        <div className="related-slider">
                            <Carousel
                                showThumbs={false}
                                showIndicators={false}
                                stopOnHover={true}
                                showArrows={false}
                                showStatus={false}
                                swipeScrollTolerance={1}
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
})(Detail);
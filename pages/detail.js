import React from 'react'
import { connect } from 'react-redux';
import Img from 'react-image';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';

import contentActions from '../redux/actions/contentActions';

//load default layout
import Layout from '../components/Layouts/Default';
import Navbar from '../components/Includes/Navbar/NavDetail';

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
            genre: [],
            release_date: '',
            meta: {},
            resolution: 152
        };
    }

    componentDidMount() {
        this.props.getProgramDetail(23)
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
                        meta: response.data.meta
                    });
                }
            })
            .catch(error => console.log(error));

        this.props.getProgramEpisodes(23)
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <Layout title="Program Detail">
                <Navbar />
                <div style={{ backgroundImage: 'url(' + (this.state.meta.image_path + this.state.resolution + this.state.portrait_image) + ')' }} className="bg-jumbotron"></div>
                <div className="content">
                    <div className="content-thumbnail">
                        <Img src={[this.state.meta.image_path + this.state.resolution + this.state.portrait_image, 'http://placehold.it/152x227']} />
                    </div>
                    <div className="watch-button-container">
                        <Button className="watch-button">
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
                            <ThumbUpIcon className="action-icon" />
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
                        {[1, 2].map(x => (
                            <div key={x}>
                                <Row>
                                    <Col>
                                        <Img src={['http://placehold.it/140x84']} />
                                    </Col>
                                    <Col>
                                        <p className="item-title">S01:E01 Akum dan temen-temen pergi mencari idoy</p>
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
                                        <p className="item-description">Lorem ipsum dolar sit amet Lorem ipsum dolar sit Lorem ipsum dolar sit amet Lorem ipsum dolar sit Lorem ipsum dolar sit amet Lorem ipsum dolar sit.</p>
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
                                {[1, 2, 3, 4].map(x => (
                                    <Lazyload key={x} height={100}>
                                        <Img src={['/static/placeholders/placeholder_potrait.png']} />
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

export default connect(state => state, contentActions)(Detail);
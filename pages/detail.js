import React from 'react'
import { connect } from 'react-redux';
import Img from 'react-image';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';

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

import '../assets/scss/components/detail.scss'

class Detail extends React.Component {

    render() {
        return (
            <Layout title="Program Detail">
                <Navbar />
                <div style={{ backgroundImage: 'url(http://placehold.it/500)' }} className="bg-jumbotron"></div>
                <div className="content">
                    <div className="content-thumbnail">
                        <Img src={['http://placehold.it/152x227']} />
                    </div>
                    <div className="watch-button-container">
                        <Button className="watch-button">
                            <PlayCircleFilledIcon /> Watch Trailer
                        </Button>
                    </div>
                    <p className="content-title"><strong>Dunia Terbalik</strong></p>
                    <p className="content-genre">| 2017 | Drama - Komedi - Keluarga |</p>
                    <p className="content-description">Dunia Terbalik adalah program series komedi yang mengangkat cerita tentang para suami yang ditinggalkan istrinya untuk bekerja di luar negeri. Dimulai dari kisah Akum, Aceng, Idoy dan satu musuh bebuyutan Aceng, Dadang. Mereka harus mendidik anak serta mengurus urusan rumah tangga yang biasanya menjadi urusan para wanita. Sementara istrinya harus menafkahi keluarga.</p>
                    <p className="content-description">Artis: Artis 1, Artis 2, Artis 3, etc.</p>
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

export default connect(state => state, {})(Detail);
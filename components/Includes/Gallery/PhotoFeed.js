import React from 'react';
import { connect } from 'react-redux';
import Img from 'react-image';
import TimeAgo from 'react-timeago';
import { Row, Col } from 'reactstrap';
import { Carousel } from 'react-responsive-carousel';

import ShareIcon from '@material-ui/icons/Share';

class PhotoFeed extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.createdAt);
    }

    render() {
        return (
            <Row className="program-item row-edit">
                <Col className="col-edit">
                    <Row>
                        <Col xs="2">
                            <Img className="program-rounded-thumbnail" src={['/static/placeholders/placeholder_landscape.png']} />
                        </Col>
                        <Col xs="7">
                            <div className="program-label">
                                <div className="program-title">
                                    <strong>
                                        {this.props.title}
                                    </strong>
                                </div>
                                <TimeAgo className="program-subtitle" date={Date.now() - this.props.createdAt} />
                            </div>
                        </Col>
                        <Col className="program-share-button">
                            <ShareIcon className="program-label" />
                        </Col>
                    </Row>
                        <Carousel
                            autoPlay
                            showThumbs={false}
                            showIndicators={true}
                            stopOnHover={true}
                            showArrows={false}
                            showStatus={true}
                            swipeScrollTolerance={1}
                            swipeable={true}>
                                {this.props.images.map(im => (
                                    <Img key={im.id} className="program-carousel-image" src={[this.props.meta.image_path + this.props.resolution + im.image, '/static/placeholders/placeholder_potrait.png']} />
                                ))}
                                
                        </Carousel>

                    <span className="program-title program-title-bottom">{this.props.summary}</span>
                </Col>
            </Row>
        );
    }

}

export default connect(state => state, {})(PhotoFeed);
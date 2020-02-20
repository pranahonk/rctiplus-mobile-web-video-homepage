import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Img from 'react-image';
import TimeAgo from 'react-timeago';
import { Row, Col } from 'reactstrap';
import { Carousel } from 'react-responsive-carousel';
import queryString from 'query-string';

import ShareIcon from '@material-ui/icons/Share';

import ActionSheet from '../../Modals/ActionSheet';

import '../../../assets/scss/components/photo-detail.scss';

import { searchPhotoSlideNextEvent, searchPhotoSlidePreviousEvent } from '../../../utils/appier';

class PhotoFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: this.props.shareLink,
            action_sheet: false,
            hashtags: []
        };

        this.swipe = {};
        this.direction = null;

        const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        this.homepageTitle = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
            if (q.homepage_title) {
                this.homepageTitle = q.homepage_title;
            }
        }
    }

    toggleActionSheet(caption = '', url = '', hashtags = []) {
		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		});
	}

    render() {
        return (
            <Row className={'program-item row-edit ' + (this.props.keyIndex % 2 == 0 ? 'row-striped' : '')}>
                <ActionSheet
					caption={this.props.title}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, '', '', ['rcti'])} />

                <Col className="col-edit">
                    <Row className="row-edit">
                        <Col xs="2">
                            <Img alt={this.props.title} className="program-rounded-thumbnail" src={[this.props.meta.image_path + this.props.resolution + this.props.iconImage, '/static/placeholders/placeholder_landscape.png']} />
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
                            <ShareIcon className="program-label" onClick={this.toggleActionSheet.bind(this, this.props.title, this.state.url, ['rcti'])}/>
                        </Col>
                    </Row>
                        <Carousel
                            autoPlay
                            statusFormatter={(current, total) => `${current}/${total}`}
                            showThumbs={false}
                            showIndicators={this.props.images.length > 1}
                            stopOnHover={true}
                            showArrows={false}
                            showStatus={this.props.images.length > 1}
                            swipeScrollTolerance={1}
                            onSwipeStart={e => {
                                this.swipe = { x: 0 };
                                this.direction = null;
                            }}
                            onSwipeMove={e => {
                                if (e.touches.length) {
                                    const x = e.touches[0].clientX;
                                    if (this.swipe.x < x) {
                                        this.direction = 'prev';
                                    }
                                    else {
                                        this.direction = 'next';
                                    }
                                    this.swipe = { x: x };
                                }
                            }}
                            onSwipeEnd={e => {
                                if (this.direction && this.reference && this.reference === 'search') {
                                    switch (this.direction) {
                                        case 'next':
                                            searchPhotoSlideNextEvent(this.props.program.id, this.props.program.title, 'mweb_search_photo_slide_next');
                                            break;

                                        case 'prev':
                                            searchPhotoSlidePreviousEvent(this.props.program.id, this.props.program.title, 'mweb_search_photo_slide_previous');
                                            break;
                                    }
                                }
                                this.swipe = { x: 0 };
                            }}
                            swipeable={true}>
                                {this.props.images.map(im => (
                                    <Img
                                        key={im.id} 
                                        alt={this.props.title} 
                                        className="program-carousel-image" 
                                        unloader={<img className="program-carousel-image" src="/static/placeholders/placeholder_potrait.png"/>}
										loader={<img className="program-carousel-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                        src={[this.props.meta.image_path + this.props.resolution + im.image, '/static/placeholders/placeholder_potrait.png']} />
                                ))}
                                
                        </Carousel>

                    <div className="program-title program-title-bottom">{this.props.summary}</div>
                </Col>
            </Row>
        );
    }

}

export default connect(state => state, {})(withRouter(PhotoFeed));
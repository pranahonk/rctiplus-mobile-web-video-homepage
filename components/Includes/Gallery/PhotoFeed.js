import React from 'react';
import { connect } from 'react-redux';
import Img from 'react-image';
import TimeAgo from 'react-timeago';
import { Row, Col } from 'reactstrap';
import { Carousel } from 'react-responsive-carousel';

import ShareIcon from '@material-ui/icons/Share';

import ActionSheet from '../../Modals/ActionSheet';

import '../../../assets/scss/components/photo-detail.scss';

class PhotoFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: this.props.shareLink,
            action_sheet: false,
            hashtags: []
        };
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
                            showThumbs={false}
                            showIndicators={true}
                            stopOnHover={true}
                            showArrows={false}
                            showStatus={true}
                            swipeScrollTolerance={1}
                            swipeable={true}>
                                {this.props.images.map(im => (
                                    <Img alt={this.props.title} key={im.id} className="program-carousel-image" src={[this.props.meta.image_path + this.props.resolution + im.image, '/static/placeholders/placeholder_potrait.png']} />
                                ))}
                                
                        </Carousel>

                    <div className="program-title program-title-bottom">{this.props.summary}</div>
                </Col>
            </Row>
        );
    }

}

export default connect(state => state, {})(PhotoFeed);
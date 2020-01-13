import React, { Component } from 'react';
import Img from 'react-image';
import { connect } from 'react-redux';
import contentActions from '../../../redux/actions/contentActions';
import { Carousel } from 'react-responsive-carousel';
import '../../../assets/scss/plugins/carousel/carousel.scss';

class Crs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner: [],
            meta: null,
        };
    }

    componentDidMount() {
        this.props.getBanner().then(response => {
            const contents = this.props.contents;
            this.setState({
                banner: contents.banner,
                meta: contents.meta,
            });
        });
    }

    render() {
        return (
                <div>
                    <Carousel autoPlay showThumbs={false} showIndicators={false} stopOnHover={true} showArrows={false} showStatus={false} swipeScrollTolerance={1} swipeable={true} >
                        {this.state.banner.map(b => (
                            <div key={b.id}>
                                <Img alt={b.title} src={[this.state.meta.image_path + '593' + b.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
                                <p className="legend">{b.title}</p>
                            </div>
                            ))}
                    </Carousel>
                </div>
                );
    }
}
export default connect(state => state, contentActions)(Crs);

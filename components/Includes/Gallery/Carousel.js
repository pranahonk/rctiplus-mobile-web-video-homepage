import React, { Component } from 'react';
import Router from 'next/router';
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

    goToProgram(id, title, type) {
        switch (type) {
            case 'url':
                window.open(id, '_blank');
                break;
            default:
                const hyphenedTitle = title.replace(' ', '-');
                Router.push(`/programs/${id}/${hyphenedTitle}`);
                break;
        }
        
    }

    render() {
        return (
                <div style={{ position: 'relative' }}>
                    <Carousel statusFormatter={(current, total) => `${current}/${total}`} autoPlay showThumbs={false} showIndicators={false} stopOnHover={true} showArrows={false} showStatus={false} swipeScrollTolerance={1} swipeable={true} >
                        {this.state.banner.map(b => (
                            <div onClick={this.goToProgram.bind(this, b.type_value, b.title, b.type)} key={b.id}>
                                <Img alt={b.title} src={[this.state.meta.image_path + '593' + b.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
                                <p className="legend">{b.title}</p>
                            </div>
                            ))}
                    </Carousel>
                    {this.props.children}
                </div>
                );
    }
}
export default connect(state => state, contentActions)(Crs);

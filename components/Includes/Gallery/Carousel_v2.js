import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import contentActions from '../../../redux/actions/contentActions';
import { Carousel } from 'react-responsive-carousel';
import '../../../assets/scss/plugins/carousel/carousel.scss';

class Crs_v2 extends Component {
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

    goToProgram(program) {
        switch (program.type) {
            case 'url':
                window.open(program.type_value, '_blank');
                break;
            case 'program':
                const hyphenedTitle = program.title.replace(' ', '-');
                Router.push(`/programs/${program.type_value}/${hyphenedTitle}`);
                break;
        }
        
    }

    render() {
        return (
                <div style={{ position: 'relative' }}>
                    <Carousel statusFormatter={(current, total) => `${current}/${total}`} autoPlay showThumbs={false} showIndicators={false} stopOnHover={true} showArrows={false} showStatus={false} swipeScrollTolerance={1} swipeable={true}>
                        {this.state.banner.map(b => (
                            <div onClick={this.goToProgram.bind(this, b)} key={b.id} style={{ 
                                backgroundImage: `url(${this.state.meta.image_path + '593' + b.portrait_image})`, 
                                backgroundSize: 'cover',
                                backgroundPosition: 'center', 
                                width: '100%', 
                                height: 320 
                            }}>
                            </div>
                            ))}
                    </Carousel>
                    {this.props.children}
                    <div style={{ position: 'absolute', bottom: 0, backgroundImage: 'linear-gradient(180deg,rgba(40,40,40,0) 0,rgba(40,40,40,0) 70%,#282828)', width: '100%', height: 100 }}></div>
                </div>
                );
    }
}
export default connect(state => state, contentActions)(Crs_v2);

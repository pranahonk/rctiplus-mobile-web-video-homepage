import React from 'react';
import { connect } from 'react-redux';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import '../../../assets/scss/plugins/carousel/headline-carousel.scss';

class HeadlineCarousel extends React.Component {

    MAX_TITLE_LENGTH = 95;

    renderTitle(title) {
        if (title.length > this.MAX_TITLE_LENGTH) {
            return title.substring(0, this.MAX_TITLE_LENGTH) + '...';
        }
        return title;
    }

    render() {
        return (
            <Carousel
                className="headline-carousel"
                showArrows={false}
                showThumbs={false}
                showStatus={false}>
                <div>
                    <img className="thumbnail" src="/static/placeholders/placeholder_landscape.png"/>
                    <div className="caption">
                        <h3 className="title">{this.renderTitle('Cari Rumah Di LA, Pangeran Harry Dan Meghan Markel Dikritik Media Dan Meghan Markel Dikritik Media Cari Rumah Di LA, Pangeran Harry Dan Meghan Markel Dikritik Media Dan Meghan Markel Dikritik Media')}</h3>
                        <div className="description">
                            <p>inews.id&nbsp;&nbsp;</p>
                            <p>Senin, 2 Februari 2020 - 18.03</p>
                        </div>
                    </div>
                </div>
                <div>
                    <img className="thumbnail" src="/static/placeholders/placeholder_landscape.png"/>
                    <div className="caption">
                        <h3 className="title">{this.renderTitle('Cari')}</h3>
                        <div className="description">
                            <p>inews.id&nbsp;&nbsp;</p>
                            <p>Senin, 2 Februari 2020 - 18.03</p>
                        </div>
                    </div>
                </div>
                <div>
                    <img className="thumbnail" src="/static/placeholders/placeholder_landscape.png"/>
                    <div className="caption">
                        <h3 className="title">{this.renderTitle('Cari Rumah Di LA, Pangeran Harry Dan Meghan Markel Dikritik Media Amerika')}</h3>
                        <div className="description">
                            <p>inews.id&nbsp;&nbsp;</p>
                            <p>Senin, 2 Februari 2020 - 18.03</p>
                        </div>
                    </div>
                </div>
            </Carousel>
        );
    }

}

export default connect(state => state, {})(HeadlineCarousel);
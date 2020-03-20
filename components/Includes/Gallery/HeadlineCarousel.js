import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Img from 'react-image';

import { formatDateWordID } from '../../../utils/dateHelpers';
import { setAccessToken, removeAccessToken } from '../../../utils/cookie';
import { newsArticleClicked } from '../../../utils/appier';

import '../../../assets/scss/plugins/carousel/headline-carousel.scss';

import queryString from 'query-string';

class HeadlineCarousel extends React.Component {

    MAX_TITLE_LENGTH = 95;

    constructor(props) {
        super(props);
        this.accessToken = null;
        this.platform = null;
        const segments = this.props.router.asPath.split(/\?/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }

            if (q.platform) {
                this.platform = q.platform;
            }
        }
        else {
            removeAccessToken();
        }
    }

    renderTitle(title) {
        if (title.length > this.MAX_TITLE_LENGTH) {
            return title.substring(0, this.MAX_TITLE_LENGTH) + '...';
        }
        return title;
    }

    goToDetail(article) {
        newsArticleClicked(article.id, article.title, article.source, 'mweb_news_article_clicked');
        Router.push('/trending/detail/' + article.id + '/' + encodeURI(article.title.replace(/ +/g, "-").replace(/\\+/g, '-').replace(/\/+/g, '-').toLowerCase()) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}` : ''}`);
    }

    render() {
        return (
            <Carousel
                className="headline-carousel"
                autoPlay
                infiniteLoop
                interval={5000}
                showArrows={false}
                showThumbs={false}
                showStatus={false}>
                {this.props.articles.map((article, i) => (
                    <div onClick={() => this.goToDetail(article)} key={i}>
                        <div className="center-cropped">
                            <Img 
                                className="thumbnail"
                                alt={article.title}
                                src={[article.cover, '/static/placeholders/placeholder_landscape.png']}
                                loader={<img alt={article.title} className="thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}
                                unloader={<img alt={article.title} className="thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}/>
                            
                        </div>
                        <div className="caption">
                            <h3 className="title" dangerouslySetInnerHTML={{ __html: this.renderTitle(article.title) }}></h3>
                            <div className="description">
                                <p><strong>{article.source}</strong>&nbsp;&nbsp;</p>
                                <p>{formatDateWordID(new Date(article.pubDate * 1000))}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }

}

export default connect(state => state, {})(withRouter(HeadlineCarousel));
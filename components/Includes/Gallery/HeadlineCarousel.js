import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { imageNews } from '../../../utils/helpers';

import { formatDateWordID } from '../../../utils/dateHelpers';
import { setAccessToken, removeAccessToken } from '../../../utils/cookie';
import { newsArticleClicked } from '../../../utils/appier';

import '../../../assets/scss/plugins/carousel/headline-carousel.scss';
import { urlRegex } from '../../../utils/regex';

import queryString from 'query-string';

class HeadlineCarousel extends React.Component {

    MAX_TITLE_LENGTH = 95;

    constructor(props) {
        super(props);
        this.accessToken = null;
        this.platform = null;
        this.idfa=null;
        this.core_token = null;
        this.device_id = null;
        const segments = this.props.router.asPath.split(/\?/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }

            if(q.idfa){
              this.idfa= q.idfa;
            }

            if (q.platform) {
                this.platform = q.platform;
            }
            if(q.core_token){
                this.core_token = q.core_token;
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
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        newsArticleClicked(article.id, article.title, article.source, 'mweb_news_article_clicked');
        Router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${this.accessToken ? `?token=${this.accessToken}&platform=${this.platform}&core_token=${this.core_token ? this.core_token : process.env.CORE_TOKEN}&idfa=${this.idfa ? this.idfa : '00000000-0000-0000-0000-000000000000'}` : ''}`);
    }

    render() {
        return (
            <Carousel
                className={`headline-carousel ${this.props.className}`}
                autoPlay
                infiniteLoop
                interval={5000}
                showArrows={false}
                showThumbs={false}
                showStatus={false}>
                {this.props.articles.map((article, i) => (
                    <div onClick={() => this.goToDetail(article)} key={i}>
                        <div className="center-cropped">
                            {
                                imageNews(article.title, article.cover, article.image, 400, this.props.assets_url, 'thumbnail')
                            }
                        </div>
                        <div className="caption">
                            <h2 className="title" dangerouslySetInnerHTML={{ __html: this.renderTitle(article.title).replace(/\\/g, '') }}></h2>
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

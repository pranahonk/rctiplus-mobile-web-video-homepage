import React from 'react';
import fetch from 'isomorphic-unfetch';

import { DEV_API, NEWS_API } from '../../config';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';

//load style 
import '../../assets/scss/components/trending_search.scss';

class Detail extends React.Component {
    
    static async getInitialProps(ctx) {
        const programId = ctx.query.id;

        const response_visitor = await fetch(`${DEV_API}/api/v1/visitor?platform=mweb&device_id=69420`);
        if (response_visitor.statusCode === 200) {
            return {};
        }

        const data_visitor = await response_visitor.json();

        const response_news = await fetch(`${NEWS_API}/api/v1/token`, {
            method: 'POST',
            body: JSON.stringify({
                merchantName: 'rcti+',
                hostToken: data_visitor.data.access_token,
                platform: 'mweb'
            })
        });

        if (response_news.statusCode === 200) {
            return {};
        }

        const data_news = await response_news.json();

        const res = await fetch(`${NEWS_API}/api/v1/news?newsId=${programId}&infos=pubDate,id,title,cover,content,link,guid,source,author`, {
            method: 'GET',
            headers: {
                'Authorization': data_news.data.news_token
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (error_code || data.status.code === 1) {
            return { initial: false };
        }
        return { initial: data, props_id: programId, toke_: data_news.data.news_token };
    }

    constructor(props) {
        super(props);
        this.state = {
            trending_detail_id: this.props.props_id,
            trending_detail_data: this.props.initial
        };
        this.props.data;
        this.props.props_id;
        console.log(this.props);
    }
    
 
        
    render() {
        console.log(this.state);
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <NavBack />
                    <div className="content-trending-search">
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                        <p>text</p>
                    </div>
                </Layout>
                );
    }
}

export default Detail;

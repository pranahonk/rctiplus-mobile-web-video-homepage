import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

import { API, DEV_API, NEWS_TOKEN, NEWS_API } from '../../config';
import { getCookie, getNewsToken, getVisitorToken, checkToken } from '../../utils/cookie';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';

//load style 
import '../../assets/scss/components/trending_search.scss';

class Detail extends React.Component {
    
    static async getInitialProps(ctx) {
        const programId = ctx.query.id;
        const accessToken = getCookie('NEWS_TOKEN');
        console.log(accessToken);
        await checkToken();
        const res = await fetch(`${NEWS_API}/api/v1/news?newsId=${programId}&infos=pubDate,id,title,cover,content,link,guid,source,author`, {
            method: 'GET',
            headers: {
                'Authorization': getNewsToken()
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (error_code || data.status.code === 1) {
            return { initial: false };
        }
        return { initial: data, props_id: programId, toke_: getNewsToken() };
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

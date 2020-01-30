import React from 'react';
import fetch from 'isomorphic-unfetch';

import { DEV_API, NEWS_API } from '../../config';

//load default layout
import Layout from '../../components/Layouts/Default';


//load navbar default
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';

//load style 
import '../../assets/scss/components/trending_detail.scss';


import { Modal, ModalBody } from 'reactstrap';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, LineShareButton, WhatsappShareButton } from 'react-share';

import CloseIcon from '@material-ui/icons/Close';


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
            return {initial: false};
        }
        return {initial: data, props_id: programId};
    }

    constructor(props) {
        super(props);
        this.state = {
            trending_detail_id: this.props.props_id,
            trending_detail_data: this.props.initial
        };
        this.props.data;
        this.props.props_id;
    }
    
    create_date(timedata){
            var a = new Date(timedata * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
    }
    
    render() {
        const cdata = this.state.trending_detail_data.data[0];
       
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <NavBack />
                    <div className="content-trending-detail">
                        <p className="content-trending-detail-title"><b>{cdata.title}</b></p>
                        <p className="content-trending-detail-title-src-auth">{cdata.source} | {cdata.author}</p>
                        <small className="content-trending-detail-create">Publish Date : {this.create_date(cdata.pubDate)}</small>
                        <div className="sheet-action-button-container">
                            <div className="sheet-action-button">
                                <FacebookShareButton url="#">
                                    <i className="fab fa-facebook-f"></i>
                                </FacebookShareButton>
                            </div>
                            <div className="sheet-action-button">
                                <TwitterShareButton url="#">
                                    <i className="fab fa-twitter"></i>
                                </TwitterShareButton>
                            </div>
                            <div className="sheet-action-button">
                                <LineShareButton url="#">
                                    <i className="fab fa-line"></i>
                                </LineShareButton>
                            </div>
                            <div className="sheet-action-button">
                                <EmailShareButton url="#">
                                    <i className="far fa-envelope"></i>
                                </EmailShareButton>
                            </div>
                            <div className="sheet-action-button">
                                <WhatsappShareButton url="#">
                                    <i className="fab fa-whatsapp"></i>
                                </WhatsappShareButton>
                            </div>
                            <div className="sheet-action-button">
                                <i className="far fa-copy"></i>
                                <input type="hidden" id="url-copy" value={this.props.url}/>
                            </div>
                        </div>
                        <div className="content-trending-detail-wrapper">
                            <img src={cdata.cover} />
                            <div className="content-trending-detail-text" contentEditable='true' dangerouslySetInnerHTML={{__html: cdata.content}}></div>
                        </div>
                    </div>
                </Layout>
                );
    }
}

export default Detail;

import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import contentActions from '../../redux/actions/contentActions';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';
import PhotoFeed from '../../components/Includes/Gallery/PhotoFeed';

import '../../assets/scss/components/photo-detail.scss';
import '../../assets/scss/plugins/carousel/carousel.scss';

import { DEV_API, VISITOR_TOKEN, SITE_NAME } from '../../config';
import { getCookie } from '../../utils/cookie';

class PhotoList extends React.Component {

    static async getInitialProps(ctx) {
        const programId = ctx.query.id;
        const accessToken = getCookie('ACCESS_TOKEN');
        const res = await fetch(`${DEV_API}/api/v1/program/${programId}/detail`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? accessToken : VISITOR_TOKEN
            }
        });
        const error_code = res.statusCode > 200 ? res.statusCode : false;
        if (error_code) {
            return { initial: false };
        }

        const data = await res.json();
        if (data.status.code == 1) {
            return { initial: false };
        }

        return { initial: data, context_data: ctx.query };
    }

    constructor(props) {
        super(props);
        this.state = {
            program: this.props.initial ? this.props.initial.data : false,
            photos: [],
            meta: null,
            title: this.props.context_data.content_title.replace(/\w\S*/g, function(txt){
                txt = txt.replace(/-+/g, ' ');
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        };
    }

    componentDidMount() {
        if (this.state.program) {
            this.props.getProgramPhoto(this.props.initial.data.id)
                .then(response => {
                    console.log(response);
                    this.setState({ 
                        photos: response.data.data,
                        meta: response.data.meta 
                    }, () => console.log(this.state));
                })
                .catch(error => console.log(error));
        }
    }

    render() {
        return (
            <Layout title={`Foto ${this.state.title}`}>
                <Head>
                    <meta name="description" content={`Lihat foto ${this.state.title} - ${this.state.program.title} - ${SITE_NAME}`}/>
                </Head>
                <NavBack title={this.state.program.title}/>
                <div className="container-box-cpd wrapper-box">
                    {this.state.photos.map((p, i) => (
                        <PhotoFeed 
                            keyIndex={i}
                            key={p.id}
                            program={this.state.program}
                            resolution={593}
                            meta={this.state.meta}
                            title={p.title}
                            createdAt={p.release_date}
                            images={p.photos}
                            summary={p.summary}
                            shareLink={p.share_link}
                            iconImage={p.program_icon_image}/>
                    ))}
                    
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, contentActions)(withRouter(PhotoList));
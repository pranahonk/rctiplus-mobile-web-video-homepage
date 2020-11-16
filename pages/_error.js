import React from 'react';
import Router from 'next/router';
import Head from 'next/head';

import Layout from '../components/Layouts/Default_v2';

import { Button } from 'reactstrap';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export default class Error extends React.Component {

    render() {
        return (
            // <Layout title="Page Not Found">
            <>
                <Head>
                    <title>Page Not Found</title>
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#171717" />
                    <meta name="msapplication-TileColor" content="#171717" />
                    <meta name="msapplication-navbutton-color" content="#171717" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <link rel="icon" href="/static/logo/rcti-sm.png?v=1.0" />
                    <link rel="manifest" href="/static/manifest.json" />
                </Head>
                <div className="wrapper-content" style={{ margin: 0 }}>
                    <div style={{ 
                        textAlign: 'center',
                        position: 'fixed', 
                        top: '50%', 
                        left: '50%',
                        transform: 'translate(-50%, -50%)' 
                        }}>
                        <SentimentVeryDissatisfiedIcon style={{ fontSize: '4rem' }}/>
						<h5>
							<strong id="error__page">Sorry, we can not find what you are looking for.</strong><br/><br/>
							<Button onClick={() => Router.back()} className="btn-next block-btn">Go Back</Button>
						</h5>
					</div>
                </div>
            </>
            // </Layout>
        );
    }

}
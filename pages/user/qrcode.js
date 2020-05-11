import React from 'react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { showAlert } from '../../utils/helpers';
import { getCookie } from '../../utils/cookie';
import { accountScanQrCode } from '../../utils/appier';

import othersActions from '../../redux/actions/othersActions';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/qrcode.scss';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';

class Qrcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: '',
            qr_reader: 'QR Code Scanner',
            scan: false
        }
    }

    componentDidMount() {
        const token = getCookie('ACCESS_TOKEN');
		if (token == undefined) {
			Router.push('/login');
		}
        const QrReader = require('react-qr-reader');
        this.setState({ qr_reader: (
            <QrReader
                delay={1000}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '100%' }}/>
        ) });
    }

    handleScan = data => {
        if (data && !this.state.scan) {
            this.setState({ result: data, scan: true }, () => {
                
                this.props.scanQRCode(this.state.result)
                    .then(response => {
                        console.log(response);
                        if (response.status === 200 && response.data.status.code === 0) {
                            if (this.state.scan) {
                                window.open(response.data.data, '_blank');
                                this.setState({ scan: false }, () => accountScanQrCode('success','mweb_account_scan_qrcode'));
                            }

                        }
                        else {
                            this.setState({ scan: false }, () => accountScanQrCode('failed', 'mweb_account_scan_qrcode'));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.status === 200) {
                            showAlert(error.data.status.message_client, 'Failed', 'OK', '', () => this.setState({ scan: false }));
                        }
                        else {
                            this.setState({ scan: false });
                        }
                        accountScanQrCode('failed', 'mweb_account_scan_qrcode');
                    });
            });
        }
    }
    handleError = err => {
        showAlert(err, 'Error', 'OK');
    }

    render() {
        return (
            <Layout title={SITEMAP.qr_code.title}>
                <Head>
                    <meta name="description" content={SITEMAP.qr_code.description}/>
					<meta name="keywords" content={SITEMAP.qr_code.keywords}/>
					<meta property="og:title" content={SITEMAP.qr_code.title} />
					<meta property="og:description" content={SITEMAP.qr_code.description} />
					<meta property="og:image" itemProp="image" content={SITEMAP.qr_code.image} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={SITEMAP.qr_code.image} />
					<meta name="twitter:image:alt" content={SITEMAP.qr_code.title} />
					<meta name="twitter:title" content={SITEMAP.qr_code.title} />
					<meta name="twitter:description" content={SITEMAP.qr_code.description} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
                </Head>
                <NavBack title="Scan QR Code" />
                <div className="wrapper-content container-box-qr">
                    {this.state.qr_reader}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, othersActions)(withRouter(Qrcode));
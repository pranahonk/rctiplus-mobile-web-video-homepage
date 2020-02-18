import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

import { showAlert } from '../../utils/helpers';
import { getCookie } from '../../utils/cookie';
import { accountGeneralEvent } from '../../utils/appier';

import othersActions from '../../redux/actions/othersActions';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/qrcode.scss';

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
                accountGeneralEvent('mweb_account_scan_qrcode');
                this.props.scanQRCode(this.state.result)
                    .then(response => {
                        console.log(response);
                        if (response.status === 200 && response.data.status.code === 0) {
                            if (this.state.scan) {
                                window.open(response.data.data, '_blank');
                                this.setState({ scan: false });
                            }
                            
                        }
                        else {
                            this.setState({ scan: false });
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
                    });
            });
        }
    }
    handleError = err => {
        showAlert(err, 'Error', 'OK');
    }

    render() {
        return (
            <Layout title="RCTI+ - Scan QR Code">
                <NavBack title="Scan QR Code" />
                <div className="wrapper-content container-box-qr">
                    {this.state.qr_reader}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, othersActions)(Qrcode);
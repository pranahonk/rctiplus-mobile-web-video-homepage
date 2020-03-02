import React from 'react';
import Router from 'next/router';

import Layout from '../components/Layouts/Default';

import { Button } from 'reactstrap';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export default class Error extends React.Component {

    render() {
        return (
            <Layout title="Page Not Found">
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
							<strong>Sorry, we can not find what you are looking for.</strong><br/><br/>
							<Button onClick={() => Router.back()} className="btn-next block-btn">Go Back</Button>
						</h5>
					</div>
                </div>
            </Layout>
        );
    }

}
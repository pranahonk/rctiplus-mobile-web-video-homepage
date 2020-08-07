import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Img from 'react-image';

import { homeGeneralClicked } from '../../../utils/appier';

import '../../../assets/scss/components/grid-menu.scss';

import { Row, Col } from 'reactstrap';

class GridMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="menu-container">
                <Row className="grid-menu-container">
                    <Col className="menu-item">
                        <div id="action-exclusive" onClick={() => {
                            homeGeneralClicked('mweb_exclusive_clicked');
                            Router.push('/exclusive');
                        }}>
                            <a>
                                <img className="menu-icon" src={'/exclusive.svg'}/>
                                <p className="menu-label">Exclusive</p>
                            </a>
                        </div>
                    </Col>
                    <Col className="menu-item">
                        <Link href="/trending">
                            <a id="action-news" >
                                <div onClick={() => {
                                    homeGeneralClicked('mweb_news_clicked');
                                    // Router.push('/trending');
                                }}>
                                    <img className="menu-icon" src={'/news.svg'}/>
                                    <p className="menu-label">News</p>
                                </div>
                            </a>
                        </Link>
                    </Col>
                    <Col className="menu-item">
                        <div id="action-radio" onClick={() => {
                            homeGeneralClicked('mweb_radio_clicked');
                            {/* setTimeout(() => Router.push('https://radio.rctiplus.com/'), 500); */}
                            window.location.assign('https://radio.rctiplus.com/');
                        }}>
                            <a>
                                <Img className="menu-icon" src={['/radio.png']}/>
                                <p className="menu-label">Radio+</p>
                            </a>
                        </div>
                    </Col>
                    {/* <Col className="menu-item">
                        <Img className="menu-icon" src={['/trivia_quiz.svg']}/>
                        <p className="menu-label">TriviaQuiz</p>
                    </Col>
                    <Col className="menu-item">
                        <Img className="menu-icon" src={['/more.svg']}/>
                        <p className="menu-label">More</p>
                    </Col> */}
                </Row>
            </div>
            
        );
    }

}

export default connect(state => state, {})(GridMenu);
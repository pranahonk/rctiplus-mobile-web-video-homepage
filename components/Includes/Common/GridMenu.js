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
                <div className="grid-menu-container">
                    <div className="menu-item">
                        <div id="action-exclusive" onClick={() => {
                            homeGeneralClicked('mweb_exclusive_clicked');
                            Router.push('/exclusive');
                        }}>
                            <a>
                                <img alt="Exclusive" className="menu-icon" src={'/icons-menu/exclusive.svg'}/>
                                <p className="menu-label">Exclusive</p>
                            </a>
                        </div>
                    </div>
                    <div className="menu-item">
                        <Link href="/explores/1/Drama">
                            <a id="action-drama" >
                                <div onClick={() => {
                                    homeGeneralClicked('mweb_drama_clicked');
                                }}>
                                    <img alt="Drama" className="menu-icon" src={'/icons-menu/drama.svg'} style={{ width: 35 }}/>
                                    <p className="menu-label">Drama</p>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="menu-item">
                        <Link href="/explores/6/Comedy">
                            <a id="action-comedy" >
                                <div onClick={() => {
                                    homeGeneralClicked('mweb_comedy_clicked');
                                }}>
                                    <img alt="Comedy" className="menu-icon" src={'/icons-menu/comedy.svg'}/>
                                    <p className="menu-label">Comedy</p>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="menu-item">
                        <div id="action-radio" onClick={() => {
                            homeGeneralClicked('mweb_comedy_clicked');
                            // window.location.assign('https://radio.rctiplus.com/');
                        }}>
                            <a>
                                <img alt="menu - icon" className="menu-icon" src={'/icons-menu/comedy.svg'}/>
                                <p className="menu-label">Comedy</p>
                            </a>
                        </div>
                    </div>
                    <div className="menu-item">
                        <div id="action-radio" onClick={() => {
                            homeGeneralClicked('mweb_comedy_clicked');
                            // window.location.assign('https://radio.rctiplus.com/');
                        }}>
                            <a>
                                <img alt="menu - icon" className="menu-icon" src={'/icons-menu/comedy.svg'}/>
                                <p className="menu-label">Comedy</p>
                            </a>
                        </div>
                    </div>
                    <div className="menu-item">
                        <div id="action-radio" onClick={() => {
                            homeGeneralClicked('mweb_comedy_clicked');
                            // window.location.assign('https://radio.rctiplus.com/');
                        }}>
                            <a>
                                <img alt="menu - icon" className="menu-icon" src={'/icons-menu/comedy.svg'}/>
                                <p className="menu-label">Comedy</p>
                            </a>
                        </div>
                    </div>
                    
                    {/* <Col className="menu-item">
                        <img alt="menu - icon" className="menu-icon" src={['/trivia_quiz.svg']}/>
                        <p className="menu-label">TriviaQuiz</p>
                    </Col>
                    <Col className="menu-item">
                        <img alt="menu - icon" className="menu-icon" src={['/more.svg']}/>
                        <p className="menu-label">More</p>
                    </Col> */}
                </div>
            </div>
            
        );
    }

}

export default connect(state => state, {})(GridMenu);
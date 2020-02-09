import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import Img from 'react-image';

//load home page scss
import '../../../assets/scss/components/grid-menu.scss';

import { Row, Col } from 'reactstrap';

class GridMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {
    }

    render() {
        return (
            <div className="menu-container">
                <Row className="grid-menu-container">
                    <Col className="menu-item">
                        <Link href="/exclusive">
                            <a>
                                <Img className="menu-icon" src={['/static/icons/exclusive.svg']}/>
                                <p className="menu-label">Exclusive</p>
                            </a>
                        </Link>
                    </Col>
                    <Col className="menu-item">
                        <Link href="/trending">
                            <a>
                                <Img className="menu-icon" src={['/static/icons/news.svg']}/>
                                <p className="menu-label">News</p>
                            </a>
                        </Link>
                        
                    </Col>
                    <Col className="menu-item">
                        <Link href="/radio">
                            <a>
                                <Img className="menu-icon" src={['/static/icons/radio.png']}/>
                                <p className="menu-label">Radio</p>
                            </a>
                        </Link>
                    </Col>
                    {/* <Col className="menu-item">
                        <Img className="menu-icon" src={['/static/icons/trivia_quiz.svg']}/>
                        <p className="menu-label">TriviaQuiz</p>
                    </Col>
                    <Col className="menu-item">
                        <Img className="menu-icon" src={['/static/icons/more.svg']}/>
                        <p className="menu-label">More</p>
                    </Col> */}
                </Row>
            </div>
            
        );
    }

}

export default connect(state => state, {})(GridMenu);
import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import Img from 'react-image';

import { Row, Col } from 'reactstrap';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import '../../../assets/scss/components/list-item.scss';

class ListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row onClick={() => Router.back()} className={'list-item ' + (this.props.striped ? 'list-item-striped-bg' : '')}>
                <Col xs={6}>
                    <Img className="item-image" src={[this.props.imageSrc, 'http://placehold.it/140x84']}/>
                </Col>
                <Col xs={4}>
                    <p>
                        <strong>{this.props.title}</strong><br/>
                        {this.props.subtitle}
                    </p>
                </Col>
                <Col xs={2}>
                    <ChevronRightIcon/>
                </Col>
            </Row>
        );
    } 

}

export default connect(state => state, {})(ListItem);
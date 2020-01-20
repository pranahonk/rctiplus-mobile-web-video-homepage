import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

//load subcategory
import TrendingsubCategoryActions from '../../../redux/actions/trending/subCategory';
import TrendingActions from '../../../redux/actions/trending/content';

//load reactstrap
import {
TabContent,
        TabPane,
        Nav,
        NavItem,
        NavLink,
} from 'reactstrap';

class Default extends Component {
    static async getInitialProps(ctx) {
        initialize(ctx);
    }
    constructor(props) {
        super(props);
        this.state = {
            id: [],
            name: null,
            contents: { data: [] }
        };
    }

    componentDidMount() {
        this.props.getSubCategory(this.state.page)
                .then(response => {
                    this.setState({contents: this.props.trending_subcategory});
                })
                .catch(error => {
                    console.log(error);
                });
    }
    
    mm(ll) {
        console.log(ll);
    }

    render() {
//        console.log('hhhhh', this.state.contents);
//        return(<div>wow</div>);
        const displayItem = [];
        this.state.contents.data.forEach((dt, id) => {
            displayItem['push'](
                <NavItem className="exclusive-item" key={dt.id}>
                    <NavLink id={dt.id} onClick="{this.mm.bind(this, dt.id)}">
                        {dt.name}
                    </NavLink>
                </NavItem>
            );
        });    
        
        
        return (
                <div className="nav-exclusive-wrapper">
                    <Nav tabs id="trending" className="trendingSC">
                        { displayItem }
                    </Nav>
                    <TabContent activeTab="1">
                        <TabPane tabId="1">
                            <div className="content-tab-exclusive">tab all</div>
                        </TabPane>
                        <TabPane tabId="2">
                            <div className="content-tab-exclusive">tab Clip</div>
                        </TabPane>
                        <TabPane tabId="3">
                            <div className="content-tab-exclusive">tab Photo</div>
                        </TabPane>
                        <TabPane tabId="4">
                            <div className="content-tab-exclusive">tab Entertainment</div>
                        </TabPane>
                        <TabPane tabId="5">
                            <div className="content-tab-exclusive">tab News</div>
                        </TabPane>
                        <TabPane tabId="6">
                            <div className="content-tab-exclusive">tab Bloopers</div>
                        </TabPane>
                    </TabContent>
                </div>
                );
    }
}
export default connect(state => state, {...TrendingsubCategoryActions, ...TrendingActions})(Default);

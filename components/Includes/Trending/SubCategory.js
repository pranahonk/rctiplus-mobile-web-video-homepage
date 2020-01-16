import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

//load subcategory
import subCategoryActions from '../../../redux/actions/trending/subCategory';

//load reactstrap
import {
TabContent,
        TabPane,
        Nav,
        NavItem,
        NavLink,
        } from 'reactstrap';

class SubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner: [],
            meta: null,
        };
    }

    componentDidMount() {
        console.log(this.props.getSubCategory());
        this.props.getSubCategory().then(response => {
            const contents = this.props.contents;
            console.log(contents);
            this.setState({
                content_data: contents.banner,
                meta: contents.meta,
            });
        });
    }
    render() {
        return (
                <div className="nav-exclusive-wrapper">
                    <Nav tabs id="trending">
                        <NavItem className="exclusive-item">
                            <NavLink active id="1">
                                All 
                            </NavLink>
                        </NavItem>
                        <NavItem className="exclusive-item">
                            <NavLink id="2">Clip</NavLink>
                        </NavItem>
                        <NavItem className="exclusive-item">
                            <NavLink id="3">Photo</NavLink>
                        </NavItem>
                        <NavItem className="exclusive-item">
                            <NavLink id="4">Entertainment</NavLink>
                        </NavItem>
                        <NavItem className="exclusive-item">
                            <NavLink id="5">News</NavLink>
                        </NavItem>
                        <NavItem className="exclusive-item">
                            <NavLink id="6">Bloopers</NavLink>
                        </NavItem>
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
export default connect(state => state, subCategoryActions)(SubCategory);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import '../../../assets/scss/components/navbar-search.scss';

//load reactstrap
import { Navbar, NavbarBrand, Input } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


class NavbarSearch extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
                <div className="nav-home-container nav-fixed-top">
                    <Navbar expand="md" className={'nav-container nav-shadow nav-search'}>
                        <div className="left-top-link">
                            <div className="logo-top-wrapper">
                                <NavbarBrand onClick={() => Router.back()} style={{color: 'white'}}>
                                    <ArrowBackIcon/>
                                </NavbarBrand>
                            </div>
                        </div>
                        <div className="middle-top">
                            <Input 
                                placeholder="Search for a program, genre, etc."
                                className="search-input"/>
                        </div>
                        <div className="right-top-link">
                            <div className="btn-link-top-nav">
                                <NavbarBrand style={{color: 'white'}} href="/explore">
                                    <SearchIcon style={{fontSize: 20}}/>
                                </NavbarBrand>
                            </div>
                        </div>
                    </Navbar>
                    <StatusNotification />
                </div>
                );
    }
}
export default connect(state => state, {})(NavbarSearch);

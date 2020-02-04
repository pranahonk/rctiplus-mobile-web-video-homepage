import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import searchActions from '../../../redux/actions/searchActions';
import pageActions from '../../../redux/actions/pageActions';

import '../../../assets/scss/components/navbar-search.scss';

import { Navbar, NavbarBrand, Input } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


class NavbarSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
            length: 9
        };

        this.subject = new Subject();
    }

    componentDidMount() {
        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.props.searchAllCategory(this.state.q, 1, this.state.length)
                    .then(responses => {
                        console.log(responses);
                        this.props.unsetPageLoader();
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.unsetPageLoader();
                    });
            });
    }

    onChangeQuery(e) {
        this.setState({ q: e.target.value }, () => {
            this.props.setPageLoader();
            this.subject.next();
        });
    }

    bottomScrollFetch() {
        if (this.state.q && this.props.searches.search_show_more_allowed[this.props.searches.active_tab]) {
            this.LoadingBar.continuousStart();
            this.props.searchCategory(this.state.q, this.props.searches.active_tab, this.props.searches.search_page[this.props.searches.active_tab], this.state.length)
                .then(response => {
                    this.LoadingBar.complete();
                })
                .catch(error => {
                    console.log(error);
                    this.LoadingBar.complete();
                });
        }
    }

    render() {
        return (
            <div className="nav-home-container nav-fixed-top">
                <BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <Navbar expand="md" className={'nav-container nav-shadow nav-search'}>
                    <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
                    <div className="left-top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand onClick={() => Router.back()} style={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="middle-top">
                        <Input
                            placeholder="Search for a program, genre, etc."
                            onChange={this.onChangeQuery.bind(this)}
                            value={this.state.q}
                            className="search-input" />
                    </div>
                    <div className="right-top-link">
                        <div className="btn-link-top-nav">
                            <NavbarBrand style={{ color: 'white' }} href="/explore">
                                <SearchIcon style={{ fontSize: 20 }} />
                            </NavbarBrand>
                        </div>
                    </div>
                </Navbar>
                <StatusNotification />
            </div>
        );
    }
}
export default connect(state => state, {
    ...searchActions,
    ...pageActions
})(NavbarSearch);

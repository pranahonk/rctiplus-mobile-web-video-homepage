import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';

import { Navbar, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StatusNotification from './StatusNotification';

import { accountGeneralEvent } from '../../../utils/appier';

class NavbarDef extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            visibility: !this.props.visible ? 'hidden' : 'visible',
            dropdown_open: false,
            dropdown_menu: this.props.dropdownMenu ? this.props.dropdownMenu : []
        };
    }

    toggle() {
        this.setState({ dropdown_open: !this.state.dropdown_open });
    }
    
    render() {
        return (
            <div className="nav-fixed-top">
                <Navbar expand="md" className="nav-container nav-shadow" style={this.props.navPlayer ? { boxShadow: 'none' , background: 0} : {}}>
                    <div className="top-link">
                        <div className="logo-top-wrapper">
                            <NavbarBrand onClick={() =>{ 
                                switch (this.props.router.asPath) {
                                    case '/history':
                                        accountGeneralEvent('mweb_account_history_back_clicked');
                                        break;

                                    case '/mylist':
                                        accountGeneralEvent('mweb_account_mylist_back_clicked');
                                        break;

                                    case '/continue-watching':
                                        accountGeneralEvent('mweb_account_continue_watching_back_clicked');
                                        break;

                                    case '/terms-&-conditions':
                                        accountGeneralEvent('mweb_account_tnc_back_clicked');
                                        break;

                                    case '/privacy-policy':
                                        accountGeneralEvent('mweb_account_privacy_policy_back_clicked');
                                        break;

                                    case '/contact-us':
                                        accountGeneralEvent('mweb_account_contact_us_back_clicked');
                                        break;

                                    case '/edit-profile':
                                        accountGeneralEvent('mweb_account_edit_profile_back_clicked');
                                        break;
                                }
                                Router.back();
                            }} style={{color: 'white'}}>
                                <ArrowBackIcon/>
                            </NavbarBrand>
                        </div>
                    </div>
                    <div className="header-nav-verif">
                        <p>{this.props.title}</p>
                    </div>
                    <div style={{ visibility: this.state.visibility }} className="right-menu">
                        <Dropdown isOpen={this.state.dropdown_open} toggle={this.toggle.bind(this)}>
                            <DropdownToggle>
                                <MoreVertIcon/>
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.dropdown_menu.map((d, i) => <DropdownItem key={i} onClick={d.callback}>{d.label}</DropdownItem>)}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </Navbar>
                {this.props.navPlayer ? (<div/>) : (<StatusNotification/>)}
            </div>
        );
    }
}
export default withRouter(NavbarDef);

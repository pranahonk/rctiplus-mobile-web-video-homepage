import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

import ListItemLoader from '../../components/Includes/Shimmer/ListItemLoader';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button } from 'reactstrap';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import '../../assets/scss/components/channels.scss';

class Channels extends React.Component {

    state = {
        active_tab: 'Tambah Kanal'
    };

    toggleTab(tab) {
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab });
        }
    }

    render() {
        return (
            <Layout title={`Manage Channels`}>
                <NavBack/>
                <div className="channels-content">
                    <Nav tabs className="navigation-tabs">
                        <NavItem 
                            className={classnames({
                                active: this.state.active_tab === 'Tambah Kanal',
                                'navigation-tabs-item': true
                            })}
                            onClick={() => this.toggleTab('Tambah Kanal')}>
                                <NavLink className="item-link">Tambah Kanal</NavLink>
                        </NavItem>
                        <NavItem 
                            className={classnames({
                                active: this.state.active_tab === 'Edit Kanal',
                                'navigation-tabs-item': true
                            })}
                            onClick={() => this.toggleTab('Edit Kanal')}>
                                <NavLink className="item-link">Edit Kanal</NavLink>
                        </NavItem>
                    </Nav>
                    <div>
                        <ListItemLoader/>
                        <ListItemLoader/>
                        <ListItemLoader/>
                        <ListItemLoader/>
                        <ListItemLoader/>
                        <ListItemLoader/>
                    </div>
                    {/* <TabContent activeTab={this.state.active_tab}>
                        <TabPane tabId={`Tambah Kanal`}>
                            <ListGroup className="add-channel-list">
                                <ListGroupItem>
                                    <div className="text-container">
                                        <ListGroupItemHeading>Ekonomi</ListGroupItemHeading>
                                        <ListGroupItemText>Lorem ipsum dolor sit amet</ListGroupItemText>
                                    </div>
                                    <div className="button-container">
                                        <Button className="add-button">Tambah</Button>
                                    </div>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <div className="text-container">
                                        <ListGroupItemHeading>Olahraga</ListGroupItemHeading>
                                        <ListGroupItemText>Lorem ipsum dolor sit amet</ListGroupItemText>
                                    </div>
                                    <div className="button-container">
                                        <Button className="add-button">Tambah</Button>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </TabPane>
                        <TabPane tabId={`Edit Kanal`}>
                            <ListGroup className="edit-channel-list">
                                <ListGroupItem>
                                    <ListGroupItemHeading>Ekonomi</ListGroupItemHeading>
                                    <div className="remove-container">
                                        <RemoveCircleIcon className="remove-button"/>
                                    </div>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <ListGroupItemHeading>Olahraga</ListGroupItemHeading>
                                    <div className="remove-container">
                                        <RemoveCircleIcon className="remove-button"/>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </TabPane>
                    </TabContent> */}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {})(Channels);
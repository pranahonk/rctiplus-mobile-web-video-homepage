import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';

import ListItemLoader from '../../components/Includes/Shimmer/ListItemLoader';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button } from 'reactstrap';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import '../../assets/scss/components/channels.scss';

import newsv2Actions from '../../redux/actions/newsv2Actions';
import pageActions from '../../redux/actions/pageActions';
import { newsTabChannelClicked, newsAddCategoryChannelClicked, newsRemoveCategoryChannelClicked } from '../../utils/appier';

class Channels extends React.Component {

    state = {
        active_tab: 'Tambah Kanal',
        is_category_loading: true,
        categories: [],
        channels: [],
        selected_channel_ids: []
    };

    componentDidMount() {
        this.props.getChannels()
            .then(response => {
                this.setState({
                    is_category_loading: false,
                    channels: response.data.data
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ is_category_loading: false });
            });

        this.props.getCategory()
            .then(response => {
                let selectedChannelIds = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].label != 'priority') {
                        selectedChannelIds.push(response.data.data[i].id);
                    }
                }

                this.setState({
                    is_category_loading: false,
                    categories: response.data.data,
                    selected_channel_ids: selectedChannelIds
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({ is_category_loading: false });
            });
    }

    toggleTab(tab) {
        newsTabChannelClicked(tab, 'mweb_news_tab_kanal_clicked');
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab });
        }
    }

    addChannel(category, index) {
        this.props.setPageLoader();
        newsAddCategoryChannelClicked(category.name, 'mweb_news_add_category_kanal_clicked');
        let selectedChannelIds = this.state.selected_channel_ids;
        const addedIndex = selectedChannelIds.indexOf(category.id);
        if (addedIndex == -1) {
            selectedChannelIds.push(category.id);
            this.props.setCategory(selectedChannelIds)
                .then(response => {
                    console.log(response);
                    this.setState({ selected_channel_ids: selectedChannelIds }, () => {
                        let channels = this.state.channels;
                        channels.splice(index, 1);

                        let categories = this.state.categories;
                        categories.push(category);

                        this.setState({ channels: channels, categories: categories });
                        this.props.unsetPageLoader();
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.props.unsetPageLoader();
                });
        }
        else {
            this.props.unsetPageLoader();
        }
    }

    removeChannel(category, index) {
        this.props.setPageLoader();
        newsRemoveCategoryChannelClicked(category.name, 'mweb_news_remove_category_kanal_clicked');
        let selectedChannelIds = this.state.selected_channel_ids;
        const removedIndex = selectedChannelIds.indexOf(category.id);
        if (removedIndex != -1) {
            selectedChannelIds.splice(removedIndex, 1);
            this.props.setCategory(selectedChannelIds)
                .then(response => {
                    console.log(response);
                    this.setState({ selected_channel_ids: selectedChannelIds }, () => {
                        let channels = this.state.channels;
                        channels.push(category);

                        let categories = this.state.categories;
                        categories.splice(index, 1);
                        
                        this.setState({ channels: channels, categories: categories });
                        this.props.unsetPageLoader();
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.props.unsetPageLoader();
                });
        }
        else {
            this.props.unsetPageLoader();
        }
    }

    render() {
        return (
            <Layout title={`Manage Channels`}>
                <NavBack />
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
                    {this.state.is_category_loading ? (
                        <div>
                            <ListItemLoader />
                            <ListItemLoader />
                            <ListItemLoader />
                            <ListItemLoader />
                            <ListItemLoader />
                            <ListItemLoader />
                        </div>
                    ) : (
                        <TabContent activeTab={this.state.active_tab}>
                            <TabPane tabId={`Tambah Kanal`}>
                                <ListGroup className="add-channel-list">
                                    {this.state.channels.map((channel, i) => (
                                        <ListGroupItem key={i}>
                                            <div className="text-container">
                                                <ListGroupItemHeading>{channel.name}</ListGroupItemHeading>
                                                <ListGroupItemText></ListGroupItemText>
                                            </div>
                                            <div className="button-container">
                                                <Button onClick={() => this.addChannel(channel, i)} className="add-button">Tambah</Button>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                    
                                </ListGroup>
                            </TabPane>
                            <TabPane tabId={`Edit Kanal`}>
                                <ListGroup className="edit-channel-list">
                                    {this.state.categories.map((category, i) => (
                                        <ListGroupItem key={i}>
                                            <ListGroupItemHeading>{category.name}</ListGroupItemHeading>
                                            <div className="remove-container">
                                                {category.label == 'priority' ? null : (
                                                    <RemoveCircleIcon onClick={() => this.removeChannel(category, i)} className="remove-button" />
                                                )}
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </TabPane>
                        </TabContent>
                    )}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...newsv2Actions,
    ...pageActions
})(Channels);
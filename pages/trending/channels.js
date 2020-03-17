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

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setNewsChannels, getNewsChannels } from '../../utils/cookie';

class Channels extends React.Component {

    state = {
        active_tab: 'Tambah Kanal',
        is_category_loading: true,
        categories: [],
        saved_categories: [],
        channels: [],
        selected_channel_ids: []
    };

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        const savedCategoriesNews = getNewsChannels();
        this.setState({ saved_categories: savedCategoriesNews }, () => {
            this.props.getChannels()
                .then(response => {
                    let channels = response.data.data;
                    let savedChannels = savedCategoriesNews;

                    for (let i = 0; i < channels.length; i++) {
                        if (savedChannels.findIndex(s => s.id == channels[i].id) != -1) {
                            channels.splice(i, 1);
                            i--;
                        }
                    }

                    this.setState({ channels: channels });
                })
                .catch(error => {
                    console.log(error);
                });

            this.props.getCategory()
                .then(response => {
                    let selectedChannelIds = [];
                    let categories = response.data.data;
                    for (let i = 0; i < categories.length; i++) {
                        if (categories[i].label != 'priority') {
                            selectedChannelIds.push(categories[i].id);
                        }
                    }

                    let sortedCategories = [];
                    let savedCategories = savedCategoriesNews;
                    for (let i = 0; i < savedCategories.length; i++) {
                        if (categories.findIndex(c => c.id == savedCategories[i].id) != -1) {
                            sortedCategories.push(savedCategories[i]);
                            savedCategories.splice(i, 1);
                            i--;
                        }
                    }

                    for (let i = 0; i < savedCategories.length; i++) {
                        if (categories.findIndex(c => c.id == savedCategories[i].id) == -1) {
                            sortedCategories.push(savedCategories[i]);
                        }
                    }

                    this.setState({
                        is_category_loading: false,
                        categories: sortedCategories,
                        selected_channel_ids: selectedChannelIds
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ is_category_loading: false });
                });
        });
        
    }

    onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        const res = Array.from(this.state.categories);
        const [removed] = res.splice(result.source.index, 1);
        res.splice(result.destination.index, 0, removed);
        
        const categories = res;
        this.setState({ categories }, () => {
            console.log('SAVE CHANNELS');
            setNewsChannels(this.state.categories);
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
            this.setState({ selected_channel_ids: selectedChannelIds }, () => {
                let channels = this.state.channels;
                channels.splice(index, 1);

                let categories = this.state.categories;
                categories.push(category);

                this.setState({ channels: channels, categories: categories }, () => {
                    setNewsChannels(this.state.categories);
                });
                this.props.unsetPageLoader();
            });

            // this.props.setCategory(selectedChannelIds)
            //     .then(response => {
            //         console.log(response);
            //         this.setState({ selected_channel_ids: selectedChannelIds }, () => {
            //             let channels = this.state.channels;
            //             channels.splice(index, 1);

            //             let categories = this.state.categories;
            //             categories.push(category);

            //             this.setState({ channels: channels, categories: categories });
            //             this.props.unsetPageLoader();
            //         });
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         this.props.unsetPageLoader();
            //     });
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
            selectedChannelIds.splice(removedIndex, 1);
            this.setState({ selected_channel_ids: selectedChannelIds }, () => {
                let channels = this.state.channels;
                channels.push(category);

                let categories = this.state.categories;
                categories.splice(index, 1);
                console.log(categories);

                this.setState({ channels: channels, categories: categories }, () => {
                    setNewsChannels(this.state.categories);
                });
                this.props.unsetPageLoader();
            });
            // this.props.setCategory(selectedChannelIds)
            //     .then(response => {
            //         console.log(response);
                    
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         this.props.unsetPageLoader();
            //     });
        
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
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Droppable droppableId="droppable">
                                            {(provided, snapshot) => (
                                                <ul 
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="edit-channel-list list-group">
                                                    {this.state.categories.map((category, i) => (
                                                        category.label == 'priority' ? (
                                                            <li className="list-group-item" key={'item-' + category.id.toString()}>
                                                                <ListGroupItemHeading>{category.name}</ListGroupItemHeading>
                                                            </li>
                                                        ) : (
                                                            <Draggable 
                                                                key={'item-' + category.id.toString()} 
                                                                draggableId={'item-' + category.id.toString()} 
                                                                index={i}>
                                                                {(provided, snapshot) => (
                                                                    <li
                                                                        className="list-group-item"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        <ListGroupItemHeading>{category.name}</ListGroupItemHeading>
                                                                        <div className="remove-container">
                                                                            <RemoveCircleIcon onClick={() => this.removeChannel(category, i)} className="remove-button" />
                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    ))}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
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
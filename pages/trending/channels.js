import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import classnames from 'classnames';

import Layout from '../../components/Layouts/Default_v2';
import NavBack from '../../components/Includes/Navbar/NavBack';

import ListItemLoader from '../../components/Includes/Shimmer/ListItemLoader';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button } from 'reactstrap';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

import '../../assets/scss/components/channels.scss';

import newsv2Actions from '../../redux/actions/newsv2Actions';
import pageActions from '../../redux/actions/pageActions';
import userActions from '../../redux/actions/userActions';
import newsv2KanalActions from '../../redux/actions/newsv2KanalActions.js';
import { newsTabChannelClicked, newsAddCategoryChannelClicked, newsRemoveCategoryChannelClicked } from '../../utils/appier';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setNewsChannels, getNewsChannels, setAccessToken, removeAccessToken, getUserAccessToken } from '../../utils/cookie';

import queryString from 'query-string';
import ax from 'axios';
import { NEWS_API_V2 } from '../../config';

const jwtDecode = require('jwt-decode');
const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });

class Channels extends React.Component {

    state = {
        active_tab: 'Add Kanal',
        is_category_loading: true,
        categories: [],
        saved_categories: [],
        channels: [],
        selected_channel_ids: [],
        user_data: null,
        device_id: null,
    };

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.accessToken = null;
        this.platform = null;
        const segments = this.props.router.asPath.split(/\?/);
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.token) {
                this.accessToken = q.token;
                setAccessToken(q.token);
            }

            if (q.platform) {
                this.platform = q.platform;
            }
        }
        else {
            removeAccessToken();
        }
    }

  async componentDidMount() {
        this.setState({
          device_id: new DeviceUUID().get(),
        });
        const savedCategories = await this.props.getCategoryV2();
        const savedCategoriesNews = savedCategories.data.data;
        if (this.accessToken) {
            const decodedToken = jwtDecode(this.accessToken);
            if (decodedToken && decodedToken.uid != '0') {
                this.setState({ saved_categories: savedCategoriesNews }, () => {
                    this.fetchData(savedCategoriesNews, true);
                });
            }
            else {
                this.setState({ saved_categories: savedCategoriesNews }, () => {
                    this.fetchData(savedCategoriesNews);
                });
            }
        }
        else {
            this.props.getUserData()
                .then(response => {
                    this.setState({
                        saved_categories: savedCategoriesNews,
                        user_data: response.data.data
                    }, () => {
                        this.fetchData(savedCategoriesNews, true);
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ saved_categories: savedCategoriesNews }, () => {
                        this.fetchData(savedCategoriesNews);
                    });
                });
        }


    }

    fetchData(savedCategoriesNews, isLoggedIn = false) {
        this.props.getChannelsv2()
            .then(response => {
                let channels = response.data.data;
                if (!isLoggedIn) {
                    let savedChannels = savedCategoriesNews;
                    for (let i = 0; i < channels.length; i++) {
                        if (savedChannels.findIndex(s => s.id == channels[i].id) != -1) {
                            channels.splice(i, 1);
                            i--;
                        }
                    }
                }


                this.setState({ channels: channels });
            })
            .catch(error => {
                console.log(error);
            });

        this.props.getCategoryV2()
            .then(response => {
                let selectedChannelIds = [];
                let categories = response.data.data.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].label != 'priority') {
                        selectedChannelIds.push(categories[i].id);
                    }
                }

                let sortedCategories = categories;
                let savedCategories = savedCategoriesNews;
                if (!isLoggedIn) {
                    for (let i = 0; i < savedCategories.length; i++) {
                        if (categories.findIndex(c => c.id == savedCategories[i].id) != -1) {
                            if (sortedCategories.findIndex(s => s.id == savedCategories[i].id) == -1) {
                                sortedCategories.push(savedCategories[i]);
                            }

                            savedCategories.splice(i, 1);
                            i--;
                        }
                    }

                    for (let i = 0; i < savedCategories.length; i++) {
                        if (categories.findIndex(c => c.id == savedCategories[i].id) == -1 && savedCategories[i].label != 'priority') {
                            sortedCategories.push(savedCategories[i]);
                        }
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
    }

    onDragEnd(result) {
        if (!result.destination || !result.source) {
            return;
        }

        try {
            const direction = result.source.index > result.source.destination ? 1 : -1;
            const res = this.state.categories;
            const removed = res.splice(result.source.index, 1);
            if (removed.length > 0) {
                res.splice(result.destination.index, 0, removed[0]);
            }

            const categories = res;
            this.setState({ categories }, async () => {
                let decodedToken = { uid: '0' };
                if (this.accessToken) {
                    decodedToken = jwtDecode(this.accessToken);
                }

                if (this.state.user_data || (this.accessToken && decodedToken.uid != '0')) {
                    this.props.setPageLoader();
                    let promises = [];
                    for (let i = 3; i < this.state.categories.length; i++) {
                        promises.push(this.props.updateCategoryOrderV2(this.state.categories[i].id, this.state.categories.length - i));
                    }
                    const responses = await Promise.all(promises);
                    this.props.unsetPageLoader();
                }
                else {
                    setNewsChannels(this.state.categories);
                }

                // if (!this.state.user_data || (this.accessToken && decodedToken.uid == '0')) {
                //     setNewsChannels(this.state.categories);
                // }
                // else {
                //     this.props.setPageLoader();
                //     let promises = [];
                //     for (let i = 3; i < this.state.categories.length; i++) {
                //         promises.push(this.props.updateCategoryOrder(this.state.categories[i].id, this.state.categories.length - i));
                //     }
                //     const responses = await Promise.all(promises);
                //     console.log(responses);
                //     this.props.unsetPageLoader();
                // }
            });
        }
        catch (error) {
            console.log(error);
            this.props.unsetPageLoader();
        }

    }

    toggleTab(tab) {
        newsTabChannelClicked(tab, 'mweb_news_tab_kanal_clicked');
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab });
        }
    }

    async addChannel(category, index) {
        this.props.setPageLoader();
        newsAddCategoryChannelClicked(category.name, 'mweb_news_add_category_kanal_clicked');

        try {
            let decodedToken = { uid: '0' };
            if (this.accessToken) {
                decodedToken = jwtDecode(this.accessToken);
            }

            if (this.state.user_data || (this.accessToken && decodedToken.uid != '0')) {
              // let addResponse = await this.props.addCategoryV2(category.id);
              let addResponse = await this.props.addCategoryV2(category.id);

            }else{
              let addResponse = await this.props.addCategoryVisitorV2(category.id, this.state.device_id);
            }

            let selectedChannelIds = this.state.selected_channel_ids;
            const addedIndex = selectedChannelIds.indexOf(category.id);
            if (addedIndex == -1) {
                selectedChannelIds.push(category.id);
                this.setState({ selected_channel_ids: selectedChannelIds }, async () => {
                    let channels = this.state.channels;
                    channels.splice(index, 1);


                    const categories = await this.props.getCategoryV2();
                    const categoriesFilter = categories.data.data.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);


                    this.setState({
                        channels: channels,
                        categories: categoriesFilter,
                        active_tab: 'Edit Kanal'
                    }, () => {

                        if (!this.state.user_data || (this.accessToken && decodedToken.uid == '0')) {
                            setNewsChannels(this.state.categories);
                        }
                    });
                    this.props.unsetPageLoader();
                });
            }
            else {
                this.props.unsetPageLoader();
            }
        }
        catch (error) {
            console.log(error);
            this.props.unsetPageLoader();
        }


    }

    async removeChannel(category, index) {
        this.props.setPageLoader();
        newsRemoveCategoryChannelClicked(category.name, 'mweb_news_remove_category_kanal_clicked');

        try {
            let decodedToken = { uid: '0' };
            if (this.accessToken) {
                decodedToken = jwtDecode(this.accessToken);
            }

            if (this.state.user_data || (this.accessToken && decodedToken.uid != '0')) {
                let deleteResponse = await this.props.deleteCategoryV2(category.id);
            }

            let selectedChannelIds = this.state.selected_channel_ids;
            const removedIndex = selectedChannelIds.indexOf(category.id);
            selectedChannelIds.splice(removedIndex, 1);
            this.setState({ selected_channel_ids: selectedChannelIds }, () => {
                let channels = this.state.channels;
                channels.push(category);

                let categories = this.state.categories;
                categories.splice(index, 1);

                this.setState({
                    channels: channels,
                    categories: categories,
                    active_tab: 'Add Kanal'
                }, () => {
                    let decodedToken = { uid: '0' };
                    if (this.accessToken) {
                        decodedToken = jwtDecode(this.accessToken);
                    }

                    if (!this.state.user_data || (this.accessToken && decodedToken.uid == '0')) {
                        setNewsChannels(this.state.categories);
                    }
                });
                this.props.unsetPageLoader();
            });
        }
        catch (error) {
            console.log(error);
            this.props.unsetPageLoader();
        }



    }

    render() {
        const mobilePlatform = (this.platform !== null) ? 'mobilePlatform' : '';
        return (
            <Layout title={`Manage Channels`} mobilePlatform={mobilePlatform}>
                <NavBack />
                <div className="channels-content">
                    <Nav tabs className="navigation-tabs">
                        <NavItem
                            className={classnames({
                                active: this.state.active_tab === 'Add Kanal',
                                'navigation-tabs-item': true
                            })}
                            onClick={() => this.toggleTab('Add Kanal')}>
                            <NavLink className="item-link">Add Kanal</NavLink>
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
                                <TabPane tabId={`Add Kanal`}>
                                    <ListGroup className="add-channel-list">
                                        {this.state.channels.map((channel, i) => (
                                            <ListGroupItem key={i}>
                                                <div className="text-container">
                                                    <ListGroupItemHeading>{channel.name}</ListGroupItemHeading>
                                                    <ListGroupItemText>{channel.description}</ListGroupItemText>
                                                </div>
                                                <div className="button-container">
                                                    <Button onClick={() => this.addChannel(channel, i)} className="add-button">Add</Button>
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
                                                                <div className="remove-container">
                                                                </div>
                                                                <h5 className="list-group-item-heading" style={{ color: '#8f8f8f' }}>{category.name}</h5>
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
                                                                            <div className="remove-container">
                                                                                <RemoveCircleIcon onClick={() => this.removeChannel(category, i)} className="remove-button" />
                                                                            </div>
                                                                            <ListGroupItemHeading>{category.name}</ListGroupItemHeading>
                                                                            <div className="sort-container">
                                                                                <CompareArrowsIcon className="sort-button" />
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
    ...pageActions,
    ...userActions,
  ...newsv2KanalActions,
})(withRouter(Channels));

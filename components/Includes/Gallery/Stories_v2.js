import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';

import storiesActions from '../../../redux/actions/storiesActions';

import { RESOLUTION_IMG } from '../../../config';

import '../../../assets/scss/components/stories.scss';

class Stories extends React.Component {
    constructor(props) {
        super(props);
        this.storiesElement = null;
        this.storiesApi = null;
        this.storyId = 0;

        this.state = {
            zuckJS: null,
            stories: [],
            resolution: RESOLUTION_IMG,
            page: 1,
            length: 4,
            totalLength: 0,
            loading: false,
            endpage: false,
        }
    }

    componentDidMount() {
        document.getElementById('stories-react').addEventListener('scroll', this.handleScroll);

        if(this.props.detailCategory) { // IF PARENT COMPONENT IS DETAIL HOME CATEGORY
            this.setState({
                zuckJS: require('../../../assets/js/zuck')
            }, () => {
                this.props.getStoriesCategory(this.state.page, this.state.length, this.props.id)
                .then(() => {
                    const timelines = [];

                    const stories = this.props.stories.data;
                    for (const story of stories) {
                        timelines.push(this.buildTimeline(story));
                    }

                    let currentLength = this.state.totalLength + this.props.stories.data.length;

                    this.setState({
                        stories: timelines,
                        totalLength: currentLength,
                    }, () => {
                        const currentSkin = this.getCurrentSkin();
                        this.storiesApi = new this.state.zuckJS("stories-react", {
                            backNative: true,
                            previousTap: true,
                            skin: currentSkin['name'],
                            autoFullScreen: currentSkin['params']['autoFullScreen'],
                            avatars: currentSkin['params']['avatars'],
                            paginationArrows: currentSkin['params']['paginationArrows'],
                            list: currentSkin['params']['list'],
                            cubeEffect: currentSkin['params']['cubeEffect'],
                            localStorage: true,
                            stories: this.state.stories,
                            reactive: true,
                            callbacks: {
                                onDataUpdate: function (stories, callback) {
                                    //console.log('DATA UPDATED');
                                    const notSeen = [];
                                    const seen = [];

                                    for (const story of stories) {
                                        if (story.seen) {
                                            seen.push({...story});
                                        } else {
                                            notSeen.push({...story});
                                        }
                                    }

                                    const storiesData = [...notSeen, ...seen];

                                    this.setState(state => {
                                        state.stories = storiesData;
                                        return state;
                                    }, () => {
                                        callback();
                                    });
                                    // console.log('onDataUpdate', stories)
                                    callback();
                                }.bind(this),
                                onOpen: function (storyId, callback) {
                                    console.log('OPEN');
                                    document.body.style.overflow = 'hidden'; // disable scroll when opening a story
                                    callback();
                                },
                                onView: function (storyId) {
                                    console.log('VIEW');
                                    if (parseInt(storyId) >= (this.state.stories.length - 3)) {
                                        this.loadMore();
                                    }
                                }.bind(this),
                                onClose: function (storyId, callback) {
                                    console.log('CLOSED');
                                    document.body.style.overflow = 'unset'; // enable scroll after closing the story
                                    callback();
                                }
                            },
                            language: { // if you need to translate :)
                                unmute: 'Touch to unmute',
                                keyboardTip: 'Press space to see next',
                                visitLink: 'Visit link',
                                time: {
                                    ago: 'ago',
                                    hour: 'hour',
                                    hours: 'hours',
                                    minute: 'minute',
                                    minutes: 'minutes',
                                    fromnow: 'from now',
                                    seconds: 'seconds',
                                    yesterday: 'yesterday',
                                    tomorrow: 'tomorrow',
                                    days: 'days'
                                }
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            });

        }else {
            this.setState({
                zuckJS: require('../../../assets/js/zuck')
            }, () => {
                this.props.getStories(this.state.page, this.state.length)
                .then(() => {
                    const timelines = [];

                    const stories = this.props.stories.data;
                    for (const story of stories) {
                        timelines.push(this.buildTimeline(story));
                    }

                    let currentLength = this.state.totalLength + this.props.stories.data.length;

                    this.setState({
                        stories: timelines,
                        totalLength: currentLength,
                    }, () => {
                        const currentSkin = this.getCurrentSkin();
                        this.storiesApi = new this.state.zuckJS("stories-react", {
                            backNative: true,
                            previousTap: true,
                            skin: currentSkin['name'],
                            autoFullScreen: currentSkin['params']['autoFullScreen'],
                            avatars: currentSkin['params']['avatars'],
                            paginationArrows: currentSkin['params']['paginationArrows'],
                            list: currentSkin['params']['list'],
                            cubeEffect: currentSkin['params']['cubeEffect'],
                            localStorage: true,
                            stories: this.state.stories,
                            reactive: true,
                            callbacks: {
                                onDataUpdate: function (stories, callback) {
                                    //console.log('DATA UPDATED');
                                    const notSeen = [];
                                    const seen = [];

                                    for (const story of stories) {
                                        if (story.seen) {
                                            seen.push({...story});
                                        } else {
                                            notSeen.push({...story});
                                        }
                                    }

                                    const storiesData = [...notSeen, ...seen];

                                    this.setState(state => {
                                        state.stories = storiesData;
                                        return state;
                                    }, () => {
                                        callback();
                                    });
                                    // console.log('onDataUpdate', stories)
                                    callback();
                                }.bind(this),
                                onOpen: function (storyId, callback) {
                                    console.log('OPEN');
                                    document.body.style.overflow = 'hidden'; // disable scroll when opening a story
                                    callback();
                                },
                                onView: function (storyId) {
                                    console.log('VIEW');
                                    if (parseInt(storyId) >= (this.state.stories.length - 3)) {
                                        this.loadMore();
                                    }
                                }.bind(this),
                                onClose: function (storyId, callback) {
                                    console.log('CLOSED');
                                    document.body.style.overflow = 'unset'; // enable scroll after closing the story
                                    callback();
                                }
                            },
                            language: { // if you need to translate :)
                                unmute: 'Touch to unmute',
                                keyboardTip: 'Press space to see next',
                                visitLink: 'Visit link',
                                time: {
                                    ago: 'ago',
                                    hour: 'hour',
                                    hours: 'hours',
                                    minute: 'minute',
                                    minutes: 'minutes',
                                    fromnow: 'from now',
                                    seconds: 'seconds',
                                    yesterday: 'yesterday',
                                    tomorrow: 'tomorrow',
                                    days: 'days'
                                }
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            });
        }

        
    }

    componentWillUnmount() {
        document.getElementById('stories-react').removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevStates) {
        if (this.storiesApi != null) {
            if (prevStates.totalLength < this.state.totalLength) {
                this.storyId = prevStates.totalLength;
                const newStories = [];
                for (const story of this.props.stories.data) {
                    newStories.push(this.buildTimeline(story));
                }
                this.storiesApi.addStories(newStories, true);
            }
        }
    }

    getCurrentSkin() {
        let header = document.getElementById('header');
        let skin = location.href.split('skin=')[1];

        if (!skin) {
            skin = 'Snapgram';
        }

        if (skin.indexOf('#') !== -1) {
            skin = skin.split('#')[0];
        }

        let skins = {
            Snapgram: {
                avatars: true,
                list: false,
                autoFullScreen: false,
                cubeEffect: true,
                paginationArrows: false
            },

            VemDeZAP: {
                avatars: false,
                list: true,
                autoFullScreen: false,
                cubeEffect: false,
                paginationArrows: true
            },

            FaceSnap: {
                avatars: true,
                list: false,
                autoFullScreen: true,
                cubeEffect: false,
                paginationArrows: true
            },

            Snapssenger: {
                avatars: false,
                list: false,
                autoFullScreen: false,
                cubeEffect: false,
                paginationArrows: false
            }
        };

        let el = document.querySelectorAll('#skin option');
        let total = el.length;
        for (let i = 0; i < total; i++) {
            let what = skin == el[i].value ? true : false;

            if (what) {
                el[i].setAttribute('selected', 'selected');

                header.innerHTML = skin;
                header.className = skin;
            } else {
                el[i].removeAttribute('selected');
            }
        }

        return {
            name: skin,
            params: skins[skin]
        };
    }

    buildTimeline = (story) => {
        const items = [];

        for (const item of story.story) {
            items.push([
                item.id,
                item.link_video != null ? 'video' : 'photo',
                10,
                item.link_video != null ? (item.link_video) : (this.props.stories.meta.image_path + this.state.resolution + item.story_img),
                item.link_video != null ? (item.link_video) : (this.props.stories.meta.image_path + this.state.resolution + item.story_img),
                item.swipe_type == 'link' ? (item.swipe_value) : false, 'Click Here',
                false,
                item.release_date,
                item.title,
                item.link_video != null ? item.link_video.split('.').pop() : ''
            ]);
        }

        let programImg = '';
        if (story.program_img != null) {
            programImg = this.props.stories.meta.image_path + this.state.resolution  + story.program_img;
        }
        else {
            programImg = 'static/placeholders/placeholder_potrait.png';
        }

        const timeline = this.state.zuckJS.buildTimelineItem(
            this.storyId,
            programImg,
            story.program_title,
            '',
            false,
            items
        );

        this.storyId = this.storyId + 1;

        return timeline;
    }

    handleScroll = (event) => {
        const screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const totalStoriesW = (document.querySelector('.story').offsetWidth + 6) * this.state.stories.length;
        const scrollOffset = totalStoriesW - screenW;

        if (document.getElementById('stories-react').scrollLeft >= scrollOffset) {
            this.loadMore();
        }
    }

    loadMore = () => {
        if (!this.state.loading && !this.state.endpage) {
            let page = this.state.page + 1;
			this.setState({ loading: true }, () => {
                this.props.loadingBar && this.props.loadingBar.continuousStart();
                this.props.getStories(page, this.state.length)
                .then(() => {
                    const buildedStories = [];
                    const newStories = this.props.stories.data;

                    for (const story of newStories) {
                        buildedStories.push(this.buildTimeline(story));
                    }

                    const seen = [];
                    const notseen = [];

                    for (const story of this.state.stories) {
                        if (story.seen) {
                            seen.push({...story});
                        } else {
                            notseen.push({...story});
                        }
                    }

                    const storiesData = [...notseen, ...buildedStories, ...seen];
                    let currentLength = this.state.totalLength + this.props.stories.data.length;

                    this.setState({ totalLength: currentLength, stories: storiesData, loading: false, page: page, endpage: this.props.stories.data.length < this.state.length });
                    this.props.loadingBar && this.props.loadingBar.complete();
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ loading: false, endpage: true });
                    this.props.loadingBar && this.props.loadingBar.complete();
                });
            });
        }
    }

    render() {
        const timelineItems = []
        this.state.stories.forEach((story, storyId) => {
            const storyItems = [];
            story.items.forEach((storyItem) => {
                storyItems.push(
                    <li key={storyItem.id} data-id={storyItem.id} data-time={storyItem.time} className={(storyItem.seen ? 'seen' : '')}>
                        <a href={storyItem.src} data-type={storyItem.type} data-length={storyItem.length} data-link={storyItem.link} data-linktext={storyItem.linkText} data-title={'hh3'}>
                            <img src={storyItem.preview} />
                        </a>
                    </li>
                );
            });

            //let arrayFunc = story.seen ? 'push' : 'unshift';
            timelineItems.push(
                <div className={(story.seen ? 'story seen' : 'story')} key={story.id} data-id={story.id} data-last-updated={story.lastUpdated} data-photo={story.photo}>
                    <a className="item-link" href={story.link}>
                        <span className="item-preview">
                            <img src={story.photo} />
                        </span>
                        <span className="info" itemProp="author" itemScope="" itemType="http://schema.org/Person">
                            <strong className="name" itemProp="name">{story.name}</strong>
                            <span className="time">{story.lastUpdated}</span>
                        </span>
                    </a>

                    <ul className="items">
                        {storyItems}
                    </ul>
                </div>
            );
        });

        return (
            <div style={{paddingTop: 55}} className="stories-wrapper">
                <Head>
                    <link rel="stylesheet" href="static/css/zuck.css?v=2" />
                    <link rel="stylesheet" href="static/css/snapgram.css?v=2" />
                </Head>
                {/* <BottomScrollListener onBottom={this.loadMore.bind(this)}>
                    {scrollRef => (
                        <div ref={scrollRef} id="stories-react" className="storiesWrapper">
                            {timelineItems}
                        </div>
                    )}
                </BottomScrollListener> */}
                <div ref={node => this.storiesElement = node} id="stories-react" className="storiesWrapper">
                    {timelineItems}
                </div>
            </div>
        );
    }
}

export default connect(state => state, storiesActions)(Stories);

import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import storiesActions from '../../../redux/actions/storiesActions';

class Stories extends React.Component {
    constructor(props) {
        super(props);
        // React ^16.3
        // this.storiesElement = React.createRef();
        this.storiesElement = null;
        this.storiesApi = null;

        this.state = {
            stories: []
        }
    }

    componentDidMount() {
        const Zuck = require('zuck.js');
        this.props.getStories().then(response => {
            const stories = this.props.stories.data;
            let timelines = [];
            for (let i = 0; i < stories.length; i++) {
                const story = stories[i];
                let items = [];
                for (let j = 0; j < story.story.length; j++) {

                    items.push([
                        story.story[j].id,
                        story.story[j].link_video != null ? 'video' : 'photo',
                        10,
                        story.story[j].link_video != null ? (story.story[j].link_video) : (story.story[j].story_img),
                        story.story[j].link_video != null ? (story.story[j].link_video) : (story.story[j].story_img),
                        false, false,
                        false,
                        story.story[j].release_date
                    ]);

                }

                let programImg = '';
                if (story.program_img != null) {
                    programImg = this.props.stories.video_path + story.program_img;
                }
                else {
                    programImg = 'static/placeholders/placeholder_potrait.png';
                }

                timelines.push(Zuck.buildTimelineItem(
                    story.program_id,
                    programImg,
                    story.program_title,
                    '',
                    false,
                    items
                ));
            }

            this.setState({
                stories: timelines
            }, () => {
                let currentSkin = this.getCurrentSkin(); // from demo
                this.storiesApi = new Zuck(this.storiesElement, {
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
                        onDataUpdate: function (currentState, callback) {
                            this.setState(state => {
                                state.stories = currentState;
                                return state;
                            }, () => {
                                callback();
                            });
                        }.bind(this)
                    }
                });
            });
        });
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

    render() {
        const timelineItems = []
        this.state.stories.forEach((story, storyId) => {
            const storyItems = [];
            story.items.forEach((storyItem) => {
                storyItems.push(
                    <li key={storyItem.id} data-id={storyItem.id} data-time={storyItem.time} className={(storyItem.seen ? 'seen' : '')}>
                        <a href={storyItem.src} data-type={storyItem.type} data-length={storyItem.length} data-link={storyItem.link} data-linktext={storyItem.linkText}>
                            <img src={storyItem.preview} />
                        </a>
                    </li>
                );
            });

            let arrayFunc = story.seen ? 'push' : 'unshift';
            timelineItems[arrayFunc](
                <div className={(story.seen ? 'story seen' : 'story')} key={storyId} data-id={storyId} data-last-updated={story.lastUpdated} data-photo={story.photo}>
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
            <div className="stories-wrapper">
                <Head>
                    <link rel="stylesheet" href="static/css/zuck.min.css" />
                    <link rel="stylesheet" href="static/css/snapgram.css" />
                </Head>
                <div ref={node => this.storiesElement = node} id="stories-react" className="storiesWrapper">
                    {timelineItems}
                </div>
            </div>
        );
    }
}

export default connect(state => state, storiesActions)(Stories);
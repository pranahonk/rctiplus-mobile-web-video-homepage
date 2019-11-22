import React from 'react';
import Head from 'next/head';

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
        this.setState({
            stories: [
                Zuck.buildTimelineItem(
                    "ramon",
                    "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/1.jpg",
                    "Ramon",
                    "https://ramon.codes",
                    this.timestamp(),
                    [
                        ["ramon-1", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/1.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/1.jpg", '', false, false, this.timestamp()],
                        ["ramon-2", "video", 0, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/2.mp4", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/2.jpg", '', false, false, this.timestamp()],
                        ["ramon-3", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/3.png", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/3.png", 'https://ramon.codes', 'Visit my Portfolio', false, this.timestamp()]
                    ]
                ),
                Zuck.buildTimelineItem(
                    "gorillaz",
                    "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/2.jpg",
                    "Gorillaz",
                    "",
                    this.timestamp(),
                    [
                        ["gorillaz-1", "video", 0, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/4.mp4", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/4.jpg", '', false, false, this.timestamp()],
                        ["gorillaz-2", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/5.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/5.jpg", '', false, false, this.timestamp()],
                    ]
                ),
                Zuck.buildTimelineItem(
                    "ladygaga",
                    "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/3.jpg",
                    "Lady Gaga",
                    "",
                    this.timestamp(),
                    [
                        ["ladygaga-1", "photo", 5, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/6.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/6.jpg", '', false, false, this.timestamp()],
                        ["ladygaga-2", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/7.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/7.jpg", 'http://ladygaga.com', false, false, this.timestamp()],
                    ]
                ),
                Zuck.buildTimelineItem(
                    "starboy",
                    "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/4.jpg",
                    "The Weeknd",
                    "",
                    this.timestamp(),
                    [
                        ["starboy-1", "photo", 5, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/8.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/8.jpg", '', false, false, this.timestamp()]
                    ]
                ),
                Zuck.buildTimelineItem(
                    "riversquomo",
                    "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/5.jpg",
                    "Rivers Cuomo",
                    "",
                    this.timestamp(),
                    [
                        ["riverscuomo", "photo", 10, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/9.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/9.jpg", '', false, false, this.timestamp()]
                    ]
                )
            ]
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

    }

    timestamp() {
        let timeIndex = 0;
        let shifts = [35, 60, 60 * 3, 60 * 60 * 2, 60 * 60 * 25, 60 * 60 * 24 * 4, 60 * 60 * 24 * 10];

        let now = new Date();
        let shift = shifts[timeIndex++] || 0;
        let date = new Date(now - shift * 1000);

        return date.getTime() / 1000;
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
            <div>
                <Head>
                    <link rel="stylesheet" href="https://rawgit.com/ramon82/zuck.js/master/dist/zuck.min.css" />
                    <link rel="stylesheet" href="https://rawgit.com/ramon82/zuck.js/master/dist/skins/snapgram.css" />

                </Head>
                <div ref={node => this.storiesElement = node} id="stories-react" className="storiesWrapper">
                    {timelineItems}
                </div>
            </div>
        );
    }
}

export default Stories;
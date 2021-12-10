import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import dynamic from 'next/dynamic'

import storiesActions from '../../../redux/actions/storiesActions'
import { RESOLUTION_IMG } from '../../../config'
import { client } from "../../../graphql/client"
import { GET_HOME_STORIES } from "../../../graphql/queries/homepage"

const StoryModal = dynamic(() => import("../../Modals/StoryModal"))

import '../../../assets/scss/components/stories.scss'

function homeStories (props) {
    const [ stories,setStories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ activeStory, setActiveStory ] = useState(null)
    const [ storyIndex, setStoryIndex ] = useState(0)

    useEffect(() => {
        client.query({ query: GET_HOME_STORIES() })
            .then(({ data }) => {
                const stories = data.stories.data.map(story => ({
                    ...story,
                    image_path: data.stories.meta.image_path,
                    all_read: false
                }))

                setStories(stories)
                setMeta(data.stories.meta)
            })
            .catch(e => {})
    }, [])

    const openStory = (story, index) => {
        setActiveStory(story)
        setStoryIndex(index)
    }

    const onSwipe = (direction) => {
        if ((storyIndex - 1) < 0 && direction === "left") {
            setActiveStory(null)
            setStoryIndex(0)
            return
        }
        if ((storyIndex + 1) > (stories.length - 1) && direction === "right") {
            setActiveStory(null)
            setStoryIndex(0)
            return
        }

        if (direction === "right") {
            setActiveStory(stories[storyIndex + 1])
            setStoryIndex(storyIndex + 1)
            return
        }
        if (direction === "left") {
            setActiveStory(stories[storyIndex - 1])
            setStoryIndex(storyIndex - 1)
            return
        }
    }

    if (stories.length === 0) return null

    return (
        <>
            <div id="home-stories">
                { stories.map((story, i) => {
                    return (
                        <div key={i} className="homestory-wrapper">
                            <div 
                                id={`home-story-${i}`} 
                                onClick={_ => openStory(story, i)}>
                                <img
                                    width="97"
                                    height="97"
                                    src={`${meta.image_path}${RESOLUTION_IMG}${story.program_img}`}
                                    alt={`story ${story.identifier}`} />
                            </div>
                            <label>{ story.title }</label>
                        </div>
                    )
                }) }
            </div>
            
            <StoryModal 
                story={activeStory}
                onswipe={e => onSwipe(e)}
                storyIndex={storyIndex}
                onclose={_ => setActiveStory(null)}  />
        </>
    )
    // constructor(props) {
    //     super(props);
    //     this.storiesElement = null;
    //     this.storiesApi = null;
    //     this.storyId = 0;

    //     this.state = {
    //         zuckJS: null,
    //         stories: [],
    //         resolution: RESOLUTION_IMG,
    //         page: 1,
    //         length: 6,
    //         totalLength: 0,
    //         loading: false,
    //         endpage: false,
    //     }
    // }

    // componentDidMount() {
    //     document.getElementById('stories-react').addEventListener('scroll', this.handleScroll);

    //     if(this.props.detailCategory) { // IF PARENT COMPONENT IS DETAIL HOME CATEGORY
    //         this.setState({
    //             zuckJS: require('../../../assets/js/zuck')
    //         }, () => {

    //             this.props.getStoriesCategory(this.state.page, this.state.length, this.props.id)
    //             .then(() => {
    //                 const timelines = [];

    //                 const stories = this.props.stories.data;
    //                 for (const story of stories) {
    //                     timelines.push(this.buildTimeline(story));

    //                     if (story.gpt.length >= 1) {
    //                         timelines.push(this.buildStoryGPT(story.gpt));
    //                     }
    //                 }

    //                 let currentLength = this.state.totalLength + this.props.stories.data.length;

    //                 this.setState({
    //                     stories: timelines,
    //                     totalLength: currentLength,
    //                 }, () => {
    //                     const currentSkin = this.getCurrentSkin();
    //                     this.storiesApi = new this.state.zuckJS("stories-react", {
    //                         backButton: true,
    //                         backNative: false,
    //                         previousTap: true,
    //                         skin: currentSkin['name'],
    //                         autoFullScreen: currentSkin['params']['autoFullScreen'],
    //                         avatars: currentSkin['params']['avatars'],
    //                         paginationArrows: currentSkin['params']['paginationArrows'],
    //                         list: currentSkin['params']['list'],
    //                         cubeEffect: currentSkin['params']['cubeEffect'],
    //                         localStorage: true,
    //                         stories: this.state.stories,
    //                         reactive: true,
    //                         callbacks: {
    //                             onDataUpdate: function (stories, callback) {
    //                                 //console.log('DATA UPDATED');
    //                                 const notSeen = [];
    //                                 const seen = [];

    //                                 /* for (let i = 0; i < stories.length; i++) {
    //                                     if (stories[i].name.includes('ads')) {
    //                                         const [str, storyParentId] = stories[i].name.split('_');
    //                                         if (stories[storyParentId].seen) {
    //                                             stories[i].seen = true;
    //                                         }
    //                                     }
    //                                 } */

    //                                 /* for (const story of stories) {
    //                                     if (story.seen) {
    //                                         seen.push({...story});
    //                                     } else {
    //                                         notSeen.push({...story});
    //                                     }
    //                                 } */

    //                                 for (let i = 0; i < stories.length; i++) {
    //                                     const story = stories[i];
    //                                     if (stories[i].name.includes('ads')) {
    //                                         const [str, storyParentId] = story.name.split('_');
    //                                         if (stories[storyParentId].seen) {
    //                                             story.seen = true;
    //                                         }
    //                                     }
    //                                     if (story.seen) {
    //                                         seen.push({...story});
    //                                     } else {
    //                                         notSeen.push({...story});
    //                                     }
    //                                 }

    //                                 const storiesData = [...notSeen, ...seen];

    //                                 this.setState(state => {
    //                                     state.stories = storiesData;
    //                                     return state;
    //                                 }, () => {
    //                                     callback();
    //                                 });
    //                                 // console.log('onDataUpdate', stories)
    //                                 callback();
    //                             }.bind(this),
    //                             onOpen: function (storyId, callback) {
    //                                 console.log('OPEN');
    //                                 document.body.style.overflow = 'hidden'; // disable scroll when opening a story
    //                                 callback();
    //                             },
    //                             onView: function (storyId) {
    //                                 console.log('VIEW');
    //                                 if (parseInt(storyId) >= (this.state.stories.length - 3)) {
    //                                     this.loadMore();
    //                                 }
    //                             }.bind(this),
    //                             onClose: function (storyId, callback) {
    //                                 console.log('CLOSED');
    //                                 document.body.style.overflow = 'unset'; // enable scroll after closing the story
    //                                 callback();
    //                             }
    //                         },
    //                         language: { // if you need to translate :)
    //                             unmute: 'Touch to unmute',
    //                             keyboardTip: 'Press space to see next',
    //                             visitLink: 'Visit link',
    //                             time: {
    //                                 ago: 'ago',
    //                                 hour: 'hour',
    //                                 hours: 'hours',
    //                                 minute: 'minute',
    //                                 minutes: 'minutes',
    //                                 fromnow: 'from now',
    //                                 seconds: 'seconds',
    //                                 yesterday: 'yesterday',
    //                                 tomorrow: 'tomorrow',
    //                                 days: 'days'
    //                             }
    //                         }
    //                     });
    //                 });
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //         });

    //     }
        
    //     if(this.props.homepage){
    //         this.setState({
    //             zuckJS: require('../../../assets/js/zuck')
    //         }, () => {
    //             this.props.getStories(this.state.page, this.state.length)
    //             .then(() => {
    //                 const timelines = [];

    //                 const stories = this.props.stories.data;
    //                 for (const story of stories) {
    //                     timelines.push(this.buildTimeline(story));
    //                 }

    //                 let currentLength = this.state.totalLength + this.props.stories.data.length;

    //                 this.setState({
    //                     stories: timelines,
    //                     totalLength: currentLength,
    //                 }, () => {
    //                     const currentSkin = this.getCurrentSkin();
    //                     this.storiesApi = new this.state.zuckJS("stories-react", {
    //                         backButton: true,
    //                         backNative: false,
    //                         previousTap: true,
    //                         skin: currentSkin['name'],
    //                         autoFullScreen: currentSkin['params']['autoFullScreen'],
    //                         avatars: currentSkin['params']['avatars'],
    //                         paginationArrows: currentSkin['params']['paginationArrows'],
    //                         list: currentSkin['params']['list'],
    //                         cubeEffect: currentSkin['params']['cubeEffect'],
    //                         localStorage: true,
    //                         stories: this.state.stories,
    //                         reactive: true,
    //                         callbacks: {
    //                             onDataUpdate: function (stories, callback) {
    //                                 //console.log('DATA UPDATED');
    //                                 const notSeen = [];
    //                                 const seen = [];

    //                                 /* for (let i = 0; i < stories.length; i++) {
    //                                     if (stories[i].name.includes('ads')) {
    //                                         const [str, storyParentId] = stories[i].name.split('_');
    //                                         if (stories[storyParentId].seen) {
    //                                             stories[i].seen = true;
    //                                         }
    //                                     }
    //                                 } */

    //                                 /* for (const story of stories) {
    //                                     if (story.seen) {
    //                                         seen.push({...story});
    //                                     } else {
    //                                         notSeen.push({...story});
    //                                     }
    //                                 } */

    //                                 for (let i = 0; i < stories.length; i++) {
    //                                     const story = stories[i];
    //                                     if (stories[i].name.includes('ads')) {
    //                                         const [str, storyParentId] = story.name.split('_');
    //                                         if (stories[storyParentId].seen) {
    //                                             story.seen = true;
    //                                         }
    //                                     }
    //                                     if (story.seen) {
    //                                         seen.push({...story});
    //                                     } else {
    //                                         notSeen.push({...story});
    //                                     }
    //                                 }

    //                                 const storiesData = [...notSeen, ...seen];

    //                                 this.setState(state => {
    //                                     state.stories = storiesData;
    //                                     return state;
    //                                 }, () => {
    //                                     callback();
    //                                 });
    //                                 // console.log('onDataUpdate', stories)
    //                                 callback();
    //                             }.bind(this),
    //                             onOpen: function (storyId, callback) {
    //                                 console.log('OPEN');
    //                                 document.body.style.overflow = 'hidden'; // disable scroll when opening a story
    //                                 callback();
    //                             },
    //                             onView: function (storyId) {
    //                                 console.log('VIEW');
    //                                 if (parseInt(storyId) >= (this.state.stories.length - 3)) {
    //                                     this.loadMore();
    //                                 }
    //                             }.bind(this),
    //                             onClose: function (storyId, callback) {
    //                                 console.log('CLOSED');
    //                                 document.body.style.overflow = 'unset'; // enable scroll after closing the story
    //                                 callback();
    //                             }
    //                         },
    //                         language: { // if you need to translate :)
    //                             unmute: 'Touch to unmute',
    //                             keyboardTip: 'Press space to see next',
    //                             visitLink: 'Visit link',
    //                             time: {
    //                                 ago: 'ago',
    //                                 hour: 'hour',
    //                                 hours: 'hours',
    //                                 minute: 'minute',
    //                                 minutes: 'minutes',
    //                                 fromnow: 'from now',
    //                                 seconds: 'seconds',
    //                                 yesterday: 'yesterday',
    //                                 tomorrow: 'tomorrow',
    //                                 days: 'days'
    //                             }
    //                         }
    //                     });
    //                 });
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //         });
    //     }

        
    // }

    // componentWillUnmount() {
    //     document.getElementById('stories-react').removeEventListener('scroll', this.handleScroll);
    // }

    // componentDidUpdate(prevProps, prevStates) {
    //     if (this.storiesApi != null) {
    //         if (prevStates.totalLength < this.state.totalLength) {
    //             this.storyId = prevStates.totalLength;
    //             const newStories = [];
    //             for (const story of this.props.stories.data) {
    //                 newStories.push(this.buildTimeline(story));

    //                 if (story.gpt.length >= 1) {
    //                     newStories.push(this.buildStoryGPT(story.gpt));
    //                 }
    //             }
    //             this.storiesApi.addStories(newStories, true);
    //         }
    //     }
    // }

    // getCurrentSkin() {
    //     let header = document.getElementById('header');
    //     let skin = location.href.split('skin=')[1];

    //     if (!skin) {
    //         skin = 'Snapgram';
    //     }

    //     if (skin.indexOf('#') !== -1) {
    //         skin = skin.split('#')[0];
    //     }

    //     let skins = {
    //         Snapgram: {
    //             avatars: true,
    //             list: false,
    //             autoFullScreen: false,
    //             cubeEffect: true,
    //             paginationArrows: false
    //         },

    //         VemDeZAP: {
    //             avatars: false,
    //             list: true,
    //             autoFullScreen: false,
    //             cubeEffect: false,
    //             paginationArrows: true
    //         },

    //         FaceSnap: {
    //             avatars: true,
    //             list: false,
    //             autoFullScreen: true,
    //             cubeEffect: false,
    //             paginationArrows: true
    //         },

    //         Snapssenger: {
    //             avatars: false,
    //             list: false,
    //             autoFullScreen: false,
    //             cubeEffect: false,
    //             paginationArrows: false
    //         }
    //     };

    //     let el = document.querySelectorAll('#skin option');
    //     let total = el.length;
    //     for (let i = 0; i < total; i++) {
    //         let what = skin == el[i].value ? true : false;

    //         if (what) {
    //             el[i].setAttribute('selected', 'selected');

    //             header.innerHTML = skin;
    //             header.className = skin;
    //         } else {
    //             el[i].removeAttribute('selected');
    //         }
    //     }

    //     return {
    //         name: skin,
    //         params: skins[skin]
    //     };
    // }

    
    // buildTimeline = (story) => {
    //     const items = [];

    //     for (const item of story.story) {
    //         items.push([
    //             item.id,
    //             item.link_video != null ? 'video' : 'photo',
    //             10,
    //             item.link_video != null ? (item.link_video) : (this.props.stories.meta.image_path + this.state.resolution + item.story_img),
    //             item.link_video != null ? (item.link_video) : (this.props.stories.meta.image_path + this.state.resolution + item.story_img),
    //             this.handleActionClick(item), 
    //             'Click Here',
    //             false,
    //             item.release_date,
    //             item.title,
    //             item.link_video != null ? item.link_video.split('.').pop() : ''
    //         ]);
    //     }

    //     // Add GPT
    //     //console.log('story gpt', story.gpt)
    //     //for (const item of story.gpt) {
    //     /**
    //      * Ukuran Avatar 40x40 margin left 15px
    //      * font size title 16px margin left 15px
    //      */
    //     /* if (this.storyId == 0) {
    //         items.push([
    //             Math.floor(Math.random() * Math.floor(999999)), // id
    //             'ads', // type
    //             500, // durations in string
    //             '/21865661642/RC_MOBILE_INSERTION-STORIES', // item.path src
    //             'div-gpt-ad-1596100730972-0', // item.div_gpt preview
    //             false, // link
    //             '', // linkText
    //             false, // seen
    //             new Date().getTime(), // time
    //             '', // title
    //             '' // videoType
    //         ]);
    //     } */
    //     /* for (const item of story.gpt) {
    //         items.push([
    //             item.id + Math.floor(Math.random() * Math.floor(999999)) + Math.floor(Math.random() * Math.floor(99)), // id
    //             'ads', // type
    //             5, // durations in string
    //             item.path, // item.path src
    //             item.div_gpt, // item.div_gpt preview
    //             false, // link
    //             '', // linkText
    //             false, // seen
    //             new Date().getTime(), // time
    //             '', // title
    //             '' // videoType
    //         ]);
    //     } */

    //     let programImg = '';
    //     if (story.program_img != null) {
    //         programImg = this.props.stories.meta.image_path + this.state.resolution  + story.program_img;
    //     }
    //     else {
    //         programImg = 'static/placeholders/placeholder_potrait.png';
    //     }

    //     const timeline = this.state.zuckJS.buildTimelineItem(
    //         this.storyId, //id
    //         programImg, //photo
    //         story.program_title, //name
    //         '', //link
    //         false, //lastupdated
    //         items //items
    //     );

    //     this.storyId = this.storyId + 1;

    //     return timeline;
    // }

    // buildStoryGPT = (gpt) => {
    //     const items = [];

    //     for (const item of gpt) {
    //         items.push([
    //             item.id + Math.floor(Math.random() * Math.floor(999999)) + Math.floor(Math.random() * Math.floor(99)), // id
    //             'ads', // type
    //             10, // durations in string
    //             item.path, // item.path src
    //             item.div_gpt, // item.div_gpt preview
    //             false, // link
    //             '', // linkText
    //             false, // seen
    //             new Date().getTime(), // time
    //             '', // title
    //             '' // videoType
    //         ]);
    //     }
        
    //     // Creation of source data for targetting ads
    //     const targettingAdsData = this.props.ads ? this.props.ads.data_ta : []
    //     targettingAdsData.push({
    //         name: "logged_in", 
    //         value : String(this.props.user.data !== null)
    //     })

    //     const timeline = this.state.zuckJS.buildTimelineItem(
    //         this.storyId, //id
    //         '', //photo
    //         'ads_' + (this.storyId - 1), //name
    //         '', //link
    //         false, //lastupdated
    //         items, //items
    //         targettingAdsData // data for targetting ads, the type is Array of objects
    //     )

    //     this.storyId = this.storyId + 1;

    //     return timeline;
    // }

    // handleScroll = (event) => {
    //     const screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //     const totalStoriesW = (document.querySelector('.story').offsetWidth + 6) * this.state.stories.length;
    //     const scrollOffset = totalStoriesW - screenW;

    //     if (document.getElementById('stories-react').scrollLeft >= scrollOffset) {
    //         this.loadMore()
    //     }
    // }
    // handleActionClick(program) {
    //     // console.log('action click', program)
    //     switch (program?.swipe_type) {
    //         case 'live_streaming' :
    //             let channel = 'rcti'
    //             if(program?.swipe_value === '1') {
    //                 channel = 'rcti'
    //             }
    //             if(program?.swipe_value === '2') {
    //                 channel = 'mnctv'
    //             }
    //             if(program?.swipe_value === '3') {
    //                 channel = 'gtv'
    //             }
    //             if(program?.swipe_value === '4') {
    //                 channel = 'inews'
    //             }
    //             return `/tv/${channel}`;
    //         case 'homepage_news':
	// 			return "/news"
    //         case 'news_detail' :
    //         case 'news_category':
    //         case 'news_tags' :
    //             return program.swipe_value
    //         case 'link':
    //             if(program.swipe_value) {
    //                 return `${program.share_link}`;
    //             }
    //             break;
    //         case 'program':
    //         case 'extra':
    //         case 'clip':
    //         case 'episode':
    //             if(program.swipe_value && program.share_link) {
    //                 return `${program.share_link}`;
    //             }
    //             break;
    //         case 'catchup':
    //             if(program.swipe_value && program.channel && program.catchup_date) {
    //                 const title = program.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')
    //                 return `/tv/${program.channel}/${program.swipe_value}/${title}?date=${program.catchup_date}`
    //             }
    //             break;
    //         case 'live_event':
    //             if (program.swipe_value) {
    //                 return `/live-event/${program.swipe_value}/${program.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')}`
    //             }
    //             break;
    //         case 'program':
    //             return `/programs/${program.swipe_value}/${program.title.replace(/ +/g, '-')}`;
    //         default:
    //             return "/"
    //     }        
    // }

    // loadMore = () => {
    //     if (!this.state.loading && !this.state.endpage) {
    //         let page = this.state.page + 1;
	// 		this.setState({ loading: true }, () => {
    //             this.props.loadingBar && this.props.loadingBar.continuousStart();
                
    //             if (this.props.homepage) {  
    //                 this.props.getStories(page, this.state.length)
    //                 .then(() => {
    //                 const buildedStories = [];
    //                 const newStories = this.props.stories.data;

    //                     for (const story of newStories) {
    //                         buildedStories.push(this.buildTimeline(story));

    //                         if (story.gpt.length >= 1) {
    //                             buildedStories.push(this.buildStoryGPT(story.gpt));
    //                         }
    //                     }

    //                     const seen = [];
    //                     const notseen = [];

    //                     // for (const story of this.state.stories) {
    //                     //     if (story.seen) {
    //                     //         seen.push({...story});
    //                     //     } else {
    //                     //         notseen.push({...story});
    //                     //     }
    //                     // } 

    //                     for (let i = 0; i < this.state.stories.length; i++) {
    //                         const story = {...this.state.stories[i]};
    //                         console.log(`ini data story`, story)
    //                         if (story.name.includes('ads')) {
    //                             const [str, storyParentId] = story.name.split('_');
    //                             if (this.state.stories[storyParentId].seen) {
    //                                 story.seen = true;
    //                             }
    //                         }
    //                         if (story.seen) {
    //                             seen.push({...story});
    //                         } else {
    //                             notseen.push({...story});
    //                         }
    //                     }

    //                     const storiesData = [...notseen, ...buildedStories, ...seen];
    //                     let currentLength = this.state.totalLength + this.props.stories.data.length;

    //                     this.setState({ totalLength: currentLength, stories: storiesData, loading: false, page: page, endpage: this.props.stories.data.length < this.state.length });
    //                     this.props.loadingBar && this.props.loadingBar.complete();
    //                 })
    //                 .catch(error => {
    //                     console.log(error);
    //                     this.setState({ loading: false, endpage: true });
    //                     this.props.loadingBar && this.props.loadingBar.complete();
    //                 });
    //             } else if (this.props.detailCategory) {
    //                 console.log(`ini dariii category`, this.props.detailCategory)
    //                 this.props.getStoriesCategory(page, this.state.length, this.props.id)
    //                 .then(() => {
    //                     const buildedStories = [];
    //                     const newStories = this.props.stories.data;

    //                     for (const story of newStories) {
    //                         buildedStories.push(this.buildTimeline(story));

    //                         if (story.gpt.length >= 1) {
    //                             buildedStories.push(this.buildStoryGPT(story.gpt));
    //                         }
    //                     }

    //                     const seen = [];
    //                     const notseen = [];

    //                     for (let i = 0; i < this.state.stories.length; i++) {
    //                         const story = {...this.state.stories[i]};
    //                         if (story.name.includes('ads')) {
    //                             const [str, storyParentId] = story.name.split('_');
    //                             if (this.state.stories[storyParentId].seen) {
    //                                 story.seen = true;
    //                             }
    //                         }
    //                         if (story.seen) {
    //                             seen.push({...story});
    //                         } else {
    //                             notseen.push({...story});
    //                         }
    //                     }

    //                     const storiesData = [...notseen, ...buildedStories, ...seen];
    //                     let currentLength = this.state.totalLength + this.props.stories.data.length;

    //                     this.setState({ totalLength: currentLength, stories: storiesData, loading: false, page: page, endpage: this.props.stories.data.length < this.state.length });
    //                     this.props.loadingBar && this.props.loadingBar.complete();
    //                 })
    //                 .catch(error => {
    //                     console.log(error);
    //                     this.setState({ loading: false, endpage: true });
    //                     this.props.loadingBar && this.props.loadingBar.complete();
    //                 });
    //             }
    //         });
    //     }
    // }

    // render() {
      
        // const timelineItems = []
        // this.state.stories.forEach((story, storyId) => {
        //     const storyItems = [];
        //     story.items.forEach((storyItem) => {
        //         storyItems.push(
        //             <li key={storyItem.id} data-id={storyItem.id} data-time={storyItem.time} className={(storyItem.seen ? 'seen' : '')}>
        //                 <a href={storyItem.src} data-type={storyItem.type} data-length={storyItem.length} data-link={storyItem.link} data-linktext={storyItem.linkText} data-title={storyItem.title}>
        //                     { storyItem.type != 'ads'
        //                         ? <img src={storyItem.preview} />
        //                         : <div />
        //                     }
        //                 </a>
        //             </li>
        //         );
        //     });

        //     //let arrayFunc = story.seen ? 'push' : 'unshift';
        //     timelineItems.push(
        //         <div className={(story.seen ? `story${story.name.includes('ads') ? ' ads' : ''} seen` : `story${story.name.includes('ads') ? ' ads' : ''}`)} key={story.id} data-id={story.id} data-last-updated={story.lastUpdated} data-photo={story.photo}>
        //             <a className="item-link" href={story.link}>
        //                 <span className="item-preview">
        //                     <img src={story.photo} />
        //                 </span>
        //                 <span className="info" itemProp="author" itemScope="" itemType="http://schema.org/Person">
        //                     <strong className="name" itemProp="name">{story.name}</strong>
        //                     <span className="time">{story.lastUpdated}</span>
        //                 </span>
        //             </a>

        //             <ul className="items">
        //                 {storyItems}
        //             </ul>
        //         </div>
        //     );
            
        // });

        return (
            null
            // <div style={{paddingTop: 35}} >
            //     <Head>
            //         <script src="/static/js/dash.js"></script>
            //         <link rel="stylesheet" href="static/css/zuck.css?v=2" />
            //         <link rel="stylesheet" href="static/css/snapgram.css?v=2" />
            //     </Head>
            //     {/* <BottomScrollListener onBottom={this.loadMore.bind(this)}>
            //         {scrollRef => (
            //             <div ref={scrollRef} id="stories-react" className="storiesWrapper">
            //                 {timelineItems}
            //             </div>
            //         )}
            //     </BottomScrollListener> */}
            //     <div style={{paddingLeft: "14px"}} ref={node => this.storiesElement = node} id="stories-react" className="storiesWrapper">
            //         {timelineItems}
            //     </div>
            // </div>
        );
    // }
}

export default connect(state => state, storiesActions)(homeStories);

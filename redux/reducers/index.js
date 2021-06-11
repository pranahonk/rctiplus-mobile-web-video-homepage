import { combineReducers } from 'redux';
import authReducer from './authReducer';
import contentReducer from './contentReducers';
import storiesReducer from './storiesReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import bookmarkReducer from './bookmarkReducer';
import historyReducer from './historyReducer';
import searchReducer from './searchReducer';
import quizReducer from './quizReducer';
import liveAndChatReducer from './liveAndChatReducer';
import notificationReducer from './notificationReducer';
import feedReducer from './feedReducer';
import likeReducer from './likeReducer';
import othersReducer from './othersReducer';
import playerReducer from './playerReducer';
import pageReducer from './pageReducer';
import adsReducer from './adsReducer';
import Program from './program-detail/programDetailReducer';
import homeCategory from "./homeCategoryReducer"

import trendingSubCategory from './trending/subCategory';
import trendingContent from './trending/content';
//import trendingContent from './trending/content';

import newsv2Reducer from './newsv2Reducer';
import miniPlayerReducer from './miniplayerReducers';

const rootReducer = combineReducers({
    authentication: authReducer,
    contents: contentReducer,
    stories: storiesReducer,
    registration: registerReducer,
    user: userReducer,
    bookmarks: bookmarkReducer,
    histories: historyReducer,
    searches: searchReducer,
    quizzes: quizReducer,
    chats: liveAndChatReducer,
    live_event: liveAndChatReducer,
    notification: notificationReducer,
    feeds: feedReducer,
    likes: likeReducer,
    others: othersReducer,
    players: playerReducer,
    pages: pageReducer,
    trending_sub_category: trendingSubCategory,
    trending_content: trendingContent,
    newsv2: newsv2Reducer,
    ads: adsReducer,
    Program: Program,
    homeCategory : homeCategory,
    miniplayer: miniPlayerReducer,
});

export default rootReducer;
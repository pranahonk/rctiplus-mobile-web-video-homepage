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
    notification: notificationReducer
});

export default rootReducer;
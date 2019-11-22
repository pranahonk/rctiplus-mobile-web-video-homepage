import { combineReducers } from 'redux';
import authReducer from './authReducer';
import contentReducer from './contentReducers';
import storiesReducer from './storiesReducer';
import registerReducer from './registerReducer';

const rootReducer = combineReducers({
    authentication: authReducer,
    contents: contentReducer,
    stories: storiesReducer,
    register: registerReducer
});

export default rootReducer;
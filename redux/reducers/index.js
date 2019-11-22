import { combineReducers } from 'redux';
import authReducer from './authReducer';
import contentReducer from './contentReducers';

const rootReducer = combineReducers({
    authentication: authReducer,
    contents: contentReducer
});

export default rootReducer;
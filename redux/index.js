import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';
import throttle from 'lodash/throttle';

import { loadState, saveState } from '../utils/localStorage';

// const persistedState = loadState();

const initStore = (initialState = {}) => {
    return createStore(reducer, initialState, applyMiddleware(thunk/*, logger*/));
};


// const initStore = (initialState = {}) => {
//     const store = createStore(
//             reducer, 
//             initialState, 
//             applyMiddleware(thunk, logger),
//             )
//     store.subscribe(throttle(
//         () => {
//             saveState({
//                 authentication: store.getState().authentication,
//             });
//         }
//     ), 1000)
//     return store;
// };

export default initStore;
import { AUTHENTICATE, DEAUTHENTICATE, USER, WRONG_AUTHENTICATION } from '../types';

const initialState = {
    token: null,
    user: null,
    data: null,
    message: null,
    code: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return Object.assign({}, state, { token: action.token, data: action.data });
        case USER:
            return Object.assign({}, state, { user: action.payload });
        case DEAUTHENTICATE:
            return { token: null };
        case WRONG_AUTHENTICATION:
            return Object.assign({}, state, { message: action.message, code: action.code });
        default:
            return state;
    }
};
import { AUTHENTICATE, DEAUTHENTICATE, USER, WRONG_AUTHENTICATION } from '../types';

const initialState = {
    token: null,
    user: null,
    data: null,
    message: null,
    code: null,
    device_id: null
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
        case 'SET_DEVICE_ID':
            return Object.assign({}, state, { device_id: action.device_id });
        default:
            return state;
    }
};
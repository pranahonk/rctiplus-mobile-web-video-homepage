const initialState = {
    data: null,
    meta: null,
    status: null,
    catchup_date: "",
    catchup: [],
    channel_code: 'rcti'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'POST_CHAT':
        case 'GET_LIVE_EVENT':
        case 'GET_MISSED_EVENT':
            return Object.assign({}, state, {
                status: action.status,
                data: action.data,
                meta: action.meta,
            });
        case 'GET_LIVE_EVENT_DETAIL':
        case 'GET_LIVE_EVENT_URL':
        case 'GET_LIVE_QUIZ':
        case 'GET_LIVE_QUIZ_URL':
        case 'GET_EPG':
            return Object.assign({}, state, { 
                status: action.status, 
                data: action.data, 
                meta: action.meta
            });
        case 'GET_CATCHUP_URL':
            return Object.assign({}, state, { 
                status: action.status, 
                data: action.data, 
                meta: action.meta 
            });
        case 'GET_CHAT_BLOCK':
            return Object.assign({}, state, {
                status: action.status,
                data: action.data,
            });
        case 'SET_CATCHUP_DATE':
            return Object.assign({}, state, { catchup_date: action.date });
        case 'SET_CHANNEL_CODE':
            return Object.assign({}, state, { channel_code: action.channel_code });
        case 'SET_CATCHUP_DATA':
            return Object.assign({}, state, { catchup: action.catchup.length > 0 ? action.catchup : [] });
        default:
            return state;
    }
};
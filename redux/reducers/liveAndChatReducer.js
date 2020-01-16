const initialState = {
    data: null,
    meta: null,
    status: null,
    catchup_date: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'POST_CHAT':
        case 'GET_LIVE_EVENT':
        case 'GET_LIVE_EVENT_DETAIL':
        case 'GET_LIVE_EVENT_URL':
        case 'GET_LIVE_QUIZ':
        case 'GET_LIVE_QUIZ_URL':
        case 'GET_EPG':
        case 'GET_CATCHUP_URL':
            return Object.assign({}, state, { 
                status: action.status, 
                data: action.data, 
                meta: action.meta 
            });
        case 'SET_CATCHUP_DATE':
            return Object.assign({}, state, { catchup_date: action.date });
        default:
            return state;
    }
};
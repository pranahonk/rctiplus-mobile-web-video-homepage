const initialState = {
    data: null,
    meta: null,
    status: null,
    show_more_allowed: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH':
        case 'SEARCH_BY_GENRE':
        case 'GET_RECOMMENDATION':
        case 'GET_RELATED_PROGRAM':
            return Object.assign({}, state, { 
                data: action.data, 
                meta: action.meta, 
                status: action.status
            });
        case 'SET_SHOW_MORE_ALLOWED':
            return Object.assign({}, state, { show_more_allowed: action.allowed });
        default:
            return state;
    }
};
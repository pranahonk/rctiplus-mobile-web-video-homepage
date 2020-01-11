const initialState = {
    data: null,
    meta: null,
    status: null,
    show_more_allowed: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'MY_LIST':
        case 'BOOKMARK':
        case 'DELETE_BOOKMARK':
        case 'GET_BOOKMARKS':
        case 'GET_BOOKMARK':
        case 'GET_LIST_BOOKMARK':
        case 'GET_LIST_BOOKMARK_BY_ID':
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
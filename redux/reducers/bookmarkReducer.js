const initialState = {
    data: null,
    meta: null,
    status: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'MY_LIST':
        case 'BOOKMARK':
        case 'GET_BOOKMARKS':
        case 'GET_BOOKMARK':
        case 'GET_LIST_BOOKMARK':
        case 'GET_LIST_BOOKMARK_BY_ID':
            return Object.assign({}, state, { 
                data: action.data, 
                meta: action.meta, 
                status: action.status
            });
        default:
            return state;
    }
};
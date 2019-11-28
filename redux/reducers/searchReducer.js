const initialState = {
    data: null,
    meta: null,
    status: null
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
        default:
            return state;
    }
};
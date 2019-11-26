const initialState = {
    data: null,
    meta: null,
    status: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'USER_HISTORY':
        case 'POST_HISTORY':
        case 'DELETE_HISTORY':
        case 'CONTINUE_WATCHING':
        case 'CONTINUE_WATCHING_BY_CONTENT_ID':
        case 'DELETE_CONTINUE_WATCHING_BY_CONTENT_ID':
            return Object.assign({}, state, { 
                data: action.data, 
                meta: action.meta, 
                status: action.status
            });
        default:
            return state;
    }
};
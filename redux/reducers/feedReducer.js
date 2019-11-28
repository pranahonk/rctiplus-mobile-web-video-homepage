const initialState = {
    data: null,
    meta: null,
    status: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_FEEDS':
        case 'GET_EXCLUSIVES':
        case 'GET_EXCLUSIVE_CATEGORY':
            return Object.assign({}, state, { 
                data: action.data, 
                meta: action.meta, 
                status: action.status
            });
        default:
            return state;
    }
};
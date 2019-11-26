const initialState = {
    data: null,
    meta: null,
    status: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PROFILE':
            return Object.assign({}, state, { status: action.status });
        case 'USER_DATA':
            return Object.assign({}, state, { data: action.data, meta: action.meta });
        default:
            return state;
    }
};
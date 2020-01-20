const initialState = {
    data: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TRENDING_CONTENT':
            return Object.assign({}, state, { data: action.data });
        default:
            return state;
    }
};
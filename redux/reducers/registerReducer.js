const initialState = {
    data: null,
    meta: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER':
            return Object.assign({}, state, { data: action.data, meta: action.meta });
        default:
            return state;
    }
};
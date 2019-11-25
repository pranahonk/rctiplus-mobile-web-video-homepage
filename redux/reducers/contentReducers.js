const initialState = {
    homepage_content: null,
    banner: null,
    meta: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'HOMEPAGE_CONTENT':
            return Object.assign({}, state, { homepage_content: action.data, meta: action.meta });
        case 'BANNER':
            return Object.assign({}, state, { banner: action.data, meta: action.meta });
        default:
            return state;
    }
};
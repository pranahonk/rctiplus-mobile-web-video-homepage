const initialState = {
    homepage_content: null,
    meta: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'HOMEPAGE_CONTENT':
            return Object.assign({}, state, { homepage_content: action.data, meta: action.meta });
        default:
            return state;
    }
};
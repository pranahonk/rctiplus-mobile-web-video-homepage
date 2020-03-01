const initialState = {
    loading: false,
    fade: false,
    hide_footer: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PAGE_LOADER':
            return Object.assign({}, state, { loading: true });
        case 'UNSET_PAGE_LOADER':
            return Object.assign({}, state, { loading: false });
        case 'FADE':
            return Object.assign({}, state, { fade: action.fade });
        case 'TOGGLE_FOOTER':
            return Object.assign({}, state, { hide_footer: action.state });
        default:
            return state;
    }
};
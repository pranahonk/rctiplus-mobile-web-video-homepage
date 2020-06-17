const initialState = {
    ads_displayed: true,
    toggleAdsTrending: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_ADS':
            return Object.assign({}, state, { ads_displayed: action.flag, toggleAdsTrending: action.toggle });
        default:
            return state;
    }
};
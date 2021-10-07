const initialState = {
    ads_displayed: true,
    toggleAdsTrending: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_ADS':
            return Object.assign({}, state, { ads_displayed: action.flag, toggleAdsTrending: action.toggle });
        case 'ADS_CUSTOM_PARAMS':
            return {...state, data_ta: action.payload};
        default:
            return state;
    }
};
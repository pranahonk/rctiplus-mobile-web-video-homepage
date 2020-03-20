const initialState = {
    ads_displayed: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_ADS':
            return Object.assign({}, state, { ads_displayed: action.flag });
        default:
            return state;
    }
};
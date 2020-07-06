export const toggleSwitchAds = () => {
    return (dispatch) => {
        dispatch({
            type: 'TOGGLE_SWITCH_ADS',
        })
    }
}
const toggleAds = (flag) => {
    return dispatch => dispatch({
        type: 'TOGGLE_ADS',
        flag: flag
    });
};

export default {
    toggleAds
};
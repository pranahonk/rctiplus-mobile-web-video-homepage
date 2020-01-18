const setPageLoader = () => {
    return dispatch => {
        dispatch({ type: 'FADE', fade: false });
        return dispatch({ type: 'SET_PAGE_LOADER' });
    };
};

const unsetPageLoader = () => {
    return dispatch => {
        dispatch({ type: 'FADE', fade: true });
        setTimeout(() => {
            dispatch({ type: 'UNSET_PAGE_LOADER' });
        }, 300);
    };
};

export default {
    setPageLoader,
    unsetPageLoader
};
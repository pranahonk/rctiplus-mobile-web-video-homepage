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

const toggleFooter = (state) => {
    return dispatch => dispatch({
        type: 'TOGGLE_FOOTER',
        state: state
    });
};

const toggleNavbar = (state) => {
    return dispatch => dispatch({
        type: 'TOGGLE_NAVBAR',
        state: state
    });
};

const setSeamlessLoad = (state) => {
    return dispatch => dispatch({
        type: 'SET_SEAMLESS_LOAD',
        status: state,
    });
};
const unsetSeamlessLoad = () => {
    return dispatch => dispatch({
        type: 'UNSET_SEAMLESS_LOAD',
        status: true,
    });
};

export default {
    setPageLoader,
    unsetPageLoader,
    toggleFooter,
    toggleNavbar,
    setSeamlessLoad,
    unsetSeamlessLoad
};
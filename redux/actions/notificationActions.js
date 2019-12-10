const showNotification = (content, success = true) => {
    return dispatch => {
        dispatch({
            type: 'SHOW_NOTIFICATION',
            content: content,
            show: true,
            success: success,
            size: content.length <= 60 ? 'small' : 'medium'
        });
    };
};

const hideNotification = () => {
    return dispatch => {
        dispatch({
            type: 'HIDE_NOTIFICATION',
            show: false
        });
    };
};

export default {
    showNotification,
    hideNotification
};
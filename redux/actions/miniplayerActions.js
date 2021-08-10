const setVideoLastDuration = payload => {
    return dispatch => dispatch({
        type: 'SET_VIDEO_LAST_DURATION',
        payload
    })
}

export default {
  setVideoLastDuration
}


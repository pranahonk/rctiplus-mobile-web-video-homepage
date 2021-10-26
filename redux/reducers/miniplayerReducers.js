const initialState = {
  lastVideoDuration: 0
}

export default function miniPlayerReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_VIDEO_LAST_DURATION':
      localStorage.setItem("miniplayer_last_duration", action.payload)
      return {
        ...state,
        lastVideoDuration: action.payload
      }
    default:
      return state
  }
}
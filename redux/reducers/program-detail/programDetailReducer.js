import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_EPISODE_SUCCESS,
  FETCH_SEASON_SUCCESS,
  SEASON_SELECTED,
  FETCH_RELATED_PROGRAM_SUCCESS,
  FETCH_EXTRA_SUCCESS,
  FETCH_CLIP_SUCCESS,
  FETCH_PHOTO_SUCCESS,
  CLEAR_CLIP,
  CLEAR_EXTRA,
  EPISODE_FAILURE,
  FETCH_PLAYER_URL_SUCCESS,
  CLEAR_PLAYER,
  FETCH_EPISODE_REQUEST,
  FETCH_EXTRA_REQUEST,
  FETCH_CLIP_REQUEST,
  FETCH_PHOTO_REQUEST,
  MORE_REQUEST,
  FETCH_BOOKMARK_SUCCESS,
  FETCH_POST_BOOKMARK_SUCCESS,
} from '../../actions/program-detail/programDetail';
const initialState = {
  loading: true,
  loading_episode: true,
  loading_extra: true,
  loading_clip: true,
  loading_photo: true,
  loading_more: false,
  error: '',
  filter: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_EPISODE_REQUEST:
      return {
        ...state,
        loading_episode: true,
      };
    case FETCH_EXTRA_REQUEST:
      return {
        ...state,
        loading_extra: true,
      };
    case FETCH_CLIP_REQUEST:
      return {
        ...state,
        loading_clip: true,
      };
    case FETCH_PHOTO_REQUEST:
      return {
        ...state,
        loading_photo: true,
      };
    case MORE_REQUEST:
      return {
        ...state,
        loading_more: true,
      };
    case FETCH_FAILURE:
      return {
        ...state,
          loading: false,
          error: action.payload,
      };
    case EPISODE_FAILURE:
      return {
        ...state,
          loading_episode: false,
          error_episode: action.payload,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    case FETCH_SEASON_SUCCESS:
      return {
        ...state,
        season: action.payload,
        loading: false,
      };
    case SEASON_SELECTED:
      return {
        ...state,
        seasonSelected: action.payload,
        loading: false,
      };
    case CLEAR_CLIP:
      return {
        ...state,
        [action.filter]: null,
        loading: false,
      };
    case CLEAR_EXTRA:
      return {
        ...state,
        [action.filter]: null,
        loading: false,
      };
    case CLEAR_PLAYER:
      return {
        ...state,
        [action.filter]: null,
        loading: false,
      };
    case FETCH_EXTRA_SUCCESS:
      const initPageExtra = action && action.payload.meta.pagination.current_page;
      if (initPageExtra > 1) {
        const initStateExtra = state[action.filter].data;
        const newStateExtra = action.payload.data;
        const dataExtra = [...initStateExtra, ...newStateExtra];
        return {
          ...state,
          [action.filter]: {...action.payload, data: dataExtra},
          loading: false,
          loading_extra: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
        loading_extra: false,
      };
    case FETCH_CLIP_SUCCESS:
      const initPageClip = action && action.payload.meta.pagination.current_page;
      if (initPageClip > 1) {
        const initStateClip = state[action.filter].data;
        const newStateClip = action.payload.data;
        const dataClip = [...initStateClip, ...newStateClip];
        return {
          ...state,
          [action.filter]: {...action.payload, data: dataClip},
          loading: false,
          loading_clip: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
        loading_clip: false,
      };
    case FETCH_PHOTO_SUCCESS:
      const initPagePhoto = action && action.payload.meta.pagination.current_page;
      if (initPagePhoto > 1) {
        const initStatePhoto = state[action.filter].data;
        const newStatePhoto = action.payload.data;
        const dataPhoto = [...initStatePhoto, ...newStatePhoto];
        return {
          ...state,
          [action.filter]: {...action.payload, data: dataPhoto},
          loading: false,
          loading_photo: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
        loading_photo: false,
      };
    case FETCH_RELATED_PROGRAM_SUCCESS:
      const initPageRelated = action && action.payload.meta.pagination.current_page;
      if (initPageRelated > 1) {
        const initStateRelated = state[action.filter].data;
        const newStateRelated = action.payload.data;
        const dataRelated = [...initStateRelated, ...newStateRelated];
        return {
          ...state,
          [action.filter]: {...action.payload, data: dataRelated},
          loading: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    case FETCH_EPISODE_SUCCESS:
      const initPage = action && action.payload.meta.pagination.current_page;
      if (initPage > 1) {
        const initState = state &&
                          state['program-episode'] &&
                          state['program-episode']['season-' + action.filter[1]];
                          state['program-episode']['season-' + action.filter[1]] .data;
        let clone = {};
        clone = {...initState};
        clone = clone.data;
        const newState = action.payload.data;
        const data = [...clone, ...newState];
        return {
          ...state,
          [action.filter[0]]: {...state[action.filter[0]], ['season-' + action.filter[1]] : {...action.payload, data}},
          loading: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter[0]]: {...state[action.filter[0]], ['season-' + action.filter[1]] : {...action.payload}},
        selectedSeason: 'season-' + action.filter[1],
        loading: false,
        loading_episode: false,
      };
    case FETCH_PLAYER_URL_SUCCESS:
      console.log('STATE URL:', action)
      return {
        ...state,
        [action.filter[0]]:{...action.payload, isFullscreen: action.isFullscreen},
        loading: false,
        update_player: true,
      };
    case FETCH_BOOKMARK_SUCCESS:
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    case FETCH_POST_BOOKMARK_SUCCESS:
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

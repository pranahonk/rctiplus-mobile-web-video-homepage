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
  FETCH_DELETE_BOOKMARK_SUCCESS,
  FETCH_LIKE_SUCCESS,
  FETCH_POST_LIKE_SUCCESS,
  FETCH_DETAIL_DESCRIPTION_SUCCESS,
  TEMP_POST_LIKE_SUCCESS,
  DATA_SHARE_SEO,
  FETCH_PAID_VIDEO,
  FETCH_RECOMMEND_HOT_SUCCESS
} from '../../actions/program-detail/programDetail';
const initialState = {
  loading: true,
  loading_episode: true,
  loading_extra: true,
  loading_clip: true,
  loading_photo: true,
  loading_more: false,
  paid_video: null,
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
        programDetail: action.payload,
        loading: false,
      };
    case FETCH_PAID_VIDEO:
      return {
        ...state,
        paid_video: action.payload,
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
    case FETCH_EXTRA_SUCCESS: {
      const page = action && action.payload.meta.pagination.current_page;
      if (page > 1) {
        const currentEntries = state[action.filter].data

        // Find and overwrite intermittent data duplicates
        const uniqueEntries = new Map()
        Array.from([ ...currentEntries, ...action.payload.data ])
          .forEach(entry => uniqueEntries.set(entry.id, entry))

        return {
          ...state,
          loading: false,
          loading_extra: false,
          loading_more: false,
          [action.filter]: { 
            ...action.payload,
            data: [ ...uniqueEntries.values() ]
          },
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
        loading_extra: false,
      }
    }
    case FETCH_CLIP_SUCCESS: {
      const page = action && action.payload.meta.pagination.current_page;
      if (page > 1) {
        const currentEntries = state[action.filter].data;

        // Find and overwrite intermittent data duplicates
        const uniqueEntries = new Map()
        Array.from([ ...currentEntries, ...action.payload.data])
          .forEach(entry => uniqueEntries.set(entry.id, entry))

        return {
          ...state,
          loading: false,
          loading_clip: false,
          loading_more: false,
          [action.filter]: {
            ...action.payload,
            data: [ ...uniqueEntries.values() ]
          },
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
        loading_clip: false,
      };
    }
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
    case FETCH_EPISODE_SUCCESS: {
      const page = action && action.payload.meta.pagination.current_page;
      if (page > 1) {

        if (!state["program-episode"]) state["program-episode"] = {
          [`season-${action.filter[1]}`]: {data: []}
        }
        const currentEntries = state['program-episode'][`season-${action.filter[1]}`]
        
        // Find and overwrite intermittent data duplicates
        const uniqueEntries = new Map()
        Array.from([ ...currentEntries.data, ...action.payload.data ])
          .forEach(entry => uniqueEntries.set(entry.id, entry))

        return {
          ...state,
          loading: false,
          loading_more: false,
          loading_episode: false,
          [action.filter[0]]: { 
            ...state[action.filter[0]],
            ['season-' + action.filter[1]]: { 
              ...action.payload,
              data: [ ...uniqueEntries.values() ]
            }
          },
        };
      }
      return {
        ...state,
        [action.filter[0]]: {
          ...state[action.filter[0]], 
          ['season-' + action.filter[1]] : {
            ...action.payload
          }
        },
        selectedSeason: 'season-' + action.filter[1],
        loading: false,
        loading_episode: false,
      }
    }
    case FETCH_RECOMMEND_HOT_SUCCESS:
      const initPageRecommendHOT = action && action.payload.meta.pagination.current_page;
      
      if (initPageRecommendHOT > 1) {
        const initStateRecommendHOT = state[action.filter].data;
        const newStateRecommendHOT = action.payload.data;
        const dataRecommendHOT = [...initStateRecommendHOT, ...newStateRecommendHOT];
        return {
          ...state,
          [action.filter]: {...action.payload, data: dataRecommendHOT},
          loading: false,
          loading_more: false,
        };
      }
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    case FETCH_PLAYER_URL_SUCCESS:
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
      if(state && state.bookmark.data) {
        const initStateBookmark = state && state.bookmark.data
        const newStateBookmark = action.payload
        const dataBookmark = [...initStateBookmark[action.filter[1]], newStateBookmark]
        const combine = {...initStateBookmark, [action.filter[1]]: dataBookmark}
        return {
          ...state,
          [action.filter[0]]: { ...state.bookmark, data: combine },
          loading: false,
        };
      } 
      return {
        ...state,
        [action.filter[0]]: {data: { [action.filter[1]] : [action.payload] }},
        loading: false,
      }
    case FETCH_DELETE_BOOKMARK_SUCCESS:
      const initStateBookmark = state && state.bookmark.data
      const newStateBookmark = action.payload
      const dataBookmark = [...initStateBookmark[action.filter[1]], newStateBookmark]
      const resultBookmark = dataBookmark.filter((item) => { 
        return (item.id !== action.payload.id) 
      })
      const combine = {...initStateBookmark, [action.filter[1]]: resultBookmark}
      return {
        ...state,
        [action.filter[0]]: { ...state.bookmark, data: combine },
        loading: false,
      };
    case FETCH_LIKE_SUCCESS:
      return {
        ...state,
        [action.filter]: action.payload ,
        loading: false,
      };
    case FETCH_POST_LIKE_SUCCESS:
      return {
        ...state,
        [action.filter]: {...state.like, data: [action.payload]},
        loading: false,
      };
    case FETCH_POST_LIKE_SUCCESS:
      return {
        ...state,
        [action.filter]: {...state.like, data: [action.payload]},
        loading: false,
      };
    case FETCH_DETAIL_DESCRIPTION_SUCCESS:
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    case DATA_SHARE_SEO:
      return {
        ...state,
        [action.filter]: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

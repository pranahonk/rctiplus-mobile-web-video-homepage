import ax from 'axios';
import { DEV_API, VISITOR_TOKEN } from '../../../config';
import { getCookie, getVisitorToken, checkToken, setCookie } from '../../../utils/cookie';
import { getUidAppier } from '../../../utils/appier';

const axios = ax.create({ baseURL: DEV_API + '/api' });
const axiosHOT = ax.create({ baseURL: DEV_API + '/ugc-vote/api' });

axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken === undefined ? getVisitorToken() : accessToken;
  return request;
});

axiosHOT.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken === undefined ? getVisitorToken() : accessToken;
  return request;
});

export const fetchDetailProgramRequest = () => {
  return {
    type: FETCH_REQUEST,
  };
};
const fetchDetailProgramFailure = (errorMessage) => {
  return {
    type: FETCH_FAILURE,
    payload: errorMessage,
  };
};
const episodeRequest = () => {
  return {
    type: FETCH_EPISODE_REQUEST,
  };
};
const extraRequest = () => {
  return {
    type: FETCH_EXTRA_REQUEST,
  };
};
const clipRequest = () => {
  return {
    type: FETCH_CLIP_REQUEST,
  };
};
const photoRequest = () => {
  return {
    type: FETCH_PHOTO_REQUEST,
  };
};
const moreRequest = () => {
  return {
    type: MORE_REQUEST,
  };
};
const episodeFailure = (errorMessage) => {
  return {
    type: EPISODE_FAILURE,
    payload: errorMessage,
  };
};
const fetchDetailProgramSuccess = (detailProgram, filter) => {
  return {
    type: FETCH_SUCCESS,
    filter: filter,
    payload: detailProgram,
  };
};
const fetchBookmarkSuccess = (bookmark, filter) => {
  return {
    type: FETCH_BOOKMARK_SUCCESS,
    filter: filter,
    payload: bookmark,
  };
};
const fetchPostBookmarkSuccess = (bookmark, filter) => {
  return {
    type: FETCH_POST_BOOKMARK_SUCCESS,
    filter: filter,
    payload: bookmark,
  };
};
const fetchDeleteBookmarkSuccess = (bookmark, filter) => {
  return {
    type: FETCH_DELETE_BOOKMARK_SUCCESS,
    filter: filter,
    payload: bookmark,
  };
};
const fetchLikeSuccess = (like, filter) => {
  return {
    type: FETCH_LIKE_SUCCESS,
    filter: filter,
    payload: like,
  };
};
const fetchPostLikeSuccess = (like, filter) => {
  return {
    type: FETCH_POST_LIKE_SUCCESS,
    filter: filter,
    payload: like,
  };
};
const tempLikePost = (like, filter) => {
  return {
    type: TEMP_POST_LIKE_SUCCESS,
    filter: filter,
    payload: like,
  };
};
const fetchRelatedProgramSuccess = (related, filter) => {
  return {
    type: FETCH_RELATED_PROGRAM_SUCCESS,
    filter: filter,
    payload: related,
  };
};
const fetchRecommendHOTSuccess = (payload, filter) => {
  return {
    type: FETCH_RECOMMEND_HOT_SUCCESS,
    filter,
    payload,
  };
};
const fetchSeasonEpisodeSuccess = (season, filter) => {
  return {
    type: FETCH_SEASON_SUCCESS,
    filter: filter,
    payload: season,
  };
};
export const seasonSelected = (selected) => {
  return {
    type: SEASON_SELECTED,
    payload: selected,
  };
};
export const setClearClip = (filter) => {
  return {
    type: CLEAR_CLIP,
    filter: filter,
  };
};
export const setClearExtra = (filter) => {
  return {
    type: CLEAR_EXTRA,
    filter: filter,
  };
};
export const clearPlayer = (filter) => {
  return {
    type: CLEAR_PLAYER,
    filter: filter,
  };
};
const fetchDetailEpisodeSuccess = (episode, filter) => {
  return {
    type: FETCH_EPISODE_SUCCESS,
    filter: filter,
    payload: episode,
  };
};
const fetchPaidVideo = (data) => {
  return {
    type: FETCH_PAID_VIDEO,
    payload: data,
  };
};
const fetchExtraSuccess = (extra, filter) => {
  return {
    type: FETCH_EXTRA_SUCCESS,
    filter: filter,
    payload: extra,
  };
};
const fetchClipSuccess = (clip, filter) => {
  return {
    type: FETCH_CLIP_SUCCESS,
    filter: filter,
    payload: clip,
  };
};
const fetchPhotoSuccess = (clip, filter) => {
  return {
    type: FETCH_PHOTO_SUCCESS,
    filter: filter,
    payload: clip,
  };
};
const fetchPlayerUrlSuccess = (player, filter, isFullscreen) => {
  return {
    type: FETCH_PLAYER_URL_SUCCESS,
    filter: filter,
    payload: player,
    isFullscreen: isFullscreen,
  };
};
const fetchDetailDescSuccess = (desc, filter) => {
  return {
    type: FETCH_DETAIL_DESCRIPTION_SUCCESS,
    filter: filter,
    payload: desc,
  };
};
export const fetcFromServer = (params = {}) => {
  return {
    type: FETCH_SUCCESS,
    filter: params.filter,
    payload: new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`/v1/program/${params.id}/detail`);
        resolve(response);
      }
      catch (error) {
        reject(error);
      }
    }),
  };
};
export const fetchDetailProgram = (params = {}) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/program/${params.id}/detail`)
      .then(response => {
        const data = response.data;
        dispatch(fetchDetailProgramSuccess(data, params.filter));
      })
      .catch(error => {
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchRelatedProgram = (params = {}) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/related?id=${params.id}&page=${params.page}&length=${params.length}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchRelatedProgramSuccess(data, params.filter));
      })
      .catch(error => {
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchRecommendHOT = (params = {}) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axiosHOT.get(`/v1/recommendation/viqi-recommendation`)
      .then(response => {
        const data = response.data;
        dispatch(fetchRecommendHOTSuccess(data, params.filter));
      })
      .catch(error => {
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchSeasonEpisode = (programId, filter, season = 1, page = 1, length = 5, infos = 'id,program_id,title,portrait_image,landscape_image,summary,season,episode,duration') => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/program/${programId}/season`)
      .then(response => {
        const data = response.data;
        dispatch(fetchSeasonEpisodeSuccess(data, filter));
      })
      .catch(error => {
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchEpisode = (programId, filter, contentId = 0, season = 1, page = 0, length = 5, infos = 'id,program_id,title,portrait_image,landscape_image,summary,season,episode,duration') => {
  return function(dispatch) {
    if(page > 1) {
      dispatch(moreRequest());
    } else {
      dispatch(episodeRequest());
    }
    axios.get(`/v2/program/${programId}/episode?season=${season}&page=${page}&length=${length}&infos=${infos}&content_id=${contentId}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchDetailEpisodeSuccess(data, [filter, season]));
        if(data?.status?.code == 0){
          if(data?.meta?.pagination?.total === 1) {
            return axios.get(`v1/episode/${data?.data[0]?.id}/payment-detail`)
          }
        }
      })
      .then((response) => {
        const data = response?.data || null;
        dispatch(fetchPaidVideo(data))
      })
      .catch(error => {
        console.log(error);
        dispatch(episodeFailure(error.message));
      });
  };
};
export const fetchExtra = (programId, filter, page = 1, length = 5) => {
  return function(dispatch) {
    if(page > 1) {
      dispatch(moreRequest());
    } else {
      dispatch(extraRequest());
    }
    axios.get(`/v1/program/${programId}/extra?page=${page}&length=${length}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchExtraSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchClip = (programId, filter, page = 1, length = 5) => {
  return function(dispatch) {
    if(page > 1) {
      dispatch(moreRequest());
    } else {
      dispatch(clipRequest());
    }
    axios.get(`/v1/program/${programId}/clip?page=${page}&length=${length}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchClipSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchPhoto = (programId, filter, page = 1, length = 5) => {
  return function(dispatch) {
    if(page > 1) {
      dispatch(moreRequest());
    } else {
      dispatch(photoRequest());
    }
    axios.get(`/v1/program/${programId}/photo?page=${page}&length=${length}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchPhotoSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchPlayerUrl = (episodeId, filter, type, isFullscreen = false) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/${type}/${episodeId}/url?appierid=${getUidAppier()}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchPlayerUrlSuccess(data, [filter, type], isFullscreen));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchBookmark = (programId, filter) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/mylist/${programId}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchBookmarkSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const postBookmark = (id, type, filter) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.post(`/v1/bookmark`, { id: id, type: type })
      .then(response => {
        const data = { id: id, last_duration: 0, is_bookmark: 1 };
        dispatch(fetchPostBookmarkSuccess(data, [filter, type]));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const deleteBookmark = (id, type, filter) => {
  console.log(id, type, filter)
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.delete(`/v1/bookmark?id=${id}&type=${type}`)
      .then(response => {
        const data = { id: id, last_duration: 0, is_bookmark: 1 };
        dispatch(fetchDeleteBookmarkSuccess(data, [filter, type]));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchLike = (programId, filter, type = 'all', page = 1, length = 10) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/like?id=${programId}&type=${type}&page=${page}&length=${length}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchLikeSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const postLike = (id, type, filter, status = 'INDIFFERENT') => {
  return function(dispatch) {
    const data = { id: id, content_type: type, status: status };
    dispatch(tempLikePost(data, filter))
    dispatch(fetchDetailProgramRequest());
    axios.post(`/v1/like`, {
      id: id,
      type: type,
      status: status,
    })
      .then(response => {
        dispatch(fetchPostLikeSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};

export const fetchDetailDesc = (id, filter, contetType) => {
  return function(dispatch) {
    axios.get(`/v1/${contetType}/${id}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchDetailDescSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};

export const dataShareSeo = (data, filter) => {
  return {
    type: DATA_SHARE_SEO,
    filter: filter,
    payload: data,
  }
}



export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_FAILURE = 'FETCH_FAILURE';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_EPISODE_SUCCESS = 'FETCH_EPISODE_SUCCESS';
export const FETCH_EXTRA_SUCCESS = 'FETCH_EXTRA_SUCCESS';
export const FETCH_CLIP_SUCCESS = 'FETCH_CLIP_SUCCESS';
export const FETCH_PHOTO_SUCCESS = 'FETCH_PHOTO_SUCCESS';
export const FETCH_SEASON_SUCCESS = 'FETCH_SEASON_SUCCESS';
export const SEASON_SELECTED = 'SEASON_SELECTED';
export const FETCH_RELATED_PROGRAM_SUCCESS = 'FETCH_RELATED_PROGRAM_SUCCESS';
export const FETCH_RECOMMEND_HOT_SUCCESS = 'FETCH_RECOMMEND_HOT_SUCCESS';
export const CLEAR_CLIP = 'CLEAR_CLIP';
export const CLEAR_EXTRA = 'CLEAR_EXTRA';
export const EPISODE_FAILURE = 'EPISODE_FAILURE';
export const FETCH_PLAYER_URL_SUCCESS = 'FETCH_PLAYER_URL_SUCCESS';
export const CLEAR_PLAYER = 'CLEAR_PLAYER';
export const FETCH_EPISODE_REQUEST = 'FETCH_EPISODE_REQUEST';
export const FETCH_EXTRA_REQUEST = 'FETCH_EXTRA_REQUEST';
export const FETCH_CLIP_REQUEST = 'FETCH_CLIP_REQUEST';
export const FETCH_PHOTO_REQUEST = 'FETCH_PHOTO_REQUEST';
export const MORE_REQUEST = 'MORE_REQUEST';
export const FETCH_BOOKMARK_SUCCESS = 'FETCH_BOOKMARK_SUCCESS';
export const FETCH_POST_BOOKMARK_SUCCESS = 'FETCH_POST_BOOKMARK_SUCCESS';
export const FETCH_DELETE_BOOKMARK_SUCCESS = 'FETCH_DELETE_BOOKMARK_SUCCESS';
export const FETCH_LIKE_SUCCESS = 'FETCH_LIKE_SUCCESS';
export const FETCH_POST_LIKE_SUCCESS = 'FETCH_POST_LIKE_SUCCESS';
export const TEMP_POST_LIKE_SUCCESS = 'TEMP_POST_LIKE_SUCCESS';
export const FETCH_DETAIL_DESCRIPTION_SUCCESS = 'FETCH_DETAIL_DESCRIPTION_SUCCESS';
export const DATA_SHARE_SEO = 'DATA_SHARE_SEO';
export const FETCH_PAID_VIDEO = 'FETCH_PAID_VIDEO';

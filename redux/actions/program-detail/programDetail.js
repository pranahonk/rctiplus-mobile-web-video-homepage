import ax from 'axios';
import { DEV_API, VISITOR_TOKEN } from '../../../config';
import { getCookie, getVisitorToken, checkToken, setCookie } from '../../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers.Authorization = accessToken ? accessToken : VISITOR_TOKEN;
  return request;
});

const fetchDetailProgramRequest = () => {
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
const fetchRelatedProgramSuccess = (related, filter) => {
  return {
    type: FETCH_RELATED_PROGRAM_SUCCESS,
    filter: filter,
    payload: related,
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
const fetchEpisodeUrlSuccess = (clip, filter) => {
  return {
    type: FETCH_EPISODE_URL_SUCCESS,
    filter: filter,
    payload: clip,
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
export const fetchEpisode = (programId, filter, season = 1, page = 1, length = 5, infos = 'id,program_id,title,portrait_image,landscape_image,summary,season,episode,duration') => {
  return function(dispatch) {
    if(page > 1) {
      dispatch(moreRequest());
    } else {
      dispatch(episodeRequest());
    }
    axios.get(`/v1/program/${programId}/episode?season=${season}&page=${page}&length=${length}&infos=${infos}`)
      .then(response => {
        const data = response.data;
        dispatch(fetchDetailEpisodeSuccess(data, [filter, season]));
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
        console.log(response);
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
        console.log(response);
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
        console.log(response);
        const data = response.data;
        dispatch(fetchPhotoSuccess(data, filter));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};
export const fetchEpisodeUrl = (episodeId, filter, season) => {
  return function(dispatch) {
    dispatch(fetchDetailProgramRequest());
    axios.get(`/v1/episode/${episodeId}/url`)
      .then(response => {
        console.log(response);
        const data = response.data;
        dispatch(fetchEpisodeUrlSuccess(data, [filter, season]));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchDetailProgramFailure(error.message));
      });
  };
};



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
export const CLEAR_CLIP = 'CLEAR_CLIP';
export const CLEAR_EXTRA = 'CLEAR_EXTRA';
export const EPISODE_FAILURE = 'EPISODE_FAILURE';
export const FETCH_EPISODE_URL_SUCCESS = 'FETCH_EPISODE_URL_SUCCESS';
export const CLEAR_PLAYER = 'CLEAR_PLAYER';
export const FETCH_EPISODE_REQUEST = 'FETCH_EPISODE_REQUEST';
export const FETCH_EXTRA_REQUEST = 'FETCH_EXTRA_REQUEST';
export const FETCH_CLIP_REQUEST = 'FETCH_CLIP_REQUEST';
export const FETCH_PHOTO_REQUEST = 'FETCH_PHOTO_REQUEST';
export const MORE_REQUEST = 'MORE_REQUEST';

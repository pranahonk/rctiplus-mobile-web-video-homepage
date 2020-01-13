import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken } from '../../utils/cookie';
import { showSignInAlert } from '../../utils/helpers';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken ? accessToken : getVisitorToken()
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});

const getContents = (page = 1, length = 20, platform = 'mweb') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/homepage?platform=${platform}&page=${page}&length=${length}`);
            let contents = [];
            if (response.data.status.code === 0) {
                const data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    let content = {}
                    if (data[i].total_content > 0) {
                        try {
                            const res = await axios.get(`/v1/homepage/${data[i].id}/contents?platform=${platform}&page=${page}&length=${length}`);
                            if (res.data.status.code === 0) {
                                content = {
                                    content: res.data.data,
                                    ...data[i]
                                };
                                contents.push(content);
                            }
                            else if (res.data.status.code === 13) {
                                showSignInAlert(`Please <b>Sign In</b><br/>
                                Woops! Gonna sign in first!<br/>
                                Only a click away and you<br/>
                                can continue to enjoy<br/>
                                <b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true);
                            }
                        }
                        catch (e) {
                            content = { content: [], ...data[i] };
                            contents.push(content);
                        }
                    }
                }
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: response.data.meta });
            }
            else {
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: null });
            }

            resolve(response);
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const getHomepageContents = (id, platform = 'mweb', page = 1, length = 21) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/homepage/${id}/contents?platform=${platform}&page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_HOMEPAGE_CONTENTS',
                    data: response.data.data,
                    meta: response.data.meta,
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getBanner = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/banner?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({ type: 'BANNER', data: response.data.data, meta: response.data.meta });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (e) {
            reject(e);
        }
    });
};

const getEpisodeDetail = episodeId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/episode/${episodeId}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_EPISODE_DETAIL',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getEpisodeUrl = episodeId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/episode/${episodeId}/url`);
            if (response.data.status.code === 0) {
                // dispatch({
                //     type: 'GET_EPISODE_URL',
                //     data: response.data.data, 
                //     meta: response.data.meta, 
                //     status: response.data.status
                // });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getExtraDetail = extraId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/extra/${extraId}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_EXTRA_DETAIL',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getExtraUrl = extraId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/extra/${extraId}/url`);
            if (response.data.status.code === 0) {
                // dispatch({
                //     type: 'GET_EXTRA_URL',
                //     data: response.data.data, 
                //     meta: response.data.meta, 
                //     status: response.data.status
                // });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getClipDetail = clipId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/clip/${clipId}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_CLIP_ID',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getClipUrl = clipId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/clip/${clipId}/url`);
            if (response.data.status.code === 0) {
                // dispatch({
                //     type: 'GET_CLIP_URL',
                //     data: response.data.data, 
                //     meta: response.data.meta, 
                //     status: response.data.status
                // });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getPhotoDetail = (photoId, infos = 'id,program_id,title,summary,release_date,program_icon_image,photos') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/photo/${photoId}?infos=${infos}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PHOTO_DETAIL',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getProgramDetail = programId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/detail`);
            if (response.data.status.code === 0) {
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getProgramEpisodes = (programId, season = 1, page = 1, length = 5, infos = 'id,program_id,title,portrait_image,landscape_image,summary,season,episode,duration') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/episode?season=${season}&page=${page}&length=${length}&infos=${infos}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PROGRAM_EPISODES',
                    episodes: response.data.data,
                    current_page: page + 1,
                    selected_season: season
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getProgramSeason = programId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/season`);
            if (response.data.status.code === 0) {
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

// TODO: get program extras, clips, & photos, and their details (SEE API DOC)
const getProgramExtra = (programId, page = 1, length = 5) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/extra?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PROGRAM_EXTRAS',
                    extras: response.data.data,
                    current_extra_page: page + 1
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getProgramPhoto = (programId, page = 1, length = 5) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/photo?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PROGRAM_PHOTOS',
                    photos: response.data.data,
                    current_photos_page: page + 1
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getProgramClip = (programId, page = 1, length = 5) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/program/${programId}/clip?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PROGRAM_CLIPS',
                    clips: response.data.data,
                    current_clips_page: page + 1
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const selectSeason = season => {
    return dispatch => new Promise((resolve, reject) => {
        const dispatched = {
            type: 'SELECT_SEASON',
            season: season
        };
        dispatch(dispatched);
        resolve(dispatched);
    });
};

const setShowMoreAllowed = (allowed, type = 'EPISODES') => {
    switch (type) {
        case 'EPISODES':
            return dispatch => dispatch({ 
                type: 'SET_SHOW_MORE_ALLOWED',
                allowed: allowed 
            });
    
        case 'EXTRAS':
            return dispatch => dispatch({
                type: 'SET_SHOW_MORE_EXTRA_ALLOWED',
                allowed: allowed
            });

        case 'PHOTOS':
            return dispatch => dispatch({
                type: 'SET_SHOW_MORE_PHOTO_ALLOWED',
                allowed: allowed
            });

        case 'CLIPS':
            return dispatch => dispatch({
                type: 'SET_SHOW_MORE_CLIP_ALLOWED',
                allowed: allowed
            });
    }
}

export default {
    getContents,
    getHomepageContents,
    getBanner,
    getEpisodeDetail,
    getEpisodeUrl,
    getExtraDetail,
    getExtraUrl,
    getClipDetail,
    getClipUrl,
    getPhotoDetail,
    getProgramDetail,
    getProgramEpisodes,
    getProgramSeason,
    getProgramExtra,
    getProgramPhoto,
    getProgramClip,
    selectSeason,
    setShowMoreAllowed
};
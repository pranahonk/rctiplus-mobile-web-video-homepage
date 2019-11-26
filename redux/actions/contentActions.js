import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? VISITOR_TOKEN : accessToken
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});

const getContents = page => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/homepage?page=${page}`);
            if (response.data.status.code === 0) {
                let contents = [];
                const data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    let content = {}
                    if (data[i].api != null) {
                        try {
                            const res = await axios.get(data[i].api);
                            if (res.data.status.code === 0) {
                                content = {
                                    content: res.data.data,
                                    ...data[i]
                                };
                                contents.push(content);
                            }
                        }
                        catch (e) {
                            // console.log(e);
                        }
                    }
                }
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: response.data.meta });
            }
            else {

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
                dispatch({
                    type: 'GET_EPISODE_URL',
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
                dispatch({
                    type: 'GET_EXTRA_URL',
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
                dispatch({
                    type: 'GET_CLIP_URL',
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
    getPhotoDetail
};
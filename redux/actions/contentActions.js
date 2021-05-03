import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken, checkToken, setCookie } from '../../utils/cookie';
import { showSignInAlert } from '../../utils/helpers';
import { getUidAppier } from '../../utils/appier';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

const setSigninPopupFlag = flag => {
    setCookie('SIGNIN_POPUP_SHOWN', flag);
};

const getContents = (page = 1, length = 20, platform = 'mweb') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/homepage?page=${page}&length=${length}`);
            let contents = [];
            if (response.data.status.code === 0) {
                const data = response.data.data;
                let selectedData = [];
                let promises = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].total_content > 0) {
                        promises.push(axios.get(`/v1/homepage/${data[i].id}/contents?page=${1}&length=${7}`)
                        .catch((err) => {
                            console.log('err', err);
                        }));
                        selectedData.push(data[i]);
                    }
                    else if (data[i].type === 'custom' && data[i].api) {
                        promises.push(axios.get(data[i].api)
                        .catch((err) => {
                            console.log('err', err);
                        }));
                        selectedData.push(data[i]);
                    }
                }
                
                const results = await Promise.all(promises);
                for (let i = 0; i < results.length; i++) {
                    if (!results[i]) {
                        continue;
                    }
                    
                    let content = {}
                    if (results[i] && results[i].status === 200 && results[i].data && results[i].data.status.code === 0) {
                        content = {
                            content: results[i].data.data,
                            ...selectedData[i]
                        };
                    }
                    else if (results[i].data.status.code === 13) {
                        if (!getCookie('SIGNIN_POPUP_SHOWN')) {
                            // showSignInAlert(`Please <b>Sign In</b><br/>
                            //     Woops! Gonna sign in first!<br/>
                            //     Only a click away and you<br/>
                            //     can continue to enjoy<br/>
                            //     <b>RCTI+</b>`, '', () => {}, true, 'Register', 'Login', true, true);
                            setSigninPopupFlag(true);
                        }
                    }
                    contents.push(content);
                }
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: response.data.meta });
            }
            else {
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: null });
            }
            resolve(response);
        }
        catch (e) {
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

const getContentShareLink = (id, type) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/share?id=${id}&type=${type}`);
            if (response.status === 200 && response.data.status.code === 0) {
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

const getBanner = (page = 1, length = 10, infos = 'id,title,portrait_image,image_landscape,type,type_value,sorting,program_id,popup_img,link,summary,square_image,program_name') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/banner?page=${page}&length=${length}&appierid=${getUidAppier()}`);
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
    getContentShareLink,
    selectSeason,
    setShowMoreAllowed
};
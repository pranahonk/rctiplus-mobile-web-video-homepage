import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? getVisitorToken() : accessToken
    }
});

const setCatchupDate = date => {
    return dispatch => dispatch({
        type: 'SET_CATCHUP_DATE',
        date: date
    });
};

const setCatchupData = catchupData => {
    return dispatch => dispatch({
        type: 'SET_CATCHUP_DATA',
        catchup: catchupData
    });
};

const setChannelCode = channelCode => {
    return dispatch => dispatch({
        type: 'SET_CHANNEL_CODE',
        channel_code: channelCode
    });
};

const postChat = (channelId, message, avatar, user) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/chat/${channelId}`, {
                msg: message,
                avatar: avatar,
                user: user
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'POST_CHAT',
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

const getLiveEvent = (type, infos = 'id,type,portrait_image,image_landscape,name,url,channel_code,epg_code,is_tvod,is_drm,chat,start_date,sorting', page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/live-event?type=${type}&infos=${infos}&page=${page}&length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_EVENT',
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

const getLiveEventDetail = liveEventId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/live-event/${liveEventId}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_EVENT_DETAIL',
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

const getLiveEventUrl = liveEventId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/live-event/${liveEventId}/url`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_EVENT_URL',
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

const getLiveQuiz = (infos = 'content_id,content_type,portrait_image,landscape_image,content_title,url,channel_code,is_drm,chat,release_date,start_date,sorting,terms', page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/live-quiz?infos=${infos}&page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_QUIZ',
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

const getLiveQuizUrl = liveQuizId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/live-quiz/${liveQuizId}/url`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_QUIZ_URL',
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

const getEPG = (date, channel = 'rcti') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/epg?date=${date}&channel=${channel}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_EPG',
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

const getCatchupUrl = catchupId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/epg/${catchupId}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_CATCHUP_URL',
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
    postChat,
    getLiveEvent,
    getLiveEventDetail,
    getLiveEventUrl,
    getLiveQuiz,
    getLiveQuizUrl,
    getEPG,
    getCatchupUrl,
    setCatchupDate,
    setChannelCode,
    setCatchupData
};
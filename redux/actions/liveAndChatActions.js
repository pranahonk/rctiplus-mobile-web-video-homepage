import ax from 'axios';
import { DEV_API, CHAT_API } from '../../config';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';
import { getUidAppier } from '../../utils/appier';
import socketIOClient from 'socket.io-client';

const axios = ax.create({ baseURL: DEV_API + '/api' });
const axiosChat = ax.create({ baseURL: CHAT_API });
const socket = 'https://rc-chat-api.rctiplus.com/chat';

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

axiosChat.interceptors.request.use(async (request) => {
    await checkToken()
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : 'Bearer ' + accessToken;
    return request
})

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
const getAdsChat = (channelId) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/sticky-message/${channelId}`);
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
};
const getChatSocket = (channelId) => {
    // eslint-disable-next-line no-new
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axiosChat.get(`/v1/chats/${channelId}?length=10`);
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.log(error);
        }
    });
};
const postChatSocket = (channelId, message, avatar, user) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axiosChat.post(`/v1/chats/${channelId}`, {
                msg: message,
                avatar: avatar,
                user: user,
            });
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.log(error);
        }
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

const listenSocketIo = (channelId) => {
    return dispatch =>new Promise(async (resolve) => {
        try {
            const response = await socketIOClient(socket + channelId)
            resolve(response)
        } catch (error) {
            console.log(error);
        }
    });
};
const getLiveChatBlock = (channelId) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/chat/${channelId}`);
            if (response.status === 200) {
                dispatch({
                    type: 'GET_CHAT_BLOCK',
                    data: response.data.data,
                    status: response.data.status,
                });
                resolve(response);
            } else {
              reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getLiveEvent = (type, channel = 'rcti', page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            
            const response = await axios.get(`/v2/live-event?type=${type}&length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIVE_EVENT',
                    data: response.data.data,
                    meta: response.data.meta,
                    status: response.data.status,
                    channel
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
const getAllLiveEvent = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            dispatch({
                type: 'LOADING_LIVE_EVENT',
            })
            const response = await axios.get(`/v3/live-event`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_ALL_LIVE_EVENT',
                    data: response.data.data,
                    meta: response.data.meta,
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                dispatch({
                    type: 'ERROR_LIVE_EVENT',
                })
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const getMissedEvent = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/missed-event?length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_MISSED_EVENT',
                    data: response.data.data,
                    meta: response.data.meta,
                    status: response.data.status,
                });
                resolve(response);
            } else {
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
            const response = await axios.get(`/v1/live-event/${liveEventId}/url?appierid=${getUidAppier()}`);
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

const getAllEpg = (channel = 'rcti') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            dispatch({ type: 'FADE', fade: false });
            dispatch({ type: 'SET_PAGE_LOADER' });
            const response = await axios.get(`/v2/epg?channel=${channel === 'gtv' ? 'globaltv' : channel}`)
            if(response.status === 200) {
                dispatch({ type: 'FADE', fade: true });
                dispatch({ type: 'UNSET_PAGE_LOADER' });
                dispatch({
                    type: "GET_EPG_V2",
                    data: response.data.data,
                    meta: response.data.meta,
                    status: response.data.status,
                })
                resolve(response)
            }
            else {
                reject(err)
            }
        } 
        catch (err) {
            reject(err)
        }
    })
}

const getCatchupUrl = catchupId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/epg/${catchupId}?appierid=${getUidAppier()}`);
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

export const getVmapResponse = url => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            console.log(response);
            if (response.status === 200) {
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

export const getChannelTv = payload => {
    return dispatch => {
        dispatch({
            type: "GET_CHANNEL_TV",
            payload: payload
        })
    }
};

export const getAdsDuration = () => {
    return dispatch => {
        axios.get('/v1/get-ads-duration').then((response) => {
            dispatch({
                type: 'GET_DURATION_ADS',
                data: {
                    refreshDuration: response.data.data[0].duration,
                    reloadDuration: response.data.data[1].duration
                },
            }); 
        }).catch((err) => console.log(err))
    }
};

export default {
    postChat,
    getAllLiveEvent,
    getLiveEvent,
    getLiveEventDetail,
    getLiveEventUrl,
    getLiveQuiz,
    getLiveQuizUrl,
    getEPG,
    getCatchupUrl,
    setCatchupDate,
    setChannelCode,
    setCatchupData,
    getLiveChatBlock,
    listenSocketIo,
    postChatSocket,
    getChatSocket,
    getMissedEvent,
    getVmapResponse,
    getAdsChat,
    getChannelTv,
    getAdsDuration,
    getAllEpg
};

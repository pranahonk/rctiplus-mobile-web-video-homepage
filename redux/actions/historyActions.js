import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken ? accessToken : getVisitorToken()
    }
});



const getUserHistory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/history`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'USER_HISTORY',
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

const postHistory = (id, type, lastDuration) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/history`, {
                id: id,
                type: type,
                last_duration: lastDuration
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'POST_HISTORY',
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

const deleteHistory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete(`/v1/history`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'DELETE_HISTORY',
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

const getContinueWatching = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/continue-watching?page=${page}&length=${length}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'CONTINUE_WATCHING',
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

const getContinueWatchingByContentId = (id, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/continue-watching/${id}/${type}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'CONTINUE_WATCHING_BY_CONTENT_ID',
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

const deleteContinueWatchingByContentId = (id, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete(`/v1/continue-watching/${id}/${type}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'DELETE_CONTINUE_WATCHING_BY_CONTENT_ID',
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
    getUserHistory,
    postHistory,
    deleteHistory,
    getContinueWatching,
    getContinueWatchingByContentId,
    deleteContinueWatchingByContentId
};
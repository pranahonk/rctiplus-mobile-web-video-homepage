import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

const bookmark = (id, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/bookmark`, {
                id: id,
                type: type
            });

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'BOOKMARK', 
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

const deleteBookmark = (id, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete(`/v1/bookmark?id=${id}&type=${type}`);

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'DELETE_BOOKMARK', 
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

const getBookmarks = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/bookmarks`);

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'GET_BOOKMARKS', 
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

const getMyList = programId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/mylist/${programId}`);

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'MY_LIST', 
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

const getListBookmark = (page = 1, length = 10, order = 'date', dir = 'DESC') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/listbookmark?page=${page}&length=${length}&order=${order}&dir=${dir}`);
            
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIST_BOOKMARK',
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

const getListBookmarkById = (programId, page = 1, length = 10, order = 'date', dir = 'DESC') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/listbookmark/${programId}?page=${page}&length=${length}&order=${order}&dir=${dir}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIST_BOOKMARK_BY_ID',
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

const getProgramBookmark = programId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/bookmark/${programId}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_BOOKMARK',
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

const getBookmark = (page = 1, length = 10, orderBy = 'date', dir = 'DESC') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/bookmark?page=${page}&length=${length}&order=${orderBy}&dir=${dir}`);
            if (response.status === 200 && response.data.status.code === 0) {
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

const setBookmarkShowMoreAllowed = allowed => {
    return dispatch => dispatch({
        type: 'SET_SHOW_MORE_ALLOWED',
        allowed: allowed
    });
};

export default {
    bookmark,
    deleteBookmark,
    getBookmarks,
    getProgramBookmark,
    getMyList,
    getListBookmark,
    getListBookmarkById,
    getBookmark,
    setBookmarkShowMoreAllowed
};
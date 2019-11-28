import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const bookmark = (id, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/bookmark`, {
                id: id,
                type: type
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
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

const getBookmarks = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/bookmarks`, {
                headers: {
                    'Authorization': accessToken
                }
            });

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
            const response = await axios.get(`/v1/mylist/${programId}`, {
                headers: {
                    'Authorization': accessToken
                }
            });

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
            const response = await axios.get(`/v1/listbookmark?page=${page}&length=${length}&order=${order}&dir=${dir}`, {
                headers: {
                    'Authorization': accessToken
                }
            });
            
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
            const response = await axios.get(`/v1/listbookmark/${programId}?page=${page}&length=${length}&order=${order}&dir=${dir}`, {
                headers: {
                    'Authorization': accessToken
                }
            });

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

const getBookmark = programId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/bookmark/${programId}`, {
                headers: {
                    'Authorization': accessToken
                }
            });

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

export default {
    bookmark,
    getBookmarks,
    getBookmark,
    getMyList,
    getListBookmark,
    getListBookmarkById
};
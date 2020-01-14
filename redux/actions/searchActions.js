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

const setShowMoreAllowed = allowed => {
    return dispatch => dispatch({
        type: 'SET_SHOW_MORE_ALLOWED',
        allowed: allowed
    });
};

const search = index => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/search/${index}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'SEARCH',
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

const searchByGenre = (genreId, category) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/search/${genreId}/${category}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'SEARCH_BY_GENRE',
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

const getRecommendation = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/recommendation?page=${page}&length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_RECOMMENDATION',
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

const getRelatedProgram = (id = null, page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            let queryString = `page=${page}&length=${length}`;
            if (id !== null) {
                queryString += `&id=${id}`;
            }
            const response = await axios.get(`/v1/related?${queryString}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_RELATED_PROGRAM',
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
    search,
    searchByGenre,
    getRecommendation,
    getRelatedProgram,
    setShowMoreAllowed
};
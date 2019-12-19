import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const getFeeds = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const accessToken = getCookie(tokenKey);
            const response = await axios.get(`/v1/feed?page=${page}&length=${length}`, {
                headers: {
                    'Authorization': accessToken ? accessToken : VISITOR_TOKEN
                }
            });
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_FEEDS',
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

const getExclusives = (type = 'all', page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const accessToken = getCookie(tokenKey);
            const response = await axios.get(`/v1/exclusive?type=${type}&page=${page}&length=${length}`, {
                headers: {
                    'Authorization': accessToken ? accessToken : VISITOR_TOKEN
                }
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_EXCLUSIVES',
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

const getExclusiveCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const accessToken = getCookie(tokenKey);
            const response = await axios.get(`/v1/exclusive/category`, {
                headers: {
                    'Authorization': accessToken ? accessToken : VISITOR_TOKEN
                }
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_EXCLUSIVE_CATEGORY',
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
    getFeeds,
    getExclusives,
    getExclusiveCategory
};
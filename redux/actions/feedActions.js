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

const getFeeds = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/feed?page=${page}&length=${length}`);
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
            const response = await axios.get(`/v1/exclusive?type=${type}&page=${page}&length=${length}`);

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
            const response = await axios.get(`/v1/exclusive/category`);

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
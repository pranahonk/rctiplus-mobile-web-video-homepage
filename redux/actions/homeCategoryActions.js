import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api/v2' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

export const getActiveCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/category`);

            if (response.data.status.code === 0) {
                console.log(`ini aktif kategori`,response.data.data)
                dispatch({
                    type: 'ACTIVE_CATEGORY',
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
}

export const getSubCategory = (category_id) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/category/${category_id}/sub-category`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'SUB_CATEGORY',
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
}

export const getBannerCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/banner`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'BANNER_CATEGORY',
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
}

export const getBannerCategoryActive = (category_id) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/banner/category/${category_id}`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'BANNER_CATEGORY_ACTIVE',
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
}
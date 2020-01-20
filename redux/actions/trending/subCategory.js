import ax from 'axios';
import { API, DEV_API, NEWS_TOKEN, NEWS_API } from '../../../config';
import { getCookie, getNewsToken, getVisitorToken } from '../../../utils/cookie';
import { showConfirmAlert, showSignInAlert } from '../../../utils/helpers';
//

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);
const axios = ax.create({
    baseURL: NEWS_API + '/api',
    headers: {
        'Authorization': getNewsToken()
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});

const getTrendingSubCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`/v1/subcategory?infos=id,name`);
                if (response.data.status.code === 0) {
                    dispatch({
                        type: 'GET_TRENDING_SUB_CATEGORY',
                        data: response.data.data,
                        meta: response.data.meta, 
                        status: response.data.status
                    });
                    resolve(response);
                } else {
                    reject(response);
                }
            } catch (error) {
                reject(error);
            }
        });
};

export default {
    getTrendingSubCategory
};
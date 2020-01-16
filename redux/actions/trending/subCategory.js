import ax from 'axios';
import { API, DEV_API, NEWS_TOKEN } from '../../../config';
import { getCookie } from '../../../utils/cookie';
import { showConfirmAlert, showSignInAlert } from '../../../utils/helpers';
//

const tokenKey = 'NEWS_TOKEN';
const accessToken = getCookie(tokenKey);
console.log(tokenKey);
const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken ? accessToken : NEWS_TOKEN
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});

const getSubCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`https://api-news.rctiplus.id/api/v1/subcategory?infos=id,name`);
                console.log(response);
                if (response.data.status.code === 0) {
                    dispatch({
                        type: 'GET_SUB_CATEGORY',
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
    getSubCategory
};
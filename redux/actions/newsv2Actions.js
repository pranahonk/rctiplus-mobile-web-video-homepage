import ax from 'axios';
import { NEWS_API_V2 } from '../../config';
import { getNewsTokenV2, getNewsToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getNewsTokenV2();
    return request;
});

const getNews = (subcategoryId = 1, pageSize = 10, page = 1) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news?&subcategory_id=${subcategoryId}&page=${page}&pageSize=${pageSize}`);

            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_NEWS',
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
    getNews
};
import ax from 'axios';
import { API, DEV_API, NEWS_TOKEN, NEWS_API } from '../../../config';
import { getCookie, getNewsToken, getVisitorToken, checkToken } from '../../../utils/cookie';
import { showConfirmAlert, showSignInAlert } from '../../../utils/helpers';
//

const axios = ax.create({ baseURL: NEWS_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getNewsToken();
    return request;
});

const getTrendingContent = (subcategory_id = 12, page = 1, length = 5, info = 'id,cover,title,content,pubDate,source') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news?info=${info}&subcategory_id=${subcategory_id}&page=${page}&pageSize=${length}`);

            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_TRENDING_CONTENT',
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

const getTrendingRelated = (id, pageSize = 4, infos = 'id,title,cover,link,guid') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/related/${id}?pageSize=${pageSize}&infos=${infos}`);
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

export default {
    getTrendingContent,
    getTrendingRelated
};
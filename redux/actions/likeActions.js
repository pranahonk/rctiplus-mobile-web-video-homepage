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

const postLike = (id, type, status = 'INDIFFERENT') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/like`, {
                id: id,
                type: type,
                status: status
            });

            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'POST_LIKE',
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

const getLikeHistory = (programId, type = 'all', page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/like?id=${programId}&type=${type}&page=${page}&length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_LIKE',
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
    postLike,
    getLikeHistory
};
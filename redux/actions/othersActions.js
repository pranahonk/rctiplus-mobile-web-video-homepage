import ax from 'axios';
import { DEV_API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? VISITOR_TOKEN : accessToken
    }
});

const getLocations = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/locations`);
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
    getLocations
};
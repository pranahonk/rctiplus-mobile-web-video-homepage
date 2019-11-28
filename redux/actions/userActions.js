import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const updateUserProfile = (username, dob, gender, location) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/user`, {
                username: username,
                dob: dob,
                gender: gender,
                location: location
            }, {
                headers: {
                    'Authorization': accessToken,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ type: 'UPDATE_PROFILE', status: response.data.status });
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

const getUserData = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/user`, {
                headers: {
                    'Authorization': accessToken
                }
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'USER_DATA',
                    data: response.data.data,
                    meta: response.data.meta
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

export default {
    updateUserProfile,
    getUserData
};
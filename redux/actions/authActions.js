import Router from 'next/router';
import ax from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE, WRONG_AUTHENTICATION } from '../types';
import { API, DEV_API, VISITOR_TOKEN } from '../../config';
import { setCookie, removeCookie, getCookie } from '../../utils/cookie';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);
console.log('AUTH ACTIONS [ACCESS TOKEN]:', accessToken);

const login = ({ emailphone, password, deviceId = '1' }) => {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('/v2/login', {
                username: emailphone,
                password: password,
                device_id: deviceId,
                platform: 'mweb'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const data = response.data;
                if (data.status.code == 0) {
                    setCookie(tokenKey, data.data.access_token);
                    dispatch({ type: AUTHENTICATE, data: data, token: data.data.access_token });
                }
                else {
                    dispatch({ type: WRONG_AUTHENTICATION, message: data.status.message_client, code: data.status.code });
                }
                resolve(response);
            })
            .catch(error => {
                console.log('ERROR');
                console.log(error);
                reject(error);
            });
    });
};

const logout = (device_id, platform = 'mweb') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/logout`, {
                device_id: device_id,
                platform: platform
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getCookie(tokenKey)
                }
            });

            if (response.data.status.code === 0) {
                removeCookie(tokenKey);
                dispatch({ type: DEAUTHENTICATE });
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
    login,
    logout
};
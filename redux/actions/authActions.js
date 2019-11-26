import Router from 'next/router';
import ax from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE, WRONG_AUTHENTICATION } from '../types';
import { API, VISITOR_TOKEN } from '../../config';
import { setCookie, removeCookie } from '../../utils/cookie';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const tokenKey = 'ACCESS_TOKEN';

const test = () => {
    return dispatch => {
        axios.get('/v1/test-get-otp')
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };
};

const login = ({ emailphone, password }) => {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('/v1/login', {
                emailphone: emailphone,
                password: password,
                device_id: 'test',
                platform: 'web'
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
                    'Content-Type': 'application/json'
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
    test,
    login,
    logout
};
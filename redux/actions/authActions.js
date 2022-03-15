import ax from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE, WRONG_AUTHENTICATION, STORE_TOKEN, RESET_MESSAGE } from '../types';
import { DEV_API, MONETIZATION_API } from '../../config';
import { setCookie, removeCookie, getCookie, getVisitorToken, checkToken, getUserAccessToken } from '../../utils/cookie';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api'
});

const axiosMonetization = ax.create({
    // baseURL: API + '/api',
    baseURL: MONETIZATION_API + '/api'
});

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getUserAccessToken() || getVisitorToken();
    return request;
});

axiosMonetization.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getUserAccessToken()
    return request;
});

const setDeviceId = deviceId => {
    return dispatch => dispatch({
        type: 'SET_DEVICE_ID',
        device_id: deviceId
    });
};

const login = ({ emailphone, password, deviceId, phone_code }) => {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('/v3/login', {
                phone_code: phone_code,
                username: phone_code + emailphone,
                password: password,
                device_id: deviceId || new DeviceUUID().get(),
                platform: 'mweb'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const data = response.data;
                if (data.status.code == 0) {
                    setCookie('ACCESS_TOKEN', data.data.access_token);
                    removeCookie('NEWS_TOKEN_V2');
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
                device_id: device_id || new DeviceUUID().get(),
                platform: platform
            });

            if (response.data.status.code === 0) {
                removeCookie('NEWS_TOKEN_V2');
                removeCookie('ACCESS_TOKEN');
                dispatch({ type: "USER_DATA", data: null, meta: null });
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

const storeAccessToken = (token) => {
    return async (dispatch) => {
        try {
            const response = await axiosMonetization.post(`/v1/account/check-token-auth`, { token })

            if (response) {
                dispatch({
                    type: STORE_TOKEN,
                    message: 'Success Store Token'
                })
            }
        } catch(err) {
            dispatch({
                type: STORE_TOKEN,
                message: 'Failed Store Token'
            })
        }
    }
}

const resetAuthMessage = () => {
    return async(dispatch) => {
        dispatch({
            type: RESET_MESSAGE,
            message: ''
        })
    }
}

export default {
    login,
    logout,
    setDeviceId,
    storeAccessToken,
    resetAuthMessage
};

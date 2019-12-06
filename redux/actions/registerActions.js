import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const setUsername = username => {
    return dispatch => dispatch({
        type: 'USERNAME',
        username: username
    });
};

const setPassword = password => {
    return dispatch => dispatch({
        type: 'PASSWORD',
        password: password
    });
};

const register = ({ emailphone, password, username, otp, interest = [1, 3], device_id, platform = 'web' }) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/register`, {
                emailphone: emailphone,
                password: password,
                username: username,
                otp: otp,
                interest: interest,
                device_id: device_id,
                platform: platform
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'REGISTER', 
                    data: response.data.data, 
                    meta: response.data.meta 
                });
                resolve(response);
            }
            else {
                reject(error);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const resendVerifyEmail = emailphone => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/resend-verify-email`, {
                emailphone: emailphone
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ 
                    type: 'RESEND_VERIFY_EMAIL', 
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
};

const getPhoneOtp = phonenumber => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/otp?phonenumber=${phonenumber}`);
            if (response.data.status.code === 0) {
                dispatch({ type: 'GET_OTP' });
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

const verifyOtp = (phonenumber, otp, reset = true) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/otp`, {
                phone: phonenumber,
                otp: otp,
                reset: reset
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ type: 'VERIFY_OTP' });
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

const checkUser = emailphone => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/user/exist?emailphone=${emailphone}`);
            if (response.data.status.code === 0) {
                dispatch({ type: 'CHECK_USER', status: response.data.status });
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

const forgotPassword = (emailphone, device_id, platform = 'mweb') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/forgot-password`, {
                emailphone: emailphone,
                device_id: device_id,
                platform: platform
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ type: 'FORGOT_PASSWORD', status: response.data.status });
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

const createNewPassword = (token, otp, device_id, newPassword, platform = 'mweb') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/new-pass`, {
                token: token,
                otp: otp,
                device_id: device_id,
                platform: platform,
                newpass: newPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status.code === 0) {
                dispatch({ type: 'CREATE_NEW_PASSWORD', status: response.data.status });
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
    register,
    resendVerifyEmail,
    getPhoneOtp,
    verifyOtp,
    checkUser,
    forgotPassword,
    createNewPassword,
    setUsername,
    setPassword
};
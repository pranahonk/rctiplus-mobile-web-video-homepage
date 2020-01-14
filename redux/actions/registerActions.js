import ax from 'axios';
import { DEV_API } from '../../config';
import { setCookie, getVisitorToken } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';

const axios = ax.create({
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': getVisitorToken()
    }
});

const setActiveTab = tab => {
    return dispatch => dispatch({
        type: 'SET_ACTIVE_TAB',
        tab: tab
    });
};

const setEmailInvalid = invalid => {
    return dispatch => dispatch({
        type: 'SET_EMAIL_STATUS',
        invalid: invalid
    });
};

const setPhoneInvalid = invalid => {
    return dispatch => dispatch({
        type: 'SET_PHONE_STATUS',
        invalid: invalid
    });
};

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

const setFullname = fullname => {
    return dispatch => dispatch({
        type: 'FULLNAME',
        fullname: fullname
    });
};

const setGender = gender => {
    return dispatch => dispatch({
        type: 'GENDER',
        gender: gender
    });
};

const setDob = dob => {
    return dispatch => dispatch({
        type: 'DOB',
        dob: dob
    });
};

const setUsernameType = type => {
    return dispatch => dispatch({
        type: 'USERNAME_TYPE',
        username_type: type
    });
};

const setOtp = otp => {
    return dispatch => dispatch({
        type: 'OTP',
        otp: otp
    });
};

const getOtp = (username, type = 'registration') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/otp`, { 
                username: username,
                type: type
            });

            if (response.data.status.code === 0) {
                dispatch({ type: 'GET_OTP' });
            }

            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    });
};

const register = ({ username, password, fullname, gender, dob, otp, device_id }) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/register`, {
                password: password,
                username: username,
                fullname: fullname,
                gender: gender,
                dob: dob,
                otp: otp,
                device_id: device_id
            });

            if (response.data.status.code === 0) {
                setCookie(tokenKey, response.data.data.access_token);
                dispatch({ 
                    type: 'REGISTER', 
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

const resendVerifyEmail = emailphone => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/resend-verify-email`, {
                emailphone: emailphone
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

const verifyOtp = (username, otp) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/verify-otp`, {
                username: username,
                otp: otp
            });

            // code = 26 (wrong otp)
            // code = 1 (otp max length is 4)
            if (response.data.status.code === 0) {
                dispatch({ type: 'VERIFY_OTP' });
            }

            resolve(response);
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

const createForgotPassword = (username, new_password, otp) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/forgot-password`, {
                username: username,
                new_password: new_password,
                otp: otp
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
    getOtp,
    verifyOtp,
    forgotPassword,
    createNewPassword,
    createForgotPassword,
    setUsername,
    setPassword,
    setFullname,
    setGender,
    setDob,
    setUsernameType,
    setOtp,
    setEmailInvalid,
    setPhoneInvalid,
    setActiveTab
};
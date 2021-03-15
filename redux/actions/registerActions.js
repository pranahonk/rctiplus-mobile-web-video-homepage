import ax from 'axios';
import { DEV_API, AUTH_API } from '../../config';
import { getCookie, setCookie, getVisitorToken, checkToken, getVisitorTokenPassport } from '../../utils/cookie';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api'
});

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getVisitorToken();
    return request;
});

const axAuthAPI = ax.create({ baseURL: AUTH_API });

axAuthAPI.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorTokenPassport() : accessToken;
    return request;
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

const setPhoneCode = (phone_code = '') => {
    return dispatch => dispatch({
        type: 'PHONE_CODE',
        phone_code: phone_code
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

const getOtp = (username, type = 'registration', phone_code = null) => {
    console.log(phone_code)
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v3/otp`, { 
                username: phone_code ? phone_code + username : username,
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

const getOtpv2 = (username, type = 'registration', phone_code = null) => {
    console.log(phone_code)
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axAuthAPI.post(`/v1/partner/otp`, {
                username: phone_code ? phone_code + username : username,
                type: type,
                signature_code: ''
            });
            if (response.data.status === 200) {
                dispatch({ type: 'GET_OTP' });
            }

            resolve(response);
        }
        catch (error) {
            console.log('hello world')
            reject(error);
        }
    });
};

const register = ({ username, password, fullname, gender, dob, otp, device_id, phone_code= '' }) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v3/register`, {
                password: password,
                phone_code: phone_code,
                username: username,
                fullname: fullname,
                gender: gender,
                dob: dob,
                otp: otp,
                device_id: device_id,
            });

            if (response.data.status.code === 0) {
                setCookie('ACCESS_TOKEN', response.data.data.access_token);
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

const verifyOtp = (username, otp, phone_code = null) => {
    // console.log('TEST',username, otp, phone_code)
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v3/verify-otp`, {
                username: phone_code ? phone_code + username : username,
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

const verifyOtpv2 = (username, otp, phone_code = null) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axAuthAPI.post(`/v1/partner/verify_otp`, {
                username: phone_code ? phone_code + username : username,
                type: "forget-password",
                otp: otp
            });

            // code = 26 (wrong otp)
            // code = 1 (otp max length is 4)
            if (response.data.status === 200) {
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

const createForgotPassword = (username, new_password, otp, phone_code = '') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v3/forgot-password`, {
                phone_code: phone_code,
                username: username,
                new_password: new_password,
                otp: otp,
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

const createForgotPasswordv2 = (username, new_password, otp, phone_code = '') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axAuthAPI.post(`/v1/partner/forgot_password`, {
                phone_code: phone_code,
                username: username,
                new_password: new_password,
                otp: otp,
            });

            if (response.data.status === 200) {
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
    getOtpv2,
    verifyOtp,
    verifyOtpv2,
    forgotPassword,
    createNewPassword,
    createForgotPassword,
    createForgotPasswordv2,
    setUsername,
    setPassword,
    setFullname,
    setGender,
    setDob,
    setUsernameType,
    setOtp,
    setEmailInvalid,
    setPhoneInvalid,
    setActiveTab,
    setPhoneCode,
};
import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? getVisitorToken() : accessToken
    }
});

const setChangePasswordData = (currentPassword, newPassword, rePassword) => {
    return dispatch => dispatch({
        type: 'SET_CHANGE_PASSWORD_DATA',
        change_password: {
            current_password: currentPassword,
            new_password: newPassword,
            re_password: rePassword
        }
    });
};

const setValue = (index, value) => {
    return dispatch => dispatch({
        type: 'SET_VALUE',
        index: index,
        value: value
    });
};

const setUserProfile = (nickname, fullname, dob, gender, phone_number, email, otp, location) => {
    return dispatch => dispatch({
        type: 'SET_PROFILE',
        nickname: nickname,
        fullname: fullname,
        dob: dob,
        gender: gender,
        phone_number: phone_number,
        email: email,
        otp: otp,
        location: location
    });
};

const setUserProfilePhoto = src => {
    return dispatch => dispatch({
        type: 'SET_PROFILE_PHOTO_SRC',
        src: src
    });
};

// verify nickname or password
const verify = ({ nickname, password }) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const data = {};
            if (nickname) {
                data['nickname'] = nickname;
            }
            if (password) {
                data['password'] = password;
            }
            const response = await axios.post(`/v2/verify`, data);
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

const changePassword = (password, rePassword, otp) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/change-password`, {
                password: password,
                repassword: rePassword,
                otp: otp
            });

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

const uploadProfilePhoto = file => {
    let data = new FormData();
    data.append('photo', file);
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/user/photo`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

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

const updateUserData = (key, value, otp = null) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const data = {};
            data[key] = value;
            if (otp) {
                data['otp'] = otp;
            }
            const response = await axios.post(`/v2/user`, data);
            
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

const updateUserProfile = (username, dob, gender, location) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/user`, {
                username: username,
                dob: dob,
                gender: gender,
                location: location
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
            const response = await axios.get(`/v2/user`, {
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

const getInterests = (status = 'active') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/genre?status=${status}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'INTERESTS',
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

const setInterest = interests => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/interest`, {
                interest: interests
            }, {
                headers: {
                    'Authorization': getCookie(tokenKey)
                }
            });
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    });
};

const getUserInterest = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/user/interest`);
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

const checkUser = username => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/user/exist?username=${username}`);
            dispatch({ type: 'CHECK_USER', status: response.data.status });
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    });
};

export default {
    updateUserProfile,
    getUserData,
    getInterests,
    checkUser,
    setInterest,
    setUserProfile,
    setValue,
    updateUserData,
    setUserProfilePhoto,
    uploadProfilePhoto,
    verify,
    setChangePasswordData,
    changePassword,
    getUserInterest
};
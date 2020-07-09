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

const getListCountry = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/country_code`);
            if (response.status === 200 && response.data.status.code === 0) {
                resolve(response);
                dispatch({
                    type: 'GET_LIST_COUNTRY',
                    data: response.data,
                });
            } else {
                dispatch({
                    type: 'GET_LIST_COUNTRY',
                    data: null,
                });
            }
        }
        catch (error) {
            reject(error)
        }
    })
}

const scanQRCode = qrcode => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/qrcode`, { qrcode: qrcode });
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

const setField = (index, label, fieldType, notes, placeholder, needOtp = false, optionData = [], disabledCondition = null) => {
    return dispatch => dispatch({
        type: 'SET_FIELD',
        label: label,
        field_type: fieldType,
        notes: notes,
        need_otp: needOtp,
        placeholder: placeholder,
        option_data: optionData,
        index: index,
        disabled_condition: disabledCondition
    });
};

export default {
    getLocations,
    setField,
    scanQRCode,
    getListCountry,
};
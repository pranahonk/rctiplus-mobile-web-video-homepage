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

const setField = (index, label, fieldType, notes, placeholder, needOtp = false, optionData = []) => {
    return dispatch => dispatch({
        type: 'SET_FIELD',
        label: label,
        field_type: fieldType,
        notes: notes,
        need_otp: needOtp,
        placeholder: placeholder,
        option_data: optionData,
        index: index
    });
};

export default {
    getLocations,
    setField
};
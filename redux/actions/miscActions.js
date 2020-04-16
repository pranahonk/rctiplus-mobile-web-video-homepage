import ax from 'axios';
import { DEV_API } from '../../config';

const axios = ax.create({ baseURL: DEV_API + '/api' });

const getTnc = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/terms-and-condition`);
            if (response.status === 200) {
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

const getFaq = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/faq`);
            if (response.status === 200) {
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

const getPrivacyPolicy = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/privacy-policy`);
            if (response.status === 200) {
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
    getTnc,
    getFaq,
    getPrivacyPolicy
};
import ax from 'axios';
import { API_V2 } from '../../config';
import { getUidAppier } from '../../utils/appier';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: API_V2 });
axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

export const toggleSwitchAds = () => {
    return (dispatch) => {
        dispatch({
            type: 'TOGGLE_SWITCH_ADS',
        })
    }
}
const toggleAds = (flag) => {
    return dispatch => dispatch({
        type: 'TOGGLE_ADS',
        flag: flag
    });
};

const fetchTargetingAds = () => {
    return (dispatch) => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/ads/v1/cust-params?platform=mweb&aid=${getUidAppier()}`);
            if (response.status === 200) {
                resolve(response.data);
                dispatch({
                    type: "ADS_CUSTOM_PARAMS",
                    payload: response.data,
                })
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

export default {
    toggleAds,
    fetchTargetingAds
};

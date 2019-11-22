import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

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

export default {
    register
};
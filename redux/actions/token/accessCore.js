/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import ax from 'axios';

const getAccessToken = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/visitor?platform=mweb&device_id=0089821`);
            console.log('response : ');
            console.log(response);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_FEEDS',
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
export default {
    getAccessToken
};
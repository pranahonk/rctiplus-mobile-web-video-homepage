import ax from 'axios';
import { API, DEV_API } from '../../config';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

const submitAnswer = (quizId, questionId, answerId) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/quiz/${quizId}/answer`, {
                question_id: questionId,
                answer_id: answerId
            });

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'SUBMIT_ANSWER',
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

const getQuizResult = quizId => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/quiz/${quizId}/result`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'QUIZ_RESULT',
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
    submitAnswer,
    getQuizResult
};
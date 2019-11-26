import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? VISITOR_TOKEN : accessToken
    }
});

const submitAnswer = (quizId, questionId, answerId) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/quiz/${quizId}/answer`, {
                question_id: questionId,
                answer_id: answerId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
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
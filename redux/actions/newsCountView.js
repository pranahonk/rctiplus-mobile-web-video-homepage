import ax from 'axios';
import {
  removeAccessToken,
  getVisitorToken,
  getCookie, checkToken,
} from '../../utils/cookie';

const axios = ax.create({ baseURL: 'https://hera.mncplus.id' });
axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
  return request;
});


const newsCountViewTag = (tag ) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/news/tags/count?apikey=Tpa0pF9gLU989TKBslyWvhS6ghWXVm0V`, tag);
      if (response.status === 200) {
        resolve(response);
      } else {
        removeAccessToken();
        reject(response);
      }
    } catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};


const newsCountViewDetail = (device_id = null, userid =  null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/news/news/count?apikey=Tpa0pF9gLU989TKBslyWvhS6ghWXVm0V`, {
        visitor_id: device_id,
        news_id: userid,
      });
      if (response.status === 200) {
        resolve(response);
      } else {
        removeAccessToken();
        reject(response);
      }
    } catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};


export default {
  newsCountViewDetail,
  newsCountViewTag
};

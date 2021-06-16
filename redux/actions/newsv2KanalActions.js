import ax from 'axios';
import { NEWS_API_V2 } from '../../config';
import {
  removeAccessToken,
  getUserAccessToken,
  getVisitorToken,
  checkToken,
  setAccessToken,
  getCookie
} from '../../utils/cookie';
import queryString from 'query-string';
import initialize from '../../utils/initialize';

const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });
// axios.interceptors.request.use(async (request) => {
//   await checkToken();
//   const accessToken = getCookie('ACCESS_TOKEN');
//   request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
//   return request;
// });

const setToken = () => {
  const accessToken = getCookie('ACCESS_TOKEN');
  return accessToken === undefined ? getVisitorToken() : accessToken;
}

const addCategoryV2 = (categoryId, core_token = null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/feature/kanal`, {
        category: categoryId,
      }, {
        headers: {"Authorization" : `${core_token ? core_token : setToken()}`},
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



const deleteCategoryV2 = (categoryId, core_token = null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.delete(`/v2/feature/kanal/${categoryId}`, {
        headers: {"Authorization" : `${core_token ? core_token : setToken()}`},
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

const updateCategoryOrderV2 = (categoryId, sorting, core_token = null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/feature/update_kanal`, {
        category: categoryId,
        sorting: sorting,
      }, {
        headers: {"Authorization" : `${core_token ? core_token : setToken()}`},
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

const getCategoryV2 = (core_token = null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/feature/category`, { headers: {"Authorization" : `${core_token ? core_token : setToken()}`}});
      if (response.status === 200 && response.data.status.code === 0) {
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

const getChannelsv2 = (core_token = null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/feature/kanal`, { headers: {"Authorization" : `${core_token ? core_token : setToken()}`}});
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
  addCategoryV2,
  deleteCategoryV2,
  updateCategoryOrderV2,
  getCategoryV2,
  getChannelsv2,
};

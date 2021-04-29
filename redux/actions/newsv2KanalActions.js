import ax from 'axios';
import { NEWS_API_V2 } from '../../config';
import { removeAccessToken, getUserAccessToken, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });

axios.interceptors.request.use(async (request) => {
  const accessToken = getUserAccessToken();
  if (!accessToken) {
    removeAccessToken();
    await checkToken();
    request.headers['Authorization'] = getVisitorToken();
  } else {
    request.headers['Authorization'] = accessToken;
  }

  return request;
});

const addCategoryV2 = categoryId => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/feature/kanal`, {
        category: categoryId,
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



const deleteCategoryV2 = categoryId => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.delete(`/v2/feature/kanal/${categoryId}`);
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

const updateCategoryOrderV2 = (categoryId, sorting) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/feature/update_kanal`, {
        category: categoryId,
        sorting: sorting,
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

const getCategoryV2 = () => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/feature/category`);
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

const getChannelsv2 = () => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/feature/kanal`);
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

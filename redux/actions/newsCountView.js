import ax from 'axios'
import {
  removeAccessToken,
  getVisitorToken,
  getCookie, checkToken,
} from '../../utils/cookie'

const axios = ax.create({ baseURL: process.env.HERA_URL })
axios.interceptors.request.use(async (request) => {
  await checkToken()
  const accessToken = getCookie('ACCESS_TOKEN')
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken
  request.headers['apikey'] = process.env.GRAPHQL_APIKEY
  return request
})


const newsCountViewTag = (tag ) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/news/tags/count`, tag)
      if (response.status === 200) {
        resolve(response)
      } else {
        removeAccessToken()
        reject(response)
      }
    } catch (error) {
      removeAccessToken()
      reject(error)
    }
  })
}


const newsCountViewDetail = (device_id = null, userid =  null) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/news/news/count`, {
        visitor_id: device_id,
        news_id: userid,
      })
      if (response.status === 200) {
        resolve(response)
      } else {
        removeAccessToken()
        reject(response)
      }
    } catch (error) {
      removeAccessToken()
      reject(error)
    }
  })
}


export default {
  newsCountViewDetail,
  newsCountViewTag,
}

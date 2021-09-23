import ax from 'axios'
import { DEV_API } from '../../config'
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie'
import { seoActionTypes } from "../reducers/seoReducer"

const axios = ax.create({ baseURL: `${DEV_API}/api` })

axios.interceptors.request.use(async (request) => {
  await checkToken()
  const accessToken = getCookie('ACCESS_TOKEN')
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken
  return request
})

const getSeoJsonLD = (contentType, contentId) => {
  return dispatch => {
    axios.get(`/v1/seo/content/${contentType}/${contentId}`)
      .then((response) => {
        dispatch({
          type: seoActionTypes.SET_JSONLD,
          payload: response.data
        })
      })
  }
}

export default {
  getSeoJsonLD
}
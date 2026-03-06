import axios from 'axios'

const request = axios.create({
  baseURL: 'https://test-api.yicall.com',
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200 || data.code === 0 || data.success === true) {
      return data.data !== undefined ? data.data : data
    }
    return Promise.reject(new Error(data.message || data.msg || '请求失败'))
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request

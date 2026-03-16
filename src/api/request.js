import axios from 'axios'

// 使用 globalThis 缓存实例，保证 Vite HMR 热重载时不重复创建和注册
if (!globalThis.__axiosRequest) {
  const instance = axios.create({
    baseURL: 'https://sjch5.gongshu.gov.cn/pbdm-api',
    // baseURL: 'http://192.168.10.229:9081',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'YICALL-SECRET-KEY': 'CQ2Fgiaux3Ml9qoO'
    }
  })

  instance.interceptors.response.use(
    (response) => {
      const { data } = response
      console.log(data);
      if (data.code === 200 || data.code === 0 || data.success === true) {
        return data.data !== undefined ? data.data : data
      }
      return Promise.reject(new Error(data.message || data.msg || '请求失败'))
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  globalThis.__axiosRequest = instance
}

const request = globalThis.__axiosRequest

export default request

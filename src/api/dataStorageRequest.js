import axios from 'axios'

// dataStorage 接口专用的 axios 实例
// 使用 globalThis 缓存实例，保证 Vite HMR 热重载时不重复创建
if (!globalThis.__axiosDataStorageRequest) {
  const instance = axios.create({
    baseURL: 'https://sjch5.gongshu.gov.cn/dataStorage',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'AuthToken': 'CQ2Fgiaux3Ml9qoO',
      'Authorization': 'CQ2Fgiaux3Ml9qoO'
    }
  })

  instance.interceptors.response.use(
    (response) => {
      const { data } = response
      if (data.code === 200 || data.code === 2000 || data.code === 0 || data.success === true) {
        return data
      }
      return Promise.reject(new Error(data.message || data.msg || '请求失败'))
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  globalThis.__axiosDataStorageRequest = instance
}

const dataStorageRequest = globalThis.__axiosDataStorageRequest

export default dataStorageRequest

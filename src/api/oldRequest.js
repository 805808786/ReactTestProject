import axios from 'axios'

// 使用 globalThis 缓存实例，保证 Vite HMR 热重载时不重复创建和注册
if (!globalThis.__oldRequest) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'YICALL-SECRET-KEY': 'CQ2Fgiaux3Ml9qoO'
    }
  })

  instance.interceptors.response.use(
    (response) => {
      const { data } = response
      console.log(data.data)
      if (data.code === 200 || data.code === 2000 || data.code === 0 || data.success === true) {
        return data.data
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

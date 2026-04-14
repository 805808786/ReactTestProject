import axios from 'axios'

// 今日消息接口专用的 axios 实例
// 使用 globalThis 缓存实例，保证 Vite HMR 热重载时不重复创建
if (!globalThis.__axiosDailyMessageRequest) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_YICALL_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'YICALL-SECRET-KEY': 'CQ2Fgiaux3Ml9qXxx'
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

  globalThis.__axiosDailyMessageRequest = instance
}

const dailyMessageRequest = globalThis.__axiosDailyMessageRequest

export default dailyMessageRequest

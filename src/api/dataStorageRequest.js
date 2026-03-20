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
      'Authorization': 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwZW5nY2hlbmciLCJmdWxsTmFtZSI6IuW9reaIkCIsImNTaG93SWQiOiJuNjY5bjZydTJtaHUiLCJDb21wYW55U2hvd0lEIjoiR09fOGU4MzA2ZjkyOWY5NDcwMmFkY2EyNTYyZmFhOGUwOGIiLCJEZXB0SWQiOiJbXCJHT18wMjQ2Mzc3MmY4ZGM0OWZjYTUzMjdjYmYyNjQ4MjVkOFwiXSIsIkRlcHROYW1lIjoiW1wi5oqA5pyv5pSv5pKRXCJdIiwiVXNlclNob3dJRCI6IjU1MGM3ZWRkZTcyMjk4NGQ5NDBkODNjNjg1MGYwYWFhIiwiTW9iaWxlIjoiMTM2MDU4MDkwMDciLCJFeHRlbmQiOiIiLCJBbm9ueW1vdXNTaG93SWQiOiIiLCJqdGkiOiJkNGI0NTc4MC1hZjU3LTRlZWQtOGE3Yi0wNGM4YjUxZmEzYzMiLCJVc2VyTnVtYmVyIjoiNzgzNTY4NDQiLCJpYXQiOjE3NzMyMTA1OTc2NjQsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJVc2VyIiwiQWRtaW4iLCJTdXBlckFkbWluIl0sImV4cCI6MTc3MzY0MjU5NywiaXNzIjoiaHR0cHM6Ly9iaWFwaS5nb25nc2h1Lmdvdi5jbiIsImF1ZCI6Imh0dHBzOi8vYmkuZ29uZ3NodS5nb3YuY24ifQ.8LUFYE9Zpc5l7TFXP0rQCDH9QbKEH2QEtggX6E-PU-E'
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

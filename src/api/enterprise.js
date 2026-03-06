import request from './request'

/**
 * 获取企业变化数据（按日期）
 * @param {string} changeDate - 日期，格式 YYYY-MM-DD
 */
export const getEnterpriseChangeByDate = (changeDate) => {
  return request.get('/backend/dataEnterpriseChange/getByChangeDate', {
    params: { changeDate },
  })
}

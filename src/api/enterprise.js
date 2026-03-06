import request from './request'

/**
 * 获取企业变化数据（按日期）
 * @param {string} date - 日期，格式 YYYY-MM-DD
 */
export const getEnterpriseChangeByDate = (date) => {
  return request.post('/backend/dataEnterpriseChange/getByChangeDate', { date })
}

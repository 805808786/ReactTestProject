import request from './request';

/**
 * 根据日期获取企业变化信息
 * @param {string} date - 日期字符串 'YYYY-MM-DD'
 */
export function getByChangeDate(date) {
  return request.post('/backend/dataEnterpriseChange/getByChangeDate', { date });
}

import request from './request';

/**
 * 根据日期获取企业变化信息
 * @param {string} changeDate - 日期字符串 'YYYY-MM-DD'
 */
export function getByChangeDate(changeDate) {
  return request.get('/backend/dataEnterpriseChange/getByChangeDate', {
    params: { changeDate },
  });
}

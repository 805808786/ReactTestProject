import request from './request';

/**
 * 根据日期获取企业变化信息
 * @param {string} date - 日期字符串 'YYYY-MM-DD'
 */
export function getByChangeDate(date) {
  return request.post('/backend/dataEnterpriseChange/getByChangeDate', { date });
}

/**
 * 根据日期获取详细的变化统计信息（每日变化模块）
 * @param {string} date - 日期字符串 'YYYY-MM-DD'
 */
export function getStatisticsByChangeDateType(date) {
  return request.post('/backend/dataEnterpriseChange/getStatisticsByChangeDateType', { date });
}
/**
 * 获取企业变化趋势数据
 * @param {string} startDate - 开始时间 'YYYY-MM-DD'
 * @param {string} endDate - 结束时间 'YYYY-MM-DD'
 */
export function getChangeByTime(startDate, endDate) {
  return request.post('/backend/dataEnterpriseChange/getChangeByTime', { startDate, endDate });
}
/**
 * 分页获取企业变化列表数据
 * @param {Object} params - { currentPage, pageSize, startDate, endDate }
 */
export function queryEnterpriseByTime(params) {
  return request.post('/backend/dataEnterpriseChange/queryEnterpriseByTime', params);
}

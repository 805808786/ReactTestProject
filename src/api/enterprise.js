import request from './request'

/**
 * 获取企业变化数据（按日期）
 * @param {string} date - 日期，格式 YYYY-MM-DD
 */
export const getEnterpriseChangeByDate = (date) => {
  return request.post('/backend/dataEnterpriseChange/getByChangeDate', { date }).data;
}

/**
 * 获取企业一级标签统计（全部、核心企业、重点企业、潜力企业、后备企业）
 * @param {object} params
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {number} params.pageLevel - 页面层级，默认 1
 */
export const selectEnterpriseFirstTag = ({ sceneName, pageLevel = 1 }) => {
  return request.post('/backend/sceneRadar/selectEnterpriseFirstTag', { sceneName, pageLevel })
}

/**
 * 根据标签搜索企业列表
 * @param {object} params
 * @param {number} params.pageIndex - 页码，默认 1
 * @param {number} params.pageSize - 每页数量，默认 8
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {string} params.firstTag - 一级标签，如 "全部"
 * @param {string} params.firstTagId - 一级标签 ID
 * @param {number} params.enterpriseSize - 企业规模，1-微型，2-小型，3-中型，4-大型
 * @param {string} params.street - 所属街道
 */
export const searchEnterpriseByTag = (date) => {
  return request.post('/backend/sceneRadar/searchEnterpriseByTag', { ...date })
}

/**
 * 获取企业二级标签（重点标签）
 * @param {object} params
 * @param {string} params.firstTag - 一级标签，如 "全部"
 * @param {string} params.firstTagId - 一级标签 ID
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 */
export const selectEnterpriseSecondTag = ({ firstTag, firstTagId, sceneName, selectDate }) => {
  return request.post('/backend/sceneRadar/selectEnterpriseSecondTag', { firstTag, firstTagId, sceneName, selectDate })
}

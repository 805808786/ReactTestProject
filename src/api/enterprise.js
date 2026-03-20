import request from './request'
import dataStorageRequest from './dataStorageRequest'

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

/**
 * 获取业务时间的数据统计信息
 * @param {object} params
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 */
export const getDataCountInfo = ({ selectDate, sceneName }) => {
  return request.post('/backend/sceneRadar/dataCountInfo', { selectDate, sceneName })
}

/**
 * 获取企业基本信息
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesInfoById = ({ enterpriseId, isOriginalDate = true, communityCode = null, platform = 1 }) => {
  return dataStorageRequest.post('/enterprise/board/getSslmEnterprisesInfoById', {
    enterpriseId,
    isOriginalDate,
    communityCode,
    platform
  })
}

/**
 * 获取企业标签信息
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesTagListById = ({ enterpriseId, isOriginalDate = true, communityCode = null, platform = 1 }) => {
  return dataStorageRequest.post('/enterprise/board/getSslmEnterprisesTagListById', {
    enterpriseId,
    isOriginalDate,
    communityCode,
    platform
  })
}

/**
 * 获取企业服务与产品数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageSize=9999] - 每页数量
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const dataService = ({ enterpriseId, isOriginalDate = true, pageSize = 9999, communityCode = null, platform = 1 }) => {
  return dataStorageRequest.post('/enterprise/board/dataService', {
    enterpriseId,
    isOriginalDate,
    pageSize,
    communityCode,
    platform
  })
}

/**
 * 获取企业专利信息
 * @param {object} params
 * @param {string} params.name - 企业名称
 * @param {string} [params.type='2'] - 类型，固定值为"2"
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectListByName = ({ name, type = '2', platform = 1 }) => {
  return dataStorageRequest.post('/tianDaoJinKe/selectListByName', {
    name,
    type,
    platform
  })
}

/**
 * 获取企业软件著作权信息
 * @param {object} params
 * @param {string} params.name - 企业名称
 * @param {string} [params.type='3'] - 类型，固定值为"3"
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectCopyrightListByName = ({ name, type = '3', platform = 1 }) => {
  return dataStorageRequest.post('/tianDaoJinKe/selectListByName', {
    name,
    type,
    platform
  })
}

/**
 * 获取企业商业模式总结
 * @param {object} params
 * @param {number} [params.type=2] - 类型，固定值为2
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesInfoEntityById = ({ type = 2, enterpriseId, isOriginalDate = true, platform = 1 }) => {
  return dataStorageRequest.post('/enterprise/board/getSslmEnterprisesInfoEntityById', {
    type,
    enterpriseId,
    isOriginalDate,
    platform
  })
}

/**
 * 获取企业商业模式详情（盈利模式、核心竞争力、上下游关系）
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} params.businessType - 业务类型：1-盈利模式，2-核心竞争力，5-上下游关系
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesById = ({ enterpriseId, isOriginalDate = true, businessType, platform = 1 }) => {
  return dataStorageRequest.post('/enterprise/board/getSslmEnterprisesById', {
    enterpriseId,
    isOriginalDate,
    businessType,
    platform
  })
}
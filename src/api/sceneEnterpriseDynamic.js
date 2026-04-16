import dailyMessageRequest from './dailyMessageRequest'

/**
 * 获取新闻详情
 * POST /backend/newsInsight/detail
 * @param {object} params
 * @param {number} params.id - 新闻 ID
 */
export const getNewsInsightDetail = ({ id }) => {
  return dailyMessageRequest.post('/backend/newsInsight/detail', { id })
}

/**
 * 获取新闻的关联新闻
 * POST /backend/newsInsight/getAllRelatedNews
 * @param {object} params
 * @param {number} params.id - 新闻 ID
 */
export const getNewsInsightAllRelatedNews = ({ id }) => {
  return dailyMessageRequest.post('/backend/newsInsight/getAllRelatedNews', { id })
}


/**
 * 获取新闻类型列表
 * GET /backend/newsInsight/getNewsTypeList
 */
export const getNewsTypeList = () => {
  return dailyMessageRequest.get('/backend/newsInsight/getNewsTypeList')
}

/**
 * 获取新闻来源列表
 * GET /backend/newsInsight/getNewsSourceList
 */
export const getNewsSourceList = () => {
  return dailyMessageRequest.get('/backend/newsInsight/getNewsSourceList')
}

/**
 * 新闻动态分页查询
 * POST /backend/newsInsight/page
 * @param {object} params
 */
export const getNewsInsightPage = (params) => {
  return dailyMessageRequest.post('/backend/newsInsight/page', params)
}

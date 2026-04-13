import dailyMessageRequest from './dailyMessageRequest'

/**
 * 获取领导看板锦囊列表（今日消息列表）
 * @param {object} params
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.cardType] - 类型筛选：1=每日推荐 2=新闻动态 3=与我相关
 * @param {string} [params.selectDate] - 日期筛选，格式 YYYY-MM-DD
 */
export const getDailyMessageList = ({ pageIndex = 1, pageSize = 10, cardType, selectDate }) => {
  return dailyMessageRequest.post('/backend/leaderBoard/selectJinnangList', {
    pageIndex,
    pageSize,
    cardType,
    selectDate
  })
}

/**
 * 获取领导看板锦囊详情（今日消息详情）
 * @param {object} params
 * @param {string|number} params.id - 锦囊 ID
 */
export const getDailyMessageDetail = ({ id }) => {
  return dailyMessageRequest.post('/backend/leaderBoard/getJinnangDetail', { id })
}

import dailyMessageRequest from './dailyMessageRequest'

/**
 * 获取领导看板锦囊列表（今日消息列表）
 * POST /client/recommend/listLeaderBoard
 * @param {object} params
 * @param {number} [params.currentPage=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.cardType] - 卡片分类：1=每日推荐 2=新闻动态 3=与我相关
 * @param {string} [params.startTime] - 发布时间开始，格式 yyyy-MM-dd
 * @param {string} [params.endTime] - 发布时间结束，格式 yyyy-MM-dd
 */
export const getDailyMessageList = ({ currentPage = 1, pageSize = 10, cardType, startTime, endTime }) => {
  return dailyMessageRequest.post('/client/recommend/listLeaderBoard', {
    currentPage,
    pageSize,
    cardType,
    startTime,
    endTime
  })
}

/**
 * 获取领导看板锦囊详情（今日消息详情）
 * POST /client/recommend/leaderBoardInfo
 * @param {object} params
 * @param {number} params.id - 锦囊 ID
 */
export const getDailyMessageDetail = ({ id }) => {
  return dailyMessageRequest.post('/client/recommend/leaderBoardInfo', { id })
}

/**
 * 新增评论（用户反馈）
 * POST /client/comment/add
 * @param {object} params
 * @param {number} params.recommendId - 锦囊 ID
 * @param {string} params.content - 评论内容
 */
export const addFeedback = ({ recommendId, content }) => {
  return dailyMessageRequest.post('/client/comment/add', {
    recommendId,
    content
  })
}

/**
 * 统计未读数量
 * POST /client/recommend/countUnread
 */
export const countUnread = () => {
  return dailyMessageRequest.post('/client/recommend/countUnread')
}

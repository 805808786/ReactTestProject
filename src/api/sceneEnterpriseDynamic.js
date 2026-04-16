import dailyMessageRequest from "./dailyMessageRequest";

/**
 * 获取新闻详情
 * POST /backend/newsInsight/detail
 * @param {object} params
 * @param {number} params.id - 新闻 ID
 */
export const getNewsInsightDetail = ({ id }) => {
  return dailyMessageRequest.post("/backend/newsInsight/detail", { id });
};

/**
 * 获取新闻的关联新闻
 * POST /backend/newsInsight/getAllRelatedNews
 * @param {object} params
 * @param {number} params.id - 新闻 ID
 */
export const getNewsInsightAllRelatedNews = ({ id }) => {
  return dailyMessageRequest.post("/backend/newsInsight/getAllRelatedNews", {
    id,
  });
};

/**
 * 获取新闻类型列表
 * GET /backend/newsInsight/getNewsTypeList
 */
export const getNewsTypeList = () => {
  return dailyMessageRequest.get("/backend/newsInsight/getNewsTypeList");
};

/**
 * 获取新闻来源列表
 * GET /backend/newsInsight/getNewsSourceList
 */
export const getNewsSourceList = () => {
  return dailyMessageRequest.get("/backend/newsInsight/getNewsSourceList");
};

/**
 * 新闻动态分页查询
 * POST /backend/newsInsight/page
 * @param {object} params
 */
export const getNewsInsightPage = (params) => {
  return dailyMessageRequest.post("/backend/newsInsight/page", params);
};

/**
 * 场景概览-场景动态-新闻数量
 * POST /backend/newsInsight/getSceneNewsOverview
 * @param {object} params
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 */
export const getSceneNewsOverview = ({ sceneName }) => {
  return dailyMessageRequest.post("/backend/newsInsight/getSceneNewsOverview", {
    sceneName,
  });
};

/**
 * 走访首页统计
 * GET /backend/newsInsight/getVisitIndexInfo
 * @param {object} params
 * @param {string} params.date - 日期，格式 YYYY-MM-DD
 * @param {string} params.sceneName - 场景名称
 */
export const getVisitIndexInfo = ({ date, sceneName } = {}) => {
  return dailyMessageRequest.get("/backend/newsInsight/getVisitIndexInfo", {
    params: {
      date,
      sceneName,
    },
  });
};

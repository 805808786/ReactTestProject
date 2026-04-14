import request from "./request";
import dataStorageRequest from "./dataStorageRequest";
import dailyMessageRequest from "./dailyMessageRequest";
import oldRequest from "./oldRequest";
/**
 * 获取企业变化数据（按日期）
 * @param {string} date - 日期，格式 YYYY-MM-DD
 */
export const getEnterpriseChangeByDate = (date) => {
  return oldRequest.post("/backend/dataEnterpriseChange/getByChangeDate", {
    date,
  });
};

/**
 * 获取企业一级标签统计（全部、核心企业、重点企业、潜力企业、后备企业）
 * @param {object} params
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {number} params.pageLevel - 页面层级，默认 1
 */
export const selectEnterpriseFirstTag = ({ sceneName, pageLevel = 1 }) => {
  return request.post("/backend/sceneRadar/selectEnterpriseFirstTag", {
    sceneName,
    pageLevel,
  });
};

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
  return request.post("/backend/sceneRadar/searchEnterpriseByTag", { ...date });
};

/**
 * 获取企业二级标签（重点标签）
 * @param {object} params
 * @param {string} params.firstTag - 一级标签，如 "全部"
 * @param {string} params.firstTagId - 一级标签 ID
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 */
export const selectEnterpriseSecondTag = ({
  firstTag,
  firstTagId,
  sceneName,
  selectDate,
}) => {
  return request.post("/backend/sceneRadar/selectEnterpriseSecondTag", {
    firstTag,
    firstTagId,
    sceneName,
    selectDate,
  });
};

/**
 * 获取业务时间的数据统计信息
 * @param {object} params
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 */
export const getDataCountInfo = ({ selectDate, sceneName }) => {
  return request.post("/backend/sceneRadar/dataCountInfo", {
    selectDate,
    sceneName,
  });
};

/**
 * 获取场景概览（企业总数、变化企业数、动态总数、动态变化数）
 * @param {object} params
 * @param {string} params.selectDate - 选择日期，格式 YYYY-MM-DD
 * @param {string} params.sceneName - 场景名称，如 "人工智能"
 * @param {string} [params.firstTag] - 一级标签
 * @param {number} [params.firstTagId] - 一级标签 ID
 */
export const getSceneOverview = ({
  selectDate,
  sceneName,
  firstTag,
  firstTagId,
}) => {
  return request.post("/backend/sceneRadar/getSceneOverview", {
    selectDate,
    sceneName,
    firstTag,
    firstTagId,
  });
};

/**
 * 获取场景发布详细信息
 * @param {object} params
 * @param {number} params.id - 场景发布信息 ID
 */
export const getSceneReleaseInfo = ({ id }) => {
  return request.post("/backend/sceneRadar/sceneReleaseInfo", { id });
};

/**
 * 获取走访动态列表
 * @param {object} params
 * @param {string} [params.department] - 部门名称
 * @param {number} [params.timeType] - 时间类型：1-今日，2-近一周，3-近一月，4-近三月，5-近半年
 * @param {string} [params.keywords] - 关键词
 */
export const getEnterpriseNewsList = ({ department, timeType, keywords }) => {
  return dailyMessageRequest.post(
    "/backend/newsInsight/getEnterpriseNewsList",
    {
      department,
      timeType,
      keywords,
    },
  );
};

/**
 * 获取部门列表
 */
export const getDepartmentList = () => {
  return dailyMessageRequest.get("/backend/newsInsight/getDepartmentList");
};

/**
 * 获取企业基本信息
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesInfoById = ({
  enterpriseId,
  isOriginalDate = true,
  communityCode = null,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/getSslmEnterprisesInfoById",
    {
      enterpriseId,
      isOriginalDate,
      communityCode,
      platform,
    },
  );
};

/**
 * 获取企业标签信息
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesTagListById = ({
  enterpriseId,
  isOriginalDate = true,
  communityCode = null,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/getSslmEnterprisesTagListById",
    {
      enterpriseId,
      isOriginalDate,
      communityCode,
      platform,
    },
  );
};

/**
 * 获取企业服务与产品数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageSize=9999] - 每页数量
 * @param {string|null} [params.communityCode=null] - 社区编码
 * @param {number} [params.platform=1] - 平台标识
 */
export const dataService = ({
  enterpriseId,
  isOriginalDate = true,
  pageSize = 9999,
  communityCode = null,
  platform = 1,
}) => {
  return dataStorageRequest.post("/enterprise/board/dataService", {
    enterpriseId,
    isOriginalDate,
    pageSize,
    communityCode,
    platform,
  });
};

/**
 * 获取企业专利信息
 * @param {object} params
 * @param {string} params.name - 企业名称
 * @param {string} [params.type='2'] - 类型，固定值为"2"
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectListByName = ({ name, type = "2", platform = 1 }) => {
  return dataStorageRequest.post("/tianDaoJinKe/selectListByName", {
    name,
    type,
    platform,
  });
};

/**
 * 获取企业软件著作权信息
 * @param {object} params
 * @param {string} params.name - 企业名称
 * @param {string} [params.type='3'] - 类型，固定值为"3"
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectCopyrightListByName = ({
  name,
  type = "3",
  platform = 1,
}) => {
  return dataStorageRequest.post("/tianDaoJinKe/selectListByName", {
    name,
    type,
    platform,
  });
};

/**
 * 获取企业商业模式总结
 * @param {object} params
 * @param {number} [params.type=2] - 类型，固定值为2
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesInfoEntityById = ({
  type = 2,
  enterpriseId,
  isOriginalDate = true,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/getSslmEnterprisesInfoEntityById",
    {
      type,
      enterpriseId,
      isOriginalDate,
      platform,
    },
  );
};

/**
 * 获取企业商业模式详情（盈利模式、核心竞争力、上下游关系）
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} params.businessType - 业务类型：1-盈利模式，2-核心竞争力，5-上下游关系
 * @param {number} [params.platform=1] - 平台标识
 */
export const getSslmEnterprisesById = ({
  enterpriseId,
  isOriginalDate = true,
  businessType,
  platform = 1,
}) => {
  return dataStorageRequest.post("/enterprise/board/getSslmEnterprisesById", {
    enterpriseId,
    isOriginalDate,
    businessType,
    platform,
  });
};

/**
 * 获取企业人才数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} [params.type='4'] - 类型，固定值为"4"
 * @param {number} [params.platform=1] - 平台标识
 */
export const getEnterpriseTalent = ({
  enterpriseId,
  isOriginalDate = true,
  type = "4",
  platform = 1,
}) => {
  return dataStorageRequest.post("/tianDaoJinKe/selectListByName", {
    enterpriseId,
    isOriginalDate,
    type,
    platform,
  });
};

/**
 * 获取企业税收趋势数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {string} params.enterpriseName - 企业名称
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectListBuildingTrends = ({
  enterpriseId,
  enterpriseName,
  platform = 1,
}) => {
  return dataStorageRequest.post("/building/selectListBuildingTrends", {
    enterpriseId,
    enterpriseName,
    platform,
  });
};

/**
 * 获取企业政策兑现标题
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.platform=1] - 平台标识
 */
export const queryPolicyRedemptionTotal = ({
  enterpriseId,
  isOriginalDate = true,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/queryPolicyRedemptionTotal",
    {
      enterpriseId,
      isOriginalDate,
      platform,
    },
  );
};

/**
 * 获取企业政策兑现列表
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const queryPolicyRedemptionPage = ({
  enterpriseId,
  isOriginalDate = true,
  pageIndex = 1,
  pageSize = 10,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/queryPolicyRedemptionPage",
    {
      enterpriseId,
      isOriginalDate,
      pageIndex,
      pageSize,
      platform,
    },
  );
};

/**
 * 获取企业需求数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageSize=9999] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const modelPredictionDemand = ({
  enterpriseId,
  isOriginalDate = true,
  pageSize = 9999,
  platform = 1,
}) => {
  return dataStorageRequest.post("/enterprise/board/modelPredictionDemand", {
    enterpriseId,
    isOriginalDate,
    pageSize,
    platform,
  });
};

/**
 * 获取企业融资数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const getFinancingInfo = ({
  enterpriseId,
  isOriginalDate = true,
  pageIndex = 1,
  pageSize = 10,
  platform = 1,
}) => {
  return dataStorageRequest.post("/business/community/financingList", {
    enterpriseId,
    isOriginalDate,
    pageIndex,
    pageSize,
    platform,
  });
};

/**
 * 获取企业招投标数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const getBidInfo = ({
  enterpriseId,
  isOriginalDate = true,
  pageIndex = 1,
  pageSize = 10,
  platform = 1,
}) => {
  return dataStorageRequest.post("/business/community/bidList", {
    enterpriseId,
    isOriginalDate,
    pageIndex,
    pageSize,
    platform,
  });
};

/**
 * 获取企业股权穿透信息
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.platform=1] - 平台标识
 */
export const getEnterpriseEquityPenetrationInfo = ({
  enterpriseId,
  isOriginalDate = true,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/enterprise/board/getEnterpriseEquityPenetrationInfo",
    {
      enterpriseId,
      isOriginalDate,
      platform,
    },
  );
};

/**
 * 获取企业服务矩阵数据
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} [params.type='1'] - 类型，固定值为"1"
 * @param {string} params.level - 层级，如"省级层面"、"市级层面"、"区级层面"、"街道层面"
 * @param {number} [params.platform=1] - 平台标识
 */
export const serviceMatrixList = ({
  enterpriseId,
  isOriginalDate = true,
  type = "1",
  level,
  platform = 1,
}) => {
  return dataStorageRequest.post("/enterprise/board/serviceMatrixList", {
    enterpriseId,
    isOriginalDate,
    type,
    level,
    platform,
  });
};

/**
 * 获取企业走访记录
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} params.enterpriseName - 企业名称
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=999] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const selectEnterpriseVisitsList = ({
  enterpriseId,
  isOriginalDate = true,
  enterpriseName,
  pageIndex = 1,
  pageSize = 999,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/business/community/selectEnterpriseVisitsList",
    {
      enterpriseId,
      isOriginalDate,
      enterpriseName,
      pageIndex,
      pageSize,
      platform,
    },
  );
};

/**
 * 获取企业诉求
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {number} [params.platform=1] - 平台标识
 */
export const getBusinessCommunityEnterpriseAppealPage = ({
  enterpriseId,
  isOriginalDate = true,
  pageIndex = 1,
  pageSize = 10,
  platform = 1,
}) => {
  return dataStorageRequest.post(
    "/business/community/getBusinessCommunityEnterpriseAppealPage",
    {
      enterpriseId,
      isOriginalDate,
      pageIndex,
      pageSize,
      platform,
    },
  );
};

/**
 * 获取企业变更数据
 * @param {object} params
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} params.enterpriseName - 企业名称
 */
export const getBusinessCommunityEnterpriseNewsPage = ({
  pageIndex = 1,
  pageSize = 10,
  enterpriseId,
  isOriginalDate = true,
  enterpriseName,
}) => {
  return dataStorageRequest.post(
    "/business/community/getBusinessCommunityEnterpriseNewsPage",
    {
      pageIndex,
      pageSize,
      enterpriseId,
      isOriginalDate,
      enterpriseName,
    },
  );
};

/**
 * 获取企业风险数据
 * @param {object} params
 * @param {number} [params.pageIndex=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} params.enterpriseName - 企业名称
 */
export const getManageRiskEarlyWarningPage = ({
  pageIndex = 1,
  pageSize = 10,
  enterpriseId,
  isOriginalDate = true,
  enterpriseName,
}) => {
  return dataStorageRequest.post(
    "/business/community/getManageRiskEarlyWarningPage",
    {
      pageIndex,
      pageSize,
      enterpriseId,
      isOriginalDate,
      enterpriseName,
    },
  );
};

/**
 * 获取生命周期模块定义
 * @param {object} params
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} params.enterpriseName - 企业名称
 */
export const enterpriseDynamicArchivesCount = ({
  enterpriseId,
  isOriginalDate = true,
  enterpriseName,
}) => {
  return dataStorageRequest.post(
    "/business/community/enterpriseDynamicArchivesCount",
    {
      enterpriseId,
      isOriginalDate,
      enterpriseName,
    },
  );
};

/**
 * 获取生命周期集合数据
 * @param {object} params
 * @param {string} params.frontendId - 前端组件ID
 * @param {string} params.type - 类型
 * @param {number} [params.pageLevel=1] - 页面层级
 * @param {string} params.enterpriseId - 企业 ID
 * @param {boolean} [params.isOriginalDate=true] - 是否原始日期
 * @param {string} params.enterpriseName - 企业名称
 */
export const enterpriseDynamicArchivesList = ({
  frontendId,
  type,
  pageLevel = 1,
  enterpriseId,
  isOriginalDate = true,
  enterpriseName,
}) => {
  return dataStorageRequest.post(
    "/business/community/enterpriseDynamicArchivesList",
    {
      frontendId,
      type,
      pageLevel,
      enterpriseId,
      isOriginalDate,
      enterpriseName,
    },
  );
};

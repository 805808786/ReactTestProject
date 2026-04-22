import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import iconNewspaper from "../assets/icon-dynamic-newspaper.svg";
import iconCalendar from "../assets/icon-dynamic-calendar.svg";
import iconBuilding from "../assets/icon-dynamic-building.svg";
import iconDept from "../assets/icon-dynamic-dept.svg";
import iconLinkBlue from "../assets/icon-link-blue.svg";
import iconFeedback from "../assets/icon-feedback.svg";
import iconClose from "../assets/icon-close.svg";
import iconChevronDownBlue from "../assets/icon-cd-chevron-down-blue.svg";
import "./DailyMessageDetail.css";
import PageHeader from "../components/PageHeader";
import { getDailyMessageDetail, addFeedback } from "../api/dailyMessage";
import {
  getNewsInsightDetail,
  getNewsInsightAllRelatedNews,
} from "../api/sceneEnterpriseDynamic";
import { getSslmEnterprisesInfoById } from "../api/enterprise";

const CARD_TYPE_CATEGORY_MAP = {
  1: "recommend",
  2: "news",
  3: "related",
  4: "service",
  5: "dig",
  recommend: "recommend",
  news: "news",
  related: "related",
  service: "service",
  dig: "dig"
};

const CARD_TYPE_TAG_MAP = {
  1: "每日推荐",
  2: "新闻动态",
  3: "与我相关",
  4: "精准服务",
  5: "企业挖掘"
};

const DEFAULT_DETAIL = {
  type: "",
  category: "",
  title: "加载中...",
  date: "",
  source: "",
  summary: "",
  paragraphs: [],
  relatedCompanies: [],
  relatedDepartments: [],
  serviceBackground: "",
  serviceOpinion: "",
  serviceProgress: "",
  serviceProcesses: [],
  progressAttachments: [],
  richTextContent: null,
};

const SERVICE_TASK_STATUS_MAP = {
  0: { label: "待开始", className: "pending" },
  1: { label: "进行中", className: "processing" },
  2: { label: "已完成", className: "done" },
};

function getAttachmentPreviewUrl(attachment) {
  if (!attachment) return "";
  return attachment.routePath || attachment.filePath || "";
}

function getAttachmentDisplayName(attachment, index) {
  if (!attachment) return `附件${index + 1}`;
  return attachment.fileName || attachment.routeTitle || `附件${index + 1}`;
}

function formatDateToDay(str) {
  if (!str) return "";
  const match = String(str).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }
  return str;
}

function mapApiDetailToData(apiData) {
  if (!apiData) return null;
  const cardType = apiData.cardType;
  const category = CARD_TYPE_CATEGORY_MAP[cardType] || "";
  const tagText = CARD_TYPE_TAG_MAP[cardType] || "";

  // 基础字段
  const result = {
    type: tagText,
    category,
    title: apiData.title || "",
    summary: apiData.cardType == 5 ? apiData.remark : apiData.content || apiData.richTextContent || null,
    date: formatDateToDay(apiData.publishTime || apiData.gmtCreate || ""),
    source: "",
    sourceLink: null,
    paragraphs: [],
    relatedCompanies: [],
    relatedDepartments: [],
    link: null,
    richTextContent: apiData.richTextContent || null,
    serviceBackground: "",
    serviceOpinion: "",
    serviceProgress: "",
    serviceProcesses: [],
    progressAttachments: [],

  };

  if (cardType === 1) {
    // 每日推荐：关联企业信息
    if (apiData.enterpriseId) {
      result.link = `/company-detail/${apiData.enterpriseId}`;
    }
    if (apiData.enterpriseIntroduction) {
      result.paragraphs = [apiData.enterpriseIntroduction];
    }
  } else if (cardType === 2 || cardType === 3) {
    // 新闻动态 / 与我相关：关联新闻信息
    result.source = apiData.newsSource || "";
    if (apiData.articleUrl) {
      result.sourceLink = {
        url: apiData.articleUrl,
        label: apiData.newsSource || "查看原文",
      };
    }
  } else if (cardType === 4) {
    result.summary = "";
    result.richTextContent = apiData.content || apiData.richTextContent || null;
    result.serviceBackground = apiData.serviceBackground || "";
    result.serviceOpinion = apiData.serviceOpinion || "";
    result.serviceProgress = apiData.serviceProgress || "";
    result.progressAttachments = apiData.progressAttachments || [];
    result.serviceProcesses = (apiData.serviceProcesses || []).map(
      (process, processIndex) => ({
        id: process.id || `process-${processIndex}`,
        enterpriseId: process.enterpriseId,
        serviceTargetName:
          process.serviceTargetName || process.enterpriseName || "",
        tasks: (process.taskList || []).map((task, taskIndex) => ({
          id: task.id || `${process.id || processIndex}-${taskIndex}`,
          taskContent: task.taskContent || "",
          status: task.status,
          leadOrgName: task.leadOrgName || "",
          feedbackResult: task.feedbackResult || "",
          feedbackDate: formatDateToDay(task.feedbackDate || ""),
        })),
      }),
    );
  }

  return result;
}

function getServiceTaskStatus(status) {
  return SERVICE_TASK_STATUS_MAP[status] || SERVICE_TASK_STATUS_MAP[0];
}

export default function SceneEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(DEFAULT_DETAIL);
  const [expandedServiceTaskKey, setExpandedServiceTaskKey] = useState(null);
  const [attachmentSheetOpen, setAttachmentSheetOpen] = useState(false);
  const processPanelRefs = useRef({});
  const hasScrolledToProcess = useRef(false);

  // 反馈弹框状态
  const [loading, setLoading] = useState(true);

  // 反馈弹框状态
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const FEEDBACK_MAX_LENGTH = 500;

  useEffect(() => {
    const fetchNewsDetail = async (newsContentId) => {
      try {
        const newsResponse = await getNewsInsightDetail({ id: newsContentId });
        const newsData = newsResponse.data;
        if (newsData) {
          setData((prev) => ({
            ...prev,
            relatedCompanies: (newsData.enterpriseList || []).map((e) => ({
              id: e.enterpriseId,
              name: e.enterpriseName,
            })),
            relatedDepartments: (newsData.orgList || []).map((o) => ({
              id: o.platformOrgId,
              name: o.platformOrgName,
            })),
          }));
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };
    const fetchNewsInsightAllRelatedNews = async (newsContentId) => {
      try {
        const newsResponse = await getNewsInsightAllRelatedNews({
          id: newsContentId,
        });
        const newsData = newsResponse.data;
        if (newsData) {
          setData((prev) => ({
            ...prev,
            allRelatedNews: newsData,
          }));
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };
    const fetchEnterpriseDetail = async (enterpriseId) => {
      try {
        const enterpriseResponse = await getSslmEnterprisesInfoById({
          enterpriseId,
        });
        const enterpriseData = enterpriseResponse.data;
        if (enterpriseData) {
          setData((prev) => ({
            ...prev,
            paragraphs: [enterpriseData.enterpriseIntroduction],
          }));
        }
      } catch (error) {
        console.error("Error fetching enterprise detail:", error);
      }
    };

    const fetchDetail = async () => {
      try {
        const response = await getDailyMessageDetail({ id });
        const apiData = response.data;
        if (apiData) {
          setExpandedServiceTaskKey(null);
          setAttachmentSheetOpen(false);
          setData(mapApiDetailToData(apiData));
          const cardType = apiData.cardType;
          const newsContentId = apiData.newsContentId;
          const enterpriseId = apiData.enterpriseId;
          if (cardType === 1 && enterpriseId) {
            await fetchEnterpriseDetail(enterpriseId);
          }
          if ((cardType === 2 || cardType === 3) && newsContentId) {
            await fetchNewsDetail(newsContentId);
            await fetchNewsInsightAllRelatedNews(newsContentId);
          }
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      }
    };

    fetchDetail().finally(() => setLoading(false));
  }, [id]);

  // 数据加载后自动滚动到指定 processId
  useEffect(() => {
    const targetProcessId = searchParams.get("processId");
    if (!targetProcessId || !data.serviceProcesses?.length || hasScrolledToProcess.current) return;

    const targetProcess = data.serviceProcesses.find(
      (p) => String(p.id) === String(targetProcessId)
    );
    if (!targetProcess) return;

    // 展开第一个任务的反馈
    const firstTask = targetProcess.tasks?.[0];
    if (firstTask) {
      const taskKey = `${targetProcess.id}-${firstTask.id}-0`;
      setExpandedServiceTaskKey(taskKey);
    }

    // 等待渲染后滚动
    requestAnimationFrame(() => {
      const el = processPanelRefs.current[targetProcess.id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        hasScrolledToProcess.current = true;
      }
    });
  }, [data.serviceProcesses, searchParams]);

  const handleFeedbackOpen = useCallback(() => {
    setFeedbackContent("");
    setFeedbackOpen(true);
  }, []);

  const handleFeedbackClose = useCallback(() => {
    setFeedbackOpen(false);
    setFeedbackContent("");
  }, []);

  const handleServiceTaskToggle = useCallback((taskKey) => {
    setExpandedServiceTaskKey((prev) => (prev === taskKey ? null : taskKey));
  }, []);

  const handlePreviewAttachment = useCallback(
    (attachment, index) => {
      const previewUrl = getAttachmentPreviewUrl(attachment);
      if (!previewUrl) return;
      const attachmentName = getAttachmentDisplayName(attachment, index);
      setAttachmentSheetOpen(false);
      navigate(
        `/pdf-preview?url=${encodeURIComponent(previewUrl)}&name=${encodeURIComponent(attachmentName)}`,
      );
    },
    [navigate],
  );

  const handleProgressPreview = useCallback(() => {
    const attachments = data.progressAttachments || [];
    if (attachments.length === 0) return;
    if (attachments.length === 1) {
      handlePreviewAttachment(attachments[0], 0);
      return;
    }
    setAttachmentSheetOpen(true);
  }, [data.progressAttachments, handlePreviewAttachment]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackContent.trim() || feedbackSubmitting) return;
    setFeedbackSubmitting(true);
    try {
      await addFeedback({
        recommendId: Number(id),
        content: feedbackContent.trim(),
      });
      setFeedbackOpen(false);
      setFeedbackContent("");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackContent, feedbackSubmitting, id]);

  function getTitle() {
    return data.category == "recommend" ? "每日推荐" : data.type;
  }

  const isServiceDetail = data.category === "service";

  console.log(data)

  const serviceBackgroundContent =
    data.richTextContent || data.content || "";
  const hasProgressAttachments = (data.progressAttachments || []).length > 0;


  return (
    <div className="dmd-container">
      {/* ===== 头部 ===== */}
      {/* <div className="dmd-header">
        <div className="dmd-header-row">
          <button className="dmd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="dmd-header-title">动态详情</span>
        </div>
      </div> */}
      <PageHeader title={getTitle()} />

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="dmd-body">
        {loading ? (
          <div className="dmd-loading">
            <div className="dmd-loading-spinner" />
            <span className="dmd-loading-text">加载中...</span>
          </div>
        ) : isServiceDetail ? (
          <>
            <div className="dmd-card dmd-service-top-card">
              <div className="dmd-card-content dmd-service-top-card-content">
                <div className="dmd-service-header">
                  <img
                    src={iconBuilding}
                    alt="精准服务"
                    width={20}
                    height={20}
                  />
                  <span className="dmd-service-title">{data.title}</span>
                </div>
                <div className="dmd-service-date-row">
                  <img src={iconCalendar} alt="日期" width={12} height={12} />
                  <span className="dmd-service-date-text">
                    日期：{data.date}
                  </span>
                </div>
                <div className="dmd-service-section-title">进度总结</div>
                {serviceBackgroundContent && (
                  <div className="dmd-service-background-box">
                    <div
                      className="dmd-service-rich-text dmd-service-background-text"
                      dangerouslySetInnerHTML={{
                        __html: serviceBackgroundContent,
                      }}
                    />
                  </div>
                )}
                {hasProgressAttachments && (
                  <div className="dmd-service-progress-actions">
                    <button
                      type="button"
                      className="dmd-service-progress-btn"
                      onClick={handleProgressPreview}
                    >
                      查看办理详情
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 服务清单 */}
            {data.serviceProcesses && data.serviceProcesses.length > 0 && (() => {
              const totalTasks = data.serviceProcesses.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
              return (
                <>
                  <p className="dmd-service-list-label">
                    服务清单（{data.serviceProcesses.length}家企业 · {totalTasks}项事宜）
                  </p>
                  {data.serviceProcesses.map((process) => (
                    <div
                      key={process.id}
                      className="dmd-service-company-card"
                      ref={(el) => { processPanelRefs.current[process.id] = el; }}
                      onClick={() => navigate(`/daily-message-detail-info/${id}?processId=${process.id}`)}
                    >
                      <div className="dmd-service-company-header">
                        <div className="dmd-service-company-badge">
                          {process.serviceTargetName}
                        </div>
                        <span className="dmd-service-company-count">{process.tasks?.length || 0}项事宜</span>
                      </div>
                      <div className="dmd-service-company-divider" />
                      {(process.tasks || []).map((task, taskIndex) => (
                        <div key={task.id}>
                          <div className="dmd-service-task-row">
                            <div className="dmd-service-task-dept">{task.leadOrgName}</div>
                            <span className="dmd-service-task-arrow">→</span>
                            <p className="dmd-service-task-text">{task.taskContent}</p>
                          </div>
                          {taskIndex < (process.tasks.length - 1) && (
                            <div className="dmd-service-task-divider" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              );
            })()}
          </>
        ) : (
          <>
            {/* ===== 动态基本信息卡片 ===== */}
            <div className="dmd-card">
              <div className="dmd-card-content">
                {/* 顶部信息区域 */}
                <div className="dmd-info-section">
                  {/* 类型标签 */}
                  <div className="dmd-badge-wrapper">
                    <div className={`dmd-badge dmd-badge--${data.category}`}>
                      {data.type}
                    </div>
                  </div>

                  {/* 标题行 */}
                  <div className="dmd-title-row">
                    <div className="dmd-title-inner">
                      <div
                        className={`dmd-green-dot dmd-green-dot--${data.category}`}
                      />
                      <span className="dmd-title">{data.title}</span>
                    </div>
                  </div>

                  {/* 来源 + 日期行 */}
                  <div className="dmd-meta-row-wrapper">
                    <div className="dmd-meta-row">
                      {data.source && (
                        <div className="dmd-meta-item">
                          <img
                            src={iconNewspaper}
                            alt="来源"
                            width={12}
                            height={12}
                          />
                          <span className="dmd-meta-text">{data.source}</span>
                        </div>
                      )}
                      <div className="dmd-meta-item">
                        <img
                          src={iconCalendar}
                          alt="日期"
                          width={12}
                          height={12}
                        />
                        <span className="dmd-meta-text">{data.date}</span>
                      </div>
                    </div>
                    {data.category == "recommend" && data.link && (
                      <div className="dmd-meta-item">
                        <a
                          className="dmd-link-text"
                          onClick={() => navigate(data.link)}
                        >
                          查看企业 →
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="dmd-separator" />

                {/* 摘要区域 */}
                <div className="dmd-summary-box">
                  <p className="dmd-summary-text">
                    {data.category == "recommend" ? (
                      <span className="dmd-summary--bold">推荐理由：</span>
                    ) : (
                      <span className="dmd-summary--bold">摘要: </span>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: data.summary }} />
                  </p>
                </div>



                {/* 正文段落 */}
                {data.paragraphs && data.paragraphs.length > 0 ? (
                  data.category == "recommend" ? (
                    <div className="dmd-summary-box">
                      <p className="dmd-summary-text">
                        <span className="dmd-summary--green">企业简介：</span>{" "}
                        {data.paragraphs[0]}
                      </p>
                    </div>
                  ) : (
                    <div className="dmd-paragraphs">
                      {data.paragraphs.map((para, index) => (
                        <p key={index} className="dmd-paragraph">
                          {para}
                        </p>
                      ))}
                    </div>
                  )
                ) : null}

                {/* 富文本内容 */}
                {/* {data.richTextContent && (
                  <div
                    className="dmd-rich-content"
                    dangerouslySetInnerHTML={{ __html: data.richTextContent }}
                  />
                )} */}

                {/* 挖掘内容 */}
                {
                  data.category == "dig" && data.richTextContent ? <div className="dmd-summary-box">
                    <p className="dmd-summary-text">
                      <div dangerouslySetInnerHTML={{ __html: data.richTextContent }} />
                    </p>
                  </div> : (
                    <div
                      className="dmd-rich-content"
                      dangerouslySetInnerHTML={{ __html: data.richTextContent }}
                    />
                  )
                }

                {/* 来源链接按钮 */}
                {data.sourceLink && (
                  <div className="dmd-source-link">
                    <a
                      className="dmd-source-link-btn"
                      href={data.sourceLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="dmd-source-link-icon">
                        <img
                          src={iconLinkBlue}
                          alt="🔗"
                          width={16}
                          height={16}
                        />
                      </span>
                      <span className="dmd-source-link-label">
                        {data.sourceLink.label}
                      </span>
                    </a>
                    {data.allRelatedNews?.map((link, index) => (
                      <a
                        key={index}
                        className="dmd-source-link-btn"
                        href={link.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="dmd-source-link-icon">
                          <img
                            src={iconLinkBlue}
                            alt="🔗"
                            width={16}
                            height={16}
                          />
                        </span>
                        <span className="dmd-source-link-label">
                          {link.newsSource}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== 关联部门信息卡片 ===== */}
            {data.relatedDepartments && data.relatedDepartments.length > 0 && (
              <div className="dmd-card">
                <div className="dmd-card-content">
                  {/* 卡片标题 */}
                  <div className="dmd-section-header">
                    <img src={iconDept} alt="关联部门" width={16} height={16} />
                    <span className="dmd-section-title">关联部门</span>
                    <span className="dmd-section-count">
                      ({data.relatedDepartments.length}个)
                    </span>
                  </div>

                  {/* 企业列表 */}
                  <div className="dmd-company-list">
                    {data.relatedDepartments.map((department) => (
                      <div key={department.id} className="dmd-company-item">
                        {/* 企业信息行 */}
                        <div className="dmd-company-main">
                          {/* 左侧：名称 + 基本信息 */}
                          <div className="dmd-company-left">
                            <div className="dmd-department-name">
                              {department.name}
                            </div>
                          </div>
                          {/* 右侧：状态标签 */}
                          <div className="dmd-person">
                            {department.legalPerson}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== 关联企业信息卡片 ===== */}
            {data.relatedCompanies && data.relatedCompanies.length > 0 && (
              <div className="dmd-card">
                <div className="dmd-card-content">
                  {/* 卡片标题 */}
                  <div className="dmd-section-header">
                    <img
                      src={iconBuilding}
                      alt="关联企业"
                      width={16}
                      height={16}
                    />
                    <span className="dmd-section-title">关联企业</span>
                    <span className="dmd-section-count">
                      ({data.relatedCompanies.length}家)
                    </span>
                  </div>

                  {/* 企业列表 */}
                  <div className="dmd-company-list">
                    {data.relatedCompanies.map((company) => (
                      <div key={company.id} className="dmd-company-item">
                        {/* 企业信息行 */}
                        <div className="dmd-company-main">
                          {/* 左侧：名称 + 基本信息 */}
                          <div className="dmd-company-left">
                            <div className="dmd-company-name">
                              {company.name}
                            </div>
                          </div>
                          {company.id && (
                            <div
                              className="dmd-company-detail-row"
                              onClick={() =>
                                navigate(`/company-detail/${company.id}`)
                              }
                            >
                              <span className="dmd-company-detail-link">
                                查看详情 →
                              </span>
                            </div>
                          )}
                        </div>
                        {/* 查看详情 */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== 反馈浮动按钮 ===== */}
      <button
        className="dmd-feedback-btn"
        onClick={handleFeedbackOpen}
        aria-label="用户反馈"
      >
        <img src={iconFeedback} alt="反馈" width={56} height={56} />
      </button>

      {/* ===== 反馈弹框 ===== */}
      {feedbackOpen && (
        <div className="dmd-feedback-overlay" onClick={handleFeedbackClose}>
          <div
            className="dmd-feedback-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽条 */}
            <div className="dmd-feedback-handle-wrapper">
              <div className="dmd-feedback-handle" />
            </div>
            {/* 内容区 */}
            <div className="dmd-feedback-content">
              {/* 标题行 */}
              <div className="dmd-feedback-header">
                <div className="dmd-feedback-title">用户反馈</div>
                <button
                  className="dmd-feedback-close-btn"
                  onClick={handleFeedbackClose}
                  aria-label="关闭"
                >
                  <img src={iconClose} alt="关闭" width={32} height={32} />
                </button>
              </div>
              {/* 文本输入区 */}
              <div>
                <textarea
                  className="dmd-feedback-textarea"
                  placeholder="请输入您的反馈意见..."
                  value={feedbackContent}
                  onChange={(e) => {
                    if (e.target.value.length <= FEEDBACK_MAX_LENGTH) {
                      setFeedbackContent(e.target.value);
                    }
                  }}
                  maxLength={FEEDBACK_MAX_LENGTH}
                />
              </div>
              {/* 字数统计 */}
              <div className="dmd-feedback-counter-row">
                <span className="dmd-feedback-counter">
                  {feedbackContent.length}/{FEEDBACK_MAX_LENGTH}
                </span>
              </div>
              {/* 提交按钮 */}
              <button
                className={`dmd-feedback-submit${feedbackContent.trim() ? "" : " dmd-feedback-submit--disabled"}`}
                disabled={!feedbackContent.trim() || feedbackSubmitting}
                onClick={handleFeedbackSubmit}
              >
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 成功提示 Toast ===== */}
      {toastVisible && (
        <div className="dmd-toast">
          <span className="dmd-toast-icon">✓</span>
          反馈提交成功
        </div>
      )}

      {attachmentSheetOpen && (
        <div
          className="dmd-attachment-overlay"
          onClick={() => setAttachmentSheetOpen(false)}
        >
          <div
            className="dmd-attachment-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dmd-attachment-handle" />
            <div className="dmd-attachment-title">选择附件</div>
            <div className="dmd-attachment-list">
              {(data.progressAttachments || []).map((attachment, index) => {
                const previewUrl = getAttachmentPreviewUrl(attachment);
                const attachmentName = getAttachmentDisplayName(
                  attachment,
                  index,
                );

                return (
                  <button
                    key={attachment.id || `${attachmentName}-${index}`}
                    type="button"
                    className="dmd-attachment-item"
                    onClick={() => handlePreviewAttachment(attachment, index)}
                    disabled={!previewUrl}
                  >
                    <span className="dmd-attachment-name">
                      {attachmentName}
                    </span>
                    <span className="dmd-attachment-action">预览</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import iconDept from '../assets/icon-dynamic-dept.svg';
import iconLinkBlue from '../assets/icon-link-blue.svg';
import iconFeedback from '../assets/icon-feedback.svg';
import iconClose from '../assets/icon-close.svg';
import './DailyMessageDetail.css';
import PageHeader from '../components/PageHeader';
import { getDailyMessageDetail, addFeedback } from '../api/dailyMessage';
import { getNewsInsightDetail } from '../api/sceneEnterpriseDynamic';

const CARD_TYPE_CATEGORY_MAP = {
  1: 'recommend',
  2: 'news',
  3: 'related',
  'recommend': 'recommend',
  'news': 'news',
  'related': 'related',
};

const CARD_TYPE_TAG_MAP = {
  1: '每日推荐',
  2: '新闻动态',
  3: '与我相关',
};

const DEFAULT_DETAIL = {
  type: '场景动态',
  title: '加载中...',
  date: '',
  source: '',
  summary: '',
  paragraphs: [],
  relatedCompanies: [],
};

function mapApiDetailToData(apiData) {
  if (!apiData) return null;
  const cardType = apiData.cardType;
  const category = CARD_TYPE_CATEGORY_MAP[cardType] || 'news';
  const tagText = CARD_TYPE_TAG_MAP[cardType] || '场景动态';

  // 基础字段
  const result = {
    type: tagText,
    category,
    title: apiData.title || '',
    summary: apiData.content || '',
    date: apiData.publishTime || apiData.gmtCreate || '',
    source: '',
    subSummary: null,
    sourceLink: null,
    paragraphs: [],
    relatedCompanies: [],
    relatedDepartments: [],
    link: null,
    richTextContent: null,
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
    result.source = apiData.newsSource || '';
    if (apiData.articleUrl) {
      result.sourceLink = {
        url: apiData.articleUrl,
        label: apiData.articleTitle || '查看原文',
      };
    }
  }

  return result;
}

export default function SceneEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateData = location.state?.dynamicData;
  const [data, setData] = useState(stateData ? mapApiDetailToData(stateData) || stateData : DEFAULT_DETAIL);

  // 反馈弹框状态
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const FEEDBACK_MAX_LENGTH = 500;

  useEffect(() => {
    const fetchNewsDetail = async (newsContentId) => {
      try {
        const newsResponse = await getNewsInsightDetail({ id: newsContentId });
        const newsData = newsResponse.data;
        if (newsData) {
          setData(prev => ({
            ...prev,
            relatedCompanies: (newsData.enterpriseList || []).map(e => ({
              id: e.enterpriseId,
              name: e.enterpriseName,
            })),
            relatedDepartments: (newsData.orgList || []).map(o => ({
              id: o.platformOrgId,
              name: o.platformOrgName,
            })),
          }));
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
      }
    };

    if (stateData) {
      const cardType = stateData.cardType;
      const newsContentId = stateData.newsContentId;
      if ((cardType === 2 || cardType === 3) && newsContentId) {
        fetchNewsDetail(newsContentId);
      }
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await getDailyMessageDetail({ id });
        const apiData = response.data;
        if (apiData) {
          setData(mapApiDetailToData(apiData));
          const cardType = apiData.cardType;
          const newsContentId = apiData.newsContentId;
          if ((cardType === 2 || cardType === 3) && newsContentId) {
            await fetchNewsDetail(newsContentId);
          }
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
      }
    };

    fetchDetail();
  }, [id, stateData]);

  const handleFeedbackOpen = useCallback(() => {
    setFeedbackContent('');
    setFeedbackOpen(true);
  }, []);

  const handleFeedbackClose = useCallback(() => {
    setFeedbackOpen(false);
    setFeedbackContent('');
  }, []);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackContent.trim() || feedbackSubmitting) return;
    setFeedbackSubmitting(true);
    try {
      await addFeedback({ recommendId: Number(id), content: feedbackContent.trim() });
      setFeedbackOpen(false);
      setFeedbackContent('');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackContent, feedbackSubmitting, id]);

  function getTitle() {
    return data.category == 'recommend' ? '每日推荐' : data.type
  }

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
        {/* ===== 动态基本信息卡片 ===== */}
        <div className="dmd-card">
          <div className="dmd-card-content">
            {/* 顶部信息区域 */}
            <div className="dmd-info-section">
              {/* 类型标签 */}
              <div className="dmd-badge-wrapper">
                <div className={`dmd-badge dmd-badge--${data.category}`}>{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="dmd-title-row">
                <div className="dmd-title-inner">
                  <div className={`dmd-green-dot dmd-green-dot--${data.category}`} />
                  <span className="dmd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="dmd-meta-row-wrapper">
                <div className="dmd-meta-row">
                  {data.source && <div className="dmd-meta-item">
                    <img src={iconNewspaper} alt="来源" width={12} height={12} />
                    <span className="dmd-meta-text">{data.source}</span>
                  </div>}
                  <div className="dmd-meta-item">
                    <img src={iconCalendar} alt="日期" width={12} height={12} />
                    <span className="dmd-meta-text">{data.date}</span>
                  </div>
                </div>
                {
                  data.category == 'recommend' && data.link && (
                    <div className="dmd-meta-item">
                      <a className="dmd-link-text" onClick={() => navigate(data.link)}>查看企业 →</a>
                    </div>
                  )
                }
              </div>

            </div>

            {/* 分隔线 */}
            <div className="dmd-separator" />

            {/* 摘要区域 */}
            <div className="dmd-summary-box">
              <p className="dmd-summary-text">{data.category == 'recommend' ?
                <span className="dmd-summary--bold">推荐理由：</span> :
                <span className="dmd-summary--bold">摘要: </span>}
                {data.summary}
                {
                  data.subSummary && (
                    <>
                      <br></br>
                      {data.subSummary}
                    </>
                  )
                }</p>
            </div>

            {/* 来源链接按钮 */}
            {data.sourceLink && (
              <a
                className="dmd-source-link-btn"
                href={data.sourceLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="dmd-source-link-icon">
                  <img src={iconLinkBlue} alt="🔗" width={16} height={16} />
                </span>
                <span className="dmd-source-link-label">{data.sourceLink.label}</span>
              </a>
            )}

            {/* 正文段落 */}
            {data.paragraphs && data.paragraphs.length > 0 ? data.category == 'recommend' ?
              <div className="dmd-summary-box">
                <p className="dmd-summary-text"> <span className="dmd-summary--green">企业简介：</span>  {data.paragraphs[0]}</p>
              </div> : <div className="dmd-paragraphs">
                {data.paragraphs.map((para, index) => (
                  <p key={index} className="dmd-paragraph">{para}</p>
                ))}
              </div> : null}

            {/* 富文本内容 */}
            {data.richTextContent && (
              <div className="dmd-rich-content" dangerouslySetInnerHTML={{ __html: data.richTextContent }} />
            )}


          </div>
        </div>

        {/* ===== 关联部门信息卡片 ===== */}
        {data.relatedDepartments && data.relatedDepartments.length > 0 &&
          <div className="dmd-card">
            <div className="dmd-card-content">
              {/* 卡片标题 */}
              <div className="dmd-section-header">
                <img src={iconDept} alt="关联部门" width={16} height={16} />
                <span className="dmd-section-title">关联部门</span>
                <span className="dmd-section-count">({data.relatedDepartments.length}个)</span>
              </div>

              {/* 企业列表 */}
              <div className="dmd-company-list">
                {data.relatedDepartments.map((department) => (
                  <div key={department.id} className="dmd-company-item">
                    {/* 企业信息行 */}
                    <div className="dmd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="dmd-company-left">
                        <div className="dmd-department-name">{department.name}</div>
                      </div>
                      {/* 右侧：状态标签 */}
                      <div className="dmd-person">{department.legalPerson}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

        {/* ===== 关联企业信息卡片 ===== */}
        {data.relatedCompanies && data.relatedCompanies.length > 0 &&
          <div className="dmd-card">
            <div className="dmd-card-content">
              {/* 卡片标题 */}
              <div className="dmd-section-header">
                <img src={iconBuilding} alt="关联企业" width={16} height={16} />
                <span className="dmd-section-title">关联企业</span>
                <span className="dmd-section-count">({data.relatedCompanies.length}家)</span>
              </div>

              {/* 企业列表 */}
              <div className="dmd-company-list">
                {data.relatedCompanies.map((company) => (
                  <div key={company.id} className="dmd-company-item">
                    {/* 企业信息行 */}
                    <div className="dmd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="dmd-company-left">
                        <div className="dmd-company-name">{company.name}</div>
                      </div>
                      {company.id && <div className="dmd-company-detail-row"  onClick={() => navigate(`/company-detail/${company.id}`)}>
                        <span className="dmd-company-detail-link">查看详情 →</span>
                      </div>}
                    </div>
                    {/* 查看详情 */}
                  </div>
                ))}
              </div>
            </div>
          </div>}
      </div>

      {/* ===== 反馈浮动按钮 ===== */}
      <button className="dmd-feedback-btn" onClick={handleFeedbackOpen} aria-label="用户反馈">
        <img src={iconFeedback} alt="反馈" width={56} height={56} />
      </button>

      {/* ===== 反馈弹框 ===== */}
      {feedbackOpen && (
        <div className="dmd-feedback-overlay" onClick={handleFeedbackClose}>
          <div className="dmd-feedback-drawer" onClick={e => e.stopPropagation()}>
            {/* 拖拽条 */}
            <div className="dmd-feedback-handle-wrapper">
              <div className="dmd-feedback-handle" />
            </div>
            {/* 内容区 */}
            <div className="dmd-feedback-content">
              {/* 标题行 */}
              <div className="dmd-feedback-header">
                <div className="dmd-feedback-title">用户反馈</div>
                <button className="dmd-feedback-close-btn" onClick={handleFeedbackClose} aria-label="关闭">
                  <img src={iconClose} alt="关闭" width={32} height={32} />
                </button>
              </div>
              {/* 文本输入区 */}
              <div>
                <textarea
                    className="dmd-feedback-textarea"
                    placeholder="请输入您的反馈意见..."
                    value={feedbackContent}
                    onChange={e => {
                      if (e.target.value.length <= FEEDBACK_MAX_LENGTH) {
                        setFeedbackContent(e.target.value);
                      }
                    }}
                    maxLength={FEEDBACK_MAX_LENGTH}
                />
              </div>
              {/* 字数统计 */}
              <div className="dmd-feedback-counter-row">
                <span className="dmd-feedback-counter">{feedbackContent.length}/{FEEDBACK_MAX_LENGTH}</span>
              </div>
              {/* 提交按钮 */}
              <button
                className={`dmd-feedback-submit${feedbackContent.trim() ? '' : ' dmd-feedback-submit--disabled'}`}
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
    </div>
  );
}

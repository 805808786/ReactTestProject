import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import iconLinkBlue from '../assets/icon-link-blue.svg';
import './SceneEnterpriseDynamicDetail.css';
import PageHeader from '../components/PageHeader';
import { getDailyMessageDetail } from '../api/dailyMessage';

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
  const [apiLoading, setApiLoading] = useState(!stateData);

  useEffect(() => {
    if (stateData) return;

    const fetchDetail = async () => {
      setApiLoading(true);
      try {
        const response = await getDailyMessageDetail({ id });
        const apiData = response.data;
        if (apiData) {
          setData(mapApiDetailToData(apiData));
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setApiLoading(false);
      }
    };

    fetchDetail();
  }, [id, stateData]);

  function getTitle() {
    return data.category == 'recommend' ? '每日推荐' : data.type
  }

  return (
    <div className="sedd-container">
      {/* ===== 头部 ===== */}
      {/* <div className="sedd-header">
        <div className="sedd-header-row">
          <button className="sedd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="sedd-header-title">动态详情</span>
        </div>
      </div> */}
      <PageHeader title={getTitle()} />

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="sedd-body">
        {/* ===== 动态基本信息卡片 ===== */}
        <div className="sedd-card">
          <div className="sedd-card-content">
            {/* 顶部信息区域 */}
            <div className="sedd-info-section">
              {/* 类型标签 */}
              <div className="sedd-badge-wrapper">
                <div className={`sedd-badge sedd-badge--${data.category}`}>{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="sedd-title-row">
                <div className="sedd-title-inner">
                  <div className={`sedd-green-dot sedd-green-dot--${data.category}`} />
                  <span className="sedd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="sedd-meta-row-wrapper">
                <div className="sedd-meta-row">
                  {data.source && <div className="sedd-meta-item">
                    <img src={iconNewspaper} alt="来源" width={12} height={12} />
                    <span className="sedd-meta-text">{data.source}</span>
                  </div>}
                  <div className="sedd-meta-item">
                    <img src={iconCalendar} alt="日期" width={12} height={12} />
                    <span className="sedd-meta-text">{data.date}</span>
                  </div>
                </div>
                {
                  data.category == 'recommend' && data.link && (
                    <div className="sedd-meta-item">
                      <a className="sedd-link-text" onClick={() => navigate(data.link)}>查看企业 →</a>
                    </div>
                  )
                }
              </div>

            </div>

            {/* 分隔线 */}
            <div className="sedd-separator" />

            {/* 摘要区域 */}
            <div className="sedd-summary-box">
              <p className="sedd-summary-text">{data.category == 'recommend' ?
                <span className="sedd-summary--bold">推荐理由：</span> :
                <span className="sedd-summary--bold">摘要: </span>}
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
                className="sedd-source-link-btn"
                href={data.sourceLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sedd-source-link-icon">
                  <img src={iconLinkBlue} alt="🔗" width={16} height={16} />
                </span>
                <span className="sedd-source-link-label">{data.sourceLink.label}</span>
              </a>
            )}

            {/* 正文段落 */}
            {data.paragraphs && data.paragraphs.length > 0 ? data.category == 'recommend' ?
              <div className="sedd-summary-box">
                <p className="sedd-summary-text"> <span className="sedd-summary--green">企业简介：</span>  {data.paragraphs[0]}</p>
              </div> : <div className="sedd-paragraphs">
                {data.paragraphs.map((para, index) => (
                  <p key={index} className="sedd-paragraph">{para}</p>
                ))}
              </div> : null}

            {/* 富文本内容 */}
            {data.richTextContent && (
              <div className="sedd-rich-content" dangerouslySetInnerHTML={{ __html: data.richTextContent }} />
            )}


          </div>
        </div>

        {/* ===== 关联部门信息卡片 ===== */}
        {data.relatedDepartments && data.relatedDepartments.length > 0 &&
          <div className="sedd-card">
            <div className="sedd-card-content">
              {/* 卡片标题 */}
              <div className="sedd-section-header">
                <img src={iconBuilding} alt="关联企业" width={16} height={16} />
                <span className="sedd-section-title">关联部门</span>
                <span className="sedd-section-count">({data.relatedDepartments.length}个)</span>
              </div>

              {/* 企业列表 */}
              <div className="sedd-company-list">
                {data.relatedDepartments.map((department) => (
                  <div key={department.id} className="sedd-company-item">
                    {/* 企业信息行 */}
                    <div className="sedd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="sedd-company-left">
                        <div className="sedd-department-name">{department.name}</div>
                        <div className="sedd-company-info">
                          <span className="sedd-company-industry">{department.street}</span>
                        </div>
                      </div>
                      {/* 右侧：状态标签 */}
                      <div className="sedd-person">{department.legalPerson}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

        {/* ===== 关联企业信息卡片 ===== */}
        {data.relatedCompanies && data.relatedCompanies.length > 0 &&
          <div className="sedd-card">
            <div className="sedd-card-content">
              {/* 卡片标题 */}
              <div className="sedd-section-header">
                <img src={iconBuilding} alt="关联企业" width={16} height={16} />
                <span className="sedd-section-title">关联企业</span>
                <span className="sedd-section-count">({data.relatedCompanies.length}家)</span>
              </div>

              {/* 企业列表 */}
              <div className="sedd-company-list">
                {data.relatedCompanies.map((company) => (
                  <div key={company.id} className="sedd-company-item">
                    {/* 企业信息行 */}
                    <div className="sedd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="sedd-company-left">
                        <div className="sedd-company-name">{company.name}</div>
                        {company.legalPerson && company.industry && <div className="sedd-company-info">
                          <span className="sedd-company-industry">{company.industry}</span>
                          <span className="sedd-company-dot">•</span>
                          <span className="sedd-company-person">{company.legalPerson}</span>
                        </div>}
                      </div>
                      {/* 右侧：状态标签 */}
                      {company.status && <div className="sedd-status-badge">{company.status}</div>}
                    </div>
                    {/* 查看详情 */}
                    {data.category != 'news' && <div className="sedd-company-detail-row">
                      <span className="sedd-company-detail-link">查看详情 →</span>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          </div>}
      </div>
    </div>
  );
}

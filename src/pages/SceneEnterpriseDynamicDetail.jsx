import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import iconDept from '../assets/icon-dynamic-dept.svg';
import iconLinkBlue from '../assets/icon-link-blue.svg';
import './SceneEnterpriseDynamicDetail.css';
import PageHeader from '../components/PageHeader';
import { getNewsInsightDetail } from '../api/sceneEnterpriseDynamic';

const DEFAULT_DETAIL = {
  type: '新闻动态',
  category: 'news',
  title: '加载中...',
  date: '',
  source: '',
  summary: '',
  paragraphs: [],
  relatedCompanies: [],
  relatedDepartments: [],
  sourceLink: null,
  richTextContent: null,
};

function mapNewsDetailToData(apiData) {
  if (!apiData) return null;
  return {
    type: apiData.newsType || '新闻动态',
    category: 'news',
    title: apiData.articleTitle || apiData.title || '',
    summary: apiData.contentSummary || apiData.summary || '',
    date: apiData.publishDate || apiData.publishTime || apiData.gmtCreate || '',
    source: apiData.newsSource || '',
    subSummary: null,
    sourceLink: apiData.articleUrl ? {
      url: apiData.articleUrl,
      label: apiData.articleTitle || '查看原文',
    } : null,
    paragraphs: [],
    relatedCompanies: (apiData.enterpriseList || []).map((enterprise, index) => {
      if (typeof enterprise === 'string') {
        return {
          id: `enterprise-${index}`,
          name: enterprise,
        };
      }

      return {
        id: enterprise.enterpriseId || enterprise.id || `enterprise-${index}`,
        name: enterprise.enterpriseName || enterprise.name || '',
      };
    }),
    relatedDepartments: (apiData.orgList || []).map((org, index) => ({
      id: org.platformOrgId || org.id || `org-${index}`,
      name: org.platformOrgName || org.name || '',
      legalPerson: org.legalPerson || '',
    })),
    richTextContent: null,
  };
}

export default function SceneEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(DEFAULT_DETAIL);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getNewsInsightDetail({ id });
        const apiData = response.data;
        if (apiData) {
          setData(mapNewsDetailToData(apiData));
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
      }
    };

    fetchDetail();
  }, [id]);

  function getTitle() {
    return data.type;
  }

  // 类型到样式类名的映射
  const getBadgeClass = (type, category) => {
    // 保留原有类别样式
    if (category) {
      return `sedd-badge--${category}`;
    }
    
    // 新增类型的样式映射
    const typeMap = {
      '调研走访': 'sedd-badge--news',
      '政策法规': 'sedd-badge--recommend',
      '为企服务': 'sedd-badge--service',
      '数据要素': 'sedd-badge--related',
      '科技创新': 'sedd-badge--tech',
      '商务社区': 'sedd-badge--business',
      '城市建设': 'sedd-badge--city',
      '文旅宣传': 'sedd-badge--recommend'
    };
    return typeMap[type] || '';
  };

  // 类型到绿色圆点样式类名的映射
  const getGreenDotClass = (type, category) => {
    // 保留原有类别样式
    if (category) {
      return `sedd-green-dot--${category}`;
    }
    
    // 新增类型的样式映射
    const typeMap = {
      '调研走访': 'sedd-green-dot--news',
      '政策法规': 'sedd-green-dot--recommend',
      '为企服务': 'sedd-green-dot--service',
      '数据要素': 'sedd-green-dot--related',
      '科技创新': 'sedd-green-dot--tech',
      '商务社区': 'sedd-green-dot--business',
      '城市建设': 'sedd-green-dot--city',
      '文旅宣传': 'sedd-green-dot--recommend'
    };
    return typeMap[type] || '';
  };

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
                <div className={`sedd-badge ${getBadgeClass(data.type, data.category)}`}>{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="sedd-title-row">
                <div className="sedd-title-inner">
                  <div className={`sedd-green-dot ${getGreenDotClass(data.type, data.category)}`} />
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
              </div>

            </div>

            {/* 分隔线 */}
            <div className="sedd-separator" />

            {/* 摘要区域 */}
            <div className="sedd-summary-box">
              <p className="sedd-summary-text"><span className="sedd-summary--bold">摘要: </span>
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
            {data.paragraphs && data.paragraphs.length > 0 ? <div className="sedd-paragraphs">
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
                <img src={iconDept} alt="关联部门" width={16} height={16} />
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
                      </div>
                      {company.id && <div className="sedd-company-detail-row"  onClick={() => navigate(`/company-detail/${company.id}`)}>
                        <span className="sedd-company-detail-link">查看详情 →</span>
                      </div>}
                    </div>
                    {/* 查看详情 */}
                  </div>
                ))}
              </div>
            </div>
          </div>}
      </div>

    </div>
  );
}

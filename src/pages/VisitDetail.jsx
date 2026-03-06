import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-visit-detail-back.svg';
import iconCalendar from '../assets/icon-visit-detail-calendar.svg';
import iconBuilding from '../assets/icon-visit-detail-building.svg';
import './VisitDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_VISIT_DETAIL = {
  1: {
    title: '杭州禾迈电力电子股份有限公司走访全过程记录',
    dateTime: '2026-03-04 15:00至16:30',
    summary: '走访大纲: 聚焦禾迈公司数据获取难、工具受限、海外合规风险及国内推广困境，探讨通过可信数据空间、"数据要素×"大赛等政策路径，推动数据价值化与业务拓展。',
    participants: '参加人员： 陆文婷、王建群、郭李飞、金江锋、高琰',
    meetingTime: '会议时间： 2025年5月14日',
    meetingPlace: '会议地点：杭州禾迈电力电子股份有限公司',
    mainContent: '会议主要内容：',
    contentParagraphs: [
      '一、拱墅区数据资源管理局发言\n1.介绍数据局所负责的主要业务范畴。\n2.禾迈公司拥有产业基础和技术能力，数据局希望能够帮助企业实现数据价值化。',
      '二、杭州禾迈电力电子股份有限公司痛点情况\n\n1.数据获取难题：企业在欧洲业务数据因合规要求无法获取，在国内业务数据量少。如欧洲业务数据不能入境，在欧洲存储成本高，且因法律法规和合规性限制。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州禾迈电力电子股份有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '张伟',
        status: '存续',
      },
    ],
  },
};

const DEFAULT_VISIT_DETAIL = {
  title: '走访全过程记录',
  dateTime: '2026-03-04 15:00至16:30',
  summary: '走访大纲: 聚焦禾迈公司数据获取难、工具受限、海外合规风险及国内推广困境，探讨通过可信数据空间、"数据要素×"大赛等政策路径，推动数据价值化与业务拓展。',
  participants: '参加人员： 陆文婷、王建群、郭李飞、金江锋、高琰',
  meetingTime: '会议时间： 2026年3月4日',
  meetingPlace: '会议地点：杭州禾迈电力电子股份有限公司',
  mainContent: '会议主要内容：',
  contentParagraphs: [
    '一、拱墅区数据资源管理局发言\n1.介绍数据局所负责的主要业务范畴。\n2.禾迈公司拥有产业基础和技术能力，数据局希望能够帮助企业实现数据价值化。',
    '二、杭州禾迈电力电子股份有限公司痛点情况\n\n1.数据获取难题：企业在欧洲业务数据因合规要求无法获取，在国内业务数据量少。如欧洲业务数据不能入境，在欧洲存储成本高，且因法律法规和合规性限制。',
  ],
  relatedCompanies: [
    {
      id: 1,
      name: '杭州禾迈电力电子股份有限公司',
      industry: '软件和信息技术服务业',
      legalPerson: '张伟',
      status: '存续',
    },
  ],
};

export default function VisitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateData = location.state?.visitData;
  const data = stateData || MOCK_VISIT_DETAIL[Number(id)] || DEFAULT_VISIT_DETAIL;

  return (
    <div className="vd-container">
      {/* ===== 头部 ===== */}
      <div className="vd-header">
        <div className="vd-header-row">
          <button className="vd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="vd-header-title">走访详情</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="vd-body">
        {/* ===== 走访详情卡片 ===== */}
        <div className="vd-card">
          <div className="vd-card-content">
            {/* 标题 + 日期时间 */}
            <div className="vd-info-section">
              <div className="vd-title-row">
                <span className="vd-title">{data.title}</span>
              </div>
              <div className="vd-meta-row">
                <img src={iconCalendar} alt="日期" width={12} height={12} />
                <span className="vd-meta-text">{data.dateTime}</span>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="vd-separator" />

            {/* 走访大纲（摘要） */}
            <div className="vd-summary-box">
              <p className="vd-summary-text">{data.summary}</p>
            </div>

            {/* 详情内容 */}
            <div className="vd-detail-section">
              <div className="vd-detail-group">
                <p className="vd-detail-text">{data.participants}</p>
                <p className="vd-detail-text">{data.meetingTime}</p>
                <p className="vd-detail-text vd-detail-text--bold">{data.meetingPlace}</p>
                <p className="vd-detail-text vd-detail-text--heading">{data.mainContent}</p>
                {data.contentParagraphs.map((para, index) => (
                  <p key={index} className="vd-detail-text">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== 关联企业信息卡片 ===== */}
        <div className="vd-card vd-card--last">
          <div className="vd-card-content vd-card-content--related">
            {/* 卡片标题 */}
            <div className="vd-section-header">
              <img src={iconBuilding} alt="关联企业" className="vd-section-icon" width={16} height={16} />
              <span className="vd-section-title">关联企业</span>
              <span className="vd-section-count">({data.relatedCompanies.length}家)</span>
            </div>

            {/* 企业列表 */}
            <div className="vd-company-list">
              {data.relatedCompanies.map((company) => (
                <div key={company.id} className="vd-company-item">
                  <div className="vd-company-main">
                    <div className="vd-company-left">
                      <div className="vd-company-name">{company.name}</div>
                      <div className="vd-company-info">
                        <span className="vd-company-industry">{company.industry}</span>
                        <span className="vd-company-dot">•</span>
                        <span className="vd-company-person">{company.legalPerson}</span>
                      </div>
                    </div>
                    <div className="vd-status-badge">{company.status}</div>
                  </div>
                  <div className="vd-company-detail-row">
                    <span className="vd-company-detail-link">查看详情 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

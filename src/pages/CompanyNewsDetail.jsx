import { useNavigate, useParams } from 'react-router-dom';
import iconBack from '../assets/icon-cd-back.svg';
import iconBuilding2 from '../assets/icon-cd-building2-news.svg';
import iconNewspaper from '../assets/icon-cd-newspaper.svg';
import iconCalendar from '../assets/icon-cd-calendar.svg';
import './CompanyNewsDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_NEWS_DETAIL = {
  1: {
    type: '合作动态',
    title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
    date: '2026-02-28',
    source: '杭州证券报',
    summary: '摘要: 拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
    paragraphs: [
      '拱墅云端数据服务有限公司（以下简称"云端数据"）近日与工商银行、建设银行、招商银行等多家金融机构正式签署战略合作协议，双方将在大数据金融风控、企业信用评估、供应链金融等领域深度合作，共同推进金融科技创新应用。',
      '根据合作协议，云端数据将为合作银行提供企业多维数据分析服务，依托其在政企数据整合方面的核心优势，构建更精准、更实时的企业信用评估模型，支持银行提升中小微企业融资服务效率。',
      '业内人士表示，本次战略合作标志着拱墅区数据产业与金融业的融合迈上新台阶，预计未来将有效降低中小微企业融资成本，助力区域实体经济高质量发展。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州市创新科技有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '张伟',
        status: '存续',
      },
    ],
  },
  2: {
    type: '行业动态',
    title: '杭州数智科技有限公司入选国家数字化转型典型案例',
    date: '2026-01-15',
    source: '拱墅发布',
    summary: '摘要: 工业和信息化部近日公布2025年度国家数字化转型典型案例名单，杭州数智科技有限公司凭借智能数据分析平台的应用实践成功入选。',
    paragraphs: [
      '工业和信息化部近日公布2025年度国家数字化转型典型案例名单，杭州数智科技有限公司凭借其自主研发的"智能企业数据分析平台"在政府数字化管理领域的创新实践，成功入选制造业和服务业数字化转型标杆案例。',
      '该平台已为杭州、宁波等多个城市的政府部门提供企业精细化管理服务，累计服务企业超过8000家，帮助政府实现对重点企业的实时监测和精准服务，有效提升了营商环境整体水平。',
      '入选工信部典型案例是对公司技术创新和应用成效的高度认可，公司将继续深耕数字化政务服务赛道，进一步提升平台能力，推动数字技术更好赋能实体经济发展。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州数智科技有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '张伟',
        status: '存续',
      },
    ],
  },
};

const DEFAULT_NEWS_DETAIL = {
  type: '场景动态',
  title: '拱墅数商产业园正式启动,多家企业入驻',
  date: '2026-03-01',
  source: '人民日报',
  summary: '摘要: 深圳市创新科技有限公司近日宣布完成A轮融资，融资金额达3000万元，本轮融资将用于技术研发和市场拓展。',
  paragraphs: [
    '深圳市创新科技有限公司近日宣布完成A轮融资，融资金额达3000万元。本轮融资由知名投资机构领投，多家产业基金跟投，资金将主要用于人工智能核心算法研发和全国市场拓展。',
    '公司创始人张伟表示："非常感谢投资方的信任与支持。本轮融资将加速我们在人工智能领域的布局，我们将继续专注于技术创新，打造具有全球竞争力的AI产品。"',
    '业内专家认为，随着数字化转型的深入，企业对智能化服务的需求日益增长，深圳市创新科技有限公司在这一领域拥有显著的技术优势，具备广阔的市场发展空间。',
  ],
  relatedCompanies: [
    {
      id: 1,
      name: '杭州市创新科技有限公司',
      industry: '软件和信息技术服务业',
      legalPerson: '张伟',
      status: '存续',
    },
  ],
};

export default function CompanyNewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = MOCK_NEWS_DETAIL[Number(id)] || DEFAULT_NEWS_DETAIL;

  return (
    <div className="cnd-container">
      {/* ===== 头部 ===== */}
      <div className="cnd-header">
        <div className="cnd-header-row">
          <button className="cnd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="cnd-header-title">资讯详情</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="cnd-body">
        {/* ===== 资讯基本信息卡片 ===== */}
        <div className="cnd-card">
          <div className="cnd-card-content">
            {/* 顶部信息区域 */}
            <div className="cnd-info-section">
              {/* 类型标签 */}
              <div className="cnd-badge-wrapper">
                <div className="cnd-badge">{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="cnd-title-row">
                <div className="cnd-title-inner">
                  <div className="cnd-green-dot" />
                  <span className="cnd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="cnd-meta-row">
                <div className="cnd-meta-item">
                  <img src={iconNewspaper} alt="来源" width={12} height={12} />
                  <span className="cnd-meta-text">{data.source}</span>
                </div>
                <div className="cnd-meta-item">
                  <img src={iconCalendar} alt="日期" width={12} height={12} />
                  <span className="cnd-meta-text">{data.date}</span>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="cnd-separator" />

            {/* 摘要区域 */}
            <div className="cnd-summary-box">
              <p className="cnd-summary-text">{data.summary}</p>
            </div>

            {/* 正文段落 */}
            <div className="cnd-paragraphs">
              {data.paragraphs.map((para, index) => (
                <p key={index} className="cnd-paragraph">{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 关联企业信息卡片 ===== */}
        <div className="cnd-card cnd-card--last">
          <div className="cnd-card-content">
            {/* 卡片标题 */}
            <div className="cnd-section-header">
              <img src={iconBuilding2} alt="关联企业" width={16} height={16} />
              <span className="cnd-section-title">关联企业</span>
              <span className="cnd-section-count">({data.relatedCompanies.length}家)</span>
            </div>

            {/* 企业列表 */}
            <div className="cnd-company-list">
              {data.relatedCompanies.map((company) => (
                <div key={company.id} className="cnd-company-item">
                  {/* 企业信息行 */}
                  <div className="cnd-company-main">
                    {/* 左侧：名称 + 基本信息 */}
                    <div className="cnd-company-left">
                      <div className="cnd-company-name">{company.name}</div>
                      <div className="cnd-company-info">
                        <span className="cnd-company-industry">{company.industry}</span>
                        <span className="cnd-company-dot">•</span>
                        <span className="cnd-company-person">{company.legalPerson}</span>
                      </div>
                    </div>
                    {/* 右侧：状态标签 */}
                    <div className="cnd-status-badge--solid">{company.status}</div>
                  </div>

                  {/* 查看详情 */}
                  <div className="cnd-company-detail-row">
                    <span 
                      className="cnd-company-detail-link"
                      onClick={() => navigate(`/company-detail/${company.id}`)}
                    >
                      查看详情 →
                    </span>
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

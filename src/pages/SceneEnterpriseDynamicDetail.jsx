import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import './SceneEnterpriseDynamicDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_DETAIL_DATA = {
  1: {
    type: '融资动态',
    title: '杭州市创新科技有限公司完成首轮融资',
    date: '2026-03-01',
    source: '人民日报',
    summary: '摘要: 杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
    paragraphs: [
      '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元。本轮融资由知名投资机构领投,多家产业资本跟投。据悉,本轮融资将主要用于人工智能技术的研发、产品迭代以及市场推广。',
      '公司创始人张伟表示:"非常感谢投资方的信任与支持。本轮融资将加速我们在人工智能领域的布局,我们将继续专注于为企业客户提供更优质的智能化解决方案。"',
      '业内专家认为,随着数字化转型的深入,企业对智能化服务的需求日益增长,杭州市创新科技有限公司在这一领域具有较强的竞争优势。',
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
    title: '拱墅智能制造产业园正式启动，多家企业入驻',
    date: '2026-03-01',
    source: '杭州日报',
    summary: '摘要: 拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业。',
    paragraphs: [
      '拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业，总投资额超过5亿元，预计年产值可达20亿元。',
      '拱墅区委书记在启动仪式上表示，智能制造产业园的建设是拱墅区推进新型工业化、打造先进制造业高地的重要举措，将有力推动全区经济高质量发展。',
      '园区将聚焦智能装备、工业机器人、高端数控机床等领域，提供全周期、全链条的产业服务，打造国内一流的智能制造产业生态。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '广州智能制造股份有限公司',
        industry: '专用设备制造业',
        legalPerson: '李明',
        status: '存续',
      },
    ],
  },
  3: {
    type: '合作动态',
    title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
    date: '2026-02-28',
    source: '杭州证券报',
    summary: '摘要: 拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
    paragraphs: [
      '拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，双方将在数字金融、数据服务、科技赋能等领域开展深度合作。',
      '根据协议，拱墅云端数据服务有限公司将为合作银行提供企业数据画像、风险预警、智能分析等数字化服务，助力金融机构提升服务能力和风控水平。',
      '业内人士表示，此次合作是金融科技与实体产业深度融合的典型案例，有助于降低企业融资门槛，推动区域金融生态健康发展。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '拱墅云端数据服务有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '王芳',
        status: '存续',
      },
    ],
  },
};

const DEFAULT_DETAIL = {
  type: '场景动态',
  title: '拱墅数商产业园正式启动,多家企业入驻',
  date: '2026-03-01',
  source: '人民日报',
  summary: '摘要: 杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
  paragraphs: [
    '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元。本轮融资由知名投资机构领投,多家产业资本跟投。据悉,本轮融资将主要用于人工智能技术的研发、产品迭代以及市场推广。',
    '公司创始人张伟表示:"非常感谢投资方的信任与支持。本轮融资将加速我们在人工智能领域的布局,我们将继续专注于为企业客户提供更优质的智能化解决方案。"',
    '业内专家认为,随着数字化转型的深入,企业对智能化服务的需求日益增长,深圳市创新科技有限公司在这一领域具有较强的竞争优势。',
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

export default function SceneEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateData = location.state?.dynamicData;
  const data = stateData || MOCK_DETAIL_DATA[Number(id)] || DEFAULT_DETAIL;

  return (
    <div className="sedd-container">
      {/* ===== 头部 ===== */}
      <div className="sedd-header">
        <div className="sedd-header-row">
          <button className="sedd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="sedd-header-title">动态详情</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="sedd-body">
        {/* ===== 动态基本信息卡片 ===== */}
        <div className="sedd-card">
          <div className="sedd-card-content">
            {/* 顶部信息区域 */}
            <div className="sedd-info-section">
              {/* 类型标签 */}
              <div className="sedd-badge-wrapper">
                <div className="sedd-badge">{data.type}</div>
              </div>  

              {/* 标题行 */}
              <div className="sedd-title-row">
                <div className="sedd-title-inner">
                  <div className="sedd-green-dot" />
                  <span className="sedd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="sedd-meta-row">
                <div className="sedd-meta-item">
                  <img src={iconNewspaper} alt="来源" width={12} height={12} />
                  <span className="sedd-meta-text">{data.source}</span>
                </div>
                <div className="sedd-meta-item">
                  <img src={iconCalendar} alt="日期" width={12} height={12} />
                  <span className="sedd-meta-text">{data.date}</span>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="sedd-separator" />

            {/* 摘要区域 */}
            <div className="sedd-summary-box">
              <p className="sedd-summary-text">{data.summary}</p>
            </div>

            {/* 正文段落 */}
            <div className="sedd-paragraphs">
              {data.paragraphs.map((para, index) => (
                <p key={index} className="sedd-paragraph">{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 关联企业信息卡片 ===== */}
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
                      <div className="sedd-company-info">
                        <span className="sedd-company-industry">{company.industry}</span>
                        <span className="sedd-company-dot">•</span>
                        <span className="sedd-company-person">{company.legalPerson}</span>
                      </div>
                    </div>
                    {/* 右侧：状态标签 */}
                    <div className="sedd-status-badge">{company.status}</div>
                  </div>

                  {/* 查看详情 */}
                  <div className="sedd-company-detail-row">
                    <span className="sedd-company-detail-link">查看详情 →</span>
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

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import iconLinkBlue from '../assets/icon-link-blue.svg';
import './SceneEnterpriseDynamicDetail.css';
import PageHeader from '../components/PageHeader';

/* ===================== Mock 详情数据 ===================== */
const MOCK_DETAIL_DATA = {
  1: {
    type: '融资动态',
    title: '杭州市创新科技有限公司完成首轮融资',
    date: '2026-04-01',
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
  4: {
    type: '每日推荐',
    category: 'recommend',
    title: '杭州杭钢云计算数据中心有限公司',
    date: '2026-04-01',
    source: '',
    summary: '杭州杭钢云计算数据中心有限公司是杭钢集团数字经济转型骨干企业。其数据中心（东区）入选国家绿色数据中心，PUE值控制在1.30以下，走在全国前列，利用老厂房改造实现“从炼钢到炼数”的绿色升级。',
    subSummary: '项目与阿里合作，规划大规模算力设施，已投运数千机柜，支持政务云、信创云等应用，为长三角数字基础设施和AI发展提供坚实支撑，助力高质量发展。',
    paragraphs: [
      '杭州杭钢云计算数据中心有限公司是杭钢集团旗下国有企业，由金属制造转型为数字经济核心企业，主营第一类增值电信业务、大数据服务及软件开发等，注册资本75898万元。',
    ],
    relatedCompanies: [],
    link: 'https://biiframe.yicall.com/lwt/#/company-detail/1848243523192745991'
  },
  5: {
    type: '新闻动态',
    category: 'news',
    title: '头部药企迁入拱墅',
    date: '2026-04-03',
    source: '拱墅发布',
    summary: '近日，拱墅生物医药产业迎来重磅消息：基因编辑领域头部创新药研发企业——上海本导基因技术有限公司正式完成迁址，从上海市闵行区迁入拱墅，并入驻区国投集团旗下凤栖谷华章产业园。公司同步更名为杭州本导生物医药科技有限公司。',
    sourceLink: { label: '拱墅发布', url: 'https://mp.weixin.qq.com/s/7SH7wqXDgGctEQYifbT-kA' },
    paragraphs: [],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州本导生物医药科技有限公司',
        // industry: '软件和信息技术服务业',
        // legalPerson: '张伟',
        // status: '存续',
      },
      // {
      //   id: 2,
      //   name: '上海润达医疗',
      //   // industry: '软件和信息技术服务业',
      //   // legalPerson: '张伟',
      //   // status: '存续',
      // },
    ],
  },
  6: {
    type: '与我相关',
    category: 'related',
    title: '敖煜新赴区信访局接待来访群众',
    date: '2026-04-01',
    source: '拱墅发布',
    summary: '4月1日下午，区委书记敖煜新赴区信访局接待来访群众，面对面倾听诉求，现场协调解决问题。',
    sourceLink: { label: '拱墅发布', url: 'https://mp.weixin.qq.com/s/nFVGrStDCjLzngDZZQWZxw' },
    paragraphs: [],
    relatedDepartments: [
      {
        id: 1,
        name: '拱墅区区委办',
        // street: '拱宸桥街道',
        // legalPerson: '王翔',
      },
      {
        id: 2,
        name: '拱墅区信访局',
        // street: '拱宸桥街道',
        // legalPerson: '王翔',
      },
      {
        id: 3,
        name: '拱墅区综合行政执法局',
        // street: '拱宸桥街道',
        // legalPerson: '王翔',
      },
    ],
    // relatedCompanies: [
    //   {
    //     id: 1,
    //     name: '杭州市创新科技有限公司',
    //     industry: '软件和信息技术服务业',
    //     legalPerson: '张伟',
    //     status: '存续',
    //   },
    // ],
  },

};

const DEFAULT_DETAIL = {
  type: '场景动态',
  title: '拱墅数商产业园正式启动,多家企业入驻',
  date: '2026-04-01',
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
                      <a className="sedd-link-text" href={data.link}>查看企业 →</a>
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

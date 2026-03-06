import { useNavigate, useParams } from 'react-router-dom';
import iconBack from '../assets/icon-ted-back.svg';
import iconNewspaper from '../assets/icon-ted-newspaper.svg';
import iconCalendar from '../assets/icon-ted-calendar.svg';
import iconBuilding from '../assets/icon-ted-building.svg';
import './TopEnterpriseDynamicDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_DETAIL_DATA = {
  1: {
    type: '融资动态',
    title: '浙江数字科技集团完成C轮融资，融资额达10亿元',
    date: '2026-03-05',
    source: '杭州证券报',
    summary: '摘要: 浙江数字科技集团宣布完成C轮融资，融资额达10亿元，由红杉资本领投，此轮融资将加速其数字化平台的全国布局。',
    paragraphs: [
      '浙江数字科技集团近日正式宣布完成C轮融资，总融资额达10亿元人民币。本轮融资由红杉资本领投，IDG资本、云锋基金等知名机构跟投，此次融资创下浙江省数字科技领域今年最大单笔融资记录。',
      '集团CEO表示，C轮资金将主要用于三大方向：一是持续加大核心算法研发投入，强化技术护城河；二是深度拓展长三角以外的全国市场，加速区域化布局；三是推进国际化战略，布局东南亚新兴市场。',
      '行业分析人士指出，浙江数字科技集团凭借在产业数字化领域的深厚积累与技术壁垒，赢得了资本市场的高度认可，有望在两年内冲刺A股上市。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '浙江数字科技集团有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '陈志远',
        status: '存续',
      },
    ],
  },
  2: {
    type: '行业动态',
    title: '杭州新能源汽车产业迎来政策红利，头部企业加速扩产',
    date: '2026-03-05',
    source: '人民日报',
    summary: '摘要: 杭州市出台新能源汽车产业扶持政策，拱墅区多家头部新能源企业获批扩产，预计年产能将提升50%，带动就业5000余人。',
    paragraphs: [
      '杭州市近日出台《新能源汽车产业高质量发展扶持政策》，明确对年产能超过5万辆的头部整车企业给予最高5000万元专项补贴，同时对配套零部件企业的技术改造投资给予20%的资金支持。',
      '拱墅区经信局相关负责人表示，此次政策红利落地后，辖区内已有6家头部新能源相关企业提交扩产申请，总计划新增投资超过30亿元，建成后预计新增年产能约15万套，带动上下游就业5000余人。',
      '业内专家认为，杭州新能源汽车产业已进入规模化发展的快车道，头部企业的集聚效应将进一步带动产业链上下游协同发展，助力杭州打造全国一流的新能源汽车产业基地。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州新能源汽车科技有限公司',
        industry: '汽车制造业',
        legalPerson: '王建国',
        status: '存续',
      },
      {
        id: 2,
        name: '杭州智能驾驶系统有限公司',
        industry: '汽车制造业',
        legalPerson: '李晓东',
        status: '存续',
      },
    ],
  },
  3: {
    type: '合作动态',
    title: '杭州智联互联网与华为签署深度战略合作协议',
    date: '2026-03-04',
    source: '杭州日报',
    summary: '摘要: 杭州智联互联网有限公司与华为技术有限公司正式签署深度战略合作协议，双方将在云计算、人工智能领域开展全面合作。',
    paragraphs: [
      '杭州智联互联网有限公司与华为技术有限公司在杭州国际博览中心正式签署深度战略合作协议，双方将围绕云计算、人工智能、大数据三大领域展开全面合作，计划在未来三年内联合推出10款以上的创新产品和解决方案。',
      '根据协议，华为将向杭州智联互联网提供鲲鹏算力、盘古大模型等核心技术能力，杭州智联互联网则将发挥其在本地行业场景的深度理解与客户资源优势，双方共同探索政务云、工业互联网等垂直场景的落地应用。',
      '此次战略合作是华为深度布局浙江市场的重要举措，也是杭州智联互联网提升核心竞争力、加速数智化转型的关键一步，预计合作项目将在2026年内陆续落地。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州智联互联网有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '赵明伟',
        status: '存续',
      },
    ],
  },
};

const DEFAULT_DETAIL = {
  type: '头部动态',
  title: '拱墅区头部企业动态详情',
  date: '2026-03-01',
  source: '拱墅发布',
  summary: '摘要: 拱墅区头部企业持续保持高速增长态势，在融资、合作、荣誉等多个维度取得突破性进展，为区域经济高质量发展注入强劲动力。',
  paragraphs: [
    '近期，拱墅区头部企业在多个领域取得重要进展，充分展示了区域经济的强劲活力与持续发展潜力。从融资动态到合作拓展，从荣誉表彰到政策获益，头部企业正在全面发力，引领行业高质量发展。',
    '拱墅区相关负责人表示，将持续优化营商环境，加大对头部企业的精准服务力度，助力企业做大做强，进一步巩固拱墅区在全市乃至全省的产业领先地位。',
    '业内专家指出，头部企业的持续壮大，将有效带动产业链上下游的协同发展，形成良好的产业生态，为拱墅区经济社会高质量发展提供坚实支撑。',
  ],
  relatedCompanies: [
    {
      id: 1,
      name: '拱墅区头部示范企业有限公司',
      industry: '综合业',
      legalPerson: '示范负责人',
      status: '存续',
    },
  ],
};

export default function TopEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = MOCK_DETAIL_DATA[Number(id)] || DEFAULT_DETAIL;

  return (
    <div className="tedd-container">
      {/* ===== 头部 ===== */}
      <div className="tedd-header">
        <div className="tedd-header-row">
          <button className="tedd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="tedd-header-title">动态详情</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="tedd-body">
        {/* ===== 动态基本信息卡片 ===== */}
        <div className="tedd-card">
          <div className="tedd-card-content">
            {/* 顶部信息区域 */}
            <div className="tedd-info-section">
              {/* 类型标签 */}
              <div className="tedd-badge-wrapper">
                <div className="tedd-badge">{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="tedd-title-row">
                <div className="tedd-title-inner">
                  <div className="tedd-green-dot" />
                  <span className="tedd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="tedd-meta-row">
                <div className="tedd-meta-item">
                  <img src={iconNewspaper} alt="来源" width={12} height={12} />
                  <span className="tedd-meta-text">{data.source}</span>
                </div>
                <div className="tedd-meta-item">
                  <img src={iconCalendar} alt="日期" width={12} height={12} />
                  <span className="tedd-meta-text">{data.date}</span>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="tedd-separator" />

            {/* 摘要区域 */}
            <div className="tedd-summary-box">
              <p className="tedd-summary-text">{data.summary}</p>
            </div>

            {/* 正文段落 */}
            <div className="tedd-paragraphs">
              {data.paragraphs.map((para, index) => (
                <p key={index} className="tedd-paragraph">{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 关联企业信息卡片 ===== */}
        <div className="tedd-card tedd-card--last">
          <div className="tedd-card-content">
            {/* 卡片标题 */}
            <div className="tedd-section-header">
              <img src={iconBuilding} alt="关联企业" width={16} height={16} />
              <span className="tedd-section-title">关联企业</span>
              <span className="tedd-section-count">({data.relatedCompanies.length}家)</span>
            </div>

            {/* 企业列表 */}
            <div className="tedd-company-list">
              {data.relatedCompanies.map((company) => (
                <div key={company.id} className="tedd-company-item">
                  {/* 企业信息行 */}
                  <div className="tedd-company-main">
                    {/* 左侧：名称 + 基本信息 */}
                    <div className="tedd-company-left">
                      <div className="tedd-company-name">{company.name}</div>
                      <div className="tedd-company-info">
                        <span className="tedd-company-industry">{company.industry}</span>
                        <span className="tedd-company-dot">•</span>
                        <span className="tedd-company-person">{company.legalPerson}</span>
                      </div>
                    </div>
                    {/* 右侧：状态标签 */}
                    <div className="tedd-status-badge">{company.status}</div>
                  </div>

                  {/* 查看详情 */}
                  <div className="tedd-company-detail-row">
                    <span className="tedd-company-detail-link">查看详情 →</span>
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

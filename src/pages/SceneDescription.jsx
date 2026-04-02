import { useParams, useLocation } from 'react-router-dom';
import iconPublisher from '../assets/icon-scene-publisher.svg';
import PageHeader from '../components/PageHeader';
import iconCalendar from '../assets/icon-scene-calendar.svg';
import iconGoalCheck from '../assets/icon-scene-goal-check.svg';
import './SceneDescription.css';

/* ===================== Mock 场景描述数据 ===================== */
const SCENE_DESCRIPTION_DATA = {
  1: {
    name: '人工智能企业筛选场景',
    publisher: '发布单位：浙江省人民政府,杭州市人民政府办公厅,杭州市经信局,拱墅区人民政府',
    publishDate: '发布时间：2025-11-17',
    // policyDoc: '浙江省人民政府印发关于支持人工智能创新发展若干措施的通知.pdf\n杭州市人民政府办公厅关于印发支持人工智能全产业链高质量发展若干措施的通知.pdf\n杭州市"415X"先进制造业集群培育工程2024年工作要点.pdf\n杭州市"296X"先进制造业集群培育建设专项小组办公室工作规则.pdf\n拱墅区"115X"先进制造业集群培育建设三年行动计划.pdf',
    // policyDocUrl: '#',
    policies: [
    ],
    description:
      '为加快推进人工智能技术创新和产业应用，打造全球人工智能创新发展高地，依据《浙江省人民政府印发关于支持人工智能创新发展若干措施的通知》《杭州市人民政府办公厅关于印发支持人工智能全产业链高质量发展若干措施的通知》《杭州市"415X"先进制造业集群培育工程2024年工作要点》《杭州市"296X"先进制造业集群培育建设专项小组办公室工作规则》《拱墅区"115X"先进制造业集群培育建设三年行动计划》等政策文件，特制定本人工智能筛选场景。',
    goals: [
      '打造全球人工智能创新发展高地',
      '建设中国算谷',
      '培育万亿产业生态',
      '实施人工智能+行动',
      '建设算力设施',
      '培育模型生态',
      '赋能实体经济',
      '推进先进制造业集群培育',
    ],
    scopeDesc: '算力设施建设,模型开放生态,赋能实体经济,全产业链发展,人才队伍支撑,产业集群高地,金融资本支持,知识产权保护,数据开放供给,应用场景培育',
    scopeTags: ['人工智能全产业链', '先进制造业集群', '数字经济', '未来产业'],
  },
  2: {
    name: '115X专题企业筛选场景',
    publisher: '发布单位：杭州市数据资源局',
    publishDate: '发布时间：2024-06-15',
    // policyDoc: '《拱墅区"115X"先进制造业集群培育建设三年行动计划（2025—2027年）》.pdf',
    // policyDocUrl: '#',
    policies: [
      {
        doc: '为全面落实中央、省市区关于科技创新与产业创新-115X.pdf',
        url: 'https://file.yicall.com/wallbreaker/2026/03/28/4b27dbb20b6f4bf887e972f66d124936.pdf'
      }
    ],
    description:
      '为贯彻落实拱墅区"115X"先进制造业集群培育战略部署，本次企业分类体系紧密围绕相关要求，系统开展企业梳理与分类工作。',
    goals: [
      '建立全区统一先进制造业集群培育库',
      '识别不少于 100 家核心先进制造业企业',
    ],
    scopeDesc: '本次筛选主要面向注册在杭州市拱墅区，且主营业务涉及以下领域的企业：',
    scopeTags: ['AI算法', '人工智能开发', '数字技术', '芯片设计'],
  },
  3: {
    name: '数商企业筛选场景发布',
    publisher: '发布单位：数据局',
    publishDate: '发布时间：2026-1',
    // policyDoc: '关于推进浙江数商高质量发展的实施意见的通知.pdf',
    // policyDocUrl: '#',
    policies: [
      {
        doc: '关于推进浙江数商高质量发展的实施意见的通知-数商.pdf',
        url: 'https://file.yicall.com/wallbreaker/2026/03/28/30b55f02da504c07bad6199527ea8228.pdf'
      }
    ],
    description:
      '为抢占人工智能发展制高点，紧抓省市一体推进人工智能高质量发展机遇，塑造我市人工智能创新生态发展优势，加快建设具有全球党争力和影响力的人工曾能创新高地。',
    goals: [
      '实施模型突破工程，加速前沿技术的原创性策',
      '实施数据限通工程，加速数据要素的创造性配',
      '实施算力筑基工程，加速城市算力的基础性述设',
      '实施数据融通工程，加速数据要素的创造性配',
      '施产业聚链工程，加速智能经济的集群式发'
    ],
    scopeDesc: '',
    scopeTags: [],
  },
  4: {
    name: '党建企业筛选场景发布',
    publisher: '发布单位：组织部',
    publishDate: '发布时间：2026-1',
    // policyDoc: '关于印发<<关于推进科技创新型企业党建的工作指引(试行)>>的通知.pdf',
    // policyDocUrl: '#',
    policies: [
      {
        doc: '关于印发《关于推进科技创新型企业党建的工作指引(试行) 》的通知-党建.pdf',
        url: 'https://file.yicall.com/wallbreaker/2026/03/28/6f8e8329e657497c91282c60f7ae65ec.pdf'
      }
    ],
    description:
      '为深入贯彻全国新兴领域党建工作座谈会精神,认真落实省委关于加快建设创新浙江和市委关于加快建设更高水平创新活力之城、因地制宜发展新质生产力的部署要求,推动党建工作与科技创新互融互促。',
    goals: [
      '企业融入产业链党建，共享创新资源',
      '企业设立科技攻关党员先锋岗突破难题',
      '企业建立党员骨干重点联系服务机制',
      '企业选树党建双强典型，放大示范效应'
    ],
    scopeDesc: '',
    scopeTags: [
      '党建培育企业',
      '非公党建企业',
      '国有党建企业',
      '优秀党务工作者所在企业',
      '先进基层党组织',
      '党建创新案例企业',
      '优秀党员所在企业',
      '党建先锋案例企业',
      '党建品牌特色案例企业',
      '最强党支部'
    ],
  }
};

const DEFAULT_DATA = {
  name: '场景说明',
  publisher: '发布单位：杭州市数据资源局',
  publishDate: '发布时间：2024-06-15',
  // policyDoc: '《拱墅区"115X"先进制造业集群培育建设三年行动计划（2025—2027年）》.pdf',
  // policyDocUrl: '#',
  policies: [
  ],
  description:
    '为贯彻落实拱墅区"115X"先进制造业集群培育战略部署，本次企业分类体系紧密围绕相关要求，系统开展企业梳理与分类工作。',
  goals: [
    '建立全区统一先进制造业集群培育库',
    '识别不少于 100 家核心先进制造业企业',
  ],
  scopeDesc: '本次筛选主要面向注册在杭州市拱墅区，且主营业务涉及以下领域的企业：',
  scopeTags: ['AI算法', '人工智能开发', '数字技术', '芯片设计'],
};

const handleDownload = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlObject = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlObject;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlObject);
  } catch (error) {
    // 降级方案：直接打开链接
    window.open(url, '_blank');
  }
};

export default function SceneDescription() {
  const { id } = useParams();
  const location = useLocation();

  const sceneName = location.state?.sceneName;

  const data = SCENE_DESCRIPTION_DATA[Number(id)] || {
    ...DEFAULT_DATA,
    name: sceneName || DEFAULT_DATA.name,
  };

  return (
    <div className="sd-container">
      {/* ===== 头部 ===== */}
      <PageHeader title="场景说明" />

      {/* ===== 内容区域 ===== */}
      <div className="sd-content">
        {/* ===== 场景基本信息卡片 ===== */}
        <div className="sd-card">
          <div className="sd-card-content">
            {/* 场景标题与元信息 */}
            <div className="sd-info-header">
              <div className="sd-scene-title">{data.name}</div>
              <div className="sdd-meta-row">
                <div className="sd-meta-item">
                  <img src={iconPublisher} alt="发布单位" width={12} height={12} />
                  <span className="sd-meta-text">{data.publisher}</span>
                </div>
                <div className="sd-meta-item">
                  <img src={iconCalendar} alt="发布时间" width={12} height={12} />
                  <span className="sd-meta-text">{data.publishDate}</span>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="sd-separator" />

            {/* 政策依据 */}
            {data.policies && data.policies.length > 0 && <div className="sd-policy-box">
              <div className="sd-policy-title">政策依据:</div>
              <div className="sd-policies-list">
                {data.policies.map((policy, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(policy.url, policy.doc);
                    }}
                    className="sd-policy-item"
                  >
                    {policy.doc}
                  </a>
                ))}
              </div>
            </div>}

            {/* 场景描述 */}
            <div className="sd-desc-section">
              <p className="sd-desc-text">{data.description}</p>
            </div>
          </div>
        </div>

        {/* ===== 工作目标卡片 ===== */}
        <div className="sd-card">
          <div className="sd-card-content">
            <div className="sd-section-header">
              <span className="sd-dot sd-dot--success" />
              <span className="sd-section-title">工作目标</span>
              <span className="sd-section-tag-placeholder" />
            </div>
            <div className="sd-goals-list">
              {data.goals.map((goal, index) => (
                <div key={index} className="sd-goal-item">
                  <img src={iconGoalCheck} alt="目标" width={20} height={20} />
                  <div className="sd-goal-text">{goal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 工作范围卡片 ===== */}
        {(data.scopeDesc || data.scopeTags.length > 0) && (
          <div className="sd-card">
            <div className="sd-card-content">
              <div className="sd-section-header">
                <span className="sd-dot sd-dot--warning" />
                <span className="sd-section-title">工作范围</span>
                <span className="sd-section-tag-placeholder" />
              </div>
              <p className="sd-scope-desc">{data.scopeDesc}</p>
              <div className="sd-tags-container">
                <div className="sd-tags-row">
                  {data.scopeTags.map((tag, index) => (
                    <span key={index} className="sd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-scene-back.svg';
import iconPublisher from '../assets/icon-scene-publisher.svg';
import iconCalendar from '../assets/icon-scene-calendar.svg';
import iconGoalCheck from '../assets/icon-scene-goal-check.svg';
import './SceneDescription.css';

/* ===================== Mock 场景描述数据 ===================== */
const SCENE_DESCRIPTION_DATA = {
  1: {
    name: '人工智能企业筛选场景',
    publisher: '发布单位：浙江省人民政府,杭州市人民政府办公厅,杭州市经信局,拱墅区人民政府',
    publishDate: '发布时间：2025-11-17',
    policyDoc: '浙江省人民政府印发关于支持人工智能创新发展若干措施的通知.pdf\n杭州市人民政府办公厅关于印发支持人工智能全产业链高质量发展若干措施的通知.pdf\n杭州市"415X"先进制造业集群培育工程2024年工作要点.pdf\n杭州市"296X"先进制造业集群培育建设专项小组办公室工作规则.pdf\n拱墅区"115X"先进制造业集群培育建设三年行动计划.pdf',
    policyDocUrl: '#',
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
};

const DEFAULT_DATA = {
  name: '场景说明',
  publisher: '发布单位：杭州市数据资源局',
  publishDate: '发布时间：2024-06-15',
  policyDoc: '《拱墅区"115X"先进制造业集群培育建设三年行动计划（2025—2027年）》.pdf',
  policyDocUrl: '#',
  description:
    '为贯彻落实拱墅区"115X"先进制造业集群培育战略部署，本次企业分类体系紧密围绕相关要求，系统开展企业梳理与分类工作。',
  goals: [
    '建立全区统一先进制造业集群培育库',
    '识别不少于 100 家核心先进制造业企业',
  ],
  scopeDesc: '本次筛选主要面向注册在杭州市拱墅区，且主营业务涉及以下领域的企业：',
  scopeTags: ['AI算法', '人工智能开发', '数字技术', '芯片设计'],
};

export default function SceneDescription() {
  const navigate = useNavigate();
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
      <div className="sd-header">
        <div className="sd-header-row">
          <button className="sd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="sd-header-title">场景说明</span>
        </div>
      </div>

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
            <div className="sd-policy-box">
              <a
                href={data.policyDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sd-policy-text"
              >
                政策依据: {'\n' + data.policyDoc}
              </a>
            </div>

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
      </div>
    </div>
  );
}

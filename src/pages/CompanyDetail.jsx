import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iconBack from '../assets/icon-cd-back.svg';
import iconTabData from '../assets/icon-cd-tab-data.svg';
import iconTabServiceMatrix from '../assets/icon-cd-tab-service-matrix.svg';
import iconTabEnterpriseService from '../assets/icon-cd-tab-enterprise-service.svg';
import iconTabDynamic from '../assets/icon-cd-tab-dynamic.svg';
import iconTabLifecycle from '../assets/icon-cd-tab-lifecycle.svg';
import iconBuilding2 from '../assets/icon-cd-building2.svg';
import iconUsers from '../assets/icon-cd-users.svg';
import iconFileText from '../assets/icon-cd-filetext.svg';
import iconTrendingUp from '../assets/icon-cd-trending-up.svg';
import iconMessageSquare from '../assets/icon-cd-message-square.svg';
import iconActivity from '../assets/icon-cd-activity.svg';
import iconNewsFileText from '../assets/icon-cd-news-filetext.svg';
import iconZap from '../assets/icon-cd-zap.svg';
import iconChevronUp from '../assets/icon-cd-chevron-up.svg';
import iconChevronDown from '../assets/icon-cd-chevron-down.svg';
import iconCaretDown from '../assets/icon-caret-down-small.svg';
import iconNavInfo from '../assets/icon-cd-nav-info.svg';
import iconNavProduct from '../assets/icon-cd-nav-product.svg';
import iconNavPatent from '../assets/icon-cd-nav-patent.svg';
import iconNavCopyright from '../assets/icon-cd-nav-copyright.svg';
import iconNavModel from '../assets/icon-cd-nav-model.svg';
import iconNavNegative from '../assets/icon-cd-nav-negative.svg';
import iconNavPain from '../assets/icon-cd-nav-pain.svg';
import iconNavTalent from '../assets/icon-cd-nav-talent.svg';
import iconNavTax from '../assets/icon-cd-nav-tax.svg';
import iconNavPolicy from '../assets/icon-cd-nav-policy.svg';
import iconNavDemand from '../assets/icon-cd-nav-demand.svg';
import iconNavFinance from '../assets/icon-cd-nav-finance.svg';
import iconNavBid from '../assets/icon-cd-nav-bid.svg';
import iconNavEquity from '../assets/icon-cd-nav-equity.svg';
import './CompanyDetail.css';

/* ===================== Mock 数据 ===================== */
const MOCK_COMPANY = {
  1: { name: '科技创新有限公司', type: '头部企业', industry: '软件和信息技术服务业' },
  2: { name: '智能制造股份公司', type: '腰部企业', industry: '高端制造业' },
};

const DEFAULT_COMPANY = { name: '杭州数智科技有限公司', type: '头部企业', industry: '软件和信息技术服务业' };

const TABS = [
  { key: 'data', label: '企业数据', icon: iconTabData },
  { key: 'service-matrix', label: '服务矩阵', icon: iconTabServiceMatrix },
  { key: 'enterprise-service', label: '企业服务', icon: iconTabEnterpriseService },
  { key: 'dynamic', label: '企业动态', icon: iconTabDynamic },
  { key: 'lifecycle', label: '全生命周期', icon: iconTabLifecycle },
];

const QUICK_NAV_ITEMS = [
  { key: 'basic', label: '基本信息', icon: iconNavInfo },
  { key: 'product', label: '服务产品', icon: iconNavProduct },
  { key: 'patent', label: '专利', icon: iconNavPatent },
  { key: 'copyright', label: '著作权', icon: iconNavCopyright },
  { key: 'model', label: '商业模式', icon: iconNavModel },
  { key: 'negative', label: '负面因素', icon: iconNavNegative },
  { key: 'pain', label: '痛点', icon: iconNavPain },
  { key: 'talent', label: '人才', icon: iconNavTalent },
  { key: 'tax', label: '税收', icon: iconNavTax },
  { key: 'policy', label: '政策', icon: iconNavPolicy },
  { key: 'demand', label: '需求', icon: iconNavDemand },
  { key: 'finance', label: '融资', icon: iconNavFinance },
  { key: 'bid', label: '招投标', icon: iconNavBid },
  { key: 'equity', label: '股权', icon: iconNavEquity },
];

/* ===================== 主页面 ===================== */
export default function CompanyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('data');
  const company = MOCK_COMPANY[Number(id)] || DEFAULT_COMPANY;

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="cd-container">
      {/* ===== 头部 ===== */}
      <div className="cd-header">
        <div className="cd-header-top">
          <button className="cd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="cd-company-name">{company.name}</span>
        </div>
        {/* Tab 栏 */}
        <div className="cd-tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`cd-tab-btn${activeTab === tab.key ? ' cd-tab-btn--active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <div className="cd-tab-inner">
                <img src={tab.icon} alt={tab.label} width={16} height={16} className={activeTab === tab.key ? 'cd-tab-icon--active' : 'cd-tab-icon'} />
                <span className="cd-tab-text">{tab.label}</span>
              </div>
              {activeTab === tab.key && <div className="cd-tab-indicator" />}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 内容区域 ===== */}
      <div className="cd-body">
        {activeTab === 'data' && <EnterpriseDataTab />}
        {activeTab === 'service-matrix' && <ServiceMatrixTab />}
        {activeTab === 'enterprise-service' && <EnterpriseServiceTab />}
        {activeTab === 'dynamic' && <EnterpriseDynamicTab navigate={navigate} companyId={id} />}
        {activeTab === 'lifecycle' && <LifecycleTab />}
      </div>
    </div>
  );
}

/* ===================== 企业数据 Tab ===================== */
function EnterpriseDataTab() {
  const [navExpanded, setNavExpanded] = useState(false);
  const [labelExpanded, setLabelExpanded] = useState(true);
  const [labelExpanded2, setLabelExpanded2] = useState(true);
  const sectionRefs = useRef({});

  const scrollToSection = (key) => {
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="cd-data-tab">
      {/* 快速导航 */}
      <div className="cd-quick-nav">
        <button className="cd-quick-nav-toggle" onClick={() => setNavExpanded(!navExpanded)}>
          <div className="cd-quick-nav-toggle-left">
            <img src={iconZap} alt="快速导航" width={16} height={16} />
            <span className="cd-quick-nav-label">快速导航</span>
            <span className="cd-quick-nav-count">(14个模块)</span>
          </div>
          <img
            src={navExpanded ? iconChevronUp : iconChevronDown}
            alt="展开"
            width={16}
            height={16}
          />
        </button>
        {navExpanded && (
          <div className="cd-quick-nav-grid">
            {QUICK_NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className="cd-quick-nav-item"
                onClick={() => { scrollToSection(item.key); setNavExpanded(false); }}
              >
                <img src={item.icon} alt={item.label} width={14} height={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 企业基本信息 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['basic'] = el}>
        <div className="cd-section-header">
          <img src={iconBuilding2} alt="基本信息" width={20} height={20} />
          <span className="cd-section-title">企业基本信息</span>
        </div>

        {/* 企业通用标签 */}
        <div className="cd-label-group">
          <div className="cd-label-group-header">
            <span className="cd-label-group-name">企业通用标签</span>
            <button className="cd-label-collapse-btn" onClick={() => setLabelExpanded(!labelExpanded)}>
              <img src={labelExpanded ? iconChevronUp : iconChevronDown} alt="收起" width={14} height={14} />
              <span>{labelExpanded ? '收起' : '展开'}</span>
            </button>
          </div>
          {labelExpanded && (
            <div className="cd-label-categories">
              {[
                { cat: '官方', tags: ['高新技术企业', '专精特新'] },
                { cat: '管理', tags: ['重点关注', '优质企业'] },
                { cat: '行业', tags: ['人工智能', '数据服务'] },
                { cat: '企业', tags: ['技术驱动', '创新型'] },
              ].map(({ cat, tags }) => (
                <div key={cat} className="cd-label-category-row">
                  <div className="cd-label-cat-badge">{cat}</div>
                  <div className="cd-label-tags">
                    {tags.map(tag => (
                      <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 数商专有标签 */}
        <div className="cd-label-group">
          <div className="cd-label-group-header">
            <span className="cd-label-group-name">数商专有标签</span>
            <button className="cd-label-collapse-btn" onClick={() => setLabelExpanded2(!labelExpanded2)}>
              <img src={labelExpanded2 ? iconChevronUp : iconChevronDown} alt="收起" width={14} height={14} />
              <span>{labelExpanded2 ? '收起' : '展开'}</span>
            </button>
          </div>
          {labelExpanded2 && (
            <div className="cd-label-categories">
              {[
                { cat: '官方', tags: ['数据应用示范'] },
                { cat: '管理', tags: ['数商重点培育'] },
                { cat: '行业', tags: ['数据分析', 'AI应用'] },
                { cat: '企业', tags: ['数据服务商'] },
              ].map(({ cat, tags }) => (
                <div key={cat} className="cd-label-category-row">
                  <div className="cd-label-cat-badge">{cat}</div>
                  <div className="cd-label-tags">
                    {tags.map(tag => (
                      <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 基本字段 */}
        <div className="cd-info-grid">
          <div className="cd-info-item">
            <span className="cd-info-label">注册时间：</span>
            <span className="cd-info-value">2018-03-15</span>
          </div>
          <div className="cd-info-item">
            <span className="cd-info-label">注册资本：</span>
            <span className="cd-info-value">5000万元</span>
          </div>
          <div className="cd-info-item cd-info-item--full">
            <span className="cd-info-label">产业分类：</span>
            <span className="cd-info-value">软件和信息技术服务业</span>
          </div>
          {[
            { label: '注册地：', value: '拱墅区祥符街道' },
            { label: '经营地：', value: '拱墅区祥符街道' },
            { label: '税源地：', value: '拱墅区祥符街道' },
            { label: '统计地：', value: '拱墅区祥符街道' },
          ].map(({ label, value }) => (
            <div key={label} className="cd-info-item cd-info-item--full cd-info-item--with-link">
              <span className="cd-info-label">{label}</span>
              <span className="cd-info-value">{value}</span>
              <span className="cd-info-link">查看详情</span>
            </div>
          ))}
          <div className="cd-info-item cd-info-item--full">
            <span className="cd-info-label">数商产业：</span>
            <div className="cd-info-tags">
              <span className="cd-tag cd-tag--gray">数据应用企业</span>
              <span className="cd-tag cd-tag--gray">数据分析企业</span>
            </div>
          </div>
          <div className="cd-info-item cd-info-item--full">
            <span className="cd-info-label">租赁类型：</span>
            <span className="cd-info-value">租赁</span>
          </div>
          <div className="cd-info-item cd-info-item--full">
            <span className="cd-info-label">租赁日期：</span>
            <span className="cd-info-value">2023-01-01</span>
          </div>
        </div>

        {/* 企业介绍 */}
        <div className="cd-intro-block">
          <div className="cd-intro-title">企业介绍</div>
          <p className="cd-intro-text">专注于企业数据智能分析和大数据应用服务，为政府和企业提供数据驱动的决策支持系统。</p>
        </div>

        {/* 企业层级 */}
        <div className="cd-level-block">
          <span className="cd-level-label">企业层级</span>
          <span className="cd-level-badge">头部企业</span>
        </div>
      </div>

      {/* 服务与产品 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['product'] = el}>
        <div className="cd-section-header">
          <img src={iconFileText} alt="服务产品" width={20} height={20} />
          <span className="cd-section-title">服务与产品</span>
        </div>
        <div className="cd-product-grid">
          {[
            { name: '企业数据分析平台', type: 'SaaS产品' },
            { name: '智能决策系统', type: '解决方案' },
            { name: '数据可视化服务', type: '技术服务' },
            { name: 'AI智能客服', type: 'SaaS产品' },
          ].map((p) => (
            <div key={p.name} className="cd-product-item">
              <span className="cd-product-name">{p.name}</span>
              <span className="cd-product-type">{p.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 专利信息 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['patent'] = el}>
        <div className="cd-section-header">
          <img src={iconNavPatent} alt="专利" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">专利信息</span>
        </div>
        <div className="cd-list-items">
          {[
            { title: '基于机器学习的企业风险预测方法', pub: 'CN202110345678.9', cat: 'G06Q', date: '2021-03-28' },
            { title: '企业数据智能分析系统', pub: 'CN202010234567.8', cat: 'G06F', date: '2020-09-15' },
            { title: '多维数据可视化展示方法及装置', pub: 'CN201910123456.7', cat: 'G06T', date: '2019-06-20' },
          ].map((item) => (
            <div key={item.pub} className="cd-list-item">
              <div className="cd-list-item-title">{item.title}</div>
              <div className="cd-list-item-meta">
                <span>公布号：{item.pub}</span>
                <span>分类：{item.cat}</span>
                <span>申请日期：{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 软件著作权 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['copyright'] = el}>
        <div className="cd-section-header">
          <img src={iconNavCopyright} alt="著作权" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">软件著作权</span>
        </div>
        <div className="cd-list-items">
          {[
            { title: '企业数据分析平台软件V1.0', reg: '2021SR0123456', ver: 'V1.0', date: '2021-05-18' },
            { title: '智能决策支持系统V2.0', reg: '2022SR0234567', ver: 'V2.0', date: '2022-08-25' },
            { title: '数据可视化引擎V1.5', reg: '2023SR0345678', ver: 'V1.5', date: '2023-03-12' },
          ].map((item) => (
            <div key={item.reg} className="cd-list-item">
              <div className="cd-list-item-title">{item.title}</div>
              <div className="cd-list-item-meta">
                <span>登记号：{item.reg}</span>
                <span>版本：{item.ver}</span>
                <span>登记日期：{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 商业模式 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['model'] = el}>
        <div className="cd-section-header">
          <img src={iconNavModel} alt="商业模式" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">商业模式</span>
        </div>
        <p className="cd-intro-text">以SaaS订阅和定制化解决方案为主要盈利模式，通过技术创新和数据资产积累建立核心竞争力。</p>
        <div className="cd-model-section">
          <div className="cd-model-subtitle">盈利模式</div>
          <div className="cd-list-items">
            {[
              { name: 'SaaS订阅服务', desc: '提供月度/年度订阅服务，支持企业灵活按需采购，占总收入的60%左右。' },
              { name: '定制化解决方案', desc: '针对大型政企客户提供定制化开发和实施服务，占总收入的20%左右。' },
              { name: '技术服务', desc: '提供数据咨询、系统集成、技术培训等增值服务，占总收入的20%左右。' },
            ].map((m) => (
              <div key={m.name} className="cd-model-item">
                <div className="cd-model-item-name">{m.name}</div>
                <div className="cd-model-item-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cd-model-section">
          <div className="cd-model-subtitle">核心竞争力</div>
          <div className="cd-list-items">
            {[
              { name: '技术领先', desc: '拥有自主研发的AI算法和数据处理引擎，处理速度比行业平均水平快3倍。' },
              { name: '数据资产', desc: '积累了超过10万家企业的多维数据，建立了完善的企业画像和风险评估模型。' },
              { name: '行业经验', desc: '服务过50+政府机构和200+大型企业，深刻理解客户需求和业务场景。' },
            ].map((m) => (
              <div key={m.name} className="cd-model-item">
                <div className="cd-model-item-name">{m.name}</div>
                <div className="cd-model-item-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cd-model-section">
          <div className="cd-model-subtitle">上下游关系</div>
          <div className="cd-upstream-downstream">
            <div className="cd-stream-box">
              <div className="cd-stream-title">上游企业类型</div>
              <div className="cd-stream-items">
                <span>• 云服务提供商</span>
                <span>• 数据源供应商</span>
                <span>• AI算法服务商</span>
              </div>
            </div>
            <div className="cd-stream-box">
              <div className="cd-stream-title">下游企业类型</div>
              <div className="cd-stream-items">
                <span>• 政府机构</span>
                <span>• 大型企业</span>
                <span>• 金融机构</span>
                <span>• 产业园区</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 负面因素 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['negative'] = el}>
        <div className="cd-section-header">
          <img src={iconNavNegative} alt="负面因素" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">负面因素</span>
        </div>
        <div className="cd-list-items">
          {[
            { type: '市场竞争', title: '同业竞争加剧', desc: '数据分析赛道涌入大量竞争者，部分大厂推出免费或低价产品，对公司定价策略形成压力。' },
            { type: '技术风险', title: '技术迭代压力', desc: 'AI技术快速发展，需要持续投入研发以保持技术领先，研发成本占比较高。' },
          ].map((item) => (
            <div key={item.title} className="cd-negative-item">
              <div className="cd-negative-header">
                <span className="cd-negative-type">{item.type}</span>
                <span className="cd-negative-title">{item.title}</span>
              </div>
              <p className="cd-negative-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 当前阶段痛点 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['pain'] = el}>
        <div className="cd-section-header">
          <img src={iconNavPain} alt="痛点" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">当前阶段痛点</span>
        </div>
        <div className="cd-list-items">
          {[
            { title: '人才招聘难', desc: '高端AI人才竞争激烈，招聘成本高且人员流动性大，影响项目交付和技术积累。' },
            { title: '客户获取成本高', desc: '政企客户决策周期长，销售成本高，需要投入大量资源进行市场拓展和客户关系维护。' },
            { title: '数据安全合规', desc: '数据安全和隐私保护要求越来越高，需要持续投入建设安全体系和获取相关资质认证。' },
          ].map((item) => (
            <div key={item.title} className="cd-pain-item">
              <div className="cd-pain-title">{item.title}</div>
              <p className="cd-pain-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 企业人才 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['talent'] = el}>
        <div className="cd-section-header">
          <img src={iconUsers} alt="人才" width={20} height={20} />
          <span className="cd-section-title">企业人才</span>
        </div>
        <div className="cd-list-items">
          {[
            { initial: '张', name: '张伟', nationality: '中国', level: '市级：E类' },
            { initial: '李', name: '李明', nationality: '中国', level: '区级：C类' },
            { initial: '王', name: '王芳', nationality: '中国', level: '市级：E类' },
          ].map((talent) => (
            <div key={talent.name} className="cd-talent-item">
              <div className="cd-talent-avatar">{talent.initial}</div>
              <div className="cd-talent-info">
                <div className="cd-talent-name">{talent.name}</div>
                <div className="cd-talent-nation">{talent.nationality}</div>
              </div>
              <span className="cd-talent-level">{talent.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 税收趋势 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['tax'] = el}>
        <div className="cd-section-header">
          <img src={iconTrendingUp} alt="税收" width={20} height={20} />
          <span className="cd-section-title">税收趋势</span>
        </div>
        <div className="cd-tax-chart">
          {[
            { month: '01', value: 30 }, { month: '02', value: 45 }, { month: '03', value: 60 },
            { month: '04', value: 40 }, { month: '05', value: 75 }, { month: '06', value: 55 },
            { month: '07', value: 80 }, { month: '08', value: 65 }, { month: '09', value: 90 },
            { month: '10', value: 70 }, { month: '11', value: 85 }, { month: '12', value: 100 },
          ].map((item) => (
            <div key={item.month} className="cd-bar-item">
              <div className="cd-bar-wrap">
                <div className="cd-bar" style={{ height: `${item.value}%` }} />
              </div>
              <span className="cd-bar-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 企业政策兑现 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['policy'] = el}>
        <div className="cd-section-header">
          <img src={iconNavPolicy} alt="政策" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">企业政策兑现</span>
        </div>
        <div className="cd-list-items">
          {[
            { name: '高新技术企业研发补助', date: '2024-05-15', amount: '50万' },
            { name: '数字经济发展专项资金', date: '2024-08-20', amount: '30.5万' },
            { name: '人才引进补贴', date: '2024-10-12', amount: '25.8万' },
            { name: '技术创新奖励', date: '2025-01-08', amount: '18.3万' },
            { name: '专利资助', date: '2025-02-25', amount: '12.5万' },
            { name: '软件著作权补助', date: '2024-06-30', amount: '8.9万' },
          ].map((item) => (
            <div key={item.name} className="cd-policy-item">
              <div className="cd-policy-left">
                <div className="cd-policy-name">{item.name}</div>
                <div className="cd-policy-date">{item.date}</div>
              </div>
              <span className="cd-policy-amount">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 融资 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['finance'] = el}>
        <div className="cd-section-header">
          <img src={iconNavFinance} alt="融资" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">融资信息</span>
        </div>
        <div className="cd-list-items">
          {[
            { round: '天使轮', amount: '500万', date: '2018-06-20', investors: '个人投资者' },
            { round: 'Pre-A轮', amount: '2000万', date: '2019-11-15', investors: '红杉资本中国' },
            { round: 'A轮', amount: '5000万', date: '2021-05-28', investors: '经纬中国、IDG资本' },
            { round: 'B轮', amount: '1.2亿', date: '2023-09-10', investors: '腾讯投资、高瓴创投' },
          ].map((item) => (
            <div key={item.round} className="cd-finance-item">
              <div className="cd-finance-top">
                <span className="cd-finance-round">{item.round}</span>
                <span className="cd-finance-amount">{item.amount}</span>
              </div>
              <div className="cd-finance-meta">
                <span>{item.date}</span>
                <span>{item.investors}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 招投标 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['bid'] = el}>
        <div className="cd-section-header">
          <img src={iconNavBid} alt="招投标" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">招投标</span>
        </div>
        <div className="cd-list-items">
          {[
            { title: '杭州市政府企业数据分析平台建设项目', date: '2024-08-15', amount: '880万', status: '中标' },
          ].map((item) => (
            <div key={item.title} className="cd-bid-item">
              <div className="cd-bid-title">{item.title}</div>
              <div className="cd-bid-meta">
                <span>{item.date}</span>
                <span>{item.amount}</span>
                <span className="cd-bid-status cd-bid-status--win">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 股权 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['equity'] = el}>
        <div className="cd-section-header">
          <img src={iconNavEquity} alt="股权" width={20} height={20} style={{ filter: 'brightness(0)' }} />
          <span className="cd-section-title">股权结构</span>
        </div>
        <div className="cd-list-items">
          {[
            { name: '张伟', ratio: '35.0%', type: '自然人' },
            { name: '红杉资本中国', ratio: '18.5%', type: '机构' },
            { name: '经纬中国', ratio: '12.3%', type: '机构' },
            { name: '腾讯投资', ratio: '10.0%', type: '机构' },
            { name: '其他股东', ratio: '24.2%', type: '多方' },
          ].map((item) => (
            <div key={item.name} className="cd-equity-item">
              <span className="cd-equity-name">{item.name}</span>
              <span className="cd-equity-type">{item.type}</span>
              <span className="cd-equity-ratio">{item.ratio}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部间距 */}
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 服务矩阵 Tab ===================== */
const SERVICE_MATRIX_DATA = [
  {
    level: '省级',
    dept: '浙江省经济和信息化厅',
    room: '数字经济处',
    func: '职能依据：推动数字经济发展',
    policy: '政策依据：浙江省数字经济促进条例',
    service: '服务内容：数字经济企业认定、专项资金申报',
  },
  {
    level: '市级',
    dept: '杭州市经济和信息化局',
    room: '软件和信息服务业处',
    func: '职能依据：促进软件产业发展',
    policy: '政策依据：杭州市软件产业发展政策',
    service: '服务内容：软件企业认定、研发补助申报',
  },
  {
    level: '区级',
    dept: '拱墅区经济和信息化局',
    room: '产业发展科',
    func: '职能依据：推动区域产业升级',
    policy: '政策依据：拱墅区产业扶持政策',
    service: '服务内容：产业项目审批、政策兑现',
  },
  {
    level: '街道',
    dept: '祥符街道办事处',
    room: '经济发展办',
    func: '职能依据：服务辖区企业',
    policy: '政策依据：街道企业服务工作方案',
    service: '服务内容：企业走访、诉求收集、政策宣讲',
  },
];

function ServiceMatrixTab() {
  const [levelFilter, setLevelFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [levelOpen, setLevelOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);

  const levels = ['省级', '市级', '区级', '街道'];
  const depts = ['省级部门', '市级部门', '区级部门', '街道部门'];

  const filtered = SERVICE_MATRIX_DATA.filter(item => {
    if (levelFilter && item.level !== levelFilter) return false;
    return true;
  });

  return (
    <div className="cd-sm-tab">
      {/* 筛选器 */}
      <div className="cd-sm-filters">
        <div className="cd-sm-filter-wrap">
          <button
            className={`cd-sm-filter-btn${levelFilter ? ' cd-sm-filter-btn--active' : ''}`}
            onClick={() => { setLevelOpen(!levelOpen); setDeptOpen(false); }}
          >
            <span>{levelFilter || '层级'}</span>
            <img src={iconCaretDown} alt="" width={12} height={12} />
          </button>
          {levelOpen && (
            <div className="cd-sm-dropdown">
              <div className="cd-sm-dropdown-item" onClick={() => { setLevelFilter(''); setLevelOpen(false); }}>全部</div>
              {levels.map(l => (
                <div
                  key={l}
                  className={`cd-sm-dropdown-item${levelFilter === l ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => { setLevelFilter(l); setLevelOpen(false); }}
                >
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cd-sm-filter-wrap">
          <button
            className={`cd-sm-filter-btn${deptFilter ? ' cd-sm-filter-btn--active' : ''}`}
            onClick={() => { setDeptOpen(!deptOpen); setLevelOpen(false); }}
          >
            <span>{deptFilter || '部门'}</span>
            <img src={iconCaretDown} alt="" width={12} height={12} />
          </button>
          {deptOpen && (
            <div className="cd-sm-dropdown">
              <div className="cd-sm-dropdown-item" onClick={() => { setDeptFilter(''); setDeptOpen(false); }}>全部</div>
              {depts.map(d => (
                <div
                  key={d}
                  className={`cd-sm-dropdown-item${deptFilter === d ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => { setDeptFilter(d); setDeptOpen(false); }}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 矩阵卡片列表 */}
      <div className="cd-sm-list">
        {filtered.map((item, idx) => (
          <div key={idx} className="cd-sm-card">
            <div className="cd-sm-card-header">
              <div className="cd-sm-level-badges">
                <span className="cd-sm-level-badge">{item.level}</span>
                <span className="cd-sm-dept-name">{item.dept}</span>
              </div>
              <div className="cd-sm-room-row">
                <span className="cd-sm-room-label">科室</span>
                <span className="cd-sm-room-name">{item.room}</span>
              </div>
            </div>
            <div className="cd-sm-card-body">
              <div className="cd-sm-info-row">{item.func}</div>
              <div className="cd-sm-info-row">{item.policy}</div>
              <div className="cd-sm-info-row">{item.service}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 企业服务 Tab ===================== */
const VISIT_RECORDS = [
  { date: '2026-03-05', desc: '了解企业近期经营情况和人才需求，协调解决办公场地扩租问题。', reporter: '上报人：祥符街道-王经理' },
  { date: '2026-02-18', desc: '宣讲2026年产业扶持政策，指导企业申报高新技术企业复审。', reporter: '上报人：区经信局-李主任' },
  { date: '2026-01-12', desc: '春节前慰问走访，了解企业发展规划和困难诉求。', reporter: '上报人：祥符街道-张书记' },
  { date: '2025-11-25', desc: '调研企业数据安全合规建设情况，提供相关政策咨询。', reporter: '上报人：区经信局-刘科长' },
];

const DEMANDS = [
  { id: 1, date: '2026-02-28', status: '已解决', text: '希望协调解决高端人才落户问题' },
  { id: 2, date: '2026-01-15', status: '处理中', text: '申请办公场地租金补贴' },
  { id: 3, date: '2025-12-10', status: '已解决', text: '咨询数据中心建设审批流程' },
  { id: 4, date: '2025-10-20', status: '已解决', text: '反馈政策申报系统操作复杂' },
];

function EnterpriseServiceTab() {
  return (
    <div className="cd-es-tab">
      {/* 走访记录 */}
      <div className="cd-section-card">
        <div className="cd-section-header">
          <img src={iconUsers} alt="走访记录" width={20} height={20} />
          <span className="cd-section-title">走访记录</span>
        </div>
        <div className="cd-visit-timeline">
          {VISIT_RECORDS.map((record, idx) => (
            <div key={idx} className="cd-visit-item">
              <div className="cd-visit-timeline-left">
                <div className="cd-visit-dot" />
                {idx < VISIT_RECORDS.length - 1 && <div className="cd-visit-line" />}
              </div>
              <div className="cd-visit-content">
                <div className="cd-visit-date">{record.date}</div>
                <div className="cd-visit-desc">{record.desc}</div>
                <div className="cd-visit-reporter">{record.reporter}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 企业诉求 */}
      <div className="cd-section-card">
        <div className="cd-section-header">
          <img src={iconMessageSquare} alt="企业诉求" width={20} height={20} />
          <span className="cd-section-title">企业诉求</span>
        </div>
        <div className="cd-demand-list">
          {DEMANDS.map((item) => (
            <div key={item.id} className="cd-demand-item">
              <div className="cd-demand-header">
                <div className="cd-demand-id-row">
                  <span className="cd-demand-id">#{item.id}</span>
                  <span className="cd-demand-date">{item.date}</span>
                </div>
                <span className={`cd-demand-status${item.status === '已解决' ? ' cd-demand-status--done' : ' cd-demand-status--processing'}`}>
                  {item.status}
                </span>
              </div>
              <div className="cd-demand-text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 企业动态 Tab ===================== */
const NEWS_DATA = [
  {
    id: 1,
    type: '合作动态',
    title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
    date: '2026-02-28',
    content: '拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
    source: '杭州证券报',
    relatedCount: 1,
  },
  {
    id: 2,
    type: '行业动态',
    title: '杭州数智科技有限公司入选国家数字化转型典型案例',
    date: '2026-01-15',
    content: '工业和信息化部近日公布2025年度国家数字化转型典型案例名单，杭州数智科技有限公司凭借智能数据分析平台的应用实践成功入选。',
    source: '拱墅发布',
    relatedCount: 1,
  },
];

const CHANGES = [
  { date: '2025-12-15', type: '注册资本变更', detail: '变更前：3000万元→变更后：5000万元', expanded: false },
  { date: '2024-06-20', type: '新增分公司', detail: '变更前：无→变更后：上海分公司', expanded: false },
];

const RISKS = [
  { date: '2024-03-08', type: '行政处罚', level: '中', title: '行政处罚', desc: '因数据处理合规问题被处以行政处罚。' },
];

function EnterpriseDynamicTab({ navigate, companyId }) {
  const [subTab, setSubTab] = useState('news');
  const [expandedChanges, setExpandedChanges] = useState({});

  const toggleChange = (idx) => {
    setExpandedChanges(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="cd-dynamic-tab">
      {/* Sub-tabs */}
      <div className="cd-sub-tabs">
        {[
          { key: 'news', label: '企业资讯' },
          { key: 'changes', label: '企业变更' },
          { key: 'risks', label: '企业风险' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`cd-sub-tab-btn${subTab === tab.key ? ' cd-sub-tab-btn--active' : ''}`}
            onClick={() => setSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 企业资讯 */}
      {subTab === 'news' && (
        <div className="cd-news-section">
          <div className="cd-section-header cd-section-header--inline">
            <img src={iconNewsFileText} alt="企业资讯" width={20} height={20} />
            <span className="cd-section-title">企业资讯</span>
          </div>
          {NEWS_DATA.map((item) => (
            <div key={item.id} className="cd-news-card">
              <div className="cd-news-top">
                <span className="cd-news-badge">{item.type}</span>
                <button
                  className="cd-news-detail-btn"
                  onClick={() => navigate(`/company-news-detail/${item.id}`)}
                >
                  查看详情 →
                </button>
              </div>
              <div className="cd-news-title-row">
                <div className="cd-news-dot" />
                <span className="cd-news-title">{item.title}</span>
                <span className="cd-news-date">{item.date}</span>
              </div>
              <p className="cd-news-content">{item.content}</p>
              <div className="cd-news-meta">
                <div className="cd-news-source">
                  <img src={iconNavInfo} alt="" width={12} height={12} />
                  <span>{item.source}</span>
                </div>
                <div className="cd-news-related">
                  <span>关联 {item.relatedCount} 家企业</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 企业变更 */}
      {subTab === 'changes' && (
        <div className="cd-changes-section">
          <div className="cd-section-header cd-section-header--inline">
            <img src={iconActivity} alt="企业变更" width={20} height={20} />
            <span className="cd-section-title">企业变更</span>
          </div>
          <div className="cd-change-list">
            {CHANGES.map((item, idx) => (
              <div key={idx} className="cd-change-item">
                <button className="cd-change-toggle" onClick={() => toggleChange(idx)}>
                  <div className="cd-change-toggle-left">
                    <span className="cd-change-date">{item.date}</span>
                    <span className="cd-change-type">{item.type}</span>
                  </div>
                  <img
                    src={expandedChanges[idx] ? iconChevronUp : iconChevronDown}
                    alt="展开"
                    width={16}
                    height={16}
                  />
                </button>
                {expandedChanges[idx] && (
                  <div className="cd-change-detail">{item.detail}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 企业风险 */}
      {subTab === 'risks' && (
        <div className="cd-risks-section">
          <div className="cd-section-header cd-section-header--inline">
            <img src={iconNavNegative} alt="企业风险" width={20} height={20} style={{ filter: 'brightness(0)' }} />
            <span className="cd-section-title">企业风险</span>
          </div>
          <div className="cd-risk-list">
            {RISKS.map((item, idx) => (
              <div key={idx} className="cd-risk-item">
                <div className="cd-risk-header">
                  <span className="cd-risk-date">{item.date}</span>
                  <span className="cd-risk-type">{item.type}</span>
                  <span className={`cd-risk-level cd-risk-level--${item.level === '高' ? 'high' : item.level === '中' ? 'mid' : 'low'}`}>{item.level}</span>
                </div>
                <div className="cd-risk-title">{item.title}</div>
                <p className="cd-risk-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 全生命周期 Tab ===================== */
const LIFECYCLE_DATA = [
  { date: '2018-03-15', type: '工商注册', title: '公司成立', desc: '杭州数智科技有限公司在拱墅区市场监管局登记注册' },
  { date: '2018-06-20', type: '融资', title: '天使轮融资', desc: '获得500万天使轮融资' },
  { date: '2019-05-10', type: '资质认证', title: '高新技术企业认定', desc: '通过高新技术企业认定' },
  { date: '2019-11-15', type: '融资', title: 'Pre-A轮融资', desc: '获红杉资本中国2000万Pre-A轮融资' },
  { date: '2021-03-28', type: '知识产权', title: '专利申请', desc: '申请发明专利《基于机器学习的企业风险预测方法》' },
  { date: '2021-05-18', type: '知识产权', title: '软件著作权登记', desc: '获得企业数据分析平台软件著作权' },
  { date: '2021-05-28', type: '融资', title: 'A轮融资', desc: '获经纬中国、IDG资本联合投资5000万A轮融资' },
  { date: '2022-08-25', type: '知识产权', title: '软件著作权登记', desc: '获得智能决策支持系统软件著作权' },
  { date: '2023-09-10', type: '融资', title: 'B轮融资', desc: '获腾讯投资、高瓴创投联合投资1.2亿B轮融资' },
  { date: '2024-05-15', type: '政策兑现', title: '获政府补助', desc: '获得高新技术企业研发补助50万元' },
  { date: '2024-06-20', type: '工商变更', title: '新设分公司', desc: '在上海设立分公司' },
  { date: '2024-08-15', type: '招投标', title: '中标政府项目', desc: '中标杭州市政府企业数据分析平台建设项目' },
  { date: '2025-12-15', type: '工商变更', title: '注册资本变更', desc: '注册资本由3000万增至5000万' },
  { date: '2026-03-05', type: '政府服务', title: '企业走访', desc: '街道领导走访企业，了解发展情况' },
];

const TYPE_COLORS = {
  '工商注册': '#155DFC',
  '融资': '#008236',
  '资质认证': '#E17100',
  '知识产权': '#6936F5',
  '政策兑现': '#0C8B8B',
  '工商变更': '#C44B00',
  '招投标': '#155DFC',
  '政府服务': '#6A7282',
};

function LifecycleTab() {
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const types = ['工商注册', '融资', '资质认证', '知识产权', '政策兑现', '工商变更', '招投标', '政府服务'];
  const dateRanges = ['2018年', '2019年', '2021年', '2022年', '2023年', '2024年', '2025年', '2026年'];

  const filtered = LIFECYCLE_DATA.filter(item => {
    if (typeFilter && item.type !== typeFilter) return false;
    if (dateFilter && !item.date.startsWith(dateFilter.replace('年', ''))) return false;
    return true;
  });

  return (
    <div className="cd-lc-tab">
      {/* 筛选器 */}
      <div className="cd-sm-filters">
        <div className="cd-sm-filter-wrap">
          <button
            className={`cd-sm-filter-btn${typeFilter ? ' cd-sm-filter-btn--active' : ''}`}
            onClick={() => { setTypeOpen(!typeOpen); setDateOpen(false); }}
          >
            <span>{typeFilter || '数据类型'}</span>
            <img src={iconCaretDown} alt="" width={12} height={12} />
          </button>
          {typeOpen && (
            <div className="cd-sm-dropdown">
              <div className="cd-sm-dropdown-item" onClick={() => { setTypeFilter(''); setTypeOpen(false); }}>全部</div>
              {types.map(t => (
                <div
                  key={t}
                  className={`cd-sm-dropdown-item${typeFilter === t ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cd-sm-filter-wrap">
          <button
            className={`cd-sm-filter-btn${dateFilter ? ' cd-sm-filter-btn--active' : ''}`}
            onClick={() => { setDateOpen(!dateOpen); setTypeOpen(false); }}
          >
            <span>{dateFilter || '日期'}</span>
            <img src={iconCaretDown} alt="" width={12} height={12} />
          </button>
          {dateOpen && (
            <div className="cd-sm-dropdown">
              <div className="cd-sm-dropdown-item" onClick={() => { setDateFilter(''); setDateOpen(false); }}>全部</div>
              {dateRanges.map(d => (
                <div
                  key={d}
                  className={`cd-sm-dropdown-item${dateFilter === d ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => { setDateFilter(d); setDateOpen(false); }}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 生命周期档案 */}
      <div className="cd-section-card">
        <div className="cd-section-header">
          <img src={iconTrendingUp} alt="全生命周期" width={20} height={20} />
          <span className="cd-section-title">企业全生命周期档案</span>
        </div>
        <div className="cd-lc-timeline">
          {filtered.map((item, idx) => (
            <div key={idx} className="cd-lc-item">
              <div className="cd-lc-timeline-left">
                <div className="cd-lc-dot" style={{ background: TYPE_COLORS[item.type] || '#6A7282' }} />
                {idx < filtered.length - 1 && <div className="cd-lc-line" />}
              </div>
              <div className="cd-lc-content">
                <div className="cd-lc-meta">
                  <span className="cd-lc-date">{item.date}</span>
                  <span className="cd-lc-type" style={{ color: TYPE_COLORS[item.type] || '#6A7282' }}>{item.type}</span>
                </div>
                <div className="cd-lc-title">{item.title}</div>
                <p className="cd-lc-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

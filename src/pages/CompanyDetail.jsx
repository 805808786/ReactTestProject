import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iconBack from '../assets/icon-cd-back.svg';
import iconTabData from '../assets/icon-cd-tab-data.svg';
import iconTabServiceMatrix from '../assets/icon-cd-tab-service-matrix.svg';
import iconTabEnterpriseService from '../assets/icon-cd-tab-enterprise-service.svg';
import iconTabDynamic from '../assets/icon-cd-tab-dynamic.svg';
import iconTabLifecycle from '../assets/icon-cd-tab-lifecycle.svg';
import iconBuilding2 from '../assets/icon-cd-building2.svg';
import iconLocation from '../assets/icon-cd-location.svg';
import iconCalendarGray from '../assets/icon-cd-calendar.svg'; /* 假设此图标本来在 assets */
import iconDollarGray from '../assets/icon-cd-dollar-gray.svg';
import iconTagGray from '../assets/icon-cd-tag-gray.svg';
import iconAwardOrange from '../assets/icon-cd-award-orange.svg';
import iconInfoOrange from '../assets/icon-cd-info-orange.svg';
import iconChevronDownBlue from '../assets/icon-cd-chevron-down-blue.svg';
import iconChevronUpBlue from '../assets/icon-cd-chevron-up-blue.svg';
import iconChevronDownPurple from '../assets/icon-cd-chevron-down-purple.svg';
import iconChevronUpPurple from '../assets/icon-cd-chevron-up-purple.svg';
import iconTrendingGreen from '../assets/icon-cd-trending-green.svg';
import iconServiceGreen from '../assets/icon-cd-service-green.svg';
import iconCopyrightPurple from '../assets/icon-cd-copyright-purple.svg';
import iconModelPurple from '../assets/icon-cd-model-purple.svg';
import iconAlertRed from '../assets/icon-cd-alert-red.svg';
import iconLightbulbOrange from '../assets/icon-cd-lightbulb-orange.svg';
import iconUsersBlue from '../assets/icon-cd-users-blue.svg';
import iconPolicyPurple from '../assets/icon-cd-policy-purple.svg';
import iconDemandOrange from '../assets/icon-cd-demand-orange.svg';
import iconDollarGreen from '../assets/icon-cd-dollar-green.svg';
import iconBagBlue from '../assets/icon-cd-bag-blue.svg';
import iconEquityPurple from '../assets/icon-cd-equity-purple.svg';
import iconCheckGreen from '../assets/icon-cd-check-green.svg';
import iconClockOrange from '../assets/icon-cd-clock-orange.svg';
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
  const [expandedAddress, setExpandedAddress] = useState(null);
  const sectionRefs = useRef({});

  const scrollToSection = (key) => {
    const el = sectionRefs.current[key];
    if (el) {
      const container = document.querySelector('.cd-body');
      if (container) {
        // 计算目标元素相对于容器的偏移量
        // offsetTop 是相对于父元素的，这里需要确保准确
        const headerOffset = 0; 
        const elementPosition = el.offsetTop;
        container.scrollTo({
          top: elementPosition - headerOffset - 12,
          behavior: 'smooth'
        });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="cd-data-tab">
      {/* 快速导航 */}
      <div className="cd-quick-nav-wrapper">
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
                  onClick={() => {
                    setNavExpanded(false);
                    setTimeout(() => scrollToSection(item.key), 50);
                  }}
                >
                  <img src={item.icon} alt={item.label} width={20} height={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 企业基本信息 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['basic'] = el}>
        <div className="cd-section-header">
          <img src={iconBuilding2} alt="基本信息" width={20} height={20} />
          <span className="cd-section-title">企业基本信息</span>
        </div>

        {/* 企业层级 */}
        <div className="cd-rank-banner">
          <div className="cd-rank-banner-left">
            <img src={iconAwardOrange} alt="等级" width={20} height={20} />
            <div className="cd-rank-banner-text">
              <span className="cd-rank-banner-label">企业层级</span>
              <span className="cd-rank-banner-value">头部企业</span>
            </div>
          </div>
          <img src={iconInfoOrange} alt="说明" width={16} height={16} className="cd-rank-banner-info-icon" />
        </div>

        {/* 企业通用标签 */}
        <div className="cd-tag-section">
          <div className="cd-tag-section-title">企业通用标签</div>
          {!labelExpanded ? (
            <div className="cd-tag-flat-list">
              {['高新技术企业', '专精特新', '重点关注', '优质企业', '人工智能', '数据服务', '技术驱动', '创新型'].map(tag => (
                <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
              ))}
            </div>
          ) : (
            <div className="cd-tag-categories">
              {[
                { cat: '官方', tags: ['高新技术企业', '专精特新'] },
                { cat: '管理', tags: ['重点关注', '优质企业'] },
                { cat: '行业', tags: ['人工智能', '数据服务'] },
                { cat: '企业', tags: ['技术驱动', '创新型'] },
              ].map(({ cat, tags }) => (
                <div key={cat} className="cd-tag-category-row">
                  <span className="cd-tag-cat-name">{cat}</span>
                  <div className="cd-tag-list">
                    {tags.map(tag => (
                      <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="cd-tag-toggle-btn" onClick={() => setLabelExpanded(!labelExpanded)}>
            <img src={labelExpanded ? iconChevronUpBlue : iconChevronDownBlue} alt="" width={12} height={12} />
            <span>{labelExpanded ? '收起' : '展开'}</span>
          </button>
        </div>

        {/* 数商专有标签 */}
        <div className="cd-tag-section cd-tag-section--purple">
          <div className="cd-tag-section-title cd-tag-section-title--purple">数商专有标签</div>
          {!labelExpanded2 ? (
            <div className="cd-tag-flat-list">
              {['数据应用示范', '数商重点培育', '数据分析', 'AI应用', '数据服务商'].map(tag => (
                <span key={tag} className="cd-tag cd-tag--purple">{tag}</span>
              ))}
            </div>
          ) : (
            <div className="cd-tag-categories">
              {[
                { cat: '官方', tags: ['数据应用示范'] },
                { cat: '管理', tags: ['数商重点培育'] },
                { cat: '行业', tags: ['数据分析', 'AI应用'] },
                { cat: '企业', tags: ['数据服务商'] },
              ].map(({ cat, tags }) => (
                <div key={cat} className="cd-tag-category-row">
                  <span className="cd-tag-cat-name">{cat}</span>
                  <div className="cd-tag-list">
                    {tags.map(tag => (
                      <span key={tag} className="cd-tag cd-tag--purple">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="cd-tag-toggle-btn cd-tag-toggle-btn--purple" onClick={() => setLabelExpanded2(!labelExpanded2)}>
            <img src={labelExpanded2 ? iconChevronUpPurple : iconChevronDownPurple} alt="" width={12} height={12} />
            <span>{labelExpanded2 ? '收起' : '展开'}</span>
          </button>
        </div>

        {/* 基本字段 */}
        <div className="cd-info-grid">
          <div className="cd-info-item">
            <img src={iconCalendarGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">注册时间：</span>
            <span className="cd-info-value">2018-03-15</span>
          </div>
          <div className="cd-info-item">
            <img src={iconDollarGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">注册资本：</span>
            <span className="cd-info-value"><strong>5000万元</strong></span>
          </div>
          <div className="cd-info-item cd-info-item--full">
            <img src={iconTagGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">产业分类：</span>
            <span className="cd-info-value">软件和信息技术服务业</span>
          </div>
          {[
            { key: 'reg', label: '注册地：', value: '拱墅区祥符街道', detail: '浙江省杭州市拱墅区祥符街道花园岗街88号1幢' },
            { key: 'biz', label: '经营地：', value: '拱墅区祥符街道', detail: '浙江省杭州市拱墅区祥符街道花园岗街88号1幢' },
            { key: 'tax', label: '税源地：', value: '拱墅区祥符街道', detail: '浙江省杭州市拱墅区祥符街道花园岗街88号1幢' },
            { key: 'stat', label: '统计地：', value: '拱墅区祥符街道', detail: '浙江省杭州市拱墅区祥符街道花园岗街88号1幢' },
          ].map(({ key, label, value, detail }) => (
            <div key={key} className="cd-info-address-group">
              <div className="cd-info-item cd-info-item--full cd-info-item--with-link">
                <img src={iconLocation} alt="地址" width={14} height={14} className="cd-info-address-icon" />
                <span className="cd-info-label">{label}</span>
                <span className="cd-info-value">{value}</span>
                <span 
                  className="cd-info-link"
                  onClick={() => setExpandedAddress(expandedAddress === key ? null : key)}
                >
                  {expandedAddress === key ? '收起' : '查看详情'}
                </span>
              </div>
              {expandedAddress === key && (
                <div className="cd-info-address-detail">{detail}</div>
              )}
            </div>
          ))}
          <div className="cd-info-item cd-info-item--full cd-info-item--nolabel-icon">
            <span className="cd-info-label">数商产业：</span>
            <div className="cd-info-tags">
              <span className="cd-tag cd-tag--solid-pink">数据应用企业</span>
              <span className="cd-tag cd-tag--solid-pink">数据分析企业</span>
            </div>
          </div>
          <div className="cd-info-item cd-info-item--full cd-info-item--nolabel-icon">
            <span className="cd-info-label">租赁类型：</span>
            <span className="cd-info-value">租赁</span>
            <span className="cd-info-label" style={{ marginLeft: 16 }}>租赁日期：</span>
            <span className="cd-info-value">2023-01-01</span>
          </div>
        </div>

        {/* 企业介绍 */}
        <div className="cd-intro-block">
          <div className="cd-intro-title">企业介绍</div>
          <p className="cd-intro-text">专注于企业数据智能分析和大数据应用服务，为政府和企业提供数据驱动的决策支持系统。</p>
        </div>
      </div>

      {/* 服务与产品 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['product'] = el}>
        <div className="cd-section-header">
          <img src={iconServiceGreen} alt="服务产品" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">服务与产品</span>
        </div>
        <div className="cd-product-list">
          {[
            { name: '企业数据分析平台', type: 'SaaS产品' },
            { name: '智能决策系统', type: '解决方案' },
            { name: '数据可视化服务', type: '技术服务' },
            { name: 'AI智能客服', type: 'SaaS产品' },
          ].map((p) => (
            <div key={p.name} className="cd-product-item-new">
              <span className="cd-product-name-new">{p.name}</span>
              <span className="cd-product-tag-new">{p.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 专利信息 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['patent'] = el}>
        <div className="cd-section-header">
          <img src={iconAwardOrange} alt="专利" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">专利信息</span>
        </div>
        <div className="cd-patent-list">
          {[
            { title: '基于机器学习的企业风险预测方法', pub: 'CN202110345678.9', cat: 'G06Q', date: '2021-03-28' },
            { title: '企业数据智能分析系统', pub: 'CN202010234567.8', cat: 'G06F', date: '2020-09-15' },
            { title: '多维数据可视化展示方法及装置', pub: 'CN201910123456.7', cat: 'G06T', date: '2019-06-20' },
          ].map((item) => (
            <div key={item.pub} className="cd-patent-card">
              <div className="cd-patent-name">{item.title}</div>
              <div className="cd-patent-infos">
                <div className="cd-patent-info-row">
                  <span className="cd-patent-info-label">公布号：</span>
                  <span className="cd-patent-info-value">{item.pub}</span>
                  <span className="cd-patent-info-label" style={{ marginLeft: 24 }}>分类：</span>
                  <span className="cd-patent-info-value">{item.cat}</span>
                </div>
                <div className="cd-patent-info-row">
                  <span className="cd-patent-info-label">申请日期：</span>
                  <span className="cd-patent-info-value">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 软件著作权 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['copyright'] = el}>
        <div className="cd-section-header">
          <img src={iconCopyrightPurple} alt="著作权" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">软件著作权</span>
        </div>
        <div className="cd-copyright-list">
          {[
            { title: '企业数据分析平台软件V1.0', reg: '2021SR0123456', ver: 'V1.0', date: '2021-05-18' },
            { title: '智能决策支持系统V2.0', reg: '2022SR0234567', ver: 'V2.0', date: '2022-08-25' },
            { title: '数据可视化引擎V1.5', reg: '2023SR0345678', ver: 'V1.5', date: '2023-03-12' },
          ].map((item) => (
            <div key={item.reg} className="cd-copyright-card">
              <div className="cd-copyright-name">{item.title}</div>
              <div className="cd-copyright-infos">
                <div className="cd-copyright-info-row">
                  <span className="cd-copyright-info-label">登记号：</span>
                  <span className="cd-copyright-info-value">{item.reg}</span>
                  <span className="cd-copyright-info-label" style={{ marginLeft: 24 }}>版本：</span>
                  <span className="cd-copyright-info-value">{item.ver}</span>
                </div>
                <div className="cd-copyright-info-row">
                  <span className="cd-copyright-info-label">登记日期：</span>
                  <span className="cd-copyright-info-value">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 商业模式 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['model'] = el}>
        <div className="cd-section-header">
          <img src={iconModelPurple} alt="商业模式" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">商业模式</span>
        </div>
        <div className="cd-model-intro-card">
          以SaaS订阅和定制化解决方案为主要盈利模式，通过技术创新和数据资产积累建立核心竞争力。
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">盈利模式</div>
          {[
            { name: 'SaaS订阅服务', desc: '提供按年订阅的企业数据分析平台，包含基础版、专业版、企业版三种套餐，年费从5万到50万不等。' },
            { name: '定制化解决方案', desc: '为大型企业和政府机构提供定制化的数据分析和决策支持系统，项目金额通常在100万-500万。' },
            { name: '技术服务', desc: '提供数据咨询、系统集成、技术培训等增值服务，占总收入的20%左右。' },
          ].map((m) => (
            <div key={m.name} className="cd-model-card cd-model-card--green">
              <div className="cd-model-card-name cd-model-card-name--green">{m.name}</div>
              <div className="cd-model-card-desc">{m.desc}</div>
            </div>
          ))}
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">核心竞争力</div>
          {[
            { name: '技术领先', desc: '拥有自主研发的AI算法和数据处理引擎，处理速度比行业平均水平快3倍。' },
            { name: '数据资产', desc: '积累了超过10万家企业的多维数据，建立了完善的企业画像和风险评估模型。' },
            { name: '行业经验', desc: '服务过50+政府机构和200+大型企业，深刻理解客户需求和业务场景。' },
          ].map((m) => (
            <div key={m.name} className="cd-model-card cd-model-card--blue">
              <div className="cd-model-card-name cd-model-card-name--blue">{m.name}</div>
              <div className="cd-model-card-desc">{m.desc}</div>
            </div>
          ))}
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">上下游关系</div>
          <div className="cd-model-stream-grid">
            <div className="cd-model-stream-card cd-model-stream-card--orange">
              <div className="cd-model-stream-title cd-model-stream-title--orange">上游企业类型</div>
              <div className="cd-model-stream-list">
                <span>• 云服务提供商</span>
                <span>• 数据源供应商</span>
                <span>• AI算法服务商</span>
              </div>
            </div>
            <div className="cd-model-stream-card cd-model-stream-card--cyan">
              <div className="cd-model-stream-title cd-model-stream-title--cyan">下游企业类型</div>
              <div className="cd-model-stream-list">
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
          <img src={iconAlertRed} alt="负面因素" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">负面因素</span>
        </div>
        <div className="cd-negative-list-new">
          {[
            { type: '市场竞争', title: '同业竞争加剧', desc: '数据分析赛道涌入大量竞争者，部分大厂推出免费或低价产品，对公司定价策略形成压力。' },
            { type: '技术风险', title: '技术迭代压力', desc: 'AI技术快速发展，需要持续投入研发以保持技术领先，研发成本占比较高。' },
          ].map((item) => (
            <div key={item.title} className="cd-negative-card-new">
              <div className="cd-negative-title-row">
                <span className="cd-negative-tag-new">{item.type}</span>
                <span className="cd-negative-name-new">{item.title}</span>
              </div>
              <div className="cd-negative-desc-new">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 当前阶段痛点 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['pain'] = el}>
        <div className="cd-section-header">
          <img src={iconLightbulbOrange} alt="痛点" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">当前阶段痛点</span>
        </div>
        <div className="cd-pain-list-new">
          {[
            { title: '人才招聘难', desc: '高端AI人才竞争激烈，招聘成本高且人员流动性大，影响项目交付和技术积累加工。' },
            { title: '客户获取成本高', desc: '政企客户决策周期长，销售成本高，需要投入大量资源进行市场拓展和客户关系维护。' },
            { title: '数据安全合规', desc: '数据安全和隐私保护要求越来越高，需要持续投入建设安全体系和获取相关资质认证。' },
          ].map((item) => (
            <div key={item.title} className="cd-pain-card-new">
              <div className="cd-pain-name-new">{item.title}</div>
              <div className="cd-pain-desc-new">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 企业人才 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['talent'] = el}>
        <div className="cd-section-header">
          <img src={iconUsersBlue} alt="人才" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业人才</span>
        </div>
        <div className="cd-talent-list-new">
          {[
            { initial: '张', name: '张伟', nationality: '中国', level: '市级：E类' },
            { initial: '李', name: '李明', nationality: '中国', level: '区级：C类' },
            { initial: '王', name: '王芳', nationality: '中国', level: '市级：E类' },
          ].map((talent) => (
            <div key={talent.name} className="cd-talent-card-new">
              <div className="cd-talent-avatar-new">{talent.initial}</div>
              <div className="cd-talent-info-new">
                <div className="cd-talent-name-new">{talent.name}</div>
                <div className="cd-talent-nation-new">{talent.nationality}</div>
              </div>
              <div className="cd-talent-tag-new">{talent.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 税收趋势 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['tax'] = el}>
        <div className="cd-section-header">
          <img src={iconTrendingGreen} alt="税收" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">税收趋势</span>
        </div>
        <div className="cd-tax-line-chart-wrap">
          <svg viewBox="0 0 320 170" width="100%" height="100%">
            {/* Y轴网格及标签 */}
            {[0, 25, 50, 75, 100].map(val => {
              const y = 150 - val * 1.3;
              return (
                <g key={`y-${val}`}>
                  <line x1="24" y1={y} x2="310" y2={y} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1={y} x2="24" y2={y} stroke="#9CA3AF" strokeWidth="1" />
                  <text x="16" y={y + 3} fontSize="10" fill="#9CA3AF" textAnchor="end">{val}</text>
                </g>
              );
            })}

            {/* X轴网格及标签 */}
            {TAX_TREND_DATA.map((item, idx) => {
              const xPos = 24 + idx * (286 / (TAX_TREND_DATA.length - 1));
              return (
                <g key={`x-${idx}`}>
                  <line x1={xPos} y1="20" x2={xPos} y2="150" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={xPos} y1="150" x2={xPos} y2="154" stroke="#9CA3AF" strokeWidth="1" />
                  <text x={xPos} y="166" fontSize="10" fill="#9CA3AF" textAnchor="middle">{item.month}</text>
                </g>
              );
            })}

            {/* 实线 Y 轴 / X 轴 */}
            <line x1="24" y1="20" x2="24" y2="150" stroke="#6B7280" strokeWidth="1" />
            <line x1="24" y1="150" x2="310" y2="150" stroke="#6B7280" strokeWidth="1" />

            {/* 蓝色趋势线 */}
            <path 
              d={generateSmoothPath(TAX_TREND_DATA, 'blue')}
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* 绿色趋势线 */}
            <path 
              d={generateSmoothPath(TAX_TREND_DATA, 'green')}
              fill="none" 
              stroke="#00E88E" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>

      {/* 企业政策兑现 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['policy'] = el}>
        <div className="cd-section-header">
          <img src={iconPolicyPurple} alt="政策" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业政策兑现</span>
        </div>
        <div className="cd-policy-summary-banner">
          2024-04-01至2026-03-09，已兑现拱墅区10类的12项政策，共计兑现<span className="cd-hl-purple">158.98万元</span>
        </div>
        <div className="cd-policy-list-new">
          {[
            { name: '高新技术企业研发补助', date: '2024-05-15', amount: '50万' },
            { name: '数字经济发展专项资金', date: '2024-08-20', amount: '30.5万' },
            { name: '人才引进补贴', date: '2024-10-12', amount: '25.8万' },
            { name: '技术创新奖励', date: '2025-01-08', amount: '18.3万' },
            { name: '专利资助', date: '2025-02-25', amount: '12.5万' },
            { name: '软件著作权补助', date: '2024-06-30', amount: '8.9万' },
            { name: '小微企业扶持资金', date: '2024-11-18', amount: '6.2万' },
            { name: '产业升级奖励', date: '2024-09-05', amount: '6.78万' },
          ].map((item) => (
            <div key={item.name} className="cd-policy-card-new">
              <div className="cd-policy-left-new">
                <div className="cd-policy-name-new">{item.name}</div>
                <div className="cd-policy-date-new">{item.date}</div>
              </div>
              <div className="cd-policy-amount-new">{item.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 企业需求 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['demand'] = el}>
        <div className="cd-section-header">
          <img src={iconDemandOrange} alt="需求" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业需求</span>
        </div>
        <div className="cd-demand-list-new">
          {[
            { title: '希望获得更多研发资金支持', type: '资金需求', status: 'done' },
            { title: '需要高端AI人才引进政策支持', type: '人才需求', status: 'done' },
            { title: '申请数据中心建设用地', type: '场地需求', status: 'pending' },
            { title: '寻求政府数据开放合作机会', type: '业务需求', status: 'done' },
          ].map((item, idx) => (
            <div key={idx} className="cd-demand-card-new">
              <div className="cd-demand-info-new">
                <div className="cd-demand-name-new">{item.title}</div>
                <div className="cd-demand-type-new">{item.type}</div>
              </div>
              <img 
                src={item.status === 'done' ? iconCheckGreen : iconClockOrange} 
                alt="" width={20} height={20} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* 融资 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['finance'] = el}>
        <div className="cd-section-header">
          <img src={iconDollarGreen} alt="融资" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">融资</span>
        </div>
        <div className="cd-finance-list-new">
          {[
            { round: '天使轮', amount: '500万', date: '2018-06-20', investors: '某天使投资人' },
            { round: 'Pre-A轮', amount: '2000万', date: '2019-11-15', investors: '红杉资本中国' },
            { round: 'A轮', amount: '5000万', date: '2021-05-28', investors: '经纬中国、IDG资本' },
            { round: 'B轮', amount: '1.2亿', date: '2023-09-10', investors: '腾讯投资、高瓴创投' },
          ].map((item) => (
            <div key={item.round} className="cd-finance-card-new">
              <div className="cd-finance-top-new">
                <span className="cd-finance-round-new">{item.round}</span>
                <span className="cd-finance-amount-new">{item.amount}</span>
              </div>
              <div className="cd-finance-row-new">
                <span className="cd-finance-label-new">披露日期：</span>
                <span className="cd-finance-value-new">{item.date}</span>
              </div>
              <div className="cd-finance-row-new">
                <span className="cd-finance-label-new">投资方：</span>
                <span className="cd-finance-value-new">{item.investors}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 招投标 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['bid'] = el}>
        <div className="cd-section-header">
          <img src={iconBagBlue} alt="招投标" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">招投标</span>
        </div>
        <div className="cd-bid-list-new">
          {[
            { name: '杭州市政府企业数据分析平台建设项目', date: '2024-08-15', city: '杭州市', type: '中标公告', amount: '380万', agent: '杭州数智科技有限公司', inviter: '杭州市经济和信息化局' },
            { name: '拱墅区产业大数据可视化系统', date: '2024-11-20', city: '杭州市', type: '中标公告', amount: '220万', agent: '杭州数智科技有限公司', inviter: '拱墅区经济和信息化局' },
            { name: '企业风险监测预警平台采购', date: '2025-01-10', city: '杭州市', type: '招标公告', amount: '预算500万', agent: '-', inviter: '杭州市市场监督管理局' },
          ].map((item, idx) => (
            <div key={idx} className="cd-bid-card-new">
              <div className="cd-bid-name-new">{item.name}</div>
              <div className="cd-bid-grid-new">
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">发布日期：</span>
                  <span className="cd-bid-value-new">{item.date}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">地市：</span>
                  <span className="cd-bid-value-new">{item.city}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">公告类型：</span>
                  <span className="cd-bid-value-new">{item.type}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">涉及金额：</span>
                  <span className="cd-bid-value-new">{item.amount}</span>
                </div>
              </div>
              <div className="cd-bid-row-new">
                <span className="cd-bid-label-new">中标机构：</span>
                <span className="cd-bid-value-new">{item.agent}</span>
              </div>
              <div className="cd-bid-row-new">
                <span className="cd-bid-label-new">招标人：</span>
                <span className="cd-bid-value-new">{item.inviter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 股权穿透图 */}
      <div className="cd-section-card" ref={el => sectionRefs.current['equity'] = el}>
        <div className="cd-section-header">
          <img src={iconEquityPurple} alt="股权" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">股权穿透图</span>
        </div>
        
        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">法定代表人</div>
          <div className="cd-legal-btn-new">张伟</div>
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">股东结构</div>
          <div className="cd-shareholder-list-new">
            {[
              { name: '张伟', ratio: '35%' },
              { name: '李明', ratio: '25%' },
              { name: '腾讯投资', ratio: '20%' },
              { name: '高瓴创投', ratio: '15%' },
              { name: '员工持股平台', ratio: '5%' },
            ].map((item, idx) => (
              <div key={idx} className="cd-shareholder-card-new">
                <div className="cd-shareholder-name-new">{item.name}</div>
                <div className="cd-shareholder-ratio-new">{item.ratio}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">分支机构</div>
          <div className="cd-branch-list-new">
            <div className="cd-branch-item-new">• 杭州数智科技有限公司北京分公司</div>
            <div className="cd-branch-item-new">• 杭州数智科技有限公司上海分公司</div>
          </div>
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">子公司</div>
          <div className="cd-sub-list-new">
            <div className="cd-sub-item-new">• 杭州数智数据服务有限公司</div>
            <div className="cd-sub-item-new">• 杭州智云科技有限公司</div>
          </div>
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
    func: '推动数字经济发展',
    policy: '浙江省数字经济促进条例',
    service: '数字经济企业认定、专项资金申报',
  },
  {
    level: '市级',
    dept: '杭州市经济和信息化局',
    room: '软件和信息服务业处',
    func: '促进软件产业发展',
    policy: '杭州市软件产业发展政策',
    service: '软件企业认定、研发补助申报',
  },
  {
    level: '区级',
    dept: '拱墅区经济和信息化局',
    room: '产业发展科',
    func: '推动区域产业升级',
    policy: '拱墅区产业扶持政策',
    service: '产业项目审批、政策兑现',
  },
  {
    level: '街道',
    dept: '祥符街道办事处',
    room: '经济发展办',
    func: '服务辖区企业',
    policy: '街道企业服务工作方案',
    service: '企业走访、诉求收集、政策宣讲',
  },
];

const TAX_TREND_DATA = [
  { month: '01', blue: 0, green: 0 },
  { month: '02', blue: 36, green: 26 },
  { month: '03', blue: 52, green: 38 },
  { month: '04', blue: 60, green: 45 },
  { month: '05', blue: 63, green: 58 },
  { month: '06', blue: 71, green: 67 },
  { month: '07', blue: 78, green: 75 },
  { month: '08', blue: 80, green: 82 },
  { month: '09', blue: 80, green: 88 },
  { month: '10', blue: 84, green: 90 },
  { month: '11', blue: 88, green: 93 },
  { month: '12', blue: 91, green: 98 },
  { month: '01', blue: 90, green: 97 },
  { month: '02', blue: 90, green: 97 },
  { month: '03', blue: 88, green: 100 },
];

const generateSmoothPath = (data, key) => {
  if (data.length === 0) return '';
  const startX = 24;
  const startY = 150 - data[0][key] * 1.3;
  let d = `M ${startX} ${startY}`;
  
  const stepX = 286 / (data.length - 1);
  for (let i = 0; i < data.length - 1; i++) {
    const currX = startX + i * stepX;
    const currY = 150 - data[i][key] * 1.3;
    const nextX = startX + (i + 1) * stepX;
    const nextY = 150 - data[i + 1][key] * 1.3;
    const cpX = (currX + nextX) / 2;
    d += ` C ${cpX} ${currY}, ${cpX} ${nextY}, ${nextX} ${nextY}`;
  }
  return d;
};


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
              <div className="cd-sm-info-row">
                <span className="cd-sm-info-label">职能依据：</span>
                {item.func}
              </div>
              <div className="cd-sm-info-row">
                <span className="cd-sm-info-label">政策依据：</span>
                {item.policy}
              </div>
              <div className="cd-sm-info-row">
                <span className="cd-sm-info-label">服务内容：</span>
                {item.service}
              </div>
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
  { date: '2025-12-15', type: '注册资本变更', before: '3000万元', after: '5000万元', detail: '注册资本由3000万元增加至5000万元' },
  { date: '2024-06-20', type: '新增分公司', before: '无', after: '上海分公司', detail: '在上海设立分公司' },
];

const RISKS = [
  { date: '2024-03-08', type: '行政处罚', level: '中', title: '行政处罚', desc: '因数据处理合规问题被处以行政处罚。' },
];

function EnterpriseDynamicTab({ navigate, companyId }) {
  const [subTab, setSubTab] = useState('changes');
  // 保持其中一个默认展开，如风险默认展开第一个
  const [expandedChanges, setExpandedChanges] = useState({ 0: true });
  const [expandedRisks, setExpandedRisks] = useState({ 0: true });
  const sectionRefs = useRef({});

  // 监听滚动更新高亮Tab
  useEffect(() => {
    const rootEl = document.querySelector('.cd-body');
    if (!rootEl) return;

    const observer = new IntersectionObserver((entries) => {
      // 遍历所有交叉项，找到正在相交的最大一个，或者简单点谁进入了就选谁
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setSubTab(entry.target.dataset.key);
        }
      });
    }, {
      root: rootEl,
      rootMargin: '-80px 0px -60% 0px', // 在靠上的位置时触发高亮
      threshold: 0
    });

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTab = (key) => {
    setSubTab(key);
    const el = sectionRefs.current[key];
    const rootEl = document.querySelector('.cd-body');
    if (el && rootEl) {
      // 获取当前滚动的距离
      const rootRect = rootEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      // 减去 60px 左右的悬浮 Tab 高度偏移量
      const offsetTop = elRect.top - rootRect.top + rootEl.scrollTop - 60;
      rootEl.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const toggleChange = (idx) => setExpandedChanges(prev => ({ ...prev, [idx]: !prev[idx] }));
  const toggleRisk = (idx) => setExpandedRisks(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="cd-dynamic-tab">
      {/* 顶部吸顶 Tabs */}
      <div className="cd-sub-tabs-wrapper">
        <div className="cd-sub-tabs-card">
          {[
            { key: 'changes', label: '企业变更' },
            { key: 'news', label: '企业资讯' },
            { key: 'risks', label: '企业风险' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`cd-sub-tab-btn${subTab === tab.key ? ' cd-sub-tab-btn--active' : ''}`}
              onClick={() => scrollToTab(tab.key)}
            >
              <div className="cd-sub-tab-text">{tab.label}</div>
              {subTab === tab.key && <div className="cd-sub-tab-indicator" />}
            </button>
          ))}
        </div>
      </div>

      <div className="cd-dynamic-sections">
        {/* 企业变更 */}
        <div className="cd-section-card cd-dynamic-card" ref={el => sectionRefs.current['changes'] = el} data-key="changes">
          <div className="cd-section-header">
            <img src={iconActivity} alt="企业变更" width={20} height={20} />
            <span className="cd-section-title">企业变更</span>
          </div>
          <div className="cd-change-list">
            {CHANGES.map((item, idx) => (
              <div key={idx} className={`cd-change-item${expandedChanges[idx] ? ' cd-change-item--expanded' : ''}`}>
                <button className="cd-change-toggle" onClick={() => toggleChange(idx)}>
                  <div className="cd-change-toggle-left">
                    <span className="cd-change-date">{item.date}</span>
                    <span className="cd-change-badge">{item.type}</span>
                  </div>
                  <img src={expandedChanges[idx] ? iconChevronUp : iconChevronDown} alt="展开" width={16} height={16} className="cd-change-icon" />
                </button>
                <div className="cd-change-versus">
                  变更前： <span className="cd-change-versus-val">{item.before}</span> 
                  <span className="cd-change-versus-arrow">→</span>
                  变更后： <span className="cd-change-versus-val-after">{item.after}</span>
                </div>
                {expandedChanges[idx] && (
                  <div className="cd-change-detail">{item.detail}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 企业资讯 */}
        <div className="cd-section-card cd-dynamic-card" ref={el => sectionRefs.current['news'] = el} data-key="news">
          <div className="cd-section-header">
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
                  <img src={iconNavInfo} alt="" width={12} height={12} style={{opacity: 0.5}} />
                  <span>{item.source}</span>
                </div>
                <div className="cd-news-related">
                  <span>关联 {item.relatedCount} 家企业</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 企业风险 */}
        <div className="cd-section-card cd-dynamic-card" ref={el => sectionRefs.current['risks'] = el} data-key="risks">
          <div className="cd-section-header">
            <img src={iconNavNegative} alt="企业风险" width={20} height={20} style={{ filter: 'brightness(0)' }} />
            <span className="cd-section-title">企业风险</span>
          </div>
          <div className="cd-risk-list">
            {RISKS.map((item, idx) => (
              <div key={idx} className={`cd-risk-item${expandedRisks[idx] ? ' cd-risk-item--expanded' : ''}`}>
                <button className="cd-risk-toggle" onClick={() => toggleRisk(idx)}>
                  <div className="cd-risk-toggle-left">
                    <span className="cd-risk-date-red">{item.date}</span>
                    <span className="cd-risk-badge-red">{item.title}</span>
                    <span className="cd-risk-level-orange">{item.level}</span>
                  </div>
                  <img src={expandedRisks[idx] ? iconChevronUp : iconChevronDown} alt="展开" width={16} height={16} className="cd-risk-icon" />
                </button>
                <div className="cd-risk-main-title">{item.title}</div>
                {expandedRisks[idx] && (
                  <div className="cd-risk-detail">{item.desc}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
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
      <div className="cd-lc-filter-card">
        <div className="cd-lc-filter-wrap">
          <button
            className={`cd-lc-filter-btn${typeFilter ? ' cd-lc-filter-btn--active' : ''}`}
            onClick={() => { setTypeOpen(!typeOpen); setDateOpen(false); }}
          >
            <span>{typeFilter || '数据类型'}</span>
            <img src={iconCaretDown} alt="" width={10} height={10} />
          </button>
          {typeOpen && (
            <div className="cd-sm-dropdown" style={{ width: '100%', left: 0 }}>
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
        
        <div className="cd-lc-filter-divider" />

        <div className="cd-lc-filter-wrap">
          <button
            className={`cd-lc-filter-btn${dateFilter ? ' cd-lc-filter-btn--active' : ''}`}
            onClick={() => { setDateOpen(!dateOpen); setTypeOpen(false); }}
          >
            <span>{dateFilter || '日期'}</span>
            <img src={iconCaretDown} alt="" width={10} height={10} />
          </button>
          {dateOpen && (
            <div className="cd-sm-dropdown" style={{ width: '100%', left: 0 }}>
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
        <div className="cd-section-header cd-lc-header">
          <img src={iconTrendingUp} alt="全生命周期" width={18} height={18} className="cd-lc-header-icon" />
          <span className="cd-section-title">企业全生命周期档案</span>
        </div>
        <div className="cd-lc-timeline">
          {filtered.map((item, idx) => (
            <div key={idx} className="cd-lc-item">
              <div className="cd-lc-timeline-left">
                <div className="cd-lc-dot" />
                {idx < filtered.length - 1 && <div className="cd-lc-line" />}
              </div>
              <div className="cd-lc-content">
                <div className="cd-lc-meta">
                  <span className="cd-lc-date">{item.date}</span>
                  <span className="cd-lc-type">{item.type}</span>
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

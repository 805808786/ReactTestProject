import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iconTabData from '../assets/icon-cd-tab-data.svg';
import PageHeader from '../components/PageHeader';
import iconTabDataActive from '../assets/icon-cd-tab-data-active.svg';
import iconTabServiceMatrix from '../assets/icon-cd-tab-service-matrix.svg';
import iconTabEnterpriseService from '../assets/icon-cd-tab-enterprise-service.svg';
import iconTabDynamic from '../assets/icon-cd-tab-dynamic.svg';
import iconTabDynamicActive from '../assets/icon-cd-tab-dynamic-active.svg';
import iconTabLifecycle from '../assets/icon-cd-tab-lifecycle.svg';
import iconTabLifecycleActive from '../assets/icon-cd-tab-lifecycle-active.svg';
import iconTabServiceMatrixActive from '../assets/icon-cd-tab-service-matrix-active.svg';
import iconTabEnterpriseServiceActive from '../assets/icon-cd-tab-enterprise-service-active.svg';
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
import enterpriseDataJson from '../json/enterprise.json';
import { getSslmEnterprisesInfoById, getSslmEnterprisesTagListById, dataService, selectListByName, selectCopyrightListByName, getSslmEnterprisesInfoEntityById, getSslmEnterprisesById, getEnterpriseTalent, selectListBuildingTrends, queryPolicyRedemptionTotal, queryPolicyRedemptionPage, modelPredictionDemand, getFinancingInfo, getBidInfo, getEnterpriseEquityPenetrationInfo, serviceMatrixList, selectEnterpriseVisitsList, getBusinessCommunityEnterpriseAppealPage, getBusinessCommunityEnterpriseNewsPage, getManageRiskEarlyWarningPage, enterpriseDynamicArchivesCount, enterpriseDynamicArchivesList } from '../api/enterprise';

const getCompanyData = (id) => {
  if (!id) return enterpriseDataJson[0] || {};
  return enterpriseDataJson.find(item => String(item?.['基本信息']?.data?.enterpriseId) === String(id)) || enterpriseDataJson[0] || {};
};

/* ===================== Mock 数据 ===================== */
const MOCK_COMPANY = {
  1: { name: '科技创新有限公司', type: '头部企业', industry: '软件和信息技术服务业' },
  2: { name: '智能制造股份公司', type: '腰部企业', industry: '高端制造业' },
};

const DEFAULT_COMPANY = { name: '', type: '', industry: '' };

const TABS = [
  { key: 'data', label: '企业数据', icon: iconTabData, activeIcon: iconTabDataActive },
  { key: 'service-matrix', label: '服务矩阵', icon: iconTabServiceMatrix, activeIcon: iconTabServiceMatrixActive },
  { key: 'enterprise-service', label: '企业服务', icon: iconTabEnterpriseService, activeIcon: iconTabEnterpriseServiceActive },
  { key: 'dynamic', label: '企业动态', icon: iconTabDynamic, activeIcon: iconTabDynamicActive },
  { key: 'lifecycle', label: '全生命周期', icon: iconTabLifecycle, activeIcon: iconTabLifecycleActive },
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
  const [apiBasicInfo, setApiBasicInfo] = useState(null);
  const [apiTagsInfo, setApiTagsInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 从 API 获取企业基本信息
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesInfoById({ enterpriseId: id })
      .then((res) => {
        setApiBasicInfo(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取企业基本信息失败:', err);
        setApiBasicInfo({});
        setLoading(false);
      });
  }, [id]);

  // 从 API 获取企业标签信息
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesTagListById({ enterpriseId: id })
      .then((res) => {
        setApiTagsInfo({ tags: res.data || [] } || {});
      })
      .catch((err) => {
        console.error('获取企业标签信息失败:', err);
        setApiTagsInfo({});
      });
  }, [id]);

  // 只使用 API 数据
  const basicInfo = apiBasicInfo || {};

  const company = {
    name: basicInfo.enterpriseName || '',
    type: basicInfo.categoryName || '优质企业',
    industry: basicInfo.industrialTrack || ''
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="cd-container">
      {loading ? (
        <div className="cd-loading">
          <div className="cd-loading-spinner"></div>
          <p className="cd-loading-text">加载中...</p>
        </div>
      ) : (
        <>
          {/* ===== 头部 ===== */}
          <PageHeader title={company.name}>
            {/* Tab 栏 */}
            <div className="cd-tab-bar">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`cd-tab-btn${activeTab === tab.key ? ' cd-tab-btn--active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  <div className="cd-tab-inner">
                    <img src={activeTab === tab.key ? tab.activeIcon : tab.icon} alt={tab.label} width={16} height={16} className={activeTab === tab.key ? 'cd-tab-icon--active' : 'cd-tab-icon'} />
                    <span className="cd-tab-text">{tab.label}</span>
                  </div>
                  {activeTab === tab.key && <div className="cd-tab-indicator" />}
                </button>
              ))}
            </div>
          </PageHeader>

          {/* ===== 内容区域 ===== */}
          <div className="cd-body">
            {activeTab === 'data' && <EnterpriseDataTab apiBasicInfo={apiBasicInfo} apiTagsInfo={apiTagsInfo} />}
            {activeTab === 'service-matrix' && <ServiceMatrixTab />}
            {activeTab === 'enterprise-service' && <EnterpriseServiceTab />}
            {activeTab === 'dynamic' && <EnterpriseDynamicTab navigate={navigate} companyId={id} />}
            {activeTab === 'lifecycle' && <LifecycleTab />}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== 企业数据 Tab ===================== */
function EnterpriseDataTab({ apiBasicInfo, apiTagsInfo }) {
  const [navExpanded, setNavExpanded] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [labelExpanded, setLabelExpanded] = useState(false);
  const [labelExpanded2, setLabelExpanded2] = useState(false);
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [patentRecords, setPatentRecords] = useState([]);
  const [copyrightRecords, setCopyrightRecords] = useState([]);
  const [businessModelSummary, setBusinessModelSummary] = useState('');
  const [profitModelRecords, setProfitModelRecords] = useState([]);
  const [coreCompetitivenessRecords, setCoreCompetitivenessRecords] = useState([]);
  const [streamData, setStreamData] = useState([]);
  const [negativeRecords, setNegativeRecords] = useState([]);
  const [painRecords, setPainRecords] = useState([]);
  const [talentRecords, setTalentRecords] = useState([]);
  const [taxTrendData, setTaxTrendData] = useState([]);
  const [policySummary, setPolicySummary] = useState({});
  const [policyRecords, setPolicyRecords] = useState([]);
  const [demandRecords, setDemandRecords] = useState([]);
  const [financingRecords, setFinancingRecords] = useState([]);
  const [bidRecords, setBidRecords] = useState([]);
  const [equityData, setEquityData] = useState({});
  const sectionRefs = useRef({});

  // 提取股权穿透相关数据
  const { id } = useParams();

  // 从 API 获取企业服务与产品数据
  useEffect(() => {
    if (!id) return;
    dataService({ enterpriseId: id })
      .then((res) => {
        setServiceRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业服务与产品数据失败:', err);
        setServiceRecords([]);
      });
  }, [id]);

  // 从 API 获取企业专利信息
  useEffect(() => {
    const enterpriseName = apiBasicInfo?.enterpriseName;
    if (!enterpriseName) return;
    selectListByName({ name: enterpriseName })
      .then((res) => {
        setPatentRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业专利信息失败:', err);
        setPatentRecords([]);
      });
  }, [apiBasicInfo]);

  // 从 API 获取企业软件著作权信息
  useEffect(() => {
    const enterpriseName = apiBasicInfo?.enterpriseName;
    if (!enterpriseName) return;
    selectCopyrightListByName({ name: enterpriseName })
      .then((res) => {
        setCopyrightRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业软件著作权信息失败:', err);
        setCopyrightRecords([]);
      });
  }, [apiBasicInfo]);

  // 从 API 获取企业商业模式总结
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesInfoEntityById({ enterpriseId: id })
      .then((res) => {
        setBusinessModelSummary(res.data?.content || '');
      })
      .catch((err) => {
        console.error('获取企业商业模式总结失败:', err);
        setBusinessModelSummary('');
      });
  }, [id]);

  // 从 API 获取企业盈利模式
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesById({ enterpriseId: id, businessType: 1 })
      .then((res) => {
        setProfitModelRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业盈利模式失败:', err);
        setProfitModelRecords([]);
      });
  }, [id]);

  // 从 API 获取企业核心竞争力
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesById({ enterpriseId: id, businessType: 2 })
      .then((res) => {
        setCoreCompetitivenessRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业核心竞争力失败:', err);
        setCoreCompetitivenessRecords([]);
      });
  }, [id]);

  // 从 API 获取企业上下游关系
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesById({ enterpriseId: id, businessType: 5 })
      .then((res) => {
        setStreamData(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业上下游关系失败:', err);
        setStreamData([]);
      });
  }, [id]);

  // 从 API 获取企业负面因素
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesById({ enterpriseId: id, businessType: 3 })
      .then((res) => {
        let list = res.data || [];
        let newList = []
        list.map(s => {
          (s.riskFactors || []).map(x => {
            newList = [...newList, {
              title: s.title,
              describeContent: s.describeContent,
              content: x.content,
              subTitle: x.title,
            }]
          })
        })
        setNegativeRecords(newList);
      })
      .catch((err) => {
        console.error('获取企业负面因素失败:', err);
        setNegativeRecords([]);
      });
  }, [id]);

  // 从 API 获取企业当前阶段痛点
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesById({ enterpriseId: id, businessType: 4 })
      .then((res) => {
        setPainRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业当前阶段痛点失败:', err);
        setPainRecords([]);
      });
  }, [id]);

  // 从 API 获取企业人才数据
  useEffect(() => {
    if (!id) return;
    getEnterpriseTalent({ enterpriseId: id })
      .then((res) => {
        setTalentRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业人才数据失败:', err);
        setTalentRecords([]);
      });
  }, [id]);

  // 从 API 获取企业税收趋势数据
  useEffect(() => {
    const enterpriseName = apiBasicInfo?.enterpriseName;
    if (!id || !enterpriseName) return;
    selectListBuildingTrends({ enterpriseId: id, enterpriseName: enterpriseName })
      .then((res) => {
        // 处理税收趋势数据，确保格式正确
        const taxTrendRaw = res.data?.nameNumberList || [];
        const formattedTaxTrendData = taxTrendRaw.map(item => ({
          month: item.name?.replace('月', '') || '',
          val1: parseFloat(item.num1) || 0,
          val2: parseFloat(item.num2) || 0
        }));
        setTaxTrendData(formattedTaxTrendData);
      })
      .catch((err) => {
        console.error('获取企业税收趋势数据失败:', err);
        setTaxTrendData([]);
      });
  }, [id, apiBasicInfo]);

  // 从 API 获取企业政策兑现标题
  useEffect(() => {
    if (!id) return;
    queryPolicyRedemptionTotal({ enterpriseId: id })
      .then((res) => {
        setPolicySummary(res.data || {});
      })
      .catch((err) => {
        console.error('获取企业政策兑现标题失败:', err);
        setPolicySummary({});
      });
  }, [id]);

  // 从 API 获取企业政策兑现列表
  useEffect(() => {
    if (!id) return;
    queryPolicyRedemptionPage({ enterpriseId: id })
      .then((res) => {
        setPolicyRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业政策兑现列表失败:', err);
        setPolicyRecords([]);
      });
  }, [id]);

  // 从 API 获取企业需求数据
  useEffect(() => {
    if (!id) return;
    modelPredictionDemand({ enterpriseId: id })
      .then((res) => {
        setDemandRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业需求数据失败:', err);
        setDemandRecords([]);
      });
  }, [id]);

  // 从 API 获取企业融资数据
  useEffect(() => {
    if (!id) return;
    getFinancingInfo({ enterpriseId: id })
      .then((res) => {
        setFinancingRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业融资数据失败:', err);
        setFinancingRecords([]);
      });
  }, [id]);

  // 从 API 获取企业招投标数据
  useEffect(() => {
    if (!id) return;
    getBidInfo({ enterpriseId: id })
      .then((res) => {
        setBidRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业招投标数据失败:', err);
        setBidRecords([]);
      });
  }, [id]);

  // 从 API 获取企业股权穿透信息
  useEffect(() => {
    if (!id) return;
    getEnterpriseEquityPenetrationInfo({ enterpriseId: id })
      .then((res) => {
        setEquityData(res.data || {});
      })
      .catch((err) => {
        console.error('获取企业股权穿透信息失败:', err);
        setEquityData({});
      });
  }, [id]);

  // 只使用 API 数据
  const basicInfo = apiBasicInfo || {};
  const legalRepresentative = equityData.legalRepresentative || '';
  const shareholders = equityData.shareholders || [];
  const companyBranchs = equityData.companyBranchs || [];





  // 获取标签数据并分组
  const allTagsRaw = apiTagsInfo?.tags || [];

  // 企业通用标签：tagType 4,5,6,7
  const enterpriseGeneralTags = allTagsRaw.filter(tag => [4, 5, 6, 7].includes(tag.tagType));
  const generalTagGroupsMap = enterpriseGeneralTags.reduce((acc, curr) => {
    const cat = curr.tagCategoryName || '其他';
    if (!acc[cat]) acc[cat] = [];
    if (!acc[cat].includes(curr.tagName)) {
      acc[cat].push(curr.tagName);
    }
    return acc;
  }, {});
  const enterpriseTags = Object.entries(generalTagGroupsMap).map(([cat, tags]) => ({ cat, tags }));
  const enterpriseFlatTags = [...new Set(enterpriseGeneralTags.map(t => t.tagName))];

  // 数商专有标签：tagType 8,9,10,11
  const dataBusinessTags = allTagsRaw.filter(tag => [8, 9, 10, 11].includes(tag.tagType));
  const dataBusinessTagGroupsMap = dataBusinessTags.reduce((acc, curr) => {
    const cat = curr.tagCategoryName || '其他';
    if (!acc[cat]) acc[cat] = [];
    if (!acc[cat].includes(curr.tagName)) {
      acc[cat].push(curr.tagName);
    }
    return acc;
  }, {});
  const dataBusinessTagGroups = Object.entries(dataBusinessTagGroupsMap).map(([cat, tags]) => ({ cat, tags }));
  const dataBusinessFlatTags = [...new Set(dataBusinessTags.map(t => t.tagName))];

  // 获取上下游数据
  const upstreamData = streamData.find(item => item.title === '上游分析')?.describeContent || [];
  const downstreamData = streamData.find(item => item.title === '下游分析')?.describeContent || [];

  const maxVal = Math.max(...taxTrendData.map(d => Math.max(d.val1, d.val2)), 1);
  const getY = (val) => 150 - (val / maxVal) * 130;

  const generateDynamicPath = (data, key) => {
    if (data.length === 0) return '';
    const stepX = 286 / (data.length - 1);
    let d = `M 24 ${getY(data[0][key])}`;
    for (let i = 0; i < data.length - 1; i++) {
      const currX = 24 + i * stepX;
      const currY = getY(data[i][key]);
      const nextX = 24 + (idx => (idx + 1) * stepX)(i);
      const nextY = getY(data[i + 1][key]);
      const cpX = (currX + nextX) / 2;
      d += ` C ${cpX} ${currY}, ${cpX} ${nextY}, ${nextX} ${nextY}`;
    }
    return d;
  };

  const scrollToSection = (key) => {
    const el = sectionRefs.current[key];
    if (el) {
      const container = document.querySelector('.cd-body');
      if (container) {
        // 获取快速导航栏的高度
        const quickNav = document.querySelector('.cd-quick-nav-wrapper');
        const quickNavHeight = quickNav ? quickNav.offsetHeight : 0;

        // 使用 getBoundingClientRect() 获取元素相对于视口的位置
        // 然后计算相对于容器的位置
        const containerRect = container.getBoundingClientRect();
        const elementRect = el.getBoundingClientRect();
        const elementPosition = elementRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: elementPosition - quickNavHeight - 10,
          behavior: 'smooth'
        });
      }
    }
  };

  const toggleSectionCollapsed = (key) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSectionToggle = (key) => (
    <button
      type="button"
      className="cd-section-toggle"
      onClick={() => toggleSectionCollapsed(key)}
      aria-expanded={!collapsedSections[key]}
    >
      <span>{collapsedSections[key] ? '\u5c55\u5f00' : '\u6536\u8d77'}</span>
      <img src={collapsedSections[key] ? iconChevronDown : iconChevronUp} alt="" width={16} height={16} />
    </button>
  );

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
      <div className={`cd-section-card${collapsedSections.basic ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['basic'] = el}>
        <div className="cd-section-header">
          <img src={iconBuilding2} alt="基本信息" width={20} height={20} />
          <span className="cd-section-title">企业基本信息</span>
          {renderSectionToggle('basic')}
        </div>

        {/* 企业层级 */}
        {/* <div className="cd-rank-banner">
          <div className="cd-rank-banner-left">
            <img src={iconAwardOrange} alt="等级" width={20} height={20} />
            <div className="cd-rank-banner-text">
              <span className="cd-rank-banner-label">企业层级</span>
              <span className="cd-rank-banner-value">{basicInfo.categoryName || '重点企业'}</span>
            </div>
          </div>
          // <img src={iconInfoOrange} alt="说明" width={16} height={16} className="cd-rank-banner-info-icon" />
        </div> */}

        {/* 企业通用标签 */}
        {enterpriseTags.length > 0 && enterpriseFlatTags.length > 0 && <div className="cd-tag-section">
          <div className="cd-tag-section-title">企业通用标签</div>
          <div className="cd-tag-container">
            {!labelExpanded ? (
              <div className="cd-tag-flat-list">
                {enterpriseFlatTags.length > 0 ? (
                  enterpriseFlatTags.slice(0, 6).map(tag => (
                    <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
                  ))
                ) : (
                  <span className="cd-no-data-small">暂无标签</span>
                )}
              </div>
            ) : (
              <div className="cd-tag-categories">
                {enterpriseTags.length > 0 ? enterpriseTags.map(({ cat, tags }) => (
                  <div key={cat} className="cd-tag-category-row">
                    <span className="cd-tag-cat-name">{cat}</span>
                    <div className="cd-tag-list">
                      {tags.map(tag => (
                        <span key={tag} className="cd-tag cd-tag--blue">{tag}</span>
                      ))}
                    </div>
                  </div>
                )) : <div className="cd-no-data-small">暂无分类标签</div>}
              </div>
            )}
            <button className="cd-tag-toggle-btn" onClick={() => setLabelExpanded(!labelExpanded)}>
              <img src={labelExpanded ? iconChevronUpBlue : iconChevronDownBlue} alt="" width={12} height={12} />
              <span>{labelExpanded ? '收起' : '展开'}</span>
            </button>
          </div>
        </div>}

        {/* 数商专有标签 */}
        {dataBusinessTagGroups.length > 0 && dataBusinessFlatTags.length > 0 && <div className="cd-tag-section cd-tag-section--purple">
          <div className="cd-tag-section-title cd-tag-section-title--purple">数商专有标签</div>
          <div className="cd-tag-container">
            {!labelExpanded2 ? (
              <div className="cd-tag-flat-list">
                {dataBusinessFlatTags.length > 0 ? (
                  dataBusinessFlatTags.slice(0, 6).map(tag => (
                    <span key={tag} className="cd-tag cd-tag--purple">{tag}</span>
                  ))
                ) : (
                  <span className="cd-no-data-small">暂无标签</span>
                )}
              </div>
            ) : (
              <div className="cd-tag-categories">
                {dataBusinessTagGroups.length > 0 ? dataBusinessTagGroups.map(({ cat, tags }) => (
                  <div key={cat} className="cd-tag-category-row">
                    <span className="cd-tag-cat-name">{cat}</span>
                    <div className="cd-tag-list">
                      {tags.map(tag => (
                        <span key={tag} className="cd-tag cd-tag--purple">{tag}</span>
                      ))}
                    </div>
                  </div>
                )) : <div className="cd-no-data-small">暂无分类标签</div>}
              </div>
            )}
            <button className="cd-tag-toggle-btn cd-tag-toggle-btn--purple" onClick={() => setLabelExpanded2(!labelExpanded2)}>
              <img src={labelExpanded2 ? iconChevronUpPurple : iconChevronDownPurple} alt="" width={12} height={12} />
              <span>{labelExpanded2 ? '收起' : '展开'}</span>
            </button>
          </div>
        </div>}

        {/* 基本字段 */}
        <div className="cd-info-grid">
          <div className="cd-info-item">
            <img src={iconCalendarGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">注册时间：</span>
            <span className="cd-info-value">{basicInfo.establishmentDate || '-'}</span>
          </div>
          <div className="cd-info-item">
            <img src={iconDollarGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">注册资本：</span>
            <span className="cd-info-value"><strong>{basicInfo.registeredCapital || '-'}</strong></span>
          </div>
          <div className="cd-info-item cd-info-item--full">
            <img src={iconTagGray} alt="" width={14} height={14} className="cd-info-prefix-icon" />
            <span className="cd-info-label">产业分类：</span>
            <span className="cd-info-value">{basicInfo.industrialTrack || '-'}</span>
          </div>
          {[
            { key: 'reg', label: '注册地：', value: basicInfo.street || '-', detail: basicInfo.registeredAddress || '-' },
            { key: 'biz', label: '经营地：', value: basicInfo.businessAddressStreet || '-', detail: basicInfo.businessAddress || '-' },
            { key: 'tax', label: '税源地：', value: basicInfo.taxSourceLocation || '-', detail: basicInfo.taxSourceLocation || '-' },
            { key: 'stat', label: '统计地：', value: basicInfo.street || '-', detail: basicInfo.street || '-' },
          ].map(({ key, label, value, detail }) => (
            <div key={key} className="cd-info-address-group">
              <div className="cd-info-item cd-info-item--full cd-info-item--with-link">
                <img src={iconLocation} alt="地址" width={14} height={14} className="cd-info-address-icon" />
                <span className="cd-info-label">{label}</span>
                <span className="cd-info-value">{value}</span>
                {value != detail ?
                  <span
                    className="cd-info-link"
                    onClick={() => setExpandedAddress(expandedAddress === key ? null : key)}
                  >
                    {expandedAddress === key ? '收起' : '查看详情'}
                  </span> : <span></span>}
              </div>
              {expandedAddress === key && (
                <div className="cd-info-address-detail">{detail}</div>
              )}
            </div>
          ))}
          {basicInfo.firstIndustrialClassification &&
            <div className="cd-info-item cd-info-item--full cd-info-item--nolabel-icon">
              <span className="cd-info-label">数商产业：</span>
              <div className="cd-info-tags">
                <span className="cd-tag cd-tag--solid-pink">{basicInfo.firstIndustrialClassification}</span>
              </div>
            </div>}
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
          <p className="cd-intro-text">{basicInfo.enterpriseIntroduction || '暂无企业介绍。'}</p>
        </div>
      </div>

      {/* 服务与产品 */}
      <div className={`cd-section-card${collapsedSections.product ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['product'] = el}>
        <div className="cd-section-header">
          <img src={iconServiceGreen} alt="服务产品" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">服务与产品</span>
          {renderSectionToggle('product')}
        </div>
        <div className="cd-product-list">
          {serviceRecords.length > 0 ? serviceRecords.map((p, idx) => (
            <div key={idx} className="cd-product-item-new">
              <span className="cd-product-name-new">{p.serviceName}</span>
              <span className="cd-product-tag-new">{p.category}</span>
            </div>
          )) : <div className="cd-no-data">暂无服务与产品记录</div>}
        </div>
      </div>

      {/* 专利信息 */}
      <div className={`cd-section-card${collapsedSections.patent ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['patent'] = el}>
        <div className="cd-section-header">
          <img src={iconAwardOrange} alt="专利" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">专利信息</span>
          {renderSectionToggle('patent')}
        </div>
        <div className="cd-patent-list">
          {patentRecords.length > 0 ? patentRecords.map((item, idx) => (
            <div key={idx} className="cd-patent-card">
              <div className="cd-patent-name">{item.applicantName}</div>
              <div className="cd-patent-infos">
                <div className="cd-patent-info-row">
                  <span className="cd-patent-info-label">公布号：</span>
                  <span className="cd-patent-info-value">{item.pubNumber}</span>
                  <span className="cd-patent-info-label" style={{ marginLeft: 24 }}>分类：</span>
                  <span className="cd-patent-info-value">{item.patType}</span>
                </div>
                <div className="cd-patent-info-row">
                  <span className="cd-patent-info-label">申请日期：</span>
                  <span className="cd-patent-info-value">{item.appDate}</span>
                </div>
              </div>
            </div>
          )) : <div className="cd-no-data">暂无专利信息记录</div>}
        </div>
      </div>

      {/* 软件著作权 */}
      <div className={`cd-section-card${collapsedSections.copyright ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['copyright'] = el}>
        <div className="cd-section-header">
          <img src={iconCopyrightPurple} alt="著作权" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">软件著作权</span>
          {renderSectionToggle('copyright')}
        </div>
        <div className="cd-copyright-list">
          {copyrightRecords.length > 0 ? copyrightRecords.map((item, idx) => (
            <div key={idx} className="cd-copyright-card">
              <div className="cd-copyright-name">{item.fullName}</div>
              <div className="cd-copyright-infos">
                <div className="cd-copyright-info-row">
                  <span className="cd-copyright-info-label">登记号：</span>
                  <span className="cd-copyright-info-value">{item.regNum}</span>
                  <span className="cd-copyright-info-label" style={{ marginLeft: 24 }}>版本：</span>
                  <span className="cd-copyright-info-value">{item.version}</span>
                </div>
                <div className="cd-copyright-info-row">
                  <span className="cd-copyright-info-label">登记日期：</span>
                  <span className="cd-copyright-info-value">{item.regDate}</span>
                </div>
              </div>
            </div>
          )) : <div className="cd-no-data">暂无软件著作权记录</div>}
        </div>
      </div>

      {/* 商业模式 */}
      <div className={`cd-section-card${collapsedSections.model ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['model'] = el}>
        <div className="cd-section-header">
          <img src={iconModelPurple} alt="商业模式" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">商业模式</span>
          {renderSectionToggle('model')}
        </div>
        <div className="cd-model-intro-card">
          {businessModelSummary || '以技术创新和数据资产积累建立核心竞争力。'}
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">盈利模式</div>
          {profitModelRecords.length > 0 ? profitModelRecords.map((m, idx) => (
            <div key={idx} className="cd-model-card cd-model-card--green">
              <div className="cd-model-card-name cd-model-card-name--green">{m.title}</div>
              <div className="cd-model-card-desc">{m.describeContent?.[0] || ''}</div>
            </div>
          )) : <div className="cd-no-data">暂无盈利模式数据</div>}
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">核心竞争力</div>
          {coreCompetitivenessRecords.length > 0 ? coreCompetitivenessRecords.map((m, idx) => (
            <div key={idx} className="cd-model-card cd-model-card--blue">
              <div className="cd-model-card-name cd-model-card-name--blue">{m.title}</div>
              <div className="cd-model-card-desc">{m.describeContent?.[0] || ''}</div>
            </div>
          )) : <div className="cd-no-data">暂无核心竞争力数据</div>}
        </div>

        <div className="cd-model-sub-section">
          <div className="cd-model-sub-title">上下游关系</div>
          <div className="cd-model-stream-grid">
            <div className="cd-model-stream-card cd-model-stream-card--orange">
              <div className="cd-model-stream-title cd-model-stream-title--orange">上游企业类型</div>
              <div className="cd-model-stream-list">
                {upstreamData.length > 0 ? upstreamData.map((text, i) => (
                  <span key={i}>• {text}</span>
                )) : <span>暂无数据</span>}
              </div>
            </div>
            <div className="cd-model-stream-card cd-model-stream-card--cyan">
              <div className="cd-model-stream-title cd-model-stream-title--cyan">下游企业类型</div>
              <div className="cd-model-stream-list">
                {downstreamData.length > 0 ? downstreamData.map((text, i) => (
                  <span key={i}>• {text}</span>
                )) : <span>暂无数据</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 负面因素 */}
      <div className={`cd-section-card${collapsedSections.negative ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['negative'] = el}>
        <div className="cd-section-header">
          <img src={iconAlertRed} alt="负面因素" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">负面因素</span>
          {renderSectionToggle('negative')}
        </div>
        <div className="cd-negative-list-new">
          {negativeRecords.length > 0 ? negativeRecords.map((item, idx) => (
            <div key={idx} className="cd-negative-card-new">
              <div className="cd-negative-title-row">
                <span className="cd-negative-name-new">{item.title}</span>
                <span className="cd-negative-subname-new">{item.subTitle}</span>
              </div>
              <div className="cd-negative-desc-new">{item.content || ''}</div>
            </div>
          )) : <div className="cd-no-data">暂无负面因素</div>}
        </div>
      </div>

      {/* 当前阶段痛点 */}
      <div className={`cd-section-card${collapsedSections.pain ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['pain'] = el}>
        <div className="cd-section-header">
          <img src={iconLightbulbOrange} alt="痛点" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">当前阶段痛点</span>
          {renderSectionToggle('pain')}
        </div>
        <div className="cd-pain-list-new">
          {painRecords.length > 0 ? painRecords.map((item, idx) => (
            <div key={idx} className="cd-pain-card-new">
              <div className="cd-pain-name-new">{item.title}</div>
              <div className="cd-pain-desc-new">{item.describeContent?.[0] || ''}</div>
            </div>
          )) : <div className="cd-no-data">暂无痛点数据</div>}
        </div>
      </div>

      {/* 企业人才 */}
      <div className={`cd-section-card${collapsedSections.talent ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['talent'] = el}>
        <div className="cd-section-header">
          <img src={iconUsersBlue} alt="人才" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业人才</span>
          {renderSectionToggle('talent')}
        </div>
        <div className="cd-talent-list-new">
          {talentRecords.length > 0 ? talentRecords.map((talent, idx) => (
            <div key={idx} className="cd-talent-card-new">
              <div className="cd-talent-avatar-new">{(talent.name || '').substring(0, 1)}</div>
              <div className="cd-talent-info-new">
                <div className="cd-talent-name-new">{talent.name}</div>
                <div className="cd-talent-nation-new">{talent.nationality}</div>
              </div>
              <div className="cd-talent-tag-new">{talent.talentLevel}</div>
            </div>
          )) : <div className="cd-no-data">暂无人才数据</div>}
        </div>
      </div>

      {/* 税收趋势 */}
      <div className={`cd-section-card${collapsedSections.tax ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['tax'] = el}>
        <div className="cd-section-header">
          <img src={iconTrendingGreen} alt="税收" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">税收趋势</span>
          {renderSectionToggle('tax')}
        </div>
        <div className="cd-tax-line-chart-wrap">
          <svg viewBox="0 0 320 170" width="100%" height="100%">
            {/* Y轴网格及标签 */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
              const val = (maxVal * ratio).toFixed(0);
              const y = getY(maxVal * ratio);
              return (
                <g key={`y-${ratio}`}>
                  <line x1="24" y1={y} x2="310" y2={y} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1={y} x2="24" y2={y} stroke="#9CA3AF" strokeWidth="1" />
                  <text x="16" y={y + 3} fontSize="8" fill="#9CA3AF" textAnchor="end">
                    {val > 10000 ? (val / 10000).toFixed(1) + '万' : val}
                  </text>
                </g>
              );
            })}

            {/* X轴网格及标签 */}
            {taxTrendData.map((item, idx) => {
              const xPos = 24 + idx * (286 / (taxTrendData.length - 1));
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

            {/* 蓝色趋势线 (num1) */}
            <path
              d={generateDynamicPath(taxTrendData, 'val1')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 绿色趋势线 (num2) */}
            <path
              d={generateDynamicPath(taxTrendData, 'val2')}
              fill="none"
              stroke="#00E88E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 企业政策兑现 */}
      <div className={`cd-section-card${collapsedSections.policy ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['policy'] = el}>
        <div className="cd-section-header">
          <img src={iconPolicyPurple} alt="政策" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业政策兑现</span>
          {renderSectionToggle('policy')}
        </div>
        <div className="cd-policy-summary-banner">
          {policySummary.redemptionCycle}，已兑现拱墅区{policySummary.redemptionTotalType}类的{policySummary.redemptionTotalCount}项政策，共计兑现<span className="cd-hl-purple">{policySummary.paymentAmount}</span>
        </div>
        <div className="cd-policy-list-new">
          {policyRecords.length > 0 ? policyRecords.map((item, idx) => (
            <div key={idx} className="cd-policy-card-new">
              <div className="cd-policy-left-new">
                <div className="cd-policy-name-new">{item.policyName}</div>
                <div className="cd-policy-date-new">{(item.paymentDate || '').split(' ')[0]}</div>
              </div>
              <div className="cd-policy-amount-new">{item.paymentAmount || item.paymentTotalAmount || '-'}</div>
            </div>
          )) : <div className="cd-no-data">暂无政策兑现记录</div>}
        </div>
      </div>

      {/* 企业需求 */}
      <div className={`cd-section-card${collapsedSections.demand ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['demand'] = el}>
        <div className="cd-section-header">
          <img src={iconDemandOrange} alt="需求" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">企业需求</span>
          {renderSectionToggle('demand')}
        </div>
        <div className="cd-demand-list-new">
          {demandRecords.length > 0 ? demandRecords.map((item, idx) => (
            <div key={idx} className="cd-demand-card-new">
              <div className="cd-demand-info-new">
                <div className="cd-demand-name-new">{item.demandName}</div>
                <div className="cd-demand-type-new">{item.demandType}</div>
              </div>
              <img
                src={item.dataStatus === '1' ? iconCheckGreen : iconClockOrange}
                alt="" width={20} height={20}
              />
            </div>
          )) : <div className="cd-no-data">暂无企业需求</div>}
        </div>
      </div>

      {/* 融资 */}
      <div className={`cd-section-card${collapsedSections.finance ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['finance'] = el}>
        <div className="cd-section-header">
          <img src={iconDollarGreen} alt="融资" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">融资</span>
          {renderSectionToggle('finance')}
        </div>
        <div className="cd-finance-list-new">
          {financingRecords.length > 0 ? financingRecords.map((item, idx) => (
            <div key={idx} className="cd-finance-card-new">
              <div className="cd-finance-top-new">
                <span className="cd-finance-round-new">{item.name || '未知轮次'}</span>
                <span className="cd-finance-amount-new">{item.financingMoney || '-'}</span>
              </div>
              <div className="cd-finance-row-new">
                <span className="cd-finance-label-new">披露日期：</span>
                <span className="cd-finance-value-new">{item.disclosureDate || '-'}</span>
              </div>
              <div className="cd-finance-row-new">
                <span className="cd-finance-label-new">投资方：</span>
                <span className="cd-finance-value-new">{item.financing || '-'}</span>
              </div>
            </div>
          )) : <div className="cd-no-data">暂无融资数据</div>}
        </div>
      </div>

      {/* 招投标 */}
      <div className={`cd-section-card${collapsedSections.bid ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['bid'] = el}>
        <div className="cd-section-header">
          <img src={iconBagBlue} alt="招投标" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">招投标</span>
          {renderSectionToggle('bid')}
        </div>
        <div className="cd-bid-list-new">
          {bidRecords.length > 0 ? bidRecords.map((item, idx) => (
            <div key={idx} className="cd-bid-card-new">
              <div className="cd-bid-name-new">{item.title}</div>
              <div className="cd-bid-grid-new">
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">发布日期：</span>
                  <span className="cd-bid-value-new">{item.dateTime || '-'}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">地市：</span>
                  <span className="cd-bid-value-new">{item.city || '-'}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">公告类型：</span>
                  <span className="cd-bid-value-new">{item.noticeTypeSub || '-'}</span>
                </div>
                <div className="cd-bid-row-new">
                  <span className="cd-bid-label-new">涉及金额：</span>
                  <span className="cd-bid-value-new">{item.involvingMoney || '-'}</span>
                </div>
              </div>
              <div className="cd-bid-row-new">
                <span className="cd-bid-label-new">中标机构：</span>
                <span className="cd-bid-value-new">{item.bidWin || '-'}</span>
              </div>
              <div className="cd-bid-row-new">
                <span className="cd-bid-label-new">招标人：</span>
                <span className="cd-bid-value-new">{item.purchaser || '-'}</span>
              </div>
            </div>
          )) : <div className="cd-no-data">暂无招投标信息</div>}
        </div>
      </div>

      {/* 股权穿透图 */}
      <div className={`cd-section-card${collapsedSections.equity ? ' cd-section-card--collapsed' : ''}`} ref={el => sectionRefs.current['equity'] = el}>
        <div className="cd-section-header">
          <img src={iconEquityPurple} alt="股权" width={22} height={22} />
          <span className="cd-section-title cd-section-title--dark">股权穿透图</span>
          {renderSectionToggle('equity')}
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">法定代表人</div>
          <div className="cd-legal-btn-new">{legalRepresentative || '暂无'}</div>
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">股东结构</div>
          <div className="cd-shareholder-list-new">
            {shareholders.length > 0 ? shareholders.map((item, idx) => (
              <div key={idx} className="cd-shareholder-card-new">
                <div className="cd-shareholder-name-new">{item.shareholderName}</div>
                <div className="cd-shareholder-ratio-new">{(Number(item.holdingRatio) * 100).toFixed(0)}%</div>
              </div>
            )) : <div className="cd-no-data">暂无股东信息</div>}
          </div>
        </div>

        <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">分支机构</div>
          <div className="cd-branch-list-new">
            {companyBranchs.length > 0 ? companyBranchs.map((item, idx) => (
              <div key={idx} className="cd-branch-item-new">• {item.branchName}</div>
            )) : <div className="cd-no-data">暂无分支机构</div>}
          </div>
        </div>

        {/* <div className="cd-equity-sub-section">
          <div className="cd-equity-sub-title">子公司</div>
          <div className="cd-sub-list-new">
            <div className="cd-sub-item-new">• 杭州数智数据服务有限公司</div>
            <div className="cd-sub-item-new">• 杭州智云科技有限公司</div>
          </div>
        </div> */}
      </div>

      {/* 底部间距 */}
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 服务矩阵 Tab ===================== */
const serviceMatrixSources = [
  { key: '服务矩阵-省级层面', level: '省级' },
  { key: '服务矩阵-市级层面', level: '市级' },
  { key: '服务矩阵-区级层面', level: '区级' },
  { key: '服务矩阵-街道层面', level: '街道' }
];

const TAX_TREND_DATA = []; // Deprecated, using dynamic data inside component

const generateSmoothPath = () => ""; // Deprecated


function ServiceMatrixTab() {
  const { id } = useParams();
  const [serviceMatrixData, setServiceMatrixData] = useState([]);
  const [allServiceMatrixData, setAllServiceMatrixData] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [levelOpen, setLevelOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const levelMap = {
    '省级': '省级层面',
    '市级': '市级层面',
    '区级': '区级层面',
    '街道': '街道层面'
  };

  // 从 API 获取服务矩阵数据
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // 定义所有层级
    const levels = ['省级层面', '市级层面', '区级层面', '街道层面'];
    const levelMapReverse = {
      '省级层面': '省级',
      '市级层面': '市级',
      '区级层面': '区级',
      '街道层面': '街道'
    };

    // 为每个层级获取数据
    Promise.all(
      levels.map(level => {
        return serviceMatrixList({ enterpriseId: id, level })
          .then(res => {
            const levelData = res.data || [];
            // 处理数据格式，确保与组件兼容
            return levelData.map(deptItem => {
              return deptItem.data?.map(roomItem => {
                return roomItem.detailContent?.map(detail => {
                  let func = '', policy = '', service = '';
                  detail.content?.forEach(text => {
                    const funcMatch = text.match(/职能依据：(.*?)(?:\n|$)/);
                    const policyMatch = text.match(/政策依据：(.*?)(?:\n|$)/);
                    const serviceMatch = text.match(/服务内容：(.*?)(?:\n|$)/);

                    if (funcMatch) func = funcMatch[1].trim();
                    if (policyMatch) policy = policyMatch[1].trim();
                    if (serviceMatch) service = serviceMatch[1].trim();
                  });

                  return {
                    level: levelMapReverse[level],
                    dept: detail.title || '',
                    room: roomItem.oneContent || '',
                    orgDept: deptItem.name || '',
                    func,
                    policy,
                    service
                  };
                }) || [];
              }) || [];
            }).flat(2);
          })
          .catch(err => {
            console.error(`获取${level}服务矩阵数据失败:`, err);
            return [];
          });
      })
    )
      .then(results => {
        // 合并所有层级的数据
        const allData = results.flat();
        setAllServiceMatrixData(allData);
        setServiceMatrixData(allData);
        setLoading(false);
      })
      .catch(err => {
        console.error('获取服务矩阵数据失败:', err);
        setAllServiceMatrixData([]);
        setServiceMatrixData([]);
        setLoading(false);
      });
  }, [id]);

  const levels = ['省级', '市级', '区级', '街道'];

  // 根据当前选中的层级过滤部门数据
  const filteredDepts = Array.from(
    new Set(
      allServiceMatrixData
        .filter(item => !levelFilter || item.level === levelFilter)
        .map(item => item.orgDept)
        .filter(Boolean)
    )
  );

  const filtered = serviceMatrixData.filter(item => {
    if (levelFilter && item.level !== levelFilter) return false;
    if (deptFilter && item.orgDept !== deptFilter) return false;
    return true;
  });

  const handleLevelChange = (level) => {
    setLoading(true);
    setLevelFilter(level);
    setDeptFilter('');
    setLevelOpen(false);

    // 模拟加载延迟
    setTimeout(() => {
      setServiceMatrixData(allServiceMatrixData);
      setLoading(false);
    }, 300);
  };

  const handleClearLevel = () => {
    setLoading(true);
    setLevelFilter('');
    setDeptFilter('');
    setLevelOpen(false);

    // 模拟加载延迟
    setTimeout(() => {
      setServiceMatrixData(allServiceMatrixData);
      setLoading(false);
    }, 300);
  };

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
              <div className="cd-sm-dropdown-item" onClick={handleClearLevel}>全部</div>
              {levels.map(l => (
                <div
                  key={l}
                  className={`cd-sm-dropdown-item${levelFilter === l ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => handleLevelChange(l)}
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
              {filteredDepts.map(d => (
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
        {loading ? (
          <div className="cd-loading">
            <div className="cd-loading-spinner"></div>
            <p className="cd-loading-text">加载中...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div key={idx} className="cd-sm-card">
              <div className="cd-sm-card-header">
                <div className="cd-sm-level-badges">
                  <span className="cd-sm-level-badge">{item.level}</span>
                  <span className="cd-sm-dept-name">{item.orgDept}</span>
                </div>
                <div className="cd-sm-room-row">
                  <span className="cd-sm-room-label">科室</span>
                  <span className="cd-sm-room-name">{item.room} / {item.dept}</span>
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
          ))
        ) : (
          <div className="cd-no-data">暂无服务矩阵数据</div>
        )}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ===================== 企业服务 Tab ===================== */



function EnterpriseServiceTab() {
  const { id } = useParams();
  const [visitRecords, setVisitRecords] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从 API 获取走访记录
  useEffect(() => {
    if (!id) return;
    selectEnterpriseVisitsList({ enterpriseId: id, enterpriseName: '' })
      .then((res) => {
        setVisitRecords(res.data || []);
      })
      .catch((err) => {
        console.error('获取走访记录失败:', err);
        setVisitRecords([]);
      });
  }, [id]);

  // 从 API 获取企业诉求
  useEffect(() => {
    if (!id) return;
    getBusinessCommunityEnterpriseAppealPage({ enterpriseId: id })
      .then((res) => {
        setDemands(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取企业诉求失败:', err);
        setDemands([]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="cd-es-tab">
        <div className="cd-loading">
          <div className="cd-loading-spinner"></div>
          <p className="cd-loading-text">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-es-tab">
      {/* 走访记录 */}
      <div className="cd-section-card">
        <div className="cd-section-header">
          <img src={iconUsers} alt="走访记录" width={20} height={20} />
          <span className="cd-section-title">走访记录</span>
        </div>
        <div className="cd-visit-timeline">
          {visitRecords.length > 0 ? visitRecords.map((record, idx) => (
            <div key={idx} className="cd-visit-item">
              <div className="cd-visit-timeline-left">
                <div className="cd-visit-dot" />
                <div className="cd-visit-line" />
              </div>
              <div className="cd-visit-content">
                <div className="cd-visit-date">{record.gmtCreate || ''}</div>
                <div className="cd-visit-desc">{record.content || ''}</div>
                <div className="cd-visit-reporter">上报人：{record.visitName || ''}</div>
              </div>
            </div>
          )) : <div className="cd-no-data">暂无走访记录</div>}
        </div>
      </div>

      {/* 企业诉求 */}
      <div className="cd-section-card">
        <div className="cd-section-header">
          <img src={iconMessageSquare} alt="企业诉求" width={20} height={20} />
          <span className="cd-section-title">企业诉求</span>
        </div>
        <div className="cd-demand-list">
          {demands.length > 0 ? demands.map((item, idx) => (
            <div key={idx} className="cd-demand-item">
              <div className="cd-demand-header">
                <div className="cd-demand-id-row">
                  <span className="cd-demand-id">#{item.id || idx + 1}</span>
                  <span className="cd-demand-date">{item.recordDate || ''}</span>
                </div>
                <span className={`cd-demand-status${item.status === '已解决' || item.status === '已办结' ? ' cd-demand-status--done' : ' cd-demand-status--processing'}`}>
                  {item.status}
                </span>
              </div>
              <div className="cd-demand-text">{item.enterpriseProblem || ''}</div>
            </div>
          )) : <div className="cd-no-data">暂无企业诉求</div>}
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
  const [changes, setChanges] = useState([]);
  const [risks, setRisks] = useState([]);
  const [enterpriseName, setEnterpriseName] = useState('');
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef({});
  const subTabsWrapperRef = useRef(null);

  const getSubTabOffset = useCallback(() => (
    subTabsWrapperRef.current?.offsetHeight || 0
  ), []);

  // 从 API 获取企业基本信息，获取企业名称
  useEffect(() => {
    if (!companyId) return;
    getSslmEnterprisesInfoById({ enterpriseId: companyId })
      .then((res) => {
        const enterpriseInfo = res.data || {};
        setEnterpriseName(enterpriseInfo.enterpriseName || '');
      })
      .catch((err) => {
        console.error('获取企业基本信息失败:', err);
        setEnterpriseName('');
      });
  }, [companyId]);

  // 从 API 获取企业变更数据（需要企业名称）
  useEffect(() => {
    if (!companyId || !enterpriseName) return;
    getBusinessCommunityEnterpriseNewsPage({ enterpriseId: companyId, enterpriseName: enterpriseName })
      .then((res) => {
        setChanges(res.data || []);
      })
      .catch((err) => {
        console.error('获取企业变更数据失败:', err);
        setChanges([]);
      });
  }, [companyId, enterpriseName]);

  // 从 API 获取企业风险数据（需要企业名称）
  useEffect(() => {
    if (!companyId || !enterpriseName) return;
    getManageRiskEarlyWarningPage({ enterpriseId: companyId, enterpriseName: enterpriseName })
      .then((res) => {
        setRisks(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取企业风险数据失败:', err);
        setRisks([]);
        setLoading(false);
      });
  }, [companyId, enterpriseName]);

  // 监听滚动更新高亮Tab
  useEffect(() => {
    const rootEl = document.querySelector('.cd-body');
    if (!rootEl) return;
    const offset = getSubTabOffset();

    const observer = new IntersectionObserver((entries) => {
      // 遍历所有交叉项，找到正在相交的最大一个，或者简单点谁进入了就选谁
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setSubTab(entry.target.dataset.key);
        }
      });
    }, {
      root: rootEl,
      rootMargin: `-${offset + 8}px 0px -60% 0px`, // 在靠上的位置时触发高亮
      threshold: 0
    });

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [getSubTabOffset]);

  const scrollToTab = (key) => {
    setSubTab(key);
    const el = sectionRefs.current[key];
    const rootEl = document.querySelector('.cd-body');
    if (el && rootEl) {
      // 获取当前滚动的距离
      const rootRect = rootEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      // 减去 60px 左右的悬浮 Tab 高度偏移量
      const stickyOffset = getSubTabOffset();
      const offsetTop = elRect.top - rootRect.top + rootEl.scrollTop - stickyOffset - 10;
      rootEl.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const toggleChange = (idx) => setExpandedChanges(prev => ({ ...prev, [idx]: !prev[idx] }));
  const toggleRisk = (idx) => setExpandedRisks(prev => ({ ...prev, [idx]: !prev[idx] }));

  if (loading) {
    return (
      <div className="cd-dynamic-tab">
        <div className="cd-loading">
          <div className="cd-loading-spinner"></div>
          <p className="cd-loading-text">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-dynamic-tab">
      {/* 顶部吸顶 Tabs */}
      <div className="cd-sub-tabs-wrapper" ref={subTabsWrapperRef}>
        <div className="cd-sub-tabs-card">
          {[
            { key: 'changes', label: '企业变更' },
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
            {changes.length > 0 ? changes.map((item, idx) => (
              <div key={idx} className={`cd-change-item${expandedChanges[idx] ? ' cd-change-item--expanded' : ''}`}>
                <button className="cd-change-toggle" onClick={() => toggleChange(idx)}>
                  <div className="cd-change-toggle-left">
                    <span className="cd-change-date">{item.changeDate || ''}</span>
                    <span className="cd-change-badge">{item.changeProject || ''}</span>
                  </div>
                  <img src={expandedChanges[idx] ? iconChevronUp : iconChevronDown} alt="展开" width={16} height={16} className="cd-change-icon" />
                </button>

                {expandedChanges[idx] && (
                  <div className="cd-change-versus">
                    变更前： <span className="cd-change-versus-val">{item.changeAfter || ''}</span>
                    <span className="cd-change-versus-arrow">→</span>
                    变更后： <span className="cd-change-versus-val-after">{item.changeBefore || ''}</span>
                  </div>
                )}
              </div>
            )) : <div className="cd-no-data">暂无企业变更记录</div>}
          </div>
        </div>

        {/* 企业资讯 */}
        {/* <div className="cd-section-card cd-dynamic-card" ref={el => sectionRefs.current['news'] = el} data-key="news">
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
                  <img src={iconNavInfo} alt="" width={12} height={12} style={{ opacity: 0.5 }} />
                  <span>{item.source}</span>
                </div>
                <div className="cd-news-related">
                  <span>关联 {item.relatedCount} 家企业</span>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* 企业风险 */}
        <div className="cd-section-card cd-dynamic-card" ref={el => sectionRefs.current['risks'] = el} data-key="risks">
          <div className="cd-section-header">
            <img src={iconNavNegative} alt="企业风险" width={20} height={20} />
            <span className="cd-section-title">企业风险</span>
          </div>
          <div className="cd-risk-list">
            {risks.length > 0 ? risks.map((item, idx) => (
              <div key={idx} className={`cd-risk-item${expandedRisks[idx] ? ' cd-risk-item--expanded' : ''}`}>
                <button className="cd-risk-toggle" onClick={() => toggleRisk(idx)}>
                  <div className="cd-risk-toggle-left">
                    <span className="cd-risk-date-red">{item.dateTime || ''}</span>
                    <span className="cd-risk-badge-red">{item.content || ''}</span>
                    <span className="cd-risk-level-orange">{item.type || ''}</span>
                  </div>
                  <img src={expandedRisks[idx] ? iconChevronUp : iconChevronDown} alt="展开" width={16} height={16} className="cd-risk-icon" />
                </button>
                <div className="cd-risk-main-title">{item.riskSource || ''}</div>
                {expandedRisks[idx] && (
                  <div className="cd-risk-detail">{item.warningContent || ''}</div>
                )}
              </div>
            )) : <div className="cd-no-data">暂无企业风险记录</div>}
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* ===================== 全生命周期 Tab ===================== */
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
  const { id } = useParams();
  const [enterpriseName, setEnterpriseName] = useState('');
  const [lifecycleTypes, setLifecycleTypes] = useState({});
  const [lifecycleData, setLifecycleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // 从 API 获取企业基本信息，获取企业名称
  useEffect(() => {
    if (!id) return;
    getSslmEnterprisesInfoById({ enterpriseId: id })
      .then((res) => {
        const enterpriseInfo = res.data || {};
        setEnterpriseName(enterpriseInfo.enterpriseName || '');
      })
      .catch((err) => {
        console.error('获取企业基本信息失败:', err);
        setEnterpriseName('');
      });
  }, [id]);

  // 从 API 获取生命周期模块定义
  useEffect(() => {
    if (!id || !enterpriseName) return;
    enterpriseDynamicArchivesCount({ enterpriseId: id, enterpriseName: enterpriseName })
      .then((res) => {
        const typesData = res.data || [];
        const typeMap = {};
        typesData.forEach(item => {
          typeMap[item.value] = item.name || '';
        });
        setLifecycleTypes(typeMap);
      })
      .catch((err) => {
        console.error('获取生命周期模块定义失败:', err);
        setLifecycleTypes({});
      });
  }, [id, enterpriseName]);

  // 从 API 获取生命周期集合数据
  useEffect(() => {
    if (!id || !enterpriseName) return;
    enterpriseDynamicArchivesList({
      frontendId: 'ybkb0veslr0g',
      type: '0',
      enterpriseId: id,
      enterpriseName: enterpriseName
    })
      .then((res) => {
        const data = res.data || [];
        const formattedData = data.map(item => ({
          date: item.dataTime || item.date || '',
          type: lifecycleTypes[item.type] || String(item.type),
          title: item.typeName || item.title || '',
          desc: item.content || item.desc || ''
        }));
        setLifecycleData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取生命周期集合数据失败:', err);
        setLifecycleData([]);
        setLoading(false);
      });
  }, [id, enterpriseName, lifecycleTypes]);

  const types = Array.from(new Set(lifecycleData.map(item => item.type).filter(Boolean)));
  const filteredByType = typeFilter ? lifecycleData.filter(item => item.type === typeFilter) : lifecycleData;
  const dateRanges = Array.from(new Set(filteredByType.map(item => {
    const year = (item.date || '').substring(0, 4);
    return year ? `${year}年` : '';
  }).filter(Boolean))).sort((a, b) => parseInt(a) - parseInt(b));

  const filtered = lifecycleData.filter(item => {
    if (typeFilter && item.type !== typeFilter) return false;
    if (dateFilter && !item.date.startsWith(dateFilter.replace('年', ''))) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="cd-lc-tab">
        <div className="cd-loading">
          <div className="cd-loading-spinner"></div>
          <p className="cd-loading-text">加载中...</p>
        </div>
      </div>
    );
  }

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
              <div className="cd-sm-dropdown-item" onClick={() => { setTypeFilter(''); setDateFilter(''); setTypeOpen(false); }}>全部</div>
              {types.map(t => (
                <div
                  key={t}
                  className={`cd-sm-dropdown-item${typeFilter === t ? ' cd-sm-dropdown-item--active' : ''}`}
                  onClick={() => { setTypeFilter(t); setDateFilter(''); setTypeOpen(false); }}
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
          {filtered.length > 0 ? filtered.map((item, idx) => (
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
          )) : <div className="cd-no-data">暂无生命周期记录</div>}
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

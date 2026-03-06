import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import iconWaistBack from '../assets/icon-waist-back.svg';
import iconWaistSearch from '../assets/icon-waist-search.svg';
import iconWaistBuilding from '../assets/icon-waist-building.svg';
import iconTrendingUp from '../assets/icon-trending-up.svg';
import iconWaistCalendar from '../assets/icon-waist-calendar.svg';
import iconWaistLightbulb from '../assets/icon-waist-lightbulb.svg';
import iconWaistTrending from '../assets/icon-waist-trending.svg';
import iconWaistDollar from '../assets/icon-waist-dollar.svg';
import iconWaistUsers from '../assets/icon-waist-users.svg';
import iconWaistAward from '../assets/icon-waist-award.svg';
import './WaistEnterprise.css';

/* ===================== Mock 数据 ===================== */
const ENTERPRISE_TYPES = ['潜力企业', '成长企业', '新兴企业', '转型企业'];
const TIME_RANGES = ['近1个月', '近3个月', '近6个月', '近1年'];

const COMPANY_NAMES = [
  '杭州市惠民服务有限公司', '浙江智联数据科技有限公司', '杭州新材料研究有限公司',
  '浙江人工智能应用科技有限公司', '杭州绿色低碳技术有限公司', '浙江先进制造装备有限公司',
  '杭州软件信息服务有限公司', '浙江生物医药科技有限公司', '杭州文化创意产业有限公司',
  '浙江跨境电商贸易有限公司', '杭州高端装备制造有限公司', '浙江数字经济研究有限公司',
  '杭州供应链管理有限公司', '浙江新能源科技有限公司', '杭州医疗健康科技有限公司',
  '浙江智慧城市建设有限公司', '杭州金融科技创新有限公司', '浙江现代农业科技有限公司',
  '杭州工业互联网有限公司', '浙江数字营销科技有限公司',
];

const INDUSTRIES = [
  '制造业转型升级', '数字经济', '新材料研究', '人工智能应用', '低碳环保',
  '生物医药', '文化创意', '跨境贸易', '智慧城市', '金融科技',
];

const TYPE_LIST = ['潜力企业', '成长企业', '新兴企业', '转型企业'];

const REASONS = [
  '近3个月税收增长超50%，且税收金额达到30万元。技术研发投入占比达45%，具备快速成长为腰部企业潜力。',
  '近3个月营收增速显著，员工规模持续扩大，专利数量快速积累，具备较强的技术创新能力。',
  '近半年企业税收持续增长，研发投入稳步提升，产品竞争力增强，市场份额显著扩大。',
  '企业近期融资成功，资本实力增强，扩大生产规模，税收贡献明显提升，成长潜力大。',
];

const GROWTH_RATES = ['+52.3%', '+38.7%', '+67.1%', '+29.4%', '+81.5%', '+44.2%', '+55.8%', '+33.6%'];
const GROWTH_LABELS = ['近3个月税收增长', '近3个月营收增长', '近6个月税收增长', '近1个月营收增长'];

const TAX_VALUES = ['38.31万元', '62.50万元', '131.31万元', '27.80万元', '189.60万元', '55.40万元'];
const RD_VALUES = ['30%', '45%', '28%', '52%', '35%', '41%'];
const EMPLOYEE_VALUES = ['38%', '3%', '15%', '22%', '47%', '8%'];
const PATENT_VALUES = ['12 项', '34 项', '8 项', '21 项', '56 项', '17 项'];

const MINE_DATES = ['2026-03-04', '2026-03-03', '2026-03-02', '2026-03-01', '2026-02-28', '2026-02-27'];

/* 时间筛选与增长标签的映射关系 */
const TIME_FILTER_PATTERN_MAP = {
  '近1个月': '1个月',
  '近3个月': '3个月',
  '近6个月': '6个月',
  '近1年': '1年',
};

function generateEnterprises(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: COMPANY_NAMES[i % COMPANY_NAMES.length],
    industry: INDUSTRIES[i % INDUSTRIES.length],
    type: TYPE_LIST[i % TYPE_LIST.length],
    growthRate: GROWTH_RATES[i % GROWTH_RATES.length],
    growthLabel: GROWTH_LABELS[i % GROWTH_LABELS.length],
    mineDate: MINE_DATES[i % MINE_DATES.length],
    reason: REASONS[i % REASONS.length],
    taxValue: TAX_VALUES[i % TAX_VALUES.length],
    rdValue: RD_VALUES[i % RD_VALUES.length],
    employeeValue: EMPLOYEE_VALUES[i % EMPLOYEE_VALUES.length],
    patentValue: PATENT_VALUES[i % PATENT_VALUES.length],
  }));
}

const ALL_ENTERPRISES = generateEnterprises(20);
const PAGE_SIZE = 5;

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button className={`we-filter-btn${active ? ' we-filter-btn--active' : ''}`} onClick={onClick}>
      <span>{label}{count > 0 ? `(${count})` : ''}</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke={active ? '#0052D9' : 'rgba(0,0,0,0.9)'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ===================== 企业卡片 ===================== */
function EnterpriseCard({ enterprise }) {
  const { name, industry, type, growthRate, growthLabel, mineDate, reason, taxValue, rdValue, employeeValue, patentValue } = enterprise;

  return (
    <div className="we-card">
      {/* 顶部白色区域 */}
      <div className="we-card-top">
        <div className="we-card-top-header">
          <div>
            {/* 公司名称行 */}
            <div className="we-company-row">
              <img src={iconWaistBuilding} alt="企业" className="we-building-icon" />
              <span className="we-company-name">{name}</span>
            </div>
            {/* 标签行 */}
            <div className="we-tags-row">
              <span className="we-type-tag">{type}</span>
              <span className="we-industry-tag">{industry}</span>
            </div>
          </div>
          {/* 增长率行 */}
          <div className="we-growth-row">
            <div className="we-growth-left">
              <div className="we-growth-rate-row">
                <img src={iconTrendingUp} alt="增长" className="we-trending-icon" />
                <span className="we-growth-rate">{growthRate}</span>
              </div>
              <span className="we-growth-label">{growthLabel}</span>
            </div>
          </div>
        </div>
        {/* 挖掘日期行 */}
        <div className="we-date-row">
          <img src={iconWaistCalendar} alt="日期" className="we-calendar-icon" />
          <span className="we-date-text">挖掘日期：{mineDate}</span>
        </div>
      </div>

      {/* 底部渐变区域 */}
      <div className="we-card-bottom">
        {/* 挖掘原因 */}
        <div className="we-reason-row">
          <img src={iconWaistLightbulb} alt="挖掘原因" className="we-lightbulb-icon" />
          <div className="we-reason-content">
            <span className="we-reason-title">挖掘原因</span>
            <p className="we-reason-text">{reason}</p>
          </div>
        </div>
        {/* 指标 2x2 网格 */}
        <div className="we-metrics-grid">
          <div className="we-metric-cell">
            <div className="we-metric-header">
              <img src={iconWaistTrending} alt="税收金额" className="we-metric-icon" />
              <span className="we-metric-label">税收金额</span>
            </div>
            <span className="we-metric-value we-metric-value--green">{taxValue}</span>
          </div>
          <div className="we-metric-cell">
            <div className="we-metric-header">
              <img src={iconWaistDollar} alt="研发投入" className="we-metric-icon" />
              <span className="we-metric-label">研发投入</span>
            </div>
            <span className="we-metric-value we-metric-value--blue">{rdValue}</span>
          </div>
          <div className="we-metric-cell">
            <div className="we-metric-header">
              <img src={iconWaistUsers} alt="员工增长" className="we-metric-icon" />
              <span className="we-metric-label">员工增长</span>
            </div>
            <span className="we-metric-value we-metric-value--orange">{employeeValue}</span>
          </div>
          <div className="we-metric-cell">
            <div className="we-metric-header">
              <img src={iconWaistAward} alt="专利/软著数量" className="we-metric-icon" />
              <span className="we-metric-label">专利/软著数量</span>
            </div>
            <span className="we-metric-value we-metric-value--purple">{patentValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function WaistEnterprise() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  const [typeFilter, setTypeFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null); // 'type' | 'time' | null

  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 搜索防抖
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  // 计算过滤后的全部数据
  const getFiltered = useCallback(() => {
    const searchLower = debouncedSearch.toLowerCase();
    return ALL_ENTERPRISES.filter(e => {
      const matchSearch = !debouncedSearch ||
        e.name.toLowerCase().includes(searchLower) ||
        e.industry.toLowerCase().includes(searchLower);
      const matchType = typeFilter.length === 0 || typeFilter.includes(e.type);
      const matchTime = timeFilter.length === 0 || timeFilter.some(t => {
        const pattern = TIME_FILTER_PATTERN_MAP[t];
        return pattern ? e.growthLabel.includes(pattern) : false;
      });
      return matchSearch && matchType && matchTime;
    });
  }, [debouncedSearch, typeFilter, timeFilter]);

  // 初始化 / 筛选变化时重置列表
  useEffect(() => {
    const filtered = getFiltered();
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(filtered.length > PAGE_SIZE);
  }, [getFiltered]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const filtered = getFiltered();
    setDisplayedItems(prev => {
      const nextPage = filtered.slice(prev.length, prev.length + PAGE_SIZE);
      if (nextPage.length > 0) {
        const newItems = [...prev, ...nextPage];
        setHasMore(newItems.length < filtered.length);
        return newItems;
      }
      setHasMore(false);
      return prev;
    });
    setLoading(false);
  }, [loading, hasMore, getFiltered]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    const filtered = getFiltered();
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(filtered.length > PAGE_SIZE);
    setRefreshing(false);
  }, [getFiltered]);

  return (
    <div className="we-container">
      {/* ===== 头部 ===== */}
      <div className="we-header">
        <div className="we-header-top">
          <button className="we-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <img src={iconWaistBack} alt="返回" width={36} height={32} />
          </button>
          <span className="we-header-title">腰部企业挖掘</span>
        </div>
        <div className="we-search-row">
          <div className="we-search-bar">
            <img src={iconWaistSearch} alt="搜索" className="we-search-icon" />
            <input
              className="we-search-input"
              placeholder="搜索企业信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== 筛选区域 ===== */}
      <div className="we-filter-area">
        <div className="we-filter-row">
          <FilterButton
            label="类型"
            active={activeFilter === 'type' || typeFilter.length > 0}
            count={typeFilter.length}
            onClick={() => setActiveFilter(activeFilter === 'type' ? null : 'type')}
          />
          <FilterButton
            label="时间"
            active={activeFilter === 'time' || timeFilter.length > 0}
            count={timeFilter.length}
            onClick={() => setActiveFilter(activeFilter === 'time' ? null : 'time')}
          />
        </div>
      </div>

      {/* ===== 企业列表 ===== */}
      <InfiniteList
        items={displayedItems}
        renderItem={(item) => <EnterpriseCard enterprise={item} />}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        hasMore={hasMore}
        loading={loading}
        refreshing={refreshing}
        endText="已显示全部腰部企业"
      />

      {/* ===== 筛选底部弹框 ===== */}
      <FilterSheet
        title="类型"
        options={ENTERPRISE_TYPES}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'type'}
        multiple
      />
      <FilterSheet
        title="时间"
        options={TIME_RANGES}
        value={timeFilter}
        onChange={setTimeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'time'}
        multiple
      />
    </div>
  );
}

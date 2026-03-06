import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import iconBack from '../assets/icon-back.svg';
import iconSearchInput from '../assets/icon-search-input.svg';
import iconCompanySe from '../assets/icon-company-se.svg';
import './FollowEnterprise.css';

/* ===================== Mock 数据 ===================== */
const STREETS = ['小河街道', '拱宸桥街道', '湖墅街道', '米市巷街道', '大关街道', '和睦街道', '康桥街道', '上塘街道', '祥符街道', '石桥街道'];
const CAPITAL_RANGES = ['500万以下', '500万-1000万', '1000万-5000万', '5000万-1亿', '1亿以上'];
const TAGS = ['高新技术企业', '国家重点企业', '瞪羚企业', '独角兽企业', '规模以上', '上市企业', '专精特新小巨人', '科技型中小企业'];

const BUSINESS_STATUSES = ['存续', '注销', '存续', '存续', '存续', '迁出', '存续', '存续', '注销', '存续'];
const COMPANY_NAMES = [
  '杭州新能源科技有限公司', '浙江数字科技集团股份有限公司', '杭州智联互联网有限公司',
  '浙江绿色低碳科技有限公司', '杭州拱墅先进制造有限公司', '浙江出海跨境贸易有限公司',
  '杭州元宇宙技术有限公司', '浙江数商平台运营有限公司', '杭州高端装备制造有限公司',
  '浙江生物医药科技有限公司', '杭州软件信息服务有限公司', '浙江现代商贸有限公司',
  '杭州新材料研究有限公司', '浙江人工智能科技有限公司', '杭州文化创意有限公司',
  '浙江供应链管理有限公司', '杭州金融科技有限公司', '浙江新零售运营有限公司',
  '杭州医疗健康科技有限公司', '浙江智慧农业有限公司',
];
const LEGAL_REPS = ['赵敏', '李伟', '王芳', '张磊', '陈静', '刘阳', '黄志', '吴华', '周洁', '徐明'];
const CAPITALS_RAW = ['2000万元', '5000万元', '1亿元', '3000万元', '8000万元', '500万元', '1.5亿元', '4000万元', '6000万元', '2.5亿元'];
const ADDRESSES = [
  '浙江省杭州市拱墅区城市发展大厦1幢603室(自主申报)',
  '浙江省杭州市拱墅区丰潭路508号科技园B幢3楼',
  '浙江省杭州市拱墅区上塘路1288号创业大厦8楼',
  '浙江省杭州市拱墅区湖墅南路98号拱宸商业综合体5楼',
  '浙江省杭州市拱墅区莫干山路199号东方文化园区2幢201室',
];
const TAG_LISTS = [
  ['高新技术企业', '专精特新小巨人'],
  ['国家重点企业', '瞪羚企业'],
  ['高新技术企业', '规模以上'],
  ['科技型中小企业'],
  ['独角兽企业', '上市企业'],
  ['高新技术企业'],
  ['专精特新小巨人', '规模以上'],
  ['瞪羚企业'],
];

// 将资本字符串转为万元数字
function parseCapitalToWan(capitalStr) {
  if (!capitalStr) return 0;
  if (capitalStr.includes('亿')) {
    const num = parseFloat(capitalStr.replace('亿元', '').replace('亿', ''));
    return num * 10000;
  }
  return parseFloat(capitalStr.replace('万元', '').replace('万', ''));
}

// 判断资本是否属于某个区间
function capitalInRange(capitalStr, range) {
  const wan = parseCapitalToWan(capitalStr);
  switch (range) {
    case '500万以下': return wan < 500;
    case '500万-1000万': return wan >= 500 && wan < 1000;
    case '1000万-5000万': return wan >= 1000 && wan < 5000;
    case '5000万-1亿': return wan >= 5000 && wan < 10000;
    case '1亿以上': return wan >= 10000;
    default: return false;
  }
}

function generateFollowedEnterprises(count = 50) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: COMPANY_NAMES[i % COMPANY_NAMES.length],
    creditCode: `9133010${String(i + 1).padStart(2, '0')}MA2CCXKC${String(i + 10).padStart(2, '0')}`,
    legalRep: LEGAL_REPS[i % LEGAL_REPS.length],
    capital: CAPITALS_RAW[i % CAPITALS_RAW.length],
    regDate: `202${Math.floor(i / 10) % 3 + 4}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: BUSINESS_STATUSES[i % BUSINESS_STATUSES.length],
    address: ADDRESSES[i % ADDRESSES.length],
    tags: TAG_LISTS[i % TAG_LISTS.length],
    street: STREETS[i % STREETS.length],
    isFirst: i === 0,
  }));
}

const ALL_FOLLOWED = generateFollowedEnterprises(50);
const PAGE_SIZE = 10;

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button className={`fe-filter-btn${active ? ' fe-filter-btn--active' : ''}`} onClick={onClick}>
      <span>{label}{count > 0 ? `(${count})` : ''}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke={active ? '#0052D9' : 'rgba(0,0,0,0.6)'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ===================== 企业卡片 ===================== */
function EnterpriseCard({ enterprise }) {
  const { name, creditCode, legalRep, capital, regDate, status, address, tags, isFirst } = enterprise;
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;
  const isActive = status === '存续';

  return (
    <div className={`fe-card${isFirst ? ' fe-card--first' : ''}`}>
      {/* 顶部：图标 + 公司名 + 标签 + 查看详情 */}
      <div className="fe-card-top">
        <div className="fe-card-left">
          <img src={iconCompanySe} alt="企业" className="fe-company-icon" />
          <div className="fe-company-info">
            <div className="fe-company-name">{name}</div>
            <div className="fe-tags">
              {visibleTags.map(tag => (
                <span key={tag} className="fe-tag">{tag}</span>
              ))}
              {extraCount > 0 && (
                <span className="fe-tag fe-tag--extra">+{extraCount}</span>
              )}
            </div>
          </div>
        </div>
        <span className="fe-view-detail">查看详情 →</span>
      </div>

      {/* 详情信息 */}
      <div className="fe-card-detail">
        {/* 统一社会信用代码 */}
        <div className="fe-info-row">
          <div className="fe-info-item fe-info-item--wide">
            <span className="fe-info-label">统一社会信用代码：</span>
            <span className="fe-info-value">{creditCode}</span>
          </div>
        </div>
        {/* 法定代表人 + 注册资本 */}
        <div className="fe-info-row">
          <div className="fe-info-item">
            <span className="fe-info-label">法定代表人:</span>
            <span className="fe-info-value">{legalRep}</span>
          </div>
          <div className="fe-info-item">
            <span className="fe-info-label">注册资本:</span>
            <span className="fe-info-value">{capital}</span>
          </div>
        </div>
        {/* 注册日期 + 经营状态 */}
        <div className="fe-info-row">
          <div className="fe-info-item">
            <span className="fe-info-label">注册日期:</span>
            <span className="fe-info-value">{regDate}</span>
          </div>
          <div className="fe-info-item">
            <span className="fe-info-label">经营状态：</span>
            <span className={`fe-info-value fe-status${isActive ? ' fe-status--active' : ' fe-status--closed'}`}>{status}</span>
          </div>
        </div>
        {/* 企业地址 */}
        <div className="fe-info-row">
          <div className="fe-info-item fe-info-item--wide">
            <span className="fe-info-label">企业地址：</span>
            <span className="fe-info-value fe-address">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function FollowEnterprise() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // 筛选状态
  const [streetFilter, setStreetFilter] = useState([]);
  const [capitalFilter, setCapitalFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  // 当前展开的筛选器
  const [activeFilter, setActiveFilter] = useState(null); // 'street' | 'capital' | 'tag' | null

  // 列表数据
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);

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
    return ALL_FOLLOWED.filter(e => {
      const matchSearch = !debouncedSearch ||
        e.name.toLowerCase().includes(searchLower) ||
        e.creditCode.toLowerCase().includes(searchLower);
      const matchStreet = streetFilter.length === 0 || streetFilter.includes(e.street);
      const matchCapital = capitalFilter.length === 0 || capitalFilter.some(r => capitalInRange(e.capital, r));
      const matchTag = tagFilter.length === 0 || tagFilter.some(t => e.tags.includes(t));
      return matchSearch && matchStreet && matchCapital && matchTag;
    });
  }, [debouncedSearch, streetFilter, capitalFilter, tagFilter]);

  // 初始化 / 筛选变化时重置列表
  useEffect(() => {
    const filtered = getFiltered();
    setFilteredTotal(filtered.length);
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page.map((item, i) => ({ ...item, isFirst: i === 0 })));
    setHasMore(filtered.length > PAGE_SIZE);
  }, [getFiltered]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const filtered = getFiltered();
    const nextPage = filtered.slice(displayedItems.length, displayedItems.length + PAGE_SIZE);
    if (nextPage.length > 0) {
      setDisplayedItems(prev => [
        ...prev,
        ...nextPage.map((item, i) => ({ ...item, isFirst: prev.length === 0 && i === 0 })),
      ]);
    }
    setHasMore(displayedItems.length + nextPage.length < filtered.length);
    setLoading(false);
  }, [loading, hasMore, displayedItems.length, getFiltered]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    const filtered = getFiltered();
    setFilteredTotal(filtered.length);
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page.map((item, i) => ({ ...item, isFirst: i === 0 })));
    setHasMore(filtered.length > PAGE_SIZE);
    setRefreshing(false);
  }, [getFiltered]);

  return (
    <div className="fe-container">
      {/* ===== 头部 ===== */}
      <div className="fe-header">
        <div className="fe-header-top">
          <button className="fe-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="fe-header-title">关注企业</span>
        </div>
        {/* 搜索行 */}
        <div className="fe-search-row">
          <div className="fe-search-bar">
            <img src={iconSearchInput} alt="搜索" className="fe-search-icon" />
            <input
              className="fe-search-input"
              placeholder="搜索企业名称/统一社会信用代码"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== 筛选区域 ===== */}
      <div className="fe-filter-area">
        <div className="fe-filter-row">
          <FilterButton
            label="所属街道"
            active={activeFilter === 'street' || streetFilter.length > 0}
            count={streetFilter.length}
            onClick={() => setActiveFilter(activeFilter === 'street' ? null : 'street')}
          />
          <FilterButton
            label="注册资本"
            active={activeFilter === 'capital' || capitalFilter.length > 0}
            count={capitalFilter.length}
            onClick={() => setActiveFilter(activeFilter === 'capital' ? null : 'capital')}
          />
          <FilterButton
            label="重点标签"
            active={activeFilter === 'tag' || tagFilter.length > 0}
            count={tagFilter.length}
            onClick={() => setActiveFilter(activeFilter === 'tag' ? null : 'tag')}
          />
        </div>
        <div className="fe-filter-summary">
          <span className="fe-filter-label">筛选企业：</span>
          <span className="fe-filter-count">{filteredTotal.toLocaleString()}家</span>
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
        endText="已显示全部关注企业"
      />

      {/* ===== 筛选底部弹框 ===== */}
      <FilterSheet
        title="所属街道"
        options={STREETS}
        value={streetFilter}
        onChange={setStreetFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'street'}
        multiple
      />
      <FilterSheet
        title="注册资本"
        options={CAPITAL_RANGES}
        value={capitalFilter}
        onChange={setCapitalFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'capital'}
        multiple
      />
      <FilterSheet
        title="重点标签"
        options={TAGS}
        value={tagFilter}
        onChange={setTagFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'tag'}
        multiple
      />
    </div>
  );
}

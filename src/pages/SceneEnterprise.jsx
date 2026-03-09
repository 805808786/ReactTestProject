import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import DateSelection from './components/dataSelection/index';
import iconBack from '../assets/icon-back.svg';
import iconSearchInput from '../assets/icon-search-input.svg';
import iconSceneDynamic from '../assets/icon-scene-dynamic.svg';
import iconCompany from '../assets/icon-company-se.svg';
import iconSceneCalendar from '../assets/icon-scene-calendar.svg';
import iconStatInfo from '../assets/icon-stat-info.svg';
import './SceneEnterprise.css';

/* ===================== Mock 数据 ===================== */
const STREETS = ['小河街道', '拱宸桥街道', '湖墅街道', '米市巷街道', '大关街道', '和睦街道', '康桥街道', '上塘街道', '祥符街道', '石桥街道'];
const CAPITALS = ['100万以下', '100-500万', '500-1000万', '1000-5000万', '5000万以上'];
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
const CAPITAL_VALUES = ['2000万元', '5000万元', '1亿元', '3000万元', '8000万元', '500万元', '1.5亿元', '4000万元', '6000万元', '2.5亿元'];
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
const CAPITAL_RANGE_MAP = ['100万以下', '100-500万', '500-1000万', '1000-5000万', '5000万以上'];

function generateEnterprises(count = 50) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: COMPANY_NAMES[i % COMPANY_NAMES.length],
    creditCode: `9133010${String(i + 1).padStart(2, '0')}MA2CCXKC${String(i + 10).padStart(2, '0')}`,
    legalRep: LEGAL_REPS[i % LEGAL_REPS.length],
    capital: CAPITAL_VALUES[i % CAPITAL_VALUES.length],
    capitalRange: CAPITAL_RANGE_MAP[i % CAPITAL_RANGE_MAP.length],
    regDate: `202${Math.floor(i / 10) % 3 + 4}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: BUSINESS_STATUSES[i % BUSINESS_STATUSES.length],
    address: ADDRESSES[i % ADDRESSES.length],
    tags: TAG_LISTS[i % TAG_LISTS.length],
    street: STREETS[i % STREETS.length],
  }));
}

const ALL_ENTERPRISES = generateEnterprises(50);
const PAGE_SIZE = 10;

const STATS = {
  total: 2042,
  top: 50,
  middle: 388,
  potential: 957,
  other: 647,
};

const STATS_CRITERIA = {
  top: {
    title: '核心企业（分类标准）',
    content: `已入选市级“296X"先进制造业集群或拱墅区发改局、区科技经信局梳理的规模以上工业和服务业企业名单，具备行业引领与示范效应的企业。`,
  },
  middle: {
    title: '重点企业（分类标准）',
    content: `符合市级“115X"先进制造业集群发展方向，且属于拱墅区重点企业，但尚未进入市级“296X"集群、拱墅区发改局、区科技经信局梳理出的规模以上工业和服务业企业名单。`,
  },
  potential: {
    title: '潜力企业（分类标准）',
    content: `符合拱墅区“115X"先进制造业集群发展方向，具备较强成长性与发展潜力，但暂未取得相关荣誉资质的企业。`,
  },
  other:  {
    title: '后备企业（分类标准）',
    content: `符合拱墅区“115X"先进制造业集群发展方向，但当前活跃度较低的企业。`,
  },
};

/* ===================== 工具函数 ===================== */
function formatDateDisplay(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button className={`se-filter-btn${active ? ' se-filter-btn--active' : ''}`} onClick={onClick}>
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
    <div className={`se-card${isFirst ? ' se-card--first' : ''}`}>
      {/* 顶部：图标 + 公司名 + 标签 + 查看详情 */}
      <div className="se-card-top">
        <div className="se-card-left">
          <img src={iconCompany} alt="企业" className="se-company-icon" />
          <div className="se-company-info">
            <div className="se-company-name">{name}</div>
            <div className="se-tags">
              {visibleTags.map(tag => (
                <span key={tag} className="se-tag">{tag}</span>
              ))}
              {extraCount > 0 && (
                <span className="se-tag se-tag--extra">+{extraCount}</span>
              )}
            </div>
          </div>
        </div>
        <span className="se-view-detail">查看详情 →</span>
      </div>

      {/* 详情信息 */}
      <div className="se-card-detail">
        {/* 统一社会信用代码 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">统一社会信用代码：</span>
            <span className="se-info-value">{creditCode}</span>
          </div>
        </div>
        {/* 法定代表人 + 注册资本 */}
        <div className="se-info-row">
          <div className="se-info-item">
            <span className="se-info-label">法定代表人:</span>
            <span className="se-info-value">{legalRep}</span>
          </div>
          <div className="se-info-item">
            <span className="se-info-label">注册资本:</span>
            <span className="se-info-value">{capital}</span>
          </div>
        </div>
        {/* 注册日期 + 经营状态 */}
        <div className="se-info-row">
          <div className="se-info-item">
            <span className="se-info-label">注册日期:</span>
            <span className="se-info-value">{regDate}</span>
          </div>
          <div className="se-info-item">
            <span className="se-info-label">经营状态：</span>
            <span className={`se-info-value se-status${isActive ? ' se-status--active' : ' se-status--closed'}`}>{status}</span>
          </div>
        </div>
        {/* 企业地址 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">企业地址：</span>
            <span className="se-info-value se-address">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function SceneEnterprise() {
  const navigate = useNavigate();
  const location = useLocation();
  const sceneName = location.state?.sceneName || '数商企业';

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // 统计标准弹框
  const [criteriaPopup, setCriteriaPopup] = useState(null);

  // 日历弹框
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);

  const handleCalendarOpen = useCallback(() => {
    setPendingDate(confirmedDate);
    setCalendarOpen(true);
  }, [confirmedDate]);

  const handleCalendarClose = useCallback(() => setCalendarOpen(false), []);

  const handleCalendarConfirm = useCallback(() => {
    setConfirmedDate(pendingDate);
    setCalendarOpen(false);
  }, [pendingDate]);

  // 筛选状态
  const [streetFilter, setStreetFilter] = useState([]);
  const [capitalFilter, setCapitalFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  // 当前展开的筛选器
  const [activeFilter, setActiveFilter] = useState(null);

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
    return ALL_ENTERPRISES.filter(e => {
      const matchSearch = !debouncedSearch ||
        e.name.includes(debouncedSearch) ||
        e.creditCode.includes(debouncedSearch);
      const matchStreet = streetFilter.length === 0 || streetFilter.includes(e.street);
      const matchCapital = capitalFilter.length === 0 || capitalFilter.includes(e.capitalRange);
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
    <div className="se-container">
      {/* ===== 头部 ===== */}
      <div className="se-header">
        <div className="se-header-top">
          <button className="se-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="se-header-title">{sceneName}</span>
        </div>

        {/* 搜索行 */}
        <div className="se-search-row">
          <div className="se-search-bar">
            <img src={iconSearchInput} alt="搜索" className="se-search-icon" />
            <input
              className="se-search-input"
              placeholder="搜索企业名称/统一社会信用代码"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <button className="se-calendar-btn" onClick={handleCalendarOpen}>
              企业日历
          </button>
        </div>

        {/* 统计数据 */}
        <div className="se-stats-area">
          <div className="se-stat-card se-stat-card--primary">
            <div className="se-stat-label">全部</div>
            <div className="se-stat-value">{STATS.total.toLocaleString()}</div>
          </div>
          <div className="se-stat-card">
            <div className="se-stat-label se-stat-label--with-icon">
              核心企业
              <button className="se-stat-info-btn" onClick={() => setCriteriaPopup('top')} aria-label="核心企业统计标准">
                <img src={iconStatInfo} alt="" width={10} height={10} />
              </button>
            </div>
            <div className="se-stat-value">{STATS.top}</div>
          </div>
          <div className="se-stat-card">
            <div className="se-stat-label se-stat-label--with-icon">
              重点企业
              <button className="se-stat-info-btn" onClick={() => setCriteriaPopup('middle')} aria-label="重点企业统计标准">
                <img src={iconStatInfo} alt="" width={10} height={10} />
              </button>
            </div>
            <div className="se-stat-value">{STATS.middle}</div>
          </div>
          <div className="se-stat-card">
            <div className="se-stat-label se-stat-label--with-icon">
              潜力企业
              <button className="se-stat-info-btn" onClick={() => setCriteriaPopup('potential')} aria-label="潜力企业统计标准">
                <img src={iconStatInfo} alt="" width={10} height={10} />
              </button>
            </div>
            <div className="se-stat-value">{STATS.potential}</div>
          </div>
          <div className="se-stat-card">
            <div className="se-stat-label se-stat-label--with-icon">
              后备企业
              <button className="se-stat-info-btn" onClick={() => setCriteriaPopup('other')} aria-label="后备企业统计标准">
                <img src={iconStatInfo} alt="" width={10} height={10} />
              </button>
            </div>
            <div className="se-stat-value">{STATS.potential}</div>
          </div>
        </div>
      </div>

      {/* ===== 主体区域 ===== */}
      <div className="se-body">
        {/* 场景动态 + 筛选区域 */}
        <div className="se-dynamic-filter-area">
          {/* 场景动态横幅 */}
          <div className="se-scene-dynamic" onClick={() => navigate('/scene-enterprise-dynamic')} style={{ cursor: 'pointer' }}>
            <div className="se-dynamic-left">
              <img src={iconSceneDynamic} alt="场景动态" className="se-dynamic-icon" />
              <span className="se-dynamic-title">场景动态</span>
            </div>
            <span className="se-dynamic-desc">您有5条新的场景动态，请查阅！</span>
            <span className="se-dynamic-arrow">→</span>
          </div>

          {/* 筛选器行 */}
          <div className="se-filter-row">
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

          {/* 筛选汇总 */}
          <div className="se-filter-summary">
            <span className="se-filter-label">筛选企业：</span>
            <span className="se-filter-count">{filteredTotal.toLocaleString()}家</span>
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
          endText="已显示全部企业"
        />
      </div>

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
        options={CAPITALS}
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

      {/* ===== 日历底部弹框 ===== */}
      {calendarOpen && (
        <div className="se-cal-overlay" onClick={handleCalendarClose}>
          <div className="se-cal-sheet" onClick={e => e.stopPropagation()}>
            {/* 把手 */}
            <div className="se-cal-handle" />

            {/* 日历组件 */}
            <DateSelection
              dateDisabledType="afterTodayAndToday"
              onSelect={date => setPendingDate(date)}
              defaultValue={pendingDate}
            />

            {/* 已选日期信息 */}
            {pendingDate && (
              <div className="se-cal-info">
                <div className="se-cal-info-date">{formatDateDisplay(pendingDate)}</div>

                {/* 企业总数卡片 */}
                <div className="se-cal-card se-cal-card--blue">
                  <div className="se-cal-card-label">企业总数</div>
                  <div className="se-cal-card-row">
                    <span className="se-cal-card-value">18,767家</span>
                    <span className="se-cal-card-delta se-cal-card-delta--neg">-13家</span>
                  </div>
                </div>

                {/* 变化原因卡片 */}
                <div className="se-cal-card se-cal-card--orange">
                  <div className="se-cal-card-label">变化原因</div>
                  <div className="se-cal-card-list">
                    <div className="se-cal-card-list-item">
                      <span className="se-cal-card-list-idx">1.</span>
                      <span className="se-cal-card-list-txt">工商信息新注册/新注销企业变化</span>
                    </div>
                    <div className="se-cal-card-list-item">
                      <span className="se-cal-card-list-idx">2.</span>
                      <span className="se-cal-card-list-txt">商务社区走访新入驻企业</span>
                    </div>
                  </div>
                </div>

                {/* 标签变化卡片 */}
                <div className="se-cal-card se-cal-card--purple">
                  <div className="se-cal-card-label">标签变化</div>
                  <div className="se-cal-card-tag-row">
                    <span className="se-cal-badge se-cal-badge--blue">新增</span>
                    <div className="se-cal-tag-info">
                      <span className="se-cal-tag-title">跨境供应链服务</span>
                      <span className="se-cal-tag-dot"> · </span>
                      <span className="se-cal-tag-desc">新增为出海企业 · 跨境物流</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 底部按钮 */}
            <div className="se-cal-footer">
              <button className="se-cal-btn se-cal-btn--cancel" onClick={handleCalendarClose}>取消</button>
              <button className="se-cal-btn se-cal-btn--confirm" onClick={handleCalendarConfirm}>确认</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 统计标准弹框 ===== */}
      {criteriaPopup && (
        <div className="se-criteria-overlay" onClick={() => setCriteriaPopup(null)}>
          <div className="se-criteria-dialog" onClick={e => e.stopPropagation()}>
            <div className="se-criteria-content">
              <div className="se-criteria-title">{STATS_CRITERIA[criteriaPopup].title}</div>
              <div className="se-criteria-text">{STATS_CRITERIA[criteriaPopup].content}</div>
            </div>
            <div className="se-criteria-footer">
              <button className="se-criteria-close-btn" onClick={() => setCriteriaPopup(null)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

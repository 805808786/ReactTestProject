import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import iconVisitBack from '../assets/icon-visit-back.svg';
import iconVisitSearch from '../assets/icon-visit-search.svg';
import iconCaretDown from '../assets/icon-caret-down-small.svg';
import iconEdLink from '../assets/icon-ed-link.svg';
import './EnterpriseDynamic.css';

/* ===================== Mock 数据 ===================== */
const DEPARTMENTS = ['经济发展局', '商务局', '工信局', '市场监管局', '科技局'];
const DATE_RANGES = ['今日', '近一周', '近一月', '近三月', '近半年'];

const MOCK_VISITS = [
  {
    id: 7,
    month: '2026年3月',
    date: '2026年3月12号',
    title: '杭州轴承集团有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655957901&idx=1&sn=aa7399d607af20bbc5fa79adc35d5a46' },
      { name: '石桥发布', url: 'https://mp.weixin.qq.com/s?__biz=MzkxMDM3ODA2Mg==&mid=2247575059&idx=1&sn=ff9183980607d2b768f23688a67e13fa' }
    ],
    dept: '',
  },
  {
    id: 6,
    month: '2026年3月',
    date: '2026年3月12号',
    title: '杭叉集团股份有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655957901&idx=1&sn=aa7399d607af20bbc5fa79adc35d5a46' },
      { name: '石桥发布', url: 'https://mp.weixin.qq.com/s?__biz=MzkxMDM3ODA2Mg==&mid=2247575059&idx=1&sn=ff9183980607d2b768f23688a67e13fa' }
    ],
    dept: '',
  },
  {
    id: 5,
    month: '2026年2月',
    date: '2026年2月24号',
    title: '杭州中美华东制药有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655955672&idx=1&sn=53962bcf105c25d2f3f896f5f0668d3e' }
    ],
    dept: '',
  },
  {
    id: 4,
    month: '2026年2月',
    date: '2026年2月24号',
    title: '杭州禾迈电力电子股份有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655955672&idx=1&sn=53962bcf105c25d2f3f896f5f0668d3e' }
    ],
    dept: '',
  },
  {
    id: 3,
    month: '2026年2月',
    date: '2026年2月9号',
    title: '杭州昆泰磁悬浮技术有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655954154&idx=1&sn=20d078ae0ebc4d30dd32ade54e443844' }
    ],
    dept: '',
  },
  {
    id: 2,
    month: '2026年2月',
    date: '2026年2月9号',
    title: '杭州惠耳听力技术设备有限公司',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655954154&idx=1&sn=20d078ae0ebc4d30dd32ade54e443844' },
      { name: '东新发布', url: 'https://mp.weixin.qq.com/s?__biz=Mzk0NzM4MjgxMg==&mid=2247847894&idx=1&sn=98b0caaf335d27d1bf21114bb09c6484' }
    ],
    dept: '',
  },
  {
    id: 1,
    month: '2026年2月',
    date: '2026年2月9号',
    title: '杭开集团',
    visitor: '敖煜新',
    sources: [
      { name: '拱墅发布', url: 'https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655954154&idx=1&sn=20d078ae0ebc4d30dd32ade54e443844' }
    ],
    dept: '',
  }
];
const PAGE_SIZE = 10;

/* ===================== 日期筛选辅助 ===================== */
function parseVisitDate(dateStr) {
  const m = dateStr.match(/(\d+)年(\d+)月(\d+)号/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function isDateInRange(dateStr, range) {
  const date = parseVisitDate(dateStr);
  if (!date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  switch (range) {
    case '今日': return diffDays === 0;
    case '近一周': return diffDays >= 0 && diffDays <= 7;
    case '近一月': return diffDays >= 0 && diffDays <= 30;
    case '近三月': return diffDays >= 0 && diffDays <= 90;
    case '近半年': return diffDays >= 0 && diffDays <= 180;
    default: return false;
  }
}

/* ===================== 按月分组并扁平化 ===================== */
function groupAndFlatten(visits) {
  const monthOrder = [];
  const monthMap = {};
  visits.forEach(v => {
    if (!monthMap[v.month]) {
      monthMap[v.month] = [];
      monthOrder.push(v.month);
    }
    monthMap[v.month].push(v);
  });
  const flat = [];
  monthOrder.forEach((month, mi) => {
    flat.push({ id: `header-${month}`, itemType: 'header', month, isFirstMonth: mi === 0 });
    monthMap[month].forEach(v => flat.push({ ...v, itemType: 'card' }));
  });
  return flat;
}

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`ed-filter-btn${active ? ' ed-filter-btn--active' : ''}`}
      onClick={onClick}
    >
      <span className="ed-filter-btn-text">{label}{count > 0 ? `(${count})` : ''}</span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`ed-filter-caret${active ? ' ed-filter-caret--active' : ''}`}
        width={16}
        height={16}
      />
    </button>
  );
}

/* ===================== 月份标题 ===================== */
function MonthHeader({ month, isFirstMonth }) {
  return (
    <div className={`ed-month-header${isFirstMonth ? '' : ' ed-month-header--spaced'}`}>
      {month}
    </div>
  );
}

/* ===================== 走访记录卡片 ===================== */
function VisitCard({ item }) {
  const navigate = useNavigate();
  const { id, date, title, visitor, sources = [] } = item;

  const handleClick = () => {
    navigate(`/enterprise-dynamic-detail/${id}`, {
      state: {
        visitData: {
          title,
          dateTime: date,
          visitor: `走访领导：${visitor}`,
          meetingPlace: title,
          summary: '走访大纲: 聚焦企业发展情况，探讨通过政策路径，推动企业价值化与业务拓展。',
          participants: '参加人员： 陆文婷、王建群、郭李飞、金江锋、高琰',
          meetingTime: `会议时间： ${date}`,
          mainContent: '会议主要内容：',
          contentParagraphs: [
            '一、走访情况\n详细记录本次走访的主要内容和企业反馈情况。',
            '二、企业诉求\n\n企业在发展过程中遇到的主要问题和诉求，以及相关部门的回应和处理方案。',
          ],
          relatedCompanies: [
            {
              id: 1,
              name: title,
              industry: '软件和信息技术服务业',
              legalPerson: '张伟',
              status: '存续',
            },
          ],
        },
      },
    });
  };

  return (
    <div className="ed-card">
      <div className="ed-card-date">{date}</div>
      <div className="ed-card-main">
        <div className="ed-card-timeline-line" />
        <div className="ed-card-info">
          <div className="ed-card-title">{title}</div>
          <div className="ed-card-visitor">走访领导：{visitor}</div>
          <div className="ed-card-tags">
            {sources.map((s, idx) => (
              // 点击之后防止继续页面跳转
              <a href={s.url} target="_blank" rel="noopener noreferrer" key={idx} onClick={(e) => e.stopPropagation()}>
                <div key={idx} className="ed-card-tag">
                  <img src={iconEdLink} alt="" width={16} height={16} />
                  <span>{s.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function EnterpriseDynamic() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  const [deptFilter, setDeptFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

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

  // 过滤数据
  const getFiltered = useCallback(() => {
    return MOCK_VISITS.filter(item => {
      const matchSearch = !debouncedSearch ||
        item.title.includes(debouncedSearch) ||
        item.dept.includes(debouncedSearch) ||
        item.date.includes(debouncedSearch);
      const matchDept = deptFilter.length === 0 || deptFilter.includes(item.dept);
      const matchDate = dateFilter.length === 0 || dateFilter.some(r => isDateInRange(item.date, r));
      return matchSearch && matchDept && matchDate;
    });
  }, [debouncedSearch, deptFilter, dateFilter]);

  // 初始化 / 筛选变化时重置列表
  useEffect(() => {
    const filtered = getFiltered();
    const flat = groupAndFlatten(filtered);
    const page = flat.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(flat.length > PAGE_SIZE);
  }, [getFiltered]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const filtered = getFiltered();
    const flat = groupAndFlatten(filtered);
    const nextPage = flat.slice(displayedItems.length, displayedItems.length + PAGE_SIZE);
    if (nextPage.length > 0) {
      setDisplayedItems(prev => [...prev, ...nextPage]);
    }
    setHasMore(displayedItems.length + nextPage.length < flat.length);
    setLoading(false);
  }, [loading, hasMore, displayedItems.length, getFiltered]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    const filtered = getFiltered();
    const flat = groupAndFlatten(filtered);
    const page = flat.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(flat.length > PAGE_SIZE);
    setRefreshing(false);
  }, [getFiltered]);


  const handleFilterToggle = (key) => {
    setActiveFilter(prev => prev === key ? null : key);
  };

  const renderItem = (item) => {
    if (item.itemType === 'header') {
      return <MonthHeader month={item.month} isFirstMonth={item.isFirstMonth} />;
    }
    return <VisitCard item={item} />;
  };

  return (
    <div className="ed-container">
      {/* ===== 头部 ===== */}
      <div className="ed-header">
        <div className="ed-header-top">
          <button className="ed-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconVisitBack} alt="返回" width={36} height={32} />
          </button>
          <span className="ed-header-title">走访动态</span>
        </div>
        <div className="ed-search-row">
          <div className="ed-search-bar">
            <img src={iconVisitSearch} alt="搜索" className="ed-search-icon" />
            <input
              className="ed-search-input"
              placeholder="搜索走访动态"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== 主体区域 ===== */}
      <div className="ed-body">
        {/* 筛选区域 */}
        <div className="ed-filter-area">
          <div className="ed-filter-row">
            <FilterButton
              label="部门名称"
              active={activeFilter === 'dept' || deptFilter.length > 0}
              count={deptFilter.length}
              onClick={() => handleFilterToggle('dept')}
            />
            <FilterButton
              label="走访日期"
              active={activeFilter === 'date' || dateFilter.length > 0}
              count={dateFilter.length}
              onClick={() => handleFilterToggle('date')}
            />
          </div>
        </div>

        {/* 走访动态列表 */}
        <InfiniteList
          key="dynamic-list"
          items={displayedItems}
          renderItem={renderItem}
          // onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          endText="已显示全部走访动态"
        />
      </div>

      {/* ===== 筛选底部弹框 ===== */}
      <FilterSheet
        title="部门名称"
        options={DEPARTMENTS}
        value={deptFilter}
        onChange={setDeptFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'dept'}
        multiple
      />
      <FilterSheet
        title="走访日期"
        options={DATE_RANGES}
        value={dateFilter}
        onChange={setDateFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'date'}
        multiple
      />
    </div>
  );
}

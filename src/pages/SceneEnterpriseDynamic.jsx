import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import iconSearchDynamic from '../assets/icon-search-dynamic.svg';
import iconNewspaper from '../assets/icon-newspaper.svg';
import iconCaretDown from '../assets/icon-caret-down-small.svg';
import './SceneEnterpriseDynamic.css';
import PageHeader from '../components/PageHeader';

/* ===================== Mock 数据 ===================== */
const TYPES = ['融资动态', '行业动态', '合作动态', '企业荣誉', '政策解读'];
const SOURCES = ['人民日报', '杭州日报', '杭州证券报', '拱墅发布', '杭州发布'];
const NATURES = ['国有企业', '私营企业', '外资企业', '合资企业'];
const TIME_RANGES = ['今日', '近一周', '近一月', '近三月', '近半年'];

const MOCK_DYNAMICS = [
  {
    id: 1,
    type: '融资动态',
    title: '杭州市创新科技有限公司完成首轮融资',
    date: '2026-03-01',
    content: '杭州市创新科技有限公司近日宣布完成A轮融资，融资金额达3000万元，本轮融资将用于技术研发和市场拓展。',
    source: '人民日报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 2,
    type: '行业动态',
    title: '拱墅智能制造产业园正式启动，多家企业入驻',
    date: '2026-03-01',
    content: '拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业。',
    source: '杭州日报',
    relatedCount: 1,
    nature: '国有企业',
  },
  {
    id: 3,
    type: '合作动态',
    title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
    date: '2026-02-28',
    content: '拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
    source: '杭州证券报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 4,
    type: '企业荣誉',
    title: '拱墅新能源科技有限公司获得国家高新技术企业认定',
    date: '2026-02-28',
    content: '拱墅新能源科技有限公司凭借在新能源技术领域的创新成果，成功获得国家高新技术企业认定。',
    source: '拱墅发布',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 5,
    type: '政策解读',
    title: '杭州生物医药产业迎来发展新机遇',
    date: '2026-02-28',
    content: '杭州市政府发布生物医药产业发展规划，计划在未来5年内打造千亿级生物医药产业集群。',
    source: '杭州发布',
    relatedCount: 190,
    nature: '国有企业',
  },
  {
    id: 6,
    type: '融资动态',
    title: '浙江数字科技集团完成B轮融资，总融资额达2亿元',
    date: '2026-02-27',
    content: '浙江数字科技集团宣布完成B轮融资，由知名投资机构领投，融资资金将用于扩大研发团队和拓展市场份额。',
    source: '杭州日报',
    relatedCount: 3,
    nature: '私营企业',
  },
  {
    id: 7,
    type: '行业动态',
    title: '拱墅区数字经济产业集聚效应持续增强',
    date: '2026-02-26',
    content: '2026年以来，拱墅区数字经济企业数量同比增长35%，产业集聚效应显著，成为杭州数字经济发展重要引擎。',
    source: '拱墅发布',
    relatedCount: 56,
    nature: '国有企业',
  },
  {
    id: 8,
    type: '合作动态',
    title: '拱墅区多家科技企业与高校签署产学研合作协议',
    date: '2026-02-25',
    content: '拱墅区10家科技型企业与浙江大学、杭州电子科技大学等高校签署产学研合作协议，共同推进科技成果转化。',
    source: '杭州证券报',
    relatedCount: 10,
    nature: '私营企业',
  },
  {
    id: 9,
    type: '企业荣誉',
    title: '浙江供应链管理有限公司荣获省级专精特新小巨人称号',
    date: '2026-02-24',
    content: '浙江供应链管理有限公司凭借在供应链数字化领域的深耕和创新，荣获2025年度省级专精特新小巨人企业称号。',
    source: '人民日报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 10,
    type: '政策解读',
    title: '杭州出台数字经济十条新政，全面助力企业发展',
    date: '2026-02-23',
    content: '杭州市人民政府发布《关于进一步促进数字经济高质量发展的若干意见》，从多维度支持数字经济企业发展。',
    source: '杭州发布',
    relatedCount: 245,
    nature: '国有企业',
  },
  {
    id: 11,
    type: '融资动态',
    title: '杭州智联互联网完成天使轮融资，专注AI赛道',
    date: '2026-02-22',
    content: '杭州智联互联网有限公司完成千万级天使轮融资，将聚焦人工智能应用场景，加速产品研发落地。',
    source: '杭州日报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 12,
    type: '行业动态',
    title: '拱墅区跨境电商交易额同比增长40%',
    date: '2026-02-21',
    content: '2025年拱墅区跨境电商交易额突破50亿元，同比增长40%，成为浙江省重要的跨境电商产业基地。',
    source: '拱墅发布',
    relatedCount: 32,
    nature: '国有企业',
  },
  {
    id: 13,
    type: '合作动态',
    title: '杭州金融科技有限公司与多家保险机构达成战略合作',
    date: '2026-02-20',
    content: '杭州金融科技有限公司与平安保险、太保集团等多家保险机构签订战略合作协议，共同打造金融科技生态圈。',
    source: '杭州证券报',
    relatedCount: 5,
    nature: '私营企业',
  },
  {
    id: 14,
    type: '企业荣誉',
    title: '浙江人工智能科技有限公司入选国家重点专项',
    date: '2026-02-19',
    content: '浙江人工智能科技有限公司承担的"人工智能关键技术研究"项目成功入选国家重点研发计划，获批资助资金1500万元。',
    source: '人民日报',
    relatedCount: 1,
    nature: '外资企业',
  },
  {
    id: 15,
    type: '政策解读',
    title: '杭州加快推进新型工业化政策体系建设',
    date: '2026-02-18',
    content: '杭州市工业和信息化局发布新型工业化实施方案，计划到2027年实现规模以上工业企业数字化改造全覆盖。',
    source: '杭州发布',
    relatedCount: 128,
    nature: '国有企业',
  },
];

const PAGE_SIZE = 8;

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`sed-filter-btn${active ? ' sed-filter-btn--active' : ''}`}
      onClick={onClick}
    >
      <span className="sed-filter-btn-text">{label}{count > 0 ? `(${count})` : ''}</span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`sed-filter-caret${active ? ' sed-filter-caret--active' : ''}`}
        width={16}
        height={16}
      />
    </button>
  );
}

/* ===================== 动态卡片 ===================== */
function DynamicCard({ item, onViewDetail }) {
  const { type, title, date, content, source, relatedCount, isFirst } = item;
  const relatedText = `关联 ${relatedCount} 家企业`;

  return (
    <div className={`sed-card${isFirst ? ' sed-card--first' : ''}`}>
      {/* 顶部：类型标签 + 查看详情 */}
      <div className="sed-card-top">
        <div className="sed-badge">{type}</div>
        <span className="sed-view-detail" onClick={() => onViewDetail && onViewDetail(item.id)}>查看详情 →</span>
      </div>

      {/* 标题行：绿点 + 标题 + 日期 */}
      <div className="sed-title-row">
        <div className="sed-title-left">
          <div className="sed-green-dot" />
          <span className="sed-title">{title}</span>
        </div>
        <span className="sed-date">{date}</span>
      </div>

      {/* 正文 */}
      <div className="sed-content">{content}</div>

      {/* 底部：来源 + 关联企业 */}
      <div className="sed-card-footer">
        <div className="sed-source">
          <img src={iconNewspaper} alt="来源" className="sed-newspaper-icon" width={12} height={12} />
          <span className="sed-source-name">{source}</span>
        </div>
        <span className="sed-related">{relatedText}</span>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function SceneEnterpriseDynamic() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // 筛选状态
  const [typeFilter, setTypeFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);
  const [natureFilter, setNatureFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([]);

  // 当前展开的筛选器
  const [activeFilter, setActiveFilter] = useState(null);

  // 列表数据
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
    return MOCK_DYNAMICS.filter(item => {
      const matchSearch = !debouncedSearch ||
        item.title.includes(debouncedSearch) ||
        item.content.includes(debouncedSearch) ||
        item.source.includes(debouncedSearch);
      const matchType = typeFilter.length === 0 || typeFilter.includes(item.type);
      const matchSource = sourceFilter.length === 0 || sourceFilter.includes(item.source);
      const matchNature = natureFilter.length === 0 || natureFilter.includes(item.nature);
      // 时间筛选为简单模拟，实际按天数过滤
      const matchTime = timeFilter.length === 0;
      return matchSearch && matchType && matchSource && matchNature && matchTime;
    });
  }, [debouncedSearch, typeFilter, sourceFilter, natureFilter, timeFilter]);

  // 初始化 / 筛选变化时重置列表
  useEffect(() => {
    const filtered = getFiltered();
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
        ...nextPage.map(item => ({ ...item, isFirst: false })),
      ]);
    }
    setHasMore(displayedItems.length + nextPage.length < filtered.length);
    setLoading(false);
  }, [loading, hasMore, displayedItems.length, getFiltered]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    const filtered = getFiltered();
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page.map((item, i) => ({ ...item, isFirst: i === 0 })));
    setHasMore(filtered.length > PAGE_SIZE);
    setRefreshing(false);
  }, [getFiltered]);

  const handleFilterToggle = (key) => {
    setActiveFilter(prev => (prev === key ? null : key));
  };

  const handleViewDetail = useCallback((id) => {
    navigate(`/scene-enterprise-dynamic-detail/${id}`);
  }, [navigate]);

  return (
    <div className="sed-container">
      {/* ===== 头部 ===== */}
      <PageHeader title="人工智能场景动态">
        {/* 搜索行 */}
        <div className="sed-search-row">
          <div className="sed-search-bar">
            <img src={iconSearchDynamic} alt="搜索" className="sed-search-icon" />
            <input
              className="sed-search-input"
              placeholder="搜索资讯信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      {/* ===== 主体区域 ===== */}
      <div className="sed-body">
        {/* ===== 筛选区域 ===== */}
        <div className="sed-filter-area">
          <div className="sed-filter-row">
            <FilterButton
              label="类型"
              active={activeFilter === 'type' || typeFilter.length > 0}
              count={typeFilter.length}
              onClick={() => handleFilterToggle('type')}
            />
            <FilterButton
              label="来源"
              active={activeFilter === 'source' || sourceFilter.length > 0}
              count={sourceFilter.length}
              onClick={() => handleFilterToggle('source')}
            />
            <FilterButton
              label="性质"
              active={activeFilter === 'nature' || natureFilter.length > 0}
              count={natureFilter.length}
              onClick={() => handleFilterToggle('nature')}
            />
            <FilterButton
              label="时间"
              active={activeFilter === 'time' || timeFilter.length > 0}
              count={timeFilter.length}
              onClick={() => handleFilterToggle('time')}
            />
          </div>
        </div>

        {/* ===== 动态列表 ===== */}
        <InfiniteList
          items={displayedItems}
          renderItem={(item) => <DynamicCard item={item} onViewDetail={handleViewDetail} />}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          endText="已显示全部动态"
        />
      </div>

      {/* ===== 筛选底部弹框 ===== */}
      <FilterSheet
        title="类型"
        options={TYPES}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'type'}
        multiple
      />
      <FilterSheet
        title="来源"
        options={SOURCES}
        value={sourceFilter}
        onChange={setSourceFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'source'}
        multiple
      />
      <FilterSheet
        title="性质"
        options={NATURES}
        value={natureFilter}
        onChange={setNatureFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'nature'}
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

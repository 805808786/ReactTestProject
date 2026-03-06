import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import iconBackWhite from '../assets/icon-back-white.svg';
import iconSearchDynamic from '../assets/icon-search-dynamic.svg';
import iconNewspaper from '../assets/icon-newspaper.svg';
import iconCaretDown from '../assets/icon-caret-down-small.svg';
import './TopEnterpriseDynamic.css';

/* ===================== Mock 数据 ===================== */
const TYPES = ['融资动态', '行业动态', '合作动态', '企业荣誉', '政策解读'];
const SOURCES = ['人民日报', '杭州日报', '杭州证券报', '拱墅发布', '杭州发布'];
const NATURES = ['国有企业', '私营企业', '外资企业', '合资企业'];
const TIME_RANGES = ['今日', '近一周', '近一月', '近三月', '近半年'];

const MOCK_DYNAMICS = [
  {
    id: 1,
    type: '融资动态',
    title: '浙江数字科技集团完成C轮融资，融资额达10亿元',
    date: '2026-03-05',
    content: '浙江数字科技集团宣布完成C轮融资，融资额达10亿元，由红杉资本领投，此轮融资将加速其数字化平台的全国布局。',
    source: '杭州证券报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 2,
    type: '行业动态',
    title: '杭州新能源汽车产业迎来政策红利，头部企业加速扩产',
    date: '2026-03-05',
    content: '杭州市出台新能源汽车产业扶持政策，拱墅区多家头部新能源企业获批扩产，预计年产能将提升50%，带动就业5000余人。',
    source: '人民日报',
    relatedCount: 12,
    nature: '国有企业',
  },
  {
    id: 3,
    type: '合作动态',
    title: '杭州智联互联网与华为签署深度战略合作协议',
    date: '2026-03-04',
    content: '杭州智联互联网有限公司与华为技术有限公司正式签署深度战略合作协议，双方将在云计算、人工智能领域开展全面合作。',
    source: '杭州日报',
    relatedCount: 2,
    nature: '私营企业',
  },
  {
    id: 4,
    type: '企业荣誉',
    title: '浙江生物医药科技有限公司入选国家级专精特新"小巨人"企业',
    date: '2026-03-04',
    content: '工业和信息化部公布第六批专精特新"小巨人"企业名单，浙江生物医药科技有限公司凭借创新药研发实力成功入选。',
    source: '拱墅发布',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 5,
    type: '政策解读',
    title: '杭州出台头部企业培育三年行动计划，重点扶持十大行业',
    date: '2026-03-03',
    content: '杭州市人民政府发布头部企业培育三年行动计划，将重点培育数字经济、生命健康、高端制造等十大行业头部企业，计划三年内新增百亿级企业15家。',
    source: '杭州发布',
    relatedCount: 258,
    nature: '国有企业',
  },
  {
    id: 6,
    type: '融资动态',
    title: '杭州高端装备制造有限公司完成股权融资，引入战略投资者',
    date: '2026-03-02',
    content: '杭州高端装备制造有限公司宣布完成新一轮股权融资，引入多家产业资本和财务投资者，总融资额超5亿元，将用于智能制造产线升级。',
    source: '杭州证券报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 7,
    type: '行业动态',
    title: '拱墅区头部企业营收总额同比增长28%，创历史新高',
    date: '2026-03-02',
    content: '2025年度拱墅区头部企业（年营收超10亿元）营收总额同比增长28%，突破2000亿元大关，创历史新高，持续引领全区经济高质量发展。',
    source: '拱墅发布',
    relatedCount: 43,
    nature: '国有企业',
  },
  {
    id: 8,
    type: '合作动态',
    title: '浙江数商平台运营有限公司与阿里云达成生态合作',
    date: '2026-03-01',
    content: '浙江数商平台运营有限公司与阿里云计算有限公司签署生态合作协议，依托阿里云技术底座，共同打造数字商业服务平台，赋能数千家中小微企业数字化转型。',
    source: '杭州日报',
    relatedCount: 3,
    nature: '私营企业',
  },
  {
    id: 9,
    type: '企业荣誉',
    title: '杭州元宇宙技术有限公司荣获2025年度最具创新力科技企业奖',
    date: '2026-02-28',
    content: '在2025年度中国科技创新年度颁奖典礼上，杭州元宇宙技术有限公司凭借其在元宇宙基础设施领域的突破性研究，荣获"最具创新力科技企业"殊荣。',
    source: '人民日报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 10,
    type: '政策解读',
    title: '浙江省出台促进民营头部企业高质量发展若干措施',
    date: '2026-02-27',
    content: '浙江省人民政府印发《关于进一步促进民营头部企业高质量发展的若干措施》，从融资支持、人才引进、市场准入等方面提出20条具体举措，为头部民营企业发展保驾护航。',
    source: '杭州发布',
    relatedCount: 189,
    nature: '国有企业',
  },
  {
    id: 11,
    type: '融资动态',
    title: '杭州软件信息服务有限公司赴港上市，募资超30亿港元',
    date: '2026-02-26',
    content: '杭州软件信息服务有限公司在香港联合交易所成功挂牌上市，发行价28港元/股，募资总额超30亿港元，成为今年上半年杭州最大规模的境外IPO。',
    source: '杭州证券报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 12,
    type: '行业动态',
    title: '拱墅区人工智能头部企业集聚效应显现，产业链日趋完善',
    date: '2026-02-25',
    content: '截至2026年2月，拱墅区人工智能领域年营收过亿企业已达36家，形成从芯片设计、算法研发到场景应用的完整产业链，头部企业集聚效应日趋显现。',
    source: '拱墅发布',
    relatedCount: 36,
    nature: '国有企业',
  },
  {
    id: 13,
    type: '合作动态',
    title: '杭州医疗健康科技有限公司与国际医疗机构达成跨境合作',
    date: '2026-02-24',
    content: '杭州医疗健康科技有限公司与美国梅奥诊所、德国西门子医疗等国际顶级医疗机构签署战略合作备忘录，共同推进智慧医疗技术的研发与应用。',
    source: '杭州日报',
    relatedCount: 1,
    nature: '外资企业',
  },
  {
    id: 14,
    type: '企业荣誉',
    title: '浙江绿色低碳科技有限公司获评国家绿色工厂示范单位',
    date: '2026-02-23',
    content: '工业和信息化部公布2025年度绿色工厂名单，浙江绿色低碳科技有限公司以优异的绿色制造管理体系和能源利用效率，成功入选"国家绿色工厂示范单位"。',
    source: '人民日报',
    relatedCount: 1,
    nature: '私营企业',
  },
  {
    id: 15,
    type: '政策解读',
    title: '拱墅区推出头部企业定制化服务包，打造营商环境最优区',
    date: '2026-02-22',
    content: '拱墅区面向辖区内头部企业正式推出"1+N"定制化服务包，为年营收超5亿元企业配备专属服务专员，提供政策兑现、审批加速、融资对接等全流程服务。',
    source: '拱墅发布',
    relatedCount: 78,
    nature: '国有企业',
  },
];

const PAGE_SIZE = 8;

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`ted-filter-btn${active ? ' ted-filter-btn--active' : ''}`}
      onClick={onClick}
    >
      <span className="ted-filter-btn-text">{label}{count > 0 ? `(${count})` : ''}</span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`ted-filter-caret${active ? ' ted-filter-caret--active' : ''}`}
        width={16}
        height={16}
      />
    </button>
  );
}

/* ===================== 动态卡片 ===================== */
function DynamicCard({ item }) {
  const navigate = useNavigate();
  const { type, title, date, content, source, relatedCount, isFirst } = item;
  const relatedText = `关联 ${relatedCount} 家企业`;

  const handleClick = () => {
    navigate(`/top-enterprise-dynamic-detail/${item.id}`);
  };

  return (
    <div className={`ted-card${isFirst ? ' ted-card--first' : ''}`} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* 顶部：类型标签 + 查看详情 */}
      <div className="ted-card-top">
        <div className="ted-badge">{type}</div>
        <span className="ted-view-detail">查看详情 →</span>
      </div>

      {/* 标题行：绿点 + 标题 + 日期 */}
      <div className="ted-title-row">
        <div className="ted-title-left">
          <div className="ted-green-dot" />
          <span className="ted-title">{title}</span>
        </div>
        <span className="ted-date">{date}</span>
      </div>

      {/* 正文 */}
      <div className="ted-content">{content}</div>

      {/* 底部：来源 + 关联企业 */}
      <div className="ted-card-footer">
        <div className="ted-source">
          <img src={iconNewspaper} alt="来源" className="ted-newspaper-icon" width={12} height={12} />
          <span className="ted-source-name">{source}</span>
        </div>
        <span className="ted-related">{relatedText}</span>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function TopEnterpriseDynamic() {
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

  return (
    <div className="ted-container">
      {/* ===== 头部 ===== */}
      <div className="ted-header">
        <div className="ted-header-top">
          <button className="ted-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBackWhite} alt="返回" width={36} height={32} />
          </button>
          <span className="ted-header-title">头部企业动态</span>
        </div>

        {/* 搜索行 */}
        <div className="ted-search-row">
          <div className="ted-search-bar">
            <img src={iconSearchDynamic} alt="搜索" className="ted-search-icon" />
            <input
              className="ted-search-input"
              placeholder="搜索资讯信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== 主体区域 ===== */}
      <div className="ted-body">
        {/* ===== 筛选区域 ===== */}
        <div className="ted-filter-area">
          <div className="ted-filter-row">
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
          renderItem={(item) => <DynamicCard item={item} />}
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

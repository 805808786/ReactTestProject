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
    "id": 1001,
    "type": "调研走访",
    "title": "区领导带队赴上海开展招商考察活动",
    "date": "2026-04-02",
    "content": "区委副书记、区长陈宇带队赴上海进行招商考察活动，强调项目为王，推进产业结构调整和转型升级。走访了多家企业，就项目合作及产业发展进行了深入交流。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1002,
    "type": "政策法规",
    "title": "拱墅新一轮经济政策发布",
    "date": "2026-04-01",
    "content": "拱墅区为推动经济稳进提质和创新发展，对‘8+4’经济政策进行迭代更新。主要内容包括深化教育科技人才一体改革发展、加快先进制造业发展、推进服务业扩能提质和消费转型升级、建设国际性综合交通枢纽城市和交通强国示范城市、推进高水平对外开放、全力扩大有效投资、推进城乡一体融合高质量发展以及保障和改善民生等方面，共计43条政策条款，区级财政资金超68亿元。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1003,
    "type": "为企服务",
    "title": "全省首个园区级“证电碳服务窗口”，如何打造零碳全国样板？",
    "date": "2026-04-01",
    "content": "全省首个园区级‘证电碳服务窗口’在大运河数智城智慧网谷小镇正式投用，国网拱墅区供电公司同步推出一系列优化举措，以一站式集成服务打通政企碳服务对接‘最后一公里’，助力园区打造零碳全国样板、助推区域绿色低碳转型。大运河数智城已形成数字经济为核心，人工智能等产业协同发展的格局，并创新构建了‘1+5+X’服务业主导型低碳园区体系。通过先进技术赋能，园区实现能源轻量化改造，推进光伏建设，提升绿色用能占比，打造充电服务生态圈。未来，大运河数智城将与拱墅电力深化合作，推动产业与电力服务深度融合。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1004,
    "type": "数据要素",
    "title": "拱墅有“数”，“冠军”有路",
    "date": "2026-04-01",
    "content": "2025年，拱墅企业托普云农在国家“数据要素×”大赛中获全国一等奖，标志着浙江省在该奖项上实现零的突破。托普云农致力于智慧农业综合服务，深耕行业十余年，获得多项荣誉和专利。此次获奖与拱墅构建的数据生态密不可分，拱墅通过数据产业梯度培育机制和创新构建数商标签体系，推动企业快速发展。",
    "source": "拱墅发布",
    "relatedCount": 1,
    "relatedCompanies": [
      {
        "id": 4,
        "name": "浙江托普云农科技股份有限公司",
        "detailUrl": '/company-detail/1848243286290067459'
      }
    ]
  },
  {
    "id": 1005,
    "type": "调研走访",
    "title": "姚高员调研大城北地区产业高质量发展工作：以科技创新推动文化发展  更好把文化软实力转化为经济社会发展硬实力",
    "date": "2026-03-30",
    "content": "姚高员在调研大城北地区产业高质量发展工作时强调，要以科技创新推动文化发展，将文化软实力转化为经济社会发展硬实力。他参观了杭州全息智能技术研究院和浙报数字文化集团股份有限公司，鼓励开发更多‘文化+科技’融合的爆款产品，并强调了人工智能在文化产业中的重要作用。同时，他还关注了生物医药产业的发展，并提出要进一步强化企业创新主体地位。此外，他还强调市级相关部门和属地应优化创新生态，推动产业高质量发展。",
    "source": "拱墅发布",
    "relatedCount": 1,
    "relatedCompanies": [
      {
        "id": 5,
        "name": "浙报数字文化集团股份有限公司",
        "detailUrl": '/company-detail/1848243450094415875'
      }
    ]
  },
  {
    "id": 1006,
    "type": "科技创新",
    "title": "让AI主动带货！这家企业帮中国品牌“被看见”",
    "date": "2026-03-28",
    "content": "一家中国供应商通过与万悉科技合作，挖掘出其无起订量发货的独特优势，通过AI推荐提升客户转化率。万悉科技利用GEO（原生GEO系统）帮助企业在全球营销领域脱颖而出，并强调诚信和真实的内容制作，助力企业实现高质量出海。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 7,
    "type": "商务社区",
    "title": "OPC社区火出圈，来拱墅开启创业新模式",
    "date": "2026-03-25",
    "content": "浙江广城商业管理有限公司总经理杨舒晓认为，人工智能成为新的风口，企业抓住机会可以弥补失去的。东新街道正在推进‘AI+OPC社区’布局，旨在降低创新创业成本，推动个体及企业运用AI技术。星火智造园作为老牌科创载体，已孵化出多家优质企业，正转型为人工智能OPC产业社区，助力区域经济高质量发展。",
    "source": "拱墅发布",
    "relatedCount": 1,
    "relatedCompanies": [
      {
        "id": 7,
        "name": "杭州万悉科技有限公司",
        "detailUrl": '/company-detail/1848244183254560771'
      }
    ]
  },
  {
    "id": 1008,
    "type": "城市建设",
    "title": "这片满载荣光的老厂房向新而生",
    "date": "2026-03-23",
    "content": "本文介绍了杭州叉车厂石桥科创园的转型升级过程，从传统的制造业基地转变为现代化的科技创新园区。文章讲述了该园区的发展历程、现状及未来规划，强调了其在智能制造和新能源领域的创新和发展潜力，以及对区域经济发展的贡献。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1009,
    "type": "科技创新",
    "title": "工信部认定！拱墅的TA入选",
    "date": "2026-03-20",
    "content": "工业和信息化部发布科技型企业和孵化器名单，杭州集成电路创新产业园成功入选标准级孵化器。该园区由芯空间管理运营，专注于集成电路及数字经济核心产业，提供多元化服务模块和5亿集成电路产业基金支持。同时，大运河数智城将围绕“1+2+X”创新布局，深化校地协同，加快产业链延伸和成果转化。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1010,
    "type": "科技创新",
    "title": "廉毅敏在杭州宣讲全国两会精神并调研：打造一流创新生态 激发创新创造活力",
    "date": "2026-03-19",
    "content": "省政协主席廉毅敏在杭州宣讲全国两会精神并调研，强调深入学习贯彻习近平总书记重要讲话和全国两会精神，加快建设一流创新生态，打造最具竞争力营商环境，促进民营经济高质量发展。他考察了杭州医药港小镇、科技企业等，对科技创新、产业链布局等方面提出要求。同时，强调要加强人才‘引育留用’，一体培育发展大中小企业，优化创新要素配置，推动政策服务提质增效，为‘十五五’开好局起好步贡献智慧力量。",
    "source": "拱墅发布",
    "relatedCount": 0,
    "relatedCompanies": []
  },
  {
    "id": 1011,
    "type": "文旅宣传",
    "title": "运河畔，正批量生长“一人军团”",
    "date": "2026-03-17",
    "content": "本文报道了拱墅区在人工智能领域的发展情况，特别是针对一人公司（OPC）的创新模式。文章介绍了杭州积甲科技发展有限公司作为一家小团队利用AI工具推动文化遗产保护和文博文创产业发展的案例，并讨论了拱墅区如何通过政策扶持和资源整合来促进人工智能产业发展。此外，还提到了武林数字产业园内即将揭幕的OPC创业平台，以及拱墅区在资本支持方面的举措。",
    "source": "拱墅发布",
    "relatedCount": 1,
    "relatedCompanies": [
      {
        "id": 11,
        "name": "杭州积甲科技发展有限公司",
        "detailUrl": '/company-detail/1953686879668846594'
      }
    ]
  }
];

// const MOCK_DYNAMICS = [
//   {
//     id: 1,
//     type: '融资动态',
//     title: '杭州市创新科技有限公司完成首轮融资',
//     date: '2026-03-01',
//     content: '杭州市创新科技有限公司近日宣布完成A轮融资，融资金额达3000万元，本轮融资将用于技术研发和市场拓展。',
//     source: '人民日报',
//     relatedCount: 1,
//     nature: '私营企业',
//   },
//   {
//     id: 2,
//     type: '行业动态',
//     title: '拱墅智能制造产业园正式启动，多家企业入驻',
//     date: '2026-03-01',
//     content: '拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业。',
//     source: '杭州日报',
//     relatedCount: 1,
//     nature: '国有企业',
//   },
//   {
//     id: 3,
//     type: '合作动态',
//     title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
//     date: '2026-02-28',
//     content: '拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
//     source: '杭州证券报',
//     relatedCount: 1,
//     nature: '私营企业',
//   },
//   {
//     id: 4,
//     type: '企业荣誉',
//     title: '拱墅新能源科技有限公司获得国家高新技术企业认定',
//     date: '2026-02-28',
//     content: '拱墅新能源科技有限公司凭借在新能源技术领域的创新成果，成功获得国家高新技术企业认定。',
//     source: '拱墅发布',
//     relatedCount: 1,
//     nature: '私营企业',
//   },
//   {
//     id: 5,
//     type: '政策解读',
//     title: '杭州生物医药产业迎来发展新机遇',
//     date: '2026-02-28',
//     content: '杭州市政府发布生物医药产业发展规划，计划在未来5年内打造千亿级生物医药产业集群。',
//     source: '杭州发布',
//     relatedCount: 190,
//     nature: '国有企业',
//   },
//   {
//     id: 6,
//     type: '融资动态',
//     title: '浙江数字科技集团完成B轮融资，总融资额达2亿元',
//     date: '2026-02-27',
//     content: '浙江数字科技集团宣布完成B轮融资，由知名投资机构领投，融资资金将用于扩大研发团队和拓展市场份额。',
//     source: '杭州日报',
//     relatedCount: 3,
//     nature: '私营企业',
//   },
//   {
//     id: 7,
//     type: '行业动态',
//     title: '拱墅区数字经济产业集聚效应持续增强',
//     date: '2026-02-26',
//     content: '2026年以来，拱墅区数字经济企业数量同比增长35%，产业集聚效应显著，成为杭州数字经济发展重要引擎。',
//     source: '拱墅发布',
//     relatedCount: 56,
//     nature: '国有企业',
//   },
//   {
//     id: 8,
//     type: '合作动态',
//     title: '拱墅区多家科技企业与高校签署产学研合作协议',
//     date: '2026-02-25',
//     content: '拱墅区10家科技型企业与浙江大学、杭州电子科技大学等高校签署产学研合作协议，共同推进科技成果转化。',
//     source: '杭州证券报',
//     relatedCount: 10,
//     nature: '私营企业',
//   },
//   {
//     id: 9,
//     type: '企业荣誉',
//     title: '浙江供应链管理有限公司荣获省级专精特新小巨人称号',
//     date: '2026-02-24',
//     content: '浙江供应链管理有限公司凭借在供应链数字化领域的深耕和创新，荣获2025年度省级专精特新小巨人企业称号。',
//     source: '人民日报',
//     relatedCount: 1,
//     nature: '私营企业',
//   },
//   {
//     id: 10,
//     type: '政策解读',
//     title: '杭州出台数字经济十条新政，全面助力企业发展',
//     date: '2026-02-23',
//     content: '杭州市人民政府发布《关于进一步促进数字经济高质量发展的若干意见》，从多维度支持数字经济企业发展。',
//     source: '杭州发布',
//     relatedCount: 245,
//     nature: '国有企业',
//   },
//   {
//     id: 11,
//     type: '融资动态',
//     title: '杭州智联互联网完成天使轮融资，专注AI赛道',
//     date: '2026-02-22',
//     content: '杭州智联互联网有限公司完成千万级天使轮融资，将聚焦人工智能应用场景，加速产品研发落地。',
//     source: '杭州日报',
//     relatedCount: 1,
//     nature: '私营企业',
//   },
//   {
//     id: 12,
//     type: '行业动态',
//     title: '拱墅区跨境电商交易额同比增长40%',
//     date: '2026-02-21',
//     content: '2025年拱墅区跨境电商交易额突破50亿元，同比增长40%，成为浙江省重要的跨境电商产业基地。',
//     source: '拱墅发布',
//     relatedCount: 32,
//     nature: '国有企业',
//   },
//   {
//     id: 13,
//     type: '合作动态',
//     title: '杭州金融科技有限公司与多家保险机构达成战略合作',
//     date: '2026-02-20',
//     content: '杭州金融科技有限公司与平安保险、太保集团等多家保险机构签订战略合作协议，共同打造金融科技生态圈。',
//     source: '杭州证券报',
//     relatedCount: 5,
//     nature: '私营企业',
//   },
//   {
//     id: 14,
//     type: '企业荣誉',
//     title: '浙江人工智能科技有限公司入选国家重点专项',
//     date: '2026-02-19',
//     content: '浙江人工智能科技有限公司承担的"人工智能关键技术研究"项目成功入选国家重点研发计划，获批资助资金1500万元。',
//     source: '人民日报',
//     relatedCount: 1,
//     nature: '外资企业',
//   },
//   {
//     id: 15,
//     type: '政策解读',
//     title: '杭州加快推进新型工业化政策体系建设',
//     date: '2026-02-18',
//     content: '杭州市工业和信息化局发布新型工业化实施方案，计划到2027年实现规模以上工业企业数字化改造全覆盖。',
//     source: '杭州发布',
//     relatedCount: 128,
//     nature: '国有企业',
//   },
// ];

const PAGE_SIZE = 11;

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

  // 类型到样式类名的映射
  const getBadgeClass = (type) => {
    const typeMap = {
      '调研走访': 'sed-badge--news',
      '政策法规': 'sed-badge--recommend',
      '为企服务': 'sed-badge--service',
      '数据要素': 'sed-badge--related',
      '科技创新': 'sed-badge--tech',
      '商务社区': 'sed-badge--business',
      '城市建设': 'sed-badge--city',
      '文旅宣传': 'sed-badge--recommend'
    };
    return typeMap[type] || 'sed-badge';
  };

  return (
    <div className={`sed-card`}>
      {/* 顶部：类型标签 + 查看详情 */}
      <div className="sed-card-top">
        <div className={`sed-badge ${getBadgeClass(type)}`}>{type}</div>
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
        {relatedCount > 0 && <span className="sed-related">{relatedText}</span>}
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
  const [hasMore, setHasMore] = useState(false);
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

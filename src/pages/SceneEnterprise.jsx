import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import DateSelection from './components/dataSelection/index';
import PageHeader from '../components/PageHeader';
import { selectEnterpriseFirstTag, searchEnterpriseByTag, selectEnterpriseSecondTag } from '../api/enterprise';
import iconBack from '../assets/icon-back.svg';
import iconSearchInput from '../assets/icon-search-input.svg';
import iconSceneDynamic from '../assets/icon-scene-dynamic.svg';
import iconCompany from '../assets/icon-company-se.svg';
import iconSceneCalendar from '../assets/icon-scene-calendar.svg';
import iconStatInfo from '../assets/icon-stat-info.svg';
import './SceneEnterprise.css';

/* ===================== Mock 数据 ===================== */
const STREETS = ['米市巷街道', '湖墅街道', '小河街道', '和睦街道', '拱宸桥街道', '大关街道', '上塘街道', '祥符街道', '康桥街道', '半山街道', '天水街道', '武林街道', '长庆街道', '潮鸣街道', '朝晖街道', '文晖街道', '东新街道', '石桥街道'];
const ENTERPRISE_SIZES = ['微型', '小型', '中型', '大型'];



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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9" />
      </svg>
    </button>
  );
}

/* ===================== 企业卡片 ===================== */
function EnterpriseCard({ enterprise }) {
  const { enterpriseName, enterpriseLogo, tags, categoryName, isFirst } = enterprise;
  // 从 tags 数组中提取 tagName
  const tagNames = tags ? tags.map(tag => tag.tagName) : [];
  const visibleTags = tagNames.slice(0, 2);
  const extraCount = tagNames.length - 2;

  return (
    <div key={enterprise.enterpriseId} className={`se-card${isFirst ? ' se-card--first' : ''}`}>
      {/* 顶部：图标 + 公司名 + 标签 + 查看详情 */}
      <div className="se-card-top">
        <div className="se-card-left">
          <img
            src={enterpriseLogo || iconCompany}
            alt="企业"
            className="se-company-icon"
          />
          <div className="se-company-info">
            <div className="se-company-name">{enterpriseName}</div>
            {categoryName && (
              <div className="se-company-category">{categoryName}</div>
            )}
            <div className="se-tags">
              {visibleTags.map((tag, index) => (
                <span key={index} className="se-tag">{tag}</span>
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
        {/* 企业 ID */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">企业 ID：</span>
            <span className="se-info-value">{enterprise.enterpriseId || '-'}</span>
          </div>
        </div>
        {/* 注册地址 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">注册地址：</span>
            <span className="se-info-value se-address">{enterprise.registeredAddress || '-'}</span>
          </div>
        </div>
        {/* 所属街道 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">所属街道：</span>
            <span className="se-info-value">{enterprise.street || '-'}</span>
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
  const sceneName = location.state?.sceneName || '人工智能';

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
    // 清空筛选条件
    setStreetFilter([]);
    setEnterpriseSizeFilter([]);
    setTagFilter([]);
    setActiveFilter(null);
  }, [pendingDate]);

  // 筛选状态
  const [streetFilter, setStreetFilter] = useState([]);
  const [enterpriseSizeFilter, setEnterpriseSizeFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  // 当前展开的筛选器
  const [activeFilter, setActiveFilter] = useState(null);

  // 列表数据
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // API 数据
  const [enterpriseTags, setEnterpriseTags] = useState([]);
  const [enterpriseSecondTags, setEnterpriseSecondTags] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  // 当前选择的标签
  const [currentTag, setCurrentTag] = useState(null);

  // 使用ref存储最新的二级标签数据
  const enterpriseSecondTagsRef = useRef(enterpriseSecondTags);
  useEffect(() => {
    enterpriseSecondTagsRef.current = enterpriseSecondTags;
  }, [enterpriseSecondTags]);
  
  // 使用ref存储最新的筛选条件
  const filtersRef = useRef({
    enterpriseSizeFilter,
    streetFilter,
    tagFilter,
    debouncedSearch
  });
  useEffect(() => {
    filtersRef.current = {
      enterpriseSizeFilter,
      streetFilter,
      tagFilter,
      debouncedSearch
    };
  }, [enterpriseSizeFilter, streetFilter, tagFilter, debouncedSearch]);

  // 搜索防抖
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  // 获取企业数据
  useEffect(() => {
    const loadEnterpriseTags = async () => {
      setApiLoading(true);
      try {
        const response = await selectEnterpriseFirstTag({ sceneName, pageLevel: 1 });
        const tags = response.data || [];
        setEnterpriseTags(tags);
        // 设置默认标签为第一个 item
        if (tags.length > 0) {
          setCurrentTag({
            firstTag: tags[0].firstTag,
            firstTagId: tags[0].firstTagId
          });
        }
      } catch (error) {
        console.error('Error loading enterprise tags:', error);
      } finally {
        setApiLoading(false);
      }
    };

    loadEnterpriseTags();
  }, [sceneName]);

  // 获取企业二级标签数据
  useEffect(() => {
    if (!currentTag) return;

    const loadEnterpriseSecondTags = async () => {
      try {
        const response = await selectEnterpriseSecondTag({
          firstTag: currentTag.firstTag,
          firstTagId: currentTag.firstTagId,
          sceneName,
          selectDate: confirmedDate || new Date().toISOString().split('T')[0]
        });
        const secondTags = response.data || [];
        setEnterpriseSecondTags(secondTags);
      } catch (error) {
        console.error('Error loading enterprise second tags:', error);
      }
    };

    loadEnterpriseSecondTags();
  }, [currentTag, sceneName, confirmedDate]);

  // 获取企业列表数据
  const fetchEnterprises = useCallback(async (pageIndex = 1, isRefresh = false) => {
    if (!currentTag) return;

    const { enterpriseSizeFilter, streetFilter, tagFilter, debouncedSearch } = filtersRef.current;

    // 处理企业规模参数，将选项映射为对应的数值
    const enterpriseSize = enterpriseSizeFilter.length > 0 ? {
      '微型': 1,
      '小型': 2,
      '中型': 3,
      '大型': 4
    }[enterpriseSizeFilter[0]] : undefined;

    // 处理所属街道参数
    const street = streetFilter.length > 0 ? streetFilter[0] : undefined;

    // 处理重点标签参数，将选项映射为对应的secondTagId
    const secondTagId = tagFilter.length > 0 ? {
      ...enterpriseSecondTagsRef.current.reduce((acc, tag) => {
        acc[tag.secondTag] = tag.secondTagId;
        return acc;
      }, {})
    }[tagFilter[0]] : undefined;

    const secondTag = tagFilter.length > 0 ? tagFilter[0] : undefined;

    try {

      const response = await searchEnterpriseByTag({
        pageIndex,
        pageSize: 20,
        selectDate: confirmedDate || new Date(Date.now() - 86400000).toISOString().split('T')[0],
        sceneName,
        firstTag: currentTag.firstTag,
        firstTagId: currentTag.firstTagId,
        enterpriseSize,
        street,
        secondTag,
        secondTagId,
        keyword: debouncedSearch
      });

      const data = response.data || [];
      const total = response.totalCount || 0;

      if (isRefresh) {
        setDisplayedItems(data.map((item, i) => ({ ...item, isFirst: i === 0 })));
      } else {
        setDisplayedItems(prev => [
          ...prev,
          ...data.map((item, i) => ({ ...item, isFirst: prev.length === 0 && i === 0 })),
        ]);
      }

      setFilteredTotal(total);
      setHasMore(displayedItems.length + data.length < total);
      setCurrentPage(pageIndex);
    } catch (error) {
      console.error('Error fetching enterprises:', error);
    }
  }, [sceneName, currentTag, confirmedDate]);

  // 统一处理筛选条件和搜索文本变化
  useEffect(() => {
    if (currentTag) {
      setCurrentPage(1);
      fetchEnterprises(1, true);
    }
  }, [currentTag, debouncedSearch, enterpriseSizeFilter, streetFilter, tagFilter]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchEnterprises(currentPage + 1);
    setLoading(false);
  }, [loading, hasMore, currentPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEnterprises(1, true);
    setRefreshing(false);
  }, []);


  return (
    <div className="se-container">
      {/* ===== 头部 ===== */}
      <PageHeader title={`${sceneName}场景`}>
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
          {apiLoading ? (
            // 加载中状态
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={`se-stat-card${index === 0 ? ' se-stat-card--primary' : ''}`}>
                <div className="se-stat-label">{index === 0 ? '全部' : ['核心企业', '重点企业', '潜力企业', '后备企业'][index - 1]}</div>
                <div className="se-stat-value">加载中...</div>
              </div>
            ))
          ) : enterpriseTags.length > 0 ? (
            // 使用 API 数据
            enterpriseTags.map((item, index) => (
              <div
                key={index}
                className={`se-stat-card ${currentTag.firstTagId === item.firstTagId ? ' se-stat-card--primary' : ''}`}
                onClick={() => {
                  setCurrentTag({ firstTag: item.firstTag, firstTagId: item.firstTagId });
                  // 清空筛选条件
                  setStreetFilter([]);
                  setEnterpriseSizeFilter([]);
                  setTagFilter([]);
                  setActiveFilter(null);
                }}
              >
                <div className={`se-stat-label${index > 0 ? ' se-stat-label--with-icon' : ''}`}>
                  {item.firstTag}
                  {item.tooltip && (
                    <button
                      className="se-stat-info-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCriteriaPopup(item);
                      }}
                      aria-label={`${item.firstTag || ['核心企业', '重点企业', '潜力企业', '后备企业'][index - 1]}统计标准`}
                    >
                      <img src={iconStatInfo} alt="" width={10} height={10} style={{ filter: currentTag.firstTagId === item.firstTagId ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(17%) sepia(89%) saturate(2710%) hue-rotate(217deg) brightness(98%) contrast(100%)' }} />
                    </button>
                  )}
                </div>
                <div className="se-stat-value">{item.enterpriseCount || 0}</div>
              </div>
            ))
          ) : <></>
          }
        </div>
      </PageHeader>

      {/* ===== 主体区域 ===== */}
      <div className="se-body">
        {apiLoading ? (
          // 加载中状态
          <div className="se-loading-container">
            <div className="se-loading-spinner"></div>
            <div className="se-loading-text">加载中...</div>
          </div>
        ) : (
          <>
            {/* 场景动态 + 筛选区域 */}
            <div className="se-dynamic-filter-area">
              {/* 场景动态横幅 */}
              {/* <div className="se-scene-dynamic" onClick={() => navigate('/scene-enterprise-dynamic')} style={{ cursor: 'pointer' }}>
                <div className="se-dynamic-left">
                  <img src={iconSceneDynamic} alt="场景动态" className="se-dynamic-icon" />
                  <span className="se-dynamic-title">场景动态</span>
                </div>
                <span className="se-dynamic-desc">您有5条新的场景动态，请查阅！</span>
                <span className="se-dynamic-arrow">→</span>
              </div> */}

              {/* 筛选器行 */}
              <div className="se-filter-row">
                <FilterButton
                  label="所属街道"
                  active={activeFilter === 'street' || streetFilter.length > 0}
                  count={streetFilter.length}
                  onClick={() => setActiveFilter(activeFilter === 'street' ? null : 'street')}
                />
                <FilterButton
                  label="企业规模"
                  active={activeFilter === 'enterpriseSize' || enterpriseSizeFilter.length > 0}
                  count={enterpriseSizeFilter.length}
                  onClick={() => setActiveFilter(activeFilter === 'enterpriseSize' ? null : 'enterpriseSize')}
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
          </>
        )}
      </div>

      {/* ===== 筛选底部弹框 ===== */}
      <FilterSheet
        title="所属街道"
        options={STREETS}
        value={streetFilter}
        onChange={setStreetFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'street'}
        multiple={false}
      />
      <FilterSheet
        title="企业规模"
        options={ENTERPRISE_SIZES}
        value={enterpriseSizeFilter}
        onChange={setEnterpriseSizeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'enterpriseSize'}
        multiple={false}
      />
      <FilterSheet
        title="重点标签"
        options={enterpriseSecondTags.map(tag => tag.secondTag)}
        value={tagFilter}
        onChange={setTagFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'tag'}
        multiple={false}
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
              {typeof criteriaPopup.tooltip === 'string' && criteriaPopup.tooltip.includes('<div') ? (
                // 显示 tooltip 内容
                <div dangerouslySetInnerHTML={{ __html: criteriaPopup.tooltip }} />
              ) : (
                // 显示默认统计标准
                <>
                  <div className="se-criteria-title">{`${criteriaPopup?.firstTag}（分类标准）`}</div>
                  <div className="se-criteria-text">{criteriaPopup?.tooltip || ''}</div>
                </>
              )}
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

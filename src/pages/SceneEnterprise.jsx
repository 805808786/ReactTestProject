import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import DateSelection from './components/dataSelection/index';
import PageHeader from '../components/PageHeader';
import { selectEnterpriseFirstTag, searchEnterpriseByTag, selectEnterpriseSecondTag, getDataCountInfo } from '../api/enterprise';
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
  const navigate = useNavigate();
  const {
    enterpriseName,
    enterpriseLogo,
    tags,
    categoryName,
    isFirst,
    unifiedCreditCode,
    legalRepresentative,
    registeredCapital,
    establishmentDate,
    businessStatus,
    registeredAddress
  } = enterprise;
  // 从 tags 数组中提取 tagName
  const tagNames = tags ? tags.map(tag => tag.tagName) : [];
  const visibleTags = tagNames.slice(0, 2);
  const extraCount = tagNames.length - 2;

  const isActive = businessStatus === '存续' || businessStatus === '在业';

  return (
    <div key={enterprise.enterpriseId} className={`se-card`} >
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
        <span className="se-view-detail" onClick={() => navigate(`/company-detail/${enterprise.enterpriseId}`)}>查看详情 →</span>
      </div>

      {/* 详情信息 */}
      <div className="se-card-detail">
        {/* 统一社会信用代码 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">统一社会信用代码：</span>
            <span className="se-info-value">{unifiedCreditCode || '-'}</span>
          </div>
        </div>
        {/* 法定代表人 + 注册资本 */}
        <div className="se-info-row">
          <div className="se-info-item">
            <span className="se-info-label">法定代表人：</span>
            <span className="se-info-value">{legalRepresentative || '-'}</span>
          </div>
          <div className="se-info-item">
            <span className="se-info-label">注册资本：</span>
            <span className="se-info-value">{registeredCapital || '-'}</span>
          </div>
        </div>
        {/* 注册日期 + 经营状态 */}
        <div className="se-info-row">
          <div className="se-info-item">
            <span className="se-info-label">注册日期：</span>
            <span className="se-info-value">{establishmentDate || '-'}</span>
          </div>
          <div className="se-info-item">
            <span className="se-info-label">经营状态：</span>
            <span className={`se-info-value se-status${isActive ? ' se-status--active' : (businessStatus ? ' se-status--closed' : '')}`}>
              {businessStatus || '-'}
            </span>
          </div>
        </div>
        {/* 企业地址 */}
        <div className="se-info-row">
          <div className="se-info-item se-info-item--wide">
            <span className="se-info-label">企业地址：</span>
            <span className="se-info-value se-address">{registeredAddress || '-'}</span>
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
  const [dateInfoData, setDateInfoData] = useState(null);

  useEffect(() => {
    const fetchDateInfo = async () => {
      const todayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const queryDate = pendingDate || confirmedDate || todayStr;
      try {
        const response = await getDataCountInfo({ selectDate: queryDate, sceneName });
        if (response && response.data) {
          setDateInfoData(response.data);
        } else {
          setDateInfoData(null);
        }
      } catch (error) {
        console.error('Error fetching date info:', error);
        setDateInfoData(null);
      }
    };
    fetchDateInfo();
  }, [pendingDate, confirmedDate, sceneName]);

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
  const [hasMore, setHasMore] = useState(false); // 初始为 false，防止 InfiniteList 首次挂载时误触发上拉加载
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 内容区域滚动位置
  const contentRef = useRef(null);

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
      setLoading(true);
      setDisplayedItems([]); // 清空当前列表，确保 InfiniteList 能显示并置顶 Loading 状态
      setHasMore(false); // 重置 hasMore，防止 InfiniteList 误触到底部加载
      // 滚动到顶部
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
        // 同时重置 InfiniteList 的滚动容器
        const ilContainer = contentRef.current.querySelector('.il-container');
        if (ilContainer) {
          ilContainer.scrollTop = 0;
        }
      }
      fetchEnterprises(1, true).finally(() => {
        setLoading(false);
      });
    }
  }, [currentTag, debouncedSearch, enterpriseSizeFilter, streetFilter, tagFilter, fetchEnterprises]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchEnterprises(currentPage + 1);
    setLoading(false);
  }, [loading, hasMore, currentPage, fetchEnterprises]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEnterprises(1, true);
    setRefreshing(false);
  }, [fetchEnterprises]);

  console.log(dateInfoData)

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
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`se-stat-card${index === 0 ? ' se-stat-card--primary' : ''}`}>
                <div className="se-stat-label">{index === 0 ? '全部' : ['核心企业', '重点企业', '潜力企业'][index - 1]}</div>
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
      <div className="se-body" ref={contentRef}>
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
            {dateInfoData && (
              <div className="se-cal-info">
                {/* 头部：已选择日期 + 企业总数 */}
                <div>
                  <div className="se-cal-header-row">
                    <div className="se-cal-header-left">
                      <span className="se-cal-header-label">已选择</span>
                    </div>
                    <div className="se-cal-header-right">
                      <span className="se-cal-header-label">企业总数</span>
                    </div>
                  </div>
                  <div className="se-cal-header-row">
                    <div className="se-cal-header-left">
                      <span className="se-cal-header-date">{dateInfoData.dateStr || formatDateDisplay(pendingDate)}</span>
                    </div>
                    <div className="se-cal-header-right">
                      <span className="se-cal-header-total">{dateInfoData.count}</span>
                      <span className="se-cal-header-delta" style={{ color: dateInfoData.differenceType == 'positive' ? '#0AA34E' : '#52C41A' }}>
                        {dateInfoData.difference}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 变化原因 */}
                {dateInfoData.changeReason && dateInfoData.changeReason.length > 0 && (
                  <div className="se-cal-section">
                    <div className="se-cal-section-title se-cal-section-title--orange">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2691 7.37285C13.2691 8.93716 12.6477 10.4374 11.5416 11.5435C10.4354 12.6497 8.93521 13.2711 7.3709 13.2711C5.80659 13.2711 4.30635 12.6497 3.20021 11.5435C2.09408 10.4374 1.47266 8.93716 1.47266 7.37285C1.47266 5.80854 2.09408 4.3083 3.20021 3.20216C4.30635 2.09603 5.80659 1.47461 7.3709 1.47461C8.93521 1.47461 10.4354 2.09603 11.5416 3.20216C12.6477 4.3083 13.2691 5.80854 13.2691 7.37285ZM8.10818 4.42373C8.10818 4.61927 8.0305 4.8068 7.89223 4.94506C7.75396 5.08333 7.56643 5.16101 7.3709 5.16101C7.17536 5.16101 6.98783 5.08333 6.84956 4.94506C6.71129 4.8068 6.63362 4.61927 6.63362 4.42373C6.63362 4.22819 6.71129 4.04066 6.84956 3.90239C6.98783 3.76413 7.17536 3.68645 7.3709 3.68645C7.56643 3.68645 7.75396 3.76413 7.89223 3.90239C8.0305 4.04066 8.10818 4.22819 8.10818 4.42373ZM6.63362 6.63557C6.43808 6.63557 6.25055 6.71325 6.11228 6.85151C5.97401 6.98978 5.89634 7.17731 5.89634 7.37285C5.89634 7.56839 5.97401 7.75592 6.11228 7.89418C6.25055 8.03245 6.43808 8.11013 6.63362 8.11013V10.322C6.63362 10.5175 6.71129 10.705 6.84956 10.8433C6.98783 10.9816 7.17536 11.0592 7.3709 11.0592H8.10818C8.30371 11.0592 8.49124 10.9816 8.62951 10.8433C8.76778 10.705 8.84546 10.5175 8.84546 10.322C8.84546 10.1264 8.76778 9.9389 8.62951 9.80063C8.49124 9.66237 8.30371 9.58469 8.10818 9.58469V7.37285C8.10818 7.17731 8.0305 6.98978 7.89223 6.85151C7.75396 6.71325 7.56643 6.63557 7.3709 6.63557H6.63362Z" fill="#FF6900" />
                      </svg>
                      <span>变化原因</span>
                    </div>
                    <div className="se-cal-section-desc">
                      <div>{dateInfoData.changeReason}</div>
                    </div>
                  </div>
                )}

                {/* 标签变化 */}
                {dateInfoData.tagChangeList && dateInfoData.tagChangeList.length > 0 && (
                  <div className="se-cal-section">
                    <div className="se-cal-section-title se-cal-section-title--purple">
                      <div className="se-cal-title-left">
                        <svg className="se-cal-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.36-.36.59-.86.59-1.41s-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                        </svg>
                        <span>标签变化</span>
                      </div>
                      <div className="se-cal-title-right">{dateInfoData.tagChangeCount || dateInfoData.tagChangeList.length} 项</div>
                    </div>

                    <div className="se-cal-tag-list">
                      {dateInfoData.tagChangeList.map((tag, idx) => (
                        <div className="se-cal-tag-item" key={idx}>
                          <span className={`se-cal-badge ${tag.dataType === '新增' ? 'se-cal-badge--green' : 'se-cal-badge--blue'}`}>
                            {tag.dataType}
                          </span>
                          <span className="se-cal-tag-text">{tag.tagName} · {tag.tagDefinition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

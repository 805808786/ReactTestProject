import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import InfiniteList from './components/InfiniteList';
import FilterSheet from './components/FilterSheet';
import DateSelection from './components/dataSelection/index';
import { listEnterpriseModules } from '../api/enterprise';
import './KeyEnterprises.css';
import './SceneEnterprise.css';

const ITEM_TYPES = ['服务动态', '新闻动态', '企业挖掘'];
const ITEM_TYPE_MAP = { '服务动态': 1, '新闻动态': 2, '企业挖掘': 5 };
const TASK_STATUS_MAP = { 0: '待开始', 1: '办理中', 2: '已完成' };
const TASK_STATUS_CLASS = { 0: 'pending', 1: 'processing', 2: 'done' };
const REGION_TITLE = { 1: '区内企业', 2: '区外企业' };

function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`se-filter-btn${active ? " se-filter-btn--active" : ""}`}
      onClick={onClick}
    >
      <span>
        {label}
        {count > 0 ? `(${count})` : ""}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9" />
      </svg>
    </button>
  );
}

export default function KeyEnterprises() {
  const { regionType } = useParams();
  const navigate = useNavigate();
  const rt = Number(regionType) || 1;

  const [typeFilter, setTypeFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);

  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contentRef = useRef(null);
  const filtersRef = useRef({ typeFilter: [], confirmedDate: null });

  useEffect(() => {
    filtersRef.current = { typeFilter, confirmedDate };
  }, [typeFilter, confirmedDate]);

  const fetchData = useCallback(async (page = 1, isRefresh = false) => {
    const { typeFilter: tf, confirmedDate: cd } = filtersRef.current;
    const itemType = tf.length > 0 ? ITEM_TYPE_MAP[tf[0]] : undefined;

    try {
      const res = await listEnterpriseModules({
        regionType: rt,
        itemType,
        startDate: cd || undefined,
        endDate: cd || undefined,
        currentPage: page,
        pageSize: 10,
      });

      const items = res.data?.data || [];
      const total = res.data?.total || 0;

      setDisplayedItems((prev) => {
        const updated = isRefresh ? items : [...prev, ...items];
        setHasMore(updated.length < total);
        return updated;
      });
      setCurrentPage(page);
    } catch (err) {
      console.error('获取重点企业列表失败:', err);
      if (isRefresh) {
        setDisplayedItems([]);
      }
    }
  }, [rt]);

  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    setDisplayedItems([]);
    setHasMore(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    fetchData(1, true).finally(() => setLoading(false));
  }, [typeFilter, confirmedDate, fetchData]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchData(currentPage + 1);
    setLoading(false);
  }, [loading, hasMore, currentPage, fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(1, true);
    setRefreshing(false);
  }, [fetchData]);

  const handleCalendarOpen = () => {
    setPendingDate(confirmedDate);
    setCalendarOpen(true);
    setActiveFilter(null);
  };
  const handleCalendarClose = () => setCalendarOpen(false);
  const handleCalendarReset = () => setPendingDate(null);
  const handleCalendarConfirm = () => {
    setConfirmedDate(pendingDate);
    setCalendarOpen(false);
  };

  const typeLabel = typeFilter.length > 0 ? typeFilter[0] : '类型';
  const dateLabel = confirmedDate ? confirmedDate.replace(/-/g, '年').replace(/年(\d+)$/, '月$1日').replace(/^(\d{4})年/, '$1年') : '日期';

  const renderItem = (item) => {
    if (item.itemType === 2) {
      return <NewsCard key={`news-${item.newsContentId}-${item.enterpriseId}`} item={item} navigate={navigate} />;
    }
    else if (item.itemType === 5) {
      return <EnterpriseMiningCard key={`emining-${item.enterpriseId}`} item={item} navigate={navigate} />;
    }
    return <ServiceCard key={`svc-${item.recommendId}-${item.enterpriseId}`} item={item} navigate={navigate} />;
  };

  return (
    <div className="ke-page">
      <PageHeader title={REGION_TITLE[rt] || '重点服务企业'} onBack={() => navigate(-1)} />

      <div className="ke-body" ref={contentRef}>
        <div className="ke-filter-area">
          <div className="se-filter-row">
            <FilterButton
              label={typeLabel}
              active={activeFilter === 'type' || typeFilter.length > 0}
              count={typeFilter.length}
              onClick={() => setActiveFilter(activeFilter === 'type' ? null : 'type')}
            />
            <FilterButton
              label={dateLabel}
              active={activeFilter === 'date' || !!confirmedDate}
              onClick={handleCalendarOpen}
            />
          </div>
        </div>

        <InfiniteList
          items={displayedItems}
          renderItem={renderItem}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
        />
      </div>

      <FilterSheet
        title="类型"
        options={ITEM_TYPES}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'type'}
        multiple={false}
      />

      {calendarOpen && (
        <div className="dm-cal-overlay" onClick={handleCalendarClose}>
          <div className="dm-cal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="dm-cal-handle" />
            <div className="dm-cal-header">
              <span className="dm-cal-title">日期</span>
              <button className="dm-cal-reset-btn" onClick={handleCalendarReset}>
                重置
              </button>
            </div>
            <DateSelection
              dateDisabledType="afterToday"
              onSelect={(date) => setPendingDate(date)}
              defaultValue={pendingDate}
            />
            <div className="dm-cal-footer">
              <button className="dm-cal-btn dm-cal-btn--cancel" onClick={handleCalendarClose}>
                取消
              </button>
              <button className="dm-cal-btn dm-cal-btn--confirm" onClick={handleCalendarConfirm}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== 服务动态卡片 ===== */
function ServiceCard({ item, navigate }) {
  return (
    <div className="ke-svc-card">
      <div className="ke-svc-top">
        <div className="ke-svc-top-left">
          <span className={`ke-svc-badge ke-svc-badge--svc`}>服务动态</span>
          <span className="ke-svc-enterprise-name">{item.enterpriseName}</span>
          <span className="ke-svc-link" onClick={() => navigate(`/company-detail/${item.enterpriseId}`)}>
            查看企业 →
          </span>
        </div>
      </div>
      <div className="ke-svc-info">
        <span className={`ke-svc-status ke-svc-status--${TASK_STATUS_CLASS[item.taskStatus] || 'pending'}`}>
          {TASK_STATUS_MAP[item.taskStatus] || '待开始'}
        </span>
        {item.leadOrgName && <span className="ke-svc-org">{item.leadOrgName}</span>}
      </div>
      {item.feedbackResult && (
        <div className="ke-svc-box">
          <p className="ke-svc-box-text">
            <span className="ke-svc-box-label">反馈结果：</span>
            {item.feedbackResult}
          </p>
          {item.feedbackDate && (<p className="ke-svc-feedback-date">反馈日期：{item.feedbackDate}</p>
          )}
        </div>
      )}
      {item.recommendId && (
        <div className="ke-svc-detail-row" onClick={() => navigate(`/daily-message-detail/${item.recommendId}`)}>
          {!item.isRead && <span className="ke-news-dot" />}
          <span className="ke-svc-detail-text">查看任务详情</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#003cab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ===== 新闻动态卡片 ===== */
function NewsCard({ item, navigate }) {
  return (
    <div className="ke-news-card">
      <div className="ke-news-top">
        <span className="ke-svc-badge ke-svc-badge--news">新闻动态</span>
        <div className="ke-news-top-right" onClick={() => navigate(`/scene-enterprise-dynamic-detail/${item.newsContentId}`)}>
          {/* {!item.isRead && <span className="ke-news-dot" />} */}
          <span className="ke-news-link">查看详情 →</span>
        </div>
      </div>
      <div className="ke-news-title">
        <span className="ke-news-dot-green" />
        <span className="ke-news-title-text">{item.articleTitle || ''}</span>
      </div>
      {item.contentSummary && (
        <div className="ke-news-summary">
          <span className="ke-news-summary-label">摘要: </span>
          <span className="ke-news-summary-text">{item.contentSummary}</span>
        </div>
      )}
      <div className="ke-news-footer">
        <span className="ke-news-date">{item.publishDate || item.sortDate || ''}</span>
      </div>
    </div>
  );
}


/* ===== 企业挖掘卡片 ===== */
function EnterpriseMiningCard({ item, navigate }) {
  return (
    <div className="ke-news-card">
      <div className="ke-news-top">
        <span className="ke-svc-badge ke-svc-badge--dig">企业挖掘</span>
        <div className="ke-news-top-right" onClick={() => navigate(`/daily-message-detail/${item.recommendId}`)}>
          {!item.isRead && <span className="ke-news-dot" />}
          <span className="ke-news-link">查看详情 →</span>
        </div>
      </div>
      <div className="ke-news-title">
        <span className="ke-news-dot-red" />
        <span className="ke-news-title-text">{item.title || ''}</span>
      </div>
      {item.remark && (
        <div className="ke-news-summary">
          <span className="ke-news-summary-label">摘要: </span>
          <span className="ke-news-summary-text">{item.remark}</span>
        </div>
      )}
      <div className="ke-news-footer">
        <span className="ke-news-date">{item.publishDate || item.sortDate || ''}</span>
      </div>
    </div>
  );
}
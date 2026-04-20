import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import InfiniteList from './components/InfiniteList';
import FilterSheet from './components/FilterSheet';
import DateSelection from './components/dataSelection/index';
import { listProcessTaskByDeptAndDate, listProcessTaskDepts } from '../api/enterprise';
import './ServiceDepartment.css';

const TASK_STATUS_MAP = { 0: '待开始', 1: '办理中', 2: '已完成' };
const TASK_STATUS_CLASS = { 0: 'pending', 1: 'processing', 2: 'done' };

function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`se-filter-btn${active ? ' se-filter-btn--active' : ''}`}
      onClick={onClick}
    >
      <span>
        {label}
        {count > 0 ? `(${count})` : ''}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9" />
      </svg>
    </button>
  );
}

function TaskCard({ item, navigate }) {
  return (
    <div className="sd-card">
      <div className="sd-card-header">
        <span className="sd-dept-name">{item.leadOrgName}</span>
        <span className={`sd-status sd-status--${TASK_STATUS_CLASS[item.status] || 'pending'}`}>
          {TASK_STATUS_MAP[item.status] || '待开始'}
        </span>
      </div>

      <div className="sd-enterprise-row">
        <span className="sd-badge-svc">服务企业</span>
        <span className="sd-enterprise-name">{item.serviceTargetName}</span>
        <span className="sd-link" onClick={() => navigate(`/company-detail/${item.enterpriseId}`)}>
          查看企业 →
        </span>
      </div>

      {item.taskContent && (
        <div className="sd-box">
          <p className="sd-box-text">
            <span className="sd-box-label">任务目标：</span>
            {item.taskContent}
          </p>
        </div>
      )}

      {item.feedbackResult && (
        <div className="sd-box">
          <p className="sd-box-text">
            <span className="sd-box-label">反馈结果：</span>
            {item.feedbackResult}
          </p>
          {item.feedbackDate && (
            <p className="sd-feedback-date">反馈日期：{formatDate(item.feedbackDate)}</p>
          )}
        </div>
      )}

      <div
        className="sd-detail-row"
        onClick={() => navigate(`/daily-message-detail/${item.recommendId}?processId=${item.processId}`)}
      >
        <span className="sd-detail-text">查看任务详情</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#003cab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
  }
  return dateStr;
}

export default function ServiceDepartment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialOrgId = searchParams.get('leadOrgId');

  const [deptOptions, setDeptOptions] = useState([]);
  const [deptFilter, setDeptFilter] = useState([]);
  const activeFilterInit = useRef(true);
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
  const filtersRef = useRef({ leadOrgId: undefined, confirmedDate: null });

  useEffect(() => {
    listProcessTaskDepts()
      .then((res) => {
        const options = res.data || [];
        setDeptOptions(options);
        if (initialOrgId && activeFilterInit.current) {
          const matched = options.find((d) => String(d.leadOrgId) === String(initialOrgId));
          if (matched) {
            setDeptFilter([matched.leadOrgName]);
          }
          activeFilterInit.current = false;
        }
      })
      .catch((err) => {
        console.error('获取部门列表失败:', err);
      });
  }, []);

  const deptNameToId = useCallback((name) => {
    const dept = deptOptions.find((d) => d.leadOrgName === name);
    return dept ? dept.leadOrgId : undefined;
  }, [deptOptions]);

  useEffect(() => {
    const orgId = deptFilter.length > 0 ? deptNameToId(deptFilter[0]) : undefined;
    filtersRef.current = { leadOrgId: orgId, confirmedDate };
  }, [deptFilter, confirmedDate, deptNameToId]);

  const fetchData = useCallback(async (page = 1, isRefresh = false) => {
    const { leadOrgId, confirmedDate: cd } = filtersRef.current;
    try {
      const res = await listProcessTaskByDeptAndDate({
        leadOrgId,
        date: cd || undefined,
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
      console.error('获取部门任务列表失败:', err);
      if (isRefresh) {
        setDisplayedItems([]);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    setDisplayedItems([]);
    setHasMore(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    fetchData(1, true).finally(() => setLoading(false));
  }, [deptFilter, confirmedDate, fetchData]);

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

  const deptLabel = deptFilter.length > 0 ? deptFilter[0] : '部门';
  const dateLabel = confirmedDate
    ? `${confirmedDate.replace(/-/g, '/').replace(/^(\d{4})\//, '$1年').replace(/(\d{2})$/, '$1日').replace(/年(\d{2})\//, '年$1月').replace(/月(\d{2})日/, '月$1日')}`
    : '时间';

  return (
    <div className="sd-page">
      <PageHeader title="企业服务部门" onBack={() => navigate(-1)} />

      <div className="sd-body" ref={contentRef}>
        <div className="sd-filter-area">
          <div className="se-filter-row">
            <FilterButton
              label={deptLabel}
              active={activeFilter === 'dept' || deptFilter.length > 0}
              count={deptFilter.length}
              onClick={() => setActiveFilter(activeFilter === 'dept' ? null : 'dept')}
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
          renderItem={(item) => (
            <TaskCard key={item.id} item={item} navigate={navigate} />
          )}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
        />
      </div>

      <FilterSheet
        title="部门"
        options={deptOptions.map((d) => d.leadOrgName)}
        value={deptFilter}
        onChange={setDeptFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'dept'}
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

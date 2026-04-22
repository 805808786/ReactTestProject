import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import FilterSheet from './components/FilterSheet';
import DateSelection from './components/dataSelection/index';
import { listProcessTaskDeptGroupByDate, listProcessTaskDepts } from '../api/enterprise';
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

function DeptCard({ group, navigate }) {
  const { deptName, taskCount, tasks } = group;
  return (
    <div className="sd-card">
      <div className="sd-card-header">
        <div className="sd-dept-badge">{deptName}</div>
        <div className="sd-count-badge">{taskCount}项</div>
      </div>
      <div className="sd-divider" />
      <div className="sd-tasks">
        {tasks.map((task, idx) => (
          <div key={task.id ?? idx}>
            {idx > 0 && <div className="sd-item-divider" />}
            <div
              className="sd-task-item"
              onClick={() => navigate(`/daily-message-detail/${task.recommendId}?processId=${task.processId}`)}
            >
              <div className="sd-task-row">
                <span className="sd-enterprise-name">{task.serviceTargetName}</span>
                <span className={`sd-status sd-status--${TASK_STATUS_CLASS[task.status] ?? 'pending'}`}>
                  {TASK_STATUS_MAP[task.status] ?? '待开始'}
                </span>
              </div>
              {task.taskContent && (
                <p className="sd-task-content">{task.taskContent}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
  const [loading, setLoading] = useState(false);
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

  const fetchData = useCallback(async () => {
    const { leadOrgId, confirmedDate: cd } = filtersRef.current;
    try {
      const res = await listProcessTaskDeptGroupByDate({
        leadOrgId,
        date: cd || undefined,
      });
      setDisplayedItems(res.data || []);
    } catch (err) {
      console.error('获取部门任务列表失败:', err);
      setDisplayedItems([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setDisplayedItems([]);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    fetchData().finally(() => setLoading(false));
  }, [deptFilter, confirmedDate, fetchData]);

  const groupedItems = useMemo(() => {
    return displayedItems.map((item) => ({
      id: item.leadOrgId || item.leadOrgName,
      deptName: item.leadOrgName,
      taskCount: item.taskCount,
      tasks: item.taskList || [],
    }));
  }, [displayedItems]);

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

        {!loading && groupedItems.length === 0 ? (
          <div className="sd-empty">暂无数据</div>
        ) : (
          <div className="sd-list">
            {groupedItems.map((group) => (
              <DeptCard key={group.id} group={group} navigate={navigate} />
            ))}
          </div>
        )}
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

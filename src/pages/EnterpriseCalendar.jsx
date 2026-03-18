import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './EnterpriseCalendar.css';
import DateSelection from './components/dataSelection/index';
import useEnterpriseCalendarStore from '../store/enterpriseCalendarStore';

// 生成近半年的每日企业数量数据（130,000 ~ 140,000 范围）
function generateData(days) {
  const data = [];
  const today = new Date('2026-03-05');
  let val = 135000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    const monthLabel = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    val = Math.min(140000, Math.max(130000, val + (Math.sin(i * 0.22) * 1200 + Math.cos(i * 0.11) * 800)));
    data.push({ date: d, label, monthLabel, value: Math.round(val) });
  }
  return data;
}

const halfYearData = generateData(180);
const oneMonthData = generateData(30);

// 时间轴列表数据
const timelineItems = [
  {
    date: '2026年3月5号',
    totalCount: '139,754家',
    countDelta: '-13家',
    deltaPositive: false,
    reasons: [
      { text: '工商信息新注册', delta: '+15家', deltaPositive: true },
      { text: '工商信息新注销企业变化', delta: '-15家', deltaPositive: false },
      { text: '商务社区走访新入驻企业', delta: '+12家', deltaPositive: true },
    ],
    tagChanges: [], // 已废弃
  },
  {
    date: '2026年3月4号',
    totalCount: '139,767家',
    countDelta: '-13家',
    deltaPositive: false,
    reasons: [
      { text: '工商信息新注册', delta: '+10家', deltaPositive: true },
      { text: '工商信息新注销', delta: '-23家', deltaPositive: false },
      { text: '商务社区走访新入驻企业', delta: '+8家', deltaPositive: true },
    ],
    tagChanges: [], // 已废弃
  },
  {
    date: '2026年3月1号',
    totalCount: '139,780家',
    countDelta: '+23家',
    deltaPositive: true,
    reasons: [
      { text: '工商信息新注册/新注销企业变化', delta: '+23家', deltaPositive: true },
    ],
    tagChanges: [], // 已废弃
  },
  {
    date: '2026年2月28号',
    totalCount: '139,757家',
    countDelta: '+31家',
    deltaPositive: true,
    reasons: [
      { text: '工商信息新注册/新注销企业变化', delta: '+25家', deltaPositive: true },
      { text: '商务社区走访新入驻企业', delta: '+6家', deltaPositive: true },
    ],
    tagChanges: [], // 已废弃
  },
  {
    date: '2026年2月25号',
    totalCount: '139,726家',
    countDelta: '-8家',
    deltaPositive: false,
    reasons: [
      { text: '工商信息企业注销', delta: '-8家', deltaPositive: false },
    ],
    tagChanges: [], // 已废弃
  },
];

// 将 'YYYY-MM-DD' 转为友好显示格式
function formatDateDisplay(str) {
  if (!str) return '企业日历';
  const [y, m, d] = str.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

// 计算默认日期（对于 afterTodayAndToday 类型，默认选昨天）
function getDefaultPickerDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 格式化企业数量显示
function formatEnterpriseCount(value) {
  return `${Number(value).toLocaleString()}家`;
}

export default function EnterpriseCalendar() {
  const navigate = useNavigate();
  const [range, setRange] = useState('half'); // 'month' | 'half'
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(300);
  // 日历弹框
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(null); // 弹框内临时选中
  const [confirmedDate, setConfirmedDate] = useState(null); // 已确认日期

  // 使用独立选择器订阅 Store，确保响应式更新更稳定
  const changeDateData = useEnterpriseCalendarStore(state => state.changeDateData);
  const loading = useEnterpriseCalendarStore(state => state.loading);
  const fetchByChangeDate = useEnterpriseCalendarStore(state => state.fetchByChangeDate);
  const trendData = useEnterpriseCalendarStore(state => state.trendData);
  const fetchTrendData = useEnterpriseCalendarStore(state => state.fetchTrendData);
  const timelineListData = useEnterpriseCalendarStore(state => state.timelineListData);
  const timelineLoading = useEnterpriseCalendarStore(state => state.timelineLoading);
  const hasMoreTimeline = useEnterpriseCalendarStore(state => state.hasMoreTimeline);
  const fetchTimelineList = useEnterpriseCalendarStore(state => state.fetchTimelineList);
  const loadMoreTimeline = useEnterpriseCalendarStore(state => state.loadMoreTimeline);

  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth || 300);
    }

    // 首次进入加载默认日期（昨天）的数据
    const defaultDate = confirmedDate || getDefaultPickerDate();
    setConfirmedDate(defaultDate);
    fetchByChangeDate(defaultDate);
  }, []);

  // 趋势图数据拉取
  useEffect(() => {
    const end = confirmedDate || getDefaultPickerDate();
    const startDate = new Date(end);
    if (range === 'month') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setDate(startDate.getDate() - 180);
    }
    const start = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    setStartDateStr(start);
    setEndDateStr(end);

    fetchTrendData(start, end);
    // 初始加载分页列表
    fetchTimelineList(start, end);
  }, [range, confirmedDate]);

  // 分页监控：滚动到底部自动加载
  useEffect(() => {
    const handleScroll = () => {
      if (timelineLoading || !hasMoreTimeline) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // 距离底部 50px 时加载
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMoreTimeline(startDateStr, endDateStr);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [timelineLoading, hasMoreTimeline, startDateStr, endDateStr, loadMoreTimeline]);

  // 打开日期弹框时，确保有默认选中日期并拉取数据
  const handleOpenSheet = () => {
    const defaultDate = confirmedDate || getDefaultPickerDate();
    setPendingDate(defaultDate);
    fetchByChangeDate(defaultDate);
    setSheetOpen(true);
  };

  // 选择日期时触发接口请求
  const handleDateSelect = (date) => {
    setPendingDate(date);
    fetchByChangeDate(date);
  };


  // 格式化并排序趋势数据
  const displayData = (trendData || [])
    .filter(item => item && item.time)
    .map(item => ({
      date: new Date(item.time),
      label: item.time.replace(/-/g, '/'),
      monthLabel: item.time.substring(0, 7).replace(/-/g, '/'),
      value: Number(item.num || 0)
    })).sort((a, b) => a.date - b.date);

  if (displayData.length === 0) {
    // 降级显示空状态或默认点
  }

  const chartH = 74;
  const values = displayData.map(d => d.value);
  // 强制 Y 轴从 0 开始，并给顶部留出边距
  const minVal = 0;
  const rawMaxVal = values.length > 0 ? Math.max(...values) : 140000;
  const margin = rawMaxVal * 0.15 || 5000; // 给顶部留 15% 空间
  const maxVal = Math.ceil((rawMaxVal + margin) / 1000) * 1000;
  const valRange = maxVal - minVal;

  const pts = displayData.map((d, i) => {
    const x = displayData.length > 1 ? (i / (displayData.length - 1)) * chartWidth : 0;
    const y = chartH - ((d.value - minVal) / valRange) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polylinePoints = pts.join(' ');

  // X轴刻度（均匀4个）
  const xLabels = [];
  if (displayData.length > 0) {
    const count = displayData.length;
    const labelIndices = [0, Math.floor(count / 3), Math.floor(2 * count / 3), count - 1];
    labelIndices.forEach(idx => {
      const x = displayData.length > 1 ? (idx / (displayData.length - 1)) * chartWidth : 0;
      xLabels.push({ x, label: displayData[idx].monthLabel });
    });
  }

  // Y轴刻度（从大到小）
  const yAxisTicks = [];
  for (let i = 0; i <= 5; i++) {
    const val = maxVal - (i / 5) * valRange;
    yAxisTicks.push(Math.round(val).toLocaleString());
  }

  return (
    <div className="ec-container">
      {/* Header */}
      <div className="ec-header">
        <div className="ec-header-top">
          <button className="ec-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="ec-header-title">日历视图</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="ec-content">

        {/* Tabs 选项卡 */}
        <div className="ec-tabs">
          <div className="ec-tab ec-tab--active">
            企业日历
            <div className="ec-tab-track" />
          </div>
          <div className="ec-tab" onClick={() => navigate('/scene-calendar')}>场景日历</div>
          <div className="ec-tab" onClick={() => navigate('/tag-calendar')}>标签日历</div>
        </div>

        {/* 企业日历标题区（可点击打开日历弹框） */}
        <div className="ec-title-card" onClick={handleOpenSheet} style={{ cursor: 'pointer' }}>
          <span className="ec-title-text">{confirmedDate ? formatDateDisplay(confirmedDate) : '企业日历'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9" />
          </svg>
        </div>

        {/* 企业变化趋势卡片 */}
        <div className="ec-trend-card">
          <div className="ec-trend-header">
            <div className="ec-trend-left">
              <span className="ec-trend-dot" />
              <span className="ec-trend-title">企业变化趋势</span>
            </div>
            <div className="ec-trend-range">
              <button
                className={`ec-range-btn${range === 'month' ? ' ec-range-btn--active' : ''}`}
                onClick={() => setRange('month')}
              >
                近一个月
              </button>
              <button
                className={`ec-range-btn${range === 'half' ? ' ec-range-btn--active' : ''}`}
                onClick={() => setRange('half')}
              >
                近半年
              </button>
            </div>
          </div>

          {/* 折线图 */}
          <div className="ec-chart-wrap">
            <div className="ec-y-axis">
              {yAxisTicks.map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <div className="ec-chart-body" ref={chartRef}>
              <svg
                width="100%"
                height={chartH}
                viewBox={`0 0 ${chartWidth} ${chartH}`}
                preserveAspectRatio="none"
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="0" y1={(i / 5) * chartH}
                    x2={chartWidth} y2={(i / 5) * chartH}
                    stroke="rgba(203,203,203,0.1)"
                    strokeWidth="1"
                  />
                ))}
                <polyline fill="none" stroke="#3CB1FB" strokeWidth="1.5" points={polylinePoints} />
              </svg>
              <div className="ec-x-axis">
                {xLabels.map((l, i) => (
                  <span key={i} className="ec-x-label" style={{ left: `${(l.x / chartWidth) * 100}%` }}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 时间轴列表 */}
        <div className="ec-timeline">
          {Array.isArray(timelineListData) && timelineListData.map((item, idx) => {
            const dateStr = item.date || item.time || item.changeDate || '';
            const totalCount = item.todayTotal || item.num || 0;
            const deltaNum = item.changeNum || 0;
            const isPos = deltaNum >= 0;

            // 根据回参动态构建原因列表
            const dynamicReasons = [];
            if (item.newEnterpriseNum > 0) {
              dynamicReasons.push({ text: '拱墅区新设企业', delta: `+${item.newEnterpriseNum}家`, deltaPositive: true });
            }
            if (item.newMoveInEnterprisesNum > 0) {
              dynamicReasons.push({ text: '拱墅区区外新迁入企业', delta: `+${item.newMoveInEnterprisesNum}家`, deltaPositive: true });
            }
            if (item.cancelEnterprisesNum > 0) {
              dynamicReasons.push({ text: '拱墅区区内企业注销或吊销', delta: `-${item.cancelEnterprisesNum}家`, deltaPositive: false });
            }
            if (item.otherNum !== 0 && item.otherNum !== undefined) {
              const isOtherPos = item.otherNum > 0;
              dynamicReasons.push({
                text: '因其他原因导致企业数量变化',
                delta: `${isOtherPos ? '+' : ''}${item.otherNum}家`,
                deltaPositive: isOtherPos
              });
            }

            return (
              <div className="ec-timeline-item" key={idx}>
                <div className="ec-tl-date">{dateStr ? formatDateDisplay(dateStr) : ''}</div>
                <div className="ec-tl-card">

                  {/* 企业总数区块 */}
                  <div className="ec-tl-block ec-tl-block--blue">
                    <span className="ec-tl-label">企业总数</span>
                    <div className="ec-tl-count-row">
                      <span className="ec-tl-count">{Number(totalCount).toLocaleString()}家</span>
                      <span className={`ec-tl-delta ${isPos ? 'ec-tl-delta--pos' : 'ec-tl-delta--neg'}`}>
                        {isPos ? '+' : ''}{deltaNum}家
                      </span>
                    </div>
                  </div>

                  {/* 新增：在册企业 与 在地不在册企业 */}
                  <div className="ec-tl-row">
                    <div className="ec-tl-block ec-tl-block--blue half">
                      <span className="ec-tl-label">在册企业</span>
                      <div className="ec-tl-count-row small">
                        <span className="ec-tl-count small">{Number(item.registerNum || totalCount).toLocaleString()}家</span>
                        <span className={`ec-tl-delta ${(item.registerChangeNum || 0) >= 0 ? 'ec-tl-delta--pos' : 'ec-tl-delta--neg'}`}>
                          {(item.registerChangeNum || 0) >= 0 ? '+' : ''}{item.registerChangeNum || 0}家
                        </span>
                      </div>
                    </div>
                    <div className="ec-tl-block ec-tl-block--blue half">
                      <span className="ec-tl-label">在地不在册企业</span>
                      <div className="ec-tl-count-row small">
                        <span className="ec-tl-count small">{Number(item.localUnregisterNum || totalCount).toLocaleString()}家</span>
                        <span className={`ec-tl-delta ${(item.localUnregisterChangeNum || 0) >= 0 ? 'ec-tl-delta--pos' : 'ec-tl-delta--neg'}`}>
                          {(item.localUnregisterChangeNum || 0) >= 0 ? '+' : ''}{item.localUnregisterChangeNum || 0}家
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 变化原因区块 */}
                  <div className="ec-tl-block ec-tl-block--orange">
                    <span className="ec-tl-label">变化原因</span>
                    <div className="ec-tl-list">
                      {dynamicReasons.length > 0 ? dynamicReasons.map((r, ri) => (
                        <div className="ec-tl-reason-row" key={ri}>
                          <div className="ec-tl-reason-left">
                            <span className="ec-tl-reason-index">{ri + 1}.</span>
                            <span className="ec-tl-reason-text">{r.text}</span>
                          </div>
                          <div className="ec-tl-reason-right">
                            <span className={`ec-tl-reason-delta ${r.deltaPositive ? 'pos' : 'neg'}`}>{r.delta}</span>
                            {/* <span className="ec-tl-reason-link">查看企业&gt;</span> */}
                          </div>
                        </div>
                      )) : (
                        <div className="ec-tl-reason-row">
                          <div className="ec-tl-reason-left">
                            <span className="ec-tl-reason-index">1.</span>
                            <span className="ec-tl-reason-text">暂无明细变动原因</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {timelineLoading && (
            <div className="ec-loading" style={{ textAlign: 'center', padding: '16px', color: '#999', fontSize: '14px' }}>加载中...</div>
          )}
          {!hasMoreTimeline && timelineListData.length > 0 && (
            <div className="ec-no-more" style={{ textAlign: 'center', padding: '16px', color: '#ccc', fontSize: '12px' }}>没有更多了</div>
          )}
          {!timelineLoading && timelineListData.length === 0 && (
            <div className="ec-empty" style={{ textAlign: 'center', padding: '48px 16px', color: '#999', fontSize: '14px' }}>暂无变动记录</div>
          )}
        </div>

      </div>

      {/* 日历底部弹框 */}
      {sheetOpen && (
        <div className="ec-sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="ec-sheet" onClick={e => e.stopPropagation()}>
            {/* 把手 */}
            <div className="ec-sheet-handle" />

            {/* 日历组件 */}
            <DateSelection
              dateDisabledType="afterTodayAndToday"
              onSelect={handleDateSelect}
              defaultValue={pendingDate}
            />

            {/* 已选日期信息 */}
            {pendingDate && (
              <div className="ec-sheet-info">
                <div className="ec-sheet-info-date">{formatDateDisplay(pendingDate)}</div>

                {/* 卡片1：企业总数 */}
                <div className="ec-sheet-card ec-sheet-card--blue">
                  <div className="ec-sheet-card-label">企业总数</div>
                  <div className="ec-sheet-card-row">
                    {loading ? (
                      <span className="ec-sheet-card-value">加载中...</span>
                    ) : (
                      <>
                        <span className="ec-sheet-card-value">
                          {changeDateData?.todayTotal != null
                            ? formatEnterpriseCount(changeDateData.todayTotal)
                            : '--'}
                        </span>
                        {changeDateData?.changeNum != null && (
                          <span className={`ec-sheet-card-delta ${changeDateData.changeNum >= 0 ? 'ec-sheet-card-delta--pos' : 'ec-sheet-card-delta--neg'}`}>
                            {changeDateData.changeNum >= 0 ? `+${changeDateData.changeNum}` : changeDateData.changeNum}家
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* 卡片2：变化原因 */}
                <div className="ec-sheet-card ec-sheet-card--orange">
                  <div className="ec-sheet-card-label">变化原因</div>
                  <div className="ec-sheet-card-list">
                    {loading ? (
                      <div className="ec-sheet-card-list-item">加载中...</div>
                    ) : (
                      (() => {
                        const sheetReasons = [];
                        if (changeDateData?.newEnterpriseNum > 0) sheetReasons.push({ text: '拱墅区新设企业', val: `+${changeDateData.newEnterpriseNum}` });
                        if (changeDateData?.newMoveInEnterprisesNum > 0) sheetReasons.push({ text: '拱墅区区外新迁入企业', val: `+${changeDateData.newMoveInEnterprisesNum}` });
                        if (changeDateData?.cancelEnterprisesNum > 0) sheetReasons.push({ text: '拱墅区区内企业注销或吊销', val: `-${changeDateData.cancelEnterprisesNum}` });
                        if (changeDateData?.otherNum !== 0 && changeDateData?.otherNum !== undefined) {
                          sheetReasons.push({ text: '因其他原因导致企业数量变化', val: `${changeDateData.otherNum > 0 ? '+' : ''}${changeDateData.otherNum}` });
                        }

                        return sheetReasons.length > 0 ? sheetReasons.map((r, ri) => (
                          <div className="ec-sheet-card-list-item" key={ri}>
                            <span className="ec-sheet-card-list-idx">{ri + 1}.</span>
                            <span className="ec-sheet-card-list-txt">{r.text}</span>
                            <span style={{ marginLeft: 'auto', fontSize: '13px', color: r.val.startsWith('-') ? '#0AA34E' : '#D54941' }}>{r.val}家</span>
                          </div>
                        )) : (
                          <div className="ec-sheet-card-list-item">
                            <span className="ec-sheet-card-list-idx">1.</span>
                            <span className="ec-sheet-card-list-txt">暂无明细变动原因</span>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>

                {/* 卡片3：标签变化 (原：变动明细) */}
                <div className="ec-sheet-card ec-sheet-card--purple">
                  <div className="ec-sheet-card-label">标签变化</div>
                  <div className="ec-sheet-card-tag-row">
                    <span className="ec-sheet-badge ec-sheet-badge--blue">暂无数据</span>
                    <div className="ec-sheet-tag-info">
                      <span className="ec-sheet-tag-title">期待后续更新</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 底部按钮 */}
            <div className="ec-sheet-footer">
              <button className="ec-sheet-btn ec-sheet-btn--cancel" onClick={() => setSheetOpen(false)}>取消</button>
              <button className="ec-sheet-btn ec-sheet-btn--confirm" onClick={() => { setConfirmedDate(pendingDate); setSheetOpen(false); }}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

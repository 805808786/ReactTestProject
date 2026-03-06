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
      '工商信息新注册/新注销企业变化',
      '商务社区走访新入驻企业',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '跨境供应链服务',
        detail: '新增为出海企业 · 跨境物流',
      },
      {
        type: '新增',
        typeColor: 'add',
        category: '跨境供应链服务',
        detail: '新增为出海企业 · 跨境物流',
      },
      {
        type: '调整',
        typeColor: 'adjust',
        category: '产业分类',
        detail: '由传统制造调整为高端装备制造',
      },
    ],
  },
  {
    date: '2026年3月4号',
    totalCount: '139,767家',
    countDelta: '-13家',
    deltaPositive: false,
    reasons: [
      '工商信息新注册/新注销企业变化',
      '商务社区走访新入驻企业',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '跨境供应链服务',
        detail: '新增为出海企业 · 跨境物流',
      },
      {
        type: '新增',
        typeColor: 'add',
        category: '跨境供应链服务',
        detail: '新增为出海企业 · 跨境物流',
      },
    ],
  },
  {
    date: '2026年3月1号',
    totalCount: '139,780家',
    countDelta: '+23家',
    deltaPositive: true,
    reasons: [
      '工商信息新注册/新注销企业变化',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '数字经济',
        detail: '认定为数字经济核心产业企业',
      },
    ],
  },
  {
    date: '2026年2月28号',
    totalCount: '139,757家',
    countDelta: '+31家',
    deltaPositive: true,
    reasons: [
      '工商信息新注册/新注销企业变化',
      '商务社区走访新入驻企业',
    ],
    tagChanges: [
      {
        type: '调整',
        typeColor: 'adjust',
        category: '规模等级',
        detail: '调整为规模以上企业',
      },
    ],
  },
  {
    date: '2026年2月25号',
    totalCount: '139,726家',
    countDelta: '-8家',
    deltaPositive: false,
    reasons: [
      '工商信息企业注销',
    ],
    tagChanges: [
      {
        type: '删除',
        typeColor: 'delete',
        category: '基础信息',
        detail: '企业注销清理相关标签',
      },
    ],
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

  const { changeDateData, loading, fetchByChangeDate } = useEnterpriseCalendarStore();

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth || 300);
    }
  }, []);

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

  const displayData = range === 'month' ? oneMonthData : halfYearData;

  const chartH = 74;
  const minVal = 130000;
  const maxVal = 140000;
  const valRange = maxVal - minVal;

  const pts = displayData.map((d, i) => {
    const x = displayData.length > 1 ? (i / (displayData.length - 1)) * chartWidth : 0;
    const y = chartH - ((d.value - minVal) / valRange) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polylinePoints = pts.join(' ');
  const polygonPoints = `0,${chartH} ${polylinePoints} ${chartWidth},${chartH}`;

  // X轴刻度（均匀4个）
  const xLabels = [];
  const step = Math.floor(displayData.length / 3);
  for (let i = 0; i <= 3; i++) {
    const idx = Math.min(i * step, displayData.length - 1);
    const x = displayData.length > 1 ? (idx / (displayData.length - 1)) * chartWidth : 0;
    xLabels.push({ x, label: displayData[idx].monthLabel });
  }

  return (
    <div className="ec-container">
      {/* Header */}
      <div className="ec-header">
        <div className="ec-header-top">
          <button className="ec-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9"/>
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
              {['140,000', '138,000', '136,000', '134,000', '132,000', '130,000'].map(v => (
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
          {timelineItems.map((item, idx) => (
            <div className="ec-timeline-item" key={idx}>
              <div className="ec-tl-date">{item.date}</div>
              <div className="ec-tl-card">

                {/* 企业总数区块 */}
                <div className="ec-tl-block ec-tl-block--blue">
                  <span className="ec-tl-label">企业总数</span>
                  <div className="ec-tl-count-row">
                    <span className="ec-tl-count">{item.totalCount}</span>
                    <span className={`ec-tl-delta${item.deltaPositive === true ? ' ec-tl-delta--pos' : ' ec-tl-delta--neg'}`}>
                      {item.countDelta}
                    </span>
                  </div>
                </div>

                {/* 变化原因区块 */}
                <div className="ec-tl-block ec-tl-block--orange">
                  <span className="ec-tl-label">变化原因</span>
                  {item.reasons.map((r, ri) => (
                    <div className="ec-tl-reason-row" key={ri}>
                      <span className="ec-tl-reason-index">{ri + 1}.</span>
                      <span className="ec-tl-reason-text">{r}</span>
                    </div>
                  ))}
                </div>

                {/* 标签变化区块 */}
                <div className="ec-tl-block ec-tl-block--purple">
                  <span className="ec-tl-label">标签变化</span>
                  {item.tagChanges.map((tc, ti) => (
                    <div className="ec-tl-change-row" key={ti}>
                      <span className={`ec-tl-type-badge ec-tl-type-badge--${tc.typeColor}`}>{tc.type}</span>
                      <div className="ec-tl-change-info">
                        <span className="ec-tl-change-cat">{tc.category}</span>
                        <span className="ec-tl-change-dot"> · </span>
                        <span className="ec-tl-change-detail">{tc.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
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
                    <div className="ec-sheet-card-list-item">
                      <span className="ec-sheet-card-list-idx">1.</span>
                      <span className="ec-sheet-card-list-txt">工商信息新注册/新注销企业变化</span>
                    </div>
                    <div className="ec-sheet-card-list-item">
                      <span className="ec-sheet-card-list-idx">2.</span>
                      <span className="ec-sheet-card-list-txt">商务社区走访新入驻企业</span>
                    </div>
                  </div>
                </div>

                {/* 卡片3：标签变化 */}
                <div className="ec-sheet-card ec-sheet-card--purple">
                  <div className="ec-sheet-card-label">标签变化</div>
                  <div className="ec-sheet-card-tag-row">
                    <span className="ec-sheet-badge ec-sheet-badge--blue">新增</span>
                    <div className="ec-sheet-tag-info">
                      <span className="ec-sheet-tag-title">跨境供应链服务</span>
                      <span className="ec-sheet-tag-dot"> · </span>
                      <span className="ec-sheet-tag-desc">新增为出海企业 · 跨境物流</span>
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

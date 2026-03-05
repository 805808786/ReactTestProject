import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './TagCalendar.css';

// 生成近半年的每日标签数据（10000 ~ 20000 范围）
function generateData(days) {
  const data = [];
  const today = new Date('2026-03-05');
  let val = 15000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    const monthLabel = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    val = Math.min(20000, Math.max(10000, val + (Math.sin(i * 0.25) * 800 + Math.cos(i * 0.13) * 500)));
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
    totalCount: '123,341个',
    countDelta: '+24个',
    deltaPositive: true,
    reasons: [
      'AI自动根据企业信息生成新标签',
      '获取新数据《2025年浙江省"小巨人"企业清单》',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '企业资质',
        detail: '新增为浙江省"小巨人"企业',
        count: '4 项',
      },
      {
        type: '调整',
        typeColor: 'adjust',
        category: '产业分类',
        detail: '调整为新能源汽车产业链配套企业',
        count: '2 项',
      },
    ],
  },
  {
    date: '2026年3月4号',
    totalCount: '123,317个',
    countDelta: '+18个',
    deltaPositive: true,
    reasons: [
      'AI自动根据企业信息生成新标签',
      '工商信息变更触发标签更新',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '荣誉认定',
        detail: '新增为国家高新技术企业',
        count: '6 项',
      },
    ],
  },
  {
    date: '2026年3月1号',
    totalCount: '123,299个',
    countDelta: '-5个',
    deltaPositive: false,
    reasons: [
      '企业注销导致标签失效',
      '标签维度优化合并调整',
    ],
    tagChanges: [
      {
        type: '删除',
        typeColor: 'delete',
        category: '基础信息',
        detail: '企业注销清理相关标签',
        count: '5 项',
      },
    ],
  },
  {
    date: '2026年2月28号',
    totalCount: '123,304个',
    countDelta: '+11个',
    deltaPositive: true,
    reasons: [
      'AI自动根据企业信息生成新标签',
    ],
    tagChanges: [
      {
        type: '新增',
        typeColor: 'add',
        category: '融资情况',
        detail: '新增完成A轮融资标签',
        count: '3 项',
      },
      {
        type: '调整',
        typeColor: 'adjust',
        category: '规模等级',
        detail: '调整为规上企业',
        count: '8 项',
      },
    ],
  },
];

export default function TagCalendar() {
  const navigate = useNavigate();
  const [range, setRange] = useState('half'); // 'month' | 'half'
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(300);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth || 300);
    }
  }, []);

  const displayData = range === 'month' ? oneMonthData : halfYearData;

  const chartH = 74;
  const minVal = 10000;
  const maxVal = 20000;
  const range_ = maxVal - minVal;

  const pts = displayData.map((d, i) => {
    const x = displayData.length > 1 ? (i / (displayData.length - 1)) * chartWidth : 0;
    const y = chartH - ((d.value - minVal) / range_) * chartH;
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
    xLabels.push({ x, label: displayData[idx].monthLabel || displayData[idx].label });
  }

  return (
    <div className="tc-container">
      {/* Header */}
      <div className="tc-header">
        <div className="tc-header-top">
          <button className="tc-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="tc-header-title">日历视图</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="tc-content">

        {/* Tabs 选项卡 */}
        <div className="tc-tabs">
          <div className="tc-tab" onClick={() => navigate('/calendar')}>企业日历</div>
          <div className="tc-tab" onClick={() => navigate('/scene-calendar')}>场景日历</div>
          <div className="tc-tab tc-tab--active">
            标签日历
            <div className="tc-tab-track" />
          </div>
        </div>

        {/* 标签日历 标题区（非下拉） */}
        <div className="tc-title-card">
          <span className="tc-title-text">标签日历</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fill-opacity="0.9"/>
          </svg>
        </div>

        {/* 标签变化趋势卡片 */}
        <div className="tc-trend-card">
          {/* 标题行 */}
          <div className="tc-trend-header">
            <div className="tc-trend-left">
              <span className="tc-trend-dot" />
              <span className="tc-trend-title">标签变化趋势</span>
            </div>
            <div className="tc-trend-range">
              <button
                className={`tc-range-btn${range === 'month' ? ' tc-range-btn--active' : ''}`}
                onClick={() => setRange('month')}
              >
                近一个月
              </button>
              <button
                className={`tc-range-btn${range === 'half' ? ' tc-range-btn--active' : ''}`}
                onClick={() => setRange('half')}
              >
                近半年
              </button>
            </div>
          </div>

          {/* 折线图 */}
          <div className="tc-chart-wrap">
            {/* Y轴 */}
            <div className="tc-y-axis">
              {['20,000', '18,000', '16,000', '14,000', '12,000', '10,000'].map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>
            {/* 图表主体 */}
            <div className="tc-chart-body" ref={chartRef}>
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
              {/* X轴 */}
              <div className="tc-x-axis">
                {xLabels.map((l, i) => (
                  <span key={i} className="tc-x-label" style={{ left: `${(l.x / chartWidth) * 100}%` }}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 时间轴列表 */}
        <div className="tc-timeline">
          {timelineItems.map((item, idx) => (
            <div className="tc-timeline-item" key={idx}>
              {/* 时间标题 */}
              <div className="tc-tl-date">{item.date}</div>
              {/* 内容卡片 */}
              <div className="tc-tl-card">

                {/* 标签总数区块 */}
                <div className="tc-tl-block tc-tl-block--blue">
                  <span className="tc-tl-label">标签总数</span>
                  <div className="tc-tl-count-row">
                    <span className="tc-tl-count">{item.totalCount}</span>
                    <span className={`tc-tl-delta${item.deltaPositive === true ? ' tc-tl-delta--pos' : item.deltaPositive === false ? ' tc-tl-delta--neg' : ''}`}>
                      {item.countDelta}
                    </span>
                  </div>
                </div>

                {/* 变化原因区块 */}
                <div className="tc-tl-block tc-tl-block--orange">
                  <span className="tc-tl-label">变化原因</span>
                  {item.reasons.map((r, ri) => (
                    <div className="tc-tl-reason-row" key={ri}>
                      <span className="tc-tl-reason-index">{ri + 1}.</span>
                      <span className="tc-tl-reason-text">{r}</span>
                    </div>
                  ))}
                </div>

                {/* 标签变化区块 */}
                <div className="tc-tl-block tc-tl-block--purple">
                  <div className="tc-tl-change-header">
                    <span className="tc-tl-label">标签变化</span>
                  </div>
                  {item.tagChanges.map((tc, ti) => (
                    <div className="tc-tl-change-row" key={ti}>
                      <span className={`tc-tl-type-badge tc-tl-type-badge--${tc.typeColor}`}>{tc.type}</span>
                      <div className="tc-tl-change-info">
                        <span className="tc-tl-change-cat">{tc.category}</span>
                        <span className="tc-tl-change-dot">·</span>
                        <span className="tc-tl-change-detail">{tc.detail}</span>
                      </div>
                      <span className="tc-tl-count-badge">{tc.count}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

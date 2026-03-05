import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './SceneCalendar.css';

// 生成近一年的每日场景数量数据（0~15范围）
function generateYearData() {
  const data = [];
  const today = new Date('2026-03-05');
  const seed = 42;
  let val = 7;
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    // 伪随机波动，保持在0~15
    val = Math.min(15, Math.max(0, val + (Math.sin(i * 0.3 + seed) * 2.5 + Math.cos(i * 0.17) * 1.5)));
    data.push({ date: d, label, value: Math.round(val * 10) / 10 });
  }
  return data;
}

const yearData = generateYearData();

// 列表展示数据
const timelineItems = [
  {
    date: '2026年3月5号',
    totalCount: 9,
    countDelta: '+1个',
    deltaPositive: true,
    newScene: '115X企业筛选场景',
    background: '为全面落实中央、省市区关于科技创新与产业创新深度融合以及新型工业化的各项任务要求，推动拱墅区制造业高质量发展，特制定本行动计划。',
  },
  {
    date: '2026年3月4号',
    totalCount: 8,
    countDelta: '+2个',
    deltaPositive: true,
    newScene: '213X产业链协同场景',
    background: '针对制造业数字化转型需求，整合现有资源优势，构建全链条服务生态，推动拱墅区智能制造产业集群加速发展。',
  },
  {
    date: '2026年3月1号',
    totalCount: 6,
    countDelta: '-1个',
    deltaPositive: false,
    newScene: '87X数字政务场景',
    background: '深化政企数据共享机制，积极推进一网通办深度应用，提升企业服务效能，降低企业运营成本。',
  },
  {
    date: '2026年2月28号',
    totalCount: 7,
    countDelta: '+1个',
    deltaPositive: true,
    newScene: '62X金融赋能场景',
    background: '以科技金融为切入点，完善区域创新融资服务体系，为科技型中小企业提供全生命周期金融支持。',
  },
  {
    date: '2026年2月25号',
    totalCount: 6,
    countDelta: '0个',
    deltaPositive: null,
    newScene: '45X绿色低碳场景',
    background: '聚焦碳达峰碳中和战略目标，推动制造业绿色化改造，培育绿色制造标杆企业，打造低碳产业示范园区。',
  },
];

export default function SceneCalendar() {
  const navigate = useNavigate();
  const [range, setRange] = useState('year'); // 'half' | 'year'
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(320);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth);
    }
  }, []);

  const displayData = range === 'year' ? yearData : yearData.slice(182);

  // 构建折线图SVG路径
  const chartH = 74;
  const maxVal = 15;
  const pts = displayData.map((d, i) => {
    const x = (i / (displayData.length - 1)) * chartWidth;
    const y = chartH - (d.value / maxVal) * chartH;
    return `${x},${y}`;
  });
  const polylinePoints = pts.join(' ');
  const polygonPoints = `0,${chartH} ${polylinePoints} ${chartWidth},${chartH}`;

  // X轴刻度标签（均匀取4个）
  const xLabels = [];
  const step = Math.floor(displayData.length / 3);
  for (let i = 0; i <= 3; i++) {
    const idx = Math.min(i * step, displayData.length - 1);
    const x = (idx / (displayData.length - 1)) * chartWidth;
    xLabels.push({ x, label: displayData[idx].label });
  }

  return (
    <div className="sc-container">
      {/* Header */}
      <div className="sc-header">
        <div className="sc-header-top">
          <button className="sc-back-btn" onClick={() => navigate('/')} aria-label="返回">
            {/* 返回箭头图标 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="sc-header-title">日历视图</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="sc-content">

        {/* Tabs 选项卡 */}
        <div className="sc-tabs">
          <div className="sc-tab" onClick={() => navigate('/calendar')}>企业日历</div>
          <div className="sc-tab sc-tab--active">
            场景日历
            <div className="sc-tab-track" />
          </div>
          <div className="sc-tab" onClick={() => navigate('/tag-calendar')}>标签日历</div>
        </div>

        {/* 场景日历标题区（非下拉框） */}
        <div className="sc-title-card">
          <span className="sc-title-text">场景日历</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fill-opacity="0.9"/>
          </svg>
        </div>

        {/* 场景变化趋势卡片 */}
        <div className="sc-trend-card">
          {/* 卡片标题行 */}
          <div className="sc-trend-header">
            <div className="sc-trend-left">
              <span className="sc-trend-dot" />
              <span className="sc-trend-title">场景变化趋势</span>
            </div>
            <div className="sc-trend-range">
              <button
                className={`sc-range-btn${range === 'half' ? ' sc-range-btn--active' : ''}`}
                onClick={() => setRange('half')}
              >
                近半年
              </button>
              <button
                className={`sc-range-btn${range === 'year' ? ' sc-range-btn--active' : ''}`}
                onClick={() => setRange('year')}
              >
                近一年
              </button>
            </div>
          </div>

          {/* 折线图区域 */}
          <div className="sc-chart-wrap">
            {/* Y轴 */}
            <div className="sc-y-axis">
              {[10, 8, 6, 4, 2, 0].map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>
            {/* 图表主体 */}
            <div className="sc-chart-body" ref={chartRef}>
              <svg
                width="100%"
                height={chartH}
                viewBox={`0 0 ${chartWidth} ${chartH}`}
                preserveAspectRatio="none"
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={(i / 5) * chartH}
                    x2={chartWidth}
                    y2={(i / 5) * chartH}
                    stroke="rgba(203,203,203,0.1)"
                    strokeWidth="1"
                  />
                ))}
                <polyline
                  fill="none"
                  stroke="#3CB1FB"
                  strokeWidth="1.5"
                  points={polylinePoints}
                />
              </svg>
              {/* X轴 */}
              <div className="sc-x-axis">
                {xLabels.map((l, i) => (
                  <span
                    key={i}
                    className="sc-x-label"
                    style={{ left: `${(l.x / chartWidth) * 100}%` }}
                  >
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 时间轴列表 */}
        <div className="sc-timeline">
          {timelineItems.map((item, idx) => (
            <div className="sc-timeline-item" key={idx}>
              {/* 时间标题 */}
              <div className="sc-tl-date">{item.date}</div>
              {/* 内容卡片 */}
              <div className="sc-tl-card">
                {/* 场景总数区块 */}
                <div className="sc-tl-block sc-tl-block--blue">
                  <span className="sc-tl-label">场景总数</span>
                  <div className="sc-tl-count-row">
                    <span className="sc-tl-count">{item.totalCount}个</span>
                    <span className={`sc-tl-delta${item.deltaPositive === true ? ' sc-tl-delta--pos' : item.deltaPositive === false ? ' sc-tl-delta--neg' : ' sc-tl-delta--zero'}`}>
                      {item.countDelta}
                    </span>
                  </div>
                </div>

                {/* 新增场景区块 */}
                <div className="sc-tl-block sc-tl-block--orange">
                  <span className="sc-tl-label">新增场景</span>
                  <span className="sc-tl-scene-name">{item.newScene}</span>
                </div>

                {/* 发布背景区块 */}
                <div className="sc-tl-block sc-tl-block--purple">
                  <div className="sc-tl-bg-header">
                    <span className="sc-tl-label">发布背景</span>
                  </div>
                  <p className="sc-tl-bg-text">{item.background}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

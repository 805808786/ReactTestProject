import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconDcBack from '../assets/icon-dc-back.svg'
import iconDcUsers from '../assets/icon-dc-users.svg'
import iconDcChevronRight from '../assets/icon-dc-chevron-right.svg'
import iconDcStar from '../assets/icon-dc-star.svg'
import './DataContribution.css'

/* ==================== Mock 数据 ==================== */
const STATS = {
  total: '11,878',
  departments: 13,
  average: 1309,
}

const CHART_DATA = [
  { name: '发改局', value: 3456, max: 3600 },
  { name: '科技经信局', value: 2890, max: 3600 },
  { name: '数据局', value: 2345, max: 3600 },
]
const CHART_X_LABELS = [0, 900, 1800, 2700, 3600]

const DEPARTMENTS = [
  {
    id: 1,
    name: '发改局',
    growth: '+15.2%',
    total: '3,456',
    rooms: [
      { name: '产业科', count: 8, value: 1234 },
      { name: '投资科', count: 6, value: 1122 },
      { name: '企业科', count: 7, value: 1100 },
    ],
    persons: [
      { name: '张三', role: '科长', star: 4.8, value: 456 },
      { name: '李四', role: '副科长', star: 4.5, value: 334 },
      { name: '王五', role: '科员', star: 4.2, value: 278 },
    ],
  },
  {
    id: 2,
    name: '科技经信局',
    growth: '+12.8%',
    total: '2,890',
    rooms: [
      { name: '科技科', count: 9, value: 1100 },
      { name: '信息科', count: 7, value: 980 },
      { name: '数字科', count: 5, value: 810 },
    ],
    persons: [
      { name: '赵六', role: '科长', star: 4.6, value: 410 },
      { name: '钱七', role: '副科长', star: 4.3, value: 290 },
      { name: '孙八', role: '科员', star: 4.0, value: 190 },
    ],
  },
  {
    id: 3,
    name: '市场监管局',
    growth: '+8.5%',
    total: '2,345',
    rooms: [
      { name: '监管科', count: 6, value: 900 },
      { name: '市场科', count: 5, value: 820 },
      { name: '质检科', count: 4, value: 625 },
    ],
    persons: [
      { name: '周九', role: '科长', star: 4.4, value: 360 },
      { name: '吴十', role: '副科长', star: 4.1, value: 250 },
      { name: '郑十一', role: '科员', star: 3.9, value: 180 },
    ],
  },
]

/* ==================== 水平柱状图 ==================== */
function BarChart() {
  const maxValue = 3600
  const chartW = 286
  const chartH = 160
  const rowH = chartH / CHART_DATA.length   // ~53.33

  const xLabelPositions = CHART_X_LABELS.map((v) => ({
    value: v,
    x: (v / maxValue) * chartW,
  }))

  return (
    <div className="dc-barchart-wrapper">
      <svg
        width="100%"
        viewBox="0 0 416 200"
        preserveAspectRatio="xMidYMid meet"
        className="dc-barchart-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 垂直网格虚线 */}
        {CHART_X_LABELS.map((v) => {
          const x = 85 + (v / maxValue) * chartW
          return (
            <line
              key={v}
              x1={x}
              y1={5}
              x2={x}
              y2={165}
              stroke="#F0F0F0"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          )
        })}

        {/* 条形 */}
        {CHART_DATA.map((d, i) => {
          const barW = (d.value / maxValue) * chartW
          const y = 5 + i * rowH + rowH * 0.25
          const barH = rowH * 0.5
          return (
            <g key={d.name}>
              <rect
                x={85}
                y={y}
                width={barW}
                height={barH}
                rx="4"
                fill="#3B82F6"
              />
              {/* 数值标签 */}
              <text
                x={85 + barW + 6}
                y={y + barH / 2 + 4}
                fontSize="10"
                fill="#101828"
                fontFamily="Alibaba PuHuiTi, PingFang SC, sans-serif"
              >
                {d.value.toLocaleString()}
              </text>
            </g>
          )
        })}

        {/* Y 轴分隔线 */}
        <line x1={85} y1={5} x2={85} y2={165} stroke="#666666" strokeWidth="1" />

        {/* Y 轴部门标签 */}
        {CHART_DATA.map((d, i) => (
          <text
            key={d.name}
            x={80}
            y={5 + i * rowH + rowH / 2 + 4}
            fontSize="12"
            fill="#666666"
            textAnchor="end"
            fontFamily="Alibaba PuHuiTi, PingFang SC, sans-serif"
          >
            {d.name}
          </text>
        ))}

        {/* X 轴基线 */}
        <line x1={82} y1={165} x2={375} y2={165} stroke="#666666" strokeWidth="1" />

        {/* X 轴刻度标签 */}
        {xLabelPositions.map(({ value, x }) => (
          <text
            key={value}
            x={85 + x}
            y={185}
            fontSize="12"
            fill="#666666"
            textAnchor="middle"
            fontFamily="Alibaba PuHuiTi, PingFang SC, sans-serif"
          >
            {value}
          </text>
        ))}
      </svg>
    </div>
  )
}

/* ==================== 科室贡献条目 ==================== */
function RoomItem({ room }) {
  return (
    <div className="dc-room-item">
      <div className="dc-room-left">
        <div className="dc-room-name">{room.name}</div>
        <div className="dc-room-count">{room.count} 人</div>
      </div>
      <div className="dc-room-value">{room.value}</div>
    </div>
  )
}

/* ==================== 人员贡献条目 ==================== */
function PersonItem({ person, deptName }) {
  const navigate = useNavigate()
  return (
    <div className="dc-person-item">
      <div className="dc-person-top">
        <div className="dc-person-info">
          <span className="dc-person-name">{person.name}</span>
          <span className="dc-person-role">{person.role}</span>
        </div>
        <div className="dc-person-star">
          <img src={iconDcStar} alt="star" width={12} height={12} />
          <span className="dc-person-star-val">{person.star}</span>
        </div>
      </div>
      <div className="dc-person-bottom">
        <span className="dc-person-contribution">贡献 {person.value} 条</span>
        <div
          className="dc-person-detail"
          onClick={() => navigate('/person-contribution', { state: { person, deptName } })}
          style={{ cursor: 'pointer' }}
        >
          <span className="dc-person-detail-text">查看详情</span>
          <img src={iconDcChevronRight} alt=">" width={12} height={12} className="dc-chevron-right-inline" />
        </div>
      </div>
    </div>
  )
}

/* ==================== 部门手风琴条目 ==================== */
function DeptAccordion({ dept, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="dc-dept-item">
      {/* 部门头部行 */}
      <button
        className="dc-dept-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="dc-dept-header-left">
          <div className="dc-dept-name-row">
            <span className="dc-dept-name">{dept.name}</span>
            <span className="dc-dept-growth">{dept.growth}</span>
          </div>
          <div className="dc-dept-total">贡献数据 {dept.total} 条</div>
        </div>
        <img
          src={iconDcChevronRight}
          alt="展开"
          width={20}
          height={20}
          className={`dc-dept-chevron ${open ? 'dc-dept-chevron--open' : ''}`}
        />
      </button>

      {/* 展开内容 */}
      {open && (
        <div className="dc-dept-body">
          {/* 科室贡献 */}
          <div className="dc-section-title">科室贡献</div>
          <div className="dc-rooms-grid">
            {dept.rooms.map((r) => (
              <RoomItem key={r.name} room={r} />
            ))}
          </div>

          {/* 人员贡献 */}
          <div className="dc-section-title dc-section-title--persons">人员贡献</div>
          <div className="dc-persons-list">
            {dept.persons.map((p) => (
              <PersonItem key={p.name} person={p} deptName={dept.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ==================== 主页面 ==================== */
export default function DataContribution() {
  const navigate = useNavigate()

  return (
    <div className="dc-container">
      {/* ========== 头部 ========== */}
      <div className="dc-header">
        <div className="dc-header-top">
          <button className="dc-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconDcBack} alt="返回" width={36} height={32} />
          </button>
          <span className="dc-header-title">数据贡献</span>
        </div>

        {/* 统计数据区 */}
        <div className="dc-stats-row">
          <div className="dc-stat-card">
            <div className="dc-stat-label">总贡献</div>
            <div className="dc-stat-value">{STATS.total}</div>
          </div>
          <div className="dc-stat-card">
            <div className="dc-stat-label">参与部门</div>
            <div className="dc-stat-value">{STATS.departments}</div>
          </div>
          <div className="dc-stat-card">
            <div className="dc-stat-label">平均贡献</div>
            <div className="dc-stat-value">{STATS.average}</div>
          </div>
        </div>
      </div>

      {/* ========== 内容区 ========== */}
      <div className="dc-content">
        {/* 部门贡献排名 */}
        <div className="dc-card">
          <div className="dc-card-title">部门贡献排名</div>
          <BarChart />
        </div>

        {/* 部门详情 */}
        <div className="dc-card dc-card--detail">
          <div className="dc-detail-header">
            <img src={iconDcUsers} alt="部门" width={16} height={16} />
            <span className="dc-detail-header-title">部门详情</span>
          </div>
          <div className="dc-dept-list">
            {DEPARTMENTS.map((dept, idx) => (
              <DeptAccordion key={dept.id} dept={dept} defaultOpen={idx === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

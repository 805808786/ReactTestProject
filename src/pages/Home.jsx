import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import Dialog from '../components/Dialog'
import ChatModal from '../components/ChatModal'
import { useEnterpriseStore } from '../store/enterpriseStore'

import homeIcon from '../assets/tabs/icons/home.svg'
import special115xIcon from '../assets/tabs/icons/special-115x.svg'
import radarIcon from '../assets/tabs/icons/radar.svg'
import enterpriseIcon from '../assets/tabs/icons/enterprise.svg'
import dataIcon from '../assets/tabs/icons/data.svg'
import policyIcon from '../assets/tabs/icons/policy.svg'
import icon115 from '../assets/special-115x/115-badge-icon.svg'
import chevronRightIcon from '../assets/chevron-right.svg'
import starIcon from '../assets/icon-dc-star.svg'
import enterpriseDataJson from '../json/enterprise.json'
import SparklesIcon from '../assets/Sparkles.svg'
import FireGif from '../assets/Fire.gif'
import ZapIcon from '../assets/Zap.svg'
import MessageCircleIcon from '../assets/MessageCircle.svg'
import iconKeyEnterpriseChevron from '../assets/icon-key-enterprise-chevron-right.svg'
import iconKeyEnterpriseChevronItem from '../assets/icon-key-enterprise-chevron-right2.svg'
import assistantAvatar from '../assets/assistant-avatar.svg'
import assistantArrow from '../assets/assistant-arrow.svg'

const bottomTabs = [
  { label: '首页', icon: homeIcon },
  { label: '115X专题', icon: special115xIcon },
  { label: '场景雷达', icon: radarIcon },
  { label: '关注企业', icon: enterpriseIcon },
  { label: '数据贡献', icon: dataIcon },
  { label: '政策匹配', icon: policyIcon },
]

export default function Home() {
  const [activeBottomTab, setActiveBottomTab] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const navigate = useNavigate()

  const renderContent = () => {
    switch (activeBottomTab) {
      case 0:
        return (
          <>
            
            <EnterpriseOverview />
            <AssistantCard onClick={() => setIsChatOpen(true)} />
            <KeyFocus />
          </>
        )
      case 1:
        return <Special115X />
      case 2:
        return <FocusScene />
      case 3:
        return <FocusEnterprise />
      case 4:
        return <DataContribution />
      case 5:
        return <PolicyMatching />
      default:
        return null
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="content bottom-nav-content">
        {renderContent()}
      </div>
      
      <div className="bottom-nav">
        {bottomTabs.map((tab, index) => (
          <div 
            key={tab.label} 
            className={`bottom-nav-item ${activeBottomTab === index ? 'active' : ''}`}
            onClick={() => setActiveBottomTab(index)}
          >
            <div className="bottom-nav-icon">
              <img src={tab.icon} alt={tab.label} />
            </div>
            <span className="bottom-nav-label">{tab.label}</span>
          </div>
        ))}
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {activeBottomTab !== 0 && (
        <div className="floating-assistant-btn" onClick={() => setIsChatOpen(true)}>
          <div className="floating-btn-inner">
            <img src={SparklesIcon} alt="assistant" />
          </div>
          <div className="notification-dot"></div>
        </div>
      )}
    </div>
  )
}


function KeyFocus() {
  const navigate = useNavigate()
  // 展示json里前3家数据
  const focusList = enterpriseDataJson.slice(0, 3).map((item, index) => ({
    id: item?.['基本信息']?.data?.enterpriseId || index,
    name: item?.['基本信息']?.data?.enterpriseName || ''
  }))

  return (
    <section className="key-focus-section">
      <div className="key-focus-header">
        <div className="key-focus-header-left">
          <div className="key-focus-fire-bg"><img src={FireGif} alt="fire" /></div>
          <span className="key-focus-title">当前关注</span>
        </div>
      </div>
      
      <div className="key-focus-main-card">
        <div className="key-focus-scene-header">
          <span className="key-focus-scene-name">人工智能企业筛选场景</span>
          <div className="scene-desc-badge" onClick={() => navigate('/scene-description/1')}>场景说明</div>
        </div>

        <div className="key-focus-stats-row">
          <div className="key-focus-stat-card" onClick={() => navigate('/scene-enterprise')}>
            <div className="stat-card-title">
              <span>人工智能企业</span>
              <span className="stat-arrow">→</span>
            </div>
            <div className="stat-card-value">
              <span className="main-val">21,943<small>家</small></span>
              <span className="sub-val">今日<span className="plus">+3</span></span>
            </div>
          </div>
          <div className="key-focus-stat-card"  onClick={() => navigate('/scene-enterprise-dynamic')}>
            <div className="stat-card-title">
              <span>人工智能动态</span>
              <span className="stat-arrow">→</span>
            </div>
            <div className="stat-card-value">
              <span className="main-val">32<small>条</small></span>
              <span className="sub-val">今日<span className="plus">+3</span></span>
            </div>
          </div>
        </div>

       
      </div>
       <div className="key-focus-companies-section">
          <div className="companies-header">
            <img src={starIcon} alt="star" />
            <span>重点企业</span>
          </div>
          <div className="companies-list">
            {focusList.map((item, idx) => (
              <div 
                key={item.id} 
                className="company-item-row"
                onClick={() => navigate(`/company-detail/${item.id}`)}
              >
                <div className="company-item-left">
                  <span className="company-name-text">{item.name}</span>
                  <span className={`level-tag ${idx === 0 ? 'level-top' : 'level-waist'}`}>
                    {idx === 0 ? '头部' : '潜力'}
                  </span>
                  <span className="visit-status-tag">已走访</span>
                </div>
                <img src={chevronRightIcon} alt="arrow" />
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}

function Header() {
  return (
    <div className="header">
      <div className="header-bg" />
      <div className="header-content">
        <div className="header-title">墅企瞭望台</div>
        <div className="header-subtitle">24*7 超能经济干部</div>
      </div>
    </div>
  )
}


function formatDateCN(date) {
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

import overviewMainIcon from '../assets/overview-main-icon.png'
import chartLineUpIcon from '../assets/chart-line-up.svg'
import detailsArrowIcon from '../assets/details-arrow.svg'

function EnterpriseOverview() {
  const navigate = useNavigate()
  const { enterpriseData, loading, fetchEnterpriseData } = useEnterpriseStore()

  // eslint-disable-next-line react-hooks/purity
  const today = new Date(Date.now() - 86400000) // T-1（昨天）
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  useEffect(() => {
    fetchEnterpriseData(todayStr)
  }, [fetchEnterpriseData, todayStr])

  const todayTotal = enterpriseData?.todayTotal
  const changeNum = enterpriseData?.changeNum
  const displayDate = enterpriseData?.changeDate
    ? formatDateCN(new Date(enterpriseData.changeDate))
    : formatDateCN(today)

  return (
    <section className="overview-section">
      <div className="overview-header">
        <span className="overview-title">企业总览</span>
        <Link to="/calendar" className="overview-date" style={{ textDecoration: 'none' }}>{displayDate}</Link>
      </div>

      <div className="overview-main-card" onClick={()=>navigate('/calendar')}>
        <div className="overview-main-left">
          <img src={overviewMainIcon} alt="icon" className="overview-main-img" />
          <div className="overview-main-info">
            <div className="overview-label">企业总数</div>
            <div className="overview-count">
              {loading ? '--' : (todayTotal !== undefined && todayTotal !== null ? Number(todayTotal).toLocaleString() : '139,987')}
              <span className="overview-unit">家</span>
            </div>
          </div>
        </div>
        <div className="overview-divider"></div>
        <div className="overview-main-right">
          <div className="overview-label">企业变化(较昨日)</div>
          <div className="overview-change">
            {loading ? '--' : (changeNum !== undefined && changeNum !== null ? `${changeNum > 0 ? '+' : ''}${changeNum}` : '+5')}
            <span className="overview-unit">家</span>
          </div>
        </div>
      </div>

      <div className="overview-daily-changes">
        <div className="daily-changes-title">每<br/>日<br/>变<br/>化</div>
        <div className="daily-changes-list">
          <div className="daily-change-item">
            <div className="daily-change-left">
              <span className="dot dot-green"></span>
              <span className="change-label">工商信息新注册/迁入企业</span>
            </div>
            <span className="change-value text-green">+50家</span>
          </div>
          <div className="daily-change-item">
            <div className="daily-change-left">
              <span className="dot dot-red"></span>
              <span className="change-label">工商信息新注销/吊销企业</span>
            </div>
            <span className="change-value text-red">-48家</span>
          </div>
          <div className="daily-change-item">
            <div className="daily-change-left">
              <span className="dot dot-green"></span>
              <span className="change-label">扫楼跑企新增企业</span>
            </div>
            <span className="change-value text-green">3家</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Special115X() {
  return (
    <section className="special-115x-view">
      {/* 头部标题区域 */}
      <div className="special-header-card">
        <div className="special-badge-box">
          <img src={icon115} alt="115 badge" />
        </div>
        <h2 className="special-main-title">拱墅115X专题</h2>
      </div>

      {/* “1” 人工智能 */}
      <div className="special-cluster-group">
        <div className="cluster-title">“1”人工智能（集成电路）核心产业集群</div>
        <div className="cluster-metric-card blue-metric">
          <div className="metric-left">
            <div className="metric-name">人工智能场景</div>
            <div className="metric-total">14,331<small>家</small></div>
          </div>
          <div className="metric-right">
            <div className="metric-change-label">今日新增</div>
            <div className="metric-change-value">+73<small>家</small></div>
          </div>
        </div>
      </div>

      {/* “1” 生物医药 */}
      <div className="special-cluster-group">
        <div className="cluster-title">“1”生物医药与医疗器械（合成生物）支柱产业</div>
        <div className="cluster-metric-card blue-metric">
          <div className="metric-left">
            <div className="metric-name">生物医药与医疗器械场景</div>
            <div className="metric-total">14,331<small>家</small></div>
          </div>
          <div className="metric-right">
            <div className="metric-change-label">今日新增</div>
            <div className="metric-change-value">+73<small>家</small></div>
          </div>
        </div>
      </div>

      {/* “5” 新兴未来 */}
      <div className="special-cluster-group">
        <div className="cluster-title">“5”个新兴未来产业集群</div>
        <div className="cluster-grid-row">
          <div className="cluster-sub-card">
            <div className="sub-card-name">高端通用设备</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today up">今日+12</div>
          </div>
          <div className="cluster-sub-card">
            <div className="sub-card-name">新能源装备</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today up">今日+12</div>
          </div>
        </div>
        <div className="cluster-grid-row">
          <div className="cluster-sub-card">
            <div className="sub-card-name">新材料</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today down">今日-12</div>
          </div>
          <div className="cluster-sub-card">
            <div className="sub-card-name">低空经济</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today down">今日-12</div>
          </div>
          <div className="cluster-sub-card">
            <div className="sub-card-name">光电科技</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today down">今日-12</div>
          </div>
        </div>
      </div>

      {/* “X” 潜力产业 */}
      <div className="special-cluster-group">
        <div className="cluster-title">“X”未来新增的潜力产业集群</div>
        <div className="cluster-grid-row wrap">
          <div className="cluster-sub-card mini">
            <div className="sub-card-name">智能终端</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today">今日+12</div>
          </div>
          <div className="cluster-sub-card mini">
            <div className="sub-card-name">网络通信</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today">今日+12</div>
          </div>
          <div className="cluster-sub-card mini">
            <div className="sub-card-name">智能网联汽..</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today">今日+12</div>
          </div>
          <div className="cluster-sub-card mini">
            <div className="sub-card-name">智能网联汽..</div>
            <div className="sub-card-total">3,245<small>家</small></div>
            <div className="sub-card-today">今日+12</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FocusScene() {
  const navigate = useNavigate()
  return (
      <section className="card focus-scene-view">
      <div className="card-header">
        <div className="card-header-left">
          <div className="title-icon scene-icon-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9810FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <span className="card-title">关注场景</span>
        </div>
      </div>

      <div className="scene-stat-row">
        <div className="stat-left">
          <div className="stat-label-small">专题场景</div>
          <div className="stat-value-large">8个</div>
        </div>
        <div className="stat-right">
          <button onClick={() => navigate('/scene-radar')} className="view-all">查看全部 →</button>
        </div>
      </div>

      <div className="scene-featured-box">
        <div className="featured-header">
          <span className="featured-title">人工智能企业筛选场景</span>
          <span className="scene-tag" onClick={() => navigate('/scene-description/1')} style={{ cursor: 'pointer' }}>场景说明</span>
        </div>
        <p className="featured-desc">数据商业化企业专项筛选</p>

        <div className="metrics-grid">
          <div className="metric-item" onClick={() => navigate('/scene-enterprise')} style={{ cursor: 'pointer' }}>
            <div className="metric-top">
              <span className="metric-label">人工智能企业</span>
              <span className="metric-arrow">→</span>
            </div>
            <div className="metric-bottom">
              <span className="metric-value">21,943<small>家</small></span>
              <span className="metric-today">今日+3</span>
            </div>
          </div>

          <div className="metric-item" onClick={() => navigate('/scene-enterprise-dynamic')}>
            <div className="metric-top">
              <span className="metric-label">数商场景动态</span>
              <span className="metric-arrow">→</span>
            </div>
            <div className="metric-bottom">
              <span className="metric-value">32<small>条</small></span>
              <span className="metric-today">今日+3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


const KEY_ENTERPRISES = enterpriseDataJson.map((item, index) => ({
  id: item?.['基本信息']?.data?.enterpriseId || index,
  name: item?.['基本信息']?.data?.enterpriseName || '',
  type: item?.['基本信息']?.data?.categoryName || '',
  info: item?.['基本信息']?.data?.reason || '',
  level: item?.['基本信息']?.data?.level || (index === 0 ? '头部' : '潜力'), // Assuming level can be derived or is in data
  visited: item?.['基本信息']?.data?.visited || (index % 2 === 0) // Assuming visited status
}))

function FocusEnterprise() {
  const navigate = useNavigate()
  return (
    <section className="card focus-scene-view">
      <div className="card-header">
        <div className="card-header-left">
          <div className="title-icon enterprise-icon-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E17100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span className="card-title">关注企业</span>
        </div>
      </div>

      <div className="enterprise-summary-row">
        <div className="summary-left">
          <div className="summary-info">
            <span className="summary-label">关注企业</span>
            <div className="summary-value orange-text">1,987<small>家</small></div>
          </div>
        </div>
        <div className="summary-right">
          <button onClick={() => navigate('/follow-enterprise')} className="view-all orange-text">查看全部 →</button>
        </div>
        <div className="summary-badge orange-badge">今日+3</div>
      </div>

      <div className="enterprise-grid-container">
        <div className="enterprise-row">
          <div className="enterprise-item blue-bg" onClick={() => navigate('/planned-visits')} style={{ cursor: 'pointer' }}>
            <div className="item-header">
              <span className="item-label">拟走访企业</span>
              <span className="item-arrow blue-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value blue-text">2<small>家</small></span>
              <span className="item-sub-label blue-text">今日走访：1家</span>
            </div>
          </div>
          <div className="enterprise-item blue-bg" onClick={() => navigate('/enterprise-dynamic')} style={{ cursor: 'pointer' }}>
            <div className="item-header">
              <span className="item-label">企业走访动态</span>
              <span className="item-arrow blue-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value blue-text">156<small>家</small></span>
              <span className="item-sub-label blue-text">今日+3</span>
            </div>
          </div>
        </div>

        <div className="enterprise-row">
          <div className="enterprise-item green-bg" onClick={() => navigate('/top-enterprise-dynamic')} style={{ cursor: 'pointer' }}>
            <div className="item-header">
              <span className="item-label">头部企业动态</span>
              <span className="item-arrow green-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value green-text">653<small>条</small></span>
              <span className="item-sub-label green-text">今日+3</span>
            </div>
          </div>
          <div className="enterprise-item purple-bg" onClick={() => navigate('/waist-enterprise')} style={{ cursor: 'pointer' }}>
            <div className="item-header">
              <span className="item-label">腰部企业挖掘</span>
              <span className="item-arrow purple-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value purple-text">43<small>家</small></span>
              <span className="item-sub-label purple-text">今日+3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="key-enterprise-divider">
        <div className="key-enterprise-header" onClick={() => navigate('/follow-enterprise')} style={{ cursor: 'pointer' }}>
          <span className="key-enterprise-title">重点关注企业</span>
          <img src={iconKeyEnterpriseChevron} alt="查看" className="key-enterprise-chevron" />
        </div>
      </div>
      <div className="key-enterprise-list">
        {KEY_ENTERPRISES.map((item, idx) => (
          <div className="key-enterprise-item" key={item.name} onClick={() => navigate(`/company-detail/${item.id}`)} style={{ cursor: 'pointer' }}>
            <div className="key-enterprise-info">
              <div className="key-enterprise-name-row">
                <span className="key-enterprise-name">{item.name}</span>
                <span className={`level-tag ${idx === 0 ? 'level-top' : 'level-waist'}`}>
                  {idx === 0 ? '头部' : '潜力'}
                </span>
                <span className="visit-status-tag">已走访</span>
              </div>
              <div className="key-enterprise-sub">{item.info}</div>
            </div>
            <img src={iconKeyEnterpriseChevronItem} alt="" className="key-enterprise-arrow" />
          </div>
        ))}
      </div>
    </section>
  )
}

const CHART_DATA = [
  { name: '发改局', value: 3456, max: 3600 },
  { name: '科技经信局', value: 2890, max: 3600 },
  { name: '市场监管局', value: 2345, max: 3600 },
]
const CHART_X_LABELS = [0, 900, 1800, 2700, 3600]

function BarChart() {
  const maxValue = 3600
  const chartW = 286
  const chartH = 160
  const rowH = chartH / CHART_DATA.length

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
              <text
                x={85 + barW + 6}
                y={y + barH / 2 + 4}
                fontSize="10"
                fill="#101828"
              >
                {d.value.toLocaleString()}
              </text>
            </g>
          )
        })}

        <line x1={85} y1={5} x2={85} y2={165} stroke="#666666" strokeWidth="1" />

        {CHART_DATA.map((d, i) => (
          <text
            key={d.name}
            x={80}
            y={5 + i * rowH + rowH / 2 + 4}
            fontSize="12"
            fill="#666666"
            textAnchor="end"
          >
            {d.name}
          </text>
        ))}

        <line x1={82} y1={165} x2={375} y2={165} stroke="#666666" strokeWidth="1" />

        {xLabelPositions.map(({ value, x }) => (
          <text
            key={value}
            x={85 + x}
            y={185}
            fontSize="12"
            fill="#666666"
            textAnchor="middle"
          >
            {value}
          </text>
        ))}
      </svg>
    </div>
  )
}

function DataContribution() {
  const navigate = useNavigate()
  return (
    <>
      <section className="card focus-scene-view">
        <div className="card-header">
          <div className="card-header-left">
            <div className="title-icon contribution-icon-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="card-title">数据贡献</span>
          </div>
        </div>

        <div className="contribution-summary-row">
          <div className="summary-left">
            <div className="summary-info">
              <span className="summary-label">总贡献数据条数</span>
              <div className="summary-value blue-text">15,678<small>条</small></div>
            </div>
          </div>
          <div className="summary-right">
            <button onClick={() => navigate('/data-contribution')} className="view-all blue-text">查看全部 →</button>
          </div>
        </div>

        <div className="contribution-grid">
          <div className="contribution-item blue-bg">
            <div className="item-label">参与部门</div>
            <div className="item-value blue-text">12</div>
          </div>
          <div className="contribution-item green-bg">
            <div className="item-label">平均贡献</div>
            <div className="item-value green-text">1306</div>
          </div>
        </div>
      </section>

      <section className="card focus-scene-view sub-card">
        <div className="card-header">
          <span className="card-title">部门贡献排名</span>
        </div>
        <div className="contribution-ranking-content">
          <BarChart />
        </div>
      </section>
    </>
  )
}

const FIRST_POLICY = {
  id: 1,
  name: '高新技术企业研发补贴',
  matchedCount: 1234,
  implementedCount: 856,
  implementationRate: 69.4,
  enterprises: [
    {
      id: 1,
      name: '科技创新有限公司',
      applyStatus: { label: '已申报', type: 'applied' },
      progressStatus: '审核中',
      amount: '50万',
      advice: '补充研发人员名单和项目验收报告',
    },
  ],
  newPolicySuggestion: '建议针对小微高新企业推出梯度化补贴政策，降低申报门槛',
}

function PolicyMatching() {
  const navigate = useNavigate()
  const policy = FIRST_POLICY
  const rateColor = policy.implementationRate >= 80 ? '#00A63E' : policy.implementationRate >= 60 ? '#155DFC' : '#D08700'
  const progressColor = policy.implementationRate >= 80 ? '#00C950' : policy.implementationRate >= 60 ? '#155DFC' : '#D08700'
  const ent = policy.enterprises[0]
  const statusStyle =
    ent.applyStatus.type === 'applied'
      ? { background: '#EFF6FF', color: '#155DFC' }
      : ent.applyStatus.type === 'done'
      ? { background: '#F0FDF4', color: '#00A63E' }
      : { background: '#FEFCE8', color: '#D08700' }

  return (
    <>
      <section className="card focus-scene-view">
        <div className="card-header">
          <div className="card-header-left">
            <div className="title-icon policy-icon-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <span className="card-title">政策匹配</span>
          </div>
        </div>

        <div className="policy-summary-row">
          <div className="summary-left">
            <div className="summary-info">
              <span className="summary-label">匹配企业数</span>
              <div className="summary-value blue-text">678<small>家</small></div>
            </div>
          </div>
          <div className="summary-right">
            <button onClick={() => navigate('/policy-list')} className="view-all blue-text">查看全部 →</button>
          </div>
        </div>

        <div className="policy-progress-box">
          <div className="progress-header">
            <span className="progress-title">政策实施进度</span>
            <span className="progress-badge">进度 85%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '85%' }}></div>
          </div>
        </div>
      </section>

      <section className="card focus-scene-view sub-card">
        {/* 政策标题区 */}
        <div className="home-policy-header" onClick={() => navigate('/policy-list')}>
          <div className="home-policy-title-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <div className="home-policy-title-group">
              <span className="home-policy-name">{policy.name}</span>
              <span className="home-policy-match-info">匹配 {policy.matchedCount.toLocaleString()} 家 · 已实施 {policy.implementedCount.toLocaleString()} 家</span>
            </div>
          </div>
          <div className="home-policy-rate-group">
            <span className="home-policy-rate-value" style={{ color: rateColor }}>{policy.implementationRate}%</span>
            <span className="home-policy-rate-label">实施率</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="home-policy-progress-track">
          <div className="home-policy-progress-fill" style={{ width: `${policy.implementationRate}%`, background: progressColor }} />
        </div>

        {/* 企业施策建议与进展 */}
        <div className="home-policy-enterprise-section">
          <div className="home-policy-section-header">
            <span className="home-policy-section-title">企业施策建议与进展</span>
          </div>
          <div className="home-policy-enterprise-item">
            <div className="home-policy-enterprise-top">
              <div className="home-policy-enterprise-left">
                <span className="home-policy-enterprise-name">{ent.name}</span>
                <div className="home-policy-enterprise-status-row">
                  <span className="home-policy-enterprise-badge" style={statusStyle}>{ent.applyStatus.label}</span>
                  <span className="home-policy-enterprise-progress">{ent.progressStatus}</span>
                </div>
              </div>
              <span className="home-policy-enterprise-amount">{ent.amount}</span>
            </div>
            <div className="home-policy-advice-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="home-policy-advice-text">{ent.advice}</span>
            </div>
          </div>
        </div>

        {/* 新政策建议 */}
        <div className="home-policy-newpolicy-section">
          <span className="home-policy-section-title">新政策建议</span>
          <div className="home-policy-newpolicy-card">
            <span className="home-policy-newpolicy-text">{policy.newPolicySuggestion}</span>
          </div>
        </div>
      </section>
    </>
  )
}


function AssistantCard({ onClick }) {
  return (
    <div className="assistant-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="assistant-card-inner">
        <div className="assistant-left">
          <div className="assistant-top-row">
            <div className="assistant-avatar">
              <img src={SparklesIcon} alt="Avatar" />
            </div>
            <div className="assistant-title">墅企小助手</div>
          </div>
          <div className="assistant-bottom-row">
            <div className="assistant-tag">
              <img src={ZapIcon} alt="Zap" />
              <span>即时响应</span>
            </div>
            <div className="assistant-tag">
              <img src={MessageCircleIcon} alt="Msg" />
              <span>24小时在线</span>
            </div>
          </div>
        </div>
        <div className="assistant-right">
          <img src={assistantArrow} alt="Arrow" />
        </div>
      </div>
    </div>
  )
}
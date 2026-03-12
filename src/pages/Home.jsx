import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import Dialog from '../components/Dialog'
import ChatModal from '../components/ChatModal'
import { useEnterpriseStore } from '../store/enterpriseStore'

const tabs = ['企业总览', '关注场景', '关注企业', '数据贡献', '政策匹配']

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // 点击 Tab 时滚动到对应模块
  const handleTabChange = (index) => {
    setActiveTab(index)
    const element = document.getElementById(`section-${index}`)
    if (element) {
      const tabbar = document.querySelector('.tab-bar')
      const tabbarHeight = tabbar ? tabbar.offsetHeight : 44
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - tabbarHeight - 12
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  // 监听页面滚动，高亮当前所在的模块对应的 Tab
  useEffect(() => {
    const handleScroll = () => {
      const tabbar = document.querySelector('.tab-bar')
      const tabbarHeight = tabbar ? tabbar.offsetHeight : 44
      let currentIndex = 0

      // 反向遍历检测最先符合条件的区块
      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${i}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          // 给一点缓冲高度判断，让滚动体验更自然
          if (rect.top <= tabbarHeight + 24) {
            currentIndex = i
            break
          }
        }
      }

      setActiveTab((prev) => (prev !== currentIndex ? currentIndex : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      <Header />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="content">
        <div id="section-0">
           <AssistantCard onClick={() => setIsChatOpen(true)} />
          <EnterpriseOverview />
           <KeyFocus />
        </div>
        
        <div id="section-1">
          <Special115X />
          <div id="section-2"><FocusEnterprise /></div>
          
        </div>
       <FocusScene />
       
        
        <div id="section-3"><DataContribution /></div>
        <div id="section-4"><PolicyMatching /></div>
      </div>
      
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

import chevronRightIcon from '../assets/chevron-right.svg'

function KeyFocus() {
  const navigate = useNavigate()
  // 展示json里所有的数据
  const focusList = enterpriseDataJson.map((item, index) => ({
    id: item?.['基本信息']?.data?.enterpriseId || index,
    name: item?.['基本信息']?.data?.enterpriseName || ''
  }))

  return (
    <section className="key-focus-section">
      <div className="key-focus-header">
        <span className="key-focus-title">🔥重点关注</span>
      </div>
      
      <div className="key-focus-content">
        {/* 上方紫色卡片 */}
        <div className="key-focus-top-card">
          <div className="scene-badge">人工智能场景</div>
        </div>

        {/* 下方蓝色卡片 - 企业列表 */}
        <div className="key-focus-list-card">
          {focusList.map((item) => (
            <div 
              key={item.id} 
              className="key-focus-item"
              onClick={() => navigate(`/company-detail/${item.id}`)}
            >
              <div className="status-tag">已走访</div>
              <span className="company-name">{item.name}</span>
            </div>
          ))}

          <div className="key-focus-more" onClick={() => navigate('/enterprise-list')}>
            <span>查看更多(8)</span>
            <img src={chevronRightIcon} alt="more" />
          </div>
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

function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`tab-item ${activeTab === index ? 'tab-active' : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
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

      <div className="overview-main-card">
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

      <div className="overview-detail-card">
        <div className="overview-detail-item">
          <div className="detail-dot dot-green"></div>
          <div className="detail-content">
            <span className="detail-label">工商信息新注册</span>
            <span className="detail-value text-green">+10家</span>
          </div>
        </div>
        <div className="overview-detail-item">
          <div className="detail-dot dot-red"></div>
          <div className="detail-content">
            <span className="detail-label">新注销企业变化</span>
            <span className="detail-value text-red">-5家</span>
          </div>
        </div>
        <div className="overview-detail-footer">
          <div className="detail-action-btn" onClick={() => navigate('/enterprise-list')}>
            <img src={chartLineUpIcon} alt="chart" />
            <span>查看详细变化</span>
            <img src={detailsArrowIcon} alt="arrow" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Special115X() {
  return (
    <section className="card special-115x-card" style={{ marginBottom: '16px' }}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="special-badge">115X</div>
          <span className="card-title">拱墅115X专题</span>
        </div>
      </div>

      <div className="special-section">
        <h3 className="special-title">“1” 人工智能（集成电路）核心产业集群</h3>
        <div className="special-main-card">
          <div className="special-main-left">
            <span className="special-label">人工智能场景</span>
            <div className="special-value">14,331<span className="unit">家</span></div>
          </div>
          <div className="special-main-right">
            <span className="special-label">今日新增</span>
            <div className="special-change green-text">+73<span className="unit">家</span></div>
          </div>
        </div>
      </div>

      <div className="special-section">
        <h3 className="special-title">“1” 生物医药与医疗器械（合成生物）支柱产业</h3>
        <div className="special-main-card">
          <div className="special-main-left">
            <span className="special-label">生物医药与医疗器械场景</span>
            <div className="special-value">14,331<span className="unit">家</span></div>
          </div>
          <div className="special-main-right">
            <span className="special-label">今日新增</span>
            <div className="special-change green-text">+73<span className="unit">家</span></div>
          </div>
        </div>
      </div>

      <div className="special-section">
        <h3 className="special-title">“5” 个新兴未来产业集群</h3>
        <div className="special-grid-2">
          <div className="special-sub-card">
            <span className="special-label">高端通用设备</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small green-text">今日+12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">新能源装备</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small green-text">今日+12</div>
          </div>
        </div>
        <div className="special-grid-3">
          <div className="special-sub-card">
            <span className="special-label">新材料</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small red-text">今日-12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">低空经济</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small red-text">今日-12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">光电科技</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small red-text">今日-12</div>
          </div>
        </div>
      </div>

      <div className="special-section">
        <h3 className="special-title">“X” 未来新增的潜力产业集群</h3>
        <div className="special-grid-4">
          <div className="special-sub-card">
            <span className="special-label">智能终端</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small blue-text">今日+12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">网络通信</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small blue-text">今日+12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">智能网联汽...</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small blue-text">今日+12</div>
          </div>
          <div className="special-sub-card">
            <span className="special-label">现代纺织...</span>
            <div className="special-value-small">3,245<span className="unit">家</span></div>
            <div className="special-change-small blue-text">今日+12</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FocusScene() {
  const navigate = useNavigate()
  return (
    <section className="card">
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
          <span className="featured-title">数商企业专题场景</span>
          <span className="scene-tag">场景说明</span>
        </div>
        <p className="featured-desc">数据商业化企业专项筛选</p>

        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-top">
              <span className="metric-label">数商企业</span>
              <span className="metric-arrow">→</span>
            </div>
            <div className="metric-bottom">
              <span className="metric-value">21,943<small>家</small></span>
              <span className="metric-today">今日+3</span>
            </div>
          </div>

          <div className="metric-item">
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

import enterpriseDataJson from '../json/enterprise.json'

const KEY_ENTERPRISES = enterpriseDataJson.map((item, index) => ({
  id: item?.['基本信息']?.data?.enterpriseId || index,
  name: item?.['基本信息']?.data?.enterpriseName || '',
  type: item?.['基本信息']?.data?.categoryName || '',
  info: item?.['基本信息']?.data?.reason || ''
}))

function FocusEnterprise() {
  const navigate = useNavigate()
  return (
    <section className="card">
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
        {KEY_ENTERPRISES.map((item) => (
          <div className="key-enterprise-item" key={item.name} onClick={() => navigate(`/company-detail/${item.id}`)} style={{ cursor: 'pointer' }}>
            <div className="key-enterprise-info">
              <div className="key-enterprise-name-row">
                <span className="key-enterprise-name">{item.name}</span>
                <span className="key-enterprise-tag">{item.type}</span>
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

function DataContribution() {
  const navigate = useNavigate()
  return (
    <section className="card">
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
  )
}

function PolicyMatching() {
  const navigate = useNavigate()
  return (
    <section className="card">
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
  )
}

import SparklesIcon from '../assets/Sparkles.svg'
import ZapIcon from '../assets/Zap.svg'
import MessageCircleIcon from '../assets/MessageCircle.svg'
import iconKeyEnterpriseChevron from '../assets/icon-key-enterprise-chevron-right.svg'
import iconKeyEnterpriseChevronItem from '../assets/icon-key-enterprise-chevron-right2.svg'

import assistantAvatar from '../assets/assistant-avatar.svg'
import assistantArrow from '../assets/assistant-arrow.svg'

function AssistantCard({ onClick }) {
  return (
    <div className="assistant-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="assistant-card-inner">
        <div className="assistant-left">
          <div className="assistant-avatar">
            <img src={assistantAvatar} alt="Avatar" />
          </div>
          <div className="assistant-text">
            <div className="assistant-title">墅企小助手</div>
            <div className="assistant-subtitle"> 24小时在线· 即时响应</div>
          </div>
        </div>
        <div className="assistant-right">
          <img src={assistantArrow} alt="Arrow" />
        </div>
      </div>
    </div>
  )
}
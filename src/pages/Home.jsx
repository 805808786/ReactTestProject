import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import Dialog from '../components/Dialog'

const tabs = ['企业总览', '关注场景', '关注企业', '数据贡献', '政策匹配']

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)

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
        <div id="section-0"><EnterpriseOverview /></div>
        <div id="section-1"><FocusScene /></div>
        <div id="section-2"><FocusEnterprise /></div>
        <div id="section-3"><DataContribution /></div>
        <div id="section-4"><PolicyMatching /></div>
      </div>
    </div>
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

function EnterpriseOverview() {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`
  return (
    <section className="card">
      <div className="card-header">
        <span className="card-title">企业总览</span>
        <div className="card-header-right">
          <span className="card-date">{dateStr}</span>
          <Link to="/calendar" className="calendar-tag" style={{ textDecoration: 'none' }}>日历视图</Link>
        </div>
      </div>

      <div className="overview-main">
        <div className="overview-left">
          <div className="overview-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="10" fill="#E6F0FF" />
              <rect x="10" y="20" width="40" height="30" rx="2" fill="#B3D4FF" />
              <rect x="18" y="10" width="24" height="40" rx="2" fill="#5B9EFF" />
              <rect x="22" y="14" width="6" height="6" fill="white" opacity="0.8" />
              <rect x="32" y="14" width="6" height="6" fill="white" opacity="0.8" />
              <rect x="22" y="24" width="6" height="6" fill="white" opacity="0.8" />
              <rect x="32" y="24" width="6" height="6" fill="white" opacity="0.8" />
              <rect x="25" y="38" width="10" height="12" fill="#3A7FD5" />
              <rect x="5" y="28" width="15" height="22" rx="1" fill="#7BB8FF" />
              <rect x="8" y="32" width="4" height="4" fill="white" opacity="0.7" />
              <rect x="8" y="40" width="4" height="4" fill="white" opacity="0.7" />
            </svg>
          </div>
          <div className="overview-info">
            <div className="info-label">
              企业总数
              <span className="info-icon" onClick={() => setIsDialogOpen(true)}>ⓘ</span>
            </div>
            <div className="info-count">139,987<span className="info-unit">家</span></div>
          </div>
        </div>
        <div className="overview-right">
          <button onClick={() => navigate('/enterprise-list')} className="view-all overview-view-all-btn">查看全部 →</button>
        </div>
      </div>

      <div className="overview-change-container">
        <div className="change-card change-green">
          <div className="change-left-content">
            <div className="change-title">总增量（较昨日）</div>
            <div className="change-number">+5<span className="change-unit">家</span></div>
          </div>
        </div>
        <div className="change-card change-gradient">
          <div className="change-header">
            <span className="tag-trend">🔥 变化趋势</span>
            <div className="action-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14.6666 4.66666L8.99992 10.3333L5.66659 6.99999L1.33325 11.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 4.66666H14.6667V8.66666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>查看详细变化</span>
              <span className="arrow-icon">›</span>
            </div>
          </div>
          <div className="change-list">
            <div className="change-item">
              <span className="dot">1</span>
              <span className="item-text">工商信息新注册/新注销企业变化</span>
            </div>
            <div className="change-item">
              <span className="dot">2</span>
              <span className="item-text">商务社区走访新入驻企业</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        title="认定规则"
        content={`一、企业须在拱墅区依法注册
二、企业实际经营地或纳税地在拱墅区`}
      />
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
          <div className="enterprise-item blue-bg">
            <div className="item-header">
              <span className="item-label">拟走访企业</span>
              <span className="item-arrow blue-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value blue-text">2<small>家</small></span>
              <span className="item-sub-label blue-text">今日走访：1家</span>
            </div>
          </div>
          <div className="enterprise-item blue-bg">
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
          <div className="enterprise-item green-bg">
            <div className="item-header">
              <span className="item-label">头部企业动态</span>
              <span className="item-arrow green-text">→</span>
            </div>
            <div className="item-footer">
              <span className="item-value green-text">653<small>条</small></span>
              <span className="item-sub-label green-text">今日+3</span>
            </div>
          </div>
          <div className="enterprise-item purple-bg">
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
          <button onClick={() => navigate('/data-contribution')} className="view-all blue-text view-all-btn">查看全部 →</button>
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
          <a href="#" className="view-all blue-text">查看全部 →</a>
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
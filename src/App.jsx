import { useState } from 'react'
import './App.css'

const tabs = ['企业总览', '关注场景', '关注企业', '数据贡献', '政策匹配']

function App() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="app">
      <Header />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="content">
        <EnterpriseOverview />
        <FocusScene />
        <FocusEnterprise />
        <DataContribution />
        <PolicyMatching />
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
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`

  return (
    <section className="card">
      <div className="card-header">
        <span className="card-title">企业总览</span>
        <span className="card-date">{dateStr}</span>
      </div>

      <div className="overview-main">
        <div className="overview-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
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
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="info-count">139,987<span className="info-unit">家</span></div>
        </div>
        <a href="#" className="view-all">查看全部 →</a>
      </div>

      <div className="overview-change">
        <div className="change-left">
          <div className="change-label">企业变化 <span className="change-tip">（较昨日）</span></div>
          <div className="change-value">+5<span className="change-unit">家</span></div>
        </div>
        <div className="change-right">
          <div className="change-tags">
            <span className="tag tag-orange">变化趋势</span>
            <a href="#" className="tag tag-purple">↑ 查看详细变化 →</a>
          </div>
          <div className="change-list">
            <div className="change-item">
              <span className="change-num">1</span>
              工商信息新注册/新注销企业变化
            </div>
            <div className="change-item">
              <span className="change-num">2</span>
              商务社区走访新入驻企业
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FocusScene() {
  return (
    <section className="card">
      <div className="card-header">
        <span className="section-icon">🎯</span>
        <span className="card-title">关注场景</span>
      </div>

      <div className="scene-card">
        <div className="scene-header">
          <div>
            <div className="scene-title">数商企业专题场景</div>
            <div className="scene-desc">数据商业化企业专项筛选</div>
          </div>
          <button className="scene-btn">场景说明</button>
        </div>
        <div className="scene-stats">
          <div className="scene-stat">
            <div className="stat-label">数商企业</div>
            <div className="stat-arrow">→</div>
            <div className="stat-value blue">21,943<span className="stat-unit">家</span></div>
            <div className="stat-today">今日+3</div>
          </div>
          <div className="scene-stat">
            <div className="stat-label">数商场景动态</div>
            <div className="stat-arrow">→</div>
            <div className="stat-value blue">32<span className="stat-unit">条</span></div>
            <div className="stat-today">今日+3</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FocusEnterprise() {
  return (
    <section className="card">
      <div className="card-header">
        <span className="section-icon star">☆</span>
        <span className="card-title">关注企业</span>
      </div>

      <div className="enterprise-main">
        <div>
          <div className="info-label">关注企业</div>
          <div className="enterprise-count">
            1,987<span className="info-unit">家</span>
            <span className="today-badge">今日+3</span>
          </div>
        </div>
        <a href="#" className="view-all">查看全部 →</a>
      </div>

      <div className="enterprise-grid">
        <div className="grid-item">
          <div className="grid-label">拟走访企业 <span className="grid-arrow">→</span></div>
          <div className="grid-value">2<span className="grid-unit">家</span></div>
          <div className="grid-today">今日走访: 1家</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">企业走访动态 <span className="grid-arrow">→</span></div>
          <div className="grid-value">156<span className="grid-unit">家</span></div>
          <div className="grid-today">今日+3</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">头部企业动态 <span className="grid-arrow">→</span></div>
          <div className="grid-value green">653<span className="grid-unit">条</span></div>
          <div className="grid-today">今日+3</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">腰部企业挖掘 <span className="grid-arrow">→</span></div>
          <div className="grid-value purple">43<span className="grid-unit">家</span></div>
          <div className="grid-today">今日+3</div>
        </div>
      </div>
    </section>
  )
}

function DataContribution() {
  return (
    <section className="card">
      <div className="card-header">
        <span className="section-icon">👥</span>
        <span className="card-title">数据贡献</span>
      </div>

      <div className="contribution-main">
        <div>
          <div className="info-label">总贡献数据条数</div>
          <div className="contribution-count">15,678<span className="info-unit">条</span></div>
        </div>
        <a href="#" className="view-all">查看全部 →</a>
      </div>

      <div className="contribution-stats">
        <div className="contrib-item">
          <div className="contrib-label">参与部门</div>
          <div className="contrib-value blue">12</div>
        </div>
        <div className="contrib-item">
          <div className="contrib-label">平均贡献</div>
          <div className="contrib-value green">1306</div>
        </div>
      </div>
    </section>
  )
}

function PolicyMatching() {
  return (
    <section className="card">
      <div className="card-header">
        <span className="section-icon">📄</span>
        <span className="card-title">政策匹配</span>
      </div>

      <div className="policy-main">
        <div>
          <div className="info-label">匹配企业数</div>
          <div className="policy-count">678<span className="info-unit">家</span></div>
        </div>
        <a href="#" className="view-all">查看全部 →</a>
      </div>

      <div className="policy-progress-section">
        <div className="progress-header">
          <span className="progress-label">政策实施进度</span>
          <span className="progress-badge">进度 85%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: '85%' }} />
        </div>
      </div>
    </section>
  )
}

export default App

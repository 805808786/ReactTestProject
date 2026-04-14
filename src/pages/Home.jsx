import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import Dialog from '../components/Dialog'
import ChatModal from '../components/ChatModal'
import { useEnterpriseStore } from '../store/enterpriseStore'
import { useBottomNavStore } from '../store/bottomNavStore'
import { useChatStore } from '../store/chatStore'
import PageHeader from '../components/PageHeader';
import { getDailyMessageList } from '../api/dailyMessage'

import sceneRadarIcon from '../assets/tabs/redesign/scene-radar.svg'
import specialThemesIcon from '../assets/tabs/redesign/special-themes.svg'
import homeBtnIcon from '../assets/tabs/redesign/home-btn.svg'
import homeBtnUnactiveIcon from '../assets/tabs/redesign/home-btn-unactive.svg'

import dataContributionIcon from '../assets/tabs/redesign/data-contribution.svg'
import policyMatchingIcon from '../assets/tabs/redesign/policy-matching.svg'
import icon115 from '../assets/special-115x/115-badge-icon.svg'
import icon296 from '../assets/special-115x/icon-special-296.svg'
import chevronRightIcon from '../assets/chevron-right.svg'
import starIcon from '../assets/icon-dc-star.svg'
import enterpriseDataJson from '../json/enterprise.json'
import SparklesIcon from '../assets/Sparkles.svg'
import iconAi from '../assets/key-focus-redesign/icon-ai.svg'
import iconKeyEnt from '../assets/key-focus-redesign/icon-key-ent.svg'
import iconChevronList from '../assets/key-focus-redesign/icon-chevron-list.svg'
import ZapIcon from '../assets/Zap.svg'
import MessageCircleIcon from '../assets/MessageCircle.svg'
import iconKeyEnterpriseChevron from '../assets/icon-key-enterprise-chevron-right.svg'
import iconKeyEnterpriseChevronItem from '../assets/icon-key-enterprise-chevron-right2.svg'
import assistantAvatar from '../assets/assistant-avatar.svg'
import assistantArrow from '../assets/assistant-arrow.svg'

import iconTrendUp from '../assets/overview-redesign/icon-trend-up.svg'
import iconSearchInput from '../assets/icon-search-input.svg'
import iconSceneCalendar from '../assets/icon-scene-calendar.svg'
import iconHelpOutline from '../assets/overview-redesign/icon-help-outline.svg'

const bottomTabs = [
  { label: '墅企专题', icon: specialThemesIcon, logicCase: 1 },
  { label: '场景雷达', icon: sceneRadarIcon, logicCase: 3 },
  { label: '首页', icon: homeBtnIcon, unactiveIcon: homeBtnUnactiveIcon, logicCase: 0, isCenter: true },
  { label: '数据贡献', icon: dataContributionIcon, logicCase: 4 },
  { label: '政策匹配', icon: policyMatchingIcon, logicCase: 5 },
]


// cardType → typeClass / label mapping
const CARD_TYPE_HOME_MAP = {
  1: { typeClass: 'recommend', label: '每日推荐' },
  2: { typeClass: 'news', label: '新闻动态' },
  3: { typeClass: 'related', label: '与我相关' },
}

export default function Home() {
  const { activeBottomTab, setActiveBottomTab } = useBottomNavStore()
  const { isChatOpen, setIsChatOpen } = useChatStore()
  const navigate = useNavigate()

  const renderContent = () => {
    const tab = bottomTabs[activeBottomTab];
    switch (tab?.logicCase) {
      case 0:
        return (
          <>

            <AssistantCard onClick={() => setIsChatOpen(true)} />
            <EnterpriseOverview />
            <KeyFocus />
          </>
        )
      case 1:
        return <Special115X />
      case 3:
        return <FocusScene />
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
        <div className="bottom-nav-bg">
          <svg className="bottom-nav-arch" viewBox="0 0 96.632 32" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.316 0 C62.462 0 74.701 8.159 80.586 20.028 C83.756 26.422 89.495 32 96.632 32 L0 32 C7.137 32 12.876 26.422 16.046 20.028 C21.931 8.159 34.17 0 48.316 0 Z" fill="white"/>
          </svg>
        </div>
        {/* 背景切槽装饰 */}
        {/* <div className="bottom-nav-mask">
          <div className="mask-notch"></div>
        </div> */}

        {bottomTabs.map((tab, index) => (
          <div
            key={tab.label}
            className={`bottom-nav-item ${activeBottomTab === index ? 'active' : ''} ${tab.isCenter ? 'center-item' : ''}`}
            onClick={() => setActiveBottomTab(index)}
          >
            <div className="bottom-nav-icon">
              <img
                src={activeBottomTab !== index && tab.unactiveIcon ? tab.unactiveIcon : tab.icon}
                alt={tab.label}
                className={tab.isCenter ? 'center-icon' : 'tab-icon'}
              />
            </div>
            <span className="bottom-nav-label">{tab.label}</span>
          </div>
        ))}
      </div>

      {bottomTabs[activeBottomTab]?.logicCase !== 0 && (
        <div className="floating-assistant-btn" onClick={() => setIsChatOpen(true)}>
          <div className="floating-btn-inner">
            <img src={SparklesIcon} alt="assistant" />
          </div>
          {/* <div className="notification-dot"></div> */}
        </div>
      )}

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}


function KeyFocus() {
  const navigate = useNavigate()

  // --- 今日消息：从 API 获取数据 ---
  const [messageItems, setMessageItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [messageLoaded, setMessageLoaded] = useState(false)

  useEffect(() => {
    getDailyMessageList({ currentPage: 1, pageSize: 999 })
      .then(res => {
        const pageData = res.data || {}
        const items = pageData.data || []
        // 按接口返回顺序取前两条
        const top2 = items.slice(0, 2).map(item => {
          const mapping = CARD_TYPE_HOME_MAP[item.cardType] || { typeClass: 'news', label: '新闻动态' }
          return {
            type: mapping.label,
            typeClass: mapping.typeClass,
            content: item.title || item.content || '',
            detailUrl: `/scene-enterprise-dynamic-detail/${item.id}`,
          }
        })
        setMessageItems(top2)
        setUnreadCount(items.filter(i => i.isRead === false).length)
      })
      .catch(err => {
        console.error('首页今日消息加载失败:', err)
        setMessageItems([])
        setUnreadCount(0)
      })
      .finally(() => setMessageLoaded(true))
  }, [])

  // Enterprise list data from JSON (Top 9)
  const enterprises = enterpriseDataJson.slice(0, 9).map((item, index) => ({
    id: item?.['基本信息']?.data?.enterpriseId || index,
    name: item?.['基本信息']?.data?.enterpriseName || '',
    tag1: (item?.['基本信息']?.data?.categoryName || '重点').replace('企业', ''),
    tag2: '拟走访'
  }))

  return (
    <section className="key-focus-v2">
      {/* 今日消息 card */}
      <div className="kf-message-card">
        <div className="kf-message-header">
          <span className="kf-message-title">今日<span className="kf-message-title-red">消息</span></span>
          <div className="kf-message-count" onClick={() => {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            navigate(`/daily-messages?date=${dateStr}`);
          }} style={{ cursor: 'pointer' }}>
            <span className="kf-message-num">{unreadCount} 条</span>
            {unreadCount > 0 && (
              <span className="kf-message-dot-container">
                <span className="kf-message-dot"></span>
              </span>
            )}
            <span className="kf-message-more">
              {/* 改成svg */}
              <img src={chevronRightIcon} className="kf-message-image" />
            </span>
          </div>
        </div>
        <div className="kf-message-list">
          {messageLoaded && messageItems.length === 0 ? (
            <div className="kf-message-empty">暂无消息</div>
          ) : (
            messageItems.map((message, index) => (
              <div key={index} className="kf-message-item" onClick={() => navigate(message.detailUrl)}>
                <span className={`kf-message-type kf-message-type--${message.typeClass}`}>{message.type}</span>
                <span className="kf-message-content">{message.content}</span>
              </div>
            ))
          )}
        </div>
      </div>


      <div className="kf-card-v2">
        <div className="kf-header-v2">
          <div className="kf-title-v2">当前重点关注</div>
        </div>

        <div className="kf-content-stack">
          {/* AI Section */}
          <div className="kf-section-box ai-box">
            <div className="kf-section-header">
              <div className="kf-section-title-grp">
                <div className="kf-section-icon-bg purple-bg">
                  <img src={iconAi} alt="AI" />
                </div>
                <span className="kf-section-name purple-text">人工智能</span>
              </div>
              <div className="kf-tag-badge purple-badge" onClick={() => navigate('/scene-description/1')}>
                场景说明
              </div>
            </div>
            <div className="kf-stats-grid">
              <div className="kf-stat-item" onClick={() => navigate('/scene-enterprise')}>
                <div className="kf-stat-label">人工智能企业</div>
                <div className="kf-stat-value-row">
                  <span className="kf-stat-num">6,180</span>
                  <span className="kf-stat-unit">家</span>
                  <div className="kf-today-badge green-badge">
                    <span className="kf-dot green-dot"></span>
                    <span className="kf-today-text">今日 +3</span>
                  </div>
                </div>
              </div>
              <div className="kf-stat-item" onClick={() => navigate('/scene-enterprise-dynamic')}>
                <div className="kf-stat-label">场景动态</div>
                <div className="kf-stat-value-row">
                  <span className="kf-stat-num">15</span>
                  <span className="kf-stat-unit">条</span>
                  <div className="kf-today-badge green-badge">
                    <span className="kf-dot green-dot"></span>
                    <span className="kf-today-text">今日 +3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Enterprise Section */}
          <div className="kf-section-box key-ent-box">
            <div className="kf-section-header">
              <div className="kf-section-title-grp">
                <div className="kf-section-icon-bg blue-bg">
                  <img src={iconKeyEnt} alt="KeyEnt" />
                </div>
                <span className="kf-section-name blue-text">重点企业</span>
              </div>
              <div className="kf-tag-badge blue-badge" onClick={() => navigate('/planned-visits')}>
                重点企业说明
              </div>
            </div>
            <div className="kf-stats-grid">
              <div className="kf-stat-item" onClick={() => navigate('/planned-visits')}>
                <div className="kf-stat-label">拟走访企业</div>
                <div className="kf-stat-value-row">
                  <span className="kf-stat-num">9</span>
                  <span className="kf-stat-unit">家</span>
                  <div className="kf-today-badge green-badge">
                    <span className="kf-dot green-dot"></span>
                    <span className="kf-today-text">今日 3</span>
                  </div>
                </div>
              </div>
              <div className="kf-stat-item" onClick={() => navigate('/enterprise-dynamic')}>
                <div className="kf-stat-label">已走访企业</div>
                <div className="kf-stat-value-row">
                  <span className="kf-stat-num">14</span>
                  <span className="kf-stat-unit">家</span>
                  <div className="kf-today-badge green-badge">
                    <span className="kf-dot green-dot"></span>
                    <span className="kf-today-text">今日 +3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise List */}
          <div className="kf-ent-list">
            {enterprises.map((ent) => (
              <div key={ent.id} className="kf-ent-item" onClick={() => navigate(`/company-detail/${ent.id}`)}>
                <div className="kf-ent-info">
                  <span className="kf-ent-name">{ent.name}</span>
                  <span className="kf-ent-tag head-tag">{ent.tag1}</span>
                  <span className="kf-ent-tag visit-tag">{ent.tag2}</span>
                </div>
                <img src={iconChevronList} alt="chevron" className="kf-chevron" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Header() {
  return (
    <PageHeader showBack={false} title={<div className="header">
      <h1 className="header-title">墅企瞭望台</h1>
      <p className="header-subtitle">7*24 超能经济干部</p>
    </div>}>
    </PageHeader>

  )
}


function formatDateCN(date) {
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

function EnterpriseOverview() {
  const navigate = useNavigate()
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)
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
    ? new Date(enterpriseData.changeDate).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
    : today.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')

  const stats = enterpriseData?.statistics || {};
  const newAndMoveIn = (stats.newNum || 0) + (stats.newMoveInNum || 0);

  return (
    <section className="overview-section-v2">
      <div className="overview-container-v2">
        <div className="overview-header-v2">
          <span className="overview-title-v2">企业总览</span>
          <div className="overview-header-right-v2">
            <Link to="/calendar" className="overview-date-v2" style={{ textDecoration: 'none' }}>{displayDate}</Link>
            <button
              className="overview-help-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsHelpDialogOpen(true);
              }}
            >
              企业说明
            </button>
          </div>
        </div>

        <div className="overview-content-v2">
          <div className="overview-left-v2" title="查看日历详情" onClick={() => navigate('/calendar')}>
            {/* Main Stats: Total Number */}
            <div className="overview-main-stats-v2">
              <div className="overview-total-v2">
                <span className="total-num-v2">
                  {loading ? '--' : (todayTotal !== undefined && todayTotal !== null ? Number(todayTotal).toLocaleString() : '139,987')}
                </span>
                <span className="total-unit-v2">家</span>
              </div>
            </div>

            {/* Trend Badge */}
            <div className="overview-trend-v2">
              <div className="trend-badge-v2">
                <img src={iconTrendUp} alt="up" className="trend-icon-v2" />
                <span className="trend-text-v2">较昨日 {loading ? '--' : (changeNum >= 0 ? `+${changeNum}` : changeNum)}</span>
              </div>
            </div>
          </div>

          <div className="overview-right-v2">
            <div className="daily-changes-card-v2">
              <div className="daily-title-v2">每日变化</div>
              <div className="daily-list-v2">
                <div className="daily-item-v2">
                  <span className="daily-label-v2">新注册/迁入</span>
                  <span className="daily-value-v2 pos">+{loading ? '--' : (newAndMoveIn || 0)}</span>
                </div>
                <div className="daily-item-v2">
                  <span className="daily-label-v2">注销/吊销</span>
                  <span className="daily-value-v2 neg">-{loading ? '--' : Math.abs(stats.cancelNum || 0)}</span>
                </div>
                <div className="daily-item-v2">
                  <span className="daily-label-v2">规则性调整</span>
                  <span className="daily-value-v2 other-val">{loading ? '--' : (stats.otherNum || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isHelpDialogOpen}
        onClose={() => setIsHelpDialogOpen(false)}
        title="拱墅区企业定义"
        content={`企业须满足以下其一：\n\n1、在册企业\n住所（注册地址）在拱墅区行政区域内（即含有“拱墅”“下城”，或拱墅区下属街道、楼宇、道路名称的）\n\n2、在地不在册企业\n住所不在上述范围，但经营场所符合上述条件`}
      />
    </section>
  )
}


function Special115X() {
  const [activeSubTab, setActiveSubTab] = useState(0)
  const ref115 = useRef(null)
  const ref296 = useRef(null)

  const scrollToSection = (index) => {
    setActiveSubTab(index)
    const target = index === 0 ? ref115 : ref296
    if (target.current) {
      target.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="special-themes-container">
      {/* 顶部切换 Tab - Sticky */}
      <div className="special-sub-tabs">
        <div
          className={`sub-tab-item ${activeSubTab === 0 ? 'active' : ''}`}
          onClick={() => scrollToSection(0)}
        >
          <span>115X专题</span>
          {activeSubTab === 0 && <div className="sub-tab-line" />}
        </div>
        <div
          className={`sub-tab-item ${activeSubTab === 1 ? 'active' : ''}`}
          onClick={() => scrollToSection(1)}
        >
          <span>296X专题</span>
          {activeSubTab === 1 && <div className="sub-tab-line" />}
        </div>
      </div>

      <div className="special-themes-content">
        {/* 115X 专题模块 */}
        <section className="special-115x-view" ref={ref115}>
          <div className="special-header-card">
            <div className="special-badge-box">
              <img src={icon115} alt="115 badge" />
            </div>
            <h2 className="special-main-title">拱墅特色115X专题</h2>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“1”人工智能（集成电路）核心产业集群</div>
            <div className="cluster-metric-card blue-metric">
              <div className="metric-left">
                <div className="metric-name">人工智能场景</div>
                <div className="metric-total">618<small>家</small></div>
              </div>
              <div className="metric-right">
                <div className="metric-change-label">今日新增</div>
                <div className="metric-change-value">+73<small>家</small></div>
              </div>
            </div>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“1”生物医药与医疗器械（合成生物）支柱产业</div>
            <div className="cluster-metric-card blue-metric">
              <div className="metric-left">
                <div className="metric-name">生物医药与医疗器械场景</div>
                <div className="metric-total">250<small>家</small></div>
              </div>
              <div className="metric-right">
                <div className="metric-change-label">今日新增</div>
                <div className="metric-change-value">+73<small>家</small></div>
              </div>
            </div>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“5”个新兴未来产业集群</div>
            <div className="cluster-grid-row">
              <div className="cluster-sub-card">
                <div className="sub-card-name">高端通用设备</div>
                <div className="sub-card-total">106<small>家</small></div>
                <div className="sub-card-today up">今日+12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">新能源装备</div>
                <div className="sub-card-total">119<small>家</small></div>
                <div className="sub-card-today up">今日+12</div>
              </div>
            </div>
            <div className="cluster-grid-row" style={{ marginTop: '8px' }}>
              <div className="cluster-sub-card">
                <div className="sub-card-name">新材料</div>
                <div className="sub-card-total">160<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">低空经济</div>
                <div className="sub-card-total">96<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">光电科技</div>
                <div className="sub-card-total">288<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
            </div>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“X”未来新增的潜力产业集群</div>
            <div className="cluster-grid-row wrap">
              <div className="cluster-sub-card mini">
                <div className="sub-card-name">智能终端</div>
                <div className="sub-card-total">60<small>家</small></div>
                <div className="sub-card-today">今日+12</div>
              </div>
              <div className="cluster-sub-card mini">
                <div className="sub-card-name">网络通信</div>
                <div className="sub-card-total">95<small>家</small></div>
                <div className="sub-card-today">今日+12</div>
              </div>
              <div className="cluster-sub-card mini">
                <div className="sub-card-name">智能网联汽..</div>
                <div className="sub-card-total">76<small>家</small></div>
                <div className="sub-card-today">今日+12</div>
              </div>
              <div className="cluster-sub-card mini">
                <div className="sub-card-name">现代纺织与服装</div>
                <div className="sub-card-total">284<small>家</small></div>
                <div className="sub-card-today">今日+12</div>
              </div>
            </div>
          </div>
        </section>

        {/* 296X 专题模块 */}
        <section className="special-115x-view" ref={ref296} style={{ marginTop: '16px' }}>
          <div className="special-header-card">
            <div className="special-badge-box">
              <img src={icon296} alt="296 badge" />
            </div>
            <h2 className="special-main-title">拱墅特色296X专题</h2>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“2”打造2个万亿级产业集群</div>
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
            <div className="cluster-metric-card blue-metric" style={{ marginTop: '8px' }}>
              <div className="metric-left">
                <div className="metric-name">视觉智能场景</div>
                <div className="metric-total">14,331<small>家</small></div>
              </div>
              <div className="metric-right">
                <div className="metric-change-label">今日新增</div>
                <div className="metric-change-value">+73<small>家</small></div>
              </div>
            </div>
          </div>

          <div className="special-cluster-group">
            <div className="cluster-title">“9”提升9个千亿级产业集群</div>
            <div className="cluster-grid-row">
              <div className="cluster-sub-card">
                <div className="sub-card-name">集成电路</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today up">今日+12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">生物医药与企业</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today up">今日+12</div>
              </div>
            </div>
            <div className="cluster-grid-row" style={{ marginTop: '8px' }}>
              <div className="cluster-sub-card">
                <div className="sub-card-name">网络通信</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">智能网联汽车</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">新能源装备</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
            </div>
            <div className="cluster-grid-row" style={{ marginTop: '8px' }}>
              <div className="cluster-sub-card">
                <div className="sub-card-name">新材料</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">高端通用设备</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
              <div className="cluster-sub-card">
                <div className="sub-card-name">现代纺织与服装</div>
                <div className="sub-card-total">3,245<small>家</small></div>
                <div className="sub-card-today down">今日-12</div>
              </div>
            </div>
            <div className="cluster-metric-card blue-metric" style={{ marginTop: '8px' }}>
              <div className="metric-left">
                <div className="metric-name">智能机器人</div>
                <div className="metric-total">14,331<small>家</small></div>
              </div>
              <div className="metric-right">
                <div className="metric-change-label">今日新增</div>
                <div className="metric-change-value">+73<small>家</small></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


const SCENE_DATA = [
  {
    id: 1,
    name: '人工智能企业筛选场景',
    description: '人工智能企业筛选',
    subName: "人工智能企业动态",
    enterprises: 6262,
    dynamics: 32,
    todayEnterprises: 3,
    todayDynamics: 3,
  },
  {
    id: 2,
    name: '115X专题企业筛选场景',
    description: '115X专项企业筛选',
    subName: "115X专项企业动态",
    enterprises: 18765,
    dynamics: 28,
    todayEnterprises: 2,
    todayDynamics: 1,
  },
  {
    id: 3,
    name: '数据产业专题筛选场景',
    description: '数据产业专项筛选',
    subName: "数据产业专项动态",
    enterprises: 21512,
    dynamics: 45,
    todayEnterprises: 5,
    todayDynamics: 4,
  },
  {
    id: 4,
    name: '党建企业专题场景',
    description: '党建企业专项筛选',
    subName: "党建企业专项动态",
    enterprises: 350,
    dynamics: 23,
    todayEnterprises: 1,
    todayDynamics: 2,
  },
  {
    id: 5,
    name: '出海企业专题场景',
    description: '出海企业专项筛选',
    subName: "出海企业专项动态",
    enterprises: 9876,
    dynamics: 19,
    todayEnterprises: 3,
    todayDynamics: 1,
  },

];


function FocusScene() {
  const navigate = useNavigate()
  return (
    <section className="card focus-scene-view">
      <div className="card-header">
        <div className="card-header-left">
          <div className="title-icon scene-icon-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#9810FA" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="#9810FA" strokeWidth="2" />
              <circle cx="12" cy="12" r="2" fill="#9810FA" />
            </svg>
          </div>
          <span className="card-title">场景雷达</span>
        </div>
      </div>

      <div className="home-search-row">
        <div className="home-search-bar">
          <img src={iconSearchInput} alt="icon" className="search-icon" />
          <input type="text" placeholder="搜索场景名称" className="search-input" />
        </div>
        <button className="home-calendar-btn" onClick={() => navigate('/scene-calendar')}>场景日历</button>
      </div>

      <div className="home-stats-row">
        <div className="home-stat-card outline">
          <div className="stat-label">场景总数</div>
          <div className="stat-value">5</div>
        </div>
        <div className="home-stat-card solid">
          <div className="stat-label">企业总数</div>
          <div className="stat-value">28,124</div>
        </div>
        <div className="home-stat-card solid">
          <div className="stat-label">场景动态</div>
          <div className="stat-value">670</div>
        </div>
      </div>

      {/* <div className="scene-summary-card" onClick={() => navigate('/scene-radar')}>
        <div className="summary-left">
          <div className="summary-label">场景雷达</div>
          <div className="summary-value">5<small>个</small></div>
        </div>
        <div className="summary-right">
          <span className="view-all-link">查看全部 →</span>
        </div>
      </div> */}

      <div className="scene-list-container">
        {SCENE_DATA.map((scene) => (
          <div className="scene-item-card" key={scene.id}>
            <div className="scene-item-header">
              <div className="scene-item-title-box">
                <h3 className="scene-item-title">{scene.name}</h3>
                {scene.id != 5 && <span className="scene-item-badge" onClick={() => navigate(`/scene-description/${scene.id}`)}>场景说明</span>}
              </div>
              <p className="scene-item-desc">{scene.description}</p>
            </div>

            <div className="scene-item-metrics">
              <div className="scene-metric-box" onClick={() => { scene.id == 1 && navigate('/scene-enterprise') }}>
                <div className="metric-row-top">
                  <span className="metric-name">人工智能企业</span>
                  <span className="metric-arrow">→</span>
                </div>
                <div className="metric-row-bottom">
                  <span className="metric-val">{scene.enterprises.toLocaleString()}<small>家</small></span>
                  <span className="metric-delta">今日+{scene.todayEnterprises}</span>
                </div>
              </div>
              <div className="scene-metric-box" onClick={() => { scene.id == 1 && navigate('/scene-enterprise-dynamic') }}>
                <div className="metric-row-top">
                  <span className="metric-name">{scene.subName}</span>
                  <span className="metric-arrow">→</span>
                </div>
                <div className="metric-row-bottom">
                  <span className="metric-val">{scene.dynamics}<small>条</small></span>
                  <span className="metric-delta">今日+{scene.todayDynamics}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E17100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
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
              <span className="item-value blue-text">7<small>家</small></span>
              <span className="item-sub-label blue-text">今日+2</span>
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
                fill="#155DFC"
              />
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

        <line x1={85} y1={5} x2={85} y2={165} stroke="#666666" strokeWidth="1" />

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

        <line x1={82} y1={165} x2={375} y2={165} stroke="#666666" strokeWidth="1" />

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

function DataContribution() {
  const navigate = useNavigate()
  return (
    <>
      <section className="card focus-scene-view">
        <div className="card-header">
          <div className="card-header-left">
            <div className="title-icon contribution-icon-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
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
            {/* <button onClick={() => navigate('/data-contribution')} className="view-all blue-text">查看全部 →</button> */}
          </div>
        </div>

        <div className="contribution-grid">
          <div className="contribution-item blue-bg2">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
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


import assistantAvatarNew from '../assets/overview-redesign/assistant-avatar-new.png'
// import SparklesIcon from '../assets/Sparkles.svg'
import iconAsstSearch from '../assets/overview-redesign/icon-asst-search.svg'

function AssistantCard({ onClick }) {
  return (
    <div className="assistant-card" onClick={onClick}>
      <div className="assistant-card-content">
        <div className="assistant-main-title">墅企小助手</div>
        <div className="assistant-search-bar">
          <img src={iconAsstSearch} alt="icon" className="asst-search-icon" />
          <span className="asst-search-placeholder">墅企瞭望 · 一问知企 · 即时响应</span>
        </div>
      </div>
      <div className="assistant-avatar-box">
        <img src={SparklesIcon} alt="avatar" />
        {/* <div className="assistant-avatar-box-unread">4</div> */}
      </div>
    </div>
  )
}
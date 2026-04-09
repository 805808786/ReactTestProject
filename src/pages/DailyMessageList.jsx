import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ChatInfoCard from '../components/ChatInfoCard'
import './DailyMessageList.css'

const DAILY_MESSAGES = [
  {
    id: 'card-news',
    category: 'news',
    tagText: '新闻动态',
    hasNotification: true,
    dotColor: '#10BA51',
    title: '竣工！大城北再添“产业新引擎”',
    subTag: null,
    description: '近日，杭州城投·未来500⁺一期首发项目成功取得《建设工程竣工验收备案表》，标志着该项目已全面具备投产运营条件，为杭州大城北再添一座高品质产业载体，为产业升级注入新动能，助力区域产业能级实现新提升。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/5',
  },
  {
    id: 'card-related',
    category: 'related',
    tagText: '与我相关',
    hasNotification: true,
    dotColor: '#3B82F6',
    title: '区领导带队赴上海开展招商考察活动',
    subTag: null,
    description: '3月31日至4月1日，区委副书记、区长陈宇带队赴上海开展招商考察活动。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/6',
  },
  {
    id: 'card-recommend',
    category: 'recommend',
    tagText: '每日推荐',
    hasNotification: true,
    dotColor: '#F59E0B',
    title: '杭州杭钢云计算数据中心有限公司',
    subTag: null,
    description: '杭州杭钢云计算数据中心有限公司是杭钢集团数字经济转型骨干企业。其数据中心（东区）入选国家绿色数据中心，PUE值控制在1.30以下，走在全国前列，利用老厂房改造实现"从炼钢到炼数"的绿色升级。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/4',
  },
  {
    id: 'card-service',
    category: 'service',
    tagText: '精准服务',
    hasNotification: true,
    dotColor: null,
    title: '杭州太希智能科技有限公司',
    subTag: { text: '腰部企业' },
    description: '该企业在快速发展阶段，需要规模以上（人工智能）工业和服务业企业认定与入统指导。',
    timeAgo: '2小时前',
    detailUrl: '/precise-service-detail/1',
  },

]

function formatDateCN(date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export default function DailyMessageList() {
  const navigate = useNavigate()
  const today = formatDateCN(new Date())

  return (
    <div className="daily-msg-page">
      <PageHeader title="今日消息" showBack={true} />
      {/* <div className="daily-msg-meta">
        <span className="daily-msg-date">{today}</span>
        <span className="daily-msg-total">共 {DAILY_MESSAGES.length} 条</span>
      </div> */}
      <div className="daily-msg-list">
        {DAILY_MESSAGES.map(card => (
          <ChatInfoCard
            key={card.id}
            card={card}
            onNavigate={(url) => navigate(url)}
          />
        ))}
      </div>
    </div>
  )
}

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
    title: '头部药企迁入拱墅',
    subTag: null,
    description: '近日，拱墅生物医药产业迎来重磅消息：基因编辑领域头部创新药研发企业——上海本导基因技术有限公司正式完成迁址，从上海市闵行区迁入拱墅，并入驻区国投集团旗下凤栖谷华章产业园。公司同步更名为杭州本导生物医药科技有限公司。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/5',
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
  {
    id: 'card-related',
    category: 'related',
    tagText: '与我相关',
    hasNotification: true,
    dotColor: '#3B82F6',
    title: '敖煜新赴区信访局接待来访群众',
    subTag: null,
    description: '摘4月1日下午，区委书记敖煜新赴区信访局接待来访群众，面对面倾听诉求，现场协调解决问题。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/6',
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

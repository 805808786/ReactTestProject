import { useNavigate, useLocation } from 'react-router-dom'
import iconDcBack from '../assets/icon-dc-back.svg'
import iconPcStar from '../assets/icon-pc-star.svg'
import iconPcCalendar from '../assets/icon-pc-calendar.svg'
import iconPcBuilding from '../assets/icon-pc-building.svg'
import iconPcFiletext from '../assets/icon-pc-filetext.svg'
import iconPcAward from '../assets/icon-pc-award.svg'
import iconPcMessage from '../assets/icon-pc-message.svg'
import './PersonContribution.css'

/* ==================== Mock 贡献记录数据 ==================== */
const CONTRIBUTION_RECORDS = [
  {
    id: 1,
    type: '企业走访',
    typeColor: 'walk',
    quality: '优秀',
    date: '2026-03-04',
    company: '科技创新有限公司',
    desc: '走访科技创新有限公司，了解企业研发进展，收集政策需求3条，协助解决融资问题',
    review: {
      score: 5,
      reviewer: '王局长',
      time: '2026-03-04 16:30',
      comment: '走访深入细致，问题梳理清晰，后续跟进及时有效',
    },
  },
  {
    id: 2,
    type: '数据更新',
    typeColor: 'update',
    quality: '优秀',
    date: '2026-03-03',
    company: null,
    desc: '更新辖区高新技术企业名录，新增企业5家，更新企业信息23条',
    review: {
      score: 5,
      reviewer: '李主任',
      time: '2026-03-03 14:20',
      comment: '数据准确完整，更新及时',
    },
  },
  {
    id: 3,
    type: '政策匹配',
    typeColor: 'policy',
    quality: null,
    date: '2026-03-02',
    company: '多家企业',
    desc: '完成12家企业的高新技术补贴政策匹配分析，提出针对性建议',
    review: null,
  },
  {
    id: 4,
    type: '企业走访',
    typeColor: 'walk',
    quality: '优秀',
    date: '2026-02-28',
    company: '腾飞科技股份有限公司',
    desc: '走访腾飞科技，收集企业发展诉求，梳理政策申报材料，提供一对一辅导',
    review: {
      score: 5,
      reviewer: '刘科长',
      time: '2026-02-28 11:00',
      comment: '服务贴心周到，企业满意度高',
    },
  },
  {
    id: 5,
    type: '数据更新',
    typeColor: 'update',
    quality: null,
    date: '2026-02-25',
    company: null,
    desc: '录入本月新增企业数据42条，涵盖工商注册、税务登记等基础信息',
    review: null,
  },
  {
    id: 6,
    type: '政策匹配',
    typeColor: 'policy',
    quality: '优秀',
    date: '2026-02-20',
    company: '绿能环保科技有限公司',
    desc: '为绿能环保科技匹配环保专项补贴及税收优惠政策，协助完成申报材料',
    review: {
      score: 4,
      reviewer: '王局长',
      time: '2026-02-20 15:45',
      comment: '材料规范，政策理解到位',
    },
  },
  {
    id: 7,
    type: '企业走访',
    typeColor: 'walk',
    quality: null,
    date: '2026-02-18',
    company: '恒远建筑工程有限公司',
    desc: '走访恒远建筑，了解企业资质升级需求，协助收集相关证明材料',
    review: null,
  },
]

/* ==================== 贡献记录条目 ==================== */
function RecordItem({ record }) {
  return (
    <div className="pc-record-wrapper">
      {/* 主卡片 */}
      <div className="pc-record-card">
        {/* 顶部：标签 + 信息 + 内容 */}
        <div className="pc-record-top">
          {/* 标签行 */}
          <div className="pc-record-tags">
            <span className={`pc-type-tag pc-type-tag--${record.typeColor}`}>{record.type}</span>
            {record.quality && (
              <span className="pc-quality-tag">{record.quality}</span>
            )}
          </div>

          {/* 元信息行：日期 + 企业 */}
          <div className="pc-record-meta">
            <img src={iconPcCalendar} alt="date" width={12} height={12} className="pc-meta-icon" />
            <span className="pc-meta-text">{record.date}</span>
            {record.company && (
              <>
                <span className="pc-meta-sep">·</span>
                <img src={iconPcBuilding} alt="company" width={12} height={12} className="pc-meta-icon" />
                <span className="pc-meta-text">{record.company}</span>
              </>
            )}
          </div>

          {/* 内容区 */}
          <div className="pc-record-content">
            <img src={iconPcFiletext} alt="content" width={16} height={16} className="pc-content-icon" />
            <p className="pc-record-desc">{record.desc}</p>
          </div>
        </div>

        {/* 评价区 */}
        {record.review && (
          <div className="pc-record-review">
            <div className="pc-review-row">
              {/* 评分 */}
              <div className="pc-review-score">
                <img src={iconPcAward} alt="award" width={16} height={16} />
                <span className="pc-review-score-val">{record.review.score}</span>
                <img src={iconPcStar} alt="star" width={16} height={16} />
              </div>

              {/* 评价者信息 */}
              <div className="pc-review-info">
                <div className="pc-review-meta">
                  <span className="pc-reviewer-name">{record.review.reviewer}</span>
                  <span className="pc-reviewer-time">{record.review.time}</span>
                </div>
                <p className="pc-review-comment">{record.review.comment}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 评价按钮区 */}
      <div className="pc-eval-section">
        <button className="pc-eval-btn">
          <img src={iconPcMessage} alt="evaluate" width={16} height={16} />
          <span className="pc-eval-text">评价该条数据</span>
        </button>
      </div>
    </div>
  )
}

/* ==================== 主页面 ==================== */
export default function PersonContribution() {
  const navigate = useNavigate()
  const location = useLocation()
  const { person = {}, deptName = '' } = location.state || {}

  const name = person.name || '张三'
  const role = person.role || '科长'
  const star = person.star ?? 4.8
  const value = person.value ?? 456

  return (
    <div className="pc-container">
      {/* ========== 顶部导航栏 ========== */}
      <div className="pc-header-topbar">
        <button className="pc-back-btn" onClick={() => navigate(-1)} aria-label="返回">
          <img src={iconDcBack} alt="返回" width={36} height={32} />
        </button>
        <span className="pc-header-title">数据贡献</span>
      </div>

      {/* ========== 人员信息区 ========== */}
      <div className="pc-person-section">
        {/* 姓名 + 职务 + 评分 */}
        <div className="pc-person-row">
          {/* 左侧：姓名 + 职务 */}
          <div className="pc-person-left">
            <div className="pc-person-name">{name}</div>
            <div className="pc-person-role-row">
              <span className="pc-person-role">{role}</span>
              <span className="pc-role-sep">·</span>
              <span className="pc-person-dept">{deptName}</span>
            </div>
          </div>

          {/* 右侧：星级 + 评分 */}
          <div className="pc-person-right">
            <div className="pc-star-row">
              <img src={iconPcStar} alt="star" width={20} height={20} />
              <span className="pc-star-val">{star}</span>
            </div>
            <div className="pc-star-label">综合评分</div>
          </div>
        </div>

        {/* 累计贡献卡片 */}
        <div className="pc-cumulative-card">
          <div className="pc-cumulative-label">累计数据贡献</div>
          <div className="pc-cumulative-val">{value} 条</div>
        </div>
      </div>

      {/* ========== 贡献记录列表 ========== */}
      <div className="pc-records-section">
        <div className="pc-records-header">
          <span className="pc-records-title">数据贡献记录 ({CONTRIBUTION_RECORDS.length})</span>
        </div>
        <div className="pc-records-list">
          {CONTRIBUTION_RECORDS.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </div>
      </div>
    </div>
  )
}

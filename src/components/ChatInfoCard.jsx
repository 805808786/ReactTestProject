import React from 'react'
import CalendarIcon from '../assets/icon-cd-calendar.svg'
import './ChatInfoCard.css'

export default function ChatInfoCard({ card, onNavigate }) {
  const {
    category,
    tagText,
    hasNotification,
    dotColor,
    title,
    subTag,
    description,
    timeAgo,
    detailUrl,
  } = card

  const handleClick = () => {
    if (onNavigate && detailUrl) {
      onNavigate(detailUrl)
    }
  }

  return (
    <div className="chat-card" onClick={handleClick}>
      <div className="chat-card-header">
        <span className={`chat-card-tag chat-card-tag--${category}`}>{tagText}</span>
        <span className="chat-card-detail-link">
          {hasNotification && <span className="chat-card-red-dot" />}
          查看详情 →
        </span>
      </div>

      {subTag && (
        <div className="chat-card-sub-tag-row">
          <span className="chat-card-sub-tag">{subTag.text}</span>
          <span className="chat-card-title" style={{ marginBottom: 0 }}>{title}</span>
        </div>
      )}

      {!subTag && (
        <div className="chat-card-title">
          {dotColor && <span className="chat-card-dot" style={{ background: dotColor }} />}
          {title}
        </div>
      )}

      <div className={`chat-card-desc`}>
        {category == 'recommend' ? <span className="chat-card-desc--bold">推荐理由：</span>
          : (category == 'news' || category == 'related') ? <span className="chat-card-desc--bold">摘要: </span>
            : null}
        {description}
      </div>

      <div className="chat-card-footer">
        <img src={CalendarIcon} alt="" className="chat-card-calendar-icon" />
        <span className="chat-card-time">{timeAgo}</span>
      </div>
    </div>
  )
}

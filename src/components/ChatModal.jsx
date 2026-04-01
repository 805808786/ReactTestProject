import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, Bot, User, Send } from 'lucide-react'
import IconBackWhite from '../assets/icon-back-white.svg'
import SparklesIcon from '../assets/Sparkles.svg'
import ChatInfoCard from './ChatInfoCard'
import './ChatModal.css'
import IconNewChat from '../assets/icon-new-chat.svg?react'

const INITIAL_CARDS = [
  {
    id: 'card-recommend',
    category: 'recommend',
    tagText: '今日推荐',
    hasNotification: true,
    dotColor: '#F59E0B',
    title: '拱墅科技有限公司',
    subTag: null,
    description: '该企业刚刚被中央领导走访调研并列为全国重点标杆企业。是本辖区内龙头企业。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/4',
  },
  {
    id: 'card-news',
    category: 'news',
    tagText: '新闻动态',
    hasNotification: true,
    dotColor: '#3B82F6',
    title: '拱墅数商产业园正式启动,多家企业入驻',
    subTag: null,
    description: '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/5',
  },
  {
    id: 'card-service',
    category: 'service',
    tagText: '精准服务',
    hasNotification: false,
    dotColor: null,
    title: '拱墅科技有限公司',
    subTag: { text: '腰部企业' },
    description: '近3个月税收增长超50%，且税收金额达到30万元。技术研发投入占比达45%，具备快速成长为腰部企业潜力。',
    timeAgo: '2小时前',
    detailUrl: '/precise-service-detail/1',
  },
  {
    id: 'card-related',
    category: 'related',
    tagText: '与我相关',
    hasNotification: false,
    dotColor: '#3B82F6',
    title: '敖煜新调研督导物业服务领域信访问题...',
    subTag: null,
    description: '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
    timeAgo: '2小时前',
    detailUrl: '/scene-enterprise-dynamic-detail/6',
  },
]

const initialMessages = [
  //   { id: 1, type: 'bot', text: '您好！我是墅企小助手，有什么可以帮助您的吗？', time: '13:56' },
  //   { id: 2, type: 'user', text: '浙江云鹭科技有限公司是省科小企业吗？？', time: '13:56' },
]

export default function ChatModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved messages', e)
        return []
      }
    }
    return []
  })
  const [chatId, setChatId] = useState(() => {
    return localStorage.getItem('chat_id') || ''
  })
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (isOpen) {
      // 刚打开时瞬间滚动到底部
      setTimeout(() => scrollToBottom('auto'), 10)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, isTyping])

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return
    setIsSending(true)

    // 获取当前 chatId，若不存在则生成并持久化
    let currentChatId = chatId
    if (!currentChatId) {
      currentChatId = generateRandomId()
      setChatId(currentChatId)
      localStorage.setItem('chat_id', currentChatId)
    }

    const currentInput = inputValue
    const now = new Date()
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      text: currentInput,
      time: timeString
    }

    setMessages(prev => [...prev, newUserMsg])
    setInputValue('')
    setIsTyping(true)

    const botMsgId = Date.now() + 1
    const newBotMsg = {
      id: botMsgId,
      type: 'bot',
      text: '',
      time: timeString
    }

    try {
      const response = await fetch('/chatProxy/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fastgpt-fpxpLb7XwNCk0l61rpOfhZIa775gqV0MgGNolunhzQf3KlfKTIMWpvRCJsXhwApeY'
        },
        body: JSON.stringify({
          chatId: currentChatId,
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: currentInput }],
          stream: true,
          "variables": {
            "internet": false,
            "knowledge": true,
            "enterpriseData": true,
            "knowledgeList": [
              "2001109186508312577"
            ],
            "model": "deepseek-chat",
            "url": "",
            "tenantCodes": ['other']
          }
        })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      setIsTyping(false)
      setMessages(prev => [...prev, newBotMsg])

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      let botText = ''
      let buffer = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine.startsWith('data: ')) {
              const dataString = trimmedLine.slice(6)
              if (dataString === '[DONE]') continue
              try {
                const data = JSON.parse(dataString)
                const content = data.choices?.[0]?.delta?.content || ''
                if (content) {
                  botText += content
                  setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId ? { ...msg, text: botText } : msg
                  ))
                }
              } catch (e) {
                console.error('Error parsing stream data', e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chat response:', error)
      setIsTyping(false)
      setMessages(prev => {
        // 防止之前已经加上了空白 bot message
        const withoutEmpty = prev.filter(msg => msg.id !== botMsgId)
        return [...withoutEmpty, {
          id: botMsgId,
          type: 'bot',
          text: '抱歉，服务出现异常，请稍后再试。',
          time: timeString
        }]
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    const newChatId = generateRandomId()
    setChatId(newChatId)
    setMessages([])
    localStorage.setItem('chat_id', newChatId)
    localStorage.setItem('chat_messages', JSON.stringify([]))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-container" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="chat-header-cm chat-header-cm-small">
          {/* 顶部导航栏 */}
          <div className="chat-nav-bar-container">
            <div className="chat-nav-bar">
              <button className="chat-nav-btn" onClick={onClose}>
                <img src={IconBackWhite} alt="back" />
              </button>
              <div className="chat-nav-title">墅企小助手</div>
            </div>
            {/* <button className="chat-nav-btn">
              <History size={20} color="white" />
            </button> */}
            <div className="chat-nav-action">
              <button className="chat-nav-btn" onClick={handleNewChat}>
                <IconNewChat className="chat-nav-icon" />
              </button>
              {/* <button className="chat-nav-btn">
                <History size={20} color="white" />
              </button> */}
            </div>
          </div>

          {/* 英雄区域 */}
          {messages.length === 0 ? (
            <div className="chat-hero-section">
              <img className="chat-robot-avatar" src={SparklesIcon} alt="robot" />
              <div className='chat-txt-wrapper'>
                <div className="chat-hero-greeting">
                  Hi，我是<span className="chat-hero-highlight">拱墅企业助手</span>
                </div>
                <div className="chat-hero-subtitle">为您提供最新的企业资讯</div>
              </div>
            </div>
          ) :
            <img className="chat-robot-small-avatar" src={SparklesIcon} alt="robot" />
          }
        </div>

        {/* 聊天内容区 */}
        <div className="chat-body-cm">
          {/* 静态欢迎卡片 - 始终显示 */}
          <div className="chat-message msg-bot">
            {/* <div className="avatar bot-avatar">
              <Bot size={20} color="#155DFC" strokeWidth={1.5} />
            </div> */}
            <div className="msg-content-wrapper msg-content-wrapper--cards">
              <div className="msg-cards-label">拱墅企业小助手：</div>
              <div className="msg-cards-list">
                {INITIAL_CARDS.map(card => (
                  <ChatInfoCard
                    key={card.id}
                    card={card}
                    onNavigate={(url) => { onClose(); navigate(url); }}
                  />
                ))}
              </div>
            </div>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.type === 'user' ? 'msg-user' : 'msg-bot'}`}>
              {msg.type === 'bot' && (
                <div className="avatar bot-avatar">
                  <Bot size={20} color="#155DFC" strokeWidth={1.5} />
                </div>
              )}

              <div className="msg-content-wrapper">
                <div className="msg-bubble">
                  {msg.text.trim() ? msg.text.replace(/<br\s*\/?>/gi, '\n') : '思考中...'}
                </div>
                <div className="msg-time">{msg.time}</div>
              </div>

              {msg.type === 'user' && (
                <div className="avatar user-avatar">
                  <User size={20} color="white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-message msg-bot">
              <div className="avatar bot-avatar">
                <Bot size={20} color="#155DFC" strokeWidth={1.5} />
              </div>
              <div className="msg-content-wrapper">
                <div className="msg-bubble type-indicator">
                  思考中...
                </div>
                <div className="msg-time">{`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`}</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入框 */}
        <div className="chat-footer-cm">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="输入您的问题..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`send-btn ${inputValue.trim() && !isSending ? 'active' : ''} ${isSending ? 'loading' : ''}`}
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? <span className="send-btn-spinner" /> : <Send size={16} color="white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

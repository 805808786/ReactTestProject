import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { History, Bot, User, Send } from 'lucide-react'
import IconBackWhite from '../assets/icon-back-white.svg'
import SparklesIcon from '../assets/Sparkles.svg'
import ChatInfoCard from './ChatInfoCard'
import './ChatModal.css'
import IconNewChat from '../assets/icon-new-chat.svg?react'
import headerBgSmall from '../assets/header-bg-3979f0.png'

// const INITIAL_CARDS = [
//   {
//     id: 'card-recommend',
//     category: 'recommend',
//     tagText: '每日推荐',
//     hasNotification: true,
//     dotColor: '#F59E0B',
//     title: '杭州杭钢云计算数据中心有限公司',
//     subTag: null,
//     description: '杭州杭钢云计算数据中心有限公司是杭钢集团数字经济转型骨干企业。其数据中心（东区）入选国家绿色数据中心，PUE值控制在1.30以下，走在全国前列，利用老厂房改造实现“从炼钢到炼数”的绿色升级。',
//     timeAgo: '2小时前',
//     detailUrl: '/scene-enterprise-dynamic-detail/4',
//   },
//   {
//     id: 'card-news',
//     category: 'news',
//     tagText: '新闻动态',
//     hasNotification: true,
//     dotColor: '#10BA51',
//     title: '区领导带队赴上海开展招商考察活动',
//     subTag: null,
//     description: '摘3月31日至4月1日，区委副书记、区长陈宇带队赴上海开展招商考察活动。',
//     timeAgo: '2小时前',
//     detailUrl: '/scene-enterprise-dynamic-detail/5',
//   },
//   {
//     id: 'card-service',
//     category: 'service',
//     tagText: '精准服务',
//     hasNotification: false,
//     dotColor: null,
//     title: '杭州太希智能科技有限公司',
//     subTag: { text: '腰部企业' },
//     description: '该企业在快速发展阶段，需要规模以上（人工智能）工业和服务业企业认定与入统指导。',
//     timeAgo: '2小时前',
//     detailUrl: '/precise-service-detail/1',
//   },
//   {
//     id: 'card-related',
//     category: 'related',
//     tagText: '与我相关',
//     hasNotification: false,
//     dotColor: '#3B82F6',
//     title: '敖煜新赴区信访局接待来访群众',
//     subTag: null,
//     description: '摘4月1日下午，区委书记敖煜新赴区信访局接待来访群众，面对面倾听诉求，现场协调解决问题。',
//     timeAgo: '2小时前',
//     detailUrl: '/scene-enterprise-dynamic-detail/6',
//   },
// ]

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

  const chatBodyRef = useRef(null)
  const headerRef = useRef(null)
  const avatarRef = useRef(null)
  const txtWrapperRef = useRef(null)
  // 用 ref 跟踪收缩状态，避免触发 React 重渲染
  const isCompactRef = useRef(false)
  // 动画进行中时锁定，防止 compact 动画途中 body 增高导致 scrollTop 被夹到 <40，
  // 触发 animateToNormal，形成两个 tween 互相竞争的抖动循环
  const isAnimatingRef = useRef(false)
  const naturalHeaderHeightRef = useRef(0)  // compact 前捕获，供 expand 还原（适配 rem）
  const txtWrapperNaturalHeightRef = useRef(0)

  // isOpen 变为 true 后，DOM 才存在，此时捕获各元素自然高度
  useEffect(() => {
    if (!isOpen) return
    if (txtWrapperRef.current) {
      txtWrapperNaturalHeightRef.current = txtWrapperRef.current.offsetHeight
    }
  }, [isOpen])

  // 绑定滚动监听，并在其中用 GSAP 直接操作 DOM，不触发 React 重渲染
  useEffect(() => {
    if (!isOpen) return
    const el = chatBodyRef.current
    if (!el) return

    const animateToCompact = () => {
      if (isCompactRef.current || isAnimatingRef.current) return
      isCompactRef.current = true
      isAnimatingRef.current = true

      const header = headerRef.current
      if (header) {
        // compact 前捕获实际渲染高度（兼容 rem，不同分辨率下数值不同）
        naturalHeaderHeightRef.current = header.offsetHeight
        gsap.set(header, { height: naturalHeaderHeightRef.current })
        header.style.overflow = 'unset'
        header.style.backgroundImage = `url(${headerBgSmall})`
        gsap.to(header, {
          height: 71,
          minHeight: 71,
          marginBottom: 16,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => { isAnimatingRef.current = false },
        })
      }

      if (avatarRef.current) {
        gsap.to(avatarRef.current, { y: -48, duration: 0.1, ease: 'power2.out', overwrite: 'auto' })
      }

      if (txtWrapperRef.current) {
        gsap.to(txtWrapperRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    const animateToNormal = () => {
      if (!isCompactRef.current || isAnimatingRef.current) return
      isCompactRef.current = false
      isAnimatingRef.current = true

      const header = headerRef.current
      if (header) {
        header.style.backgroundImage = ''
        gsap.to(header, {
          // 还原到 compact 前捕获的实际高度，而非硬编码 284px
          height: naturalHeaderHeightRef.current,
          minHeight: naturalHeaderHeightRef.current,
          marginBottom: 0,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            header.style.overflow = 'hidden'
            // 清除 GSAP inline styles，让 CSS rem 值重新接管
            gsap.set(header, { clearProps: 'height,minHeight,marginBottom' })
            isAnimatingRef.current = false
          },
        })
      }

      if (avatarRef.current) {
        gsap.to(avatarRef.current, { y: 0, duration: 0.1, ease: 'power2.out', overwrite: 'auto' })
      }

      if (txtWrapperRef.current) {
        gsap.to(txtWrapperRef.current, {
          opacity: 1,
          height: txtWrapperNaturalHeightRef.current,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(txtWrapperRef.current, { clearProps: 'height' })
          },
        })
      }
    }

    const handleScroll = () => {
      const scrollTop = el.scrollTop
      // 有滚动条 = 内容超出容器高度
      const hasScrollbar = el.scrollHeight > el.clientHeight

      if (scrollTop >= 80 && !isCompactRef.current) {
        // 向下滚动超过 80px → 收缩，且不因滚动条消失而反转
        animateToCompact()
      } else if (scrollTop < 10 && hasScrollbar && isCompactRef.current) {
        // 向上滚动 < 40px，且确认仍有滚动条 → 展开
        animateToNormal()
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [isOpen])

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

  const scrollToTop = (behavior = 'smooth') => {
    chatBodyRef.current?.scrollTo({ top: 0, behavior })
  }

  useEffect(() => {
    if (isOpen) {
      // 根据消息数量决定滚动位置
      setTimeout(() => {
        if (messages.length === 0) {
          scrollToTop('auto')
        } else {
          scrollToBottom('auto')
        }
      }, 10)
    }
  }, [isOpen, messages.length])

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
        <div className="chat-header-cm" ref={headerRef}>
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

          {/* 图标区域 */}
          <div className="chat-hero-section">
            <img
              className="chat-robot-avatar"
              src={SparklesIcon}
              alt="robot"
              ref={avatarRef}
            />
            <div className='chat-txt-wrapper' ref={txtWrapperRef}>
              <div className="chat-hero-greeting">
                Hi，我是<span className="chat-hero-highlight">拱墅企业助手</span>
              </div>
              <div className="chat-hero-subtitle">
                为您提供最新的企业资讯
              </div>
              {/* <div className="chat-hero-subtitle">您有<span className="chat-hero-highlight-red">2</span>条未读消息</div> */}
            </div>
          </div>
        </div>

        {/* 聊天内容区 */}
        <div className="chat-body-cm" ref={chatBodyRef}>
          {/* 静态欢迎卡片 - 始终显示 */}
          {/* <div className="chat-message msg-bot">
            <div className="avatar bot-avatar">
              <Bot size={20} color="#155DFC" strokeWidth={1.5} />
            </div>
            <div className="msg-content-wrapper msg-content-wrapper--cards">
              <div className="msg-cards-label">拱墅企业小助手：</div>
              <div className="msg-cards-list">
                {INITIAL_CARDS.map(card => (
                  <ChatInfoCard
                    key={card.id}
                    card={card}
                    onNavigate={(url) => { navigate(url); }}
                  />
                ))}
              </div>
            </div>
          </div> */}

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

import React, { useState, useEffect, useRef } from 'react'
import { History, Plus, X, Bot, User, Send } from 'lucide-react'
import SparklesIcon from '../assets/Sparkles.svg'
import './ChatModal.css'

const initialMessages = [
  //   { id: 1, type: 'bot', text: '您好！我是墅企小助手，有什么可以帮助您的吗？', time: '13:56' },
  //   { id: 2, type: 'user', text: '浙江云鹭科技有限公司是省科小企业吗？？', time: '13:56' },
]

export default function ChatModal({ isOpen, onClose }) {
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
    if (!inputValue.trim()) return

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
            "enterpriseData": false,
            "knowledgeList": [
              "2001109186508312577"
            ],
            "model": "deepseek-chat",
            "url": "",
            "tenantCodes": []
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
    }
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
        <div className="chat-header-cm">
          <div className="chat-header-left">
            <div className="chat-header-icon-box">
              <img src={SparklesIcon} alt="assistant" width="24" height="24" />
            </div>
            <div className="chat-header-info">
              <div className="chat-title">墅企小助手</div>
              <div className="chat-subtitle">在线 · 随时为您服务</div>
            </div>
          </div>
          <div className="chat-header-actions">
            {/* <button className="icon-btn"><History size={20} /></button>
            <button className="icon-btn"><Plus size={22} /></button> */}
            <button className="icon-btn" onClick={onClose}><X size={22} /></button>
          </div>
        </div>

        {/* 聊天内容区 */}
        <div className="chat-body-cm">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.type === 'user' ? 'msg-user' : 'msg-bot'}`}>
              {msg.type === 'bot' && (
                <div className="avatar bot-avatar">
                  <Bot size={20} color="#155DFC" strokeWidth={1.5} />
                </div>
              )}

              <div className="msg-content-wrapper">
                <div className="msg-bubble">
                  {msg.text}
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
              className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
              onClick={handleSend}
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

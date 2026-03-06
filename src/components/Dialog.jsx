import { useEffect } from 'react'
import './Dialog.css'

export default function Dialog({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      // Add keyboard event listener for Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-content">
          <div className="dialog-title">{title}</div>
          <div className="dialog-descriptions">{content}</div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

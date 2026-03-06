import { useState, useEffect, useRef } from 'react';
import './index.css';

/**
 * FilterSheet — 底部滑出筛选框公用组件
 * Props:
 *   title      {string}   筛选标题
 *   options    {string[]} 选项列表
 *   value      {string[]} 当前已选值（数组，支持多选）
 *   onChange   {fn}       (selectedValues: string[]) => void
 *   onClose    {fn}       关闭回调
 *   open       {bool}     是否展开
 *   multiple   {bool}     是否多选，默认 false（单选）
 */
export default function FilterSheet({ title, options = [], value = [], onChange, onClose, open, multiple = false }) {
  const [pending, setPending] = useState(value);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) setPending(value);
  }, [open, value]);

  const handleToggle = (opt) => {
    if (multiple) {
      setPending(prev =>
        prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt]
      );
    } else {
      setPending(prev => (prev.includes(opt) && prev.length === 1 ? [] : [opt]));
    }
  };

  const handleConfirm = () => {
    onChange && onChange(pending);
    onClose && onClose();
  };

  const handleReset = () => {
    setPending([]);
  };

  if (!open) return null;

  return (
    <div className="fs-overlay" onClick={onClose}>
      <div className="fs-sheet" ref={sheetRef} onClick={e => e.stopPropagation()}>
        <div className="fs-handle" />
        <div className="fs-header">
          <span className="fs-title">{title}</span>
          <button className="fs-reset-btn" onClick={handleReset}>重置</button>
        </div>
        <div className="fs-options">
          {options.map(opt => (
            <button
              key={opt}
              className={`fs-option${pending.includes(opt) ? ' fs-option--selected' : ''}`}
              onClick={() => handleToggle(opt)}
            >
              {opt}
              {pending.includes(opt) && (
                <svg className="fs-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#0052D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="fs-footer">
          <button className="fs-btn fs-btn--cancel" onClick={onClose}>取消</button>
          <button className="fs-btn fs-btn--confirm" onClick={handleConfirm}>确认</button>
        </div>
      </div>
    </div>
  );
}

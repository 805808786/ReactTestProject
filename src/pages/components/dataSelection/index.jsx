import { useState, useEffect } from 'react';
import './index.css';

/**
 * DateSelection — 轻量日历选择组件
 * 去掉了对 antd / moment / dompurify / redux 的依赖，
 * 保留了原始组件的核心功能：
 *   - 按月显示日历格子
 *   - 支持 disabledDate（基于 dateDisabledType）
 *   - 支持 data + dateKey 标记有数据的日期（显示小圆点）
 *   - 支持 defaultValue 受控选中
 *   - 选中后通过 onSelect(dateStr) 回调
 */
const DateSelection = ({
  // 日历配置
  dateDisabledType = 'afterTodayAndToday', // afterTodayAndToday | beforeToday | afterToday | beforeTodayAndToday | formData
  dateKey = 'date',                        // data 中日期字段
  data = [],                               // [{[dateKey]: 'YYYY-MM-DD', ...}]
  defaultValue = null,                     // 'YYYY-MM-DD' 受控默认值
  onSelect,                                // (dateStr) => void
}) => {
  const todayStr = formatDate(new Date());

  const initDate = () => {
    if (defaultValue) return parseYMD(defaultValue);
    // 如果今天不可选，自动选昨天
    const today = new Date();
    if (isDisabled(today, dateDisabledType, data, dateKey)) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    return today;
  };

  const [viewDate, setViewDate] = useState(() => initDate()); // 当前显示的年月
  const [selected, setSelected] = useState(() => {
    if (defaultValue) return defaultValue;
    const d = initDate();
    if (!isDisabled(d, dateDisabledType, data, dateKey)) return formatDate(d);
    return null;
  });

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
      setViewDate(parseYMD(defaultValue));
    }
  }, [defaultValue]);

  // 月份翻页
  const addMonth = (n) => {
    setViewDate(d => {
      const nd = new Date(d.getFullYear(), d.getMonth() + n, 1);
      return nd;
    });
  };
  const addYear = (n) => {
    setViewDate(d => new Date(d.getFullYear() + n, d.getMonth(), 1));
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // 生成日历格子
  const cells = buildCells(year, month);

  const handleSelect = (dateStr) => {
    setSelected(dateStr);
    onSelect && onSelect(dateStr);
  };

  // 数据点集合
  const dotDates = new Set(
    data.map(item => item[dateKey] ? item[dateKey].slice(0, 10) : null).filter(Boolean)
  );

  return (
    <div className="ds-wrap">
      {/* 头部：年月 + 翻页 */}
      <div className="ds-header">
        <button className="ds-nav-btn" onClick={() => addYear(-1)} aria-label="上一年">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
        <button className="ds-nav-btn" onClick={() => addMonth(-1)} aria-label="上一月">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
        <span className="ds-title">{year}年 {month + 1}月</span>
        <button className="ds-nav-btn" onClick={() => addMonth(1)} aria-label="下一月">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 12L10 8 6 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
        <button className="ds-nav-btn" onClick={() => addYear(1)} aria-label="下一年">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 12L10 8 6 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M9 12L13 8 9 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* 星期头 */}
      <div className="ds-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <span key={d} className="ds-weekday">{d}</span>
        ))}
      </div>

      {/* 日历格子 */}
      <div className="ds-grid">
        {cells.map((cell, i) => {
          if (!cell) return <span key={i} className="ds-cell ds-cell--empty" />;
          const dateStr = cell;
          const disabled = isDisabled(parseYMD(dateStr), dateDisabledType, data, dateKey);
          const isSelected = dateStr === selected;
          const isToday = dateStr === todayStr;
          const hasDot = dotDates.has(dateStr);
          const day = parseInt(dateStr.slice(8), 10);
          return (
            <button
              key={i}
              className={[
                'ds-cell',
                isSelected ? 'ds-cell--selected' : '',
                isToday && !isSelected ? 'ds-cell--today' : '',
                disabled ? 'ds-cell--disabled' : '',
              ].filter(Boolean).join(' ')}
              disabled={disabled}
              onClick={() => !disabled && handleSelect(dateStr)}
            >
              {day}
              {hasDot && <span className={`ds-dot${isSelected ? ' ds-dot--selected' : ''}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---- 工具函数 ---- */
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseYMD(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function startOfDay(d) {
  const c = new Date(d); c.setHours(0, 0, 0, 0); return c;
}
function isDisabled(date, type, data, dateKey) {
  const today = startOfDay(new Date());
  const d = startOfDay(date);
  if (type === 'beforeToday') return d < today;
  if (type === 'afterToday') return d > today;
  if (type === 'beforeTodayAndToday') return d <= today;
  if (type === 'afterTodayAndToday') return d >= today;
  if (type === 'formData') {
    const dateStr = formatDate(date);
    const safeData = Array.isArray(data) ? data : [];
    return !safeData.some(item => item[dateKey]?.slice(0, 10) === dateStr);
  }
  return false;
}
function buildCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const str = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(str);
  }
  return cells;
}

export default DateSelection;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateSelection from './components/dataSelection/index';
import iconPvBack from '../assets/icon-pv-back.svg';
import iconPvDivider from '../assets/icon-pv-divider.svg';
import './PlannedVisits.css';

/* ===================== 工具函数 ===================== */
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${dateStr} ${weekdays[date.getDay()]}`;
}

/* ===================== Mock 数据 ===================== */
const MOCK_VISITS = {
  '2026-03-06': [
    { id: 1, startTime: '下午 3:00', endTime: '下午 4:30', task: '去杭州市惠民服务有限公司走访调研' },
    { id: 2, startTime: '下午 3:00', endTime: '下午 4:30', task: '去杭州市惠民服务有限公司走访调研' },
  ],
  '2026-03-10': [
    { id: 1, startTime: '上午 9:30', endTime: '上午 11:00', task: '去浙江数字科技集团股份有限公司走访调研' },
  ],
  '2026-03-12': [
    { id: 1, startTime: '下午 2:00', endTime: '下午 3:30', task: '去杭州新能源科技有限公司走访调研' },
    { id: 2, startTime: '下午 4:00', endTime: '下午 5:00', task: '去浙江绿色低碳科技有限公司走访调研' },
  ],
  '2026-03-15': [
    { id: 1, startTime: '上午 10:00', endTime: '上午 11:30', task: '去杭州拱墅先进制造有限公司走访调研' },
  ],
  '2026-03-19': [
    { id: 1, startTime: '下午 3:00', endTime: '下午 4:30', task: '去浙江出海跨境贸易有限公司走访调研' },
    { id: 2, startTime: '下午 5:00', endTime: '下午 6:00', task: '去杭州元宇宙技术有限公司走访调研' },
  ],
  '2026-03-24': [
    { id: 1, startTime: '上午 9:00', endTime: '上午 10:30', task: '去杭州软件信息服务有限公司走访调研' },
  ],
};

const CALENDAR_DATA = Object.keys(MOCK_VISITS).map(date => ({ date }));

/* ===================== 走访计划卡片 ===================== */
function VisitCard({ visit, date, onClick }) {
  return (
    <div className="pv-visit-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="pv-visit-inner">
        <div className="pv-visit-time">
          <span className="pv-time-start">{visit.startTime}</span>
          <span className="pv-time-end">{visit.endTime}</span>
        </div>
        <img src={iconPvDivider} alt="" className="pv-visit-divider" />
        <span className="pv-visit-task">{visit.task}</span>
      </div>
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function PlannedVisits() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-03-06');

  const currentVisits = MOCK_VISITS[selectedDate] || [];
  const displayDate = formatDisplayDate(selectedDate);

  return (
    <div className="pv-container">
      {/* 头部区域 */}
      <div className="pv-header">
        <div className="pv-header-top">
          <button className="pv-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <img src={iconPvBack} alt="返回" width={36} height={32} />
          </button>
          <span className="pv-header-title">拟走访企业</span>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pv-content">
        {/* 日期筛选区域（向上叠加到头部） */}
        <div className="pv-calendar-wrapper">
          <DateSelection
            dateDisabledType="formData"
            data={CALENDAR_DATA}
            dateKey="date"
            defaultValue={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        {/* 当前日期展示行 */}
        <div className="pv-date-row">
          <div className="pv-date-dot" />
          <div className="pv-date-tag">
            <span className="pv-date-text">{displayDate}</span>
          </div>
        </div>

        {/* 当前日期走访计划列表 */}
        {currentVisits.length > 0
          ? currentVisits.map(visit => (
              <VisitCard
                key={visit.id}
                visit={visit}
                date={selectedDate}
                onClick={() => navigate('/schedule-detail', {
                  state: {
                    scheduleKey: `${selectedDate}-${visit.id}`,
                  },
                })}
              />
            ))
          : <div className="pv-empty">当日暂无走访计划</div>
        }
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import './CalendarView.css';

export default function CalendarView() {
  const navigate = useNavigate();

  return (
    <div className="calendar-container">
      {/* Header Area */}
      <div className="calendar-header">
        <div className="header-top">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} color="#ffffff" />
          </button>
          <div className="header-title">
            <p>日历视图</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-wrapper" style={{ position: 'relative' }}>
        
        {/* Overlapping Tabs */}
        <div className="tabs-overlay">
           <div className="tab-item active">
             企业日历
             <div className="tab-indicator"></div>
           </div>
           <div className="tab-item">
             场景日历
           </div>
           <div className="tab-item">
             标签日历
           </div>
        </div>

        {/* Spacing for the overlapping tabs */}
        <div style={{ height: '32px' }}></div>

        {/* Dropdown */}
        <div className="dropdown-menu">
           <span className="dropdown-text">企业日历</span>
           <ChevronDown size={16} color="#000000" />
        </div>

        {/* Trend Card */}
        <div className="trend-card">
           <div className="card-header">
             <div className="indicator-dot"></div>
             <div className="card-title">企业变化趋势</div>
           </div>
           {/* Mock Chart Area */}
           <div style={{ height: '110px', position: 'relative', marginTop: '10px' }}>
              <div className="y-axis">
                 <span>140,000</span>
                 <span>135,000</span>
                 <span>130,000</span>
              </div>
              <div className="chart-viz">
                 {/* Simulated chart line */}
                 <svg width="100%" height="100%" preserveAspectRatio="none">
                    <polyline 
                       fill="none" 
                       stroke="#155dfc" 
                       strokeWidth="2" 
                       points="0,80 70,60 140,70 210,40 280,50 350,20" 
                    />
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="rgba(21, 93, 252, 0.2)" />
                       <stop offset="100%" stopColor="rgba(21, 93, 252, 0)" />
                    </linearGradient>
                    <polygon 
                       fill="url(#grad)" 
                       points="0,80 70,60 140,70 210,40 280,50 350,20 350,100 0,100" 
                    />
                 </svg>
              </div>
              <div className="x-axis" style={{ paddingLeft: '35px' }}>
                 <span>2026/03/04</span>
                 <span>2026/04/04</span>
              </div>
           </div>
        </div>

        {/* Timeline Steps */}
        <div className="timeline-section">
           {/* Item 1 */}
           <div className="timeline-item">
              <div className="timeline-date">2026年3月4号</div>
              <div className="info-card">
                 <div className="stat-row">
                    <span className="stat-label">企业总数</span>
                    <span className="stat-value">139,767家</span>
                    <span className="stat-sub negative">-13家</span>
                 </div>
                 
                 <div className="reason-row">
                    <div className="reason-item">
                       <span className="reason-index">1.</span>
                       <span>工商信息新注册/新注销企业变化</span>
                    </div>
                    <div className="reason-item">
                       <span className="reason-index">2.</span>
                       <span>商务社区走访新入驻企业</span>
                    </div>
                 </div>

                 <div className="tags-row">
                    <div className="tag-item">
                       <span className="tag-badge">新增</span>
                       <span>跨境供应链服务 · 新增为出海企业 · 跨境物流</span>
                    </div>
                    <div className="tag-item">
                       <span className="tag-badge">新增</span>
                       <span>跨境供应链服务 · 新增为出海企业 · 跨境物流</span>
                    </div>
                    <div className="tag-item">
                       <span className="tag-badge adjust">调整</span>
                       <span>跨境供应链服务 · 新增为出海企业 · 跨境物流</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Item 2 */}
           <div className="timeline-item">
              <div className="timeline-date">2026年3月3号</div>
              <div className="info-card">
                 <div className="stat-row">
                    <span className="stat-label">企业总数</span>
                    <span className="stat-value">139,790家</span>
                    <span className="stat-sub" style={{color: '#f4200d'}}>+31家</span>
                 </div>
                 
                 <div className="reason-row">
                    <div className="reason-item">
                       <span className="reason-index">1.</span>
                       <span>工商信息新注册/新注销企业变化</span>
                    </div>
                    <div className="reason-item">
                       <span className="reason-index">2.</span>
                       <span>商务社区走访新入驻企业</span>
                    </div>
                 </div>

                 <div className="tags-row">
                    <div className="tag-item">
                       <span className="tag-badge">新增</span>
                       <span>跨境供应链服务 · 新增为出海企业 · 跨境物流</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
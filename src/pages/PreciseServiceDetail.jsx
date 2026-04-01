import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import './PreciseServiceDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_SERVICE_DATA = {
  1: {
    companyName: '杭州市惠民服务有限公司',
    discoverDate: '2026-03-04',
    background:
      '近3个月税收增长超50%，且税收金额达到30万元。技术研发投入占比达45%，具备快速成长为腰部企业潜力。',
    serviceDept: '拱墅区科技局',
    serviceTarget: '杭州市惠民服务有限公司',
    serviceContent: '"国家高新技术企业"资质申报的全流程辅导与协调服务',
    effects: [
      '助力企业通过认定，实现从数商梯队腰部向头部领军企业的关键跃升。',
      '企业通过认定后，预计可享年度减税约40万元，并获最高30万元财政奖励。',
    ],
  },
};

const DEFAULT_SERVICE = {
  companyName: '杭州市惠民服务有限公司',
  discoverDate: '2026-03-04',
  background:
    '近3个月税收增长超50%，且税收金额达到30万元。技术研发投入占比达45%，具备快速成长为腰部企业潜力。',
  serviceDept: '拱墅区科技局',
  serviceTarget: '杭州市惠民服务有限公司',
  serviceContent: '"国家高新技术企业"资质申报的全流程辅导与协调服务',
  effects: [
    '助力企业通过认定，实现从数商梯队腰部向头部领军企业的关键跃升。',
    '企业通过认定后，预计可享年度减税约40万元，并获最高30万元财政奖励。',
  ],
};

export default function PreciseServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateData = location.state?.serviceData;
  const data = stateData || MOCK_SERVICE_DATA[Number(id)] || DEFAULT_SERVICE;

  return (
    <div className="psd-container">
      {/* ===== 头部 ===== */}
      <div className="psd-header">
        <div className="psd-header-row">
          <button className="psd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="psd-header-title">精准服务</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="psd-body">
        {/* ===== 企业信息卡片 ===== */}
        <div className="psd-card">
          <div className="psd-card-content">
            <div className="psd-company-header">
              <img src={iconBuilding} alt="企业" className="psd-company-icon" />
              <span className="psd-company-name">{data.companyName}</span>
            </div>
            <div className="psd-date-row">
              <img src={iconCalendar} alt="日期" className="psd-date-icon" />
              <span className="psd-date-text">挖掘日期：{data.discoverDate}</span>
            </div>

            {/* 服务背景 */}
            <h3 className="psd-section-title">服务背景</h3>
            <div className="psd-bg-box">
              <p className="psd-bg-text">{data.background}</p>
            </div>
          </div>
        </div>

        {/* ===== 可服务事项卡片 ===== */}
        <div className="psd-card">
          <div className="psd-card-content">
            <h3 className="psd-section-title">可服务事项</h3>
            <div className="psd-service-box">
              <p className="psd-service-text">
                <span className="psd-service-highlight">{data.serviceDept}</span>
                可为&ldquo;{data.serviceTarget}&rdquo;提供{data.serviceContent}
              </p>
            </div>
            <div className="psd-task-btn-row">
              <button className="psd-task-btn">发起任务</button>
            </div>
          </div>
        </div>

        {/* ===== 预期成效卡片 ===== */}
        <div className="psd-card">
          <div className="psd-card-content">
            <h3 className="psd-section-title">预期成效</h3>
            <div className="psd-effect-box">
              {data.effects.map((effect, index) => (
                <p key={index} className="psd-effect-text">{effect}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

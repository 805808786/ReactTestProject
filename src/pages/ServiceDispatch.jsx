import { useNavigate, useLocation } from 'react-router-dom';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import './ServiceDispatch.css';
import PageHeader from '../components/PageHeader';

/* ===================== 默认数据 ===================== */
const DEFAULT_DISPATCH = {
  companyName: '杭州市惠民服务有限公司',
  serviceContent:
    '为"杭州市惠民服务有限公司"提供"国家高新技术企业"资质申报的全流程辅导与协调服务',
  deptName: '拱墅区科技局',
  handler: '张三',
  phone: '13605809007',
};

export default function ServiceDispatch() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.dispatchData || DEFAULT_DISPATCH;

  return (
    <div className="sd-container">
      {/* ===== 头部 ===== */}
      <PageHeader title="一键派发" />

      {/* ===== 主体区域 ===== */}
      <div className="sd-body">
        {/* ===== 服务企业卡片 ===== */}
        <div className="sd-card">
          <div className="sd-card-content">
            <div className="sd-company-row">
              <img src={iconBuilding} alt="企业" className="sd-company-icon" />
              <span className="sd-company-label">服务企业：{data.companyName}</span>
            </div>
            <div className="sd-service-box">
              <p className="sd-service-text">
                <span className="sd-service-bold">服务事项：</span>
                {data.serviceContent}
              </p>
            </div>
          </div>
        </div>

        {/* ===== 分派流程卡片 ===== */}
        <div className="sd-card">
          <div className="sd-card-content">
            <h3 className="sd-flow-title">分派流程</h3>
            <div className="sd-flow-separator" />
            <div className="sd-dept-name">{data.deptName}</div>
            <div className="sd-contact-row">
              <div className="sd-contact-item">
                <span className="sd-contact-label">处置人：</span>
                <span className="sd-contact-value">{data.handler}</span>
              </div>
              <div className="sd-contact-item">
                <span className="sd-contact-label">联系方式：</span>
                <span className="sd-contact-value">{data.phone}</span>
              </div>
            </div>
            <div className="sd-flow-separator" />
          </div>
        </div>

        {/* ===== 一键派发按钮 ===== */}
        <button
          className="sd-dispatch-btn"
          onClick={() =>
            navigate('/precise-service-detail/1', {
              state: { dispatched: true },
            })
          }
        >
          一键派发
        </button>
      </div>
    </div>
  );
}

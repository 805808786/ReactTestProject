import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import './PreciseServiceDetail.css';
import PageHeader from '../components/PageHeader';
import IconUpBlue from '../assets/icon-up-blue.svg'

/* ===================== Mock 详情数据 ===================== */
const MOCK_SERVICE_DATA = {
  1: {
    companyName: '杭州橙颂科技有限公司',
    discoverDate: '2026-03-04',
    background:
      '该企业在快速发展阶段，对于项目管理与商务人才有较大需求缺口。',
    serviceDept: '区人力社保局',
    serviceTarget: '杭州橙颂科技有限公司',
    serviceContent: '可为指导企业参与人才政策对接，协助引进和培养AI算法工程师、全栈开发工程师等高端技术人才，优化人才结构。',
    effects: [
      '助力企业通过招聘所需的关键人才，推动企业更好更快发展',
    ],
  },
};

const DEFAULT_SERVICE = {
  companyName: '杭州橙颂科技有限公司',
  discoverDate: '2026-03-04',
  background:
    '近3个月税收增长超50%，且税收金额达到30万元。技术研发投入占比达45%，具备快速成长为腰部企业潜力。',
  serviceDept: '拱墅区科技局',
  serviceTarget: '杭州橙颂科技有限公司',
  serviceContent: '可为指导企业参与人才政策对接，协助引进和培养AI算法工程师、全栈开发工程师等高端技术人才，优化人才结构。',
  effects: [
    '助力企业通过招聘所需的关键人才，推动企业更好更快发展',
  ],
};

/* ===================== Mock 流程数据 ===================== */
const MOCK_FLOW_STEPS = [
  // {
  //   status: 'done',
  //   statusLabel: '已完成',
  //   deptName: '拱墅区市监局',
  //   timeLabel: '耗时：5分钟',
  //   result: '已联系企业并确认需求',
  //   handler: '张三',
  //   finishTime: '2026年3月31日21:09:16',
  // },
  {
    status: 'processing',
    statusLabel: '办理中',
    deptName: '区人力社保局',
    timeLabel: '持续：2小时5分钟',
    handler: '张三',
  },
];

export default function PreciseServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const dispatched = location.state?.dispatched || false;
  const stateData = location.state?.serviceData;
  const data = stateData || MOCK_SERVICE_DATA[Number(id)] || DEFAULT_SERVICE;

  const [flowExpanded, setFlowExpanded] = useState(false);

  return (
    <div className="psd-container">
      {/* ===== 头部 ===== */}
      {/* <div className="psd-header">0
        <div className="psd-header-row">
          <button className="psd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="psd-header-title">精准服务</span>
        </div>
      </div> */}
      <PageHeader title="精准服务" />

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
        <div className="psd-card-service">
          <div className="psd-card-content-service">
            <h3 className="psd-section-title">可服务事项</h3>
            <div className="psd-service-box">
              <p className="psd-service-text">
                {dispatched ? (
                  <><span className="psd-service-highlight">{data.serviceDept}</span>
                    {data.serviceContent}
                  </>
                ) : (
                  <>
                    <span className="psd-service-highlight">{data.serviceDept}</span>
                    {data.serviceContent}
                  </>
                )}
              </p>
            </div>

            {/* 未派发：显示发起任务按钮 */}
            {!dispatched && (
              <div className="psd-task-btn-row">
                <button
                  className="psd-task-btn"
                  onClick={() =>
                    navigate('/service-dispatch', {
                      state: {
                        dispatchData: {
                          companyName: data.companyName,
                          serviceContent: data.background,
                          deptName: data.serviceDept,
                          handler: '张三',
                          phone: '13605809007',

                        },
                      },
                    })
                  }
                >
                  发起任务
                </button>
              </div>
            )}

            {/* 已派发：显示流程进度 */}
            {dispatched && (
              <div className="psd-flow">

                <div
                  className="psd-flow-header"
                  onClick={() => setFlowExpanded((v) => !v)}
                >
                  {flowExpanded ?
                    <span className="psd-flow-progress">总计流程0/1</span> :
                    <span className="psd-flow-progress">
                      <div className="psd-step-left">
                        <span
                          className={`psd-step-badge psd-step-badge-processing`}
                        >
                          0/1
                        </span>
                        <span className="psd-step-dept">区人力社保局</span>
                      </div>
                    </span>}


                  <div className="psd-flow-header-right">
                    {flowExpanded ? <span className="psd-flow-date">下发时间：2026年3月31日</span> :
                      <span className="psd-flow-date">持续：2小时5分钟</span>}

                    <span className={`psd-flow-arrow ${flowExpanded ? 'psd-flow-arrow-up' : ''}`}>
                      <img src={IconUpBlue} alt="up" />
                    </span>
                  </div>
                </div>


                {flowExpanded && (
                  <div className="psd-flow-steps">
                    {MOCK_FLOW_STEPS.map((step, idx) => (
                      <div key={idx} className="psd-step">
                        <div className="psd-step-header">
                          <div className="psd-step-left">
                            <span
                              className={`psd-step-badge ${step.status === 'done'
                                ? 'psd-step-badge-done'
                                : 'psd-step-badge-processing'
                                }`}
                            >
                              {step.statusLabel}
                            </span>
                            <span className="psd-step-dept">{step.deptName}</span>
                          </div>
                          <span className="psd-step-time">{step.timeLabel}</span>
                        </div>

                        <div className="psd-step-detail">
                          {step.status === 'done' ? (
                            <>
                              <div className="psd-step-detail-row">
                                <span className="psd-step-label">处置结果：</span>
                                <span className="psd-step-value">{step.result}</span>
                              </div>
                              <div className="psd-step-detail-row">
                                <span className="psd-step-label">处置人：</span>
                                <span className="psd-step-value">{step.handler}</span>
                                <span className="psd-step-label" style={{ marginLeft: 16 }}>
                                  时间：
                                </span>
                                <span className="psd-step-value">{step.finishTime}</span>
                              </div>
                            </>
                          ) : (
                            <div className="psd-step-processing-content">
                              <div className="psd-step-detail-row">
                                <span className="psd-step-label">处置人：</span>
                                <span className="psd-step-value">{step.handler}</span>
                              </div>
                              <button className="psd-urge-btn">发起催办</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== 预期成效卡片 ===== */}
        <div className="psd-card-service">
          <div className="psd-card-content-effect">
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

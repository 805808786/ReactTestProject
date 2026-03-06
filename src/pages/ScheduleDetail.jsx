import { useNavigate, useLocation } from 'react-router-dom';
import iconSdBack from '../assets/icon-sd-back.svg';
import iconSdCalendar from '../assets/icon-sd-calendar.svg';
import iconSdBuilding from '../assets/icon-sd-building.svg';
import './ScheduleDetail.css';

/* ===================== Mock 详情数据 ===================== */
const MOCK_SCHEDULE_DETAILS = {
  '2026-03-06-1': {
    task: '去杭州市惠民服务有限公司走访调研',
    timeRange: '2026-03-06 15:00至16:30',
    summary: '日程大纲: 前往杭州惠民服务有限公司参加调研工作，主要就企业经营状态和需要提供的帮忙进行交流，并宣贯政府最新政策。',
    details: [
      '一、时间： 2026年3月6日（星期五） 15:00',
      '二、地点： 杭州市惠民服务有限公司（地址：杭州市XX区XX路XX号）',
      '三、调研领导： XXX（区委副书记）',
      '四、陪同人员： 区人社局、区商务局、属地街道等相关负责人',
      '五、行程安排： \n14:10  区政府出发；\n15:00 到达杭州惠民服务有限公司，座谈交流；\n16:00 回区政府。',
      '六、其他事项： \n1、请杭州惠民服务有限公司做好调研点会务以及停车等工作。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州惠民服务有限公司', industry: '软件和信息技术服务业', person: '张伟', status: '存续' },
    ],
  },
  '2026-03-06-2': {
    task: '去杭州市惠民服务有限公司走访调研',
    timeRange: '2026-03-06 15:00至16:30',
    summary: '日程大纲: 前往杭州惠民服务有限公司参加调研工作，主要就企业经营状态和需要提供的帮忙进行交流，并宣贯政府最新政策。',
    details: [
      '一、时间： 2026年3月6日（星期五） 15:00',
      '二、地点： 杭州市惠民服务有限公司（地址：杭州市XX区XX路XX号）',
      '三、调研领导： XXX（区委副书记）',
      '四、陪同人员： 区人社局、区商务局、属地街道等相关负责人',
      '五、行程安排： \n14:10  区政府出发；\n15:00 到达杭州惠民服务有限公司，座谈交流；\n16:00 回区政府。',
      '六、其他事项： \n1、请杭州惠民服务有限公司做好调研点会务以及停车等工作。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州惠民服务有限公司', industry: '软件和信息技术服务业', person: '李明', status: '存续' },
    ],
  },
  '2026-03-10-1': {
    task: '去浙江数字科技集团股份有限公司走访调研',
    timeRange: '2026-03-10 09:30至11:00',
    summary: '日程大纲: 前往浙江数字科技集团股份有限公司开展走访调研，了解企业数字化转型进展及发展需求，推动政企协同合作。',
    details: [
      '一、时间： 2026年3月10日（星期二） 09:30',
      '二、地点： 浙江数字科技集团股份有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区长）',
      '四、陪同人员： 区经信局、区发改委、属地街道等相关负责人',
      '五、行程安排： \n09:00  区政府出发；\n09:30 到达浙江数字科技集团股份有限公司，座谈交流；\n11:00 回区政府。',
      '六、其他事项： \n1、请浙江数字科技集团股份有限公司做好会务及接待准备工作。',
    ],
    relatedCompanies: [
      { id: 1, name: '浙江数字科技集团股份有限公司', industry: '软件和信息技术服务业', person: '王芳', status: '存续' },
    ],
  },
  '2026-03-12-1': {
    task: '去杭州新能源科技有限公司走访调研',
    timeRange: '2026-03-12 14:00至15:30',
    summary: '日程大纲: 前往杭州新能源科技有限公司开展走访调研，了解企业新能源产品研发及市场推广情况，探讨政策支持方向。',
    details: [
      '一、时间： 2026年3月12日（星期四） 14:00',
      '二、地点： 杭州新能源科技有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区委书记）',
      '四、陪同人员： 区科技局、区工信局、属地街道等相关负责人',
      '五、行程安排： \n13:30  区政府出发；\n14:00 到达杭州新能源科技有限公司，座谈交流；\n15:30 回区政府。',
      '六、其他事项： \n1、请杭州新能源科技有限公司提前准备企业发展情况汇报材料。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州新能源科技有限公司', industry: '电气机械和器材制造业', person: '陈强', status: '存续' },
    ],
  },
  '2026-03-12-2': {
    task: '去浙江绿色低碳科技有限公司走访调研',
    timeRange: '2026-03-12 16:00至17:00',
    summary: '日程大纲: 前往浙江绿色低碳科技有限公司开展走访调研，了解企业绿色低碳技术发展情况及融资需求。',
    details: [
      '一、时间： 2026年3月12日（星期四） 16:00',
      '二、地点： 浙江绿色低碳科技有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区委副书记）',
      '四、陪同人员： 区生态环保局、区发改委、属地街道等相关负责人',
      '五、行程安排： \n15:30  区政府出发；\n16:00 到达浙江绿色低碳科技有限公司，座谈交流；\n17:00 回区政府。',
      '六、其他事项： \n1、请浙江绿色低碳科技有限公司准备碳排放指标及技术研发相关材料。',
    ],
    relatedCompanies: [
      { id: 1, name: '浙江绿色低碳科技有限公司', industry: '专用设备制造业', person: '刘洋', status: '存续' },
    ],
  },
  '2026-03-15-1': {
    task: '去杭州拱墅先进制造有限公司走访调研',
    timeRange: '2026-03-15 10:00至11:30',
    summary: '日程大纲: 前往杭州拱墅先进制造有限公司开展走访调研，了解企业智能制造升级进展及人才引进需求。',
    details: [
      '一、时间： 2026年3月15日（星期日） 10:00',
      '二、地点： 杭州拱墅先进制造有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区长）',
      '四、陪同人员： 区人社局、区工信局、属地街道等相关负责人',
      '五、行程安排： \n09:30  区政府出发；\n10:00 到达杭州拱墅先进制造有限公司，座谈交流；\n11:30 回区政府。',
      '六、其他事项： \n1、请杭州拱墅先进制造有限公司准备智能化改造相关材料。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州拱墅先进制造有限公司', industry: '通用设备制造业', person: '赵磊', status: '存续' },
    ],
  },
  '2026-03-19-1': {
    task: '去浙江出海跨境贸易有限公司走访调研',
    timeRange: '2026-03-19 15:00至16:30',
    summary: '日程大纲: 前往浙江出海跨境贸易有限公司开展走访调研，了解企业跨境电商发展情况及政策支持需求。',
    details: [
      '一、时间： 2026年3月19日（星期四） 15:00',
      '二、地点： 浙江出海跨境贸易有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区委副书记）',
      '四、陪同人员： 区商务局、区市场监管局、属地街道等相关负责人',
      '五、行程安排： \n14:30  区政府出发；\n15:00 到达浙江出海跨境贸易有限公司，座谈交流；\n16:30 回区政府。',
      '六、其他事项： \n1、请浙江出海跨境贸易有限公司准备跨境贸易数据及发展规划材料。',
    ],
    relatedCompanies: [
      { id: 1, name: '浙江出海跨境贸易有限公司', industry: '批发和零售业', person: '孙华', status: '存续' },
    ],
  },
  '2026-03-19-2': {
    task: '去杭州元宇宙技术有限公司走访调研',
    timeRange: '2026-03-19 17:00至18:00',
    summary: '日程大纲: 前往杭州元宇宙技术有限公司开展走访调研，了解元宇宙技术研发情况及未来发展方向。',
    details: [
      '一、时间： 2026年3月19日（星期四） 17:00',
      '二、地点： 杭州元宇宙技术有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区委书记）',
      '四、陪同人员： 区科技局、区数字经济局、属地街道等相关负责人',
      '五、行程安排： \n16:30  区政府出发；\n17:00 到达杭州元宇宙技术有限公司，座谈交流；\n18:00 回区政府。',
      '六、其他事项： \n1、请杭州元宇宙技术有限公司准备元宇宙应用案例及技术路线图。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州元宇宙技术有限公司', industry: '软件和信息技术服务业', person: '周建', status: '存续' },
    ],
  },
  '2026-03-24-1': {
    task: '去杭州软件信息服务有限公司走访调研',
    timeRange: '2026-03-24 09:00至10:30',
    summary: '日程大纲: 前往杭州软件信息服务有限公司开展走访调研，了解企业软件产品研发及市场拓展情况。',
    details: [
      '一、时间： 2026年3月24日（星期二） 09:00',
      '二、地点： 杭州软件信息服务有限公司（地址：杭州市拱墅区XX路XX号）',
      '三、调研领导： XXX（区长）',
      '四、陪同人员： 区经信局、区人社局、属地街道等相关负责人',
      '五、行程安排： \n08:30  区政府出发；\n09:00 到达杭州软件信息服务有限公司，座谈交流；\n10:30 回区政府。',
      '六、其他事项： \n1、请杭州软件信息服务有限公司准备产品演示及人才需求清单。',
    ],
    relatedCompanies: [
      { id: 1, name: '杭州软件信息服务有限公司', industry: '软件和信息技术服务业', person: '吴敏', status: '存续' },
    ],
  },
};

const DEFAULT_DATA = MOCK_SCHEDULE_DETAILS['2026-03-06-1'];

/* ===================== 主页面 ===================== */
export default function ScheduleDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state?.scheduleData;
  const stateKey = location.state?.scheduleKey;
  const data = stateData || MOCK_SCHEDULE_DETAILS[stateKey] || DEFAULT_DATA;

  return (
    <div className="sd-container">
      {/* ===== 头部 ===== */}
      <div className="sd-header">
        <div className="sd-header-row">
          <button className="sd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconSdBack} alt="" width={36} height={32} />
          </button>
          <span className="sd-header-title">日程详情</span>
        </div>
      </div>

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="sd-body">
        {/* ===== 日程详情卡片 ===== */}
        <div className="sd-card">
          <div className="sd-card-content">
            {/* 标题区域 */}
            <div className="sd-title-section">
              <div className="sd-title">{data.task}</div>
              <div className="sd-meta-row">
                <div className="sd-meta-item">
                  <img src={iconSdCalendar} alt="时间" width={12} height={12} />
                  <span className="sd-meta-text">{data.timeRange}</span>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="sd-separator" />

            {/* 日程大纲区域 */}
            <div className="sd-summary-box">
              <p className="sd-summary-text">{data.summary}</p>
            </div>

            {/* 日程详情条目 */}
            <div className="sd-details">
              {data.details.map((item, index) => (
                <p key={index} className="sd-detail-item">{item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 关联企业信息卡片 ===== */}
        <div className="sd-card sd-card-last">
          <div className="sd-card-content sd-card-content-company">
            {/* 卡片标题 */}
            <div className="sd-section-header">
              <img src={iconSdBuilding} alt="关联企业" width={16} height={16} />
              <span className="sd-section-title">关联企业</span>
              <span className="sd-section-count">({data.relatedCompanies.length}家)</span>
            </div>

            {/* 企业列表 */}
            <div className="sd-company-list">
              {data.relatedCompanies.map((company) => (
                <div key={company.id} className="sd-company-item">
                  <div className="sd-company-main">
                    <div className="sd-company-left">
                      <div className="sd-company-name">{company.name}</div>
                      <div className="sd-company-info">
                        <span className="sd-company-industry">{company.industry}</span>
                        <span className="sd-company-dot">•</span>
                        <span className="sd-company-person">{company.person}</span>
                      </div>
                    </div>
                    <div className="sd-status-badge">{company.status}</div>
                  </div>
                  <div className="sd-company-detail-row">
                    <button className="sd-company-detail-link" type="button">查看详情 →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

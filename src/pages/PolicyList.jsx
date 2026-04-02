import { useState, useCallback } from 'react';
import InfiniteList from './components/InfiniteList';
import iconPolicyProgress from '../assets/icon-policy-progress.svg';
import PageHeader from '../components/PageHeader';
import iconPolicyDoc from '../assets/icon-policy-doc.svg';
import iconPolicyEnterprise from '../assets/icon-policy-enterprise.svg';
import iconPolicyAdvice from '../assets/icon-policy-advice.svg';
import iconPolicyNewpolicy from '../assets/icon-policy-newpolicy.svg';
import './PolicyList.css';

/* ===================== Mock 数据 ===================== */
const MOCK_POLICIES = [
  {
    id: 1,
    name: '高新技术企业研发补贴',
    matchedCount: 1234,
    implementedCount: 856,
    implementationRate: 69.4,
    enterprises: [
      {
        id: 1,
        name: '科技创新有限公司',
        applyStatus: { label: '已申报', type: 'applied' },
        progressStatus: '审核中',
        amount: '50万',
        advice: '补充研发人员名单和项目验收报告',
      },
      {
        id: 2,
        name: '智能科技股份',
        applyStatus: { label: '待申报', type: 'pending' },
        progressStatus: '材料准备中',
        amount: '80万',
        advice: '建议尽快提交申报材料，本期申报截止3月15日',
      },
    ],
    newPolicySuggestion: '建议针对小微高新企业推出梯度化补贴政策，降低申报门槛',
  },
  {
    id: 2,
    name: '制造业数字化转型扶持',
    matchedCount: 867,
    implementedCount: 612,
    implementationRate: 92.1,
    enterprises: [
      {
        id: 1,
        name: '拱墅智造科技有限公司',
        applyStatus: { label: '已完成', type: 'done' },
        progressStatus: '已发放',
        amount: '120万',
        advice: '建议继续推进数字化改造，申请下期专项资金',
      },
    ],
    newPolicySuggestion: '建议增加对中小型制造业企业的数字化转型补贴额度，降低申报门槛',
  },
  {
    id: 3,
    name: '绿色发展专项资金',
    matchedCount: 645,
    implementedCount: 398,
    implementationRate: 56.7,
    enterprises: [
      {
        id: 1,
        name: '浙江新能源科技有限公司',
        applyStatus: { label: '待申报', type: 'pending' },
        progressStatus: '材料准备中',
        amount: '60万',
        advice: '需补充能耗检测报告和绿色认证材料',
      },
      {
        id: 2,
        name: '杭州绿色低碳科技有限公司',
        applyStatus: { label: '已申报', type: 'applied' },
        progressStatus: '审核中',
        amount: '45万',
        advice: '补充近3年能耗数据，加快审核进度',
      },
    ],
    newPolicySuggestion: '建议扩大绿色发展专项资金覆盖范围，增设节能改造专项补贴',
  },
  {
    id: 4,
    name: '人才引进专项补贴',
    matchedCount: 523,
    implementedCount: 410,
    implementationRate: 78.3,
    enterprises: [
      {
        id: 1,
        name: '杭州人工智能科技有限公司',
        applyStatus: { label: '已申报', type: 'applied' },
        progressStatus: '审核中',
        amount: '30万',
        advice: '补充引进人才的学历证明及劳动合同',
      },
    ],
    newPolicySuggestion: '建议增加对博士及以上高层次人才的补贴力度，吸引顶尖科研人才落户',
  },
  {
    id: 5,
    name: '小微企业税收优惠',
    matchedCount: 2876,
    implementedCount: 1301,
    implementationRate: 45.2,
    enterprises: [
      {
        id: 1,
        name: '浙江现代商贸有限公司',
        applyStatus: { label: '待申报', type: 'pending' },
        progressStatus: '材料准备中',
        amount: '15万',
        advice: '需提交近半年纳税申报表及资产证明',
      },
      {
        id: 2,
        name: '杭州文化创意有限公司',
        applyStatus: { label: '待申报', type: 'pending' },
        progressStatus: '未开始',
        amount: '8万',
        advice: '建议尽快登记企业信息，本期优惠截止4月30日',
      },
    ],
    newPolicySuggestion: '建议简化税收优惠申报流程，支持网上一键申请，降低企业合规成本',
  },
  {
    id: 6,
    name: '科创企业股权激励',
    matchedCount: 312,
    implementedCount: 261,
    implementationRate: 83.6,
    enterprises: [
      {
        id: 1,
        name: '浙江数字科技集团股份有限公司',
        applyStatus: { label: '已完成', type: 'done' },
        progressStatus: '已发放',
        amount: '200万',
        advice: '建议进一步完善股权激励方案，吸引更多核心技术人员',
      },
    ],
    newPolicySuggestion: '建议将股权激励政策延伸至初创期科技企业，支持科技成果转化',
  },
];

const PAGE_SIZE = 4;

/* ===================== 工具函数 ===================== */
function getRateColor(rate) {
  if (rate >= 80) return '#00A63E';
  if (rate >= 60) return '#155DFC';
  return '#D08700';
}

function getProgressColor(rate) {
  if (rate >= 80) return '#00C950';
  if (rate >= 60) return '#155DFC';
  return '#D08700';
}

/* ===================== 企业施策卡片 ===================== */
function EnterpriseItem({ enterprise }) {
  const { name, applyStatus, progressStatus, amount, advice } = enterprise;

  const statusStyle =
    applyStatus.type === 'applied'
      ? { background: '#EFF6FF', color: '#155DFC' }
      : applyStatus.type === 'done'
      ? { background: '#F0FDF4', color: '#00A63E' }
      : { background: '#FEFCE8', color: '#D08700' };

  return (
    <div className="pl-enterprise-item">
      <div className="pl-enterprise-top">
        <div className="pl-enterprise-left">
          <div className="pl-enterprise-name-row">
            <span className="pl-enterprise-name">{name}</span>
          </div>
          <div className="pl-enterprise-status-row">
            <span className="pl-enterprise-badge" style={statusStyle}>
              {applyStatus.label}
            </span>
            <span className="pl-enterprise-progress-status">{progressStatus}</span>
          </div>
        </div>
        <span className="pl-enterprise-amount">{amount}</span>
      </div>
      <div className="pl-enterprise-advice">
        <img src={iconPolicyAdvice} alt="建议" className="pl-advice-icon" />
        <span className="pl-advice-text">{advice}</span>
      </div>
    </div>
  );
}

/* ===================== 政策卡片（手风琴） ===================== */
function PolicyCard({ policy, expanded, onToggle }) {
  const rateColor = getRateColor(policy.implementationRate);
  const progressColor = getProgressColor(policy.implementationRate);

  return (
    <div className="pl-policy-card">
      {/* 政策头部（点击展开/收起） */}
      <div className="pl-policy-header" onClick={onToggle}>
        <div className="pl-policy-header-main">
          <div className="pl-policy-title-row">
            <img src={iconPolicyDoc} alt="政策" className="pl-policy-doc-icon" />
            <div className="pl-policy-title-group">
              <span className="pl-policy-name">{policy.name}</span>
              <span className="pl-policy-match-info">
                匹配 {policy.matchedCount.toLocaleString()} 家 · 已实施 {policy.implementedCount.toLocaleString()} 家
              </span>
            </div>
          </div>
          <div className="pl-policy-rate-group">
            <span className="pl-policy-rate-value" style={{ color: rateColor }}>
              {policy.implementationRate}%
            </span>
            <span className="pl-policy-rate-label">实施率</span>
          </div>
        </div>
        <div className="pl-policy-progress-track">
          <div
            className="pl-policy-progress-fill"
            style={{
              width: `${policy.implementationRate}%`,
              background: progressColor,
            }}
          />
        </div>
      </div>

      {/* 展开内容（手风琴） */}
      {expanded && (
        <div className="pl-expanded-content">
          {/* 企业施策建议与进展 */}
          <div className="pl-enterprise-section">
            <div className="pl-section-header">
              <img src={iconPolicyEnterprise} alt="企业施策" className="pl-section-icon" />
              <span className="pl-section-title">企业施策建议与进展</span>
            </div>
            <div className="pl-enterprise-list">
              {policy.enterprises.map((ent) => (
                <EnterpriseItem key={ent.id} enterprise={ent} />
              ))}
            </div>
          </div>

          {/* 新政策建议 */}
          <div className="pl-newpolicy-section">
            <div className="pl-section-header">
              <img src={iconPolicyNewpolicy} alt="新政策建议" className="pl-section-icon" />
              <span className="pl-section-title">新政策建议</span>
            </div>
            <div className="pl-newpolicy-card">
              <span className="pl-newpolicy-text">{policy.newPolicySuggestion}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== 主页面 ===================== */
export default function PolicyList() {
  const [expandedIds, setExpandedIds] = useState(new Set());

  // 列表数据（懒初始化避免 race condition）
  const [displayedItems, setDisplayedItems] = useState(() => MOCK_POLICIES.slice(0, PAGE_SIZE));
  const [hasMore, setHasMore] = useState(MOCK_POLICIES.length > PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setDisplayedItems((prev) => {
      const nextPage = MOCK_POLICIES.slice(prev.length, prev.length + PAGE_SIZE);
      setHasMore(prev.length + nextPage.length < MOCK_POLICIES.length);
      return nextPage.length > 0 ? [...prev, ...nextPage] : prev;
    });
    setLoading(false);
  }, [loading, hasMore]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setDisplayedItems(MOCK_POLICIES.slice(0, PAGE_SIZE));
    setHasMore(MOCK_POLICIES.length > PAGE_SIZE);
    setExpandedIds(new Set());
    setRefreshing(false);
  }, []);

  const togglePolicy = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // 总体统计
  const totalPolicies = 45;
  const totalMatched = 3456;
  const overallRate = 68.5;

  return (
    <div className="pl-container">
      {/* ===== 头部 ===== */}
      <PageHeader title="政策匹配">
        {/* 统计数据行 */}
        <div className="pl-stats-row">
          <div className="pl-stat-box">
            <span className="pl-stat-label">政策总数</span>
            <span className="pl-stat-value">{totalPolicies}</span>
          </div>
          <div className="pl-stat-box">
            <span className="pl-stat-label">匹配企业</span>
            <span className="pl-stat-value">{totalMatched.toLocaleString()}</span>
          </div>
          <div className="pl-stat-box">
            <span className="pl-stat-label">实施率</span>
            <span className="pl-stat-value">{overallRate}%</span>
          </div>
        </div>

        {/* 整体实施进度 */}
        <div className="pl-overall-progress">
          <div className="pl-overall-progress-header">
            <img src={iconPolicyProgress} alt="整体实施进度" className="pl-progress-icon" />
            <span className="pl-overall-progress-label">整体实施进度</span>
          </div>
          <div className="pl-overall-track">
            <div
              className="pl-overall-fill"
              style={{ width: `${overallRate}%` }}
            />
          </div>
        </div>
      </PageHeader>

      {/* ===== 政策列表 ===== */}
      <div className="pl-body">
        <InfiniteList
          items={displayedItems}
          renderItem={(policy) => (
            <PolicyCard
              policy={policy}
              expanded={expandedIds.has(policy.id)}
              onToggle={() => togglePolicy(policy.id)}
            />
          )}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          endText="已显示全部政策"
        />
      </div>
    </div>
  );
}

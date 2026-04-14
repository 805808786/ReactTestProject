import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteList from './components/InfiniteList';
import DateSelection from './components/dataSelection/index';
import iconSearchInput from '../assets/icon-search-input.svg';
import iconSceneCalendar from '../assets/icon-scene-calendar.svg';
import './SceneRadar.css';
import PageHeader from '../components/PageHeader';

/* ===================== Mock 数据 ===================== */
const SCENE_DATA = [
  {
    id: 1,
    name: '人工智能企业筛选场景',
    description: '人工智能企业筛选',
    enterprises: 6262,
    dynamics: 32,
    todayEnterprises: 3,
    todayDynamics: 3,
  },
  {
    id: 2,
    name: '115X专题企业筛选场景',
    description: '115X专项企业筛选',
    enterprises: 18765,
    dynamics: 28,
    todayEnterprises: 2,
    todayDynamics: 1,
  },
  {
    id: 3,
    name: '数据产业专题筛选场景',
    description: '数据产业专项筛选',
    enterprises: 21512,
    dynamics: 45,
    todayEnterprises: 5,
    todayDynamics: 4,
  },
  {
    id: 4,
    name: '党建企业专题场景',
    description: '党建企业专项筛选',
    enterprises: 350,
    dynamics: 23,
    todayEnterprises: 1,
    todayDynamics: 2,
  },
  {
    id: 5,
    name: '出海企业专题场景',
    description: '出海企业专项筛选',
    enterprises: 9876,
    dynamics: 19,
    todayEnterprises: 3,
    todayDynamics: 1,
  },

];
// const SCENE_DATA = [
//   {
//     id: 1,
//     name: '人工智能企业筛选场景',
//     description: '人工智能企业筛选',
//     enterprises: 2042,
//     dynamics: 32,
//     todayEnterprises: 3,
//     todayDynamics: 3,
//   },
//   {
//     id: 2,
//     name: '党建企业专题场景',
//     description: '党建企业专项筛选',
//     enterprises: 18765,
//     dynamics: 28,
//     todayEnterprises: 2,
//     todayDynamics: 1,
//   },
//   {
//     id: 3,
//     name: '高成长企业专题场景',
//     description: '高成长企业专项筛选',
//     enterprises: 15432,
//     dynamics: 45,
//     todayEnterprises: 5,
//     todayDynamics: 4,
//   },
//   {
//     id: 4,
//     name: '出海企业专题场景',
//     description: '出海企业专项筛选',
//     enterprises: 12098,
//     dynamics: 23,
//     todayEnterprises: 1,
//     todayDynamics: 2,
//   },
//   {
//     id: 5,
//     name: '跨境电商专题场景',
//     description: '跨境电商专项筛选',
//     enterprises: 9876,
//     dynamics: 19,
//     todayEnterprises: 3,
//     todayDynamics: 1,
//   },
//   {
//     id: 6,
//     name: '先进制造专题场景',
//     description: '先进制造专项筛选',
//     enterprises: 14567,
//     dynamics: 31,
//     todayEnterprises: 2,
//     todayDynamics: 3,
//   },
//   {
//     id: 7,
//     name: '绿色低碳专题场景',
//     description: '绿色低碳专项筛选',
//     enterprises: 11234,
//     dynamics: 26,
//     todayEnterprises: 4,
//     todayDynamics: 2,
//   },
//   {
//     id: 8,
//     name: '数字经济专题场景',
//     description: '数字经济专项筛选',
//     enterprises: 17890,
//     dynamics: 38,
//     todayEnterprises: 3,
//     todayDynamics: 5,
//   },
// ];

const PAGE_SIZE = 5;

/* ===================== 场景卡片 ===================== */
function SceneCard({ scene, onSceneDetail }) {
  const navigate = useNavigate();
  const { id, name, description, enterprises, dynamics, todayEnterprises, todayDynamics } = scene;

  return (
    <div className="sr-card">
      {/* 顶部：场景名称 + 场景说明 */}
      <div className="sr-card-header" onClick={() => onSceneDetail(scene)}>
        <div className="sr-card-title">{name}</div>
        {scene.id != 5 && <span
          className="sr-card-badge"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/scene-description/${id}`, { state: { sceneName: name } });
          }}
          style={{ cursor: 'pointer' }}
        >场景说明</span>}
      </div>

      {/* 场景描述 */}
      <div className="sr-card-desc">{description}</div>

      {/* 数据指标 */}
      <div className="sr-card-metrics">
        <div className="sr-metric-item" onClick={() => { scene.id == 1 && onSceneDetail(scene) }}>
          <div className="sr-metric-header">
            <span className="sr-metric-label">{name.replace('专题场景', '')}</span>
            <span className="sr-metric-arrow">→</span>
          </div>
          <div className="sr-metric-body">
            <span className="sr-metric-value">{enterprises.toLocaleString()}家</span>
            <span className="sr-metric-today">今日+{todayEnterprises}</span>
          </div>
        </div>

        <div className="sr-metric-item" onClick={() => { scene.id == 1 && navigate('/scene-enterprise-dynamic?sceneName=人工智能') }}>
          <div className="sr-metric-header">
            <span className="sr-metric-label">{name.replace('专题场景', '')}动态</span>
            <span className="sr-metric-arrow">→</span>
          </div>
          <div className="sr-metric-body">
            <span className="sr-metric-value">{dynamics}条</span>
            <span className="sr-metric-today">今日+{todayDynamics}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 将 'YYYY-MM-DD' 转为友好显示格式
function formatDateDisplay(str) {
  if (!str) return '场景日历';
  const [y, m, d] = str.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

/* ===================== 主页面 ===================== */
export default function SceneRadar() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // 日期选择弹框
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);

  // 列表数据
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 搜索防抖
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  // 计算过滤后的全部数据
  const getFiltered = useCallback(() => {
    return SCENE_DATA.filter(scene => {
      const matchSearch = !debouncedSearch ||
        scene.name.includes(debouncedSearch) ||
        scene.description.includes(debouncedSearch);
      return matchSearch;
    });
  }, [debouncedSearch]);

  // 计算统计数据
  const stats = {
    sceneCount: 5,
    totalEnterprises: 28124,
    totalDynamics: 670
    // totalEnterprises: SCENE_DATA.reduce((sum, s) => sum + s.enterprises, 0),
    // totalDynamics: SCENE_DATA.reduce((sum, s) => sum + s.dynamics, 0),
  };

  // 初始化 / 筛选变化时重置列表
  useEffect(() => {
    const filtered = getFiltered();
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(filtered.length > PAGE_SIZE);
  }, [getFiltered]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const filtered = getFiltered();
    const nextPage = filtered.slice(displayedItems.length, displayedItems.length + PAGE_SIZE);
    if (nextPage.length > 0) {
      setDisplayedItems(prev => [...prev, ...nextPage]);
    }
    setHasMore(displayedItems.length + nextPage.length < filtered.length);
    setLoading(false);
  }, [loading, hasMore, displayedItems.length, getFiltered]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    const filtered = getFiltered();
    const page = filtered.slice(0, PAGE_SIZE);
    setDisplayedItems(page);
    setHasMore(filtered.length > PAGE_SIZE);
    setRefreshing(false);
  }, [getFiltered]);

  return (
    <div className="sr-container">
      {/* ===== 头部 ===== */}
      <PageHeader title="场景雷达" onBack={() => navigate('/')}>
        {/* 搜索行 */}
        <div className="sr-search-row">
          <div className="sr-search-bar">
            <img src={iconSearchInput} alt="搜索" className="sr-search-icon" />
            <input
              className="sr-search-input"
              placeholder="搜索场景名称"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <button className="sr-calendar-btn" onClick={() => { setPendingDate(confirmedDate); setSheetOpen(true); }}>
            场景日历
          </button>
        </div>

        {/* ===== 数据统计区域 ===== */}
        <div className="sr-stats-area">
          <div className="sr-stat-card sr-stat-card--primary">
            <div className="sr-stat-label">场景总数</div>
            <div className="sr-stat-value">{stats.sceneCount}</div>
          </div>
          <div className="sr-stat-card">
            <div className="sr-stat-label">企业总数</div>
            <div className="sr-stat-value">{stats.totalEnterprises.toLocaleString()}</div>
          </div>
          <div className="sr-stat-card">
            <div className="sr-stat-label">场景动态</div>
            <div className="sr-stat-value">{stats.totalDynamics}</div>
          </div>
        </div>
      </PageHeader>

      {/* ===== 场景列表 ===== */}
      <InfiniteList
        items={displayedItems}
        renderItem={(item) => (
          <SceneCard
            scene={item}
            onSceneDetail={(scene) => {
              const displayName = scene.name.includes('专题场景')
                ? scene.name.replace('专题场景', '')
                : scene.name;
              navigate('/scene-enterprise', { state: { sceneName: displayName } });
            }}
          />
        )}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        hasMore={hasMore}
        loading={loading}
        refreshing={refreshing}
        emptyText="暂无场景数据"
        endText="已显示全部场景"
      />

      {/* 日期选择底部弹框 */}
      {sheetOpen && (
        <div className="sr-sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="sr-sheet" onClick={e => e.stopPropagation()}>
            {/* 把手 */}
            <div className="sr-sheet-handle" />

            {/* 日历组件 */}
            <DateSelection
              dateDisabledType="afterTodayAndToday"
              onSelect={date => setPendingDate(date)}
              defaultValue={pendingDate}
            />

            {/* 已选日期信息 */}
            {pendingDate && (
              <div className="sr-sheet-info">
                <div className="sr-sheet-info-date">{formatDateDisplay(pendingDate)}</div>

                {/* 卡片1：场景总数 */}
                <div className="sr-sheet-card sr-sheet-card--blue">
                  <div className="sr-sheet-card-label">场景总数</div>
                  <div className="sr-sheet-card-row">
                    <span className="sr-sheet-card-value">8个</span>
                    <span className="sr-sheet-card-delta sr-sheet-card-delta--pos">+1个</span>
                  </div>
                </div>

                {/* 卡片2：新增场景 */}
                <div className="sr-sheet-card sr-sheet-card--orange">
                  <div className="sr-sheet-card-label">新增场景</div>
                  <div className="sr-sheet-card-txt">数商企业专题场景</div>
                </div>

                {/* 卡片3：发布背景 */}
                <div className="sr-sheet-card sr-sheet-card--purple">
                  <div className="sr-sheet-card-label">发布背景</div>
                  <div className="sr-sheet-card-desc">
                    为全面落实中央、省市区关于科技创新与产业创新深度融合以及新型工业化的各项任务要求，推动拱墅区制造业高质量发展，特制定本行动计划。
                  </div>
                </div>
              </div>
            )}

            {/* 底部按钮组 */}
            <div className="sr-sheet-footer">
              <button className="sr-sheet-btn sr-sheet-btn--cancel" onClick={() => setSheetOpen(false)}>取消</button>
              <button className="sr-sheet-btn sr-sheet-btn--confirm" onClick={() => { setConfirmedDate(pendingDate); setSheetOpen(false); }}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

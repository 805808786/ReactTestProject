import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteList from './components/InfiniteList';
import iconBack from '../assets/icon-back.svg';
import iconSearchInput from '../assets/icon-search-input.svg';
import './SceneRadar.css';

/* ===================== Mock 数据 ===================== */
const SCENE_DATA = [
  {
    id: 1,
    name: '数商企业专题场景',
    description: '数商企业专项筛选',
    enterprises: 21943,
    dynamics: 32,
    todayEnterprises: 3,
    todayDynamics: 3,
  },
  {
    id: 2,
    name: '党建企业专题场景',
    description: '党建企业专项筛选',
    enterprises: 18765,
    dynamics: 28,
    todayEnterprises: 2,
    todayDynamics: 1,
  },
  {
    id: 3,
    name: '高成长企业专题场景',
    description: '高成长企业专项筛选',
    enterprises: 15432,
    dynamics: 45,
    todayEnterprises: 5,
    todayDynamics: 4,
  },
  {
    id: 4,
    name: '出海企业专题场景',
    description: '出海企业专项筛选',
    enterprises: 12098,
    dynamics: 23,
    todayEnterprises: 1,
    todayDynamics: 2,
  },
  {
    id: 5,
    name: '跨境电商专题场景',
    description: '跨境电商专项筛选',
    enterprises: 9876,
    dynamics: 19,
    todayEnterprises: 3,
    todayDynamics: 1,
  },
  {
    id: 6,
    name: '先进制造专题场景',
    description: '先进制造专项筛选',
    enterprises: 14567,
    dynamics: 31,
    todayEnterprises: 2,
    todayDynamics: 3,
  },
  {
    id: 7,
    name: '绿色低碳专题场景',
    description: '绿色低碳专项筛选',
    enterprises: 11234,
    dynamics: 26,
    todayEnterprises: 4,
    todayDynamics: 2,
  },
  {
    id: 8,
    name: '数字经济专题场景',
    description: '数字经济专项筛选',
    enterprises: 17890,
    dynamics: 38,
    todayEnterprises: 3,
    todayDynamics: 5,
  },
];

const PAGE_SIZE = 10;

/* ===================== 场景卡片 ===================== */
function SceneCard({ scene, onSceneDetail }) {
  const { name, description, enterprises, dynamics, todayEnterprises, todayDynamics } = scene;

  return (
    <div className="sr-card">
      {/* 顶部：场景名称 + 场景说明 */}
      <div className="sr-card-header">
        <div className="sr-card-title">{name}</div>
        <span className="sr-card-badge" onClick={() => onSceneDetail(scene)} style={{ cursor: 'pointer' }}>场景说明</span>
      </div>

      {/* 场景描述 */}
      <div className="sr-card-desc">{description}</div>

      {/* 数据指标 */}
      <div className="sr-card-metrics">
        <div className="sr-metric-item">
          <div className="sr-metric-header">
            <span className="sr-metric-label">{name.replace('专题场景', '')}</span>
            <span className="sr-metric-arrow">→</span>
          </div>
          <div className="sr-metric-body">
            <span className="sr-metric-value">{enterprises.toLocaleString()}家</span>
            <span className="sr-metric-today">今日+{todayEnterprises}</span>
          </div>
        </div>

        <div className="sr-metric-item">
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

/* ===================== 主页面 ===================== */
export default function SceneRadar() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // 列表数据
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
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
    sceneCount: 8,
    totalEnterprises: SCENE_DATA.reduce((sum, s) => sum + s.enterprises, 0),
    totalDynamics: SCENE_DATA.reduce((sum, s) => sum + s.dynamics, 0),
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
      <div className="sr-header">
        <div className="sr-header-top">
          <button className="sr-back-btn" onClick={() => navigate('/')} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="sr-header-title">场景雷达</span>
        </div>
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
          <button className="sr-calendar-btn">场景日历</button>
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
      </div>

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
    </div>
  );
}

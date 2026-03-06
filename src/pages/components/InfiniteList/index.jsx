import { useState, useRef, useCallback, useEffect } from 'react';
import './index.css';

/**
 * InfiniteList — 无限滚动 + 下拉刷新列表公用组件
 * Props:
 *   items          {any[]}    列表数据
 *   renderItem     {fn}       (item, index) => ReactNode，渲染每条数据
 *   onLoadMore     {fn}       async () => { hasMore: bool } 加载更多
 *   onRefresh      {fn}       async () => void 下拉刷新
 *   hasMore        {bool}     是否还有更多数据
 *   loading        {bool}     加载中状态
 *   refreshing     {bool}     刷新中状态
 *   emptyText      {string}   空数据提示
 *   endText        {string}   已加载完全部数据提示
 */
export default function InfiniteList({
  items = [],
  renderItem,
  onLoadMore,
  onRefresh,
  hasMore = true,
  loading = false,
  refreshing = false,
  emptyText = '暂无数据',
  endText = '已显示全部数据',
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const touchStartY = useRef(0);
  const [pullDist, setPullDist] = useState(0);
  const PULL_THRESHOLD = 60;

  // 触底加载更多
  useEffect(() => {
    if (!bottomRef.current || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore && onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  // 下拉刷新（touch）
  const handleTouchStart = useCallback((e) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0 || refreshing) return;
    const dist = e.touches[0].clientY - touchStartY.current;
    if (dist > 0) {
      setPullDist(Math.min(dist * 0.5, PULL_THRESHOLD));
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDist >= PULL_THRESHOLD && !refreshing) {
      onRefresh && onRefresh();
    }
    setPullDist(0);
  }, [pullDist, refreshing, onRefresh]);

  return (
    <div
      className="il-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 下拉刷新指示器 */}
      {(pullDist > 0 || refreshing) && (
        <div className="il-refresh-indicator" style={{ height: refreshing ? 44 : pullDist }}>
          <div className={`il-spinner${refreshing ? ' il-spinner--spin' : ''}`} />
          <span>{refreshing ? '刷新中...' : pullDist >= PULL_THRESHOLD ? '释放刷新' : '下拉刷新'}</span>
        </div>
      )}

      {/* 列表内容 */}
      <div className="il-list">
        {items.length === 0 && !loading && !refreshing ? (
          <div className="il-empty">{emptyText}</div>
        ) : (
        items.map((item, idx) => {
            const key = item?.id ?? idx;
            return (
              <div className="il-item" key={key}>
                {renderItem(item, idx)}
              </div>
            );
          })
        )}
      </div>

      {/* 底部状态区 */}
      <div className="il-bottom" ref={bottomRef}>
        {loading ? (
          <div className="il-loading">
            <div className="il-spinner il-spinner--spin" />
            <span>加载中...</span>
          </div>
        ) : !hasMore && items.length > 0 ? (
          <div className="il-end">{endText}</div>
        ) : null}
      </div>
    </div>
  );
}

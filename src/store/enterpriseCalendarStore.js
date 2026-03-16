import { create } from 'zustand';
import { getByChangeDate, getChangeByTime, queryEnterpriseByTime } from '../api/enterpriseChange';

const useEnterpriseCalendarStore = create((set, get) => ({
  // 当前选中日期的企业变化数据，包含 todayTotal（企业总数）和 changeNum（企业变化数量）
  changeDateData: null,
  // 趋势图数据
  trendData: [],
  // 时间轴分页列表数据
  timelineListData: [],
  timelineLoading: false,
  timelinePage: 1,
  hasMoreTimeline: true,
  loading: false,
  error: null,

  // 根据日期获取企业变化数据
  fetchByChangeDate: async (changeDate) => {
    set({ loading: true, error: null });
    try {
      const data = await getByChangeDate(changeDate);
      set({ changeDateData: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // 获取趋势图数据
  fetchTrendData: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await getChangeByTime(startDate, endDate);
      set({ trendData: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // 初始获取时间轴列表
  fetchTimelineList: async (startDate, endDate) => {
    set({ timelineLoading: true, timelinePage: 1, timelineListData: [] });
    try {
      const res = await queryEnterpriseByTime({
        startDate,
        endDate,
        currentPage: 1,
        pageSize: 10
      });
      console.log('API Response:', res);
      // 更加兼容的解析逻辑：优先取 list 字段，其次看 res 是否本身是数组，最后看 res.data
      const list = Array.isArray(res?.list) ? res.list : (Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []));
      const total = res?.total ?? list.length;
      
      set({ 
        timelineListData: list, 
        timelineLoading: false,
        hasMoreTimeline: list.length < total && list.length > 0 && list.length >= 10
      });
    } catch (err) {
      console.error('Fetch Timeline Error:', err);
      set({ timelineLoading: false });
    }
  },

  // 加载更多时间轴列表
  loadMoreTimeline: async (startDate, endDate) => {
    const { timelinePage, timelineListData, timelineLoading, hasMoreTimeline } = get();
    if (timelineLoading || !hasMoreTimeline) return;

    set({ timelineLoading: true });
    const nextPage = timelinePage + 1;
    try {
      const res = await queryEnterpriseByTime({
        startDate,
        endDate,
        currentPage: nextPage,
        pageSize: 10
      });
      const list = Array.isArray(res.list) ? res.list : (Array.isArray(res) ? res : []);
      const total = res.total || 0;
      
      set({ 
        timelineListData: [...timelineListData, ...list],
        timelinePage: nextPage,
        timelineLoading: false,
        hasMoreTimeline: (timelineListData.length + list.length) < total
      });
    } catch (err) {
      set({ timelineLoading: false });
    }
  },

  clearChangeDateData: () => set({ 
    changeDateData: null, 
    trendData: [], 
    timelineListData: [], 
    timelinePage: 1, 
    hasMoreTimeline: true,
    error: null 
  }),
}));

export default useEnterpriseCalendarStore;

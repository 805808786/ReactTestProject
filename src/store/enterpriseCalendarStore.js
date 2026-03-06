import { create } from 'zustand';
import { getByChangeDate } from '../api/enterpriseChange';

const useEnterpriseCalendarStore = create((set) => ({
  // 当前选中日期的企业变化数据，包含 todayTotal（企业总数）和 changeNum（企业变化数量）
  changeDateData: null,
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

  clearChangeDateData: () => set({ changeDateData: null, error: null }),
}));

export default useEnterpriseCalendarStore;

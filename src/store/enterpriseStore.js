import { create } from 'zustand'
import { getEnterpriseChangeByDate } from '../api/enterprise'
import { getStatisticsByChangeDateType } from '../api/enterpriseChange'

export const useEnterpriseStore = create((set) => ({
  enterpriseData: null,
  loading: false,
  error: null,

  fetchEnterpriseData: async (changeDate) => {
    set({ loading: true, error: null })
    try {
      const [overviewData, statisticsData] = await Promise.all([
        getEnterpriseChangeByDate(changeDate),
        getStatisticsByChangeDateType(changeDate)
      ])
      
      // 处理统计数据，映射到组件需要的格式
      // 接口返回对象: { newNum, newMoveInNum, cancelNum, otherNum, totalNum }
      const stats = {
        registered: (Number(statisticsData?.newNum || 0) + Number(statisticsData?.newMoveInNum || 0)),
        cancelled: Number(statisticsData?.cancelNum || 0),
        other: Number(statisticsData?.otherNum || 0)
      }

      set({ 
        enterpriseData: {
          ...overviewData,
          statistics: stats
        }, 
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))

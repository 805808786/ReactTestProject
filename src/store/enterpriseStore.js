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
      
      // 接口返回对象: { newNum, newMoveInNum, cancelNum, otherNum, totalNum }
      const stats = {
        newNum: Number(statisticsData?.newNum || 0),
        newMoveInNum: Number(statisticsData?.newMoveInNum || 0),
        cancelNum: Number(statisticsData?.cancelNum || 0),
        otherNum: Number(statisticsData?.otherNum || 0),
        // 保留旧字段防止报错，但后续 UI 会切到新字段
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

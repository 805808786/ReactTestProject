import { create } from 'zustand'
import { getEnterpriseChangeByDate } from '../api/enterprise'

export const useEnterpriseStore = create((set) => ({
  enterpriseData: null,
  loading: false,
  error: null,

  fetchEnterpriseData: async (changeDate) => {
    set({ loading: true, error: null })
    try {
      const data = await getEnterpriseChangeByDate(changeDate)
      set({ enterpriseData: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))

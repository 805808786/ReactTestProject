import { create } from 'zustand'

export const useBottomNavStore = create((set) => ({
  activeBottomTab: 2, // 首页默认为视觉第3项 (index 2)
  
  setActiveBottomTab: (index) => set({ activeBottomTab: index }),
}))
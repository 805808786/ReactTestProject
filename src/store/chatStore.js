import { create } from 'zustand'

export const useChatStore = create((set) => ({
  isChatOpen: false,
  setIsChatOpen: (open) => set({ isChatOpen: open }),
}))

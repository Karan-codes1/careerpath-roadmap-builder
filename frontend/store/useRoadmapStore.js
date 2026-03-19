import { create } from 'zustand'
import api from '@/utils/api'

const useRoadmapStore = create((set, get) => ({
  roadmaps: [],
  loading: false,

  fetchRoadmaps: async () => {
    // Prevent refetch if already loaded
    if (get().roadmaps.length > 0) return

    set({ loading: true })

    try {
      const res = await api.get('/roadmap')
      console.log('ROADMAP RESPONSE:', res.data);

      set({
        roadmaps: Array.isArray(res?.data?.allroadmaps)
          ? res.data.allroadmaps
          : [],
      })
    } catch (err) {
      console.error('Error fetching roadmaps:', err)
      set({ roadmaps: [] }) // 🔒 guarantee array
    } finally {
      set({ loading: false })
    }
  },
}))

export default useRoadmapStore

import { create } from 'zustand'
import api from '@/utils/api'

export const RoadmapDetailsStore = create((set, get) => ({
  roadmapData: {},
  loading: false,

  fetchRoadmapDetails: async (id) => {
    const { roadmapData, loading } = get()
    if (!id || roadmapData[id] || loading) return

    set({ loading: true })

    try {
      const [res, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`),
      ])

      set((state) => ({
        roadmapData: {
          ...state.roadmapData,
          [id]: {
            roadmap: res.data.roadmap || null,
            milestones: Array.isArray(res.data.milestones)
              ? res.data.milestones
              : [],
            progress: progressRes.data || {
              progressPercentage: 0,
              completedMilestones: 0,
              remainingMilestones: 0,
            },
            lastFetched: Date.now(),
          },
        },
      }))
    } catch (err) {
      console.error('[RoadmapStore] Fetch failed:', err)
    } finally {
      set({ loading: false })
    }
  },

  setRoadmapData: (id, updatedData) =>
    set((state) => ({
      roadmapData: {
        ...state.roadmapData,
        [id]: {
          ...(state.roadmapData[id] || {}),
          ...updatedData,
        },
      },
    })),
}))

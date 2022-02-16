import { defineStore } from 'pinia'

export const useDefaultStore = defineStore('default', {
  state: () => ({
    time: 2
  }),
  // 声明getters
  getters: {
    calcTime(state) {
      return state.time + 2
    }
  },
  // 声明actions
})
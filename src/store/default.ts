import { defineStore } from 'pinia'

export const useDefaultStore = defineStore('default', {
  state: () => ({
    time: 2,
    count: 36,
    name: 'xx'
  }),
  // 声明getters
  getters: {
    calcTime(state) {
      return state.time + 2
    }
  },
  // 声明actions
  actions: {
    addCount(num = 1) {
      // 同步
      // this.count += num
      // 异步
      setTimeout(() => {
        this.count += num
      }, 3000);
    }
  }
})
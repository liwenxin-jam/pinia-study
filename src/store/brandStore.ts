import { defineStore } from 'pinia'

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brandList: [
      { id: '1', name: '奔驰', ctime: '2020-09-23' },
      { id: '2', name: '宝马', ctime: '2020-09-21' },
      { id: '3', name: '长安奔驰', ctime: '2014-06-23' },
      { id: '4', name: '千里马', ctime: '2020-05-03' }
    ], // 品牌列表字段
    brand: {
      id: '',
      name: '',
      ctime: new Date().toLocaleDateString()
    }, // 双向绑定字段
    keyword: '', // 搜索关键词
  }),
  // 声明getters
  getters: {
    // 模糊搜索列表
    searchResult(state) {
      return state.brandList.filter(item => item.name.includes(state.keyword))
    }
  },
  // 声明actions
  actions: {
    /**
     * @desc 新增品牌
     */
    addBrand() {
      // 1. 把state定义的brand push brandList
      this.brandList.push(this.brand)

      // 2. 清空input中的内容
      this.brand = {
        id: '',
        name: '',
        ctime: new Date().toLocaleDateString()
      }
    },
    /**
     * 删除品牌
     * @param id 唯一编号
     */
    delBrand(id: string) {
      this.brandList = this.brandList.filter(item => item.id !== id)
    }
  }
})
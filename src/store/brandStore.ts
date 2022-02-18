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
    } // 双向绑定字段
  }),
  // 声明getters
  // 声明actions
  actions: {
    addBrand() {
      console.log(1111);
      // 1. 把state定义的brand push brandList
      this.brandList.push(this.brand)

      // 2. 清空input中的内容
      this.brand = {
        id: '',
        name: '',
        ctime: new Date().toLocaleDateString()
      }
    }
  }
})
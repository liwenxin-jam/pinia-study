# Vue 3 + Typescript + Vite

> [官网](https://pinia.vuejs.org/)

## 创建vite项目，也可以用vue-cli，选其一即可
```bash
npm install @vue/cli -g
npm install vite -g
npm install create-vite-app -g 

vue create projectName
npm init vite@latest
yarn create vite
create-vite-app projectName
```

## 可以单独安装pinia包依赖
```bash
npm install pinia
yarn add pinia
```

## API
```js
createPinia
defineStore
storeToRefs
```

- 参考资料
1. 基于B站[抛弃 Vuex，使用 Pinia](https://www.bilibili.com/video/BV11Y411b7nb?p=1)，打卡点11 HelloWorld.vue，mainStore

2. 基于B站[下一代Vue状态管理工具—Pinia](https://www.bilibili.com/video/BV1eu411f7Gn?p=1)，打卡点15 
   1. HelloWorld.vue，defaultStore
   2. BrandManagement.vue brandStore

3. 基于B站[Vue3 + vite + Ts + pinia + 实战 + 源码](https://www.bilibili.com/video/BV1dS4y1y7vd?p=1)，打卡点23
- vue3回顾 与vue2对比
  - vue2 Observer vue3 proxy
    - defineReactive(Object.defineProperty) 
    - walk(Object.keys和forEach)
  - 静态标记
    - 二进制 位运算 2 4 8 16 32
  - Fragment、Suspense(传送门)
    - 允许多个根节点(v-model也允许绑定多个)
  - render
    - 支持JSX写法
  - treeShaking优化
    - 减少打包项
  - Hooks
    - setup语法糖
- vue 虚拟dom diff算法
  - 无key：无key patch的时候会替换
  - 有key：
    1. 前序对比算法
    2. 尾序对比算法
    3. 新节点如果多出来，就是挂载通过patch函数第一个参数为null
    4. 旧节点如果多出来就是卸载
    5. 特殊情况乱序
  - 乱序
    - 循环递归遍历


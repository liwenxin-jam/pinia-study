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
    1. vue2 Observer vue3 proxy
      defineReactive(Object.defineProperty) 
      walk(Object.keys和forEach)
    2. 静态标记
      
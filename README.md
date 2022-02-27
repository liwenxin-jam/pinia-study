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

- 基本API

  - ref、Ref、isRef、shallowRef、triggerRef、customRef

    ```typescript
    import { ref, Ref, isRef, shallowRef, customRef } from vue
    let message = ref<string | number>('xx')
    // 接收一个泛型
    let message: Ref<string> = ref('xx')
    // 赋值
    message.value = 'change'
    isRef(message) // true
    
    let info = shallowRef({ name: 'xx' })
    // info.value是响应式，但里面的属性不是响应式
    info.value.name = 'aa' // 无效
    triggerRef(info) // 可以强制DOM更新，让上面赋值语句生效
    info.value = { name: 'aa' } // 有效
    
    // 自定义Ref
    function MyRef<T>(value: T) {
      return customRef((trank, trigger) => {
      	return {
          get() {
            trank() // 收集依赖
            return value
          },
          set(newVal: T) {
            value = newVal
            trigger() // 触发更新
          },
        }
    	})
    }
    let test = MyRef<string>('lai')
    test.value = 'hello'
    ```

  - reactive、readonly、shallowReactive

    ```typescript
    import { reactive、readonly、shallowReactive } from vue
    // let message = reactive() // [] {} 接收复杂对象
    // 1.1注意数组直接赋值会破坏响应式
    let info = reactive<number[]>([])
    // 2.1 先转化成对象
    type O = { list: number[] }
    let info = reactive<O>({ list: [], count: 1 })
    setTimeout(() => {
      let arr = [1, 2, 3, 4]
      info = arr
      console.log(info) // 值改变了，但页面没有实时同步刷新
      info = [...info] // 1.2 可以实时同步刷新
      info.list = [1,2,3,4] // 2.2
    }, 1000)
    
    let copyArr = readonly(arr)
    info.count++ // 警告，只读类型
    
    // 浅层是响应式，嵌套的非响应式
    let message = shallowReactive({
      test: 'xx',
      info: {
        info: {
          test: 'jam'
        }
      }
    })
    message.test = 'hello' // 无效
    message.info.info.test = 'hello' // 无效
    ```

  - toRef、toRefs、toRaw

    ```typescript
    import { toRef、toRefs, toRaw } from vue
    // 1.1
    const obj = {
      a: '1',
      b: '2'
    }
    // 1.2
    const obj = reactive({
      a: '1',
      b: '2'
    })
    // toRef引用对象依赖原始对象，不管原始对象是不是响应式，都会彼此影响。但1.1不会同步刷新页面
    const state = toRef(obj, b) 
    
    let obj = reactive({ a: 1, b: 2})
    const { a, b } = obj // 非响应式
    const { a, b } = toRefs(obj)
    
    let rawObj = toRaw(obj) // 将响应式对象变为原始对象
    ```

  - computed

    ```typescript
    import { computed } from vue
    const firstName = ref('hello')
    const lastName = ref('world')
    // 1.1
    const name = computed(() => {
      return firstName.value + lastName.value
    })
    const name = computed({
      get() {
        return firstName.value + lastName.value
      }
      set() {
      	firstName.value + lastName.value
    	}
    })
    ```

  - watch

    ```typescript
    import { watch } from vue
    const message = ref('xx')
    const test = reactive({ info: a: { b: 1 }, bb: 'cc' })
    // 支持监听多个 [message1, message2]，后面回调也是数组显示
    watch(message, (newVal, oldVal) => {
      console.log(newVal, oldVal)
    })
    watch(test, (newVal, oldVal) => {
      console.log(newVal, oldVal)
    }, { 
      deep: true, // 开启深度监听
      immediate: true, // 是否开启首次监听
    }) 
    test.info.a.b = 'hello'
    // 监听单一某个属性，不完整监听整个对象
    watch(() => test.bb, (newVal, oldVal) => {
      console.log(newVal, oldVal)
    }) 
    ```

    


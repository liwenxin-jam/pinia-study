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

3. 基于B站[Vue3 + vite + Ts + pinia + 实战 + 源码](https://www.bilibili.com/video/BV1dS4y1y7vd?p=1)，打卡点35

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

- 基本API，以下实例基于vue3.2 setup语法糖实现

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

  - watch、watchEffect

    ```typescript
    import { watch } from vue
    const message = ref('xx')
    const test = reactive({ info: a: { b: 1 }, bb: 'cc' })
    // 支持监听多个 [message1, message2]，后面回调也是数组显示，值改变才会触发
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
    
    // watchEffect类似react的useEffect
    watchEffect((oninvalidate)=> {
      const ipt: HTMLInputElement = document.querySelector('#ipt') as HTMLInputElement
      // 默认为null，需要借助flush post才能正常取到dom
      console.log(ipt)
      // 自动监听依赖项，非惰性，自动会调用一次
      console.log('message==>', message1.value)
      console.log('message==>', message2.value)
      // 清除负作用
      oninvalidate(()=> {
        // 会优于内部逻辑处理，例如防抖
        console.log('before')
      })
    }, {
      flush: 'post',
      // 依赖项改变触发，调试用
      onTrigger(e) {
        debugger
      }
    })
    ```

  - 生命周期

    1. onBeforeMount 创建之前
    2. onMounted 创建完成
    3. onBeforeUpdate 更新之前
    4. onUpdated 更新完成
    5. onBeforeUnmount 卸载之前
    6. onUnmounted 卸载完成
    7. onActivated 使用keep-alive激活状态
    8. onDeactivated 使用keep-alive后台状态

  - defineProps(withDefaults)、defineEmits、defineExpose

    ```typescript
    <script setup lang="ts">
      import { reactive } from 'vue'
      const list = reactive<number[]>([6,6,6])
      type Props = {
        title?: string,
        arr?: number[]
      }
      // 定义接收的props，声明的key必须同名
      withDefaults(defaineProps<Props>(), {
        title: '我是默认值',
        data: () => [1,2,3]
      })
    
    	const emit = defineEmits(['on-click', 'eventName'])
      // @click="clickTap"触发 @on-click="handle"接收
      const clickTap = () => { emit('on-click', list)}
      
      // 组件暴露自己的属性
      defineExpose({
        list,
        flag
      })
      // 其它组件可以通过ref获取它的实例拿到它暴露的实例
      const menu = ref(null)
      munu.value.?
    </script>
    ```

  - 动态组件

    ```typescript
    <component :is="current.comName"></component>
    
    type Tabs = {
      name: string,
      comName: any
    }
    // 从Tabs提取comName出来
    type Com = Pick<Tabs, 'comName'>
    // 从一个复合类型中，取出几个想要的类型的组合
    // type Com = Pick<Tabs, 'name' | 'comName'>
    // interface TSingleState extends Pick<TState, 'name' | 'age'> {}
    
    const arr = reactive<Tabs[]>([
      {
        name: '我是A组件',
        comName: markRaw(A) // 建议组件通过markRaw跳过proxy代理
      },
      {
        name: '我是B组件',
        comName: markRaw(B)
      },
      {
        name: '我是C组件',
        comName: markRaw(C)
      }
    ])
    // 当前项，默认读取第一个
    let current = reactive<Com>({
      comName: data[0].comName
    })
    ```

  - 异步组件

    - vite build打包的时候，会拆分异步组件的业务逻辑，会多.js文件。不会阻塞主流程js的加载，等进程空闲再加载，减少用户等待时间，加强优化体验

    ```vue
    <!-- 异步组件需要借助Suspense渲染，如异步接口返回 -->
    <template>
      <Suspense>
        <template #default>
          <A></A>
        </template>
        <template #fallback>
          <div>loading...</div>
        </template>
      <Suspense>
    </template>
     
    <script setup lang="ts">
      const A = defineAsyncComponent(()=> import("../compoents/A/index.vue")
      // setup语法糖支持直接await异步方法                             
    	const list = await axios
      // const asyncFunc = async () => await promiseFunc
    </script>
    ```

    

  - 插槽

    ```vue
    <!-- A组件 -->
    <template>
    	<main>
        <slot name="header"></slot>
        <slot :data="{ data: '传递数据' }"></slot>
        <slot name="footer"></slot>
      </main>
    </template>
    
    <!-- B组件 -->
    <template>
    	<A>
        <template v-slot:header>
          我是通过插槽header写进去的
    		</template>
    		<!-- 作用域插槽，父组件拿到子组件的值 -->
        <template v-slot="{ data }">
          {{ data }}
    		</template>
    		<!-- 简写方式 -->
    		<template #footer>
          我是通过插槽footer写进去的
    		</template>
    		<!-- 动态名称 slotName=ref('footer') -->
    		<template #[slotName]>
          我是通过插槽footer写进去的
    		</template>
      </A>
    </template>
    ```

  - transition

    - 生命周期
      - beforeEnter 进入之前
      - enter 过渡曲线
      - afterEnter 过渡完成
      - enterCancelled 过渡效果被打断

    


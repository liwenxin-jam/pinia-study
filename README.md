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
// vue3用createPinia vue2用PiniaVuePlugin
createPinia // 1. const store = createPinia() 2. createApp(App).use(store)
// 初始化仓库
defineStore
// 解构响应式数据  const { current, name } = storeToRefs(Test)
storeToRefs // 1. const Test = useTestStore() 2. const { current, name } = Test 不具有响应式
```

- Pinia.js有如下特点：

  - 完整的ts的支持；
  - 足够轻量，压缩后的体积只有1kb左右；
  - 去除mutations，只有state，getters，actions；
  - actions支持同步和异步；
  - 代码扁平化没有模块嵌套，只有store的概念，store之间可以自由使用，每一个store都是独立的
  - 无需手动添加store，store一旦创建便会自动添加；
  - 支持Vue和Vue2；

- 初始化仓库

  ```typescript
  import { defineStore } from 'pinia'
  import { Names } from './store-name'
  
  export const useTestStore = defineStore(Names.TEST, {
    state: () => {
      return {
        current: 1,
        name: 'xx'
      }
    },
    // computed 修饰一些值
    getters: {
      
    },
    // methods 可以做同步、异步，提交state
    actions: {
      // 注意：不能使用箭头函数定义 action
      changeState(num: number) {
        // 1. 直接修改导出来的模块state
        this.current += num
        this.name = 'bar'
        this.arr.push(4)
        
  			// 2.1利用$patch
        // this.$patch({})
        
        // 2.2利用$patch的工厂函数
        // this.$patch(state => {})
      },
    }
  })
  ```

- 引入Store

  ```tsx
  // <p>{{ Test.current }}-{{ Test.name }}</p> 
  import { useTestStore } from './store'
  
  const Test = useTestStore()
  ```

- $reset、$subscribe、$onAction

  ```tsx
  // 重置state的值
  Test.$reset()
  // 任何一个state值有变化都会触发
  Test.$subscribe((args, state) => {
    console.log(args)
    console.log(state)
  }, {
    detached: true, // 跟$onAction第二个参数为true效果一致
    // 跟watchEffect效果保持一致
    deep: true, // 开启深度监听
    flush: 'post', // 需要借助flush post才能正常取到dom
  })
  // 调用任一action就会触发
  Test.$onAction((args) => {
    console.log(args)
  }, true) // 第二个参数为true，当组件销毁可以继续监听
  ```

- 持久化

  ```tsx
  import { createPinia, PiniaPluginContext } from 'pinia'
  
  type Options = {
    key?: string
  }
  
  const __piniaKey__: string = 'xx'
  
  const setStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  const getStorage = (key: string) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
  }
  
  const piniaPlugin = (options: Options) => {
    return (context:PiniaPluginContext) => {
      const { store } = context
      store.$subscribe(() => {
        console.log('change')
        setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state))
      })
    }
  }
  const store = createPinia({
    key: 'pinia',
    
  })
  store.use(piniaPlugin)
  ```

- 参考资料
1. 基于B站[抛弃 Vuex，使用 Pinia](https://www.bilibili.com/video/BV11Y411b7nb?p=1)，打卡点11 HelloWorld.vue，mainStore

2. 基于B站[下一代Vue状态管理工具—Pinia](https://www.bilibili.com/video/BV1eu411f7Gn?p=1)，打卡点15 
   1. HelloWorld.vue，defaultStore
   2. BrandManagement.vue brandStore

3. 基于B站[Vue3 + vite + Ts + pinia + 实战 + 源码](https://www.bilibili.com/video/BV1dS4y1y7vd?p=1)，打卡点69

- [up博客](https://blog.csdn.net/qq1195566313?type=blog) 可以结合他的文章来看会更容易理解

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

  - transition、transition-group

    - 样式效果可以配合 [animate](https://animate.style/) JS动画可以配合 [gsap](https://www.tweenmax.com.cn/index.html)

      - 样式类名参考

      ```css
      move-class="mmm" /** 平移过渡效果，例如loadsh的shuffle打乱数组方法配合flex垂直水平居中布局做一个数字打乱的效果 */
      .mmm {
      	transition: all 1s;
      }
      ```

    - 生命周期

      - beforeEnter 进入之前
      - enter 进入过渡曲线(有done回调)
      - afterEnter 进入完成
      - enterCancelled 进入过渡效果被打断
      - leave 离开过渡曲线(有done回调)
      - afterLeave 离开完成
      - leaveCancelled 离开过渡效果被打断

    - 数字滚动效果

      ```vue
      <template>
      	<input v-model="num.current" step="20" type="number">
      	<div>{{ num.tweenedNumber.toFixed(0) }}</div>
      </template>
      
      <script setup lang="ts">
      import { reactive, watch } from 'vue'
      import gsap from 'gsap'
        
      const num = reactive({
        current: 0,
        tweenedNumber: 0
      })
      
      watch(()=>num.current, (newVal, oldVal)=> {
        gsap.to(num, {
          duration: 1,
          tweenedNumber: newVal
        })
      })
      </script>
      ```

  - tsx

    ```js
    // 安装依赖
    npm install @vitejs/plugin-vue-jsx -D
    
    // vite.config.ts 配置
    import vue from '@vitejs/plugin-vue'
    import vueJsx from '@vitejs/plugin-vue-jsx'
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [vue(), vueJsx()]
    })
    
    // tsconfig.json
    "compilerOptions": {
      "jsx": "preserve",
      "jsxFactory": "h",
      "jsxFragmentFactory": "Fragment",
    }
    
    // JSX语法参照react
    Arr.map(v => {
      return (<div onClick={clickTap.bind(this,v)} data-index={v}>{v}</div>)
    })
    ```

  - vue3自动引入插件 [github地址](https://github.com/antfu/unplugin-auto-import)

    ```js
    unplugin-auto-import/vite
    // 配置完成之后使用ref reactive watch等无须import导入，可以直接使用
    import AutoImport from 'unplugin-auto-import/vite'
    export default defineConfig({
      plugins: [vue(), vueJsx(), AutoImport({
        imports: ['vue'],
        dts: 'src/auto-import.d.ts'
      })]
    })
    
    // tsconfig.json
    "include": ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue']
    ```

  - v-model

    ```typescript
    // 语法糖对比 value->modelValue input->update:modelValue
    v-model.xx="status"
    v-model:title.xx="status"
    
    type Props = {
      modelValue: boolean,
      title: string,
      // 自定义修饰符，注意修饰符前缀要保持一致
      modelModifiers?: {
        xx: boolean
      },
      titleModifiers?: {
        xx: boolean
      }
    }
    const PropsData = defineProps<Props>()
    const emit = defineEmits(['update:modelValue', 'update:title'])
    const close = () => {
      if (PropsData.modelModifiers?.xx) {
        // todo
      } else {
        // todo
      }
      emit('update:modelValue', false)
      emit('update:title', '改变标题')
    }
    ```

  - 自定义指令 Directive、DirectiveBinding

    - created 元素初始化的时候
    - beforeMount 元素初始化的时候
    - mounted 指令绑定到元素后调用 只调用一次
    - beforeUpdate 元素插入父级dom调用
    - update 这个周期方法被移除 改用updated
    - beforeUnmount 在元素被移除前调用
    - unmounted 指令被移除后调用 只调用一次

    ```typescript
    <Comp v-mode:aaa.xx="{ background: 'red' }"></Comp>
    
    import { Directive, DirectiveBinding } from 'vue'
    type Dir = {
      background: string
    }
    const vMove: Directive = {
      created(...args: Array<any>) {
        console.log(args)
      },
      mounted(el: HTMLElement, bingding: DirectiveBinding<Dir>) {
        console.log(bingding.value.background)
      }
    }
    
    // 简写方式
    <input v-model="value" />
    <Comp v-move="{ background:value }"></Comp>
    
    const vMove: Directive = (el: HTMLElement, bingding: DirectiveBinding<Dir>) => {
      el.style.background = bingding.value.background
    }
    ```

  - 全局函数和变量

    ```typescript
    // vue2
    Vue.prototype.$http = () => {}
    // vue3
    const app = createApp({})
    app.config.globalProperties.$http = () => {}
    
    // vue3去除了filters，需要自己手动添加
    app.config.globalProperties.$filters = {
      format <T>(str: T): string {
        return `真${str}`
      }
    }
    // 需要声明
    type Filter = { 
    	format: <T extends any>(str: T) => T
    }
    // 声明要扩充@vue/runtime-core包的声明
    // 这里扩充“ComponentCustomProperties”接口，因为它是vue3中实例的属性的类型
    declare module '@vue/runtime-core' {
      export interface ComponentCustomProperties {
        $filters: Filter
      }
    }
    ```

  - 样式穿透 scoped

    - 主要针对第三方组件样式覆盖问题

    ```scss
    .wrapper {
    	\deep\ .box {
    		color: red;
    	}
      :deep(.box) {
        color: red;
      }
      ::v-deep(.box) {
        color: red;
      }
    }
    ```

  - Router

    - 构建前端项目

      ```bash
      # 有模板
      npm init vue@latest
      # 无模板
      npm init vite@latest 
      ```

    - 全局守卫 beforeEach 、afterEach

      - 自定义loadingBar组件

      ```vue
      <template>
      	<div class="wraps">
          <div ref="bar" class="bar"></div>
        </div>
      </template>
      
      <script setup lang="ts">
      import { ref, onMounted } from 'vue'
      let speed = ref<number>(1)
      let bar = ref<HTMLElement>()
      let timer = ref<number>(0)
      const startloading = () => {
        let dom = bar.value as HTMLElement
        speed.value = 1
        timer.value = window.requestAnimationFrame(function fn() {
          if(speed.value < 90) {
            speed.value += 1
            dom.style.width = speed.value + '%'
            timer.value = window.requestAnimationFrame(fn)
          } else {
            speed.value = 1
            window.clearAnimationFrame(timer.value)
          }
        })
      }
      
      const endLoading(() => {
        let dom = bar.value as HTMLElement
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            speed.value = 100
            dom.style.width = speed.value + '%'
          })
        }, 1000)
      })
        
      defineExpose({
        startloading,
        endLoading
      })
      </script>
      
      <style scoped land="less">
        .wraps {
          position: fixed;
          top: 0;
          width: 100%;
          height: 2px;
          .bar {
            height: inherit;
            width: 0;
            background: blue;
          }
        }
      </style>
      ```

      - Router文件

      ```tsx
      declare module 'vue-router' {
        interface RouteMeta {
          title: string,
          transition: string
        }
      }
      
      const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        // 滚动行为
        scrollBehavior: (to, from, savePosition) => {
          // 后退保留原先滚动行为高度
          if (savePosition) {
            return savePosition
          } else {
            return new Promise(r => {
              setTimeout(() => {
                r({
                  top: 100000
                })
              }, 2000)
            }
          }
        },
        routes: [
          {
            path: '/',
            component: () => import('@/views/Login.vue'),
            meta: {
              title: "登录页面",
              transition: "animate__fadeIn"
            }
          }
        ]
      })
      ```

      - 加载文件效果

      ```tsx
      import loadingBar from './components/loadingBar.vue'
      
      const Vnode = createVNode(loadingBar)
      // 挂载
      render(Vnode, document.body)
      
      router.beforeEach(to, from, next) => {
        document.title = to.meta.title
        Vnode.component?.exposed?.startLoading()
      }
      router.afterEach(to, from, next) => {
        Vnode.component?.exposed?.endLoading()
      }
      ```

      - 动画展示

      ```vue
      <template>
      	<router-view #default="{route, Component}">
          <transition :enter-active-class="`animate__animated ${router.meta.transition}`">
            <component :is="Component"></component>
        </transition>
        </router-view>
      </template>
      
      <script setup lang="ts">
      import 'animate.css'
      </script>
      ```

      - 动态路由

      ```tsx
      const initRouter = async () => {
        // 登录返回可以访问的路由信息
        const result = await axios.get('https://localhost:9999/login', { params: formInline })
        result.data.route.forEach((v: any) => {
          router.addRoute({
            path: v.path,
            name: v.name,
            // 只能使用相对路径，不能使用别名如@
            component: () => import(`../views/${v.component}`)
          })
        })
        router.push('/')
      }
      ```

  - 摸鱼神器

    1. json2ts (快捷键 ctrl+alt+v)
    2. json to ts (快捷键 ctrl+shift+alt+s)

  - 查找文件路径

    ```js
    // 方式1 path __dirname
    const path = require('path');
    const resolve = (dir) => path.join(__dirname, dir); // 路径
    resolve('src/assets/icons')
    
    // 方式2 url fileURLToPath
    import { fileURLToPath, URL } from 'url'
    fileURLToPath(new URL('./src', import.meta.url))
    ```

  - definExpose

    ```TSX
    // 在vue3.x的setup语法糖中定义的变量默认不会暴露出去，这时使用definExpose({ })来暴露组件内部属性给父组件使用
    // 子组件
    <script setup>
        let aaa = ref("aaa")
        defineExpose({ aaa });
    </script>
    // 父组件
    <Chlid ref="child"></Chlid>
    <script setup>
        let child = ref(null)
        child.value.aaa //获取子组件的aaa
    </script>
    // 在父组件中直接修改子组件的属性，子组件也会相应更新
    ```

- PM2

  - 初始化

    ```bash
    # 创建文件夹
    mkdir pm2
    cd pm2
    # 创建文件
    echo >index.js
    echo >index2.js
    # 看目录
    dir
    ls
    # 初始化
    npm init -y
    # 安装依赖
    yarn add express
    ```

  - index.js

    ```js
    const express = require('express')
    
    const app = express()
    
    app.get('/index', (req, res) => {
      res.json({
        code: 200,
        message: 'Hello Wrold！'
      })
    })
    
    app.listener(9999, () => {
      console.log('index.js=====>', 'htpp://localhost:9999/index')
    })
    ```

  - index2.js

    ```js
    const express = require('express')
    
    const app = express()
    
    app.get('/index', (req, res) => {
      res.json({
        code: 200,
        message: 'Hello Express！'
      })
    })
    
    app.listener(8888, () => {
      console.log('index2.js=====>', 'htpp://localhost:8888/index')
    })
    ```

  - 常用命令

    ```bash
    npm install pm2 -g
    pm2 -v
    # 启动命令
    pm2 start index.js
    # 自动监听
    pm2 start index.js --watch
    # 多线程 负载均衡 
    # const os = require('os')
    # os.cpus()
    pm2 start index.js --watch -i max
    # 查看日志
    pm2 log
    pm2 list
    # 停止某个服务 0是list表格中的id
    pm2 stop 0
    # 重启服务
    pm2 restart 0
    # 删除服务
    pm2 delete 0
    
    # npmrc 直接设置代理 
    registry=https://registry.npm.taobao.org
    # 安装临时指定代理
    npm install data_js --registry=https://registry.npm.taobao.org
    # 全局配置
    npm config set registry https://registry.npm.taobao.org
    # 查看刚才的配置是否生效
    npm config list
    ```

    

    
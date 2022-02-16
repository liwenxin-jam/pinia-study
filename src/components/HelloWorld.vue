<template>
  <p>{{ mainStore.count }}</p>
  <p>{{ mainStore.foo }}</p>
  <p>{{ mainStore.arr }}</p>
  <hr />
  <p>{{ count }}</p>
  <p>{{ foo }}</p>
  <!-- getter取值会有缓存，这里取了三次，但打印只有一次 -->
  <p>{{ mainStore.count10 }}</p>
  <p>{{ mainStore.count10 }}</p>
  <p>{{ mainStore.count10 }}</p>
  <p>{{ mainStore.addCount(2) }}</p>
  <p>{{ mainStore.addDefault }}</p>

  <div>
    <button @click="handleChangeState">修改数据</button>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store'

const mainStore = useMainStore()
// 这是有问题的，因为这样拿到的数据不是响应式的，是一次性的
// Pinia 其实就是把 state 数据都做了 reactive 处理了
// const { count, foo } = mainStore

// 解决办法就是使用storeToRefs，把解构建出来的数据做 ref 响应式代理
const { count, foo } = storeToRefs(mainStore)

const handleChangeState = () => {
  // 方式一：最简单的方式就是这样
  // mainStore.count++
  // mainStore.foo = 'hello'

  // 方式二：如果需要修改多个数据，建议使用 $patch 批量更新，有性能优化的效果
  // mainStore.$patch({
  //   count: mainStore.count + 1,
  //   foo: 'hello',
  //   arr: [...mainStore.arr, 4],
  //   // arr: mainStore.arr.push(4), // 无效，会重置变成 [4]
  // })

  // 方式三：更好的批量更新的方式 $patch 一个函数
  // mainStore.$patch(state => {
  //   state.count++
  //   state.foo = 'hello'
  //   state.arr.push(4)
  // })

  // 方式四：逻辑比较多的时候可以封装到 actions 做处理
  mainStore.changeState(10)
}
</script>

<style scoped></style>

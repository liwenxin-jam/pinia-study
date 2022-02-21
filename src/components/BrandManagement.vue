<template>
  <div class="brand">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">添加品牌</h3>
      </div>
    </div>
    
    <div class="panel-body">
      <div class="form-group form-inline">
        <div class="input-group pull-left">
          <div class="input-group-addon">编号</div>
          <input type="text" class="form-control" v-model="brand.id">
        </div>

        <div class="input-group">
          <div class="input-group-addon">品牌名称</div>
          <input type="text" class="form-control" v-model="brand.name">
        </div>

        <div class="input-group">
          <button class="btn btn-primary" @click="addBrand">添加</button>
        </div>

        <div class="input-group pull-right">
          <div class="input-group-addon">按名称搜索</div>
          <input type="text" class="form-control" v-model="keyword">
        </div>
      </div>
    </div>

    <table class="table table-bordered table-hover table-">
      <thead>
        <tr>
          <th>编号</th>
          <th>品牌名称</th>
          <th>添加时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in searchResult" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.ctime }}</td>
          <td>
            <a href="#" @click="delBrand(item.id)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useBrandStore } from "../store/brandStore"

const { brandList, brand, keyword, searchResult } = storeToRefs(useBrandStore())
const { addBrand, delBrand } = useBrandStore()
</script>

<style scoped>
.brand {
  width: 1000px;
  margin: 0 auto;
}
</style>
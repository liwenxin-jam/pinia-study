<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { useBrandStore } from "../store/brandStore"
import { storeToRefs } from "pinia"
const { brandList } = storeToRefs(useBrandStore())
</script>

<style scoped>

</style>
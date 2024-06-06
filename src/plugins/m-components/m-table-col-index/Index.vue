<template>
  <el-table-column type="index" :index="handleColumnIndex" label="#" width="60px" align="center"/>
</template>

<script setup lang="ts">
import { PropType } from "vue"

const {query} = defineProps({
  query: { type: Object as PropType<PageQuery>, default: {pageNum: 1, pageSize: 50} }
})

function handleColumnIndex(index: number) {
  if(!query){
    return index
  }
  return (query.pageNum - 1) * query.pageSize + index + 1
}
</script>

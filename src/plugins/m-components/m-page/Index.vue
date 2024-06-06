<template>
  <div class="m-flex-row m-flex-jc-end m-flex-vc">
    <el-pagination
        @current-change="handleChangePageNum"
        @size-change="handleChangePageSize"
        :total="total"
        :current-page="query?.pageNum"
        :page-size="query?.pageSize"
        :page-sizes="sizes!"
        layout="total, sizes, prev, pager, next, jumper"
        background/>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"

const emits = defineEmits<{
    refresh: []
}>()

const {query, total, sizes} = defineProps({
  query: { type: Object as PropType<PageQuery>, required: true },
  total: { type: Number, default: 0 },
  sizes: { type: Array, default: [10, 50, 100] },
})

function handleChangePageSize(newSize: number) {
  query.pageSize = newSize
  emits('refresh')
}

function handleChangePageNum(newPage: number) {
  query.pageNum = newPage
  emits('refresh')
}
</script>

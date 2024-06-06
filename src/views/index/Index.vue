<template>
  <div class="m-flex-col m-gap20">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>统计</span>
        </div>
      </template>

      <el-space wrap :size="30">

        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="20000"/>
        <mini-card label="演示卡片" value="30000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>
        <mini-card label="演示卡片" value="10000"/>

      </el-space>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>服务器</span>
            </div>
          </template>

          <div class="table">
            <div class="table-tr">
              <div class="table-td">
                <span class="label">服务商</span>
                <span class="value">aliyun</span>
              </div>
              <div class="table-td">
                <span class="label">cpu架构</span>
                <span class="value">intel</span>
              </div>
              <div class="table-td">
                <span class="label">总内存</span>
                <span class="value">13952M</span>
              </div>
            </div>
            <div class="table-tr">
              <div class="table-td">
                <span class="label">服务器</span>
                <span class="value">ECS</span>
              </div>
              <div class="table-td">
                <span class="label">cpu型号</span>
                <span class="value">E5-4560</span>
              </div>
              <div class="table-td">
                <span class="label">可用内存</span>
                <span class="value">11432M</span>
              </div>
            </div>
            <div class="table-tr">
              <div class="table-td">
                <span class="label">操作系统</span>
                <span class="value">Linux</span>
              </div>
              <div class="table-td">
                <span class="label">核心/线程</span>
                <span class="value">8/16</span>
              </div>
              <div class="table-td">
                <span class="label">空闲内存</span>
                <span class="value">6651M</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>数据库</span>
            </div>
          </template>

          <div class="table">
            <div class="table-tr">
              <div class="table-td">
                <span class="label">数据库</span>
                <span class="value">MySql</span>
              </div>
              <div class="table-td">
                <span class="label">表数</span>
                <span class="value">17</span>
              </div>
            </div>
            <div class="table-tr">
              <div class="table-td">
                <span class="label">版本</span>
                <span class="value">5.6.7</span>
              </div>
              <div class="table-td">
                <span class="label">总记录</span>
                <span class="value">157,912,312</span>
              </div>
            </div>
            <div class="table-tr">
              <div class="table-td">
                <span class="label">端口</span>
                <span class="value">3306</span>
              </div>
              <div class="table-td">
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>服务状态</span>
        </div>
      </template>
      <el-table
          :show-header="true"
          v-loading="serviceLoading"
          :data="services"
          highlight-current-row
          row-key="id"
          :header-cell-style="{ background:'#f5f5f5', color:'#666'}"
          border
          height="300">
        <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :minWidth="item.minWidth"
            :align="item.align">
          <template v-slot="{row}" v-if="item.prop === 'status'">
            <el-tag v-if="row.status" type="success">启动</el-tag>
            <el-tag v-else type="danger">停止</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.table {
  margin: 40px auto;
  display: table;
  border-collapse: collapse;
}

.table-tr {
  display: table-row;
  height: 40px;
}

.table-td {
  display: table-cell;
  width: 250px;
  height: 100%;
  border: 1px solid #ccc;
  vertical-align: middle;

  & > .label {
    display: inline-block;
    width: 120px;
    text-align: right;
    padding-right: 20px;

    &::after {
      content: ":";
    }
  }
}
</style>

<script setup lang="ts">
import {reactive, ref} from "vue"
import MiniCard from "./MiniCard.vue"

const serviceLoading = ref(false)

const columns = reactive([
  {prop: 'serviceName', label: '服务', width: '200px', minWidth: '150px', align: 'right'},
  {prop: 'status', label: '状态', width: '', minWidth: '150px', align: 'center'},
  {prop: 'ram', label: 'ram占用', width: '', minWidth: '150px', align: 'center'},
  {prop: 'cpu', label: 'cpu占用', width: '', minWidth: '150px', align: 'center'},
  {prop: 'time', label: '运行时长', width: '', minWidth: '150px', align: 'center'},
  {prop: 'ports', label: '端口号', width: '', minWidth: '150px', align: 'center'},
])

const services = [
  {serviceName: "starter", status: 1, ports: "63100", ram: "347M", cpu: "4%", time: "05:41:15"},
  {serviceName: "socket", status: 1, ports: "63600, 6360", ram: "2753M", cpu: "21%", time: "05:42:46"},
  {serviceName: "websocket", status: 1, ports: "63700, 6370", ram: "926M", cpu: "17%", time: "05:40:19"},
  {serviceName: "processing", status: 1, ports: "63800", ram: "312M", cpu: "1%", time: "05:41:19"},
]

</script>

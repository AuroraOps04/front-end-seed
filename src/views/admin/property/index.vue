<script setup lang="ts">
import { NButton, NGrid, NGi } from 'naive-ui'
import { VxeButtonEvents, VxeTableInstance } from 'vxe-table'
import { onMounted, reactive, ref } from 'vue'

const propertyData = reactive({
  // 表格数据
  tableData: [],
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  }
})
</script>

<template>
  <div class="bg_box">
    <div class="bg_box1">
      <text>子菜单</text>
      <text>地区管理</text>
      <text>分类管理</text>
    </div>

    <div class="bg_box2">
      <text>地区管理</text>
      <n-grid :cols="4" x-gap="24">
        <n-gi span="4">
          <vxe-toolbar>
            <template #buttons>
              <vxe-input placeholder="输入关键词搜索" type="search"></vxe-input>

              <n-button ghost type="info">重置</n-button>

              <n-button type="info">添加</n-button>
              <n-button type="error">删除</n-button>
            </template>
          </vxe-toolbar>
        </n-gi>
      </n-grid>

      <div>
        <n-grid :cols="4" x-gap="24">
          <n-gi span="4">
            <vxe-table
              ref="xTable1"
              size="small"
              align="center"
              :data="propertyData.tableData"
              :export-config="{}"
              :row-config="{ isHover: true }"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-table-column field="userName" title="序号"></vxe-table-column>
              <vxe-table-column field="gender" title="地区名称" width="300"></vxe-table-column>
              <vxe-table-column field="categoryName" title="操作"></vxe-table-column>
            </vxe-table>
          </n-gi>
        </n-grid>
      </div>

      <n-grid :cols="4" x-gap="24">
        <n-gi span="4">
          <vxe-pager
            v-model:current-page="propertyData.tablePage.currentPage"
            v-model:page-size="propertyData.tablePage.pageSize"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              'NextJump',
              'FullJump',
              'Total'
            ]"
            :total="propertyData.tablePage.total"
            background
            @page-change="handleChangePage"
          >
          </vxe-pager>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg_box {
  display: flex;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 20px;

  .bg_box1 {
    float: left;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    height: 580px;
    width: 100px;
    padding: 1%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .bg_box2 {
    float: right;
    height: 580px;
    width: 1080px;
    padding: 1%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
}
</style>

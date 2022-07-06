<script lang="ts" setup>
import { NButton, NGrid, NGi } from 'naive-ui'
import { VxeButtonEvents, VxeTableInstance } from 'vxe-table'

import { onMounted, reactive, ref } from 'vue'
import { findAllCategoryApi, findAreaApi } from '@service/account'
import { listUserByPageApi } from '@service/userList'

// 地区对象
class areaObject {
  areaId: number | undefined

  areaName: string | undefined

  areaCode: string | undefined

  areaDescription: string | undefined

  createdAt: string | undefined

  updatedAt: string | undefined

  createdBy: string | undefined

  deletedAt: number | undefined

  constructor(
    areaId: number,
    areaName: string,
    areaCode: string,
    areaDescription: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    deletedAt: number
  ) {
    this.areaId = areaId
    this.areaName = areaName
    this.areaCode = areaCode
    this.areaDescription = areaDescription
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.createdBy = createdBy
    this.deletedAt = deletedAt
  }
}

// 页面数据
const userData = reactive({
  // 表格数据
  tableData: [],
  // 分页数据
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  // 分类列表
  cateGory: [],
  // 地区列表
  area: [areaObject],
  // 等级列表
  userRating: [
    { ratingId: 1, ratingName: '会员' },
    { ratingId: 2, ratingName: '普通用户' }
  ],
  currentDate: '',
  // 选项绑定
  option: {
    category: '',
    area: '',
    username: '',
    userRating: ''
  }
})

// 查询数据的条件参数
const params = reactive<API.UserQueryParams & API.PageParams>({
  pageSize: userData.tablePage.pageSize,
  page: userData.tablePage.currentPage,
  area: '',
  category: '',
  username: '',
  userRating: ''
})

// 分页查询所有数据
const findUserSelectPage = async () => {
  const res = await listUserByPageApi(params)
  userData.tableData = res.data! as any
  userData.tablePage.total = res.count! as any
}

// 查询所有地区
const findAllArea = async () => {
  const res = await findAreaApi(null)
  userData.area = res.data as never
}

// 查询所有分类
const findAllCategory = async () => {
  const res = await findAllCategoryApi(null)
  userData.cateGory = res.data as any
}

// 地区下拉选项
function changeArea(event: any) {
  params.area = event.value
  findUserSelectPage()
}

// 分类下拉选项
function changeCategory(event: any) {
  params.category = event.value
  findUserSelectPage()
}

// 用户等级下拉选项
function changeUserRating(event: any) {
  params.userRating = event.value
  findUserSelectPage()
}
// 搜索用户名
function changeUserName(event: any) {
  params.username = event.value
  // console.log(event.value)
  findUserSelectPage()
}
// 页码切换
function handleChangePage() {
  params.pageSize = userData.tablePage.pageSize
  params.page = userData.tablePage.currentPage
  findUserSelectPage()
}

// 重置参数
const clickEvent = () => {
  params.area = ''
  params.category = ''
  params.username = ''
  params.userRating = ''
  userData.option.category = ''
  userData.option.area = ''
  userData.option.userRating = ''
  userData.option.username = ''
  findUserSelectPage()
}

const xTable1 = ref<VxeTableInstance>()

const exportSelectEvent: VxeButtonEvents.Click = () => {
  const table = xTable1.value
  table?.exportData({
    data: table.getCheckboxRecords()
  })
}

onMounted(() => {
  findUserSelectPage()
  findAllCategory()
  findAllArea()
})
</script>

<template>
  <div class="bg1">
    <n-grid x-gap="24" :cols="4">
      <n-gi span="4">
        <vxe-toolbar>
          <template v-slot:buttons>
            <div style="margin-left: 10px">
              <vxe-input
                placeholder="输入姓名搜索"
                type="search"
                @blur="changeUserName"
                v-model="userData.option.username"
              ></vxe-input>
            </div>

            <div style="margin-left: 30px">
              <vxe-select
                placeholder="选择用户等级"
                @change="changeUserRating($event)"
                v-model="userData.option.userRating"
              >
                <vxe-option
                  v-for="rating in userData.userRating"
                  :key="rating.ratingId"
                  :value="rating.ratingName"
                  :label="rating.ratingName"
                ></vxe-option>
              </vxe-select>
            </div>

            <div style="margin-left: 30px">
              <vxe-select
                v-model="userData.option.category"
                placeholder="选择关注领域"
                @change="changeCategory($event)"
              >
                <vxe-option
                  v-for="cateGory in userData.cateGory"
                  :key="cateGory.categoryId"
                  :value="cateGory.categoryName"
                  :label="cateGory.categoryName"
                ></vxe-option>
              </vxe-select>
            </div>

            <div style="margin-left: 30px">
              <vxe-select
                v-model="userData.option.area"
                placeholder="选择所在地"
                @change="changeArea($event)"
              >
                <vxe-option
                  v-for="area in userData.area"
                  :key="area.areaId"
                  :value="area.areaName"
                  :label="area.areaName"
                ></vxe-option>
              </vxe-select>
            </div>

            <div style="margin-left: 45px">
              <n-button @click="clickEvent" type="info" ghost>重置</n-button>
            </div>

            <div style="margin-left: 35px">
              <n-button @click="exportSelectEvent" type="info">导出</n-button>
            </div>
          </template>
        </vxe-toolbar>
      </n-gi>
    </n-grid>

    <div style="height: 530px">
      <n-grid x-gap="24" :cols="4">
        <n-gi span="4">
          <vxe-table
            ref="xTable1"
            :export-config="{}"
            :row-config="{ isHover: true }"
            :data="userData.tableData"
          >
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-table-column field="userName" title="姓名"></vxe-table-column>
            <vxe-table-column field="gender" title="性别"></vxe-table-column>
            <vxe-table-column field="categoryName" title="关注领域"></vxe-table-column>
            <vxe-table-column field="areaName" title="所在地"></vxe-table-column>
            <vxe-table-column field="phone" title="手机号"></vxe-table-column>
            <vxe-table-column field="mail" title="邮箱"></vxe-table-column>
            <vxe-table-column field="userRating" title="用户等级"></vxe-table-column>
          </vxe-table>
        </n-gi>
      </n-grid>
    </div>

    <n-grid x-gap="24" :cols="4">
      <n-gi span="4">
        <vxe-pager
          background
          v-model:current-page="userData.tablePage.currentPage"
          v-model:page-size="userData.tablePage.pageSize"
          @page-change="handleChangePage"
          :total="userData.tablePage.total"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'JumpNumber',
            'NextPage',
            'NextJump',
            'FullJump',
            'Total'
          ]"
        >
        </vxe-pager>
      </n-gi>
    </n-grid>
  </div>
</template>

<style scoped>
.bg1 {
  margin: 3%;
  padding: 3%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>

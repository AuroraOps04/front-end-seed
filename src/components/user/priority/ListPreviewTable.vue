<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { VxeColumnPropTypes, VxePagerEvents } from 'vxe-table'
import { listAccountByPageApi } from '@service/account'

type TablePage = {
  total: number
  currentPage: number
  pageSize: number
}

type AccountData = {
  count: number
  data: API.AccountData[]
}

/**
 * 判断参数是否为null或者undefined或者""或者" "；(除去0的情况)
 */
const isNullOrEmpty = (obj: unknown): boolean => {
  let flag = false
  if (obj === null || typeof obj === 'undefined' || obj === '') {
    flag = true
  } else if (typeof obj === 'string') {
    // obj = obj.trim();//IE6和7不支持
    const spaceRe = /^''+$/
    if (spaceRe.test(obj)) {
      // 为空
      flag = true
    } else {
      // 不为空
      const object = obj.toUpperCase()
      if (object === 'NULL' || object === 'UNDEFINED' || object === '{}') {
        flag = true
      }
    }
  } else {
    flag = false
  }
  return flag
}

// 账户信息
const accountData = reactive<AccountData>({
  count: 0,
  data: []
})

// 表格分页
const tablePage = reactive<TablePage>({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  accountIsView: 1
})

// 分页查询所有数据
const findAccountSelectPage = async () => {
  const res = await listAccountByPageApi(params)
  accountData.count = res.count
  tablePage.total = res.count
  accountData.data = res.data as API.AccountData[]
}

// 表格
// tablePage分页
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
  params.page = currentPage
  params.pageSize = pageSize
  findAccountSelectPage()
}

// 地区过滤器
const formatterArea: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return isNullOrEmpty(cellValue) ? '暂未录入地区' : cellValue
}

// 分类过滤器
const formatterCategory: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return isNullOrEmpty(cellValue) ? '暂未录入地区' : cellValue
}

onMounted(() => {
  findAccountSelectPage()
})
</script>
<template>
  <div class="container">
    <vxe-table
      ref="xTable"
      :align="'center'"
      :column-config="{ resizable: true }"
      :data="accountData.data"
      :radio-config="{ highlight: true }"
      :row-config="{ isHover: true }"
      border="inner"
      height="475vw"
      show-overflow
    >
      <vxe-column title="排名" type="seq" width="60"></vxe-column>
      <vxe-column field="accountName" title="账号"></vxe-column>
      <vxe-column field="recordFan" title="粉丝数"></vxe-column>
      <vxe-column :formatter="formatterArea" field="areaName" title="地区"></vxe-column>
      <vxe-column
        :formatter="formatterCategory"
        field="categoryName"
        show-overflow
        title="所属分类"
      ></vxe-column>
      <vxe-column field="recordFan" show-overflow title="潮汐指数(暂用fans)"></vxe-column>
    </vxe-table>

    <vxe-pager
      v-model:current-page="tablePage.currentPage"
      v-model:page-size="tablePage.pageSize"
      :layouts="[
        'PrevJump',
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'NextJump',
        'Sizes',
        'FullJump',
        'Total'
      ]"
      :total="tablePage.total"
      background
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  /*background-color: #0E1222;*/
}
</style>

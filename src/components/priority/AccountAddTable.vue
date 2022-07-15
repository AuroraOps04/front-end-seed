<script lang="ts" setup>
import { reactive, ref, onMounted, toRefs } from 'vue'
import { NButton } from 'naive-ui'

import {
  VxeTableInstance,
  VxeColumnPropTypes,
  VxeTableEvents,
  VxePagerEvents,
  VXETable
} from 'vxe-table'
import {
  findAllCategoryApi,
  findAreaApi,
  listAccountByPageApi,
  updateAccountIsViewApi
} from '@/service/account'

const props = defineProps({
  isUserAdd: {
    type: Number,
    required: false,
    default: 0
  }
})
const isUserAdd = toRefs(props)

type AccountData = {
  count: number
  data: API.AccountData[]
}

type AreaData = {
  data: API.Area[]
}

type CategoryData = {
  data: API.Category[]
}

type TablePage = {
  total: number
  currentPage: number
  pageSize: number
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

// 账号名称
const accountName = ref<string>('')
// 地区
const areaValue = ref<number | null>()
// 分类
const categoryValue = ref<number | null>()
// 定义批量删除的数组
const accountArray: number[] = []
// 获取父组件的modal关闭方法
const emits = defineEmits(['close', 'selectData'])
// 账户信息
const accountData = reactive<AccountData>({
  count: 0,
  data: []
})
// 地区信息
const areaData = reactive<AreaData>({
  data: []
})
// 分类信息
const categoryData = reactive<CategoryData>({
  data: []
})
// 表格分页
const tablePage = reactive<TablePage>({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

const xTable = ref<VxeTableInstance>()

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  area: null,
  category: null,
  accountName: accountName.value,
  accountIsView: 0
})

// 分页查询所有数据
const findAccountSelectPage = async () => {
  if (isUserAdd.isUserAdd.value === 1) {
    params.accountIsView = 1
  }
  const res = await listAccountByPageApi(params)
  accountData.count = res.count
  tablePage.total = res.count
  accountData.data = res.data as API.AccountData[]
}

// 查询地区
const findAllArea = async () => {
  const res = await findAreaApi()
  areaData.data = res.data as API.Area[]
}

// 查询分类
const findAllCategory = async () => {
  const res = await findAllCategoryApi()
  categoryData.data = res.data as API.Category[]
}

// 表格
// tablePage分页
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
  params.page = currentPage
  params.pageSize = pageSize
  findAccountSelectPage()
}

// check全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = ({ checked }) => {
  // 置空数组
  accountArray.length = 0
  const $table = xTable.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    accountArray.push(item.accountId)
  })
}

// check单选
const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  accountArray.length = 0
  const $table = xTable.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    accountArray.push(item.accountId)
  })
}

// 地区过滤器
const formatterArea: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return isNullOrEmpty(cellValue) ? '暂未录入地区' : cellValue
}

// 分类过滤器
const formatterCategory: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return isNullOrEmpty(cellValue) ? '暂未录入地区' : cellValue
}

// 地区下拉选项
const changeArea = (value: number) => {
  params.area = value
  findAccountSelectPage()
}

// 分类下拉选项
const changeCategory = (value: number) => {
  params.category = value
  if (value === -1) {
    params.category = null
  }
  findAccountSelectPage()
}

// 点击查询图标查询账号
const searchName = (value: string) => {
  params.accountName = value
  findAccountSelectPage()
}

// 重置
const resetEvent = () => {
  params.pageSize = 10
  params.page = 1
  params.area = null
  params.category = null
  params.accountName = ''
  accountName.value = ''
  areaValue.value = null
  categoryValue.value = null
  findAccountSelectPage()
}
// 添加
const insertEvent = async () => {
  const res = await updateAccountIsViewApi(accountArray, 1)
  await VXETable.modal.message({ content: '添加成功！', status: 'success' })
  emits('selectData')
  emits('close', false)
}

// 取消
const cancelEvent = () => {
  emits('close', false)
}

onMounted(() => {
  findAccountSelectPage()
  findAllCategory()
  findAllArea()
})
</script>
<template>
  <div class="container">
    <vxe-toolbar>
      <template #buttons>
        <div class="toolbar">
          <div class="search_tool">
            <div>
              <vxe-input
                v-model="accountName"
                placeholder="输入账号名搜索"
                type="search"
                @search-click="searchName(accountName)"
              ></vxe-input>
            </div>
            <div>
              <vxe-select
                v-model="areaValue"
                filterable
                placeholder="选择区域"
                @change="changeArea(areaValue)"
              >
                <vxe-option
                  v-for="area in areaData.data"
                  :key="area.areaId"
                  :label="area.areaName"
                  :value="area.areaId"
                ></vxe-option>
              </vxe-select>
            </div>
            <div>
              <vxe-select
                v-model="categoryValue"
                filterable
                placeholder="全部"
                @change="changeCategory(categoryValue)"
              >
                <vxe-option
                  v-for="cateGory in categoryData.data"
                  :key="cateGory.categoryId"
                  :label="cateGory.categoryName"
                  :value="cateGory.categoryId"
                ></vxe-option>
              </vxe-select>
            </div>
            <div>
              <n-button ghost type="info" @click="resetEvent()"> 重置 </n-button>
            </div>
          </div>
        </div>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="xTable"
      :align="'center'"
      :column-config="{ resizable: true }"
      :data="accountData.data"
      :radio-config="{ highlight: true }"
      :row-config="{ isHover: true }"
      border="inner"
      height="450vw"
      show-overflow
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column field="accountName" title="账号"></vxe-column>
      <vxe-column field="recordFan" sortable title="粉丝数"></vxe-column>
      <vxe-column :formatter="formatterArea" field="areaName" title="地区"></vxe-column>
      <vxe-column
        :formatter="formatterCategory"
        field="categoryName"
        show-overflow
        title="所属分类"
      ></vxe-column>
      <vxe-column field="accountId" show-overflow title="潮汐指数(暂用fans)"></vxe-column>
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
    <div class="add_button">
      <n-button
        round
        secondary
        strong
        style="width: 100px; margin-right: 5%"
        @click="cancelEvent()"
      >
        取消
      </n-button>
      <n-button round type="info" @click="insertEvent()"> 确定添加 </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.toolbar {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  width: calc(100%);
  margin-bottom: 20px;

  .search_tool {
    display: flex;
    width: calc(50%);

    div {
      margin-left: 20px;
    }
  }
}
.add_button {
  text-align: center;
  margin-top: 20px;
}
</style>

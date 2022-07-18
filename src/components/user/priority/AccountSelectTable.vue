<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { TrashOutline, Add } from '@vicons/ionicons5'
import {
  VXETable,
  VxeTableInstance,
  VxeColumnPropTypes,
  VxeFormPropTypes,
  VxeFormItemPropTypes,
  VxeTableEvents,
  VxePagerEvents
} from 'vxe-table'
import {
  findAllCategoryApi,
  findAreaApi,
  listAccountByPageApi,
  updateAccountIsViewApi
} from '@service/account'
import AccountAddTable from '@/components/user/priority/AccountAddTable.vue'

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
// 表单
const formDatas = reactive({
  submitLoading: false,
  tableData: [] as any[],
  selectRow: null,
  showEdit: false,
  formData: {
    name: '',
    nickname: '',
    role: '',
    sex: '',
    age: '',
    num: '',
    checkedList: [],
    flag1: '',
    date3: '',
    address: ''
  },
  sexList: [
    { label: '女', value: '0' },
    { label: '男', value: '1' }
  ],
  formRules: {
    name: [
      { required: true, message: '请输入名称' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
    ],
    nickname: [{ required: true, message: '请输入昵称' }],
    sex: [{ required: true, message: '请选择性别' }]
  } as VxeFormPropTypes.Rules
})
const xTable = ref<VxeTableInstance>()

// 弹窗可选信息
const visibleMethod: VxeFormItemPropTypes.VisibleMethod = ({ data }) => {
  return data.flag1 === 'Y'
}

const editEvent = (row: any) => {
  formDatas.formData = {
    name: row.name,
    nickname: row.nickname,
    role: row.role,
    sex: row.sex,
    age: row.age,
    num: row.num,
    checkedList: row.checkedList,
    flag1: row.flag1,
    date3: row.date3,
    address: row.address
  }
  formDatas.selectRow = row
  formDatas.showEdit = true
}

const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
  editEvent(row)
}

const submitEvent = () => {
  formDatas.submitLoading = true
  setTimeout(() => {
    const $table = xTable.value as any
    formDatas.submitLoading = false
    formDatas.showEdit = false
    if (formDatas.selectRow) {
      VXETable.modal.message({ content: '保存成功', status: 'success' })
      Object.assign(formDatas.selectRow, formDatas.formData)
    } else {
      VXETable.modal.message({ content: '新增成功', status: 'success' })
      $table.insert(formDatas.formData)
    }
  }, 500)
}

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  area: null,
  category: null,
  accountName: accountName.value,
  accountIsView: 1
})

// 分页查询所有数据
const findAccountSelectPage = async () => {
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

// 新增
const insertEvent = () => {
  formDatas.selectRow = null
  formDatas.showEdit = true
}

// 删除
const deleteEvent = async () => {
  if (accountArray.length === 0) {
    await VXETable.modal.message('您未选择数据')
    return
  }
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await updateAccountIsViewApi(accountArray, 0)
    if (res.data) {
      await findAccountSelectPage()
      await VXETable.modal.message({ content: '删除成功！', status: 'success' })
    } else {
      await VXETable.modal.message({ content: '删除失败！', status: 'error' })
    }
    accountArray.splice(0, accountArray.length)
  }
}

// 表格中的删除
const removeEvent = async (row: any) => {
  const accountId = row.accountId as number
  accountArray.push(accountId)
  await deleteEvent()
}

const closeModal = () => {
  formDatas.showEdit = false
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
              <n-button ghost type="info" @click="resetEvent()"> 重置</n-button>
            </div>
          </div>
          <div class="search_button">
            <n-space align="center">
              <n-button color="#70ACFF" round @click="insertEvent()">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                添加
              </n-button>
              <n-button color="#D76C54" round @click="deleteEvent()">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                删除
              </n-button>
            </n-space>
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
      height="400vw"
      show-overflow
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
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
      <vxe-column show-overflow title="操作" width="100">
        <template #default="{ row }">
          <vxe-button icon="vxe-icon--edit-outline" type="text"></vxe-button>
          <vxe-button icon="vxe-icon--close" type="text" @click="removeEvent(row)"></vxe-button>
        </template>
      </vxe-column>
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

    <vxe-modal
      v-model="formDatas.showEdit"
      :loading="formDatas.submitLoading"
      destroy-on-close
      min-height="300"
      min-width="600"
      resize
      title="榜单账号添加"
      width="100%"
    >
      <AccountAddTable @close="closeModal" @selectData="findAccountSelectPage"></AccountAddTable>
    </vxe-modal>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;

  .vxe-modal--box {
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 100vw !important;
      top: 10vw !important;
    }
  }
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
      @media screen and (min-width: 320px) and (max-width: 480px) {
        margin-left: 0 !important;
      }
    }
  }

  .search_button {
    display: flex;
    width: calc(50%);
    justify-content: right;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: auto;
      justify-content: center;
      margin: 2vw 0;
    }

    div {
      margin-right: 20px;
    }
  }
}
</style>

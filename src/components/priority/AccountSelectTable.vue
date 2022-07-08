<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { TrashOutline, Add } from '@vicons/ionicons5'
import {
  VXETable,
  VxeTableInstance,
  VxeColumnPropTypes,
  VxeFormPropTypes,
  VxeFormItemPropTypes,
  VxeTableEvents
} from 'vxe-table'
import {
  findAllCategoryApi,
  findAreaApi,
  listAccountByPageApi,
  removeAccountBatchByIdsApi,
  removeAccountByIdApi
} from '@/service/account'
import accountAddTable from '@/components/priority/AccountAddTable.vue'

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
const areaValue = ref<string>('')
// 分类
const categoryValue = ref<string>('')
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
  area: '',
  category: '',
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
const changeArea = (value: string) => {
  params.area = value
  findAccountSelectPage()
}

// 分类下拉选项
const changeCategory = (value: string) => {
  params.category = value
  if (value === '全部') {
    params.category = ''
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
  params.area = ''
  params.category = ''
  params.platform = ''
  params.accountName = ''
  accountName.value = ''
  areaValue.value = ''
  categoryValue.value = ''
  findAccountSelectPage()
}

// 排序
const sortEvent = () => {}

// 新增
const insertEvent = () => {
  formDatas.formData = {
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
  }
  formDatas.selectRow = null
  formDatas.showEdit = true
}

// 表格中的删除
const removeEvent = async (row: any) => {
  const accountId = row.accountId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAccountByIdApi(accountId)
    if (res.data) {
      await findAccountSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

// 删除
const deleteEvent = async () => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAccountBatchByIdsApi(accountArray)
    if (res.data) {
      await findAccountSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
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
                  :value="area.areaName"
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
                  :value="cateGory.categoryName"
                ></vxe-option>
              </vxe-select>
            </div>
            <div>
              <n-button type="info" @click="resetEvent()" ghost> 重置 </n-button>
            </div>
          </div>
          <div class="search_button">
            <n-space align="center">
              <n-button color="#70ACFF" @click="insertEvent()" round>
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                新增
              </n-button>
              <n-button color="#D76C54" @click="deleteEvent()" round>
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
      border="inner"
      show-overflow
      ref="xTable"
      height="300"
      :align="'center'"
      :column-config="{ resizable: true }"
      :data="accountData.data"
      :radio-config="{ highlight: true }"
      :row-config="{ isHover: true }"
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column field="accountName" title="账号"></vxe-column>
      <vxe-column field="recordFan" title="粉丝数"></vxe-column>
      <vxe-column :formatter="formatterArea" field="areaName" title="地区"></vxe-column>
      <vxe-column
        :formatter="formatterCategory"
        field="categoryName"
        title="所属分类"
        show-overflow
      ></vxe-column>
      <vxe-column field="recordFan" title="潮汐指数(暂用fans)" show-overflow></vxe-column>
      <vxe-column title="操作" width="100" show-overflow>
        <template #default="{ row }">
          <vxe-button
            type="text"
            icon="vxe-icon--edit-outline"
            @click="editEvent(row)"
          ></vxe-button>
          <vxe-button type="text" icon="vxe-icon--close" @click="removeEvent(row)"></vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-pager
      background
      v-model:current-page="tablePage.currentPage"
      v-model:page-size="tablePage.pageSize"
      :total="tablePage.total"
      @page-change="handlePageChange"
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
    >
    </vxe-pager>

    <vxe-modal
      v-model="formDatas.showEdit"
      :loading="formDatas.submitLoading"
      title="榜单账号添加"
      destroy-on-close
      min-height="300"
      min-width="600"
      resize
      width="800"
    >
      <accountAddTable></accountAddTable>
    </vxe-modal>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  /*background-color: #0E1222;*/
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

  .search_button {
    display: flex;
    width: calc(50%);
    justify-content: right;

    div {
      margin-right: 20px;
    }
  }
}
</style>

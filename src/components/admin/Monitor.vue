<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { NButton, NSpace, NIcon, NDropdown } from 'naive-ui'
import { TrashOutline, Add, SwapVertical, ChevronDownOutline } from '@vicons/ionicons5'
import {
  VxeColumnPropTypes,
  VxeFormItemPropTypes,
  VxeFormPropTypes,
  VxePagerEvents,
  VXETable,
  VxeTableEvents,
  VxeTableInstance
} from 'vxe-table'
import {
  findAllCategoryApi,
  findAreaApi,
  listAccountByPageApi,
  removeAccountBatchByIdsApi,
  removeAccountByIdApi
} from '@/service/account'

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

// 定义数据ref
// 账户名称
const accountName = ref<string>('')
// 地区
const areaValue = ref<string>('')
// 分类
const categoryValue = ref<string>('')
// 定义数据ref结束
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

const accountDetail = reactive({
  accountId: null,
  accountName: '',
  areaName: '',
  categoryName: '',
  introduction: '',
  platformName: '',
  recordComment: '',
  recordArticle: 0,
  recordFan: 0,
  recordForward: 0,
  recordLike: 0,
  areaId: null,
  platformId: 0,
  categoryId: 0,
  areaDescription: '',
  platformDescription: '',
  categoryDescription: ''
})
const demo1 = reactive({
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

const visibleMethod: VxeFormItemPropTypes.VisibleMethod = ({ data }) => {
  return data.flag1 === 'Y'
}

const editEvent = (row: any) => {
  demo1.formData = {
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
  demo1.selectRow = row
  demo1.showEdit = true
}

const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
  editEvent(row)
}

const submitEvent = () => {
  demo1.submitLoading = true
  setTimeout(() => {
    const $table = xTable.value as any
    demo1.submitLoading = false
    demo1.showEdit = false
    if (demo1.selectRow) {
      VXETable.modal.message({ content: '保存成功', status: 'success' })
      Object.assign(demo1.selectRow, demo1.formData)
    } else {
      VXETable.modal.message({ content: '新增成功', status: 'success' })
      $table.insert(demo1.formData)
    }
  }, 500)
}

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  area: '',
  category: '',
  platform: '',
  accountName: accountName.value,
  startTime: '',
  endTime: '',
  sortType: 1
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
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
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

const sortOptions = [
  {
    label: '潮汐指数',
    key: 1
  },
  {
    label: '粉丝数',
    key: 2
  },
  {
    label: '新增时间',
    key: 3
  }
]

const handleSortSelect = (key: number) => {
  params.sortType = key
  findAccountSelectPage()
}
// 新增
const insertEvent = () => {
  demo1.formData = {
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
  demo1.selectRow = null
  demo1.showEdit = true
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
  findAllArea()
  findAllCategory()
})
</script>
<template>
  <div class="container">
    <div class="horizontal_line"></div>
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
          </div>
          <div style="padding-left: 7%">
            <n-button color="#70ACFF" @click="resetEvent()"> 重置 </n-button>
          </div>
          <div class="search_button">
            <n-space align="center">
              <n-dropdown
                :options="sortOptions"
                placement="bottom-start"
                trigger="click"
                @select="handleSortSelect"
              >
                <n-button color="#70ACFF">
                  <template #icon>
                    <n-icon>
                      <SwapVertical />
                    </n-icon>
                  </template>
                  排序
                  <n-icon style="height: 1em">
                    <ChevronDownOutline />
                  </n-icon>
                </n-button>
              </n-dropdown>
              <n-button color="#70ACFF" @click="insertEvent()">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                新增
              </n-button>
              <n-button color="#D76C54" @click="deleteEvent()">
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
      :column-config="{ resizable: true }"
      :data="accountData.data"
      :radio-config="{ highlight: true }"
      :row-config="{ isHover: true }"
      border="inner"
      height="470"
      show-overflow
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column align="center" field="accountName" title="账号"></vxe-column>
      <vxe-column align="center" field="recordFan" sortable title="粉丝数"></vxe-column>
      <vxe-column
        :formatter="formatterArea"
        align="center"
        field="areaName"
        title="地区"
      ></vxe-column>
      <vxe-column
        :formatter="formatterCategory"
        align="center"
        field="categoryName"
        title="所属分类"
      ></vxe-column>
      <vxe-column
        align="center"
        field="address"
        show-overflow
        sortable
        title="潮汐指数"
      ></vxe-column>
      <vxe-column show-overflow title="操作" width="100">
        <template #default="{ row }">
          <div style="display: flex; flex-wrap: nowrap; width: 100%">
            <div style="display: flex; width: 40%">
              <vxe-button
                icon="vxe-icon--edit-outline"
                type="text"
                @click="editEvent(row)"
              ></vxe-button>
            </div>
            <div style="display: flex; width: 60%">
              <n-icon style="padding-top: 20px">
                <TrashOutline @click="removeEvent(row)" />
              </n-icon>
            </div>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <!--    table分页-->
    <vxe-pager
      v-model:current-page="tablePage.currentPage"
      v-model:page-size="tablePage.pageSize"
      :border="false"
      :layouts="[
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'Sizes',
        'FullJump',
        'Total'
      ]"
      :total="tablePage.total"
      @page-change="handlePageChange"
    >
    </vxe-pager>

    <vxe-modal
      v-model="demo1.showEdit"
      :loading="demo1.submitLoading"
      :title="demo1.selectRow ? '编辑&保存' : '新增&保存'"
      destroy-on-close
      min-height="300"
      min-width="600"
      resize
      width="800"
    >
      <template #default>
        <vxe-form
          :data="accountDetail"
          :rules="demo1.formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        >
          <vxe-form-item
            :span="24"
            :title-prefix="{ icon: 'fa fa-address-card-o' }"
            :title-width="200"
            title="基础信息"
            title-align="left"
          ></vxe-form-item>
          <vxe-form-item :item-render="{}" :span="0" field="accountId">
            <template #default="{ data }">
              <vxe-input v-model="data.accountId" type="hidden"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="24" field="accountName" title="账号名">
            <template #default="{ data }">
              <vxe-input v-model="data.accountName" placeholder="请输入名称"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="areaName" title="地区">
            <template #default="{ data }">
              <vxe-select v-model="data.sex" transfer>
                <vxe-option
                  v-for="item in demo1.sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="role" title="地区简介">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入角色"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="areaName" title="分类">
            <template #default="{ data }">
              <vxe-select v-model="data.sex" transfer>
                <vxe-option
                  v-for="item in demo1.sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="role" title="分类简介">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入角色"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="areaName" title="平台">
            <template #default="{ data }">
              <vxe-select v-model="data.sex" transfer>
                <vxe-option
                  v-for="item in demo1.sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="role" title="平台简介">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入角色"></vxe-input>
            </template>
          </vxe-form-item>
          <!--          粉丝数，文章数，转发数，评论数，点赞数-->
          <vxe-form-item
            :item-render="{}"
            :span="24"
            :visible-method="visibleMethod"
            field="checkedList"
            title="可选信息"
          >
            <template #default="{ data }">
              <vxe-checkbox-group v-model="data.checkedList">
                <vxe-checkbox content="运动、跑步" label="1"></vxe-checkbox>
                <vxe-checkbox content="听音乐" label="2"></vxe-checkbox>
                <vxe-checkbox content="爬山" label="3"></vxe-checkbox>
                <vxe-checkbox content="吃美食" label="4"></vxe-checkbox>
              </vxe-checkbox-group>
            </template>
          </vxe-form-item>
          <vxe-form-item
            :span="24"
            :title-prefix="{ message: '请填写必填项', icon: 'fa fa-info-circle' }"
            :title-width="200"
            title="其它信息"
            title-align="left"
          ></vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="num" title="Number">
            <template #default="{ data }">
              <vxe-input v-model="data.num" placeholder="请输入数值" type="number"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :item-render="{}" :span="12" field="date3" title="Date">
            <template #default="{ data }">
              <vxe-input
                v-model="data.date3"
                placeholder="请选择日期"
                transfer
                type="date"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            :item-render="{}"
            :span="24"
            :title-suffix="{ message: '提示信息！！', icon: 'fa fa-question-circle' }"
            field="address"
            title="Date"
          >
            <template #default="{ data }">
              <vxe-textarea
                v-model="data.address"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></vxe-textarea>
            </template>
          </vxe-form-item>
          <vxe-form-item :span="24" align="center" title-align="left">
            <template #default>
              <vxe-button type="submit">提交</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 94%;
  padding-left: 3%;
  padding-right: 3%;

  .horizontal_line {
    width: 100%;
    height: 0.1px;
    opacity: 0.1;
    border-top: solid black;
    margin-bottom: 20px;
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
}
.n-icon {
  height: 2em;
}
</style>

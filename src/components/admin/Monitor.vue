<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { NButton, NSpace, NIcon, NDropdown } from 'naive-ui'
import { TrashOutline, Add, SwapVertical, ChevronDownOutline } from '@vicons/ionicons5'
import {
  VxeColumnPropTypes,
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
  removeAccountByIdApi,
  addAccountApi,
  editRowAccountApi,
  findAllPlatFormApi
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

type Platform = {
  data: API.Platform[]
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
const areaValue = ref<number | null>()
// 分类
const categoryValue = ref<number | null>()
// 模态框添加是否显示
const isShow = ref<boolean>(false)
// 定义批量删除的数组
const accountArray: number[] = []
// 账户信息
const loading = ref<boolean>(false)

const accountData = reactive<AccountData>({
  count: 0,
  data: []
})

// 平台
const platformData = reactive<Platform>({
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

// 定义表单模态框
const accountAdd = reactive({
  submitLoading: false,
  formData: {
    areaId: 1,
    categoryId: 1,
    accountCode: '',
    platformId: 1
  },
  formRules: {
    areaId: [
      {
        required: true,
        message: '请输入选择地区'
      }
    ],
    platformId: [
      {
        required: true,
        message: '请选择平台'
      }
    ],
    categoryId: [
      {
        required: true,
        message: '请选择分类'
      }
    ],
    accountCode: [
      {
        required: true,
        message: '请输入链接'
      }
    ]
  } as VxeFormPropTypes.Rules
})

const xTable = ref<VxeTableInstance>()

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  area: null,
  category: null,
  platform: null,
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

// 查询平台
const findPlatform = async () => {
  const res = await findAllPlatFormApi()
  platformData.data = res.data as API.Platform[]
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
  params.platform = null
  params.accountName = ''
  accountName.value = ''
  areaValue.value = null
  categoryValue.value = null
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

// 表格中的删除
const removeEvent = async (row: any) => {
  const accountId = row.accountId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const $table = xTable.value as VxeTableInstance
    const res = await removeAccountByIdApi(accountId)
    await $table.remove(row)
    if (res.data) {
      await VXETable.modal.message({ content: '删除成功！', status: 'success' })
    } else {
      await VXETable.modal.message({ content: '删除失败！', status: 'error' })
    }
  }
}

// 删除
const deleteEvent = async () => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const $table = xTable.value as VxeTableInstance
    const res = await removeAccountBatchByIdsApi(accountArray)
    await $table.remove($table.getCheckboxRecords())
    if (res.data) {
      // await findAccountSelectPage()
      await VXETable.modal.message({ content: '删除成功！', status: 'success' })
    } else {
      await VXETable.modal.message({ content: '删除失败！', status: 'error' })
    }
  }
}

const editRowEvent = (row: any) => {
  const $table = xTable.value as VxeTableInstance
  $table.setEditRow(row)
}
const saveRowEvent = async (row: API.AccountData) => {
  const $table = xTable.value as VxeTableInstance
  $table.clearEdit().then(async () => {
    loading.value = true
    await editRowAccountApi(row)
    await findAccountSelectPage()
    loading.value = false
    await VXETable.modal.message({ content: '保存成功！', status: 'success' })
  })
}
// 提交表单
const submitAccountEvent = async () => {
  accountAdd.submitLoading = true
  await addAccountApi(accountAdd.formData)
  accountAdd.submitLoading = false
  isShow.value = false
  await findAccountSelectPage()
}

// 重置表单
const resetAccountEvent = () => {
  accountAdd.formData.areaId = 1
  accountAdd.formData.categoryId = 1
  accountAdd.formData.accountCode = ''
  accountAdd.formData.platformId = 1
}

// 取消编辑
const cancelRowEvent = (row: any) => {
  const $table = xTable.value as VxeTableInstance
  $table.clearEdit().then(() => {
    // 还原行数据
    $table.revertData(row)
  })
}

onMounted(() => {
  findAccountSelectPage()
  findAllArea()
  findAllCategory()
  findPlatform()
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
          </div>
          <div class="pl7">
            <n-button color="#70ACFF" @click="resetEvent()"> 重置</n-button>
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
              <n-button color="#70ACFF" @click="isShow = true">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                添加
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
      :auto-resize="true"
      :column-config="{ resizable: true }"
      :data="accountData.data"
      :edit-config="{ trigger: 'manual', mode: 'row' }"
      :keep-source="true"
      :loading="loading"
      :radio-config="{ highlight: true }"
      :row-config="{ isHover: true }"
      border="inner"
      height="470"
      show-overflow
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column align="center" field="accountName" title="账号"></vxe-column>
      <vxe-column align="center" field="recordFan" sortable title="粉丝数"></vxe-column>
      <vxe-column
        :edit-render="{}"
        :formatter="formatterArea"
        align="center"
        field="areaName"
        title="地区"
      >
        <template #edit="{ row }">
          <vxe-select v-model="row.areaId" filterable placeholder="选择区域">
            <vxe-option
              v-for="area in areaData.data"
              :key="area.areaId"
              :label="area.areaName"
              :value="area.areaId"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column
        :edit-render="{}"
        :formatter="formatterCategory"
        align="center"
        field="categoryName"
        title="所属分类"
      >
        <template #edit="{ row }">
          <vxe-select v-model="row.categoryId" filterable placeholder="全部">
            <vxe-option
              v-for="cateGory in categoryData.data"
              :key="cateGory.categoryId"
              :label="cateGory.categoryName"
              :value="cateGory.categoryId"
              :visible="cateGory.categoryId !== -1"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column
        align="center"
        field="address"
        show-overflow
        sortable
        title="潮汐指数"
      ></vxe-column>
      <vxe-column show-overflow title="操作" width="150">
        <template #default="{ row }">
          <div v-if="$refs.xTable.isEditByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </div>
          <div v-else style="display: flex; flex-wrap: nowrap; width: 100%">
            <div style="display: flex; width: 25%">
              <vxe-button
                icon="vxe-icon--edit-outline"
                type="text"
                @click="editRowEvent(row)"
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
      v-model="isShow"
      destroy-on-close
      height="400"
      min-height="500"
      min-width="500"
      resize
      title="账号链接添加"
      width="500"
    >
      <template #default>
        <vxe-form
          :data="accountAdd.formData"
          :rules="accountAdd.formRules"
          title-align="right"
          title-width="100"
          @reset="resetAccountEvent"
          @submit="submitAccountEvent"
        >
          <vxe-form-item
            :span="24"
            :title-prefix="{ icon: 'fa fa-address-card-o' }"
            :title-width="200"
            title="添加基本信息"
            title-align="left"
          ></vxe-form-item>
          <vxe-form-item :span="24" field="accountCode" title="账号链接">
            <template #default="{ data }">
              <vxe-input v-model="data.accountCode" placeholder="请输入账号链接"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :span="12" field="areaId" title="地区">
            <template #default="{ data }">
              <vxe-select v-model="data.areaId" filterable placeholder="选择区域">
                <vxe-option
                  v-for="area in areaData.data"
                  :key="area.areaId"
                  :label="area.areaName"
                  :value="area.areaId"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item :span="12" field="categoryId" title="分类">
            <template #default="{ data }">
              <vxe-select v-model="data.categoryId" filterable placeholder="选择分类">
                <vxe-option
                  v-for="cateGory in categoryData.data"
                  :key="cateGory.categoryId"
                  :label="cateGory.categoryName"
                  :value="cateGory.categoryId"
                  :visible="cateGory.categoryId !== -1"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item :span="12" field="platformId" title="平台">
            <template #default="{ data }">
              <vxe-select v-model="data.platformId" filterable placeholder="选择平台">
                <vxe-option
                  v-for="platform in platformData.data"
                  :key="platform.platformId"
                  :label="platform.platformName"
                  :value="platform.platformId"
                ></vxe-option>
              </vxe-select>
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
  .modal-addSearch {
    text-align: center;
  }
  .modal-button {
    text-align: center;
    padding-top: 2%;
  }
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
      @media screen and (min-width: 320px) and (max-width: 480px) {
        flex-direction: column;
      }

      div {
        margin-left: 20px;
      }
    }

    .pl7 {
      padding-left: 7%;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        padding-left: 0;
        margin: 10px 0;
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

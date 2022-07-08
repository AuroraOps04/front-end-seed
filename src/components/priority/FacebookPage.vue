<script setup lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { NDivider } from 'naive-ui'
import {
  VXETable,
  VxeTableInstance,
  VxeColumnPropTypes,
  VxeFormPropTypes,
  VxeFormItemPropTypes,
  VxeTableEvents
} from 'vxe-table'
import { listAccountByPageApi, findAllCategoryApi, findAreaApi } from '@/service/account'

// 所有数据
const priorityData = reactive({
  // 账号
  findAccount: '',
  // 地区
  findArea: '',
  // 分类
  findCategory: [],
  // 分页数据
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  // 分类列表
  cateGory: [],
  // 地区列表
  area: [AreaObject],
  currentDate: '',
  // 地区分类选项绑定
  option: {
    category: '',
    area: ''
  },
  // 表单数据
  formData: {
    id: '',
    account: '',
    fans: '',
    area: '',
    category: '',
    tide: ''
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

// 获取所有分类数据
const findAllCategory = async () => {
  const res = await findAllCategoryApi(null)
  priorityData.findCategory = res.data as any
}

// 获取所有地区数据
const findAllArea = async () => {
  const res = await findAreaApi(null)
  priorityData.findArea = res.data as never
}

// 地区下拉选项
function changeArea(event: any) {
  params.area = event.value
  findAccountSelectPage(accountName.value)
}

// 分类下拉选项
function changeCategory(event: any) {
  params.category = event.value
  if (event.value === '全部') {
    params.category = ''
  }
  findAccountSelectPage(accountName.value)
}

// 下拉过滤TODO
function regionDropDown(searchValue: any, option: any, group: any) {}

// 分页
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
  params.page = currentPage
  params.pageSize = pageSize
  findAccountSelectPage(accountName.value)
}

// 表格数据
const xTable: any = ref<VxeTableInstance>()

function receiveParametersMethods(accountNameProp: string) {
  accountName.value = accountNameProp
  findAccountSelectPage(accountName.value)
}

const formatterSex: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  const item = priorityData.sexList.find((item) => item.value === cellValue)
  return item ? item.label : ''
}

const visibleMethod: VxeFormItemPropTypes.VisibleMethod = ({ data }) => {
  return data.flag1 === 'Y'
}
const insertEvent = () => {
  priorityData.formData = {
    id: '',
    account: '',
    fans: '',
    area: '',
    category: '',
    tide: ''
  }
  priorityData.selectRow = null
  priorityData.showEdit = true
}
const editEvent = (row: any) => {
  priorityData.formData = {
    id: row.id,
    account: row.account,
    fans: row.fans,
    area: row.area,
    category: row.category,
    tide: row.tide
  }
  priorityData.selectRow = row
  priorityData.showEdit = true
}

const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
  editEvent(row)
}
const removeEvent = async (row: any) => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const $table = xTable.value as any
    $table.remove(row)
  }
}

const submitEvent = () => {
  priorityData.submitLoading = true
  setTimeout(() => {
    const $table = xTable.value as any
    priorityData.submitLoading = false
    priorityData.showEdit = false
    if (priorityData.selectRow) {
      VXETable.modal.message({ content: '保存成功', status: 'success' })
      Object.assign(priorityData.selectRow, priorityData.formData)
    } else {
      VXETable.modal.message({ content: '新增成功', status: 'success' })
      $table.insert(priorityData.formData)
    }
  }, 500)
}

const page5 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 300
})

setTimeout(() => {
  const list = [
    {
      id: 10001,
      account: 'Test1',
      fans: 15,
      area: 'Shenzhen',
      category: 'taiWan',
      tide: 88.88
    },
    {
      id: 10002,
      account: 'Test2',
      fans: 24,
      area: 'Shenzhen',
      category: 'taiWan',
      tide: 88.88
    },
    {
      id: 10003,
      account: 'Test3',
      fans: 11,
      area: 'Shenzhen',
      category: 'taiWan',
      tide: 88.88
    },
    {
      id: 10004,
      account: 'Test4',
      fans: 111,
      area: 'Shenzhen',
      category: 'taiWan',
      tide: 88.88
    },
    {
      id: 10005,
      account: 'Test5',
      fans: 98,
      area: 'Shenzhen',
      category: 'taiWan',
      tide: 88.88
    }
  ]
  priorityData.tableData = list
}, 50)

onMounted(() => {
  findAccountSelectPage(accountName.value)
  findAllCategory()
  findAllArea()
})
</script>
<template>
  <div class="container">
    <n-divider />
    <div class="topToolBar">
      <vxe-input
        class="searchComponent"
        v-model="priorityData.findAccount"
        placeholder="输入账号名称搜索"
        prefix-icon="vxe-icon--search"
        clearable
      ></vxe-input>
      <vxe-select class="searchComponent" placeholder="选择区域">
        <vxe-option
          v-for="area in priorityData.findArea"
          :key="area.areaId"
          :value="area.areaName"
          :label="area.areaName"
        ></vxe-option>
      </vxe-select>
      <vxe-select class="searchComponent" placeholder="选择分类">
        <vxe-option
          v-for="category in priorityData.findCategory"
          :key="category.categoryId"
          :value="category.categoryName"
          :label="category.categoryName"
        ></vxe-option>
      </vxe-select>
      <vxe-button class="searchComponent" content="重置"></vxe-button>
      <vxe-toolbar class="topToolBtn">
        <template #buttons>
          <vxe-button icon="vxe-icon--plus" status="primary" round @click="insertEvent()">
            新增</vxe-button
          >
          <vxe-button icon="vxe-icon--minus" status="danger" round @click="deleteEvent()">
            删除</vxe-button
          >
        </template>
      </vxe-toolbar>
    </div>
    <vxe-table
      border
      show-overflow
      ref="xTable"
      height="300"
      :align="'center'"
      :column-config="{ resizable: true }"
      :row-config="{ isHover: true }"
      :data="priorityData.tableData"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-column type="seq" title="排名" width="60"></vxe-column>
      <vxe-column field="account" title="账号"></vxe-column>
      <vxe-column field="fans" title="粉丝数"></vxe-column>
      <vxe-column field="area" title="地区"></vxe-column>
      <vxe-column field="category" title="所属分类" show-overflow></vxe-column>
      <vxe-column field="tide" title="潮汐指数" show-overflow></vxe-column>
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
      v-model:current-page="page5.currentPage"
      v-model:page-size="page5.pageSize"
      :total="page5.totalResult"
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
      v-model="priorityData.showEdit"
      :title="priorityData.selectRow ? '编辑&保存' : '新增&保存'"
      width="800"
      min-width="600"
      min-height="300"
      :loading="priorityData.submitLoading"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="priorityData.formData"
          :rules="priorityData.formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        >
          <vxe-form-item
            title="Basic information"
            title-align="left"
            :title-width="200"
            :span="24"
            :title-prefix="{ icon: 'fa fa-address-card-o' }"
          ></vxe-form-item>
          <vxe-form-item field="name" title="Name" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="nickname" title="Nickname" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="role" title="Role" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.name" placeholder="请输入角色"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="sex" title="Sex" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-select v-model="data.sex" transfer>
                <vxe-option
                  v-for="item in priorityData.sexList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item field="age" title="Age" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.age" type="number" placeholder="请输入年龄"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="flag1" title="是否单身" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-radio-group v-model="data.flag1">
                <vxe-radio label="Y" content="是"></vxe-radio>
                <vxe-radio label="N" content="否"></vxe-radio>
              </vxe-radio-group>
            </template>
          </vxe-form-item>
          <vxe-form-item
            field="checkedList"
            title="可选信息"
            :visible-method="visibleMethod"
            :span="24"
            :item-render="{}"
          >
            <template #default="{ data }">
              <vxe-checkbox-group v-model="data.checkedList">
                <vxe-checkbox label="1" content="运动、跑步"></vxe-checkbox>
                <vxe-checkbox label="2" content="听音乐"></vxe-checkbox>
                <vxe-checkbox label="3" content="爬山"></vxe-checkbox>
                <vxe-checkbox label="4" content="吃美食"></vxe-checkbox>
              </vxe-checkbox-group>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="Other information"
            title-align="left"
            :title-width="200"
            :span="24"
            :title-prefix="{ message: '请填写必填项', icon: 'fa fa-info-circle' }"
          ></vxe-form-item>
          <vxe-form-item field="num" title="Number" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.num" type="number" placeholder="请输入数值"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="date3" title="Date" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input
                v-model="data.date3"
                type="date"
                placeholder="请选择日期"
                transfer
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            field="area"
            title="Date"
            :span="24"
            :item-render="{}"
            :title-suffix="{ message: '提示信息！！', icon: 'fa fa-question-circle' }"
          >
            <template #default="{ data }">
              <vxe-textarea
                v-model="data.area"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></vxe-textarea>
            </template>
          </vxe-form-item>
          <vxe-form-item align="center" title-align="left" :span="24">
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

<style scoped lang="scss">
.container {
  width: 100%;
  /*background-color: #0E1222;*/
}
.topToolBar {
  margin-top: 30px;
  margin-bottom: 25px;
  width: 100%;
  display: flex;
  /*background-color: #8C8D90;*/
}
.searchComponent {
  margin-top: 8px;
  margin-right: 3%;
}
.topToolBtn {
  position: absolute;
  right: 5%;
}
</style>

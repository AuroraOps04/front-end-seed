<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { TrashOutline, Add } from '@vicons/ionicons5'
import {
  AccountCollectionApi,
  cancelCustomCollectionApi,
  customListAffiliateByIdApi,
  findAllCustomListAffiliateApi,
  findAllPlatFormApi
} from '@service/account'
import {
  deleteCustomsApi,
  insertOrUpdateCustomsApi,
  selectAllCustomListApi
} from '@service/customList'
import {
  VxeColumnPropTypes,
  VxeFormEvents,
  VxeFormPropTypes,
  VXETable,
  VxeTableEvents,
  VxeTableInstance
} from 'vxe-table'
import underLine from '@/assets/underLine.png'
import AccountAddTable from '@/components/user/priority/AccountAddTable.vue'
// 平台
type Platform = {
  count: number
  data: API.Platform[]
}
// 榜单表格
type CustomList = {
  count: number
  data: API.CustomList[]
}
// 分页
type CustomTablePage = {
  total: number
  currentPage: number
  pageSize: number
}
// 获取当前登录用户Id
const userId = Number(localStorage.getItem('userId'))
// 榜单名称
const customListName = ref<string>('')
// 控制榜单添加修改模态框显隐
const customModalIsView = ref<boolean>(false)
// 控制榜单添加修改模态框中类型下拉框的显隐
const addOrEdit = ref<boolean>(true)
// 平台分类
const platformId = ref<number | null>()
// 榜单删除ids
const customListIds: number[] = []
// 自定义榜单表格对象
const customListTable = ref({} as any)
// 用于控制我的榜单页面主页面与子页面显隐
const customGoToChild = ref<boolean>(false)
// 榜单信息，用于表格
const customData = reactive<CustomList>({
  count: 0,
  data: []
})
const cTable = ref<any>()
const cusLoading = ref<boolean>(false)
// 定义批量删除的数组
const accountArray: number[] = []

type CustomAffiliateDetail = {
  accountId: number
  accountName: string
  accountFan: number
  areaName: string
  categoryName: string
  accountIsView: number
  isCollection: number | null
  customListAffiliateId: number
}

type CustomAffiliateDetailData = {
  data: CustomAffiliateDetail[]
}

const showEditModal = ref<boolean>(false)
// const submitLoading = ref<boolean>(false)

// 添加榜单账号弹框
const userAdd = ref<number>(1)
// 添加
const addListAccount = () => {
  showEditModal.value = true
}
const closeModal = () => {
  showEditModal.value = false
}
// 表格分页
const customTablePage = reactive<CustomTablePage>({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
// 平台信息，用于下拉框展示信息
const platformData = reactive<Platform>({
  count: 0,
  data: []
})
// 查询数据的条件参数
const selectCustomParams = reactive<API.CustomListFormData & API.PageParams>({
  pageSize: customTablePage.pageSize,
  page: customTablePage.currentPage,
  customListName: customListName.value,
  platformId: platformId.value as unknown as number,
  userId
})
// 查询所有platform平台
const findAllPlatform = async () => {
  const res = await findAllPlatFormApi()
  platformData.data = res.data as API.Platform[]
}

// 分页查询所有榜单数据
const selectAllCustomList = async () => {
  const res = await selectAllCustomListApi(selectCustomParams)
  console.log(res)
  customData.count = res.count
  customTablePage.total = res.count
  const tempData: any = res.data
  customData.data = tempData?.data as API.CustomList[]
}
// 按榜单名称搜索点击事件
const searchByCustomListName = (searchValue: string) => {
  selectCustomParams.customListName = searchValue
  selectAllCustomList()
}
// 按榜单类型搜索点击事件（下拉框）
const searchByPlatform = (searchValue: number) => {
  selectCustomParams.platformId = searchValue
  selectAllCustomList()
}

// 重置
const resetCustomListEvent = () => {
  customListName.value = ''
  platformId.value = null
  selectCustomParams.customListName = ''
  selectCustomParams.platformId = null
  selectCustomParams.page = 1
  selectCustomParams.pageSize = 10
  selectAllCustomList()
}
// 子界面后端参数
const customParams = reactive<API.customListAffiliateParams>({
  customListId: 1,
  userId,
  userName: '',
  platformId: null,
  accountIsView: 1
})
// 添加修改modal表单
const customModalData = reactive({
  loading: false,
  formData: {
    customListId: '',
    customListName: '',
    customListDescribe: '',
    userId,
    platformId: ''
  },
  formRules: {
    customListName: [
      { required: true, message: '请输入榜单名称' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符' }
    ],
    customListDescribe: [
      { required: true, message: '请输入榜单描述' },
      { min: 3, max: 100, message: '长度在 3 到 100 个字符' }
    ],
    platformId: [{ required: true, message: '请选择榜单类型' }]
  } as VxeFormPropTypes.Rules
})
// 添加榜单账号弹框结束
// 子界面数据
const customAffiliateData = reactive<CustomAffiliateDetailData>({
  data: []
})

// 查询子界面所有数据
const findAllCustomListAffiliate = async () => {
  cusLoading.value = true
  const res = await findAllCustomListAffiliateApi(customParams)
  customAffiliateData.data = res.data as CustomAffiliateDetail[]
  cusLoading.value = false
}

// 根据账号名称查询子界面数据
const searchCustomAffiliateData = async () => {
  await findAllCustomListAffiliate()
}

// 删除子界面数据
const deleteCustom = async (row: any) => {
  const customListAffiliateId = row.customListAffiliateId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const $table = cTable.value[0] as VxeTableInstance
    cusLoading.value = true
    const res = await customListAffiliateByIdApi(customListAffiliateId)
    if (res.data) {
      await $table.remove(row)
      await VXETable.modal.message({ content: '删除成功！', status: 'success' })
      cusLoading.value = false
    } else {
      await VXETable.modal.message({ content: '删除失败！', status: 'error' })
      cusLoading.value = false
    }
  }
}

// 取消收藏
const cancelCustomCollection = async (row: any) => {
  cusLoading.value = true
  const res = await cancelCustomCollectionApi(userId, row.accountId)
  if (res.data) {
    await VXETable.modal.message({ content: '取消收藏！', status: 'success' })
    await findAllCustomListAffiliate()
    cusLoading.value = false
  } else {
    await VXETable.modal.message({ content: '取消失败！', status: 'error' })
    cusLoading.value = false
  }
}
// 添加收藏
const addCustomCollection = async (row: any) => {
  cusLoading.value = true
  const res = await AccountCollectionApi(row.accountId, userId)
  if (res.data) {
    await VXETable.modal.message({ content: '收藏成功！', status: 'success' })
    await findAllCustomListAffiliate()
    cusLoading.value = false
  } else {
    await VXETable.modal.message({ content: '收藏失败！', status: 'error' })
    cusLoading.value = false
  }
}
// 日期过滤器
const formatterTime: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
// check全选
const selectCustomListAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
  // 置空数组
  customListIds.length = 0
  const $table = customListTable.value[0] as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    customListIds.push(item.customListId)
  })
}

// check单选
const selectCustomListChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  customListIds.length = 0
  const $table = customListTable.value[0] as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    customListIds.push(item.customListId)
  })
}

// 删除
const deleteCustomListEvent = async () => {
  if (customListIds.length === 0) {
    await VXETable.modal.message('您未选择数据')
    return
  }
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await deleteCustomsApi(customListIds)
    if (res.data) {
      await selectAllCustomList()
      await VXETable.modal.message({ content: '删除成功！', status: 'success' })
    } else {
      await VXETable.modal.message({ content: '删除失败！', status: 'error' })
    }
    accountArray.splice(0, customListIds.length)
  }
}

// 表格中的删除
const removeCustomListEvent = async (row: any) => {
  const customListId = row.customListId as number
  customListIds.push(customListId)
  await deleteCustomListEvent()
}

// 打开添加用户自定义榜单模态框
const openAddCustomListEvent = () => {
  customModalData.formData.customListId = ''
  customModalData.formData.customListName = ''
  customModalData.formData.customListDescribe = ''
  customModalData.formData.platformId = ''
  addOrEdit.value = true
  customModalIsView.value = true
}
// 打开编辑用户自定义榜单信息
const editCustomListEvent = (row: any) => {
  console.log(row.customListId)
  customModalData.formData.customListId = row.customListId
  customModalData.formData.customListName = row.customListName
  customModalData.formData.customListDescribe = row.customListDescribe
  customModalData.formData.platformId = row.platformId
  addOrEdit.value = false
  customModalIsView.value = true
}

// modal中的表单提交
const submitCustomListEvent: VxeFormEvents.Submit = async () => {
  customModalData.loading = true
  const res = await insertOrUpdateCustomsApi(customModalData.formData)
  if (res) {
    await selectAllCustomList()
    customModalData.loading = false
    customModalIsView.value = false
    await VXETable.modal.message({ content: '保存成功', status: 'success' })
  }
}

const cancelModalEvent = () => {
  customModalIsView.value = false
}

// 跳转子页面
const goToCustomChildPage = (row: any) => {
  customParams.customListId = row.customListId
  findAllCustomListAffiliate()
  customGoToChild.value = true
}
// --------------榜单部分 结束--------------
onMounted(() => {
  findAllCustomListAffiliate()
  findAllPlatform()
  selectAllCustomList()
})
</script>

<template>
  <div class="content-ranking">
    <!--      -------------zjystart------------          -->
    <div v-if="!customGoToChild">
      <!-- ---------------------榜单列表开始--------------------- -->
      <div class="leaderboard_title">
        <h3 class="leaderboard_txt">榜单列表</h3>
        <img :src="underLine" alt="下划线" class="leaderboard_title_png" />
      </div>
      <div class="toolbar">
        <div class="search_tool">
          <div style="margin: 0 40px 0 3vw">
            <vxe-input
              v-model="customListName"
              placeholder="输入榜单名称搜索"
              type="search"
              @search-click="searchByCustomListName(customListName)"
            ></vxe-input>
          </div>
          <div>
            <vxe-select
              v-model="platformId"
              filterable
              placeholder="请选择榜单类型"
              @change="searchByPlatform(platformId)"
            >
              <vxe-option
                v-for="platform in platformData.data"
                :key="platform.platformId"
                :label="platform.platformName"
                :value="platform.platformId"
              ></vxe-option>
            </vxe-select>
          </div>
          <div style="margin-left: 40px">
            <n-button ghost type="info" @click="resetCustomListEvent()"> 重置</n-button>
          </div>
        </div>
        <div class="search_button">
          <n-space align="center">
            <n-button color="#70ACFF" round @click="openAddCustomListEvent()">
              <template #icon>
                <n-icon>
                  <Add />
                </n-icon>
              </template>
              添加
            </n-button>
            <n-button
              color="#D76C54"
              round
              style="margin: 0 40px 0 20px"
              @click="deleteCustomListEvent()"
            >
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
      <div class="table_style">
        <vxe-table
          ref="customListTable"
          :align="'center'"
          :column-config="{ resizable: true }"
          :data="customData.data"
          :radio-config="{ highlight: true }"
          :row-config="{ isHover: true }"
          border="inner"
          height="400vw"
          show-overflow
          @checkbox-all="selectCustomListAllChangeEvent"
          @checkbox-change="selectCustomListChangeEvent"
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column field="customListName" title="榜单名称"></vxe-column>
          <vxe-column field="platformName" title="榜单类型"></vxe-column>
          <vxe-column field="sumAccount" title="账号数"></vxe-column>
          <vxe-column field="customListDescribe" show-overflow title="榜单描述"></vxe-column>
          <vxe-column
            :formatter="formatterTime"
            field="createdAt"
            show-overflow
            title="新增时间"
          ></vxe-column>
          <vxe-column show-overflow title="操作" width="180">
            <template #default="{ row }">
              <vxe-button
                icon="vxe-icon--eye"
                type="text"
                @click="goToCustomChildPage(row)"
              ></vxe-button>
              <vxe-button
                icon="vxe-icon--edit-outline"
                type="text"
                @click="editCustomListEvent(row)"
              ></vxe-button>
              <vxe-button
                icon="vxe-icon--close"
                type="text"
                @click="removeCustomListEvent(row)"
              ></vxe-button>
              <vxe-button
                icon="vxe-icon--circle-plus"
                type="text"
                @click="showEditModal = true"
              ></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-modal
        v-model="customModalIsView"
        destroy-on-close
        height="500px"
        min-height="300"
        min-width="600"
        resize
        title="新增榜单"
      >
        <vxe-form
          :data="customModalData.formData"
          :loading="customModalData.loading"
          :rules="customModalData.formRules"
          title-colon
          @submit="submitCustomListEvent"
        >
          <vxe-form-gather>
            <vxe-form-item
              v-if="addOrEdit"
              :item-render="{}"
              field="platformId"
              title="榜单类型"
              title-overflow
            >
              <template #default="{ data }">
                <vxe-select v-model="data.platformId" filterable placeholder="请选择榜单类型">
                  <vxe-option
                    v-for="platform in platformData.data"
                    :key="platform.platformId"
                    :label="platform.platformName"
                    :value="platform.platformId"
                  ></vxe-option>
                </vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item :item-render="{}" field="customListName" title="榜单名称">
              <template #default="{ data }">
                <vxe-input
                  v-model="data.customListName"
                  clearable
                  placeholder="请输入榜单名称"
                ></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item :item-render="{}" field="customListDescribe" title="榜单描述">
              <template #default="{ data }">
                <vxe-textarea
                  v-model="data.customListDescribe"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  clearable
                  placeholder="请输入榜单描述"
                ></vxe-textarea>
              </template>
            </vxe-form-item>
          </vxe-form-gather>
          <vxe-form-item align="center">
            <vxe-button content="取消" type="button" @click="cancelModalEvent()"></vxe-button>
            <vxe-button content="保存" status="primary" type="submit"></vxe-button>
          </vxe-form-item>
        </vxe-form>
      </vxe-modal>
      <!-- <img :src="rankingBgPng" alt="排行榜" /> -->
      <!-- ---------------------榜单列表结束--------------------- -->
    </div>

    <!--      -------------zjyend------------          -->
    <!--     ------------------ygx----------------         -->
    <!--              我的榜单子界面-->
    <div v-if="customGoToChild" class="custom-list-sub-interface">
      <!--                工具栏-->
      <div class="search-tool">
        <vxe-toolbar>
          <template #buttons>
            <vxe-input
              v-model="customParams.userName"
              placeholder="输入账号名搜索"
              type="search"
              @search-click="searchCustomAffiliateData()"
            ></vxe-input>
          </template>
          <template #tools>
            <vxe-button status="primary" @click="addListAccount">添加</vxe-button>
          </template>
        </vxe-toolbar>
      </div>
      <!--                工具栏结束-->
      <vxe-table
        ref="cTable"
        :auto-resize="true"
        :column-config="{ resizable: true }"
        :data="customAffiliateData.data"
        :keep-source="true"
        :loading="cusLoading"
        :row-config="{ isHover: true }"
        border="inner"
        height="470"
        show-overflow
      >
        <vxe-column title="排名" type="seq" width="60"></vxe-column>
        <vxe-column align="center" field="accountName" title="账号"></vxe-column>
        <vxe-column align="center" field="accountFan" title="粉丝数"></vxe-column>
        <vxe-column align="center" field="areaName" title="地区"></vxe-column>
        <vxe-column align="center" field="categoryName" title="所属分类"></vxe-column>
        <vxe-column align="center" title="潮汐指数" type="seq"></vxe-column>
        <vxe-column align="center" show-overflow title="操作" width="100">
          <template #default="{ row }">
            <vxe-button
              v-if="row.isCollection === 0"
              class="iconfont icon-shoucang1"
              type="text"
              @click="cancelCustomCollection(row)"
            ></vxe-button>
            <vxe-button
              v-else
              class="iconfont icon-shoucang_o"
              type="text"
              @click="addCustomCollection(row)"
            ></vxe-button>
            <vxe-button
              class="iconfont icon-shanchu"
              type="text"
              @click="deleteCustom(row)"
            ></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!--              <img :src="rankingBgPng" alt="排行榜" />-->
    <!--              子榜单的添加按钮弹框,引入AccountAddTable界面-->
    <!--              :loading="submitLoading"-->
    <div>
      <vxe-modal
        v-model="showEditModal"
        destroy-on-close
        min-height="300"
        min-width="600"
        resize
        title="榜单账号添加"
        width="100%"
      >
        <AccountAddTable
          :isUserAdd="userAdd"
          @close="closeModal"
          @findAllCustomListAffiliate="findAllCustomListAffiliate"
        ></AccountAddTable>
        <!--                  @close="closeModal"-->
        <!--                  @selectData="findAccountSelectPage"-->
      </vxe-modal>
    </div>
    <!--              子榜单的添加按钮弹框结束,引入AccountAddTable界面-->
    <!--            我的榜单子界面结束-->
    <!--          我的榜单结束-->
    <!--     ------------------ygx----------------         -->
  </div>
</template>

<style lang="scss" scoped>
.content-ranking {
  overflow: hidden;
  height: 100vh;

  .leaderboard_title {
    padding-left: 3vw;
    width: 150px;

    .leaderboard_txt {
      font-size: 20px;
      position: absolute;
      margin: 6px 0 0 15px;
    }

    .leaderboard_title_png {
      margin: 3vh 0 1vh 0;
      height: 2.5vh;
    }
  }

  .toolbar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    width: calc(100%);
    margin: 20px 0 20px 0;

    .search_tool {
      display: flex;
      width: calc(50%);
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
    }
  }

  .custom-list-sub-interface {
    width: 90%;
  }
}
.table_style {
  padding: 0 50px 0 3vw;
}
</style>

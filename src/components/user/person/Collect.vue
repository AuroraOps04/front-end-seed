<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import {
  AccountCollectionApi,
  accountCollectionListApi,
  cancelCollectionsApi,
  findAllCategoryApi,
  findAreaApi
} from '@service/account'
import { VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NTabs, NTabPane, NIcon, NButton, NAvatar } from 'naive-ui'
import { StarOutline } from '@vicons/ionicons5'

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
const router = useRouter()
const store = useStore()
const xTable = ref({} as any)
// 地区信息
const areaData = reactive<AreaData>({
  data: []
})
// 分类信息
const categoryDataS = reactive<CategoryData>({
  data: []
})
// 定义批量删除的数组
const accountArray: number[] = []
const accountName = ref<string>('')
// 地区
const areaValue = ref<number | null>()
// 分类
const categoryValue = ref<number | null>()
const loading = ref<boolean>(true)
// 获取当前登录用户Id
const userId = Number(localStorage.getItem('userId'))
// 查询数据的条件参数
const params = reactive<API.collectionParams>({
  area: null,
  category: null,
  accountName: '',
  userId
})
// 账户信息
const accountData = reactive<AccountData>({
  count: 0,
  data: []
})
// 查询用户账号收藏列表
const selectUserCollectionList = async () => {
  loading.value = true
  const res = await accountCollectionListApi(params)
  accountData.data = res.data as API.AccountData[]
  loading.value = false
}
// 取消收藏
const unCollection = async (row: any) => {
  const type = await VXETable.modal.confirm('您是否要取消收藏?')
  if (type === 'confirm') {
    loading.value = true
    await AccountCollectionApi(row.accountId, userId)
    await selectUserCollectionList()
    loading.value = false
    await VXETable.modal.message({ content: '取消成功！', status: 'success' })
  }
}
// 地区下拉选项
const changeArea = (value: number) => {
  loading.value = true
  params.area = value
  selectUserCollectionList()
  loading.value = false
}
// 分类下拉选项
const changeCategory = (value: number) => {
  loading.value = true
  params.category = value
  if (value === -1) {
    params.category = null
  }
  selectUserCollectionList()
  loading.value = false
}
// 点击查询图标查询账号
const searchName = (value: string) => {
  loading.value = true
  params.accountName = value
  selectUserCollectionList()
  loading.value = false
}
// 重置
const resetCollection = async () => {
  loading.value = true
  params.area = null
  params.category = null
  params.accountName = ''
  accountName.value = ''
  areaValue.value = null
  categoryValue.value = null
  await selectUserCollectionList()
  loading.value = false
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

// 批量取消收藏
const cancelCollections = async () => {
  if (accountArray.length === 0) {
    await VXETable.modal.message({ content: '请勾选数据！', status: 'error' })
    return
  }
  loading.value = true
  await cancelCollectionsApi(accountArray, userId)
  await selectUserCollectionList()
  loading.value = false
  await VXETable.modal.message({ content: '取消成功！', status: 'success' })
  accountArray.length = 0
}
// 点击前往账号详情页
const goToAccountPage = async (row: any) => {
  await router.push({
    path: `/Account/${row.accountId}`
  })
}
// 查询地区
const findAllArea = async () => {
  const res = await findAreaApi()
  areaData.data = res.data as API.Area[]
}

// 查询分类
const findAllCategory = async () => {
  const res = await findAllCategoryApi()
  categoryDataS.data = res.data as API.Category[]
}
onMounted(() => {
  selectUserCollectionList()
  findAllArea()
  findAllCategory()
})
</script>

<template>
  <div class="content-collect">
    <div>
      <n-tabs animated type="line">
        <n-tab-pane name="Facebook" tab="Facebook">
          <div class="search-tool">
            <vxe-toolbar>
              <template #buttons>
                <vxe-input
                  v-model="accountName"
                  placeholder="输入账号名搜索"
                  type="search"
                  @search-click="searchName(accountName)"
                ></vxe-input>
                <div style="padding-left: 20px">
                  <vxe-select
                    v-model="areaValue"
                    filterable
                    placeholder="选择区域"
                    @change="changeArea(areaValue, $event)"
                  >
                    <vxe-option
                      v-for="area in areaData.data"
                      :key="area.areaId"
                      :label="area.areaName"
                      :value="area.areaId"
                    ></vxe-option>
                  </vxe-select>
                </div>
                <div style="padding-left: 20px">
                  <vxe-select
                    v-model="categoryValue"
                    filterable
                    placeholder="全部"
                    @change="changeCategory(categoryValue)"
                  >
                    <vxe-option
                      v-for="cateGory in categoryDataS.data"
                      :key="cateGory.categoryId"
                      :label="cateGory.categoryName"
                      :value="cateGory.categoryId"
                    ></vxe-option>
                  </vxe-select>
                </div>
              </template>
              <template #tools>
                <vxe-button @click="resetCollection">重置</vxe-button>
                <vxe-button status="primary" @click="cancelCollections">取消收藏</vxe-button>
              </template>
            </vxe-toolbar>
          </div>
          <vxe-table
            ref="xTable"
            :auto-resize="true"
            :column-config="{ resizable: true }"
            :data="accountData.data"
            :keep-source="true"
            :loading="loading"
            :radio-config="{ highlight: true }"
            :row-config="{ isHover: true }"
            border="inner"
            show-header-overflow
            show-overflow
            @checkbox-all="selectAllChangeEvent"
            @checkbox-change="selectChangeEvent"
          >
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column align="center" title="账号">
              <template #default="{ row }">
                <div
                  style="display: flex; flex-wrap: nowrap; width: 100%"
                  @click="goToAccountPage(row)"
                >
                  <div style="width: 50%; display: flex; justify-content: left; padding-left: 20%">
                    <n-avatar round size="small">{{ row.accountPictureUrl }}</n-avatar>
                  </div>
                  <div style="width: 50%; display: flex">
                    <span>{{ row.accountName }}</span>
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column align="center" field="areaName" title="地区"></vxe-column>
            <vxe-column align="center" field="categoryName" title="类别"></vxe-column>
            <vxe-column
              :visible="false"
              align="center"
              field="platformName"
              title="平台"
            ></vxe-column>
            <vxe-column align="center" field="recordFan" title="备注"></vxe-column>
            <vxe-column align="center" show-overflow title="操作" width="60">
              <template #default="{ row }">
                <NButton class="button_collection" ghost type="warning" @click="unCollection(row)">
                  <template #icon>
                    <NIcon>
                      <StarOutline />
                    </NIcon>
                  </template>
                </NButton>
              </template>
            </vxe-column>
          </vxe-table>
        </n-tab-pane>
        <n-tab-pane name="YouTube" tab="YouTube"> 正在制作</n-tab-pane>
        <n-tab-pane name="Twitter" tab="Twitter"> 正在制作</n-tab-pane>
        <n-tab-pane name="instagrams" tab="instagrams"> 正在制作</n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-collect {
  padding: 0.5vw 4vw 0 4vw;

  .search-tool {
    margin-bottom: 20px;
  }
}
</style>

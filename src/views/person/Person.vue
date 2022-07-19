<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Add, BarChartOutline, PersonOutline, StarOutline, TrashOutline } from '@vicons/ionicons5'
import { useStore } from 'vuex'

import {
  FormInst,
  GlobalThemeOverrides,
  NAvatar,
  NButton,
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NConfigProvider,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NModal,
  NPopselect,
  NRadio,
  NRadioGroup,
  NSpace,
  NTabPane,
  NTabs,
  NUpload,
  UploadFileInfo,
  useMessage
} from 'naive-ui'
import Cookies from 'js-cookie'
import { getCategoryAllApi, getCurrentApi, updateUserInfoApi } from '@service/user'
import { updatePhoneApi } from '@service/person'
import {
  VxeColumnPropTypes,
  VxeFormEvents,
  VxeFormPropTypes,
  VXETable,
  VxeTableEvents,
  VxeTableInstance
} from 'vxe-table'

import {
  customListAffiliateByIdApi,
  findAllCustomListAffiliateApi
} from '@service/customListAffiliate'
import personLogoPng from '@/assets/person_logo.png'
import personIcon2Png from '@/assets/person_icon2.png'
import personIcon3Png from '@/assets/person_icon3.png'
import personGradePng from '@/assets/person_grade.png'
import phonePng from '@/assets/phone.png'
import memberPng from '@/assets/member.png'
import Header from '@/components/Header.vue'
import underLine from '@/assets/underLine.png'

import {
  AccountCollectionApi,
  accountCollectionListApi,
  cancelCollectionsApi,
  cancelCustomCollectionApi,
  findAllCategoryApi,
  findAllPlatFormApi,
  findAreaApi
} from '@/service/account'
import {
  deleteCustomsApi,
  insertOrUpdateCustomsApi,
  selectAllCustomListApi
} from '@/service/customList'

import AccountAddTable from '@/components/priority/AccountAddTable.vue'

type AccountData = {
  count: number
  data: API.AccountData[]
}
const router = useRouter()
const message = useMessage()
const store = useStore()
const username = ref<string>('')
const phone = ref<string>('')
// 定义批量删除的数组
const accountArray: number[] = []
const menuArr = reactive([
  {
    name: '账号管理',
    code: 'person',
    isSelect: true
  },
  {
    name: '我的榜单',
    code: 'Leaderboard',
    isSelect: false
  },
  {
    name: '收藏账号',
    code: 'collect',
    isSelect: false
  }
])
// 账户信息
const accountData = reactive<AccountData>({
  count: 0,
  data: []
})
// 获取当前登录用户Id
const userId = Number(localStorage.getItem('userId'))

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1684FC'
  },
  Button: {
    textColor: '#1684FC'
  }
}

type AreaData = {
  data: API.Area[]
}

type CategoryData = {
  data: API.Category[]
}

// 我的榜单子界面
const cTable = ref<any>()
const cusLoading = ref<boolean>(false)

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
// 添加榜单账号弹框结束
// 子界面数据
const customAffiliateData = reactive<CustomAffiliateDetailData>({
  data: []
})

// 子界面后端参数
const customParams = reactive<API.customListAffiliateParams>({
  customListId: 1,
  userId,
  userName: '',
  platformId: null,
  accountIsView: 1
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

// 我的榜单子界面结束

// 地区信息
const areaData = reactive<AreaData>({
  data: []
})

// 分类信息
const categoryDataS = reactive<CategoryData>({
  data: []
})

const categoryData = reactive<CategoryData>({
  data: []
})

// 查询数据的条件参数
const params = reactive<API.collectionParams>({
  area: null,
  category: null,
  accountName: '',
  userId
})
// 地区
const areaValue = ref<number | null>()
// 分类
const categoryValue = ref<number | null>()

const loading = ref<boolean>(true)

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

const handleClick = (e: string) => {
  menuArr.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.isSelect = item.code === e
  })
}
const showModal = ref(false)
const validatePhone = (): boolean => {
  if (phone.value === '') {
    message.error('请输入手机号')
    return false
  }
  if (!phone.value.match(/^1[3-9]\d{9}$/)) {
    message.error('手机号码格式不正确')
    return false
  }
  return true
}

const handleUpdatePhone = async () => {
  // 校验手机号码
  if (!validatePhone()) {
    return
  }

  try {
    await updatePhoneApi(phone.value)
    message.success('修改成功')
    showModal.value = false
    router.go(0)
  } catch (e) {
    console.log(e)
  }
}

const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (data.file.file?.type !== 'image/png') {
    message.error('只能上传png格式的图片文件，请重新上传')
    return false
  }
  return true
}
const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if (event?.isTrusted) {
    router.go(0)
  }
  // message.success((event?.target as XMLHttpRequest).response)
  // const ext = file.name.split('.')[1]
  // file.name = `更名.${ext}`
  // file.url = '__HTTPS__://www.mocky.io/v2/5e4bafc63100007100d8b70f'
  return file
}

const handleShowModal = (e: boolean) => {
  showModal.value = e
  phone.value = ''
}
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
// 点击前往账号详情页
const goToAccountPage = async (row: any) => {
  await router.push({
    path: `/Account/${row.accountId}`
  })
}
const size = ref('medium')
const formRef = ref<FormInst | null>(null)
const model = reactive<API.UserInfoRequest>({
  id: -1, // 编号
  username: '', // 名称
  gender: '', // 性别
  mail: '', // 邮箱
  address: null, // 所在地
  phone: '', // 手机号
  focusCategory: '' // 关注领域
})
const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = model.mail.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称'
  },
  gender: {
    required: true,
    trigger: 'change',
    message: '请选择性别'
  },
  focusCategory: {
    type: 'array',
    required: true,
    trigger: 'change',
    message: '请选择关注领域'
  },
  mail: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入邮箱'
  }
}
const cityOptions = [
  {
    value: '福建',
    label: '福建',
    children: [
      {
        value: '福建福州',
        label: '福州'
      },
      {
        value: '福建厦门',
        label: '厦门'
      },
      {
        value: '福建莆田',
        label: '莆田'
      },
      {
        value: '福建泉州',
        label: '泉州'
      },
      {
        value: '福建漳州',
        label: '漳州'
      },
      {
        value: '福建龙岩',
        label: '龙岩'
      },
      {
        value: '福建三明',
        label: '三明'
      },
      {
        value: '福建南平',
        label: '南平'
      },
      {
        value: '福建宁德',
        label: '宁德'
      }
    ]
  }
]
const getCategory = async () => {
  const category = await getCategoryAllApi()
  categoryData.data = category.data as API.Category[]
}
const getUserInfo = async () => {
  const res = await getCurrentApi()
  const tempUserInfo: any = res.data
  console.log(tempUserInfo)
  if (res.success) {
    const split = tempUserInfo.focusCategory.split(',')
    const category: Array<number> = []
    split.forEach((item: string) => {
      category.push(Number(item))
    })
    model.focusCategory = category
    model.id = tempUserInfo.id
    model.username = tempUserInfo.username
    model.gender = tempUserInfo.gender
    model.mail = tempUserInfo.mail
    model.phone = tempUserInfo.phone
    model.address = tempUserInfo.address
  }
}
const handleSave = async (e: MouseEvent) => {
  e.preventDefault()
  // formRef.value?.validate(async (errors) => {
  //   if (!errors) {
  // message.success('验证成功')
  model.focusCategory = model.focusCategory.join(',')
  const res = await updateUserInfoApi(model)
  console.log(res)
  if (res.success) {
    await store.dispatch('fetchCurrentUser')
    message.success('修改成功')
    router.go(0)
  }
  // } else {
  //   console.log(errors)
  //   message.error('验证失败')
  // }
  // })
}
const handleClose = async () => {
  await getUserInfo()
}
const handleLogout = () => {
  Cookies.remove('token')
  store.commit('SET_USER', undefined)
  router.push('/home')
}

const accountName = ref<string>('')
// 点击查询图标查询账号
const searchName = (value: string) => {
  loading.value = true
  params.accountName = value
  selectUserCollectionList()
  loading.value = false
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
const xTable = ref({} as any)
// check全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
  // 置空数组
  accountArray.length = 0
  const $table = xTable.value[0] as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    accountArray.push(item.accountId)
  })
}

// check单选
const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  accountArray.length = 0
  const $table = xTable.value[0] as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    accountArray.push(item.accountId)
  })
}

// 批量取消收藏
const cancelCollections = async () => {
  loading.value = true
  await cancelCollectionsApi(accountArray, userId)
  await selectUserCollectionList()
  loading.value = false
  await VXETable.modal.message({ content: '取消成功！', status: 'success' })
}

// --------------榜单部分 开始--------------
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
// 平台信息，用于下拉框展示信息
const platformData = reactive<Platform>({
  count: 0,
  data: []
})
// 榜单信息，用于表格
const customData = reactive<CustomList>({
  count: 0,
  data: []
})
// 表格分页
const customTablePage = reactive<CustomTablePage>({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
// 查询数据的条件参数
const selectCustomParams = reactive<API.CustomListFormData & API.PageParams>({
  pageSize: customTablePage.pageSize,
  page: customTablePage.currentPage,
  customListName: customListName.value,
  platformId: platformId.value,
  userId
})

// 查询所有platform平台
const findAllPlatform = async () => {
  const res = await findAllPlatFormApi()
  platformData.data = res.data as API.Platform[]
}
type customObjectData = {
  count: number
  total: number
  data: API.CustomList[]
}

// 分页查询所有榜单数据
const selectAllCustomList = async () => {
  const res = await selectAllCustomListApi(selectCustomParams)
  const data = res.data as customObjectData
  customData.count = data.count
  customTablePage.total = data.count
  customData.data = data.data as API.CustomList[]
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
  selectUserCollectionList()
  findAllArea()
  findAllCategory()
  getCategory()
  getUserInfo()
  findAllCustomListAffiliate()
  findAllPlatform()
  selectAllCustomList()
})
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides">
      <Header />
      <div class="person-top">
        <!-- logo -->
        <div class="person-top-menu-logo">
          <img :src="personLogoPng" alt="logo" />
          <span></span>
          <div class="logo-title">
            <span>潮汐</span>
            <span style="color: black">指数</span>
          </div>
        </div>
      </div>

      <div class="person-main">
        <div class="main">
          <div class="main-menu">
            <div class="menu-avatar">
              <NAvatar :size="50" :src="store.getters?.currentPictureUrl" round></NAvatar>
            </div>
            <span class="menu-username">{{ store.getters.currentUsername }}</span>
            <span class="menu-ipaddress">IP所属地：{{ store.getters.currentIpAddress }}</span>
            <div class="menu-identification">
              <img :src="personGradePng" alt="用户等级" />
              <div class="identification-grade">普通用户</div>
            </div>
            <hr style="background: rgba(140, 140, 140, 0.02)" />
            <div class="menu-list">
              <div v-for="(item, index) in menuArr" :key="index" class="list-content">
                <NIcon
                  v-if="item.code === 'person'"
                  :color="item.isSelect ? '#F78B32' : 'black'"
                  :component="PersonOutline"
                  size="25"
                  @click="handleClick(item.code)"
                />
                <NIcon
                  v-else-if="item.code === 'Leaderboard'"
                  :color="item.isSelect ? '#F78B32' : 'black'"
                  :component="BarChartOutline"
                  size="25"
                  @click="handleClick(item.code)"
                />
                <NIcon
                  v-else-if="item.code === 'collect'"
                  :color="item.isSelect ? '#F78B32' : 'black'"
                  :component="StarOutline"
                  size="25"
                  @click="handleClick(item.code)"
                />
                <span
                  :style="{ color: item.isSelect ? '#F78B32' : 'black' }"
                  @click="handleClick(item.code)"
                  >{{ item.name }}</span
                >
              </div>
            </div>
          </div>

          <div class="main-content">
            <template v-for="(item, index) in menuArr" :key="index">
              <div v-if="item.isSelect" class="content-header">
                <span>{{ '/' + item.name }}</span>
              </div>
              <hr v-if="item.isSelect" style="background-color: rgb(239, 239, 239)" />

              <div v-if="item.code === 'person' && item.isSelect" class="content-person">
                <div class="person-title">
                  <span class="title-span">账号管理</span>
                  <div class="title-bg"></div>
                </div>
                <!--手机号-->
                <div class="person-list">
                  <div class="list-title">
                    <!--                    <NIcon size="40" :component="PhonePortraitOutline" color="black" :depth="3" />-->
                    <img :src="phonePng" alt="手机" />
                    <span>绑定手机号</span>
                  </div>
                  <div class="list-info">
                    {{ store.getters.currentPhone }}
                  </div>
                  <div class="list-controller">
                    <span @click="handleShowModal(true)">更换号码</span>
                  </div>
                  <NModal
                    v-model:show="showModal"
                    :mask-closable="false"
                    preset="dialog"
                    title="Dialog"
                  >
                    <template #header>
                      <div>更换号码</div>
                    </template>
                    <div>
                      <NInput v-model:value="phone" placeholder="请输入新的电话号码"></NInput>
                    </div>
                    <template #action>
                      <NButton type="primary" @click="handleUpdatePhone">确认</NButton>
                      <NButton @click="handleShowModal(false)">取消</NButton>
                    </template>
                  </NModal>
                </div>

                <div class="person-list">
                  <div class="list-title">
                    <!--                    <NIcon size="40" :component="PhonePortraitOutline" color="black" :depth="3" />-->
                    <img :src="memberPng" alt="等级" />
                    <span>用户等级</span>
                  </div>
                  <div class="list-info">
                    <div class="info-identification">
                      <img :src="personGradePng" alt="用户等级" />
                      <div class="identification-grade">普通用户</div>
                    </div>
                  </div>
                  <div class="list-controller">
                    <span>前去充值</span>
                  </div>
                  <NModal
                    v-model:show="showModal"
                    :mask-closable="false"
                    preset="dialog"
                    title="Dialog"
                  >
                    <template #header>
                      <div>更换号码</div>
                    </template>
                    <div>
                      <NInput v-model:value="phone" placeholder="请输入新的电话号码"></NInput>
                    </div>
                    <template #action>
                      <NButton type="primary" @click="handleUpdatePhone">确认</NButton>
                      <NButton @click="handleShowModal(false)">取消</NButton>
                    </template>
                  </NModal>
                </div>

                <div class="person-title" style="margin-top: 50px">
                  <span class="title-span">我的资料</span>
                  <div class="title-bg"></div>
                </div>

                <n-form
                  ref="formRef"
                  :model="model"
                  :rules="rules"
                  :size="size"
                  :style="{
                    maxWidth: '350px'
                  }"
                  label-placement="left"
                  label-width="auto"
                  require-mark-placement="right-hanging"
                >
                  <n-form-item label="头像" path="username">
                    <div class="person-list" style="justify-content: flex-start">
                      <div class="list-info">
                        <n-avatar
                          :size="48"
                          :src="store.getters?.currentPictureUrl"
                          round
                        ></n-avatar>
                      </div>
                      <span style="width: 100px"></span>
                      <div class="list-controller">
                        <NPopselect trigger="click">
                          <span>更换头像</span>
                          <template #empty>
                            <NUpload
                              action="https://test1.auni.top/api/user/updatePictrue"
                              @finish="handleFinish"
                              @before-upload="beforeUpload"
                            >
                              <NButton>上传图片</NButton>
                            </NUpload>
                          </template>
                        </NPopselect>
                      </div>
                    </div>
                  </n-form-item>

                  <n-form-item label="名称" path="username">
                    <n-input v-model:value="model.username" placeholder="请输入名称" />
                  </n-form-item>

                  <n-form-item label="性别" path="gender">
                    <n-radio-group v-model:value="model.gender" name="gender">
                      <n-space>
                        <n-radio value="男"> 男</n-radio>
                        <n-radio value="女"> 女</n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>

                  <n-form-item label="所在地" path="address">
                    <n-cascader
                      v-model:value="model.address"
                      :options="cityOptions"
                      check-strategy="child"
                      placeholder="请选择所在地"
                      size="medium"
                    />
                  </n-form-item>

                  <n-form-item label="关注领域" path="focusCategory">
                    <n-checkbox-group v-model:value="model.focusCategory">
                      <n-space>
                        <n-checkbox
                          v-for="(item, index) in categoryData.data"
                          :key="index"
                          :value="item.categoryId"
                        >
                          {{ item.categoryName }}
                        </n-checkbox>
                      </n-space>
                    </n-checkbox-group>
                  </n-form-item>

                  <n-form-item label="邮箱" path="mail">
                    <n-input
                      v-model:value="model.mail"
                      :options="autoCompleteOptions"
                      placeholder="请输入邮箱"
                    />
                  </n-form-item>
                </n-form>

                <div>
                  <button class="pbtn-save" @click="handleSave">保存</button>
                  <button class="pbtn-close" @click="handleClose">取消</button>
                </div>

                <div>
                  <button class="pbtn-logout" @click="handleLogout">退出登录</button>
                </div>
              </div>

              <!--              我的榜单-->
              <div v-else-if="item.code === 'Leaderboard' && item.isSelect" class="content-ranking">
                <!--      -------------zjystart------------          -->
                <div v-if="!customGoToChild">
                  <!-- ---------------------榜单列表开始--------------------- -->
                  <div class="leaderboard_title">
                    <h3 class="leaderboard_txt">榜单列表</h3>
                    <img :src="underLine" alt="logo" class="leaderboard_title_png" />
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
                      <vxe-column
                        field="customListDescribe"
                        show-overflow
                        title="榜单描述"
                      ></vxe-column>
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
                            <vxe-select
                              v-model="data.platformId"
                              filterable
                              placeholder="请选择榜单类型"
                            >
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
                        <vxe-form-item
                          :item-render="{}"
                          field="customListDescribe"
                          title="榜单描述"
                        >
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
                        <vxe-button
                          content="取消"
                          type="button"
                          @click="cancelModalEvent()"
                        ></vxe-button>
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

              <!--            我的收藏-->
              <div v-else-if="item.code === 'collect' && item.isSelect" class="content-collect">
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
                            <vxe-button status="primary" @click="cancelCollections"
                              >取消收藏</vxe-button
                            >
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
                              <div
                                style="
                                  width: 50%;
                                  display: flex;
                                  justify-content: left;
                                  padding-left: 20%;
                                "
                              >
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
                            <NButton
                              class="button_collection"
                              ghost
                              type="warning"
                              @click="unCollection(row)"
                            >
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
          </div>
        </div>
        <!--        <img :src="personIconPng" alt="背景图标" class="maiNIcon1" />-->
        <img :src="personIcon2Png" alt="背景图标" class="maiNIcon2" />
        <img :src="personIcon3Png" alt="背景图标" class="maiNIcon3" />
      </div>
    </n-config-provider>
  </div>
</template>

<style lang="scss" scoped>
.person-top {
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  margin: 0 100px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 20vw;
    margin: 0 5vw;
  }

  .person-top-menu-logo {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    span {
      width: 20px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 5vw;
      }
    }

    img {
      width: 100px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 15vw;
      }
    }

    .logo-title span {
      color: #f78b32;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 1vw;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 6vw;
      }
    }
  }
}

.person-main {
  position: relative;
  height: 1000px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: auto;
  }

  .main {
    margin: 0 100px;
    height: 100%;
    border-radius: 20px;
    box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
    background-color: white;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 0 1vw;
    }

    .main-menu {
      height: 100%;
      width: 20%;
      border-radius: 20px;
      box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
      background: linear-gradient(to bottom, rgba(107, 122, 249, 0.15), white);
      display: flex;
      flex-direction: column;
      justify-content: start;

      .menu-avatar {
        margin: 25px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 5vw 0;
        }
      }

      .menu-username {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
      }

      .menu-ipaddress {
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 2px;
        color: rgba(187, 187, 187, 100);
      }

      .menu-identification {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 25px 0;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          flex-direction: column;
          margin: 2vw 0;
        }

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin-right: 0;
          }
        }

        .identification-grade {
          width: 100px;
          height: 30px;
          text-align: left;
          padding-left: 15px;
          line-height: 30px;
          border-radius: 15px;
          //background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
          background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
          font-size: 16px;
          color: white;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            height: 6vw;
            line-height: 6vw;
            width: auto;
            font-size: 3vw;
            border-radius: 2vw;
            padding: 0 1vw;
            margin: 2vw 0;
          }
        }
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        margin: 30px 0;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 10vw 0;
        }

        .list-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            flex-direction: column;
          }

          span {
            margin: 0 10px;
            font-size: 16px;
            letter-spacing: 2px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 0;
              font-size: 3vw;
            }
          }
        }

        .list-content:hover {
          opacity: 0.7;
        }
      }
    }

    .main-content {
      width: 100%;

      .content-header {
        color: #bdc7df;
        font-size: 20px;
        text-align: left;
        height: 60px;
        line-height: 60px;
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          height: 10vw;
          line-height: 10vw;
        }
      }

      .content-person {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 50px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 2vw;
        }

        .pbtn-save {
          border: none;
          width: 150px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(112, 172, 255, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          margin: 10px 5px;
        }

        .pbtn-close {
          border: none;
          width: 150px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(187, 187, 187, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          margin: 10px 5px;
        }

        .pbtn-logout {
          border: none;
          width: 310px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(221, 53, 53, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
        }

        .pbtn-save:hover,
        .pbtn-close:hover,
        .pbtn-logout:hover {
          opacity: 0.7;
        }

        .person-title {
          position: relative;
          text-align: left;
          margin-bottom: 50px;

          .title-span {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
          }

          .title-bg {
            position: absolute;
            top: 20px;
            left: -5px;
            height: 20px;
            border-radius: 10px;
            width: 100px;
            background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
          }
        }

        .person-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin: 5vw 0;
          }

          .list-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin: 20px 0;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 1vw 0;
            }

            img {
              width: 30px;
              height: 30px;
            }

            span {
              font-size: 16px;
              color: #757575;
              margin: 0 20px;
              @media screen and (min-width: 320px) and (max-width: 480px) {
                font-size: 4vw;
                margin: 0;
              }
            }
          }

          .list-info {
            font-size: 16px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }

            .info-identification {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              margin: 25px 0;

              @media screen and (min-width: 320px) and (max-width: 480px) {
                flex-direction: column;
                margin: 2vw 0;
              }

              img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
                @media screen and (min-width: 320px) and (max-width: 480px) {
                  margin-right: 0;
                }
              }

              .identification-grade {
                width: 100px;
                height: 30px;
                text-align: left;
                padding-left: 15px;
                line-height: 30px;
                border-radius: 15px;
                //background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
                background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
                font-size: 16px;
                color: white;
                @media screen and (min-width: 320px) and (max-width: 480px) {
                  height: 6vw;
                  line-height: 6vw;
                  width: auto;
                  font-size: 3vw;
                  border-radius: 2vw;
                  padding: 0 1vw;
                  margin: 2vw 0;
                }
              }
            }
          }

          .list-controller {
            font-size: 16px;
            color: #f78b32;
            border-bottom: 1px solid #f78b32;
            cursor: pointer;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }

          .list-controller:hover {
            opacity: 0.7;
          }
        }
      }

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
    }
  }

  .maiNIcon1 {
    width: 60%;
    position: absolute;
    top: -50px;
    right: 60px;
    z-index: -1;
  }

  .maiNIcon2 {
    width: 20%;
    position: absolute;
    bottom: -50px;
    left: 0;
    z-index: -1;
  }

  .maiNIcon3 {
    width: 40%;
    position: absolute;
    top: 200px;
    left: 0;
    z-index: -1;
  }
}

.home-top {
  width: 100%;
  height: 626px;
  background-image: url('@/assets/home_bg.png');
  background-size: 100% 626px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .home-top-menu {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .home-top-menu-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-left: 100px;
      cursor: pointer;

      .home-title {
        width: 108px;
        height: 40px;
        line-height: 40px;
        color: #f78b32ff;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        text-align: left;
      }
    }

    .home-top-menu-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      width: 750px;

      div {
        cursor: pointer;
        color: white;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 5vw;
        }
      }

      div:hover {
        opacity: 0.7;
        border-bottom: 5px solid #f2882b;
      }

      .menu-hover {
        border-bottom: 5px solid #f2882b;
      }
    }

    .home-top-menu-avatar {
      margin-right: 100px;
      cursor: pointer;
    }
  }

  .home-top-main {
    width: 100%;
    height: 526px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;

    .main-content {
      width: 750px;

      .title1 {
        text-align: center;
        font-size: 38px;
        line-height: 100px;
      }

      .title2 {
        text-align: center;
        font-size: 18px;
        line-height: 40px;
      }
    }
  }
}

.home-main {
  display: flex;
  flex-direction: column;
  height: 1650px;

  .main-detail1 {
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: url('@/assets/home_bg2.png') no-repeat;
    background-size: 100% 272px;
    margin-top: 108px;

    .detail-box {
      width: 600px;
      height: 300px;
      line-height: 20px;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      text-align: center;
      box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      margin: 0 100px 0 100px;

      img {
        width: 80px;
        height: 80px;
      }

      .box-title1 {
        text-align: center;
        color: rgba(17, 54, 145, 100);
        font-size: 26px;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        margin: 0 100px;
      }
    }
  }

  .main-detail2 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
  }

  .main-detail3 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    .detail3-title {
      color: rgba(187, 187, 187, 100);
      font-size: 18px;
    }

    img {
      width: 22px;
      height: 22px;
    }
  }

  .main-detail4 {
    margin: 100px;
    height: 300px;
    line-height: 20px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .detail4-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      img {
        width: 74px;
        height: 74px;
      }

      span {
        color: rgba(187, 187, 187, 100);
        font-size: 22px;
        line-height: 50px;
      }
    }
  }

  .main-detail5 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
  }

  .main-detail6 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 100px;

    .detail6-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 250px;

      img {
        width: 100px;
        height: 100px;
      }

      .box-title1 {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        border-bottom: 5px solid #f78b32;
        text-align: center;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 12px;
        text-align: center;
        line-height: 20px;
      }
    }
  }

  .detail-title {
    line-height: 20px;
    color: rgba(15, 19, 31, 84);
    font-size: 35px;
    text-align: center;
  }

  .row-line {
    height: 5px;
    background-color: #7488bf;
    width: 50px;
    margin: 0 20px;
  }
}

.home-bottom {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  height: 200px;
  background-color: rgba(15, 19, 31, 100);
  color: rgba(16, 16, 16, 100);
  padding-top: 20px;

  .bottom-left {
    width: 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      color: rgba(255, 255, 255, 100);
      font-size: 50px;
      cursor: pointer;
    }

    span:hover {
      opacity: 0.7;
    }
  }

  .bottom-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    span {
      color: rgba(255, 255, 255, 84);
      font-size: 30px;
      cursor: pointer;
    }

    span:hover {
      opacity: 0.7;
    }
  }
}

.content-collect {
  padding: 0.5vw 4vw 0 4vw;

  .search-tool {
    margin-bottom: 20px;
  }
}

.v-x-scroll {
  @media screen and (min-width: 320px) and (max-width: 480px) {
    width: 100vh;
  }
}

.n-tabs .n-tabs-tab .n-tabs-tab__label {
  color: #1c294f;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.6;
}

.table_style {
  padding: 0 50px 0 3vw;
}
</style>

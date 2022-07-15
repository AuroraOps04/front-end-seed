<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  PersonOutline,
  StarOutline,
  BarChartOutline,
  PersonCircleOutline,
  IdCardSharp,
  PhonePortraitOutline
} from '@vicons/ionicons5'
import {
  FormInst,
  NAvatar,
  NIcon,
  NPopselect,
  NButton,
  NInput,
  NUpload,
  NModal,
  FormItemRule,
  NCountdown,
  NForm,
  NSpace,
  NFormItem,
  NSelect,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NCascader,
  CascaderOption,
  useMessage,
  NTabs,
  NTabPane,
  UploadFileInfo,
  NConfigProvider,
  GlobalThemeOverrides
} from 'naive-ui'
import { VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import Cookies from 'js-cookie'
import { getCategoryAllApi, registerApi, getCurrentApi, updateUserInfoApi } from '@service/user'
import { updatePhoneApi, updateUsernameApi } from '@service/person'

import personLogoPng from '@/assets/person_logo.png'
import personIconPng from '@/assets/person_icon.png'
import personIcon2Png from '@/assets/person_icon2.png'
import personIcon3Png from '@/assets/person_icon3.png'
import personGradePng from '@/assets/person_grade.png'
import rankingBgPng from '@/assets/ranking_bg.png'
import phonePng from '@/assets/phone.png'
import memberPng from '@/assets/member.png'
import Header from '@/components/Header.vue'
import {
  accountCollectionListApi,
  AccountCollectionApi,
  findAreaApi,
  findAllCategoryApi,
  cancelCollectionsApi,
  findAllCustomListAffiliateApi,
  customListAffiliateByIdApi,
  cancelCustomCollectionApi
} from '@/service/account'

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
const userId = store.getters.currentId
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
  userId: store.getters.currentId,
  customListId: 1,
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
const categoryData = reactive<CategoryData>({
  data: []
})

// 查询数据的条件参数
const params = reactive<API.collectionParams>({
  area: null,
  category: null,
  accountName: '',
  userId: store.getters.currentId
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
  categoryData.data = res.data as API.Category[]
}

const handleClick = (e: string) => {
  menuArr.forEach((item) => {
    item.isSelect = item.code === e
  })
}
const showModal = ref(false)
const showModalUsername = ref(false)
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
const validateUsername = (): boolean => {
  if (username.value === '') {
    message.error('请输入新的昵称')
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
    const res = await updatePhoneApi(phone.value)
    console.log(res)
    message.success('修改成功')
    showModal.value = false
    router.go(0)
  } catch (e) {
    console.log(e)
  }
}
const handleUpdateUsername = async () => {
  // 校验昵称输入
  if (!validateUsername()) {
    return
  }

  try {
    const res = await updateUsernameApi(username.value)
    message.success('修改成功')
    showModalUsername.value = false
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
const handleShowModalUsername = (e: boolean) => {
  showModalUsername.value = e
  username.value = ''
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
  getUserInfo()
}
const handleLogout = () => {
  Cookies.remove('token')
  store.commit('SET_USER', undefined)
  router.push('/home')
}

const accountName = ref<string>()
// 点击查询图标查询账号
const searchName = (value: string) => {
  loading.value = true
  params.accountName = value
  selectUserCollectionList()
  loading.value = false
}

// 地区下拉选项
const changeArea = (value: number, event: any) => {
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
onMounted(() => {
  selectUserCollectionList()
  findAllArea()
  findAllCategory()
  getCategory()
  getUserInfo()
  findAllCustomListAffiliate()
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
                <!--                <img :src="rankingBgPng" alt="排行榜" />-->
                <!--              我的榜单子界面-->
                <div v-if="false" class="custom-list-sub-interface">
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
                    <AccountAddTable :isUserAdd="userAdd" @close="closeModal"></AccountAddTable>
                    <!--                  @close="closeModal"-->
                    <!--                  @selectData="findAccountSelectPage"-->
                  </vxe-modal>
                </div>
                <!--              子榜单的添加按钮弹框结束,引入AccountAddTable界面-->
              </div>
              <!--            我的榜单子界面结束-->
              <!--          我的榜单结束-->

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
                              </vxe-select>
                            </div>
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

<style lang="scss">
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
          margin-bottom: 20px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 400px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 80vw;
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

    .home-top-menu-avatar:hover {
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
</style>

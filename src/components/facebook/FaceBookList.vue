<script lang="ts" setup>
import { reactive, ref, onMounted, defineExpose, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NAvatar } from 'naive-ui'
import { VxeButtonEvents, VxePagerEvents, VxeTableInstance } from 'vxe-table'
import moment from 'moment'
import { listAccountByPageApi, findAllCategoryApi, findAreaApi } from '@/service/account'
import 'moment/locale/pt-br'

const router = useRouter()

// 日榜类
type DateObject = {
  id: number
  startTime: string
  endTime: string
  date: string
}

type TableData = {
  data: API.AccountData[]
}

type DateObjectList = {
  data: DateObject[]
}

type TablePage = {
  total: number
  currentPage: number
  pageSize: number
}

type AreaData = {
  data: API.Area[]
}

type CategoryData = {
  data: API.Category[]
}
// 分类信息
const categoryData = reactive<CategoryData>({
  data: []
})

// 地区信息
const areaData = reactive<AreaData>({
  data: []
})

const tablePage = reactive<TablePage>({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
const tableData = reactive<TableData>({
  data: []
})

const dateObject = reactive<DateObject>({
  id: 0,
  startTime: '',
  endTime: '',
  date: ''
})

const dailyList = reactive<DateObjectList>({
  data: []
})
// 日榜周榜月榜选项 1：日榜 2：周榜 3：月榜
const dateList = ref<string>('1')

// 搜索账号条件
const accountName = ref<string>('')

const currentDate = ref<string>()

const category = ref<string>()

const area = ref<string>()

// 默认时间榜单
const defaultDailyTime = ref<string>('')
const defaultWeeklyTime = ref<string>('')
const defaultMonthlyTime = ref<string>('')

// 查询数据的条件参数
const params = reactive<API.AccountParams & API.PageParams>({
  pageSize: tablePage.pageSize,
  page: tablePage.currentPage,
  area: '',
  category: '',
  platform: '',
  accountName: '',
  startTime: '',
  endTime: '',
  sortType: 0,
  isExport: 0
})

// 单击行实现信息跳转
const cellClickTable = (row: any) => {
  const rowData = row.data[row.rowIndex]
  router.push({
    path: `/Account/${rowData.accountId}`
  })
}

// 分页查询所有数据
const findAccountSelectPage = async (e: string) => {
  params.accountName = e
  const res = await listAccountByPageApi(params)
  tableData.data = res.data as API.AccountData[]
  tablePage.total = res.count
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

// 下拉时间选项
const changeDate = (event: any) => {
  params.startTime = event.value.startTime
  params.endTime = event.value.endTime
  findAccountSelectPage(accountName.value)
}

// 地区下拉选项
const changeArea = (event: any) => {
  params.area = event.value
  findAccountSelectPage(accountName.value)
}

// 分类下拉选项
const changeCategory = (event: any) => {
  params.category = event.value
  if (event.value === '全部') {
    params.category = ''
  }
  findAccountSelectPage(accountName.value)
}

// 获取时间接口
const getTime = async () => {
  const myDate = new Date()
  const month = (myDate.getMonth() + 1).toString().padStart(2, '0')
  const day = myDate.getDate().toString().padStart(2, '0')
  currentDate.value = `${myDate.getFullYear()}年${month}月${day}日`
}

// 给日期加0
const addDate0 = (time: any) => {
  let temp = time
  if (temp.toString().length === 1) {
    temp = `0${temp.toString()}`
  }
  return temp
}

// 获取本月第一天
const getNowMonthFirst = (date: any) => {
  date.setDate(1)
  return date
}

// 获取本月最后一天
const getNowMonthLast = (date: any) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// 获取最近3个月的时间
const getMonthDate = async () => {
  dailyList.data.length = 0
  const date = new Date()
  for (let i = 0; i <= 2; i += 1) {
    const nowMonthFirst = getNowMonthFirst(date)
    const nowMonthLast = getNowMonthLast(date)
    const monthDateTime = date.getTime()
    const startDateTime = new Date(monthDateTime)
    const y = startDateTime.getFullYear() // 获取年份
    let m = startDateTime.getMonth() + 1 // 获取月份js月份从0开始，需要+1
    m = addDate0(m)
    const dateTime = `${y}年${m}月`
    dateObject.id = i
    dateObject.startTime = moment(nowMonthFirst.getTime()).format('YYYY-MM-DD')
    dateObject.endTime = moment(nowMonthLast.getTime()).format('YYYY-MM-DD')
    dateObject.date = dateTime
    const dateObjectTemp = { ...dateObject }
    dailyList.data.push(dateObjectTemp)
    date.setMonth(date.getMonth() - 1)
  }
}

// 获取周榜
const getWeekDate = async () => {
  dailyList.data.length = 0
  let date = new Date()
  for (let i = 0; i < 3; i += 1) {
    // 当前时间
    const startTimeItem = new Date(date.getTime())
    const endTimeItem = new Date(startTimeItem.getTime() - 24 * 60 * 60 * 1000 * 6)
    date = endTimeItem
    const ey = endTimeItem.getFullYear() // 获取年份
    let em = endTimeItem.getMonth() + 1 // 获取月份js月份从0开始，需要+1
    let ed = endTimeItem.getDate() // 获取日期
    const sy = startTimeItem.getFullYear() // 获取年份
    let sm = startTimeItem.getMonth() + 1 // 获取月份js月份从0开始，需要+1
    let sd = startTimeItem.getDate() // 获取日期
    em = addDate0(em) // 给为单数的月份补零
    ed = addDate0(ed) // 给为单数的日期补零
    sm = addDate0(sm) // 给为单数的月份补零
    sd = addDate0(sd) // 给为单数的日期补零
    const dateTime = `${ey}年${em}月${ed}日`.concat(`-${sy}年${sm}月${sd}日`)
    dateObject.id = i
    dateObject.startTime = moment(endTimeItem).format('YYYY-MM-DD')
    dateObject.endTime = moment(startTimeItem).format('YYYY-MM-DD')
    dateObject.date = dateTime
    const dateObjectTemp = { ...dateObject }
    dailyList.data.push(dateObjectTemp)
  }
}

// 获取最近7天的时间
const getNearly7Day = async () => {
  dailyList.data.length = 0
  const date = new Date()
  for (let i = 0; i <= 24 * 6; i += 24) {
    // 今天加上前6天
    const dateItem = new Date(date.getTime() - i * 60 * 60 * 1000) // 使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
    const endDateItem = new Date(date.getTime() - i * 60 * 60 * 1000) // 使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
    const y = dateItem.getFullYear() // 获取年份
    let m = dateItem.getMonth() + 1 // 获取月份js月份从0开始，需要+1
    let d = dateItem.getDate() // 获取日期
    m = addDate0(m) // 给为单数的月份补零
    d = addDate0(d) // 给为单数的日期补零
    const valueItem = `${y}年${m}月${d}日` // 组合
    dateObject.id = i
    dateObject.startTime = moment(dateItem).format('YYYY-MM-DD')
    dateObject.endTime = moment(endDateItem).format('YYYY-MM-DD')
    dateObject.date = valueItem
    const dateObjectTemp = { ...dateObject }
    dailyList.data.push(dateObjectTemp)
  }
}

// 分页
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
  params.page = currentPage
  params.pageSize = pageSize
  findAccountSelectPage(accountName.value)
}

// 表格数据
const xTable: any = ref<VxeTableInstance>()

// 导出当前页
const exportCurrentPage: VxeButtonEvents.Click = async () => {
  params.isExport = 1
  const res = await listAccountByPageApi(params)
  params.isExport = 0
  const $table = xTable.value
  await $table.exportData({
    filename: 'FaceBook榜单',
    type: 'csv',
    data: res.data as API.AccountData[],
    isHeader: true,
    isFooter: true
  })
}

const receiveParametersMethods = (accountNameProp: string) => {
  accountName.value = accountNameProp
  findAccountSelectPage(accountName.value)
}

const resetParams = () => {
  params.pageSize = 10
  params.page = 1
  params.area = ''
  params.category = ''
  params.platform = ''
  params.startTime = ''
  params.endTime = ''
  dateList.value = '1'
  area.value = ''
  category.value = ''
  defaultDailyTime.value = ''
  params.sortType = 0
  findAccountSelectPage(accountName.value)
}

defineExpose({ receiveParametersMethods })

onMounted(() => {
  findAccountSelectPage(accountName.value)
  getTime()
  findAllCategory()
  findAllArea()
})

watch(
  dateList,
  (newValue) => {
    if (newValue === '1') {
      defaultDailyTime.value = ''
      getNearly7Day()
    } else if (newValue === '2') {
      defaultWeeklyTime.value = ''
      getWeekDate()
    } else {
      defaultMonthlyTime.value = ''
      getMonthDate()
    }
  },
  { immediate: true }
)
</script>
<template>
  <div class="faceBookBackground-border">
    <!--    图片显示器-->
    <vxe-toolbar>
      <template #buttons>
        <div class="faceBookBackgroundLeft">
          <div class="faceBookBackground">
            <p>FaceBook&nbsp;榜&nbsp;单</p>
          </div>
          <div class="tideDataTime">
            <span>截止日期:{{ currentDate }}</span>
          </div>
        </div>
      </template>
    </vxe-toolbar>
    <!--    工具框-->
    <vxe-toolbar>
      <template #buttons>
        <div class="radioLeft">
          <vxe-radio-group v-model="dateList" :strict="false">
            <vxe-radio-button content="日榜" label="1"></vxe-radio-button>
            <vxe-radio-button content="周榜" label="2"></vxe-radio-button>
            <vxe-radio-button content="月榜" label="3"></vxe-radio-button>
          </vxe-radio-group>
        </div>
        <div class="vxe-menu-date">
          <!--日榜-->
          <p v-if="dateList === '1'">
            <vxe-select
              v-model="defaultDailyTime"
              filterable
              placeholder="选择时间"
              @change="changeDate($event)"
            >
              <vxe-option
                v-for="daily in dailyList.data"
                :key="daily.id"
                :label="daily.date"
                :value="daily"
              ></vxe-option>
            </vxe-select>
          </p>
          <!--周榜-->
          <p v-if="dateList === '2'">
            <vxe-select
              v-model="defaultWeeklyTime"
              filterable
              placeholder="选择时间"
              @change="changeDate($event)"
            >
              <vxe-option
                v-for="daily in dailyList.data"
                :key="daily.id"
                :label="daily.date"
                :value="daily"
              ></vxe-option>
            </vxe-select>
          </p>
          <!--月榜-->
          <p v-if="dateList === '3'">
            <vxe-select
              v-model="defaultMonthlyTime"
              filterable
              placeholder="选择时间"
              @change="changeDate($event)"
            >
              <vxe-option
                v-for="daily in dailyList.data"
                :key="daily.id"
                :label="daily.date"
                :value="daily"
              ></vxe-option>
            </vxe-select>
          </p>
        </div>
        <div class="vxe-menu-select">
          <span>地区</span>
          <vxe-select v-model="area" filterable placeholder="选择区域" @change="changeArea($event)">
            <vxe-option
              v-for="area in areaData.data"
              :key="area.areaId"
              :label="area.areaName"
              :value="area.areaName"
            ></vxe-option>
          </vxe-select>
        </div>
        <div class="vxe-menu-select">
          <span>分类</span>
          <vxe-select
            v-model="category"
            filterable
            placeholder="全部"
            @change="changeCategory($event)"
          >
            <vxe-option
              v-for="cateGory in categoryData.data"
              :key="cateGory.categoryId"
              :label="cateGory.categoryName"
              :value="cateGory.categoryName"
            ></vxe-option>
          </vxe-select>
        </div>
      </template>
      <template #tools>
        <vxe-button icon="vxe-icon--refresh" type="reset" @click="resetParams()">重置</vxe-button>
        <vxe-button
          content="导出"
          icon="vxe-icon--download"
          status="warning"
          @click="exportCurrentPage"
        ></vxe-button>
      </template>
    </vxe-toolbar>
    <!--    table内容-->
    <vxe-table
      ref="xTable"
      :column-config="{ resizable: true }"
      :data="tableData.data"
      :row-config="{ isHover: true }"
      border
      height="400"
      round
      width="500"
      @cell-click="cellClickTable"
    >
      <vxe-column align="center" field="accountId" sortable title="排名"></vxe-column>
      <vxe-column align="center" title="头像">
        <template #default="{ row }">
          <div style="display: flex; flex-wrap: nowrap; width: 100%">
            <div style="width: 50%; display: flex; justify-content: left; padding-left: 20%">
              <n-avatar round size="small" :src="row.accountPictureUrl"></n-avatar>
            </div>
            <div style="width: 50%; display: flex">
              <span>{{ row.accountName }}</span>
            </div>
          </div>
        </template>
      </vxe-column>

      <vxe-column align="center" field="recordFan" sortable title="粉丝数"></vxe-column>
      <vxe-column align="center" field="recordArticle" sortable title="发文数"></vxe-column>
      <vxe-column align="center" field="recordLike" sortable title="点赞数"></vxe-column>
      <vxe-column align="center" field="recordComment" sortable title="评论数"></vxe-column>
      <vxe-column align="center" field="recordForward" sortable title="转发数"></vxe-column>
      <vxe-column align="center" field="sex" sortable title="潮汐指数"></vxe-column>
    </vxe-table>
    <!--    table分页-->
    <vxe-pager
      v-model:current-page="tablePage.currentPage"
      v-model:page-size="tablePage.pageSize"
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
      perfect
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>
<style lang="scss">
.vxe-menu-date {
  margin-left: 25px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin-left: 0;
  }
}

.vxe-menu-select {
  margin-left: 80px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 2vw 0;
  }

  span {
    padding-right: 20px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      padding-right: 2vw;
    }
  }
}

.tideDataTime {
  float: left;
  padding-left: 20px;
  padding-top: 35px;
  text-align: center;
  font-size: 18px;
  opacity: 0.6;
  color: rgba(17, 54, 145, 58);
  @media screen and (min-width: 320px) and (max-width: 480px) {
    padding-left: 0;
    padding-top: 2vw;
  }
}

.first-col {
  position: relative;
  height: 20px;
}

.first-col:before {
  content: '';
  position: absolute;
  left: -15px;
  top: 10px;
  width: 170px;
  height: 1px;
  transform: rotate(18deg);
  background-color: #e8eaec;
}

.first-col .first-col-top {
  position: absolute;
  right: 4px;
  top: -10px;
}

.first-col .first-col-bottom {
  position: absolute;
  left: 4px;
  bottom: -10px;
}

.my-filter {
  margin: 10px;
}

.page-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.faceBookBackground {
  margin-top: 20px;
  float: left;
  left: 72px;
  top: 360px;
  width: 210px;
  height: 48px;
  line-height: 17px;
  border-radius: 12px;
  background-image: linear-gradient(to right, #103393, white);
  opacity: 1;
  font-size: 18px;
  text-align: center;
  color: #e8eaec;
}

.faceBookBackground-border {
  margin: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 10px 1px rgba(17, 54, 145, 30);
  padding: 0 20px 20px;
}

.faceBookBackgroundLeft {
  padding-left: 20px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    padding-left: 0;
  }
}

.radioLeft {
  padding-left: 20px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    padding-left: 0;
  }
}

.vxe-pager {
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 25vw;
  }
}
.vxe-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

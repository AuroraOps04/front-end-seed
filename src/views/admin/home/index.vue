<script lang="ts" setup>
import { NGrid, NGi } from 'naive-ui'
import * as echarts from 'echarts'
import { onMounted, reactive, ref } from 'vue'
import { getMonthTrafficAPI, getTrafficCountApi, insertTrafficCount } from '@service/traffic'
import { getUserCountApi } from '@service/user'
import { getAccountCountApi, getMonthAccountAPI } from '@service/account'
import { listUserByPageApi } from '@service/userList'
import UserList from '@/components/userlist/UserList.vue'
import Menu from '@/components/admin/Menu.vue'
import userNum from '@/assets/userNum.png'
import accountNum from '@/assets/accountNum.png'
import visitsNum from '@/assets/visitsNum.png'
import underLine from '@/assets/underLine.png'
import verticalLine from '@/assets/vertical_line.png'

// 设置实例参数
const userNumPng = userNum
const underLinePng = underLine
const accountNumPng = accountNum
const visitsNumPng = visitsNum
const verticalLinePng = verticalLine

// 页面数据
const TrafficData = reactive({
  // 访问量数据
  trafficData: {
    historicalTraffic: 0,
    newTraffic: 0
  },
  userData: {
    historicalUser: 0,
    newUser: 0
  },
  accountDate: {
    historicalAccount: 0,
    newAccount: 0
  }
})

type echartsObject = {
  month: string
  count: string
}

type echartsData = {
  records: echartsObject[]
  Date: string[]
  Count: string[]
}

const echartsTrafficData = reactive<echartsData>({
  records: [],
  Date: [],
  Count: []
})
const echartsAccountData = reactive<echartsData>({
  records: [],
  Date: [],
  Count: []
})

const xAxisData = ref()

const seriesData = ref()

const main = ref<HTMLElement | null>() // 使用ref创建虚拟DOM引用，使用时用main.value
const main1 = ref<HTMLElement | null>() // 使用ref创建虚拟DOM引用，使用时用main.value

// 获取访问量
const findTraffic = async () => {
  const res = await getTrafficCountApi()
  TrafficData.trafficData.newTraffic = res.data! as any
  TrafficData.trafficData.historicalTraffic = res.count! as any
}

// 获取用户量
const findUser = async () => {
  const res = await getUserCountApi()
  TrafficData.userData.newUser = res.data! as any
  TrafficData.userData.historicalUser = res.count! as any
}

// 获取检测账户量
const findAccount = async () => {
  const res = await getAccountCountApi()
  TrafficData.accountDate.newAccount = res.data! as any
  TrafficData.accountDate.historicalAccount = res.count! as any
}

// 访问量表格初始化
function init(dom: HTMLElement) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(dom)
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '实时访问量'
    },
    xAxis: {
      data: xAxisData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
        color: '#5087EC'
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
// 检测表格初始化
function init1(dom: HTMLElement) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(dom)
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '监测账号数'
    },
    xAxis: {
      data: xAxisData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
        color: '#5087EC'
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

// 获取访问量echarts表格
const findTrafficEcharts = async () => {
  const res = await getMonthTrafficAPI()

  echartsTrafficData.records = res.data as echartsObject[]
  echartsTrafficData.records.forEach((item) => {
    // 获取月份
    echartsTrafficData.Date.push(`${item.month}月`)
    // 获取访问量
    echartsTrafficData.Count.push(item.count)
  })

  xAxisData.value = echartsTrafficData.Date
  seriesData.value = echartsTrafficData.Count
  init(main.value!)
}

// 获取检测账户echarts表格
const findAccountEcharts = async () => {
  const res = await getMonthAccountAPI()

  echartsAccountData.records = res.data as echartsObject[]
  echartsAccountData.records.forEach((item) => {
    // 获取月份
    echartsAccountData.Date.push(`${item.month}月`)
    // 获取访问量
    echartsAccountData.Count.push(item.count)
  })

  xAxisData.value = echartsAccountData.Date
  seriesData.value = echartsAccountData.Count
  init1(main1.value!)
}

onMounted(() => {
  findTraffic()
  findUser()
  findAccount()
  findTrafficEcharts()
  findAccountEcharts()
})
</script>
<template>
  <div>
    <div class="box_bg1">
      <h3>数据看板</h3>
      <img class="text_bg_png1" :src="underLinePng" />
      <NGrid x-gap="12" :cols="3" style="margin-top: 35px">
        <NGi>
          <div style="display: flex; align-items: center">
            <div><img :src="visitsNumPng" /></div>

            <div class="text_box">
              <text class="text_title">网站访问量</text>
              <text class="text_body_num">{{ TrafficData.trafficData.historicalTraffic }}</text>
              <text class="text_title text_bottom_num"
                >今日+{{ TrafficData.trafficData.newTraffic }}</text
              >
            </div>
            <img :src="verticalLinePng" style="padding-left: 80px" />
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div>
              <img :src="userNumPng" />
            </div>

            <div class="text_box">
              <text class="text_title">注册用户量</text>
              <text class="text_body_num">{{ TrafficData.userData.historicalUser }}</text>
              <text class="text_title text_bottom_num"
                >今日+{{ TrafficData.userData.newUser }}</text
              >
            </div>
            <img :src="verticalLinePng" style="padding-left: 80px" />
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div>
              <img :src="accountNumPng" />
            </div>

            <div class="text_box">
              <text class="text_title">检测账号数</text>
              <text class="text_body_num">{{ TrafficData.accountDate.historicalAccount }}</text>
              <text class="text_title text_bottom_num"
                >今日+{{ TrafficData.accountDate.newAccount }}</text
              >
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>
    <div class="box_bg2">
      <h3>数据趋势</h3>
      <img class="text_bg_png2" :src="underLinePng" />

      <div style="padding-left: 10%; padding-right: 10%">
        <div ref="main" style="width: 300px; height: 300px; float: left"></div>
        <div ref="main1" style="width: 300px; height: 300px; float: right"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box_bg1 {
  height: 190px;
  width: 80%;
  margin: 2%;
  margin-left: 80px;
  padding: 2%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.box_bg2 {
  height: 400px;
  width: 80%;
  margin: 2%;
  margin-left: 80px;
  padding: 2%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.text_title {
  color: #798197;
  margin-bottom: 7px;
}
.text_body_num {
  font-size: 22px;
}
.text_bottom_num {
  font-size: 5px;
  margin-top: 7px;
}
.text_box {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
}
.text_bg_png1 {
  position: absolute;
  height: 17px;
  width: 144px;
  left: 330px;
  bottom: 571px;
}

.text_bg_png2 {
  position: absolute;
  height: 17px;
  width: 144px;
  left: 330px;
  bottom: 304px;
}
</style>

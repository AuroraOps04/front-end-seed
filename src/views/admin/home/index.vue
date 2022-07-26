<script lang="ts" setup>
import { NGrid, NGi } from 'naive-ui'
import * as echarts from 'echarts'
import { onMounted, reactive, ref } from 'vue'
import { getMonthTrafficAPI, getTrafficCountApi } from '@service/traffic'
import { getUserCountApi } from '@service/user'
import { getAccountCountApi, getMonthAccountAPI } from '@service/account'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
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

// Initialize an agent at application startup.

const fpPromise = FingerprintJS.load()
const fetchFingerprint = async () => {
  console.log(123, fpPromise)
  const fp = await fpPromise
  const result = await fp.get()
  console.log('这是id：', result.visitorId)
}

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

// 获取监测账户量
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
// 监测表格初始化
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

// 获取监测账户echarts表格
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
  fetchFingerprint()
})
</script>
<template>
  <div class="box_flex">
    <div class="box_bg1">
      <h3>数据看板</h3>
      <img :src="underLinePng" alt="" class="underline" />
      <NGrid :cols="3" x-gap="12">
        <NGi>
          <div class="bg1_box">
            <div class="icon"><img :src="visitsNumPng" alt="" /></div>

            <div class="text_box">
              <text class="text_title">网站访问量</text>
              <text class="text_body_num">{{ TrafficData.trafficData.historicalTraffic }}</text>
              <text class="text_title text_bottom_num"
                >今日+{{ TrafficData.trafficData.newTraffic }}</text
              >
            </div>
            <img :src="verticalLinePng" alt="" class="line" />
          </div>
        </NGi>
        <NGi>
          <div class="bg1_box">
            <div class="icon"><img :src="userNumPng" alt="" /></div>

            <div class="text_box">
              <text class="text_title">注册用户量</text>
              <text class="text_body_num">{{ TrafficData.userData.historicalUser }}</text>
              <text class="text_title text_bottom_num"
                >今日+{{ TrafficData.userData.newUser }}</text
              >
            </div>
            <img :src="verticalLinePng" alt="" class="line" />
          </div>
        </NGi>
        <NGi>
          <div class="bg1_box">
            <div class="icon"><img :src="accountNumPng" alt="" /></div>

            <div class="text_box">
              <text class="text_title">监测账号数</text>
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
      <img :src="underLinePng" alt="" class="text_bg_png2" />

      <div class="pan">
        <div ref="main" style="width: 300px; height: 300px; float: left"></div>
        <div ref="main1" style="width: 300px; height: 300px; float: right"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box_flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .box_bg1 {
    height: 40%;
    width: 80%;
    margin: 2% 2% 2% 80px;
    padding: 2%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: calc(100% - 8vw);
      height: 100%;
      margin: 2vw 2vw 2vw 0;
      padding: 2vw;
    }
    .underline {
      @media screen and (min-width: 320px) and (max-width: 480px) {
        display: none;
      }
    }
    .bg1_box {
      display: flex;
      align-items: center;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        flex-direction: column;
        justify-content: center;
      }
      .icon {
        img {
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 10vw;
            height: 10vw;
          }
        }
      }

      .text_box {
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin-left: 0;
          justify-content: center;
          align-items: center;
        }

        .text_bg_png1 {
          position: absolute;
          height: 17px;
          width: 144px;
          left: 330px;
          bottom: 571px;
          display: none;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            display: none;
          }
        }

        .text_bg_png2 {
          position: absolute;
          height: 17px;
          width: 144px;
          left: 330px;
          bottom: 304px;
          display: none;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin-left: 0;
            justify-content: center;
            align-items: center;
            display: none;
          }
        }

        .text_body_num {
          font-size: 20px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }
      }

      .title {
        h3 {
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }
      }

      img {
        padding-left: 80px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          padding-left: 0;
        }
      }

      .line {
        @media screen and (min-width: 320px) and (max-width: 480px) {
          display: none;
        }
      }
    }
  }

  .box_bg2 {
    height: 80%;
    width: 80%;
    margin: 2% 2% 2% 80px;
    padding: 3%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: calc(100% - 8vw);
      height: 100%;
      margin: 2vw 2vw 2vw 0;
      padding: 2vw;
    }
    .text_bg_png2 {
      position: absolute;
      height: 17px;
      width: 144px;
      left: 330px;
      bottom: 304px;
      display: none;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        margin-left: 0;
        justify-content: center;
        align-items: center;
        display: none;
      }
    }
    .pan {
      padding-left: 10%;
      padding-right: 10%;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.text_bottom_num {
  font-size: 5px;
  margin-top: 7px;
}
</style>

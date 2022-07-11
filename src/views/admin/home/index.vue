<script lang="ts" setup>
import { NGrid, NGi } from 'naive-ui'
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import UserList from '@/components/userlist/UserList.vue'
import Menu from '@/components/admin/Menu.vue'
import userNum from '@/assets/userNum.png'
import accountNum from '@/assets/accountNum.png'
import visitsNum from '@/assets/visitsNum.png'
import underLine from '@/assets/underLine.png'

const xAxisData = ref()

const seriesData = ref()

const main = ref<HTMLElement | null>() // 使用ref创建虚拟DOM引用，使用时用main.value
const main1 = ref<HTMLElement | null>() // 使用ref创建虚拟DOM引用，使用时用main.value

function init(dom: HTMLElement) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(dom)
  // 指定图表的配置项和数据
  const option = {
    // xAxis: {
    //   type: 'category',
    //   data: xAxisData.value
    // },
    // yAxis: {
    //   type: 'value'
    // },
    // series: [
    //   {
    //     data: seriesData.value,
    //     type: 'line',
    //     smooth: true,
    //     color: '#F78B32'
    //   }
    // ]
    title: {
      text: '实时访问量'
    },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月'] }, // X轴
    yAxis: { type: 'value' }, // Y轴
    series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line' }] // 配置项
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

// 设置实例参数
const userNumPng = userNum
const underLinePng = underLine
const accountNumPng = accountNum
const visitsNumPng = visitsNum

onMounted(() => {
  init(main.value!)
  init(main1.value!)
})
</script>
<template>
  <div>
    <div class="box_bg1">
      <h3>数据看板</h3>
      <img class="text_bg_png1" :src="underLinePng" />
      <NGrid x-gap="12" :cols="3">
        <NGi>
          <div style="display: flex; align-items: center">
            <div><img :src="visitsNumPng" /></div>

            <div class="text_box">
              <text class="text_title">网站访问量</text>
              <text class="text_body_num">356645</text>
              <text class="text_title text_bottom_num">今日+12345</text>
            </div>
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div><img :src="userNumPng" /></div>

            <div class="text_box">
              <text class="text_title">注册用户量</text>
              <text class="text_body_num">356645</text>
              <text class="text_title text_bottom_num">今日+12345</text>
            </div>
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div><img :src="accountNumPng" /></div>

            <div class="text_box">
              <text class="text_title">检测账号量</text>
              <text class="text_body_num">356645</text>
              <text class="text_title text_bottom_num">今日+12345</text>
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>
    <div class="box_bg2">
      <h3>数据趋势</h3>
      <img class="text_bg_png2" :src="underLinePng" />

      <div style="padding-left: 10%; padding-right: 10%">
        <div ref="main" style="width: 400px; height: 400px; float: left"></div>
        <div ref="main1" style="width: 400px; height: 400px; float: right"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box_bg1 {
  height: 200px;
  width: 80%;
  margin: 2%;
  margin-left: 80px;
  padding: 2%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.box_bg2 {
  height: 500px;
  width: 80%;
  margin: 2%;
  margin-left: 80px;
  padding: 3%;
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
  display: flex;
  flex-direction: column;
}
.text_bg_png1 {
  position: absolute;
  height: 17px;
  width: 144px;
  left: 330px;
  bottom: 645px;
}

.text_bg_png2 {
  position: absolute;
  height: 17px;
  width: 144px;
  left: 340px;
  bottom: 345px;
}
</style>

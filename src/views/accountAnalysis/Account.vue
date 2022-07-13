<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'
import 'moment/locale/pt-br'
import * as echarts from 'echarts'
import { NButton, NAvatar, NGrid, NGi, NDivider, NIcon, NButtonGroup } from 'naive-ui'
import { StarOutline } from '@vicons/ionicons5'
import arrow from '@/assets/arrow.png'
import up from '@/assets/up.png'
import comment from '@/assets/comment.png'
import forward from '@/assets/forward.png'
import write from '@/assets/write.png'
import textBg from '@/assets/text_bg.png'
import {
  findAccountByAccountApi,
  findRecordTotalApi,
  findRecordCharsDataApi,
  AccountCollectionApi,
  accountCollectionStatueApi
} from '@/service/account'
import Header from '@/components/Header.vue'

const store = useStore()

type accountObject = {
  accountId: number
  accountName: string | null
  accountPictureUrl: string | null
  areaName: string | null
  categoryName: string | null
  createdAt: string | null
  deletedAt: number | null
  introduction: string | null
  platformName: string | null
  recordArticle: number | null
  recordComment: number | null
  recordFan: number | null
  recordForward: number | null
  recordLike: number | null
  updatedAt: string | null
}

type recordObject = {
  recordArticleCount: number
  recordLikeCount: number
  recordCommentCount: number
  recordForwardCount: number
}

type eCharsObject = {
  days: string
  recordLike: number
  recordFan: number
  recordArticle: number
  recordComment: number
  recordForward: number
}

type EChar = {
  data: eCharsObject[]
}

const router = useRouter()

const accountId = ref<number>()

const collectionState = ref<number>()

// 日榜周榜切换 1:是日榜，2：是周榜
const dateList = ref<number>(1)

const dateListButtonStyle = ref<string>('warning')

const weeklyListButtonStyle = ref<string>('tertiary')

const xAxisData = ref()

const seriesData = ref()

const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

const eCharDate = reactive({
  dateList: [],
  data: []
})

const params = reactive<API.CharsParams>({
  accountId: accountId.value,
  dateList: dateList.value
})

const accountInfo = reactive({
  accountDetailInfo: {},
  recordTotal: {}
})

const eCharData = reactive<EChar>({
  data: []
})

const accountQuery = reactive<API.AccountQueryParams>({
  accountId: accountId.value,
  startTime: '',
  endTime: ''
})

const getDate = () => {
  const date = new Date()
  // let year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // day = day < 10 ? "0" + day : day; //day小于10，加0
  return `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}
// 设置实例参数
const currentDate = getDate()
const arrowPng = arrow
const writePng = write
const commentPng = comment
const forwardPng = forward
const upPng = up
const textBgPng = textBg
const echartsSelect = ref<string>('article')

function init() {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(main.value)
  // 指定图表的配置项和数据
  const option = {
    xAxis: {
      type: 'category',
      data: xAxisData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
        smooth: true,
        color: '#F78B32'
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

accountId.value = parseInt(router.currentRoute.value.params.accountId as string, 10)

const findRecordCharsData = async (e: number) => {
  eCharDate.dateList = []
  eCharDate.data = []
  params.dateList = e
  params.accountId = accountId.value
  const res = await findRecordCharsDataApi(params)
  eCharData.data = res.data as eCharsObject[]
  eCharData.data.forEach((item) => {
    // 获取时间
    eCharDate.dateList.push(item.days as never)
    // 获取发文数
    eCharDate.data.push(item.recordArticle as never)
  })
  xAxisData.value = eCharDate.dateList
  seriesData.value = eCharDate.data
  init()
}

// 根据账户id获取账户信息
const findAccountByAccount = async (dateListType: number) => {
  const date = new Date()
  const startTimeItem = new Date(date.getTime())
  const endTimeItem = new Date(startTimeItem.getTime() - 24 * 60 * 60 * 1000 * 7)
  accountQuery.accountId = accountId.value
  // 默认日榜
  if (dateListType === 1) {
    accountQuery.startTime = moment(startTimeItem).format('YYYY-MM-DD')
    accountQuery.endTime = moment(startTimeItem).format('YYYY-MM-DD')
  } else {
    accountQuery.startTime = moment(endTimeItem).format('YYYY-MM-DD')
    accountQuery.endTime = moment(startTimeItem).format('YYYY-MM-DD')
  }
  const res = await findAccountByAccountApi(accountQuery)
  accountInfo.accountDetailInfo = res.data as accountObject
}

const findRecordTotal = async (e: number) => {
  const res = await findRecordTotalApi(e)
  accountInfo.recordTotal = res.data as recordObject
}

const handleEcharts = (type: string) => {
  // 命名不规范,后悔一辈子
  eCharDate.data = []
  if (type === 'article') {
    xAxisData.value = eCharDate.dateList
    eCharData.data.forEach((e) => {
      eCharDate.data.push(e.recordArticle as never)
    })
    seriesData.value = eCharDate.data
  }
  if (type === 'like') {
    xAxisData.value = eCharDate.dateList
    eCharData.data.forEach((e) => {
      // 获取发文数
      eCharDate.data.push(e.recordComment as never)
      eCharDate.data.push(e.recordLike as never)
    })
    seriesData.value = eCharDate.data
  }
  if (type === 'comment') {
    xAxisData.value = eCharDate.dateList
    eCharData.data.forEach((e) => {
      // 获取发文数
      eCharDate.data.push(e.recordComment as never)
    })
    seriesData.value = eCharDate.data
  }
  if (type === 'forward') {
    xAxisData.value = eCharDate.dateList
    eCharData.data.forEach((e) => {
      // 获取发文数
      eCharDate.data.push(e.recordForward as never)
    })
    seriesData.value = eCharDate.data
  }

  echartsSelect.value = type
  main.value.removeAttribute('_echarts_instance_')
  init()
}

const DateListButtonChange = (typeButton: number) => {
  if (typeButton === 1) {
    dateListButtonStyle.value = 'warning'
    weeklyListButtonStyle.value = 'tertiary'
    dateList.value = typeButton
    findRecordCharsData(typeButton)
  } else if (typeButton === 2) {
    weeklyListButtonStyle.value = 'warning'
    dateListButtonStyle.value = 'tertiary'
    dateList.value = typeButton
    findRecordCharsData(typeButton)
  }
  findAccountByAccount(typeButton)
}

const AccountCollection = async () => {
  const accountCollectionId = accountId.value as number
  const userId = store.getters.currentId
  const res = await AccountCollectionApi(accountCollectionId, userId)
  collectionState.value = res.data as unknown as number
}

const accountCollectionStatue = async () => {
  const accountCollectionId = accountId.value as number
  const userId = store.getters.currentId
  const res = await accountCollectionStatueApi(accountCollectionId, userId)
  collectionState.value = res.data as unknown as number
}
onMounted(() => {
  findRecordCharsData(1)
  findAccountByAccount(1)
  findRecordTotal(accountId.value as number)
  accountCollectionStatue()
})
</script>

<template>
  <div>
    <div>
      <Header />
      <!--    <span class="back" @click="handleBack">返回</span>-->
      <!--    页面上半部分-->
      <div class="box-card">
        <NGrid :cols="4" x-gap="24">
          <NGi>
            <div class="profile_picture">
              <NAvatar :size="60" :src="accountInfo.accountDetailInfo.accountPictureUrl" round>
              </NAvatar>
              <div v-if="collectionState === 2" class="box-collect">
                <NButton class="button_collection" ghost type="warning" @click="AccountCollection">
                  <template #icon>
                    <NIcon>
                      <StarOutline />
                    </NIcon>
                  </template>
                  收藏
                </NButton>
              </div>
              <div v-else class="box-collect">
                <NButton class="button_collection" ghost type="warning" @click="AccountCollection">
                  <template #icon>
                    <NIcon>
                      <StarOutline />
                    </NIcon>
                  </template>
                  取消收藏
                </NButton>
              </div>
            </div>
          </NGi>
          <NGi span="2">
            <div class="acc_body1">
              <text class="account_name">{{ accountInfo.accountDetailInfo.accountName }}</text>
            </div>
            <div class="acc_body2">
              <text class="text_brief_color">账号名称：</text>
              <text class>{{ accountInfo.accountDetailInfo.accountName }}</text>
            </div>
            <div class="acc_body3">
              <text class="text_brief_color">个人简介：</text>
              <text class>{{ accountInfo.accountDetailInfo.introduction }}</text>
            </div>
            <NDivider />
            <div class="acc_body4">
              <NGrid :cols="3" x-gap="24">
                <NGi>
                  <div class="profile_info">
                    <text class="text_brief_color">分类</text>
                    <text class="text_brief_info"
                      >{{ accountInfo.accountDetailInfo.categoryName }}
                    </text>
                  </div>
                </NGi>

                <NGi>
                  <div class="profile_info">
                    <text class="text_brief_color">地区</text>
                    <text class="text_brief_info"
                      >{{ accountInfo.accountDetailInfo.areaName }}
                    </text>
                  </div>
                </NGi>

                <NGi>
                  <div class="profile_info">
                    <text class="text_brief_color">粉丝数</text>
                    <text class="text_brief_info"
                      >{{ accountInfo.accountDetailInfo.recordFan }}
                    </text>
                  </div>
                </NGi>
              </NGrid>
            </div>
          </NGi>

          <NGi>
            <div class="score_body">
              <text class="text_exponential">888.8</text>

              <text class="text_exponential"> 分</text>
              <text class="text_num"> /周潮汐指数</text>
            </div>

            <div class="rank_body">
              <text class="rank">NO.</text>
              <text class="rank">1</text>
              <text class="rank_area">两岸>周榜</text>
            </div>
          </NGi>
        </NGrid>
      </div>
    </div>
    <div>
      <!--    页面下半部分-->
      <div class="box-card">
        <!--      账号数据标题-->
        <NGrid :cols="1" x-gap="24">
          <NGi>
            <div class="card-content">
              <div class="card-title">
                <h2 class="text_italic">账号数据</h2>
                <img :src="textBgPng" alt="账号数据" class="img_bg" />
                <h5 class="text_date">更新于{{ currentDate }}</h5>
              </div>
              <div class="center">
                <NButtonGroup>
                  <NButton :type="dateListButtonStyle" plain round @click="DateListButtonChange(1)"
                    >日榜
                  </NButton>
                  <NButton
                    :type="weeklyListButtonStyle"
                    plain
                    round
                    @click="DateListButtonChange(2)"
                    >周榜
                  </NButton>
                </NButtonGroup>
              </div>
            </div>
          </NGi>
        </NGrid>

        <!--      榜单排行-->
        <NGrid :cols="1" style="margin-bottom: 20px" x-gap="24">
          <NGi>
            <div style="display: flex; align-items: center">
              <text class="text_italic">榜单排行</text>
              <img :src="arrowPng" alt="榜单排行" class="img_arrow" />
            </div>
          </NGi>
        </NGrid>

        <NGrid :cols="1" style="margin-bottom: 80px" x-gap="24">
          <NGi>
            <div class="card-score">
              <div class="score_body2">
                <text class="text_exponential2">888.8</text>

                <text class="text_exponential2"> 分</text>
                <text class="text_num"> /周潮汐指数</text>
              </div>
              <div class="rank_body2">
                <text class="rank">NO.</text>
                <text class="rank">1</text>
                <text class="rank_area">两岸>周榜</text>
              </div>
            </div>
          </NGi>

          <NGi></NGi>
        </NGrid>

        <NDivider />

        <!--      互动数据-->
        <NGrid :cols="1" style="margin-bottom: 80px" x-gap="24">
          <NGi>
            <div style="display: flex; align-items: center">
              <text class="text_italic">互动数据</text>
              <img :src="arrowPng" alt="互动数据" class="img_arrow" />
            </div>
          </NGi>
        </NGrid>

        <NGrid :cols="4" style="margin-bottom: 80px" x-gap="24">
          <NGi class="body_center">
            <div>
              <text class="text_info1">
                {{
                  accountInfo.accountDetailInfo.recordArticle === null
                    ? 0
                    : accountInfo.accountDetailInfo.recordArticle
                }}
              </text>
              <text class="text_info2"
                >/<br />{{ accountInfo.recordTotal.recordArticleCount }}
              </text>
            </div>
            <div class="center_detail">
              <img :src="writePng" alt="发文数" class="img_arrow" />
              <text class="text_info">发文数</text>
            </div>
          </NGi>
          <NGi class="body_center">
            <div>
              <text class="text_info1">
                {{
                  accountInfo.accountDetailInfo.recordLike === null
                    ? 0
                    : accountInfo.accountDetailInfo.recordLike
                }}
              </text>
              <text class="text_info2">/<br />{{ accountInfo.recordTotal.recordLikeCount }}</text>
            </div>
            <div class="center_detail">
              <img :src="upPng" alt="点赞数" class="img_arrow" />
              <text class="text_info">点赞数</text>
            </div>
          </NGi>
          <NGi class="body_center">
            <div>
              <text class="text_info1">
                {{
                  accountInfo.accountDetailInfo.recordComment === null
                    ? 0
                    : accountInfo.accountDetailInfo.recordComment
                }}
              </text>
              <text class="text_info2"
                >/<br />{{ accountInfo.recordTotal.recordCommentCount }}
              </text>
            </div>
            <div class="center_detail">
              <img :src="commentPng" alt="评论数" class="img_arrow" />
              <text class="text_info">评论数</text>
            </div>
          </NGi>
          <NGi class="body_center">
            <div>
              <text class="text_info1">
                {{
                  accountInfo.accountDetailInfo.recordForward === null
                    ? 0
                    : accountInfo.accountDetailInfo.recordForward
                }}
              </text>
              <text class="text_info2"
                >/<br />{{ accountInfo.recordTotal.recordForwardCount }}
              </text>
            </div>
            <div class="center_detail">
              <img :src="forwardPng" alt="转发数" class="img_arrow" />
              <text class="text_info">转发数</text>
            </div>
          </NGi>
        </NGrid>

        <NDivider />
        <!--      数据趋势-->
        <NGrid :cols="1" x-gap="24">
          <NGi>
            <div style="display: flex; align-items: center">
              <text class="text_italic">数据趋势</text>
              <img :src="arrowPng" alt="数据趋势" class="img_arrow" />
            </div>
          </NGi>
        </NGrid>

        <NGrid :cols="1" x-gap="24">
          <NGi>
            <div class="card-echarts">
              <div class="button_body">
                <NButton
                  :type="echartsSelect === 'article' ? 'warning' : 'default'"
                  class="button_1"
                  round
                  @click="handleEcharts('article')"
                  >发文数
                </NButton>
                <NButton
                  :type="echartsSelect === 'like' ? 'warning' : 'default'"
                  class="button_1"
                  round
                  @click="handleEcharts('like')"
                  >点赞数
                </NButton>
                <NButton
                  :type="echartsSelect === 'comment' ? 'warning' : 'default'"
                  class="button_1"
                  round
                  @click="handleEcharts('comment')"
                  >评论数
                </NButton>
                <NButton
                  :type="echartsSelect === 'forward' ? 'warning' : 'default'"
                  class="button_1"
                  round
                  @click="handleEcharts('forward')"
                  >转发数
                </NButton>
              </div>
              <div ref="main" class="echarts-content"></div>
            </div>
          </NGi>
        </NGrid>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  width: 86%;
  margin: 5%;
  padding: 2%;
  border-radius: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
    width: 96vw;
    padding: 5vw 1vw;
  }

  .profile_picture {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .n-grid {
    @media screen and (min-width: 320px) and (max-width: 480px) {
      gap: 0 1vw !important;
    }
  }

  .box-collect {
    padding: 30px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      padding: 0;
      margin: 3vw 0;
    }

    .n-button {
      @media screen and (min-width: 320px) and (max-width: 480px) {
        padding: 0 5px !important;
      }
    }
  }

  .card-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 5vw 0;
    }

    .card-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      position: relative;

      .text_italic {
        font-style: italic;
        margin: 25px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 5vw;
          margin: 0;
        }
      }

      .img_bg {
        position: absolute;
        height: 14px;
        width: 144px;
        left: 10px;
        bottom: 15px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          height: 14px;
          width: 144px;
          left: 0;
          bottom: 0;
        }
      }

      .text_date {
        color: rgba(17, 54, 145, 58);
        font-size: 8px;
        text-align: left;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin-left: 2vw;
        }
      }
    }

    .center {
      justify-content: center;
      text-align: center;
    }
  }

  .text_italic {
    font-style: italic;
    font-size: 18px;
    font-weight: 600;
    margin: 25px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      font-size: 4vw;
      margin: 0;
    }
  }

  .card-echarts {
    display: flex;
    flex-direction: row;

    .echarts-content {
      width: 700px;
      height: 350px;
    }

    //@media screen and (min-width: 320px) and (max-width: 480px) {
    //width: 100vw;
    //height: 80vw;
    //}
  }
}

.rank_area {
  margin: 10px;
  color: #bdc7df;
  font-size: 15px;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 3vw;
  }
}

.body_center {
  text-align: center;
  justify-content: center;

  .center_detail {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.text_second_label {
  margin-top: 5px;
  margin-left: 40px;
  margin-right: 18px;
  font-size: 18px;
  font-weight: 600;
}

.text_info {
  color: #8c8d90;
  font-size: 15px;
  margin-left: 5px;
}

.text_info1 {
  color: #3f3f46;
  font-size: 28px;
  font-weight: 600;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 4vw;
  }
}

.text_info2 {
  color: #bdc7df;
  font-size: 20px;
  margin-left: 5px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 4vw;
  }
}

.text_num {
  font-size: 8px;
  font-weight: 600;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 2vw;
  }
}

.text_exponential {
  color: rgba(17, 54, 145, 58);
  font-size: 32px;
  font-weight: 700;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 6vw;
  }
}

.text_exponential2 {
  color: rgba(17, 54, 145, 58);
  font-size: 28px;
}

.text_brief_color {
  color: #bbbaba;
}

.text_brief_info {
  font-size: 20px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 4vw;
  }
}

.button_1 {
  width: 120px;
  margin: 10px;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 4vw;
    width: 20vw;
    margin: 2vw;
  }
}

.button_body {
  display: flex;
  flex-direction: column;
  margin: 80px 50px 50px 50px;
  text-align: center;
  justify-content: center;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 10vw 0;
  }
}

.acc_body1 {
  margin-top: 15px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin-top: 0;
  }
}

.acc_body2 {
  margin: 10px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
  }
}

.acc_body3 {
  margin: 10px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
  }
}

.acc_body4 {
  margin: 10px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
  }
}

.text_info_title {
  color: #bbd1e9;
}

.profile_info {
  display: flex;
  flex-direction: column;
  padding: 1%;
  text-align: center;
}

.rank {
  font-size: 20px;
  font-weight: 700;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 4vw;
  }
}

.rank_body {
  margin-top: 20px;
}

.rank_body2 {
  margin-top: 10px;
  margin-left: 40px;
  margin-right: 40px;
}

.score_body {
  margin-top: 50px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin-top: 10vw;
  }
}

.card-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score_body2 {
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
}

.account_name {
  font-size: 25px;
  font-weight: 600;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    font-size: 5vw;
  }
}

.img_arrow {
  width: 20px;
  height: 20px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    width: 5vw;
    height: 5vw;
  }
}
</style>

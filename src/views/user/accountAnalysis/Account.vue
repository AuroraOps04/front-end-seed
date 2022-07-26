<script lang="ts" setup xmlns:v-if="http://www.w3.org/1999/html">
import { onMounted, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'
import 'moment/locale/pt-br'
import * as echarts from 'echarts'
import {
  NButton,
  NAvatar,
  NGrid,
  NGi,
  NDivider,
  NIcon,
  NButtonGroup,
  NCard,
  GlobalThemeOverrides,
  NConfigProvider,
  NMessageProvider
} from 'naive-ui'
import {
  Star,
  StarOutline,
  ChatboxEllipsesOutline,
  Heart,
  ArrowRedoOutline,
  ThumbsUpOutline
} from '@vicons/ionicons5'
import {
  findAccountByAccountApi,
  findRecordTotalApi,
  findRecordCharsDataApi,
  AccountCollectionApi,
  accountCollectionStatueApi,
  getPostTopApi,
  getCommentTopApi
} from '@service/account'
import arrow from '@/assets/arrow.png'
import comment from '@/assets/comment.png'
import forward from '@/assets/forward.png'
import textBg from '@/assets/text_bg.png'
import accountForward from '@/assets/account_forward.png'
import accountComment from '@/assets/account_comment.png'
import accountLike from '@/assets/account_like.png'
import accountPost from '@/assets/account_post.png'
import Header from '@/components/body/Header.vue'
import buttonCollect from '@/assets/btn-collect- selected.png'
import buttonUnCollect from '@/assets/btn-collect- default.png'
import buttonAdd from '@/assets/btn-add.png'
import titleImgSj from '@/assets/title-img-sj.png'
import titleImgNr from '@/assets/title-img-nr.png'
import trendingUp from '@/assets/trending_up.png'
import titleQs from '@/assets/title-img-qs.png'
import titleGl from '@/assets/title-gl.png'
import titleList from '@/assets/title-list.png'
import titleRmpl from '@/assets/title-rmpl.png'
import titleTwnr from '@/assets/title-twnr.png'
import iconMessage from '@/assets/icon-message.png'
import iconShare from '@/assets/icon-share.png'
import iconThumbs from '@/assets/icon-thumbs.png'
import iconParkMessage from '@/assets/iconPark-message-.png'
import iconParkShare from '@/assets/iconPark-share.png'
import iconParkThumbs from '@/assets/iconPark-thumbs.png'
import accountLogo from '@/assets/account_logo.png'
import '@/assets/font/SourceHanSansSC-Medium.otf'
import btnCancel from '@/assets/btn- cancel.png'
import btnAddSure from '@/assets/btn-add-sure.png'

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

// 定义局部颜色
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#F0A020',
    primaryColorHover: '#F0A020'
  }
}

const router = useRouter()

// 单击行实现信息跳转全网搜
const ClickToSearch = () => {
  router.push({
    path: `/search`
  })
}

// 单击行实现信息跳转搜账号
const ClickToUserSearch = () => {
  router.push({
    path: `/Leaderboard`
  })
}

// 是否显示自选框
const isShow = ref<boolean>(false)

// 处理添加请求
function handelClickAdd() {
  isShow.value = true
}

const accountId = ref<number>()

const collectionState = ref<number>()

// 日榜周榜切换 1:是日榜，2：是周榜
const dateList = ref<number>(1)

const dateListButtonStyle = ref<string>('warning')

const weeklyListButtonStyle = ref<string>('tertiary')

const xAxisData = ref()

const seriesData = ref()

const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

const postIndex = ref<string>('null')

const publishTime = ref<string>()

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
const textBgPng = textBg
const echartsSelect = ref<string>('article')

type Post = {
  recordId: number
  postId: string
  attitudes: number
  commentsCount: number
  repostsCount: number
  publishTime: string
  content: string
  commentUrl: string
  accountId: number
}
type PostData = {
  data: Post[]
}
const postData = reactive<PostData>({
  data: []
})

type Comment = {
  parentId: string
  collectTime: string
  commentId: string
  text: string
  author: string
  authorUrl: string
}
type CommentData = {
  data: Comment[]
}
const commentData = reactive<CommentData>({
  data: []
})

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
    tooltip: {
      trigger: 'axis'
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
        smooth: true,
        color: '#F78B32',
        itemStyle: { normal: { label: { show: true } } }
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
    dateList.value = typeButton
    findRecordCharsData(typeButton)
  } else if (typeButton === 2) {
    dateList.value = typeButton
    findRecordCharsData(typeButton)
  }
  findAccountByAccount(typeButton)
}

const AccountCollection = async () => {
  const accountCollectionId = accountId.value as number
  const userId = Number(localStorage.getItem('userId'))
  const res = await AccountCollectionApi(accountCollectionId, userId)
  collectionState.value = res.data as unknown as number
}

const accountCollectionStatue = async () => {
  const accountCollectionId = accountId.value as number
  const userId = Number(localStorage.getItem('userId'))
  const res = await accountCollectionStatueApi(accountCollectionId, userId)
  collectionState.value = res.data as unknown as number
}

const getPostTop = async (e: number) => {
  const res = await getPostTopApi(e)
  postData.data = res.data as Post[]
}

const getCommentTop = async (e: string) => {
  const res = await getCommentTopApi(e)
  commentData.data = res.data as Comment[]
}

const handleSelectPost = (e: string) => {
  const temp: any = e
  postIndex.value = temp.postId
  publishTime.value = temp.publishTime
  getCommentTop(temp.postId)
}

onMounted(() => {
  findRecordCharsData(1)
  findAccountByAccount(1)
  findRecordTotal(accountId.value as number)
  accountCollectionStatue()
  getPostTop(accountId.value as number)
  setTimeout(() => {
    if (postData.data.length > 0) {
      postIndex.value = postData.data[0].postId
      publishTime.value = postData.data[0].publishTime
      getCommentTop(postData.data[0].postId)
    }
  }, 1000)
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div style="background-color: #f2f6f7">
      <div>
        <Header />
        <div class="search">
          <img :src="accountLogo" alt="logo" />
          <div>
            <input placeholder="全网新媒体搜索引擎" @click="ClickToSearch" />
            <button class="button_1" @click="ClickToSearch">全网搜</button>
          </div>
          <button class="button_2" @click="ClickToUserSearch">搜账号</button>
        </div>

        <!--    页面上半部分-->
        <div class="box-card">
          <NGrid :cols="4" x-gap="24">
            <NGi>
              <div class="profile_picture">
                <NAvatar :size="140" :src="accountInfo.accountDetailInfo.accountPictureUrl" round>
                </NAvatar>
                <div v-if="collectionState === 2" class="box-collect">
                  <div>
                    <img
                      :src="buttonUnCollect"
                      alt="未收藏"
                      style="height: 54px; width: 100px"
                      @click="AccountCollection"
                    />
                  </div>

                  <div>
                    <img
                      :src="buttonAdd"
                      alt="加入自榜"
                      style="height: 27px; width: 110px"
                      @click="handelClickAdd"
                    />
                  </div>
                </div>
                <div v-else class="box-collect">
                  <div>
                    <img
                      :src="buttonCollect"
                      alt="已收藏"
                      style="height: 54px; width: 100px"
                      @click="AccountCollection"
                    />
                  </div>

                  <div>
                    <img
                      :src="buttonAdd"
                      alt="加入自榜"
                      style="height: 27px; width: 110px"
                      @click="handelClickAdd"
                    />
                  </div>
                </div>
              </div>
            </NGi>
            <NGi span="2">
              <div class="acc_body1">
                <text class="account_name">{{ accountInfo.accountDetailInfo.accountName }}</text>
              </div>
              <div class="acc_body2">
                <text class="text_brief_color">账号名称：</text>
                <text class="text_brief">{{ accountInfo.accountDetailInfo.accountName }}</text>
              </div>
              <div class="acc_body3">
                <text class="text_brief_color">个人简介：</text>
                <text class="text_brief">{{ accountInfo.accountDetailInfo.introduction }}</text>
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
              <div class="box">
                <n-button
                  round
                  quaternary
                  :class="dateList === 1 ? 'button_left_select' : 'button_left'"
                  @click="DateListButtonChange(1)"
                  :focusable="false"
                  >日榜</n-button
                >
                <n-button
                  round
                  quaternary
                  :class="dateList === 2 ? 'button_right_select' : 'button_right'"
                  @click="DateListButtonChange(2)"
                  :focusable="false"
                  >周榜</n-button
                >
              </div>
              <div class="score_body">
                <text class="text_exponential">888.8</text>

                <text class="text_exponential"> 分</text>
                <text v-if="dateList === 1" class="text_num"> /日潮汐指数</text>
                <text v-else-if="dateList === 2" class="text_num"> /周潮汐指数</text>
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
                  <img :src="titleImgSj" alt="账号数据" style="height: 39px; width: 140px" />
                  <h4 class="text_date">更新于{{ currentDate }}</h4>
                </div>
              </div>
            </NGi>
          </NGrid>

          <NDivider />

          <NGrid :cols="4" style="margin-bottom: 80px; margin-top: 80px" x-gap="24">
            <NGi class="body_center">
              <div class="center_text">
                <img :src="accountPost" alt="发帖数" />
                <div>
                  <text class="text_info1">发帖数</text>
                  <text class="text_info2">{{ accountInfo.recordTotal.recordArticleCount }}</text>
                  <text class="text_info3">
                    {{
                      accountInfo.accountDetailInfo.recordArticle === null
                        ? 0
                        : accountInfo.accountDetailInfo.recordArticle
                    }}
                    <img :src="trendingUp" class="active" alt="上升" />
                  </text>
                </div>
              </div>
            </NGi>

            <NGi class="body_center">
              <div class="center_text">
                <img :src="accountLike" alt="点赞数" />
                <div>
                  <text class="text_info1">评论数</text>
                  <text class="text_info2">{{ accountInfo.recordTotal.recordLikeCount }}</text>
                  <text class="text_info3">
                    {{
                      accountInfo.accountDetailInfo.recordLike === null
                        ? 0
                        : accountInfo.accountDetailInfo.recordLike
                    }}
                    <img :src="trendingUp" class="active" alt="上升" />
                  </text>
                </div>
              </div>
            </NGi>

            <NGi class="body_center">
              <div class="center_text">
                <img :src="accountComment" alt="评论数" />
                <div>
                  <text class="text_info1">评论数</text>
                  <text class="text_info2">{{ accountInfo.recordTotal.recordCommentCount }}</text>
                  <text class="text_info3">
                    {{
                      accountInfo.accountDetailInfo.recordComment === null
                        ? 0
                        : accountInfo.accountDetailInfo.recordComment
                    }}
                    <img :src="trendingUp" class="active" alt="上升" />
                  </text>
                </div>
              </div>
            </NGi>

            <NGi class="body_center">
              <div class="center_text">
                <img :src="accountForward" alt="转发数" />
                <div>
                  <text class="text_info1">转发数</text>
                  <text class="text_info2">{{ accountInfo.recordTotal.recordForwardCount }}</text>
                  <text class="text_info3">
                    {{
                      accountInfo.accountDetailInfo.recordForward === null
                        ? 0
                        : accountInfo.accountDetailInfo.recordForward
                    }}
                    <img :src="trendingUp" class="active" alt="上升" />
                  </text>
                </div>
              </div>
            </NGi>
          </NGrid>

          <!--      数据趋势-->
          <NGrid :cols="1" x-gap="24">
            <NGi>
              <div style="display: flex; align-items: center; margin-bottom: 10px">
                <img :src="titleQs" alt="数据趋势" style="height: 39px; width: 140px" />
                <h4 class="text_date">更新于{{ currentDate }}</h4>
              </div>
            </NGi>
          </NGrid>

          <NDivider />

          <NGrid :cols="1" x-gap="24">
            <NGi>
              <div class="card-echarts">
                <div class="button_body">
                  <NButton
                    focusable
                    :type="echartsSelect === 'article' ? 'warning' : 'default'"
                    class="button_1"
                    round
                    @click="handleEcharts('article')"
                    >发文数
                  </NButton>
                  <NButton
                    focusable
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

          <!--        账号内容-->
          <NGrid :cols="1" x-gap="24">
            <NGi>
              <div style="display: flex; align-items: center; margin-bottom: 30px">
                <img :src="titleImgNr" alt="账号内容" style="height: 39px; width: 140px" />
                <h4 class="text_date">更新于{{ currentDate }}</h4>
              </div>
            </NGi>
          </NGrid>

          <NDivider />

          <NGrid :cols="1" x-gap="24">
            <NGi>
              <div class="account_post">
                <!--              帖子列表-->
                <div class="post_list">
                  <div style="display: flex; align-items: center">
                    <img :src="titleList" alt="最新贴文列表" style="width: 150px; height: 31px" />
                  </div>
                  <NCard
                    v-for="(item, index) in postData.data"
                    :key="index"
                    :bordered="false"
                    style="padding: 0"
                    size="small"
                  >
                    <div
                      class="list_content"
                      :class="[item.postId === postIndex ? 'select' : '']"
                      @click="handleSelectPost(item)"
                    >
                      <div class="content_text">{{ item.content }}</div>
                      <div class="content_data">
                        <div>
                          <img v-if="item.postId === postIndex" :src="iconParkThumbs" alt="点赞" />
                          <img v-else :src="iconThumbs" />
                          <span>{{ item.attitudes }}</span>
                        </div>

                        <div>
                          <img v-if="item.postId === postIndex" :src="iconParkMessage" alt="评论" />
                          <img v-else :src="iconMessage" />
                          <span>{{ item.commentsCount }}</span>
                        </div>

                        <div>
                          <img v-if="item.postId === postIndex" :src="iconParkShare" alt="点赞" />
                          <img v-else :src="iconShare" />
                          <span>{{ item.repostsCount }}</span>
                        </div>
                      </div>
                    </div>
                  </NCard>
                </div>
                <!--              帖子详情-->
                <div
                  class="post_detail"
                  v-for="(item, index) in postData.data"
                  :key="index"
                  :class="[item.postId !== postIndex ? 'none' : '']"
                >
                  <template v-if="item.postId === postIndex">
                    <div style="display: flex; align-items: center; margin-bottom: 30px">
                      <img :src="titleGl" alt="传播概览" style="width: 120px; height: 30px" />
                    </div>

                    <div class="detail_info">
                      <div class="content_data">
                        <div>
                          <div>
                            <img :src="iconThumbs" />
                            <span>点赞数</span>
                          </div>
                          <span>{{ item.attitudes }}</span>
                        </div>

                        <div>
                          <div>
                            <img :src="iconMessage" />
                            <span>评论数</span>
                          </div>
                          <span>{{ item.commentsCount }}</span>
                        </div>

                        <div>
                          <div>
                            <img :src="iconShare" />
                            <span>转发数</span>
                          </div>
                          <span>{{ item.repostsCount }}</span>
                        </div>
                      </div>
                    </div>

                    <NDivider />

                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-top: 20px;
                        margin-bottom: 30px;
                      "
                    >
                      <img :src="titleTwnr" alt="帖文内容" style="width: 120px; height: 30px" />
                    </div>

                    <div class="detail_content">
                      <NCard :bordered="false">
                        <div class="flexrow">
                          <NAvatar :src="accountInfo.accountDetailInfo.accountPictureUrl" round>
                          </NAvatar>
                          <div class="flexcolumn">
                            <span class="text1">{{
                              accountInfo.accountDetailInfo.accountName
                            }}</span>
                            <span class="text2">{{ publishTime }}</span>
                          </div>
                        </div>
                        <div class="content">{{ item.content }}</div>
                      </NCard>
                    </div>

                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-top: 30px;
                        margin-bottom: 10px;
                      "
                    >
                      <img :src="titleRmpl" alt="热门评论" style="width: 120px; height: 30px" />
                    </div>

                    <div class="detail_comment">
                      <NCard
                        v-for="(item1, index) in commentData.data"
                        :key="index"
                        :bordered="false"
                      >
                        <div class="flexrow">
                          <div class="content">
                            <div class="info">
                              <NAvatar :size="35" src="" round style="flex-shrink: 0"></NAvatar>
                              <span class="text1">{{ item1.author }}</span>
                            </div>
                            <span class="text2">{{ item1.text }}</span>
                          </div>
                          <div class="icon">
                            <NIcon :component="Heart" size="20" color="rgb(176, 176, 176)"></NIcon>
                            <span>0</span>
                          </div>
                        </div>
                      </NCard>
                    </div>
                  </template>
                </div>
              </div>
            </NGi>
          </NGrid>
        </div>
      </div>
      <!--      加入自选弹出框-->
      <vxe-modal
        v-model="isShow"
        destroy-on-close
        height="230"
        min-height="900"
        min-width="900"
        resize
        title="我的榜单列表"
        width="340"
      >
        <template #default>
          <div>
            <div>
              <img
                :src="btnCancel"
                class="button_left"
                @click="isShow = false"
                style="height: 33px; width: 110px"
              />
              <img
                :src="btnAddSure"
                class="button_right"
                @click="insertEvent()"
                style="height: 45px; width: 125px; margin-bottom: -5px"
              />
            </div>
          </div>
        </template>
      </vxe-modal>
    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.account_post {
  display: flex;
  flex-direction: row;
  padding-left: 40px;

  .select {
    background: rgba(140, 141, 144, 0.07);
    padding: 10px !important;
    border-radius: 10px;
    .content_text {
      color: rgba(249, 167, 101, 100) !important;
    }
    .content_data {
      div {
        span {
          color: rgba(249, 167, 101, 100) !important;
        }
      }
    }
  }

  .none {
    display: none !important;
  }

  .post_list {
    width: 300px;
    margin-top: 20px;
    box-shadow: 10px 0 15px -8px rgba(244, 166, 105, 0.4);
    border-radius: 20px;

    .text_italic {
      font-size: 15px;
    }

    .list_content {
      display: flex;
      flex-direction: column;
      padding: 10px;

      cursor: pointer;

      .content_text {
      }

      .content_data {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        margin-top: 20px;

        div {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            flex-direction: column;
          }
          img {
            width: 20px;
            height: auto;
          }
          span {
            color: rgba(176, 176, 176, 100);
            font-size: 12px;
            margin-left: 5px;
          }
        }
      }
    }

    .list_content:hover {
      opacity: 0.7;
    }
  }

  .post_detail {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 40px;
    margin-top: 30px;

    .text_italic {
      font-size: 15px;
    }

    .detail_info {
      .content_data {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        div {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              flex-direction: column;
            }
            img {
              width: 20px;
              height: auto;
            }

            span {
              font-size: 15px;
              color: rgba(176, 176, 176, 100);
              margin-left: 10px;
            }
          }

          span {
            font-size: 25px;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }
        }
      }
    }

    .detail_content {
      .flexrow {
        display: flex;
        flex-direction: row;
        align-items: center;
        .flexcolumn {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          .text1 {
            color: rgba(63, 63, 70, 100);
            font-size: 16px;
          }
          .text2 {
            color: rgba(176, 176, 176, 100);
            font-size: 12px;
          }
        }
      }
      .content {
        margin-top: 20px;
        font-size: 14px;
        line-height: 25px;
      }
    }

    .detail_comment {
      .flexrow {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .content {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          .info {
            display: flex;
            flex-direction: row;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            .text1 {
              margin-left: 5px;
              color: rgba(176, 176, 176, 100);
              font-weight: 400;
              font-size: 18px;
              flex-shrink: 0;
            }
          }

          .text2 {
            margin-left: 20px;
            color: rgba(63, 63, 70, 100);
            font-size: 14px;
          }
        }
        .icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          span {
            margin-left: 5px;
          }
        }
      }
    }
  }
}

.search {
  background-color: white;
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    height: 42px;
    width: 244px;
    margin-left: -250px;
  }

  div {
    display: inline-block;

    input {
      border-color: #7896e1;
      border-style: solid;
      border-width: 1px;
      border-radius: 10px;
      height: 40px;
      width: 600px;

      margin-left: 100px;
    }
    .button_1 {
      margin-left: -99px;
      border-color: #7896e1;
      border-width: 2px;
      border-style: solid;
      border-radius: 0 10px 10px 0;
      height: 43px;
      width: 100px;
      color: white;
      background: #7896e1;
      outline: none;
      font-weight: 500;
    }
  }

  .button_2 {
    border-color: #7896e1;
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    height: 42px;
    width: 100px;
    color: #7896e1;
    background: white;
    outline: none;
    font-weight: 500;
    margin-left: 60px;
  }
}

.box-card {
  background-color: white;
  width: 86%;
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 30px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 2px 22px 5px rgba(17, 54, 145, 0.12);
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
    width: 96vw;
    padding: 5vw 1vw;
  }

  .text_date {
    color: rgba(176, 176, 176, 100);
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin-left: 2vw;
    }
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
        color: rgba(176, 176, 176, 100);
        font-size: 13px;
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
    margin-top: 20px;
    margin-bottom: 30px;
    padding-left: 40px;

    .echarts-content {
      margin-left: 100px;
      width: 900px;
      height: 450px;
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
  display: flex;
  flex-direction: row;

  .center_text {
    display: flex;
    flex-direction: row;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 100px;
      height: 100px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 10vw;
        height: 10vw;
      }
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .text_info1 {
        color: rgba(11, 12, 20, 0.47) !important;
        font-size: 18px;
        font-weight: normal;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
      }

      .text_info2 {
        color: rgba(63, 63, 70, 100);
        font-size: 26px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          margin-left: 0;
        }
      }

      .text_info3 {
        color: rgba(120, 150, 225, 100);
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
        .active {
          width: auto;
          height: 20px;
          margin-left: 5px;
        }
        .none {
          display: none;
        }
      }
    }
  }

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
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 3px;

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
  font-weight: 500;
  color: #bbbaba;
}

.text_brief {
  color: rgba(33, 41, 66, 100);
  font-size: 15px;
}

.text_brief_info {
  color: rgba(33, 41, 66, 100);
  font-size: 21px;
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
  padding: 80px 50px 50px 50px;
  text-align: center;
  justify-content: center;
  box-shadow: 10px 0 15px -8px rgba(244, 166, 105, 0.27);
  border-radius: 20px;
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
  margin: 30px 10px 10px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 1vw;
  }
}

.acc_body3 {
  margin: 10px 10px 40px;
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
.box {
  margin-left: calc(40%);
  border-color: #f78b32;
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  width: 118px;
  background: #faf8f8;

  .button_left_select {
    color: #f78b32;
    outline: none;
    background: white;
    box-shadow: 10px 0 15px -8px rgba(244, 166, 105, 0.4);
  }

  .button_left {
    color: #f8c499;
    outline: none;
  }
  .button_right_select {
    color: #f78b32;
    outline: none;
    background: white;
    box-shadow: -10px 0 15px -8px rgba(244, 166, 105, 0.4);
    margin-left: -10px;
  }

  .button_right {
    color: #f8c499;
    outline: none;
    margin-left: -10px;
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
  color: rgba(33, 41, 66, 100);
  font-size: 25px;
  font-weight: 600;
  font-family: 'SourceHanSansSC-Medium';
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

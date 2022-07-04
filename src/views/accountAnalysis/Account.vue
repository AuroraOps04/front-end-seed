<script lang='ts' setup>
import {onMounted,ref,reactive} from 'vue'
import arrow from '@/assets/arrow.png'
import up from '@/assets/up.png'
import comment from '@/assets/comment.png'
import forward from '@/assets/forward.png'
import write from '@/assets/write.png'
import text_bg from '@/assets/text_bg.png'
import {useRouter} from "vue-router";
import {findAccountByAccountApi,findRecordTotalApi} from '@/service/account'
import {NButton, NAvatar, NGrid, NGi, NDivider, NIcon,NButtonGroup} from 'naive-ui'
import moment from 'moment';
import 'moment/locale/pt-br';
import * as echarts from "echarts";

const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value
onMounted(
  () => {
    init()
  }
)
const xAxisData = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
const seriesData = ref([820, 932, 901, 934, 1290, 1330, 1320])

function init() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  var option = {
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
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

const router = useRouter();
// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或者方法
/*let internalInstance = getCurrentInstance()
let echarts = internalInstance!.appContext.config.globalProperties.$echarts
const handleBack = () => {
  router.push("/home")
}*/

let date = new Date()
const accountId = ref<number>()

//日榜周榜切换 1:是日榜，2：是周榜
const dateList = ref<number>(1)

const dateListButtonStyle = ref<string>("warning")

const weeklyListButtonStyle = ref<string>("tertiary")

type accountObject = {
  accountId:number,
  accountName:string | null,
  accountPictureUrl:string | null,
  areaName:string | null,
  categoryName:string | null,
  createdAt:string | null,
  deletedAt:number | null,
  introduction:string | null,
  platformName:string | null,
  recordArticle:number | null,
  recordComment:number | null,
  recordFan:number | null,
  recordForward:number | null,
  recordLike:number | null,
  updatedAt:string | null
}

type recordObject = {
  recordArticleCount:number,
  recordLikeCount:number,
  recordCommentCount:number,
  recordForwardCount:number,
}

const accountQuery = reactive<API.AccountQueryParams>({
  accountId: accountId.value,
  startTime: '',
  endTime: ''
})

onMounted(()=>{
  accountId.value = Number(router.currentRoute.value.params.accountId)
  findAccountByAccount(1)
  findRecordTotal()
})

const accountInfo = reactive({
  accountDetailInfo:{},
  recordTotal:{}
})

//根据账户id获取账户信息
const findAccountByAccount = async(dateListType:number)=>{
  debugger
  let startTimeItem = new Date(date.getTime());
  let endTimeItem = new Date(startTimeItem.getTime() - 24*60*60*1000*7 );
  accountQuery.accountId = accountId.value
  //默认日榜
  if (dateListType === 1){
    accountQuery.startTime = moment(startTimeItem).format("YYYY-MM-DD")
    accountQuery.endTime = moment(startTimeItem).format("YYYY-MM-DD")
  }else{
    accountQuery.startTime = moment(endTimeItem).format("YYYY-MM-DD")
    accountQuery.endTime = moment(startTimeItem).format("YYYY-MM-DD")
  }
  const res = await findAccountByAccountApi(accountQuery)
  accountInfo.accountDetailInfo = res.data as accountObject
}

const findRecordTotal = async()=>{
  const res = await findRecordTotalApi();
  accountInfo.recordTotal = res.data as recordObject

}
// onMounted(() => {
//   const dom = document.getElementById('myChart')
//   const myChart = echarts.init(dom) // 初始化echarts实例
//   const option = {
//     xAxis: {
//       type: 'category',
//       data: ['05.23~05.29', '05.30~06.05', '06.06~06.12', '06.13~06.19']
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: [12, 7, 25, 22, 27],
//         type: 'line',
//         smooth: true
//       }
//     ]
//   }
//   myChart.setOption(option);
// })

const getDate = () => {
  const date = new Date()
  // let year = date.getFullYear()
  let month = (date.getMonth() + 1)
  let day = date.getDate()

  // day = day < 10 ? "0" + day : day; //day小于10，加0
  return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}
// 设置实例参数
const currentDate = getDate()
const arrowpng = arrow
const writePng = write
const commentPng = comment
const forwardPng = forward
const upPng = up
const text_bgPng = text_bg

function DateListButtonChange(typeButton:number){
  if (typeButton === 1){
    dateListButtonStyle.value = "warning"
    weeklyListButtonStyle.value = "tertiary"
    dateList.value = typeButton
  }else if(typeButton === 2){
    weeklyListButtonStyle.value = "warning"
    dateListButtonStyle.value = "tertiary"
    dateList.value = typeButton
  }
  findAccountByAccount(typeButton)
}
const echartsSelect = ref('article')
const handleEcharts = (type: string) => {
  if (type === 'article') {
    xAxisData.value = ['Mon1', 'Tue1', 'Wed2', 'Thu3', 'Fri', 'Sat', 'Sun']
    seriesData.value = [3, 5, 2, 1, 3, 3, 2]
  }
  if (type === 'like') {
    xAxisData.value = ['Mon1', 'Tue1', 'Wed2', 'Thu3', 'Fri', 'Sat', 'Sun']
    seriesData.value = [3, 6, 2, 6, 12, 3, 8]

  }
  if (type === 'comment') {
    xAxisData.value = ['Mon1', 'Tue1', 'Wed2', 'Thu3', 'Fri', 'Sat', 'Sun']
    seriesData.value = [8, 4, 3, 4, 2, 6, 8]

  }
  if (type === 'forward') {
    xAxisData.value = ['Mon1', 'Tue1', 'Wed2', 'Thu3', 'Fri', 'Sat', 'Sun']
    seriesData.value = [1, 3, 6, 2, 3, 1, 1]
  }

  echartsSelect.value = type
  main.value.removeAttribute('_echarts_instance_')
  init();
}
</script>

<template>

  <div>
<!--    <span class="back" @click="handleBack">返回</span>-->
    <!--    页面上半部分-->
    <div class='box-card'>
      <n-grid x-gap="24" :cols="4">
        <n-gi>
          <div class='profile_picture'>

            <n-avatar
              round
              :size="220"
            >
              {{accountInfo.accountDetailInfo.accountPictureUrl}}
            </n-avatar>
            <div style='padding: 30px'>
              <N-button type='warning' ghost class='button_collection'>
                <template #icon>
                  <n-icon>
                    <log-in-icon/>
                  </n-icon>
                </template>
                收藏
              </N-button>
            </div>


          </div>
        </n-gi>
        <n-gi span="2">
          <div class='acc_body1'>
            <text class='account_name'>账号名称</text>
          </div>
          <div class='acc_body2'>
            <text class='text_brief_color'>账号名称：</text>
            <text class>{{accountInfo.accountDetailInfo.accountName}}</text>

          </div>
          <div class='acc_body3'>
            <text class='text_brief_color'>个人简介：</text>
            <text class>{{accountInfo.accountDetailInfo.introduction}}</text>

          </div>
          <n-divider/>
          <div class='acc_body4'>
            <n-grid x-gap="24" :cols="3">

              <n-gi>
                <div class='profile_info'>
                  <text class='text_brief_color'>分类</text>
                  <text class='text_brief_info'>{{accountInfo.accountDetailInfo.categoryName}}</text>
                </div>
              </n-gi>

              <n-gi>
                <div class='profile_info'>
                  <text class='text_brief_color'>地区</text>
                  <text class='text_brief_info'>{{accountInfo.accountDetailInfo.areaName}}</text>
                </div>
              </n-gi>

              <n-gi>
                <div class='profile_info'>
                  <text class='text_brief_color'>粉丝数</text>
                  <text class='text_brief_info'>{{accountInfo.accountDetailInfo.recordFan}}</text>

                </div>
              </n-gi>
            </n-grid>


          </div>
        </n-gi>

        <n-gi>
          <div class='score_body'>
            <text class='text_exponential'>888.8</text>

            <text class='text_exponential'> 分</text>
            <text class='text_num'> /周潮汐指数</text>

          </div>

          <div class='rank_body'>
            <text class='rank'>NO.</text>
            <text class='rank'>1</text>
            <text class='rank_area'>两岸>周榜</text>
          </div>
        </n-gi>
      </n-grid>


    </div>

  </div>

  <div>

    <!--    页面下半部分-->
    <div class='box-card'>


      <!--      账号数据标题-->
      <n-grid x-gap="24" :cols="6">
        <n-gi>
          <div>
            <h2 class='text_italic text_first_label'>账号数据</h2>
            <img :src='text_bgPng' class='img_bg' alt="账号数据">
          </div>
        </n-gi>
        <n-gi span='4'>
          <div class='data_body'>
            <h5 class='text_date'>更新于{{ currentDate }}</h5>
          </div>
        </n-gi>


        <n-gi>
          <div class='center'>

            <n-button-group>
              <n-button plain :type="dateListButtonStyle" round @click="DateListButtonChange(1)">日榜</n-button>
              <n-button plain :type="weeklyListButtonStyle" round @click="DateListButtonChange(2)">周榜</n-button>
            </n-button-group>

          </div>
        </n-gi>
      </n-grid>


      <!--      榜单排行-->
      <n-grid x-gap="24" :cols="5" style='margin-bottom: 20px'>
        <n-gi>
          <div style='display: flex;align-items: center'>
            <text class='text_italic text_second_label'>榜单排行</text>
            <img :src='arrowpng' class='img_arrow' alt="榜单排行"/>

          </div>
        </n-gi>

      </n-grid>

      <n-grid x-gap="24" :cols="2" style='margin-bottom: 80px'>
        <n-gi>
          <div class='score_body2'>
            <text class='text_exponential2'>888.8</text>

            <text class='text_exponential2'> 分</text>
            <text class='text_num'> /周潮汐指数</text>

          </div>
          <div class='rank_body2'>
            <text class='rank'>NO.</text>
            <text class='rank'>1</text>
            <text class='rank_area'>两岸>周榜</text>
          </div>
        </n-gi>

        <n-gi>

        </n-gi>

      </n-grid>

      <n-divider/>


      <!--      互动数据-->
      <n-grid x-gap="24" :cols="5" style='margin-bottom: 80px'>
        <n-gi>
          <div style='display: flex;align-items: center'>
            <text class='text_italic text_second_label'>互动数据</text>
            <img :src='arrowpng' class='img_arrow' alt="互动数据"/>

          </div>
        </n-gi>

      </n-grid>

      <n-grid x-gap="24" :cols="4" style='margin-bottom: 80px'>
        <n-gi class='body_center'>
          <div>
            <text class='text_info1'>{{accountInfo.accountDetailInfo.recordArticle === null ? 0 : accountInfo.accountDetailInfo.recordArticle}}</text>
            <text class='text_info2'>/{{accountInfo.recordTotal.recordArticleCount}}</text>
          </div>
          <div>
            <img :src='writePng' class='img_arrow' alt="发文数"/>
            <text class='text_info'>发文数</text>
          </div>

        </n-gi>
        <n-gi class='body_center'>
          <div>
            <text class='text_info1'>{{accountInfo.accountDetailInfo.recordLike === null ? 0:accountInfo.accountDetailInfo.recordLike }}</text>
            <text class='text_info2'>/{{accountInfo.recordTotal.recordLikeCount}}</text>
          </div>
          <div>
            <img :src='upPng' class='img_arrow' alt="点赞数"/>
            <text class='text_info'>点赞数</text>
          </div>

        </n-gi>
        <n-gi class='body_center'>
          <div>
            <text class='text_info1'>{{accountInfo.accountDetailInfo.recordComment === null ? 0: accountInfo.accountDetailInfo.recordComment}}</text>
            <text class='text_info2'>/{{accountInfo.recordTotal.recordCommentCount}}</text>
          </div>
          <div>
            <img :src='commentPng' class='img_arrow' alt="评论数"/>
            <text class='text_info'>评论数</text>
          </div>

        </n-gi>
        <n-gi class='body_center'>
          <div>
            <text class='text_info1'>{{accountInfo.accountDetailInfo.recordForward === null?0:accountInfo.accountDetailInfo.recordForward}}</text>
            <text class='text_info2'>/{{accountInfo.recordTotal.recordForwardCount}}</text>
          </div>
          <div>
            <img :src='forwardPng' class='img_arrow' alt="转发数"/>
            <text class='text_info'>转发数</text>
          </div>

        </n-gi>

      </n-grid>

      <n-divider/>


      <!--      数据趋势-->
      <n-grid x-gap="24" :cols="5">
        <n-gi>
          <div style='display: flex;align-items: center'>
            <text class='text_italic text_second_label'>数据趋势</text>
            <img :src='arrowpng' class='img_arrow' alt="数据趋势"/>

          </div>
        </n-gi>
      </n-grid>

      <n-grid x-gap="24" :cols="3">
        <n-gi>
          <div class='button_body '>

            <n-button class='button_1' round :type="echartsSelect==='article'?'warning':'default'"
                      @click="handleEcharts('article')">发文数
            </n-button>
            <n-button class='button_1' round :type="echartsSelect==='like'?'warning':'default'"
                      @click="handleEcharts('like')">点赞数
            </n-button>
            <n-button class='button_1' round :type="echartsSelect==='comment'?'warning':'default'"
                      @click="handleEcharts('comment')">评论数
            </n-button>
            <n-button class='button_1' round :type="echartsSelect==='forward'?'warning':'default'"
                      @click="handleEcharts('forward')">转发数
            </n-button>

          </div>
        </n-gi>
        <n-gi>
          <!--          <div-->
          <!--            ref='myChart'-->
          <!--            id='myChart'-->
          <!--            :style="{ width: '700px', height: '350px' }"-->
          <!--          ></div>-->
          <div ref="main" style="width: 700px; height: 350px"></div>
        </n-gi>
        <n-gi>

        </n-gi>
      </n-grid>

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


}


.rank_area {
  margin: 10px;
  color: #BDC7DF;
  font-size: 15px;
}

.body_center {
  text-align: center;
  justify-content: center;
}

.text_italic {
  font-style: italic;

}

.text_first_label {
  margin: 25px;
}

.text_second_label {
  margin-top: 5px;
  margin-left: 40px;
  margin-right: 18px;
  font-size: 18px;
  font-weight: 600;


}


.text_info {
  color: #8C8D90;
  font-size: 15px;
  margin-left: 5px;
}

.text_info1 {
  color: #3F3F46;
  font-size: 28px;
  font-weight: 600;
}

.text_info2 {
  color: #BDC7DF;
  font-size: 20px;
  margin-left: 5px;
}


.text_num {
  font-size: 8px;
  font-weight: 600;

}

.text_date {

  color: rgba(17, 54, 145, 58);
  font-size: 8px;
  text-align: left;
}


.text_exponential {
  color: rgba(17, 54, 145, 58);
  font-size: 32px;
  font-weight: 700;

}

.text_exponential2 {
  color: rgba(17, 54, 145, 58);
  font-size: 28px;

}

.text_brief_color {
  color: #BBBABA;

}

.text_brief_info {
  font-size: 20px;
}

.data_body {
  margin-top: 40px;
  margin-left: -70px;
}

.button_collection {
  margin-left: 15%;
}

.button_1 {
  width: 120px;
  margin: 10px;
}

.button_body {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 80px;

  text-align: center;
  justify-content: center;

}

.acc_body1 {
  margin-top: 15px;
}

.acc_body2 {
  margin: 10px;

}

.acc_body3 {
  margin: 10px;

}

.acc_body4 {
  margin: 10px;

}


.text_info_title {
  color: #BBD1E9;
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
}

.score_body2 {
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
}

.account_name {
  font-size: 25px;
  font-weight: 600;

}

.center {
  justify-content: center;
  text-align: center;
}

.img_bg {
  height: 14px;
  width: 144px;
  position: absolute;
  left: 117px;
  top: 610px;
}

.img_arrow {
  width: 20px;
  height: 20px;
  margin-top: 10px
}

</style>




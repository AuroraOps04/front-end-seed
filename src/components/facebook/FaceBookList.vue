<script lang="ts" setup>
  import {onMounted, reactive, ref,watch,defineExpose} from 'vue'
  import {VxeButtonEvents, VxePagerEvents, VxeTableInstance} from 'vxe-table'
  // import { NButton,NAvatar }  from 'naive-ui'
  import {listAccountByPageApi,findAllCategoryApi,findAreaApi} from '@/service/account'
  import moment from 'moment';
  import 'moment/locale/pt-br';
  onMounted(()=>{
    findAccountSelectPage(accountName.value)
    getTime()
    findAllCategory()
    findAllArea()
    getNearly7Day()
    getWeekDate()
    getMonthDate()
  })

  type TideDataType = {
    tableData: {
      accountId:number,
      accountName:string,
      recordFan:number,
      recordArticle:number,
      accountPictureUrl:string,
      recordLike:number,
      recordComment:number,
      recordForward:number,
      createdAt:string,
      updatedAt:string,
      deletedAt:number,
    },
    tablePage: {
      total: number
    },
    // dailyList: string[]
  }

  //日榜类
  class dateObject{
    id: number | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    date: string | undefined;
    constructor(id:number,startTime:string,endTime:string,date:string){
      this.id = id
      this.startTime = startTime
      this.endTime = endTime
      this.date = date
    }
  }
  //周榜类
  class weekDateObject{
    id: number | undefined;
    startTime: string | undefined;
    endTime: string |undefined;
    date:string | undefined;
    constructor(id:number,startTime:string,endTime:string,date:string){
      this.id = id
      this.startTime = startTime
      this.endTime = endTime
      this.date = date
    }
  }
  //月榜类
  class monthDateObject{
    id: number | undefined;
    startTime: string | undefined;
    endTime: string |undefined;
    date:string | undefined;
    constructor(id:number,startTime:string,endTime:string,date:string){
      this.id = id
      this.startTime = startTime
      this.endTime = endTime
      this.date = date
    }
  }

  //日榜周榜月榜选项 1：日榜 2：周榜 3：月榜
  const dateList = ref<number>(1)
  //搜索账号条件
  const accountName = ref<string>('')
  //TODO
  const dateChangeTable = ref<number>(1);
  watch(dateList,(newValue: number, oldValue: any)=>{
    if (newValue == 1){
      dateChangeTable.value = 1
    }else if (newValue == 2){
      dateChangeTable.value = 2
    }else {
      dateChangeTable.value = 3
    }
  })

  const tideData = reactive({
    //表格数据
    tableData: [],
    //分页数据
    tablePage: {
      total: 0,
      currentPage: 1,
      pageSize: 10
    },
    //分类列表
    cateGory:[],
    //地区列表
    area:[],
    currentDate: '',
    //地区分类选项绑定
    option:{
      category: '',
      area: '',
    },
    //日榜列表
    dailyList:[],
    //周榜列表
    weeklyList:[],
    //月榜列表
    monthlyList:[]
  })
  //默认时间榜单
  const optionDateTime = reactive({
    defaultDailyTime:[],
    defaultWeeklyTime:[],
    defaultMonthlyTime:[],
  })

  //查询数据的条件参数
  const params = reactive<API.AccountParams & API.PageParams>({
    pageSize: tideData.tablePage.pageSize,
    page: tideData.tablePage.currentPage,
    area:'',
    category:'',
    platform:'',
    accountName:'',
    startTime:'',
    endTime:''
  })

  //分页查询所有数据
  const findAccountSelectPage = async (accountName:string) => {
    params.accountName = accountName
    const res = await listAccountByPageApi(params)
    // tideData.tableData = (res.data! as any).data
    tideData.tableData = res.data! as any
    tideData.tablePage.total = res.count! as any
  }

  //查询所有地区
  const findAllArea = async()=>{
    const res = await findAreaApi(null);
    tideData.area = res.data as any
  }

  //查询所有分类
  const findAllCategory = async () => {
    const res = await findAllCategoryApi(null)
    tideData.cateGory = res.data as any
  }

  //下拉时间选项
  function changeDate(event:any){
    params.startTime = event.value.startTime
    params.endTime = event.value.endTime
    findAccountSelectPage(accountName.value)
  }

  //地区下拉选项
  function changeArea(event:any){
    params.area = event.value
    findAccountSelectPage(accountName.value)
  }

  //分类下拉选项
  function changeCategory(event:any){
    params.category = event.value
    findAccountSelectPage(accountName.value)
  }

  // 获取时间接口
  const getTime = async () => {
    let myDate = new Date()
    let month = (myDate.getMonth() + 1).toString().padStart(2, '0')
    let day = myDate.getDate().toString().padStart(2, '0')
    tideData.currentDate = myDate.getFullYear() + '年' + month + '月' + day + '日'
  }

  //获取最近3个月的时间
  const getMonthDate = async() =>{
    let date = new Date()
    for(let i =0;i<=2;i++){
      const nowMonthFirst = getNowMonthFirst(date);
      const nowMonthLast = getNowMonthLast(date);
      let monthDateTime = date.getTime()
      let startDateTime = new Date(monthDateTime)
      let y = startDateTime.getFullYear() //获取年份
      let m = startDateTime.getMonth() + 1 //获取月份js月份从0开始，需要+1
      m = addDate0(m)
      let dateTime = y + '年' + m + '月'
      let monthlyList = new monthDateObject(i,moment(nowMonthFirst.getTime()).format("YYYY-MM-DD"),moment(nowMonthLast.getTime()).format("YYYY-MM-DD"),dateTime)
      tideData.monthlyList.push(monthlyList as never)
      date.setMonth(date.getMonth() - 1)
    }
  }
  //获取本月第一天
  const getNowMonthFirst = (date:any) => {
    date.setDate(1)
    return date
  }

  //获取本月最后一天
  const getNowMonthLast = (date:any) => {
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return endDate
  }

  //获取周榜
  const getWeekDate = async() =>{
    let date = new Date()
    for(let i =0;i<3;i++){
      //当前时间
      let startTimeItem = new Date(date.getTime());
      let endTimeItem = new Date(startTimeItem.getTime() - 24*60*60*1000*7 );
      date = endTimeItem
      let ey = endTimeItem.getFullYear() //获取年份
      let em = endTimeItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
      let ed = endTimeItem.getDate() //获取日期
      let sy = startTimeItem.getFullYear() //获取年份
      let sm = startTimeItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
      let sd = startTimeItem.getDate() //获取日期
      em = addDate0(em) //给为单数的月份补零
      ed = addDate0(ed) //给为单数的日期补零
      sm = addDate0(sm) //给为单数的月份补零
      sd = addDate0(sd) //给为单数的日期补零
      let dateTime = ey + '年' + em + '月' + ed + '日' + '-' + sy + '年' + sm + '月' + sd + '日'
      let weeklyList = new weekDateObject(i,moment(endTimeItem).format("YYYY-MM-DD"),moment(startTimeItem).format("YYYY-MM-DD"),dateTime)
      tideData.weeklyList.push(weeklyList as never)
    }
    // optionDateTime.defaultWeeklyTime = tideData.dailyList[0]
  }

  //获取最近7天的时间
  const getNearly7Day = async () =>  {
    let date = new Date()
    for (let i = 0; i <= 24 * 6; i += 24) {
      //今天加上前6天
      let dateItem = new Date(date.getTime() - i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
      let endDateItem = new Date(date.getTime() - i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
      let y = dateItem.getFullYear() //获取年份
      let m = dateItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
      let d = dateItem.getDate() //获取日期
      let h = dateItem.getHours() //获取小时
      let dm = dateItem.getMinutes()//获取分钟
      let s = dateItem.getSeconds();//获取秒
      m = addDate0(m) //给为单数的月份补零
      d = addDate0(d) //给为单数的日期补零
      let valueItem = y + '年' + m + '月' + d + '日' //组合
      let dateTime = y + '-' + m + '-' + d + ''+ h + ':' + dm + ':' + s  //组合
      let dateList = new dateObject(i,moment(dateItem).format("YYYY-MM-DD"),moment(endDateItem).format("YYYY-MM-DD"),valueItem);
      tideData.dailyList.push(dateList as never)
    }
    // optionDateTime.defaultDailyTime = tideData.dailyList[0]
  }

  //给日期加0
  function addDate0(time:any) {
    if (time.toString().length == 1) {
      time = '0' + time.toString()
    }
    return time
  }

  //下拉过滤TODO
  function regionDropDown(searchValue: any, option: any, group: any) {
  }
  //分页
  const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
    params.page = currentPage
    params.pageSize = pageSize
    findAccountSelectPage(accountName.value)
  }

  //表格数据
  const xTable: any = ref<VxeTableInstance>()

  // 导出当前页
  const exportCurrentPage: VxeButtonEvents.Click = () => {
    const $table = xTable.value
    $table.exportData({
      filename: 'FackBook榜单',
      type: 'csv',
      isHeader: true,
      isFooter: true
    })
  }

  function receiveParametersMethods(accountNameProp:string){
    accountName.value = accountNameProp
    findAccountSelectPage(accountName.value)

  }

  defineExpose({receiveParametersMethods})
</script>
<template>
  <div class="faceBookBackground-border">
    <!--    图片显示器-->
    <vxe-toolbar>
      <template #buttons>
        <div class="faceBookBackgroundLeft">
          <div class="faceBookBackground">
            <p>
              FaceBook&nbsp;榜&nbsp;单
            </p>
          </div>
          <div class="tideDataTime">
            <span>截止日期:{{tideData.currentDate}}</span>
          </div>
        </div>
      </template>
    </vxe-toolbar>
    <!--    工具框-->
    <vxe-toolbar>
      <template #buttons>
        <div class="radioLeft">
          <vxe-radio-group v-model="dateList">
            <vxe-radio-button label="1" content="日榜"></vxe-radio-button>
            <vxe-radio-button label="2" content="周榜"></vxe-radio-button>
            <vxe-radio-button label="3" content="月榜"></vxe-radio-button>
          </vxe-radio-group>
        </div>
        <div style="margin-left:25px">
          <!--日榜-->
          <p v-if="dateList == 1">
            <vxe-select v-model="optionDateTime.defaultDailyTime.date" placeholder="选择时间" @change="changeDate($event)" filterable>
              <vxe-option v-for="daily in tideData.dailyList" :key="daily.id" :value="daily" :label="daily.date"></vxe-option>
            </vxe-select>
          </p>
          <!--周榜-->
          <p v-if="dateList == 2">
            <vxe-select v-model="optionDateTime.defaultWeeklyTime.date" placeholder="选择时间" @change="changeDate($event)" filterable>
              <vxe-option v-for="weekly in tideData.weeklyList" :key="weekly.id" :value="weekly" :label="weekly.date"></vxe-option>
            </vxe-select>
          </p>
          <!--月榜-->
          <p v-if="dateList == 3">
            <vxe-select v-model="tideData.monthlyList.date" placeholder="选择时间" filterable
                        :filter-method="regionDropDown(1, 2, 3)" @change="changeDate($event)">
              <vxe-option v-for="monthly in tideData.monthlyList" :key="monthly.id" :value="monthly" :label="monthly.date"></vxe-option>
            </vxe-select>
          </p>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">地区</span>
          <vxe-select v-model="tideData.option.area" placeholder="选择区域" filterable
                      :filter-method="regionDropDown(1, 2, 3)" @change="changeArea($event)">
            <vxe-option v-for="area in tideData.area" :key="area.areaId" :value="area.areaName" :label="area.areaName"></vxe-option>
          </vxe-select>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">分类</span>
          <vxe-select v-model="tideData.option.category" placeholder="全部" filterable
                      :filter-method="regionDropDown(1, 2, 3)" @change="changeCategory($event)">
            <vxe-option v-for="cateGory in tideData.cateGory" :key="cateGory.categoryId" :value="cateGory.categoryName" :label="cateGory.categoryName"></vxe-option>
          </vxe-select>
        </div>
      </template>
      <template #tools>
        <vxe-button status="warning" icon="vxe-icon--download" @click="exportCurrentPage" content="导出"></vxe-button>
      </template>
    </vxe-toolbar>
    <!--    table内容-->
    <vxe-table
      border
      round
      ref="xTable"
      height="400"
      width="500"
      :column-config="{resizable: true}"
      :data="tideData.tableData"
    >
      <vxe-column field="accountId" title="排名" align="center" sortable>

      </vxe-column>

      <vxe-colgroup title="属性" align="center">
        <vxe-column field="accountName" title="头像" align="center">
          <template #default="{ row }">
            <n-avatar
              round
              size="small"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </template>
        </vxe-column>
        <vxe-column field="accountName"  align="center" title="账号">
          <template #default="{ row }">
            <a href="https://github.com/x-extends/vxe-table" target="_black">{{ row.accountName }}</a>
          </template>
        </vxe-column>
      </vxe-colgroup>

      <vxe-column field="recordFan" title="粉丝数" align="center">

      </vxe-column>
      <vxe-column field="recordArticle" title="发文数" align="center">

      </vxe-column>
      <vxe-column field="recordLike" title="点赞数" align="center">

      </vxe-column>
      <vxe-column field="recordComment" title="评论数" align="center">

      </vxe-column>
      <vxe-column field="recordForward" title="转发数" align="center">

      </vxe-column>
      <vxe-column field="sex" title="潮汐指数" align="center">

      </vxe-column>
    </vxe-table>
    <!--    table分页-->
    <vxe-pager
      perfect
      v-model:current-page="tideData.tablePage.currentPage"
      v-model:page-size="tideData.tablePage.pageSize"
      :total="tideData.tablePage.total"
      @page-change="handlePageChange"
      :layouts="['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
    </vxe-pager>
  </div>
</template>
<style>
  .tideDataTime {
    float: left;
    padding-left: 20px;
    padding-top: 35px;
    text-align: center;
    font-size: 18px;
    opacity: 0.6;
    font-family: SourceHanSansSC-bold;
    color: rgba(17, 54, 145, 58)
  }

  .first-col {
    position: relative;
    height: 20px;
  }

  .first-col:before {
    content: "";
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
    opacity: 1.0;
    font-size: 18px;
    text-align: center;
    font-family: Roboto;
    color: #e8eaec;
  }

  .faceBookBackground-border {
    margin: 10px;
    border-radius: 12px;
    box-shadow: 0px 2px 10px 1px rgba(17, 54, 145, 30);
    padding: 0 20px 20px;
  }

  .faceBookBackgroundLeft {
    padding-left: 20px;
  }

  .radioLeft {
    padding-left: 20px;
  }


</style>

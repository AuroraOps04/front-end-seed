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
          <vxe-radio-group v-model="tideData.listData">
            <vxe-radio-button label="1" content="日榜"></vxe-radio-button>
            <vxe-radio-button label="2" content="周榜"></vxe-radio-button>
            <vxe-radio-button label="3" content="年榜"></vxe-radio-button>
          </vxe-radio-group>
        </div>
        <div style="margin-left:25px">
          <p>
            <vxe-select v-model="tideData.currentDate" placeholder="默认尺寸" @change="changeDate($event)">
              <vxe-option v-for="daily in tideData.dailyList" :key="daily.id" :value="daily.dateTime" :label="daily.date"></vxe-option>
            </vxe-select>
          </p>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">地区</span>
          <vxe-select v-model="tideData.option.area" placeholder="选择区域" filterable="true"
                      :filter-method="regionDropDown(1, 2, 3)" @change="changeArea($event)">
            <vxe-option v-for="area in tideData.area" :key="area.areaId" :value="area.areaName" :label="area.areaName"></vxe-option>
          </vxe-select>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">分类</span>
          <vxe-select v-model="tideData.option.category" placeholder="全部" filterable="true"
                      :filter-method="regionDropDown(1, 2, 3)" @change="changeCategory($event)">
            <vxe-option v-for="cateGory in tideData.cateGory" :key="cateGory.categoryId" :value="cateGory.categoryName" :label="cateGory.categoryName"></vxe-option>
          </vxe-select>
        </div>
      </template>
      <template #tools>
        <n-button type="warning" @click="exportCurrentPage" dashed>
          导出
        </n-button>
      </template>
    </vxe-toolbar>
    <!--    table内容-->
    <vxe-table
      border
      round="true"
      ref="xTable"
      height="400"
      width="500"
      :column-config="{resizable: true}"
      :data="tideData.tableData"
    >
      <vxe-column field="accountId" title="排名" align="center" sortable="true">

      </vxe-column>
      <vxe-column field="accountName" title="账号" align="center">
        <template #default="{ row }">
          <a href="https://github.com/x-extends/vxe-table" target="_black">{{ row.accountName }}</a>
        </template>
      </vxe-column>

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
<script lang="ts" setup>
  import {onMounted, reactive, ref} from 'vue'
  import {VxeButtonEvents, VxePagerEvents, VxeTableInstance} from 'vxe-table'
  import { NButton }  from 'naive-ui'
  import {listAccountByPageApi,findAllCategoryApi,findAreaApi} from '@/service/account'
  import moment from 'moment';
  import 'moment/locale/pt-br';
  onMounted(()=>{
    findAccountSelectPage('')
    getTime()
    findAllCategory()
    findAllArea()
    getNearly7Day()
  })
  // type TideDataType = {
  //   tableData: API.Dict[],
  //   tablePage: {
  //     total: number
  //   },
  //   // dailyList: string[]
  // }
  const tideData = reactive({
    tableData: [],
    tablePage: {
      total: 0,
      currentPage: 1,
      pageSize: 10
    },
    listData: null,
    cateGory:[],
    area:[],
    currentDate: '',
    option:{
      category: '',
      area: '',
    },
    dailyList:[]
  })

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
    debugger
    const res = await listAccountByPageApi(params)
    tideData.tableData = res.data as any
    tideData.tablePage.total = res.count as any
  }

  //查询所有地区
  const findAllArea = async()=>{
    const res = await findAreaApi(null);
    tideData.area = res as any
  }

  //查询所有分类
  const findAllCategory = async () => {
    const res = await findAllCategoryApi(null)
    tideData.cateGory = res as any
  }

  //下拉时间选项
  function changeDate(event:any){
    debugger
    params.startTime = event.value
    debugger
    findAccountSelectPage('')
  }

  //地区下拉选项
  function changeArea(event:any){
    params.area = event.value
    findAccountSelectPage('')
  }

  //分类下拉选项
  function changeCategory(event:any){
    params.category = event.value
    findAccountSelectPage('')
  }

  // 获取时间接口
  const getTime = async () => {
    let myDate = new Date()
    let month = (myDate.getMonth() + 1).toString().padStart(2, '0')
    let day = myDate.getDate().toString().padStart(2, '0')
    tideData.currentDate = myDate.getFullYear() + '年' + month + '月' + day + '日'
  }
  class dateObject{
    id: number | undefined;
    dateTime: string | undefined;
    date: string | undefined;
    constructor(id:number,dateTime:string,date:string){
      this.id = id
      this.dateTime = dateTime
      this.date = date
    }

  }

  const getNearly7Day = async () =>  {
    let date = new Date()
    for (let i = 0; i <= 24 * 6; i += 24) {
      //今天加上前6天
      let dateItem = new Date(date.getTime() - i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
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
      let dateList = new dateObject(i,moment(dateItem).format("YYYY-MM-DD hh:mm:ss"),valueItem);
      tideData.dailyList.push(dateList as never)
    }
    //给日期加0
    function addDate0(time:any) {
      if (time.toString().length == 1) {
        time = '0' + time.toString()
      }
      return time
    }
    debugger
  }



  //下拉
  function regionDropDown(searchValue: any, option: any, group: any) {
  }
  //分页
  const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
    params.page = currentPage
    params.pageSize = pageSize
    findAccountSelectPage('')
  }

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

  defineExpose({findAccountSelectPage})
</script>
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
    border-radius: 4px;
    box-shadow: 0px 2px 10px 1px rgba(17, 54, 145, 30);
  }

  .faceBookBackgroundLeft {
    padding-left: 20px;
  }

  .radioLeft {
    padding-left: 20px;
  }


</style>

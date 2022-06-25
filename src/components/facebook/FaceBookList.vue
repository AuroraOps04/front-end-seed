<template>
  <div class="faceBookBackground-border">
    <!--    图片显示器-->
    <vxe-toolbar>
      <template #buttons>
        <div class="faceBookBackgroundLeft">
          <div class="faceBookBackground">
            <p>
              FackBook&nbsp;榜&nbsp;单
            </p>
          </div>
          <div class="tideDataTime">
            <span>截止日期:{{tideData.date}}</span>
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
            <vxe-select v-model="tideData.dateList.value" placeholder="默认尺寸" filterable="true"
                        :filter-method="regionDropDown(1, 2, 3)">
              <vxe-option v-for="num in 15" :key="num" :value="num" :label="`选项${num}`"></vxe-option>
            </vxe-select>
          </p>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">地区</span>
          <vxe-select v-model="tideData.dateList.value" placeholder="默认尺寸">
            <vxe-option v-for="num in 15" :key="num" :value="num" :label="`选项${num}`"></vxe-option>
          </vxe-select>
        </div>
        <div style="margin-left:80px">
          <span style="padding-right: 20px; ">地区</span>
          <vxe-select v-model="tideData.dateList.value" placeholder="默认尺寸">
            <vxe-option v-for="num in 15" :key="num" :value="num" :label="`选项${num}`"></vxe-option>
          </vxe-select>
        </div>
      </template>
      <template #tools>
        <el-button type="warning" @click="exportCurrentPage" icon="el-icon-download">导出</el-button>
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
      :data="tideData.tableData.rows"
    >
      <vxe-column field="accountId" title="排名" align="center" sortable="true">

      </vxe-column>
      <vxe-column field="accountName" title="账号" align="center">
        <template #default="{ row }">
          <a href="https://github.com/x-extends/vxe-table" target="_black">我是超链接：{{ row.name }}</a>
        </template>
      </vxe-column>

      <vxe-column field="recordFan" title="粉丝数" align="center">

      </vxe-column>
      <vxe-column field="sex" title="发文数" align="center">

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
  import {VxeButtonEvents, VxeTableInstance,VxePagerEvents } from 'vxe-table'
  import {listAccountByPageApi} from '../../service/account'

  onMounted(()=>{
    findAccountSelectPage()
    getTime()
  })

  const tideData = reactive({
    tableData: [],
    tablePage: {
      total: 0,
      currentPage: 1,
      pageSize: 10
    },
    listData: null,
    dateList: {
      value: 12,
    },
    date: '',
  })
  const params = reactive<API.AccountParams & API.PageParams>({
    pageSize: tideData.tablePage.pageSize,
    page: tideData.tablePage.currentPage,
  })
  const findAccountSelectPage = async () => {
    const res = await listAccountByPageApi(params)
    tideData.tableData = res.data as any
    tideData.tablePage.total = res.count as any
  }
  // 获取时间接口
  const getTime = async () => {
    let myDate = new Date()
    let month = (myDate.getMonth() + 1).toString().padStart(2, '0')
    let day = myDate.getDate().toString().padStart(2, '0')
    tideData.date = myDate.getFullYear() + '年' + month + '月' + day + '日'
  }

  //下拉
  function regionDropDown(searchValue: any, option: any, group: any) {
  }

  //分页
  const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
    debugger
    params.page = currentPage
    params.pageSize = pageSize
    findAccountSelectPage()
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
    line-height: 47px;
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

<script lang="ts" setup>

import {NButtonGroup,NButton, NGrid, NGi,} from 'naive-ui'
import {VxeButtonEvents, VxePagerEvents, VXETable, VxeTableInstance} from 'vxe-table'

import { defineComponent, onMounted, reactive, ref } from 'vue'
import { findAllCategoryApi, findAreaApi } from '@service/account'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(()=>{
  // findAccountSelectPage(accountName.value)
  // getTime()
  // findAllCategory()
  findAllArea()
  // getNearly7Day()
  // getWeekDate()
  // getMonthDate()
})

const tableData2 = ref([
  {name: '王大虎', sex: '男',category: '测试类别1',focus: '测试领域1',location: '武汉',phone: '13600800000',mail: 'kcc1001@mail.com',rating: '普通用户',},
  {name: '王小虎', sex: '男',category: '测试类别2',focus: '测试领域2',location: '上海',phone: '13600800001',mail: 'kcc1002@mail.com',rating: '会员',},
  {name: '张三', sex: '男',category: '测试类别3',focus: '测试领域3',location: '福建',phone: '13600800002',mail: 'kcc1003@mail.com',rating: '会员',},
  {name: '李四', sex: '男',category: '测试类别4',focus: '测试领域4',location: '北京',phone: '13600800003',mail: 'kcc1004@mail.com',rating: '普通用户',},
])

const page2 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 100
})

//地区对象
class areaObject{
  areaId:number | undefined;
  areaName:string | undefined;
  areaCode:string | undefined ;
  areaDescription:string | undefined ;
  createdAt:string | undefined ;
  updatedAt:string | undefined ;
  createdBy:string | undefined ;
  deletedAt:number|undefined
  constructor(areaId:number,areaName:string,areaCode:string,areaDescription:string,createdAt:string,updatedAt:string,createdBy:string,deletedAt:number){
    this.areaId = areaId
    this.areaName = areaName
    this.areaCode = areaCode
    this.areaDescription = areaDescription
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.createdBy = createdBy
    this.deletedAt = deletedAt
  }
}

//页面数据
const tideData = reactive({
  // areaTemp:[],
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
  area:[areaObject],
  currentDate: '',
  //地区分类选项绑定
  option:{
    category: '',
    area: '',
  }
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


//查询所有地区
const findAllArea = async()=>{
  const res = await findAreaApi(null);
  let area = new areaObject(0,"全部","","","","","",0)
  tideData.area = res.data as never
  // debugger
  // tideData.area.push(area as never)
}

//查询所有分类
const findAllCategory = async () => {
  const res = await findAllCategoryApi(null)
  tideData.cateGory = res.data as any
}

//地区下拉选项
function changeArea(event:any){
  params.area = event.value
  // findAccountSelectPage(accountName.value)
}

//分类下拉选项
function changeCategory(event:any){
  params.category = event.value
  // findAccountSelectPage(accountName.value)
}



const clickEvent = () => {

}

const xTable1 = ref<VxeTableInstance>()

const exportSelectEvent: VxeButtonEvents.Click = () => {
  const $table = xTable1.value
  $table.exportData({
    data: $table.getCheckboxRecords()
  })
}

</script>

<template>

  <div class='bg1'>
    <n-grid x-gap="24" :cols="4">
      <n-gi span="4">

        <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-input  placeholder="搜索类型" type="search"></vxe-input>
            <vxe-select  placeholder="选择用户等级">
              <vxe-option v-for="num in 15" :key="num" :value="num" :label="`选项${num}`"></vxe-option>
            </vxe-select>
            <vxe-select  v-model="tideData.option.category" placeholder="选择关注领域">
              <vxe-option v-for="area in tideData.option.category" :key="area.areaId" :value="area.areaName" :label="area.areaName"></vxe-option>
            </vxe-select>
            <vxe-select  v-model="tideData.option.area" placeholder="选择所在地">
              <vxe-option v-for="cateGory in tideData.cateGory" :key="cateGory.categoryId" :value="cateGory.categoryName" :label="cateGory.categoryName"></vxe-option>
            </vxe-select>

            <n-button @click="clickEvent" type="info" ghost >重置</n-button>
            <n-button @click="exportSelectEvent" type="info">导出</n-button>


          </template>
        </vxe-toolbar>


      </n-gi>
    </n-grid >

    <n-grid x-gap="24" :cols="4">
      <n-gi span="4">


        <vxe-table
          ref="xTable1"
          :export-config="{}"
          :row-config="{isHover: true}"
          :data="tableData2">
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-table-column field="name" title="姓名"></vxe-table-column>
          <vxe-table-column field="sex" title="性别"></vxe-table-column>
          <vxe-table-column field="category" title="职业类别"></vxe-table-column>
          <vxe-table-column field="focus" title="关注领域"></vxe-table-column>
          <vxe-table-column field="location" title="所在地"></vxe-table-column>
          <vxe-table-column field="phone" title="手机号"></vxe-table-column>
          <vxe-table-column field="mail" title="邮箱"></vxe-table-column>
          <vxe-table-column field="rating" title="用户等级"></vxe-table-column>

        </vxe-table>

      </n-gi>
    </n-grid >


    <n-grid x-gap="24" :cols="4">
      <n-gi span="4">

        <vxe-pager
          background
          v-model:current-page="page2.currentPage"
          v-model:page-size="page2.pageSize"
          :total="page2.totalResult"
          :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
        </vxe-pager>


      </n-gi>
    </n-grid >






  </div>






</template>

<style scoped>
.bg1{
  margin: 3%;
  padding: 3%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>

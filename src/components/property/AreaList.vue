<script setup lang="ts">
import { NButton, NGrid, NGi, NIcon } from 'naive-ui'
import { VxeButtonEvents, VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { TrashOutline, Add } from '@vicons/ionicons5'
import { onMounted, reactive, ref } from 'vue'
import {
  addAreaApi,
  editAreaByNameApi,
  editCategoryByNameApi,
  listAreaByPageApi,
  removeAreaBatchByIdsApi,
  removeAreaByIdApi
} from '@service/property'
import underLine from '@/assets/underLine.png'
import AreaQueryParams = API.AreaQueryParams

const underLinePng = underLine

// 页面数据
const propertyData = reactive({
  // 表格数据
  tableData: [],
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  }
})

// 查询地区数据的条件参数
const params = reactive<API.AreaQueryParams & API.PageParams>({
  pageSize: propertyData.tablePage.pageSize,
  page: propertyData.tablePage.currentPage,
  areaName: ''
})

// 修改地区数据的参数
const updateParams = reactive<API.AreaParams>({
  areaId: 0,
  areaCode: '',
  areaDescription: '',
  areaName: ''
})

// 根据参数分页查询所有数据
const findAreaSelectPage = async () => {
  const res = await listAreaByPageApi(params)
  propertyData.tableData = res.data! as any
  propertyData.tablePage.total = res.count! as any
  console.log(propertyData.tableData)
}

// 搜索地区名
function changeAreaName(event: any) {
  params.areaName = event.value
  console.log(event.value)
  findAreaSelectPage()
}

// 重置参数
const clickEvent = () => {
  params.areaName = ''
  // propertyData.option.area = ''
  findAreaSelectPage()
}

// 页码切换
function handleChangePage() {
  params.pageSize = propertyData.tablePage.pageSize
  params.page = propertyData.tablePage.currentPage
  findAreaSelectPage()
}

// 添加框是否显示
const isShow = ref<boolean>(false)

// 修改框是否显示
const isShow2 = ref<boolean>(false)
// 添加地区名
const inputAreaName = ref<string>('')

// 表格
const xTable1 = ref<VxeTableInstance>()

// 添加地区数据
const insertEvent = async () => {
  await addAreaApi(inputAreaName.value)
  isShow.value = false
  await findAreaSelectPage()
}

// 修改分类数据事件
const updateEvent = async () => {
  // 修改参数
  updateParams.areaName = inputAreaName.value
  await editAreaByNameApi(updateParams)
  isShow2.value = false
  await findAreaSelectPage()
}

function handleAddArea(event: any) {
  inputAreaName.value = ''
  isShow.value = true
}

function handleEditArea(row: any) {
  // 修改参数id
  updateParams.areaId = row.areaId as number
  isShow2.value = true
}

// 表格中的删除
const removeEvent = async (row: any) => {
  const AreaId = row.areaId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAreaByIdApi(AreaId)
    if (res.success) {
      await findAreaSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

// 定义批量删除的数组
const areaArray: number[] = []

// check全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
  // 置空数组
  areaArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    areaArray.push(item.areaId)
  })
}

// check单选
const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  areaArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    areaArray.push(item.areaId)
  })
}

// 批量删除
const deleteEvent = async () => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAreaBatchByIdsApi(areaArray)
    if (res.data) {
      await findAreaSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

onMounted(() => {
  findAreaSelectPage()
})
</script>

<template>
  <div class="bg_box">
    <div class="bg_box2">
      <h3>地区管理</h3>
      <img class="text_png1" :src="underLinePng" />
      <n-grid :cols="4" x-gap="24">
        <n-gi span="4">
          <vxe-toolbar>
            <template #buttons>
              <vxe-input
                placeholder="输入关键词搜索"
                v-model="params.areaName"
                type="search"
                @blur="changeAreaName"
              ></vxe-input>

              <n-button ghost type="info" style="margin-left: 70px" @click="clickEvent">
                重置
              </n-button>

              <n-button type="info" style="margin-left: 350px" @click="handleAddArea">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                添加
              </n-button>
              <n-button type="error" style="margin-left: 20px" @click="deleteEvent">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                删除
              </n-button>
            </template>
          </vxe-toolbar>
        </n-gi>
      </n-grid>

      <div class="table1">
        <n-grid :cols="4" x-gap="24">
          <n-gi span="4">
            <vxe-table
              ref="xTable1"
              size="small"
              align="center"
              :data="propertyData.tableData"
              :export-config="{}"
              :row-config="{ isHover: true }"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-table-column field="areaId" title="序号" width="140"></vxe-table-column>
              <vxe-table-column field="areaName" title="地区名称" width="350"></vxe-table-column>
              <vxe-column show-overflow title="操作">
                <template #default="{ row }">
                  <vxe-button
                    icon="vxe-icon--edit-outline"
                    type="text"
                    @click="handleEditArea(row)"
                    class="add_icon"
                  />
                  <n-icon style="padding-top: 20px">
                    <TrashOutline @click="removeEvent(row)" />
                  </n-icon>
                </template>
              </vxe-column>
            </vxe-table>
          </n-gi>
        </n-grid>
      </div>

      <n-grid :cols="4" x-gap="24">
        <n-gi span="4">
          <vxe-pager
            v-model:current-page="propertyData.tablePage.currentPage"
            v-model:page-size="propertyData.tablePage.pageSize"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              'NextJump',
              'FullJump',
              'Total'
            ]"
            :total="propertyData.tablePage.total"
            background
            @page-change="handleChangePage"
          >
          </vxe-pager>
        </n-gi>
      </n-grid>
      <!--      新增地区弹出框-->
      <vxe-modal
        v-model="isShow"
        destroy-on-close
        min-height="900"
        min-width="900"
        resize
        title="添加地区"
        width="340"
        height="230"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputAreaName" placeholder="输入新增地区名称"></vxe-input>
            </div>
            <div class="input_button">
              <vxe-button
                content="取消"
                status="info"
                @click="isShow = false"
                class="button_left"
              ></vxe-button>
              <vxe-button
                content="确定添加"
                status="primary"
                @click="insertEvent()"
                class="button_right"
              ></vxe-button>
            </div>
          </div>
        </template>
      </vxe-modal>

      <!--      编辑地区弹出框-->
      <vxe-modal
        v-model="isShow2"
        destroy-on-close
        min-height="900"
        min-width="900"
        resize
        title="编辑地区"
        width="340"
        height="230"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputAreaName" placeholder="输入修改后的名称"></vxe-input>
            </div>
            <div class="input_button">
              <vxe-button
                content="取消"
                status="info"
                @click="isShow = false"
                class="button_left"
              ></vxe-button>
              <vxe-button
                content="保存"
                status="primary"
                @click="updateEvent()"
                class="button_right"
              ></vxe-button>
            </div>
          </div>
        </template>
      </vxe-modal>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg_box {
  display: flex;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 20px;

  .bg_box2 {
    float: right;
    height: 625px;
    width: 1080px;
    padding: 2%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    .text_png1 {
      position: absolute;
      height: 17px;
      width: 144px;
      left: 380px;
      bottom: 550px;
    }

    .table1 {
      height: 445px;

      .add_icon {
        padding: 10px;
      }
      .delete_icon {
        padding: 10px;
      }
    }

    .input_text {
      margin-top: 30px;
      margin-left: 60px;
      margin-bottom: 30px;
    }
    .input_button {
      margin-left: 30px;
      .button_left {
        width: 90px;
        margin-right: 45px;
      }
      .button_right {
        width: 90px;
      }
    }
  }
}
</style>

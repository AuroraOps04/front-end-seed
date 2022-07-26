<script lang="ts" setup>
import { NButton, NGrid, NGi, NIcon, NDivider } from 'naive-ui'
import { VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { TrashOutline, Add } from '@vicons/ionicons5'
import { EditRegular } from '@vicons/fa'
import { onMounted, reactive, ref } from 'vue'
import {
  addAreaApi,
  editAreaByNameApi,
  listAreaByPageApi,
  removeAreaBatchByIdsApi,
  removeAreaByIdApi
} from '@service/property'
import underLine from '@/assets/underLine.png'
import areaManage from '@/assets/areaManage.png'
import btnAdd from '@/assets/btn-add-admin.png'
import btnCancel from '@/assets/btn- cancel.png'
import btnSave from '@/assets/btn-save.png'
import btnDelete from '@/assets/btn-delete.png'
import btnReset from '@/assets/btn-reset.png'
import iconDelete from '@/assets/icon-delete.png'
import iconEdit from '@/assets/icon-edit.png'
import btnAddSure from '@/assets/btn-add-sure.png'

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
  const res = await addAreaApi(inputAreaName.value)
  isShow.value = false
  if (res.success) {
    await findAreaSelectPage()
    await VXETable.modal.message('添加成功')
  } else {
    await VXETable.modal.message('添加失败')
  }
}

// 修改分类数据事件
const updateEvent = async () => {
  // 修改参数
  updateParams.areaName = inputAreaName.value
  const res = await editAreaByNameApi(updateParams)
  isShow2.value = false
  if (res.success) {
    await findAreaSelectPage()
    await VXETable.modal.message('修改成功')
  } else {
    await VXETable.modal.message('修改失败')
  }
}

function handleAddArea() {
  inputAreaName.value = ''
  isShow.value = true
}

function handleEditArea(row: any) {
  inputAreaName.value = ''
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
      <img class="box_img" :src="areaManage" alt="地区管理" />
      <NDivider />

      <vxe-toolbar>
        <template #buttons>
          <div class="toolbar">
            <div class="search_tool">
              <vxe-input
                v-model="params.areaName"
                placeholder="输入关键词搜索"
                type="search"
                @blur="changeAreaName"
              ></vxe-input>
              <img
                :src="btnReset"
                style="height: 43px; width: 86px"
                alt="重置"
                @click="clickEvent"
              />
            </div>

            <div>
              <img :src="btnAdd" style="height: 44px; width: 100px" @click="handleAddArea" />
            </div>

            <div>
              <img :src="btnDelete" style="width: 100px; height: 43px" @click="deleteEvent" />
            </div>
          </div>
        </template>
      </vxe-toolbar>

      <div class="table1">
        <n-grid :cols="4" x-gap="24">
          <n-gi span="4">
            <vxe-table
              ref="xTable1"
              :data="propertyData.tableData"
              :export-config="{}"
              :row-config="{ isHover: true }"
              :loading="loading"
              border="inner"
              align="center"
              size="small"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="areaId" title="序号" width="140"></vxe-column>
              <vxe-column field="areaName" title="地区名称" width="350"></vxe-column>
              <vxe-column show-overflow title="操作">
                <template #default="{ row }">
                  <div>
                    <img
                      :src="iconEdit"
                      @click="handleEditArea(row)"
                      style="width: 20px; height: 20px"
                    />
                    <img
                      :src="iconDelete"
                      @click="removeEvent(row)"
                      style="width: 20px; height: 20px"
                    />
                  </div>
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
        height="230"
        min-height="900"
        min-width="900"
        resize
        title="添加地区"
        width="340"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputAreaName" placeholder="输入新增地区名称"></vxe-input>
            </div>
            <div class="input_button">
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

      <!--      编辑地区弹出框-->
      <vxe-modal
        v-model="isShow2"
        destroy-on-close
        height="230"
        min-height="900"
        min-width="900"
        resize
        title="编辑地区"
        width="340"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputAreaName" placeholder="输入修改后的名称"></vxe-input>
            </div>
            <div class="input_button">
              <img
                :src="btnCancel"
                class="button_left"
                @click="isShow2 = false"
                style="height: 33px; width: 110px"
              />
              <img
                :src="btnSave"
                class="button_right"
                @click="updateEvent()"
                style="height: 33px; width: 110px"
              />
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
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 0;
  }

  .bg_box2 {
    float: right;
    height: 625px;
    width: 1080px;
    padding-left: 3%;
    padding-right: 1%;
    padding-bottom: 4%;
    border-radius: 15px;
    box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: auto;
    }
    .box_img {
      height: 35px;
      width: 100px;
      margin-top: 25px;
      margin-bottom: -15px;
    }

    .toolbar {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      width: calc(100%);

      .search_tool {
        display: flex;
        width: calc(65%);
        margin-top: -15px;

        div {
          margin-left: 20px;
          margin-top: 5px;
        }
        img {
          margin-left: 35px;
        }
      }

      div {
        margin-top: -10px;
      }
    }

    .text_png1 {
      position: absolute;
      height: 17px;
      width: 144px;
      left: 395px;
      bottom: 575px;
      display: none;
    }

    .table1 {
      margin-top: 20px;
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
      margin-left: 25px;
      .button_left {
        margin-right: 40px;
      }
      .button_right {
      }
    }
  }
}
</style>

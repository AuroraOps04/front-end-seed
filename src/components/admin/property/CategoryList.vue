<script setup lang="ts">
import { NButton, NGrid, NGi, NIcon } from 'naive-ui'
import { VxeButtonEvents, VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { TrashOutline, Add } from '@vicons/ionicons5'
import { EditRegular } from '@vicons/fa'
import { onMounted, reactive, ref } from 'vue'
import {
  addCategoryApi,
  editCategoryByNameApi,
  listCategoryByPageApi,
  removeCategoryBatchByIdsApi,
  removeCategoryByIdApi
} from '@service/property'
import underLine from '@/assets/underLine.png'

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

// 查询分类数据的条件参数
const params = reactive<API.CategoryQueryParams & API.PageParams>({
  pageSize: propertyData.tablePage.pageSize,
  page: propertyData.tablePage.currentPage,
  categoryName: ''
})

// 修改分类数据的参数
const updateParams = reactive<API.CategoryParams>({
  categoryId: 0,
  categoryName: '',
  categoryCode: '',
  categoryDescription: ''
})

// 根据参数分页查询所有数据
const findCategorySelectPage = async () => {
  const res = await listCategoryByPageApi(params)
  propertyData.tableData = res.data! as any
  propertyData.tablePage.total = res.count! as any
  console.log(propertyData.tableData)
}

// 搜索分类名
function changeCategoryName(event: any) {
  params.categoryName = event.value
  console.log(event.value)
  findCategorySelectPage()
}

// 重置参数
const clickEvent = () => {
  params.categoryName = ''
  // propertyData.option.category = ''
  findCategorySelectPage()
}

// 页码切换
function handleChangePage() {
  params.pageSize = propertyData.tablePage.pageSize
  params.page = propertyData.tablePage.currentPage
  findCategorySelectPage()
}

// 添加框是否显示
const isShow = ref<boolean>(false)

// 修改框是否显示
const isShow2 = ref<boolean>(false)
// 添加分类名
const inputCategoryName = ref<string>('')

// 表格
const xTable1 = ref<VxeTableInstance>()

// 添加分类数据
const insertEvent = async () => {
  const res = await addCategoryApi(inputCategoryName.value)
  isShow.value = false
  if (res.success) {
    await findCategorySelectPage()
    await VXETable.modal.message('添加成功')
  } else {
    await VXETable.modal.message('添加失败')
  }
}
// 修改分类数据事件
const updateEvent = async () => {
  // 修改参数
  updateParams.categoryName = inputCategoryName.value
  const res = await editCategoryByNameApi(updateParams)
  isShow2.value = false
  if (res.success) {
    await findCategorySelectPage()
    await VXETable.modal.message('修改成功')
  } else {
    await VXETable.modal.message('修改失败')
  }
}
function handleAddCategory(event: any) {
  inputCategoryName.value = ''
  isShow.value = true
}

function handleEditCategory(row: any) {
  inputCategoryName.value = ''
  // 修改参数id
  updateParams.categoryId = row.categoryId as number
  isShow2.value = true
}

// 表格中的删除
const removeEvent = async (row: any) => {
  const CategoryId = row.categoryId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeCategoryByIdApi(CategoryId)
    if (res.success) {
      await findCategorySelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

// 定义批量删除的数组
const CategoryIdArray: number[] = []

// check全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
  // 置空数组
  CategoryIdArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    CategoryIdArray.push(item.categoryId)
  })
}

// check单选
const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  CategoryIdArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    CategoryIdArray.push(item.categoryId)
  })
}

// 批量删除
const deleteEvent = async () => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeCategoryBatchByIdsApi(CategoryIdArray)
    if (res.data) {
      await findCategorySelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

onMounted(() => {
  findCategorySelectPage()
})
</script>

<template>
  <div class="bg_box">
    <div class="bg_box2">
      <h3>分类管理</h3>
      <img class="text_png1" :src="underLinePng" />
      <n-grid :cols="4" x-gap="24">
        <n-gi span="4">
          <vxe-toolbar>
            <template #buttons>
              <vxe-input
                placeholder="输入关键词搜索"
                v-model="params.categoryName"
                type="search"
                @blur="changeCategoryName"
              ></vxe-input>

              <n-button ghost type="info" style="margin-left: 70px" @click="clickEvent">
                重置
              </n-button>

              <n-button type="info" style="margin-left: 350px" @click="handleAddCategory">
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
              <vxe-table-column field="categoryId" title="序号" width="140"></vxe-table-column>
              <vxe-table-column
                field="categoryName"
                title="分类名称"
                width="350"
              ></vxe-table-column>
              <vxe-column show-overflow title="操作">
                <template #default="{ row }">
                  <div>
                    <n-button text>
                      <template #icon>
                        <n-icon :depth="3">
                          <EditRegular @click="handleEditCategory(row)" />
                        </n-icon>
                      </template>
                    </n-button>

                    <n-button text>
                      <template #icon>
                        <n-icon :depth="3">
                          <TrashOutline @click="removeEvent(row)" />
                        </n-icon>
                      </template>
                    </n-button>
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
      <!--      新增分类弹出框-->
      <vxe-modal
        v-model="isShow"
        destroy-on-close
        min-height="900"
        min-width="900"
        resize
        title="添加分类"
        width="340"
        height="230"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputCategoryName" placeholder="输入新增分类名称"></vxe-input>
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
        title="编辑分类"
        width="340"
        height="230"
      >
        <template #default>
          <div>
            <div class="input_text">
              <vxe-input v-model="inputCategoryName" placeholder="输入修改后的名称"></vxe-input>
            </div>
            <div class="input_button">
              <vxe-button
                content="取消"
                status="info"
                @click="isShow2 = false"
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
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: auto;
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
      height: 445px;
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

<script setup lang="ts">
import { NButton, NGrid, NGi, NIcon, useMessage, NDivider } from 'naive-ui'
import { VXETable, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { TrashOutline, Add } from '@vicons/ionicons5'
import { EditRegular } from '@vicons/fa'
import {
  addAdminApi,
  editAdminApi,
  listAdminByPageApi,
  removeAdminBatchByIdsApi,
  removeAdminByIdApi
} from '@service/adminList'
import { onMounted, reactive, ref } from 'vue'
import underLine from '@/assets/underLine.png'
import areaManage from '@/assets/areaManage.png'
import btnAdd from '@/assets/btn-add-admin.png'
import btnCancel from '@/assets/btn- cancel.png'
import btnSave from '@/assets/btn-save.png'
import btnDelete from '@/assets/btn-delete.png'
import btnReset from '@/assets/btn-reset.png'
import iconDelete from '@/assets/icon-delete.png'
import iconEdit from '@/assets/icon-edit.png'
import adminList from '@/assets/admin-List.png'
import btnAddSure from '@/assets/btn-add-sure.png'

const underLinePng = underLine

const message = useMessage()

// 页面数据
const adminData = reactive({
  // 表格数据
  tableData: [],
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  }
})

// 查询管理员数据的条件参数
const params = reactive<API.AdminQueryParams & API.PageParams>({
  pageSize: adminData.tablePage.pageSize,
  page: adminData.tablePage.currentPage,
  username: ''
})

// 新增管理员参数
const addParams = reactive<API.AdminParams>({
  username: '',
  passWord: '',
  phone: ''
})

// 修改管理员参数
const updateParams = reactive<API.AdminParams>({
  userId: 0,
  username: '',
  passWord: '',
  phone: ''
})

// 重复输入密码
const repeatPwd = ref<string>('')

// 根据参数分页查询所有数据
const findAdminSelectPage = async () => {
  const res = await listAdminByPageApi(params)
  adminData.tableData = res.data! as any
  adminData.tablePage.total = res.count! as any
  console.log(adminData.tableData)
}

// 搜索管理员名
function changeAdminName(event: any) {
  params.username = event.value
  console.log(event.value)
  findAdminSelectPage()
}

// 重置参数
const clickEvent = () => {
  params.username = ''
  findAdminSelectPage()
}

// 页码切换
function handleChangePage() {
  params.pageSize = adminData.tablePage.pageSize
  params.page = adminData.tablePage.currentPage
  findAdminSelectPage()
}

// 添加框是否显示
const isShow = ref<boolean>(false)

// 修改框是否显示
const isShow2 = ref<boolean>(false)

// 表格
const xTable1 = ref<VxeTableInstance>()

// 添加管理员数据
const insertEvent = async () => {
  const res = await addAdminApi(addParams)
  isShow.value = false
  if (res.success) {
    await findAdminSelectPage()
    await VXETable.modal.message('添加成功')
  } else {
    await VXETable.modal.message('添加失败')
  }
}

// 修改管理员数据事件
const updateEvent = async () => {
  if (updateParams.passWord !== repeatPwd.value) {
    message.warning('密码不一致')
    return
  }
  // 修改参数
  const res = await editAdminApi(updateParams)
  isShow2.value = false
  if (res.success) {
    await findAdminSelectPage()
    await VXETable.modal.message('修改成功')
  } else {
    await VXETable.modal.message('修改失败')
  }
}

function handleAddAdmin(event: any) {
  addParams.username = ''
  addParams.passWord = ''
  addParams.phone = ''
  isShow.value = true
}

function handleEditAdmin(row: any) {
  // 修改参数id
  updateParams.userId = row.userId as number
  updateParams.username = row.userName as string
  updateParams.passWord = ''
  updateParams.phone = ''

  isShow2.value = true
}

// 表格中的删除
const removeEvent = async (row: any) => {
  const UserId = row.userId as number
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAdminByIdApi(UserId)
    if (res.success) {
      await findAdminSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

// 定义批量删除的数组
const adminArray: number[] = []

// check全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
  // 置空数组
  adminArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    adminArray.push(item.userId)
  })
}

// check单选
const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
  // 置空数组
  adminArray.length = 0
  const $table = xTable1.value as VxeTableInstance
  const records = $table.getCheckboxRecords()
  records.forEach((item) => {
    adminArray.push(item.userId)
  })
}

// 批量删除
const deleteEvent = async () => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const res = await removeAdminBatchByIdsApi(adminArray)
    if (res.data) {
      await findAdminSelectPage()
      await VXETable.modal.message('删除成功')
    } else {
      await VXETable.modal.message('删除失败')
    }
  }
}

onMounted(() => {
  findAdminSelectPage()
})
</script>

<template>
  <div class="bg_box">
    <div class="bg_box2">
      <img :src="adminList" alt="管理账号列表" class="box_img" />
      <n-divider></n-divider>
      <vxe-toolbar>
        <template #buttons>
          <div class="toolbar">
            <div class="search_tool">
              <vxe-input
                placeholder="输入关键词搜索"
                v-model="params.username"
                type="search"
                @blur="changeAdminName"
              ></vxe-input>
              <img :src="btnReset" alt="重置" @click="clickEvent" />
            </div>
            <div>
              <img :src="btnAdd" style="height: 44px; width: 100px" @click="handleAddAdmin" />
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
              size="small"
              align="center"
              :loading="loading"
              border="inner"
              :data="adminData.tableData"
              :export-config="{}"
              :row-config="{ isHover: true }"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="userId" title="序号" width="100"></vxe-column>
              <vxe-column field="userName" title="账号名称" width="300"></vxe-column>
              <vxe-column field="createdAt" title="添加日期" width="300"></vxe-column>
              <vxe-column show-overflow title="操作">
                <template #default="{ row }">
                  <div>
                    <img
                      :src="iconEdit"
                      @click="handleEditAdmin(row)"
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
            v-model:current-page="adminData.tablePage.currentPage"
            v-model:page-size="adminData.tablePage.pageSize"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              'NextJump',
              'FullJump',
              'Total'
            ]"
            :total="adminData.tablePage.total"
            background
            @page-change="handleChangePage"
          >
          </vxe-pager>
        </n-gi>
      </n-grid>
      <!--      新增管理员弹出框-->
      <vxe-modal
        v-model="isShow"
        destroy-on-close
        min-height="900"
        min-width="900"
        resize
        title="管理员账号添加"
        width="380"
        height="330"
      >
        <template #default>
          <div>
            <div class="input_wrapper">
              <div class="input_box">
                <text>账号名字</text>
                <vxe-input v-model="addParams.username" placeholder="输入账户名称"></vxe-input>
              </div>

              <div class="input_box">
                <text>手机号</text>
                <vxe-input v-model="addParams.phone" placeholder="输入新的手机号"></vxe-input>
              </div>

              <div class="input_box">
                <text>密码</text>
                <vxe-input v-model="addParams.passWord" placeholder="输入新的密码"></vxe-input>
              </div>
            </div>
            <div class="input_button">
              <img
                :src="btnCancel"
                class="button_left"
                @click="isShow = false"
                style="height: 33px; width: 110px"
              />

              <img
                :src="btnSave"
                class="button_right"
                @click="insertEvent()"
                style="height: 33px; width: 110px"
              />
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
        title="管理账号编辑"
        width="380"
        height="330"
      >
        <template #default>
          <div>
            <div class="input_wrapper">
              <div class="input_box">
                <text>手机号</text>
                <vxe-input v-model="updateParams.phone" placeholder="输入新的手机号"></vxe-input>
              </div>

              <div class="input_box">
                <text>密码</text>
                <vxe-input v-model="updateParams.passWord" placeholder="输入新的密码"></vxe-input>
              </div>

              <div class="input_box">
                <text>确认密码</text>
                <vxe-input v-model="repeatPwd" placeholder="请确认新的密码"></vxe-input>
              </div>
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

  .bg_box2 {
    height: 80%;
    width: 80%;
    margin: 2% 2% 2% 80px;
    padding: 1% 3% 5%;
    border-radius: 15px;
    box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 0;
      width: auto;
    }
    .box_img {
      height: 35px;
      width: 139px;
      margin-top: 25px;
      margin-bottom: -15px;
    }
    .ml5 {
      margin-left: 5px;
    }
    .toolbar {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      width: calc(100%);

      .search_tool {
        display: flex;
        width: calc(75%);
        margin-top: -15px;

        div {
          margin-left: 20px;
          margin-top: 5px;
        }
        img {
          margin-left: 35px;
          height: 43px;
          width: 86px;
        }
      }

      div {
        margin-top: -10px;
      }
    }

    .text_png1 {
      position: absolute;
      height: 16px;
      width: 150px;
      left: 335px;
      bottom: 585px;
      display: none;
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
    .input_wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .input_box {
        margin-top: 15px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 70%;
      }
    }
    .input_button {
      margin-left: 30px;
      margin-top: 20px;
      .button_left {
        width: 110px;
        margin-right: 45px;
      }
      .button_right {
        width: 110px;
        margin-left: 20px;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import {
  NDataTable,
  NButton,
  NRow,
  NCol,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NInput,
  useMessage
} from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { listDictByPageApi } from '@service/dict'

const params = reactive<API.PageParams & API.DictParams>({
  page: 1,
  pageSize: 10
})
type PageData = {
  count: number
  data: API.Dict[]
}
const formRef = ref<FormInst | null>(null)
const pageData = reactive<PageData>({
  count: 0,
  data: []
})
const message = useMessage()
const showModal = ref(false)
const columns: DataTableColumns<API.Dict> = [
  {
    title: '字典名',
    key: 'label'
  },
  {
    title: '描述',
    key: 'description'
  }
]

const fetchData = async () => {
  const res = await listDictByPageApi(params)
  pageData.count = res.count
  pageData.data = res.data as API.Dict[]
}
const rules = []
const formData = reactive({
  label: '',
  description: '',
  sort: 0
})
const onSave = async () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('表单验证错误')
      return
    }
    message.success('表单验证成功')
  })
}
onMounted(() => {
  fetchData()
})
</script>
<template>
  <div style="padding: 30px">
    <n-row>
      <n-col>
        <n-button type="primary" @click="showModal = true">新增</n-button>
      </n-col>
    </n-row>
    <n-data-table :data="pageData.data" :columns="columns" :rules="rules" />
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px">
        <n-form :model="formData" ref="formRef">
          <n-form-item label="字典名" path="label">
            <n-input placeholder="请输入字典名" />
          </n-form-item>
          <n-form-item label="字典描述" path="description">
            <n-input placeholder="请输入字典描述" />
          </n-form-item>
          <n-form-item label="排序" path="sort">
            <n-input placeholder="请输入字典排序" />
          </n-form-item>
        </n-form>
        <template #footer>
          <div style="float: right">
            <n-button type="primary" style="margin-right: 20px" @click="onSave">保存</n-button>
            <n-button @click="showModal = false">取消</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

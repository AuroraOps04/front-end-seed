<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { NDataTable } from 'naive-ui'
import { listDictByPageApi } from '@service/dict'

const params = reactive<API.PageParams & API.DictParams>({
  page: 1,
  pageSize: 10
})
type PageData = {
  count: number
  data: API.Dict[]
}

const pageData = reactive<PageData>({
  count: 0,
  data: []
})

const fetchData = async () => {
  const res = await listDictByPageApi(params)
  pageData.count = res.count
  pageData.data = res.data as API.Dict[]
}
onMounted(() => {
  fetchData()
})
</script>
<template>
  <NDataTable :data="pageData.data" />
</template>

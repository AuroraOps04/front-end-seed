<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import { NCard, NTabs, NTabPane } from 'naive-ui'

import accountSelectTable from '@/components/priority/AccountSelectTable.vue'
import listPreviewTable from '@/components/priority/ListPreviewTable.vue'
</script>
<template>
  <div class="navigationBarStyleTop">
    <n-tabs type="line" animated>
      <n-tab-pane name="accountSelectTable" tab="账号选择">
        <accountSelectTable></accountSelectTable>
      </n-tab-pane>
      <n-tab-pane name="listPreviewTable" tab="榜单预览">
        <listPreviewTable></listPreviewTable>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss">
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>

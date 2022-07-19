<script lang="ts" setup>
import { NTabs, NTabPane } from 'naive-ui'
import AccountSelectTable from '@/components/user/priority/AccountSelectTable.vue'
import ListPreviewTable from '@/components/user/priority/ListPreviewTable.vue'
</script>
<template>
  <div class="bgStyle">
    <n-tabs animated type="line">
      <n-tab-pane name="accountSelectTable" tab="账号选择">
        <AccountSelectTable></AccountSelectTable>
      </n-tab-pane>
      <n-tab-pane name="listPreviewTable" tab="榜单预览">
        <listPreviewTable></listPreviewTable>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss">
.bgStyle {
  height: 100%;
  width: 92%;
  margin: 1.5vw 0 0 0.5vw;
  padding: 3%;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: auto;
  }
}
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>

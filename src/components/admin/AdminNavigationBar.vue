<script lang="ts" setup>
import { NTabs, NTabPane } from 'naive-ui'
import Monitor from '@/components/admin/Monitor.vue'
</script>
<template>
  <div class="navigationBarStyleTop">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="FaceBook">
        <Monitor></Monitor>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="YouTube"></n-tab-pane>
      <n-tab-pane name="chap3" tab="Twitter"></n-tab-pane>
      <n-tab-pane name="chap4" tab="Instagram's"></n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss">
.navigationBarStyleTop {
  padding-top: calc(2%);
  border-radius: 15px;
  background-color: white;
  display: flex;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);

  .n-tabs .n-tabs-nav {
    line-height: 1.4;
    border-radius: 50px;
    justify-content: center;
  }

  .n-tabs .n-tabs-rail {
    border-radius: 15px;
    width: 50%;
  }

  .n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab {
    border-radius: 15px;
  }

  .card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
  }
}
</style>

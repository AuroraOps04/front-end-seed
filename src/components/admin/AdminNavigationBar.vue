<script lang="ts" setup>
import {defineComponent, defineExpose} from 'vue'
import {NCard, NTabs, NTabPane} from 'naive-ui'
import {ref} from 'vue'
import Monitor from '@/components/admin/Monitor.vue'

</script>
<template>
  <div class="navigationBarStyleTop">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="FaceBook">
        <Monitor></Monitor>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="YouTube">
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="Twitter">
      </n-tab-pane>
      <n-tab-pane name="chap4" tab="Instagrams">
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss" >
.navigationBarStyleTop {
  padding-top: calc(2%) ;
  border-radius: 15px;
  background-color: white;
}
.n-tabs .n-tabs-nav {
  line-height: 1.4;
  border-radius: 50px;
  justify-content: center;
}

.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab {
  border-radius: 15px;
}

.n-tabs .n-tabs-rail {
  border-radius: 15px;
  width:50%
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>

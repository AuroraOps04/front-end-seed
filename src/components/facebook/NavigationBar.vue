<script lang="ts" setup>
import { defineExpose, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'

import FaceBookList from '@/components/facebook/FaceBookList.vue'

const faceBookListRef = ref<any>()

function NavigationBarMethod(accountName: string) {
  faceBookListRef.value.receiveParametersMethods(accountName)
}

defineExpose({ NavigationBarMethod })
</script>
<template>
  <div class="navigationBarStyleTop">
    <NTabs type="segment">
      <NTabPane name="chap1" tab="FaceBook榜单">
        <FaceBookList ref="faceBookListRef"></FaceBookList>
      </NTabPane>
      <n-tab-pane name="chap2" tab="YouTube榜单"></n-tab-pane>
      <n-tab-pane name="chap3" tab="Twitter榜单"></n-tab-pane>
      <n-tab-pane name="chap4" tab="Instagrams榜单"></n-tab-pane>
      <n-tab-pane name="chap5" tab="更多榜单"></n-tab-pane>
      <n-tab-pane name="chap6" tab="自定义榜单"></n-tab-pane>
    </NTabs>
  </div>
</template>
<style lang="scss">
.n-tabs-rail {
  @media screen and (min-width: 320px) and (max-width: 480px) {
    display: flex;
    flex-wrap: wrap;
  }
}

.navigationBarStyleTop {
  margin-top: -20px;
  border-radius: 15px;
  background-color: white;
}

.n-tabs .n-tabs-nav {
  line-height: 2.2;
  border-radius: 10px;
}

.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab {
  border-radius: 15px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    border-radius: 2vw;
    margin: 0 2vw;
  }
}

.n-tabs .n-tabs-rail {
  border-radius: 15px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    border-radius: 2vw;
  }
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>

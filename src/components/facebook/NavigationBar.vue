<script lang="ts" setup>
  import { defineComponent, defineExpose } from 'vue'
  import { NCard,NTabs,NTabPane }  from 'naive-ui'
  import {ref} from 'vue'
  import FaceBookList from '@/components/facebook/FaceBookList.vue'

  const faceBookListRef = ref<any>();
  function NavigationBarMethod(accountName:string){
    faceBookListRef.value.receiveParametersMethods(accountName)
  }
  defineExpose({NavigationBarMethod})
</script>
<template>
  <div class="navigationBarStyleTop">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="FaceBook榜单">
        <FaceBookList ref="faceBookListRef"></FaceBookList>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="YouTube榜单">
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="Twitter榜单">
      </n-tab-pane>
      <n-tab-pane name="chap4" tab="Instagrams榜单">
      </n-tab-pane>
      <n-tab-pane name="chap5" tab="更多榜单">
      </n-tab-pane>
      <n-tab-pane name="chap6" tab="自定义榜单">
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss">
  .navigationBarStyleTop {
    margin-top:-20px;
    border-radius:15px;
    background-color: white;
  }
  .n-tabs .n-tabs-nav {
    line-height: 2.2;
    border-radius: 10px;
  }
  .n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab{
    border-radius:15px;
  }
  .n-tabs .n-tabs-rail{
    border-radius:15px;
  }
  .card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
  }
</style>

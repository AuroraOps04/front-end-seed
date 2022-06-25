<template>
  <div class="navigationBarStyleTop">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="FaceBook榜单" name="first">
        <FaceBookList></FaceBookList>
      </el-tab-pane>
      <el-tab-pane label="YouTube榜单" name="second">Config</el-tab-pane>
      <el-tab-pane label="Twitter榜单" name="third">Role</el-tab-pane>
      <el-tab-pane label="Instagrams榜单" name="fourth">Task</el-tab-pane>
      <el-tab-pane label="更多榜单" name="six">Task</el-tab-pane>
      <el-tab-pane label="自定义榜单" name="seven">Task</el-tab-pane>

    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
  import {ref} from 'vue'
  import FaceBookList from './FaceBookList.vue'

  components:{
    FaceBookList
  }

  const activeName = ref('first')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>
<style>
  .navigationBarStyleTop {
    background-color: white;
  }

  .demo-tabs > .el-tabs__content {
    padding-top: 5px;
    position: relative;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
    width: calc(100%);
  }

  .el-tabs__item {
    padding: 0 45px;
    font-size: 20px;
    color: #212942;
  }
</style>

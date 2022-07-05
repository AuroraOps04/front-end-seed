<script lang="ts" setup>
import AdminNavigationBar from '@/components/admin/AdminNavigationBar.vue'
</script>
<template>
  <div class="container">
    <div class="container_table">
      <div>
        <AdminNavigationBar ref="navigationBarRef"></AdminNavigationBar>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
html,
body,
#app {
  height: 100%;
}

.container {
  width: 100%;
  background-color: red;

  .container_table {
    width: calc(98% - 110px);
    border: 1px solid white;
    margin: 50px 45px 30px 65px;

    background-color: white;
    height: 100vh;
  }
}
</style>

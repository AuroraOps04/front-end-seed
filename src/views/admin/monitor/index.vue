<script lang="ts" setup>
import AdminNavigationBar from '@/components/admin/AdminNavigationBar.vue'
</script>
<template>
  <div class="container">
    <div class="container_table">
      <AdminNavigationBar ref="navigationBarRef"></AdminNavigationBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
html,
body,
#app {
  height: 100%;
}

.container {
  width: 100%;
  display: flex;
  height: 100vh;
  box-sizing: border-box;

  .container_table {
    width: calc(98% - 110px);
    border: 1px solid white;
    margin: 50px 45px 30px 65px;
    border-radius: 17px;
    background-color: white;
    height: 500px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 80vw;
      margin: 0;
    }
  }
}
</style>

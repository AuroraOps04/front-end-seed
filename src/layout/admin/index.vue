<script lang="ts" setup>
import Main from './main.vue'
import Aside from './aside.vue'
import Header from './header.vue'
</script>
<template>
  <div class="admin-layout">
    <Header />
    <Aside />
    <Main />
  </div>
</template>
<style lang="scss" scoped>
.admin-layout {
  height: 100%;
  width: 100%;
}
</style>

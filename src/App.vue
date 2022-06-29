<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>
<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>

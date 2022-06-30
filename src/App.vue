<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
import { onMounted } from "vue"
import { useStore } from "vuex"

// window.$message = useMessage()
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup



const store = useStore()

onMounted(() => {
  store.dispatch('fetchCurrentUser')
})

</script>
<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<style>
html,
body,
#app {
  height: 100%;
}
</style>

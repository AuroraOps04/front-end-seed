<script lang="ts" setup>
import { NConfigProvider, GlobalThemeOverrides, NMessageProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

// window.$message = useMessage()
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

const store = useStore()
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1684FC',
    primaryColorHover: '#1684FC'
  }
}

onMounted(() => {
  store.dispatch('fetchCurrentUser')
})
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html,
body,
#app,
.n-config-provider {
  height: 100%;
}
</style>

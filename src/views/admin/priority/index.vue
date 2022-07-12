<script lang="ts" setup>
import priorityMenu from '@/components/priority/PriorityMenu.vue'
</script>
<template>
  <div class="container">
    <div class="container_table">
      <div>
        <priorityMenu></priorityMenu>
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
  height: 100%;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    width: 80vw;
  }

  .container_table {
    width: calc(98% - 10px);
    border: 1px solid white;
    background-color: white;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: auto;
    }
  }
}
</style>

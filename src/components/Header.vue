<script lang="ts" setup>
import {NAvatar} from "naive-ui";
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const avatar = ref("头像")
const menuArr = reactive([
  {
    name: "首页",
    code: "home",
    isSelect: true
  },
  {
    name: "排行榜",
    code: "Leaderboard",
    isSelect: false
  }
])
const handleTo = (e: string) => {
  store.commit('SET_MENU', e);
  router.push("/"+e);
}
</script>

<template>
  <div class="header-bg">
    <div class="title">
      <template v-for="item in menuArr">
        <span @click="handleTo(item.code)" :style="{backgroundColor:item.code===store.state.menu?'#113691':'black'}">{{
            item.name
          }}</span>
      </template>
    </div>
    <div class="avatar" @click="handleTo('person')">
      <n-avatar round :size="35" :src="store.getters.currentPictureUrl"></n-avatar>
      <span style="margin: 0 5px;">个人中心</span>
    </div>
  </div>
</template>

<style lang="scss">
.header-bg {
  background-color: black;
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    height: 100%;

    span {
      height: 100%;
      padding: 0 10px;
      margin: 0 10px;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
    }

    span:hover {
      background-color: #113691;
      opacity: 0.7;
    }
  }

  .avatar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 150px;

    span {
      color: white;
      cursor: pointer;
    }

    span:hover {
      opacity: 0.7;
    }
  }
}
</style>

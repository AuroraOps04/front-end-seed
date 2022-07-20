<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NAvatar } from 'naive-ui'

const router = useRouter()
const store = useStore()
const menuArr = reactive([
  {
    name: '首页',
    code: 'home',
    isSelect: true
  },
  {
    name: '排行榜',
    code: 'Leaderboard',
    isSelect: false
  }
])
const handleTo = (e: string) => {
  store.commit('SET_MENU', e)
  router.push(`/${e}`)
}
</script>

<template>
  <div class="header-bg">
    <div class="title">
      <template v-for="(item, index) in menuArr" :key="index">
        <span
          :style="{ backgroundColor: item.code === store.state.menu ? '#113691' : 'black' }"
          @click="handleTo(item.code)"
          >{{ item.name }}
        </span>
      </template>
    </div>
    <div class="avatar">
      <NAvatar :size="35" :src="store.getters?.currentPictureUrl" round></NAvatar>
      <!--      <span style="margin: 0 5px">个人中心</span>-->
      <span v-if="!store.getters.currentId" style="margin: 0 5px" @click="handleTo('login')">
        登录
      </span>
      <span v-else style="margin: 0 5px" @click="handleTo('person/person')">个人中心</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-bg {
  background-color: black;
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 10vw;
  }

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
      @media screen and (min-width: 320px) and (max-width: 480px) {
        padding: 0 2vw;
        margin: 0 2vw;
        line-height: 10vw;
      }
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
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 40vw;
    }

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

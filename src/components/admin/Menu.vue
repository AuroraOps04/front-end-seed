<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NAvatar } from 'naive-ui'
import menuLogo from '@/assets/menu_logo.png'
import menuHome from '@/assets/menu_home.png'
import menuUser from '@/assets/menu_user.png'
import menuMonitor from '@/assets/menu_monitor.png'
import menuAnalysis from '@/assets/menu_analysis.png'
import menuSetting from '@/assets/menu_setting.png'

const router = useRouter()
const store = useStore()
console.log(`路由信息：${router.getRoutes()}`)
const menuArr = reactive([
  {
    name: '首页',
    icon: menuHome,
    path: '/admin/menu/home',
    isSelect: true
  },
  {
    name: '用户列表管理',
    icon: menuUser,
    path: '/admin/menu/userList',
    isSelect: false
  },
  {
    name: '监测账号管理',
    icon: menuMonitor,
    path: '/admin/menu/monitor',
    isSelect: false
  },
  {
    name: '重点榜单管理',
    icon: menuAnalysis,
    path: '/',
    isSelect: false
  },
  {
    name: '账号密码管理',
    icon: menuSetting,
    path: '/',
    isSelect: false
  }
])
const handleClickMenu = (e: string) => {
  menuArr.forEach((item) => {
    const b = item.name === e
    item.isSelect = b
    if (b) {
      router.push(item.path)
      store.commit('SET_MENU', e)
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="menu">
      <div class="menu-logo">
        <img :src="menuLogo" alt="logo" />
      </div>
      <template v-for="item in menuArr">
        <div
          :class="['menu-item', item.isSelect ? 'menu-active' : '']"
          @click="handleClickMenu(item.name)"
        >
          <img :src="item.icon" :alt="item.name" />
          <span>
            {{ item.name }}
          </span>
        </div>
      </template>
    </div>
    <div class="main">
      <div class="header">
        <div class="header-left">
          <span>{{ store.getters.currentMenu.replaceAll('管理', '') }}</span>
        </div>
        <div class="header-right">
          <NAvatar round :size="40" src=""></NAvatar>
          <span class="title">管理端</span>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 100%;

  .menu {
    width: 280px;
    background-image: linear-gradient(to bottom, white, rgba(231, 233, 254, 0.3));
    border-top-right-radius: 30px;
    box-shadow: #e6ecfc 0 0 20px;
    padding: 2vw 0 10vw 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media screen and (min-width: 320px) and (max-width: 480px) {
      border-top-right-radius: 3vw;
      width: 20vw;
    }

    .menu-logo {
      margin-bottom: 10vw;

      img {
        width: 107px;
        height: 69px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 10vw;
          height: auto;
        }
      }
    }

    .menu-item {
      width: calc(100% - 5px);
      height: 60px;
      position: relative;
      border-left: 5px solid rgba(0, 0, 0, 0);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: stretch;
      cursor: pointer;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        height: 20vw;
        justify-content: center;
        flex-direction: column;
      }

      img {
        width: 30px;
        height: 30px;
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 5vw;
          height: auto;
          margin: 0 2vw;
        }
      }

      span {
        font-size: 15px;
        color: #212942;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          flex-direction: column;
          font-size: 4vw;
          line-height: 5vw;
          text-align: center;
        }
      }

      span:hover {
        opacity: 0.7;
      }
    }

    .menu-active {
      background: #e6ecfc;
      border-left: 5px solid #212942;
    }

    .menu-active::before {
      position: absolute;
      content: '';
      width: 30px;
      height: 30px;
      display: block;
      text-align: center;
      background-image: radial-gradient(30px at 0px 0px, rgba(0, 0, 0, 0) 30px, #e6ecfc 30px);
      top: -30px;
      right: 0;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 3vw;
        height: 3vw;
        background-image: radial-gradient(3vw at 0px 0px, rgba(0, 0, 0, 0) 3vw, #e6ecfc 3vw);
        top: -3vw;
      }
    }

    .menu-active::after {
      position: absolute;
      content: '';
      width: 30px;
      height: 30px;
      display: block;
      text-align: center;
      background-image: radial-gradient(30px at 0px 30px, rgba(0, 0, 0, 0) 30px, #e6ecfc 30px);
      bottom: -30px;
      right: 0;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 3vw;
        height: 3vw;
        background-image: radial-gradient(3vw at 0 3vw, rgba(0, 0, 0, 0) 3vw, #e6ecfc 3vw);
        bottom: -3vw;
      }
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    width: 100%;

    .header {
      height: 60px;
      box-shadow: #e6ecfc 0 0 20px;
      padding: 0 3vw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      z-index: -1;
      border-top-left-radius: 30px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        height: 15vw;
        border-top-left-radius: 3vw;
      }

      .header-left {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        height: 100%;
        border-bottom: 5px solid #212942;
        width: 80px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 20vw;
        }
        span {
          font-size: 15px;
          line-height: 40px;
          text-align: center;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }
      }

      .header-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .title {
          cursor: pointer !important;
          font-size: 15px;
          margin: 0 15px;
          text-decoration: underline;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
            margin: 0 4vw;
          }
        }

        .title:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>

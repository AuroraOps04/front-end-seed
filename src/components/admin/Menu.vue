<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import menuLogo from '@/assets/menu_logo.png'
import menuHome from '@/assets/menu_home.png'
import menuUser from '@/assets/menu_user.png'
import menuMonitor from '@/assets/menu_monitor.png'
import menuAnalysis from '@/assets/menu_analysis.png'
import menuSetting from '@/assets/menu_setting.png'

const router = useRouter()
console.log(`路由信息：${router.getRoutes()}`)
const menuArr = reactive([
  {
    name: '首页',
    icon: menuHome,
    path: '/',
    isSelect: true
  },
  {
    name: '用户列表管理',
    icon: menuUser,
    path: '/',
    isSelect: false
  },
  {
    name: '监测账号管理',
    icon: menuMonitor,
    path: '/',
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
    item.isSelect = item.name === e
  })
}
</script>

<template>
  <div>
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
  </div>
</template>

<style lang="scss">
.menu {
  width: 280px;
  height: 100%;
  background-image: linear-gradient(to bottom, white, rgba(231, 233, 254, 0.3));
  border-top-right-radius: 30px;
  box-shadow: #e6ecfc 0 0 20px;
  padding: 2vw 0 10vw 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .menu-logo {
    margin-bottom: 10vw;

    img {
      width: 107px;
      height: 69px;
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

    img {
      width: 30px;
      height: 30px;
      margin: 0 20px;
    }

    span {
      font-size: 15px;
      color: #212942;
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
  }
}
</style>

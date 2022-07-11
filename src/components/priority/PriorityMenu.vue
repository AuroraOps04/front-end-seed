<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NDivider } from 'naive-ui'

const router = useRouter()

const menuArr = reactive([
  {
    name: 'Facebook',
    path: '/priority/priorityFacebookPage',
    isSelect: true
  },
  {
    name: 'YouTube',
    path: '/',
    isSelect: false
  },
  {
    name: 'Twitter',
    path: '/',
    isSelect: false
  },
  {
    name: 'Instagrams',
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
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="menu">
      <div class="menu-txt">榜单名称</div>
      <template v-for="item in menuArr">
        <div
          :class="['menu-item', item.isSelect ? 'menu-active' : '']"
          @click="handleClickMenu(item.name)"
        >
          <span>
            {{ item.name }}
          </span>
        </div>
      </template>
      <n-divider dashed></n-divider>
      <vxe-button class="buttonStyle" type="text" icon="vxe-icon--circle-plus">新增榜单</vxe-button>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.buttonStyle {
  width: 100%;
  color: #1c294f;
  font-weight: bolder;
  font-size: 16px;
}
.content {
  display: flex;
  flex-direction: row;
  height: 43vw;

  .menu {
    width: 150px;
    background-image: linear-gradient(to bottom, white, rgba(231, 233, 254, 0.3));
    border-radius: 15px;
    box-shadow: #f1f5fd 0 0 20px;
    margin: 2vw 10px 1vw 10px;
    padding: 25px 0 10vw 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 12vw;
    }

    .menu-txt {
      font-size: 17px;
      color: #1c294f;
      font-weight: bolder;
      margin-bottom: 3vw;
    }

    .menu-item {
      width: calc(100% - 5px);
      height: 40px;
      margin-bottom: 10px;
      border-left: 5px solid rgba(0, 0, 0, 0);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        height: 20vw;
        justify-content: center;
        flex-direction: column;
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
  }
}
</style>

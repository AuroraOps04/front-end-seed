<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NAvatar } from 'naive-ui'

const router = useRouter()
const store = useStore()
console.log(`路由信息：${router.getRoutes()}`)
const menuArr = reactive([
  {
    name: '地区管理',
    path: '/admin/menu/propertyMenu/areaList',
    isSelect: true
  },
  {
    name: '分类管理',
    path: '/admin/menu/propertyMenu/categoryList',
    isSelect: false
  }
])
const handleClickMenu = (e: string) => {
  menuArr.forEach((item) => {
    const tempItem: any = item
    const b = tempItem.name === e
    tempItem.isSelect = b
    if (b) {
      router.push(tempItem.path)
      store.commit('SET_MENU', e)
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="menu">
      <h3>子菜单</h3>
      <template v-for="(item, index) in menuArr" :key="index">
        <div
          :class="['menu-item', item.isSelect ? 'menu-active' : '']"
          @click="handleClickMenu(item.name)"
        >
          {{ item.name }}
        </div>
      </template>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 100%;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
  }
  .menu {
    margin-top: 50px;
    margin-left: 20px;
    width: 105px;
    border-radius: 12px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 0;
      width: 100%;
    }

    h3 {
      margin-left: 24px;
      margin-top: 20px;
      margin-bottom: 30px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        margin: 5vw;
      }
    }
    .menu-item {
      width: calc(100% - 5px);
      height: 40px;
      position: relative;
      border-left: 5px solid rgba(0, 0, 0, 0);
      flex-direction: row;
      align-items: center;
      justify-content: stretch;
      cursor: pointer;

      font-size: 13px;
      font-weight: 700;
      color: #c1c9dd;
      text-align: center;
    }

    .menu-active {
      background: #e6ecfc;
      color: #212942;
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

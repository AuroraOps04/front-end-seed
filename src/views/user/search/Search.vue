<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutSider,
  NLayoutFooter,
  NSelect,
  NInput,
  NInputGroup,
  NDropdown,
  NButton,
  NIcon,
  useMessage
} from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import logoPng from '@/assets/logo.png'
import searchBgPng from '@/assets/search_bg.png'
import Header from '@/components/body/Header.vue'

const router = useRouter()
const message = useMessage()
const menu = ref<string>('inner')
const handleMenu = (e: string) => {
  menu.value = e
  localStorage.setItem('SEARCH_MENU', e)
}
const selectOptions = reactive([
  {
    label: '全文',
    value: 'all'
  },
  {
    label: '标题',
    value: 'title'
  },
  {
    label: '发布媒体',
    value: 'media'
  },
  {
    label: '作者',
    value: 'author'
  }
])
const selectValue = ref<string>('全文')
const searchValue = ref<string>('')
const handleSearch = () => {
  console.log(selectValue.value)
}
const handleTo = () => {
  router.push('/searchDetail')
}
</script>
<template>
  <div>
    <Header></Header>
    <n-space vertical size="large">
      <n-layout has-sider>
        <n-layout-header>
          <div class="header">
            <img :src="logoPng" alt="logo" />
          </div>
        </n-layout-header>
      </n-layout>
      <n-layout has-sider>
        <n-layout-content>
          <div class="content">
            <div class="box">
              <img :src="searchBgPng" alt="搜索" />
              <div class="menu">
                <span
                  :class="[menu === 'inner' ? 'active' : 'default']"
                  @click="handleMenu('inner')"
                  >站内搜索</span
                >
                <span :class="[menu === 'all' ? 'active' : 'default']" @click="handleMenu('all')"
                  >全网搜索</span
                >
              </div>
              <n-input-group class="search" @click="handleTo()">
                <n-select
                  :style="{ width: '25%' }"
                  v-model:value="selectValue"
                  :options="selectOptions"
                  :bordered="false"
                  class="size"
                />
                <n-input
                  :style="{ width: '60%' }"
                  :bordered="false"
                  class="size"
                  placeholder="请输入搜索词进入全网搜索"
                  v-model:value="searchValue"
                />
                <n-button
                  :style="{ width: '21%' }"
                  :bordered="false"
                  class="btn-search size"
                  @click="handleSearch"
                >
                  <template #icon>
                    <n-icon>
                      <SearchOutline />
                    </n-icon>
                  </template>
                  搜索
                </n-button>
              </n-input-group>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-space>
  </div>
</template>
<style lang="scss" scoped>
.n-layout-header {
  background-image: url('@/assets/home_bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  height: 150px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 20vw;
  }
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    img {
      width: auto;
      height: 40px;
      margin-left: 40px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        height: 8vw;
      }
    }
  }
}
.n-layout-content {
  .content {
    margin: 20px 50px;
    height: 687px;
    line-height: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    box-shadow: 0 2px 10px 5px rgba(46, 67, 119, 0.13);
    display: flex;
    align-items: center;
    justify-content: center;
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 380px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          height: 15vw;
          width: auto;
        }
      }
      .menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .default {
          color: rgba(15, 19, 31, 84);
          font-size: 16px;
          margin: 5px;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }
        .active {
          color: rgba(15, 19, 31, 84);
          font-size: 18px;
          font-weight: bold;
          margin: 5px;
          cursor: pointer;
          border-bottom: 3px solid rgba(255, 156, 77, 26);
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }
        .default:hover,
        .active:hover {
          opacity: 0.7;
        }
      }
      .search {
        width: 450px;
        height: 40px;
        line-height: 40px;
        border-radius: 25px;
        border: 1px solid #ff7c40;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 70vw;
          font-size: 4vw;
        }

        .size {
          height: 40px;
          line-height: 40px;
          border: 50px;
        }
        ::v-deep .n-base-selection-label {
          height: 40px;
          border-radius: 20px;
        }
        .btn-search {
          background: #ff7c40;
          border-radius: 20px;
          color: white;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

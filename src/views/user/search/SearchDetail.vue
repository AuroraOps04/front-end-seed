<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
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
  NCheckboxGroup,
  NCheckbox,
  NDivider,
  NDatePicker,
  NRadioGroup,
  NRadio,
  useMessage
} from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { getPostBySearch } from '@service/search'
import logoPng from '@/assets/logo.png'
import searchBgPng from '@/assets/search_bg.png'
import Header from '@/components/body/Header.vue'

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
const thisYear = ref<number>(0)
const range = ref<[number, number]>([0, Date.now()])
const timeTypeValue = ref('all')
const timeOptions = reactive([
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '今天',
    value: 'today'
  },
  {
    label: '昨天',
    value: 'yesterday'
  },
  {
    label: '近三天',
    value: 'threeDays'
  },
  {
    label: '近七天',
    value: 'week'
  },
  {
    label: '自定义时间',
    value: 'other'
  }
])
const searchObj = reactive<API.SearchPostRequest>({
  search: '',
  categoryId: -1,
  areaId: -1,
  dateTime: ''
})
type Post = {
  recordId: number
  postId: string
  publishTime: string
  content: string
  accountId: number
  accountCode: string
  accountName: string
  platformId: number
  platformName: string
}
type PostData = {
  data: Post[]
}
const postData = reactive<PostData>({
  data: []
})
const getThisYear = () => {
  const date = new Date()
  date.setDate(1)
  date.setMonth(0)
  thisYear.value = date.getTime()
}
const handleSearch = async () => {
  searchObj.search = searchValue.value
  searchObj.dateTime = range.value.join(',')
  const res = await getPostBySearch(searchObj)
  postData.data = res.data as Post[]
  console.log(postData.data)
}
watch(timeTypeValue, () => {
  const dayTimestamp = 24 * 60 * 60 * 1000
  // 今天时间戳
  if (timeTypeValue.value === 'all') {
    range.value = [0, Date.now()]
    return
  }
  // 今天时间戳
  if (timeTypeValue.value === 'today') {
    range.value = [Date.now(), Date.now()]
    return
  }
  // 昨天时间戳
  if (timeTypeValue.value === 'yesterday') {
    Date.now()
    range.value = [Date.now() - dayTimestamp, Date.now()]
    return
  }
  // 三天前时间戳
  if (timeTypeValue.value === 'threeDays') {
    range.value = [Date.now() - dayTimestamp * 3, Date.now()]
    return
  }
  // 一周前时间戳
  if (timeTypeValue.value === 'week') {
    range.value = [Date.now() - dayTimestamp * 7, Date.now()]
  }
})
onMounted(() => {
  getThisYear()
})
</script>
<template>
  <div>
    <Header></Header>
    <n-space vertical size="large">
      <n-layout has-sider>
        <n-layout-header>
          <div class="header">
            <img :src="searchBgPng" alt="logo" />
          </div>
        </n-layout-header>
      </n-layout>
      <n-layout has-sider>
        <n-layout-content>
          <div class="content">
            <div class="box">
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
              <n-input-group class="search">
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
            <n-divider />
            <div class="search">
              <div class="condition">
                <span>时间范围:</span>
                <n-radio-group
                  v-model:value="timeTypeValue"
                  name="radiogroup"
                  on-update:handleRadio
                >
                  <n-space>
                    <n-radio v-for="song in timeOptions" :key="song.value" :value="song.value">
                      {{ song.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
                <n-date-picker
                  v-model:value="range"
                  type="daterange"
                  :disabled="timeTypeValue !== 'other'"
                />
              </div>
              <div class="condition">
                <!--              <span>媒体类型</span>-->
                <!--              <n-checkbox-group v-model:value="cities">-->
                <!--                <n-space item-style="display: flex;">-->
                <!--                  <n-checkbox value="Beijing" label="北京" />-->
                <!--                  <n-checkbox value="Shanghai" label="上海" />-->
                <!--                  <n-checkbox value="Guangzhou" label="广州" />-->
                <!--                  <n-checkbox value="Shenzen" label="深圳" />-->
                <!--                </n-space>-->
                <!--              </n-checkbox-group>-->
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
      <n-layout has-sider>
        <n-layout-content>
          <div class="content">
            <div class="menu">
              <div>
                <n-button>显示标题</n-button>
                <n-button>显示内容</n-button>
              </div>
              <div>
                <n-select
                  :style="{ width: '100px' }"
                  v-model:value="selectValue"
                  :options="selectOptions"
                  class="size"
                />
              </div>
            </div>
            <n-divider />
            <div class="detail">
              <n-card v-for="item in postData.data">
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: space-around;
                    "
                  >
                    <div style="text-align: left">{{ item.content }}</div>
                    <br />
                    <div
                      style="
                        display: flex;
                        justify-content: start;
                        align-items: baseline;
                        width: 100%;
                        flex-direction: column;
                      "
                    >
                      <span>发布账号名：{{ item.accountName }}</span>
                      <span>发布平台：{{ item.platformName }}</span>
                    </div>
                  </div>
                  <div style="flex-shrink: 0">{{ item.publishTime }}</div>
                </div>
                <n-divider />
              </n-card>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-space>
  </div>
</template>
<style lang="scss" scoped>
.n-layout-header {
  background: white;
  height: 150px;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100%;

    img {
      width: auto;
      height: 80px;
      margin-left: 80px;
    }
  }
}

.n-layout-content {
  height: 100%;

  .content {
    height: 100%;
    margin: 10px 50px;
    padding: 20px;
    line-height: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    box-shadow: 0 2px 10px 5px rgba(46, 67, 119, 0.13);
    display: flex;
    flex-direction: column;
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

    .search {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .condition {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        span {
          margin-right: 20px;
        }
      }
    }

    .menu {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>

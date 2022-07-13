<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  PersonOutline,
  StarOutline,
  BarChartOutline,
  PersonCircleOutline,
  IdCardSharp,
  PhonePortraitOutline
} from '@vicons/ionicons5'
import {
  NAvatar,
  NIcon,
  NPopselect,
  NButton,
  NInput,
  NUpload,
  NModal,
  useMessage,
  UploadFileInfo
} from 'naive-ui'
import { updatePhoneApi, updateUsernameApi } from '@service/person'
import { VXETable } from 'vxe-table'
import personLogoPng from '@/assets/person_logo.png'
import personIconPng from '@/assets/person_icon.png'
import personIcon2Png from '@/assets/person_icon2.png'
import personIcon3Png from '@/assets/person_icon3.png'
import personGradePng from '@/assets/person_grade.png'
import rankingBgPng from '@/assets/ranking_bg.png'
import Header from '@/components/Header.vue'
import { accountCollectionListApi, AccountCollectionApi } from '@/service/account'

type AccountData = {
  count: number
  data: API.AccountData[]
}

const router = useRouter()
const message = useMessage()
const store = useStore()
const username = ref<string>('')
const phone = ref<string>('')
const menuArr = reactive([
  {
    name: '我的资料',
    code: 'person',
    isSelect: true
  },
  {
    name: '我的榜单',
    code: 'Leaderboard',
    isSelect: false
  },
  {
    name: '收藏账号',
    code: 'collect',
    isSelect: false
  }
])

// 账户信息
const accountData = reactive<AccountData>({
  count: 0,
  data: []
})

// 获取当前登录用户Id
const userId = store.getters.currentId

const handleClick = (e: string) => {
  menuArr.forEach((item) => {
    item.isSelect = item.code === e
  })
}
const showModal = ref(false)
const showModalUsername = ref(false)
const validatePhone = (): boolean => {
  if (phone.value === '') {
    message.error('请输入手机号')
    return false
  }
  if (!phone.value.match(/^1[3-9]\d{9}$/)) {
    message.error('手机号码格式不正确')
    return false
  }
  return true
}
const validateUsername = (): boolean => {
  if (username.value === '') {
    message.error('请输入新的昵称')
    return false
  }
  return true
}
const handleUpdatePhone = async () => {
  // 校验手机号码
  if (!validatePhone()) {
    return
  }

  try {
    const res = await updatePhoneApi(phone.value)
    console.log(res)
    message.success('修改成功')
    showModal.value = false
    router.go(0)
  } catch (e) {
    console.log(e)
  }
}
const handleUpdateUsername = async () => {
  // 校验昵称输入
  if (!validateUsername()) {
    return
  }

  try {
    const res = await updateUsernameApi(username.value)
    console.log(res)
    message.success('修改成功')
    showModalUsername.value = false
    router.go(0)
  } catch (e) {
    console.log(e)
  }
}
const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (data.file.file?.type !== 'image/png') {
    message.error('只能上传png格式的图片文件，请重新上传')
    return false
  }
  return true
}
const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  console.log(event)
  console.log(2222)
  if (event?.isTrusted) {
    router.go(0)
  }
  // message.success((event?.target as XMLHttpRequest).response)
  // const ext = file.name.split('.')[1]
  // file.name = `更名.${ext}`
  // file.url = '__HTTPS__://www.mocky.io/v2/5e4bafc63100007100d8b70f'
  return file
}
const handleShowModalUsername = (e: boolean) => {
  showModalUsername.value = e
  username.value = ''
}
const handleShowModal = (e: boolean) => {
  showModal.value = e
  phone.value = ''
}

// 查询用户账号收藏列表
const selectUserCollectionList = async () => {
  const res = await accountCollectionListApi(1)
  accountData.data = res.data as API.AccountData[]
}

// 取消收藏
const unCollection = async (row: any) => {
  const type = await VXETable.modal.confirm('您是否要取消收藏?')
  if (type === 'confirm') {
    AccountCollectionApi(row.accountId, userId)
    await VXETable.modal.message('取消成功')
    selectUserCollectionList()
  }
}

// 点击前往账号详情页
const goToAccountPage = async (row: any) => {
  router.push({
    path: `/Account/${row.accountId}`
  })
}

onMounted(() => {
  selectUserCollectionList()
})
</script>

<template>
  <div>
    <Header />
    <div class="person-top">
      <!-- logo -->
      <div class="person-top-menu-logo">
        <img :src="personLogoPng" alt="logo" />
        <span></span>
        <div class="logo-title">
          <span>潮汐</span>
          <span style="color: black">指数</span>
        </div>
      </div>
    </div>

    <div class="person-main">
      <div class="main">
        <div class="main-menu">
          <div class="menu-avatar">
            <NAvatar round :size="50" :src="store.getters.currentPictureUrl"> </NAvatar>
          </div>
          <span class="menu-username">{{ store.getters.currentUsername }}</span>
          <div class="menu-identification">
            <img :src="personGradePng" alt="用户等级" />
            <div class="identification-grade">用户等级</div>
          </div>
          <hr style="background: rgba(140, 140, 140, 0.02)" />
          <div class="menu-list">
            <div class="list-content" v-for="(item, index) in menuArr" :key="index">
              <NIcon
                size="25"
                v-if="item.code === 'person'"
                :component="PersonOutline"
                :color="item.isSelect ? '#F78B32' : 'black'"
                @click="handleClick(item.code)"
              />
              <NIcon
                size="25"
                v-else-if="item.code === 'Leaderboard'"
                :component="BarChartOutline"
                :color="item.isSelect ? '#F78B32' : 'black'"
                @click="handleClick(item.code)"
              />
              <NIcon
                size="25"
                v-else-if="item.code === 'collect'"
                :component="StarOutline"
                :color="item.isSelect ? '#F78B32' : 'black'"
                @click="handleClick(item.code)"
              />
              <span
                :style="{ color: item.isSelect ? '#F78B32' : 'black' }"
                @click="handleClick(item.code)"
                >{{ item.name }}</span
              >
            </div>
          </div>
        </div>

        <div class="main-content">
          <template v-for="(item, index) in menuArr" :key="index">
            <div class="content-header" v-if="item.isSelect">
              <span>{{ '/' + item.name }}</span>
            </div>
            <hr style="background-color: rgb(239, 239, 239)" v-if="item.isSelect" />
            <div v-if="item.code === 'person' && item.isSelect" class="content-person">
              <div class="person-list">
                <div class="list-title">
                  <NIcon size="40" :component="PersonCircleOutline" color="black" :depth="3" />
                  <span>头像</span>
                </div>
                <div class="list-info">
                  <n-avatar round :size="48" :src="store.getters.currentPictureUrl"> </n-avatar>
                </div>
                <div class="list-controller">
                  <NPopselect trigger="click">
                    <span>更换头像</span>
                    <template #empty>
                      <NUpload
                        action="https://test1.auni.top/api/user/updatePictrue"
                        @before-upload="beforeUpload"
                        @finish="handleFinish"
                      >
                        <NButton>上传图片</NButton>
                      </NUpload>
                    </template>
                  </NPopselect>
                </div>
              </div>

              <div class="person-list">
                <div class="list-title">
                  <NIcon size="40" :component="IdCardSharp" color="black" :depth="3" />
                  <span>账号</span>
                </div>
                <div class="list-info">
                  {{ store.getters.currentUsername }}
                </div>

                <div class="list-controller">
                  <span @click="handleShowModalUsername(true)">修改名称</span>
                </div>
                <NModal
                  v-model:show="showModalUsername"
                  :mask-closable="false"
                  preset="dialog"
                  title="Dialog"
                >
                  <template #header>
                    <span>修改名称</span>
                  </template>
                  <div>
                    <NInput v-model:value="username" placeholder="请输入新的名称"></NInput>
                  </div>
                  <template #action>
                    <NButton @click="handleUpdateUsername" type="primary">确认</NButton>
                    <NButton @click="handleShowModalUsername(false)">取消</NButton>
                  </template>
                </NModal>
              </div>

              <!--              <div class="person-list">-->
              <!--                <div class="list-title">-->
              <!--                  <NIcon size="40" :component="LockClosed" color="black" :depth="3"/>-->
              <!--                  <span>密码</span>-->
              <!--                </div>-->
              <!--                <div class="list-info">-->
              <!--                  ************-->
              <!--                </div>-->
              <!--                <div class="list-controller">修改密码</div>-->
              <!--              </div>-->

              <div class="person-list">
                <div class="list-title">
                  <NIcon size="40" :component="PhonePortraitOutline" color="black" :depth="3" />
                  <span>绑定手机号</span>
                </div>
                <div class="list-info">
                  {{ store.getters.currentPhone }}
                </div>
                <div class="list-controller">
                  <span @click="handleShowModal(true)">更换号码</span>
                </div>
                <NModal
                  v-model:show="showModal"
                  :mask-closable="false"
                  preset="dialog"
                  title="Dialog"
                >
                  <template #header>
                    <div>更换号码</div>
                  </template>
                  <div>
                    <NInput v-model:value="phone" placeholder="请输入新的电话号码"></NInput>
                  </div>
                  <template #action>
                    <NButton @click="handleUpdatePhone" type="primary">确认</NButton>
                    <NButton @click="handleShowModal(false)">取消</NButton>
                  </template>
                </NModal>
              </div>
            </div>
            <div v-else-if="item.code === 'Leaderboard' && item.isSelect" class="content-ranking">
              <img :src="rankingBgPng" alt="排行榜" />
            </div>
            <div v-else-if="item.code === 'collect' && item.isSelect" class="content-collect">
              <vxe-table
                border
                show-header-overflow
                show-overflow
                :row-config="{ isHover: true }"
                :data="accountData.data"
              >
                <vxe-column type="seq" align="center" title="序号" width="60"></vxe-column>
                <vxe-column align="center" title="账号">
                  <template #default="{ row }">
                    <div
                      style="display: flex; flex-wrap: nowrap; width: 100%"
                      @click="goToAccountPage(row)"
                    >
                      <div
                        style="width: 50%; display: flex; justify-content: left; padding-left: 20%"
                      >
                        <n-avatar round size="small">{{ row.accountPictureUrl }}</n-avatar>
                      </div>
                      <div style="width: 50%; display: flex">
                        <span>{{ row.accountName }}</span>
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column align="center" field="recordFan" title="粉丝数"></vxe-column>
                <vxe-column align="center" field="areaName" title="地区"></vxe-column>
                <vxe-column align="center" field="categoryName" title="类别"></vxe-column>
                <vxe-column
                  align="center"
                  field="platformName"
                  title="平台"
                  :visible="false"
                ></vxe-column>
                <vxe-column title="操作" align="center" width="60" show-overflow>
                  <template #default="{ row }">
                    <vxe-button
                      type="text"
                      icon="vxe-icon--close"
                      @click="unCollection(row)"
                    ></vxe-button>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </template>
        </div>
      </div>
      <img :src="personIconPng" class="maiNIcon1" alt="背景图标" />
      <img :src="personIcon2Png" class="maiNIcon2" alt="背景图标" />
      <img :src="personIcon3Png" class="maiNIcon3" alt="背景图标" />
    </div>
  </div>
</template>

<style lang="scss">
.person-top {
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  margin: 0 100px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 20vw;
    margin: 0 5vw;
  }

  .person-top-menu-logo {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    span {
      width: 20px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 5vw;
      }
    }

    img {
      width: 100px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 15vw;
      }
    }

    .logo-title span {
      color: #f78b32;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 1vw;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 6vw;
      }
    }
  }
}

.person-main {
  position: relative;
  height: 1000px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: auto;
  }

  .main {
    margin: 0 100px;
    height: 100%;
    border-radius: 20px;
    box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
    background-color: white;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 0 1vw;
    }

    .main-menu {
      height: 100%;
      width: 20%;
      border-radius: 20px;
      box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
      background: linear-gradient(to bottom, rgba(107, 122, 249, 0.15), white);
      display: flex;
      flex-direction: column;
      justify-content: start;

      .menu-avatar {
        margin: 25px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 5vw 0;
        }
      }

      .menu-username {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
      }

      .menu-identification {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 25px 0;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          flex-direction: column;
          margin: 2vw 0;
        }

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin-right: 0;
          }
        }

        .identification-grade {
          width: 100px;
          height: 30px;
          text-align: left;
          padding-left: 15px;
          line-height: 30px;
          border-radius: 15px;
          background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
          font-size: 16px;
          color: white;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            height: 6vw;
            line-height: 6vw;
            width: auto;
            font-size: 3vw;
            border-radius: 2vw;
            padding: 0 1vw;
            margin: 2vw 0;
          }
        }
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        margin: 30px 0;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 10vw 0;
        }

        .list-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            flex-direction: column;
          }

          span {
            margin: 0 10px;
            font-size: 16px;
            letter-spacing: 2px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 0;
              font-size: 3vw;
            }
          }
        }

        .list-content:hover {
          opacity: 0.7;
        }
      }
    }

    .main-content {
      width: 100%;

      .content-header {
        color: #bdc7df;
        font-size: 20px;
        text-align: left;
        height: 60px;
        line-height: 60px;
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          height: 10vw;
          line-height: 10vw;
        }
      }

      .content-person {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 100px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 2vw;
        }

        .person-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin: 5vw 0;
          }

          .list-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin: 20px 0;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 1vw 0;
            }

            span {
              font-size: 16px;
              color: #757575;
              margin: 0 20px;
              @media screen and (min-width: 320px) and (max-width: 480px) {
                font-size: 4vw;
                margin: 0;
              }
            }
          }

          .list-info {
            font-size: 16px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }

          .list-controller {
            font-size: 16px;
            color: #f78b32;
            border-bottom: 1px solid #f78b32;
            cursor: pointer;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }

          .list-controller:hover {
            opacity: 0.7;
          }
        }
      }

      .content-ranking {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 400px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 80vw;
          }
        }
      }
    }
  }

  .maiNIcon1 {
    width: 60%;
    position: absolute;
    top: -50px;
    right: 60px;
    z-index: -1;
  }

  .maiNIcon2 {
    width: 20%;
    position: absolute;
    bottom: -50px;
    left: 0;
    z-index: -1;
  }

  .maiNIcon3 {
    width: 40%;
    position: absolute;
    top: 200px;
    left: 0;
    z-index: -1;
  }
}

.home-top {
  width: 100%;
  height: 626px;
  background-image: url('@/assets/home_bg.png');
  background-size: 100% 626px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .home-top-menu {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .home-top-menu-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-left: 100px;
      cursor: pointer;

      .home-title {
        width: 108px;
        height: 40px;
        line-height: 40px;
        color: #f78b32ff;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        text-align: left;
      }
    }

    .home-top-menu-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      width: 750px;

      div {
        cursor: pointer;
        color: white;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 5vw;
        }
      }

      div:hover {
        opacity: 0.7;
        border-bottom: 5px solid #f2882b;
      }

      .menu-hover {
        border-bottom: 5px solid #f2882b;
      }
    }

    .home-top-menu-avatar {
      margin-right: 100px;
      cursor: pointer;
    }

    .home-top-menu-avatar:hover {
    }
  }

  .home-top-main {
    width: 100%;
    height: 526px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;

    .main-content {
      width: 750px;

      .title1 {
        text-align: center;
        font-size: 38px;
        line-height: 100px;
      }

      .title2 {
        text-align: center;
        font-size: 18px;
        line-height: 40px;
      }
    }
  }
}

.home-main {
  display: flex;
  flex-direction: column;
  height: 1650px;

  .main-detail1 {
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: url('@/assets/home_bg2.png') no-repeat;
    background-size: 100% 272px;
    margin-top: 108px;

    .detail-box {
      width: 600px;
      height: 300px;
      line-height: 20px;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      text-align: center;
      box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      margin: 0 100px 0 100px;

      img {
        width: 80px;
        height: 80px;
      }

      .box-title1 {
        text-align: center;
        color: rgba(17, 54, 145, 100);
        font-size: 26px;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        margin: 0 100px;
      }
    }
  }

  .main-detail2 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
  }

  .main-detail3 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    .detail3-title {
      color: rgba(187, 187, 187, 100);
      font-size: 18px;
    }

    img {
      width: 22px;
      height: 22px;
    }
  }

  .main-detail4 {
    margin: 100px;
    height: 300px;
    line-height: 20px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .detail4-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      img {
        width: 74px;
        height: 74px;
      }

      span {
        color: rgba(187, 187, 187, 100);
        font-size: 22px;
        line-height: 50px;
      }
    }
  }

  .main-detail5 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
  }

  .main-detail6 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 100px;

    .detail6-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 250px;

      img {
        width: 100px;
        height: 100px;
      }

      .box-title1 {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        border-bottom: 5px solid #f78b32;
        text-align: center;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 12px;
        text-align: center;
        line-height: 20px;
      }
    }
  }

  .detail-title {
    line-height: 20px;
    color: rgba(15, 19, 31, 84);
    font-size: 35px;
    text-align: center;
  }

  .row-line {
    height: 5px;
    background-color: #7488bf;
    width: 50px;
    margin: 0 20px;
  }
}

.home-bottom {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  height: 200px;
  background-color: rgba(15, 19, 31, 100);
  color: rgba(16, 16, 16, 100);
  padding-top: 20px;

  .bottom-left {
    width: 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      color: rgba(255, 255, 255, 100);
      font-size: 50px;
      cursor: pointer;
    }

    span:hover {
      opacity: 0.7;
    }
  }

  .bottom-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    span {
      color: rgba(255, 255, 255, 84);
      font-size: 30px;
      cursor: pointer;
    }

    span:hover {
      opacity: 0.7;
    }
  }
}

.content-collect {
  padding: 2vw 4vw 0 4vw;
}
</style>

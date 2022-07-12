<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PersonCircleOutline, IdCardSharp, PhonePortraitOutline } from '@vicons/ionicons5'
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
    store.commit('SET_MENU', '账号密码管理')
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
    store.commit('SET_MENU', '账号密码管理')
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
  if (event?.isTrusted) {
    router.go(0)
    store.commit('SET_MENU', '账号密码管理')
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
const handleExit = () => {
  router.push('/admin')
}
</script>

<template>
  <div>
    <div class="content-person">
      <div class="person-list">
        <div class="list-title">
          <NIcon size="40" :component="PersonCircleOutline" color="black" :depth="3" />
          <span>头像</span>
        </div>
        <div class="list-info">
          <n-avatar round :size="48" :src="store.getters.currentPictureUrl"></n-avatar>
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
        <NModal v-model:show="showModal" :mask-closable="false" preset="dialog" title="Dialog">
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

      <div class="person-exit">
        <button class="btn-exit" @click="handleExit">退出登录</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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

  .person-exit {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-exit {
      width: 250px;
      height: 39px;
      line-height: 23px;
      border-radius: 15px;
      background-color: rgba(215, 108, 84, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 16px;
      text-align: center;
      box-shadow: 2px 2px 7px 0 rgba(215, 108, 84, 52);
      border: 0 solid rgba(0, 0, 0, 0);
      cursor: pointer;
    }

    .btn-exit:hover {
      opacity: 0.7;
    }
  }
}
</style>

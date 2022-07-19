<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue'
import {
  FormInst,
  NAvatar,
  NPopselect,
  NButton,
  NInput,
  NUpload,
  NModal,
  NForm,
  NSpace,
  NFormItem,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NCascader,
  useMessage,
  UploadFileInfo,
  GlobalThemeOverrides
} from 'naive-ui'
import { updatePhoneApi, updateUsernameApi } from '@service/person'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCategoryAllApi, getCurrentApi, updateUserInfoApi } from '@service/user'
import Cookies from 'js-cookie'
import personGradePng from '@/assets/person_grade.png'
import phonePng from '@/assets/phone.png'
import memberPng from '@/assets/member.png'

type CategoryData = {
  data: API.Category[]
}
const categoryData = reactive<CategoryData>({
  data: []
})
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1684FC'
  },
  Button: {
    textColor: '#1684FC'
  }
}
const router = useRouter()
const message = useMessage()
const store = useStore()
const showModal = ref(false)
const showModalUsername = ref(false)
const username = ref<string>('')
const phone = ref<string>('')
const size = ref('medium')
const formRef = ref<FormInst | null>(null)
const model = reactive<API.UserInfoRequest>({
  id: -1, // 编号
  username: '', // 名称
  gender: '', // 性别
  mail: '', // 邮箱
  address: null, // 所在地
  phone: '', // 手机号
  focusCategory: '' // 关注领域
})
const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = model.mail.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称'
  },
  gender: {
    required: true,
    trigger: 'change',
    message: '请选择性别'
  },
  focusCategory: {
    type: 'array',
    required: true,
    trigger: 'change',
    message: '请选择关注领域'
  },
  mail: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入邮箱'
  }
}
const cityOptions = [
  {
    value: '福建',
    label: '福建',
    children: [
      {
        value: '福建福州',
        label: '福州'
      },
      {
        value: '福建厦门',
        label: '厦门'
      },
      {
        value: '福建莆田',
        label: '莆田'
      },
      {
        value: '福建泉州',
        label: '泉州'
      },
      {
        value: '福建漳州',
        label: '漳州'
      },
      {
        value: '福建龙岩',
        label: '龙岩'
      },
      {
        value: '福建三明',
        label: '三明'
      },
      {
        value: '福建南平',
        label: '南平'
      },
      {
        value: '福建宁德',
        label: '宁德'
      }
    ]
  }
]
const getCategory = async () => {
  const category = await getCategoryAllApi()
  categoryData.data = category.data as API.Category[]
}
const getUserInfo = async () => {
  const res = await getCurrentApi()
  const tempUserInfo: any = res.data
  console.log(tempUserInfo)
  if (res.success) {
    const split = tempUserInfo.focusCategory?.split(',')
    const category: Array<number> = []
    split.forEach((item: string) => {
      category.push(Number(item))
    })
    model.focusCategory = category
    model.id = tempUserInfo.id
    model.username = tempUserInfo.username
    model.gender = tempUserInfo.gender
    model.mail = tempUserInfo.mail
    model.phone = tempUserInfo.phone
    model.address = tempUserInfo.address
  }
}
const handleSave = async (e: MouseEvent) => {
  e.preventDefault()
  // formRef.value?.validate(async (errors) => {
  //   if (!errors) {
  // message.success('验证成功')
  model.focusCategory = model.focusCategory.join(',')
  const res = await updateUserInfoApi(model)
  console.log(res)
  if (res.success) {
    await store.dispatch('fetchCurrentUser')
    message.success('修改成功')
    router.go(0)
  }
  // } else {
  //   console.log(errors)
  //   message.error('验证失败')
  // }
  // })
}
const handleClose = async () => {
  await getUserInfo()
}
const handleLogout = () => {
  Cookies.remove('token')
  store.commit('SET_USER', undefined)
  router.push('/home')
}
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
    await updateUsernameApi(username.value)
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
onMounted(() => {
  getCategory()
  getUserInfo()
})
</script>

<template>
  <div class="content-person">
    <div class="person-title">
      <span class="title-span">账号管理</span>
      <div class="title-bg"></div>
    </div>
    <!--手机号-->
    <div class="person-list">
      <div class="list-title">
        <!--                    <NIcon size="40" :component="PhonePortraitOutline" color="black" :depth="3" />-->
        <img :src="phonePng" alt="手机" />
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
          <NButton type="primary" @click="handleUpdatePhone">确认</NButton>
          <NButton @click="handleShowModal(false)">取消</NButton>
        </template>
      </NModal>
    </div>

    <div class="person-list">
      <div class="list-title">
        <!--                    <NIcon size="40" :component="PhonePortraitOutline" color="black" :depth="3" />-->
        <img :src="memberPng" alt="等级" />
        <span>用户等级</span>
      </div>
      <div class="list-info">
        <div class="info-identification">
          <img :src="personGradePng" alt="用户等级" />
          <div class="identification-grade">普通用户</div>
        </div>
      </div>
      <div class="list-controller">
        <span>前去充值</span>
      </div>
      <NModal v-model:show="showModal" :mask-closable="false" preset="dialog" title="Dialog">
        <template #header>
          <div>更换号码</div>
        </template>
        <div>
          <NInput v-model:value="phone" placeholder="请输入新的电话号码"></NInput>
        </div>
        <template #action>
          <NButton type="primary" @click="handleUpdatePhone">确认</NButton>
          <NButton @click="handleShowModal(false)">取消</NButton>
        </template>
      </NModal>
    </div>

    <div class="person-title" style="margin-top: 50px">
      <span class="title-span">我的资料</span>
      <div class="title-bg"></div>
    </div>

    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      :size="size"
      :style="{
        maxWidth: '350px'
      }"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="头像" path="username">
        <div class="person-list" style="justify-content: flex-start">
          <div class="list-info">
            <n-avatar :size="48" :src="store.getters?.currentPictureUrl" round></n-avatar>
          </div>
          <span style="width: 100px"></span>
          <div class="list-controller">
            <NPopselect trigger="click">
              <span>更换头像</span>
              <template #empty>
                <NUpload
                  action="https://test1.auni.top/api/user/updatePictrue"
                  @finish="handleFinish"
                  @before-upload="beforeUpload"
                >
                  <NButton>上传图片</NButton>
                </NUpload>
              </template>
            </NPopselect>
          </div>
        </div>
      </n-form-item>

      <n-form-item label="名称" path="username">
        <n-input v-model:value="model.username" placeholder="请输入名称" />
      </n-form-item>

      <n-form-item label="性别" path="gender">
        <n-radio-group v-model:value="model.gender" name="gender">
          <n-space>
            <n-radio value="男"> 男</n-radio>
            <n-radio value="女"> 女</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="所在地" path="address">
        <n-cascader
          v-model:value="model.address"
          :options="cityOptions"
          check-strategy="child"
          placeholder="请选择所在地"
          size="medium"
        />
      </n-form-item>

      <n-form-item label="关注领域" path="focusCategory">
        <n-checkbox-group v-model:value="model.focusCategory">
          <n-space>
            <n-checkbox
              v-for="(item, index) in categoryData.data"
              :key="index"
              :value="item.categoryId"
            >
              {{ item.categoryName }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>

      <n-form-item label="邮箱" path="mail">
        <n-input
          v-model:value="model.mail"
          :options="autoCompleteOptions"
          placeholder="请输入邮箱"
        />
      </n-form-item>
    </n-form>

    <div>
      <button class="pbtn-save" @click="handleSave">保存</button>
      <button class="pbtn-close" @click="handleClose">取消</button>
    </div>

    <div>
      <button class="pbtn-logout" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-person {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 50px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    margin: 2vw;
  }

  .pbtn-save {
    border: none;
    width: 150px;
    height: 35px;
    line-height: 35px;
    border-radius: 8px;
    background-color: rgba(112, 172, 255, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 15px;
    text-align: center;
    cursor: pointer;
    margin: 10px 5px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 30vw;
      height: 8vw;
      line-height: 8vw;
    }
  }

  .pbtn-close {
    border: none;
    width: 150px;
    height: 35px;
    line-height: 35px;
    border-radius: 8px;
    background-color: rgba(187, 187, 187, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 15px;
    text-align: center;
    cursor: pointer;
    margin: 10px 5px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 30vw;
      height: 8vw;
      line-height: 8vw;
    }
  }

  .pbtn-logout {
    border: none;
    width: 310px;
    height: 35px;
    line-height: 35px;
    border-radius: 8px;
    background-color: rgba(221, 53, 53, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 15px;
    text-align: center;
    cursor: pointer;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 63vw;
      height: 8vw;
      line-height: 8vw;
    }
  }

  .pbtn-save:hover,
  .pbtn-close:hover,
  .pbtn-logout:hover {
    opacity: 0.7;
  }

  .person-title {
    position: relative;
    text-align: left;
    margin-bottom: 50px;

    .title-span {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 3px;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 4vw;
      }
    }

    .title-bg {
      position: absolute;
      top: 20px;
      left: -5px;
      height: 20px;
      border-radius: 10px;
      width: 100px;
      background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
    }
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

      img {
        width: 30px;
        height: 30px;
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

      .info-identification {
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
          //background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
          background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
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
</style>

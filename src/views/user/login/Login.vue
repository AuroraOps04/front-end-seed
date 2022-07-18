<script lang="ts" setup>
import {
  FormInst,
  FormItemRule,
  NCountdown,
  NForm,
  NSpace,
  NButton,
  NModal,
  NFormItem,
  NInput,
  NSelect,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NPopover,
  useMessage
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { loginApi, getSmsApi, getCategoryAllApi, registerApi } from '@service/user'
import Cookies from 'js-cookie'

const store = useStore()
const showSmsCode = ref(false)
const isSendSmsCode = ref(false)
const registerModel = ref(false)
const router = useRouter()
const formData = reactive<API.LoginRequest>({
  phone: '',
  password: '',
  smsCode: ''
})
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const treatyCheck = ref<any>()

const messageCode = ref<string>('获取验证码')
const validatePhone = (): boolean => {
  if (formData.phone === '') {
    message.error('请输入手机号')
    return false
  }
  if (!formData.phone.match(/^1[3-9]\d{9}$/)) {
    message.error('手机号码格式不正确')
    return false
  }
  return true
}
const second = ref<number>(60)
const timeDown = () => {
  const result = setInterval(() => {
    isSendSmsCode.value = true
    second.value -= 1
    if (second.value < 1) {
      clearInterval(result)
      messageCode.value = '重发验证码'
      showSmsCode.value = false
      second.value = 60
    }
  }, 1000)
}

const validateSmsCode = (): boolean => {
  if (formData.smsCode === '') {
    message.error('请输入验证码')
    return false
  }
  if (!formData.smsCode.match(/^\d{6}$/)) {
    message.error('验证码格式不正确')
    return false
  }
  return true
}

type LoginQuery = {
  register: boolean
  token: string
}
let loginData = reactive<LoginQuery>({
  register: false,
  token: ''
})

type CategoryData = {
  data: API.Category[]
}
const categoryData = reactive<CategoryData>({
  data: []
})
const handleLogin = async () => {
  store.commit('SET_TEMP_PHONE', formData.phone)
  // 校验手机号码
  if (!validatePhone()) {
    return
  }
  if (!isSendSmsCode.value) {
    message.error('请先发送验证码')
    return
  }
  if (!validateSmsCode()) {
    return
  }
  if (!treatyCheck.value.checked) {
    message.error('请勾选条约')
    return
  }
  try {
    const res = await loginApi(formData)
    loginData = res.data as LoginQuery
    if (loginData.register) {
      Cookies.set('token', loginData.token)
      message.success('登录成功')
      await store.dispatch('fetchCurrentUser')
      await router.push({
        name: 'Home'
      })
    } else {
      const category = await getCategoryAllApi()
      categoryData.data = category.data as API.Category[]
      registerModel.value = true
    }
  } catch (e) {
    console.log(e)
  }
}

const getSmsCode = async () => {
  if (!validatePhone()) {
    return
  }
  try {
    await getSmsApi(formData.phone)
    message.success('获取验证码成功')
    timeDown()
  } finally {
    showSmsCode.value = true
  }
}
const size = ref('medium')
const model = reactive<API.RegisterRequest>({
  username: '',
  gender: '',
  mail: '',
  phone: '',
  focusCategory: ''
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
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      message.success('验证成功')
      model.phone = store.getters.currentTempPhone
      model.focusCategory = model.focusCategory.join(',')
      const res = await registerApi(model)
      if (res.success) {
        Cookies.set('token', res.data as unknown as string)
        await store.dispatch('fetchCurrentUser')
        router.push('/home')
      }
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}
</script>

<template>
  <div class="bg">
    <div class="login">
      <input
        v-model="formData.phone"
        class="login-username"
        placeholder="使用手机号码登录/注册"
        type="text"
      />
      <div class="login-verify">
        <input
          v-model="formData.smsCode"
          class="login-verify-password"
          placeholder="请输入验证码"
          type="text"
        />
        <div id="captcha"></div>
        <span v-if="!showSmsCode" class="login-verify-code" @click="getSmsCode">
          {{ messageCode }}
        </span>
        <NSpace v-else class="login-verify-code" style="color: gray">
          <span>
            {{ second }}
          </span>
        </NSpace>
      </div>
      <NButton class="login-btn" @click="handleLogin">登陆</NButton>
      <div class="login-agree">
        <input ref="treatyCheck" class="login-agree-check" type="checkbox" />
        <span class="login-agree-text"
          >&nbsp;&nbsp;我已阅读并接受《注册申明》《版权声明》《隐私政策》</span
        >
      </div>
      <NModal
        v-model:show="registerModel"
        preset="dialog"
        title="注册"
        :mask-closable="false"
        :closable="true"
      >
        <template #header>
          <div>注册</div>
        </template>
        <div>
          <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size"
            :style="{
              maxWidth: '640px'
            }"
          >
            <n-form-item label="名称" path="username">
              <n-input v-model:value="model.username" placeholder="请输入名称" />
            </n-form-item>
            <n-form-item label="性别" path="gender">
              <n-radio-group v-model:value="model.gender" name="sexValue">
                <n-space>
                  <n-radio value="男"> 男</n-radio>
                  <n-radio value="女"> 女</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="关注领域" path="focusCategory">
              <n-checkbox-group v-model:value="model.focusCategory">
                <n-space>
                  <n-checkbox
                    v-for="(item, index) in categoryData.data"
                    :value="item.categoryId"
                    :key="index"
                  >
                    {{ item.categoryName }}
                  </n-checkbox>
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item label="邮箱" path="mail">
              <n-input
                v-model:value="model.mail"
                placeholder="请输入邮箱"
                :options="autoCompleteOptions"
              />
            </n-form-item>
          </n-form>
        </div>
        <template #action>
          <NButton type="primary" @click="handleValidateButtonClick">验证</NButton>
          <NButton @click="registerModel = false">取消</NButton>
        </template>
      </NModal>
    </div>
  </div>
</template>

<style lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url('@/assets/bg.png') no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100%;
    background-size: auto;
  }

  .login {
    width: 874px;
    height: 464px;
    background: url('@/assets/login.png') no-repeat;
    background-size: 874px 464px;
    position: relative;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 96vw;
      border-radius: 5vw;
      height: 300px;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: static;
      padding: 15vw 0;
    }

    .login-username {
      outline: none;
      border: none;
      width: 293px;
      height: 48px;
      position: absolute;
      left: 426px;
      top: 157px;
      border-radius: 24px;
      background: #eaeefe none;
      padding: 0 15px;
      font-size: 15px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        position: static;
        width: 50vw;
        height: 10vw;
        font-size: 4vw;
      }
    }

    .login-verify {
      @media screen and (min-width: 320px) and (max-width: 480px) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: static;
        width: 57vw;
        height: 10vw;
        font-size: 4vw;
      }

      .login-verify-password {
        outline: none;
        border: none;
        width: 293px;
        height: 48px;
        position: absolute;
        left: 426px;
        top: 237px;
        border-radius: 24px;
        background: #eaeefe none;
        padding: 0 15px;
        font-size: 15px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          position: static;
          width: 30vw;
          height: 10vw;
          font-size: 4vw;
        }
      }

      .login-verify-code {
        color: #719cf5;
        cursor: pointer;
        position: absolute;
        left: 650px;
        top: 252px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 16vw;
          position: static;
          font-size: 3vw;
        }
      }

      .login-verify-code:hover {
        opacity: 0.7;
      }
    }

    .login-btn {
      color: white;
      cursor: pointer;
      position: absolute;
      left: 430px;
      top: 320px;
      background-color: rgba(62, 106, 213, 100);
      height: 46px;
      line-height: 46px;
      text-align: center;
      width: 318px;
      border: none;
      border-radius: 23px;
      font-size: 18px;
      box-shadow: 0 2px 16px 0 rgba(62, 106, 213, 63);
      @media screen and (min-width: 320px) and (max-width: 480px) {
        position: static;
        width: 55vw;
        height: 10vw;
        line-height: 10vw;
      }
    }

    .login-btn:hover {
      opacity: 0.7;
    }

    .login-agree {
      position: absolute;
      left: 430px;
      top: 380px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        position: static;
        width: 50vw;
        height: 10vw;
      }

      .login-agree-check {
        zoom: 120%;
        border: 1px solid gray;
      }

      .login-agree-text {
      }
    }
  }
}
</style>

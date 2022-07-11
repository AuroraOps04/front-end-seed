<script lang="ts" setup>
import { NCountdown, NSpace, NButton, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { adminLoginApi, getSmsApi } from '@service/user'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const showSmsCode = ref(false)
const isSendSmsCode = ref(false)
const router = useRouter()
const formData = reactive<API.LoginRequest>({
  phone: '',
  smsCode: ''
})
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
const handleLogin = async () => {
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
    const res = await adminLoginApi(formData)
    Cookies.set('token', res.data as unknown as string)
    message.success('登录成功')
    store.dispatch('fetchCurrentUser')
    router.push('/admin/menu/home')
  } catch (e) {
    console.log(e)
  }
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
</script>

<template>
  <div class="bg">
    <div class="login">
      <div class="login-title">-管理端-</div>
      <input
        type="text"
        v-model="formData.phone"
        class="login-username"
        placeholder="使用手机号码登录/注册"
      />
      <div class="login-verify">
        <input
          type="text"
          v-model="formData.smsCode"
          class="login-verify-password"
          placeholder="请输入验证码"
        />
        <span v-if="!showSmsCode" class="login-verify-code" @click="getSmsCode">
          {{ messageCode }}
        </span>
        <NSpace v-else class="login-verify-code" style="color: gray">
          <span>
            {{ second }}
            <!--            <NCountdown :active="showSmsCode" :duration="60000" @on-finish="showSmsCode = false" />-->
          </span>
        </NSpace>
      </div>
      <NButton class="login-btn" @click="handleLogin">登陆</NButton>
      <div class="login-agree">
        <input type="checkbox" class="login-agree-check" ref="treatyCheck" />
        <span class="login-agree-text"
          >&nbsp;&nbsp;我已阅读并接受《注册申明》《版权声明》《隐私政策》</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url('@/assets/bg.png') no-repeat;
  //background-size: 100%;
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
      background: none;
      outline: none;
      border: none;
      width: 293px;
      height: 48px;
      position: absolute;
      left: 426px;
      top: 157px;
      border-radius: 24px;
      background-color: #eaeefe;
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
        background: none;
        outline: none;
        border: none;
        width: 293px;
        height: 48px;
        position: absolute;
        left: 426px;
        top: 237px;
        border-radius: 24px;
        background-color: #eaeefe;
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

    .login-title {
      position: absolute;
      left: 130px;
      top: 130px;
      width: 119px;
      height: 39px;
      color: rgba(19, 28, 53, 100);
      font-size: 26px;
      font-style: italic;
      letter-spacing: 3px;
      font-weight: 500;
      text-align: left;
      font-family: SourceHanSansSC-bold;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        position: static;
        font-size: 5vw;
        font-weight: bold;
        width: auto;
      }
    }
  }
}
</style>

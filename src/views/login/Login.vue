<script lang="ts" setup>
import { NCountdown, NSpace, FormInst, NButton, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { loginApi, getSmsApi } from '@service/user'
import Cookies from "js-cookie"
import { useRouter } from 'vue-router';
import {useStore} from "vuex"


const store = useStore()
const showSmsCode = ref(false)
const isSendSmsCode = ref(false)
const router = useRouter()
const formData = reactive<API.LoginRequest>({
  phone: '17777777777',
  smsCode: ''
})
const message = useMessage()

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

  try {
    const res = await loginApi(formData)
    Cookies.set('token', res.data as unknown as string)
    message.success('登录成功')
    store.dispatch('fetchCurrentUser')
    router.push({
      name: 'Home'
    })
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
    isSendSmsCode.value = true
  } finally {
    showSmsCode.value = true
  }
}
</script>

<template>
  <div class="bg">
    <div class="login">
      <input
        type="text"
        v-model="formData.phone"
        class="login-username"
        placeholder="使用手机号码登录/注册"
      />
      <input
        type="text"
        v-model="formData.smsCode"
        class="login-password"
        placeholder="请输入验证码"
      />
      <span class="login-verify" @click="getSmsCode" v-if="!showSmsCode">获取验证码</span>
      <n-space class="login-verify" style="color: gray" v-else>
        <span>
          <n-countdown :duration="60000" :active="showSmsCode" @on-finish="showSmsCode = false" />
        </span>
      </n-space>
      <n-button class="login-btn" @click="handleLogin">登陆</n-button>
      <div class="login-agree">
        <input type="checkbox" class="login-agree-check" />
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
  background-size: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
       
  .login {
    width: 874px;
    height: 464px;
    background: url('@/assets/login.png') no-repeat;
    background-size: 874px 464px;
    position: relative;

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
    }

    .login-password {
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
    }

    .login-verify {
      color: #719cf5;
      cursor: pointer;
      position: absolute;
      left: 650px;
      top: 252px;
    }

    .login-verify:hover {
      opacity: 0.7;
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

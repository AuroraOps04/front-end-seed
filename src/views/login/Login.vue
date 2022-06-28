<script lang="ts" setup>
import {useRouter} from "vue-router";
import {NCountdown, NSpace} from "naive-ui";
import {ref} from "vue";

const active = ref(false);
const router = useRouter();
const handleLogin = () => {
  router.push("/home")
}
const handleVerify = () => {
  active.value = true;
}
const handleFinish = () => {
  active.value = false;
}
</script>

<template>
  <div class="bg">
    <div class="login">
      <input type="text" class="login-username" placeholder="使用手机号码登录/注册"/>
      <input type="text" class="login-password" placeholder="请输入验证码"/>
      <span class="login-verify" @click="handleVerify" v-if="!active">获取验证码</span>
      <n-space class="login-verify" style="color: gray;" v-else>
        <span>
          <n-countdown :duration="60000" :active="active" :on-finish="handleFinish"/>
        </span>
      </n-space>
      <button class="login-btn" @click="handleLogin">登陆</button>
      <div class="login-agree">
        <input type="checkbox" class="login-agree-check">
        <span class="login-agree-text">&nbsp;&nbsp;我已阅读并接受《注册申明》《版权声明》《隐私政策》</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url("@/assets/bg.png") no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .login {
    width: 874px;
    height: 464px;
    background: url("@/assets/login.png") no-repeat;
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
      background-color: #EAEEFE;
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
      background-color: #EAEEFE;
      padding: 0 15px;
      font-size: 15px;
    }

    .login-verify {
      color: #719CF5;
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

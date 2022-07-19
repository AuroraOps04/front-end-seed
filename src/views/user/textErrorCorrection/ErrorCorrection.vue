<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NSpace, NInput, NButton, NAvatar } from 'naive-ui'
import { VXETable } from 'vxe-table'
import { getErrorCorrectionApi } from '@service/account'
import correctionPng from '@/assets/correction.png'
import textInput from '@/assets/textinput.png'
import iec from '@/assets/iec.png'
import imgIec from '@/assets/img_ice.png'

const router = useRouter()
const store = useStore()
const menuArr = reactive([
  {
    name: '首页',
    code: 'home',
    isSelect: true
  },
  {
    name: '排行榜',
    code: 'Leaderboard',
    isSelect: false
  }
])
type errorMessageObject = {
  errorText: string
  correctList: errorMessageObject[]
  correct_frag: string | null
  end_pos: string | null
  ori_frag: string | null
  begin_pos: string | null
}
type ErrorMessage = {
  correctList: errorMessageObject[]
  errorText: string | null
  correctText: string | null
}
const handleTo = (e: string) => {
  store.commit('SET_MENU', e)
  router.push(`/${e}`)
}
const showInput = ref<boolean>(true)
const textValue = ref<string | null>(null)
const errorMessage = reactive<ErrorMessage>({
  correctList: [],
  errorText: null,
  correctText: null
})

const submitText = async () => {
  if (textValue.value === null || textValue.value === '') {
    await VXETable.modal.message({ content: '输入框不能为空！', status: 'error' })
    return
  }
  const res = await getErrorCorrectionApi(textValue.value)
  const data = res.data as errorMessageObject
  errorMessage.correctList = data.correctList as errorMessageObject[]
  errorMessage.errorText = data.errorText
  showInput.value = false
}
const clearText = () => {
  textValue.value = null
  showInput.value = true
  errorMessage.correctList.length = 0
}
</script>
<template>
  <div class="container">
    <div class="header-bg">
      <div class="title">
        <template v-for="(item, index) in menuArr" :key="index">
          <span
            :style="{ backgroundColor: item.code === store.state.menu ? '#113691' : 'black' }"
            @click="handleTo(item.code)"
            >{{ item.name }}
          </span>
        </template>
      </div>
      <div class="avatar">
        <NAvatar :size="35" :src="store.getters?.currentPictureUrl" round></NAvatar>
        <span v-if="!store.getters.currentId" style="margin: 0 5px" @click="handleTo('login')">
          登录
        </span>
        <span v-else style="margin: 0 5px" @click="handleTo('person')">个人中心</span>
      </div>
    </div>
    <div class="body-bg">
      <div class="tidal-title">
        <div class="tidal-top-menu-logo">
          <img alt="logo" src="@/assets/logo.png" />
          <span></span>
          <div class="home-title">
            <span style="color: #1c294f">潮汐</span>
            <span>星云</span>
            <br />
            <span style="font-size: 15px; margin-left: 35px">智能文本纠错系统</span>
          </div>
        </div>
      </div>
      <!--      <div class="tidal-hint">智能文本纠错系统</div>-->
    </div>
    <div class="body-correction">
      <div class="text-input">
        <div class="input-title">
          <span class="text-correction"><img :src="textInput" alt="logo" />文本输入</span
          ><span class="text-correction"><img :src="correctionPng" alt="logo" />中文纠错</span>
        </div>
        <div v-if="showInput">
          <n-space vertical>
            <n-input
              v-model:value="textValue"
              :maxlength="500"
              autosize
              placeholder="请在此处粘贴标题"
              style="min-width: 1000px; min-height: 400px"
              type="textarea"
            />
          </n-space>
        </div>
        <div v-else class="textArea-show" v-html="errorMessage.errorText"></div>
        <div class="button-input">
          <n-space>
            <n-button type="warning" @click="clearText">清空文字 </n-button>
            <n-button type="error" @click="submitText">开始纠错 </n-button>
          </n-space>
        </div>
      </div>
      <!--      v-html="returnTextValue"-->
      <div v-if="errorMessage.correctList.length !== 0" class="text-result">
        <div class="text-result-title">
          <span class="text-style"><img :src="iec" alt="logo" />智能纠错</span>
        </div>
        <div class="text-result-input">
          <div class="text-result-one">
            <span>全部风险</span>
            <br />
            <span class="text-result-number">{{ errorMessage.correctList.length }}</span>
          </div>
          <div class="text-result-one">
            <span>文字纠错</span>
            <br />
            <span class="text-result-number">{{ errorMessage.correctList.length }}</span>
          </div>
          <div class="text-result-one">
            <span>铭感审核</span>
            <br />
            <span class="text-result-number">{{ errorMessage.correctList.length }}</span>
          </div>
        </div>
        <div class="text-result-advice">
          <div><span>已采纳</span><span>采纳全部</span></div>
          <div><span>已忽略</span><span>忽略全部</span></div>
        </div>
        <div class="text-result-list">
          <div v-for="(item, index) in errorMessage.correctList" :key="index" class="result-list">
            <span class="red-round"></span><span style="color: red">{{ item.ori_frag }}</span> ->{{
              item.correct_frag
            }}
          </div>
        </div>
      </div>
      <div v-else class="text-result">
        <div class="text-result-title">
          <span class="text-style"><img :src="iec" alt="logo" />智能纠错</span>
        </div>
        <div class="text-result-else">
          <img :src="imgIec" alt="logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: #f2f6f7;
  width: 100%;
  height: 100%;

  .header-bg {
    background-color: black;
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      height: 10vw;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      height: 100%;

      span {
        height: 100%;
        padding: 0 10px;
        margin: 0 10px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          padding: 0 2vw;
          margin: 0 2vw;
          line-height: 10vw;
        }
      }

      span:hover {
        background-color: #113691;
        opacity: 0.7;
      }
    }

    .avatar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 150px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 40vw;
      }

      span {
        color: white;
        cursor: pointer;
      }

      span:hover {
        opacity: 0.7;
      }
    }
  }

  .body-bg {
    display: flex;
    background-color: #ffffff;
    height: 20vh;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      height: 10vw;
    }

    .tidal-title {
      width: 100%;
      height: 82%;
      line-height: 66px;
      color: #243055;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
      text-align: left;
      display: flex;
      flex-direction: row;
      padding-top: 15px;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 20vw;
        font-size: 4vw;
        height: 5vw;
        line-height: 5vw;
      }

      .tidal-top-menu-logo {
        display: flex;
        flex-direction: row;
        margin-left: 100px;
        cursor: pointer;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin-left: 1vw;
        }

        img {
          width: 40px;
          height: 40px;

          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 7vw;
            height: 7vw;
          }
        }

        span {
          width: 20px;

          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 1vw;
          }
        }

        .home-title {
          width: 100%;
          height: 100%;
          line-height: 40px;
          color: #f78b32ff;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          text-align: left;

          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 20vw;
            font-size: 4vw;
            height: 5vw;
            line-height: 5vw;
          }
        }
      }
    }

    .tidal-hint {
      width: 100%;
      line-height: 0;
      left: 215px;
      top: 150px;
      height: 29px;
      color: rgba(249, 167, 101, 100);
      font-size: 20px;
      font-family: SourceHanSansSC-medium, serif;
      letter-spacing: 2px;
      display: flex;
      flex-direction: row;
      color: #f9a765;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 20vw;
        font-size: 4vw;
        height: 5vw;
        line-height: 5vw;
      }
    }
  }

  .body-correction {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    height: 600px;
    width: 100%;

    .text-input {
      display: flex;
      flex-direction: column;
      width: 70%;
      height: 100%;
      background-color: #ffffff;
      align-content: center;
      align-items: center;
      margin-left: 80px;
      margin-right: 50px;
      border-radius: 20px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      .textArea-show {
        width: 1000px;
        height: 400px;
        border: 1px solid #36ad6a;
      }
      .input-title {
        height: 34px;
        color: rgba(28, 41, 79, 100);
        font-size: 20px;
        font-family: SourceHanSansSC-bold, serif;
        width: 80%;
        display: flex;
        justify-content: space-between;
        .text-correction {
          border-radius: 10px;
          border: 1px solid orange;
          color: orange;
          font-size: 14px;
          height: 25px;
          margin-top: 5px;
          width: 80px;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }

      .button-input {
        margin-top: 20px;
        display: flex;
        justify-items: right;
        width: 80%;
        justify-content: right;
      }
    }

    .text-result {
      display: flex;
      flex-direction: column;
      width: 20%;
      height: 100%;
      align-content: center;
      align-items: center;
      border-radius: 20px;
      background-color: #f2f6f7;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      .text-result-else {
        height: 100%;
        width: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .text-result-title {
        display: flex;
        flex-direction: row;
        width: 100%;
        background-color: #ffffff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
      .text-style {
        top: 244px;
        width: 117px;
        height: 38px;
        color: rgb(28, 41, 79);
        font-size: 15px;
        text-align: left;
        font-family: SourceHanSansSC-bold, serif;
        img {
          padding-right: 6px;
          padding-top: 4px;
          width: 20px;
          height: 20px;
        }
      }

      .text-result-input {
        display: flex;
        border-radius: 10px;
        flex-direction: row;
        justify-content: space-around;
        height: 20%;
        margin-top: 10px;
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        .text-result-one {
          width: 20%;
          border-radius: 10px;
          height: 75%;
          margin: 6px;
          background-color: #ffccae;
          text-align: center;
          .text-result-number {
            width: 50px;
            height: 50px;
            color: red;
          }
        }
      }
      .text-result-advice {
        display: flex;
        border-radius: 10px;
        flex-direction: row;
        height: 15%;
        margin-top: 10px;
        width: 100%;
        background-color: #f2f6f7;
      }

      .text-result-list {
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        height: 100%;
        margin-top: 10px;
        width: 100%;

        .result-list {
          display: flex;
          flex-direction: row;
          width: 80%;
          height: 40px;
          line-height: 3;
          padding-left: 27px;
          background-color: #ffffff;
          border-radius: 10px;
          margin: 10px;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        .red-round {
          height: 15px;
          width: 15px;
          margin-top: 13px;
          margin-right: 10px;
          border-radius: 50%;
          background-color: red;
        }
      }
    }
  }
}
</style>

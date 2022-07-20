<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NSpace, NInput, NButton } from 'naive-ui'
import { VXETable } from 'vxe-table'
import { getErrorCorrectionApi } from '@service/account'
import correctionPng from '@/assets/correction.png'
import textInput from '@/assets/textinput.png'
import iec from '@/assets/iec.png'
import imgIec from '@/assets/img_ice.png'
import tidalNebula from '@/assets/tidal-nebula.png'
import intelligentText from '@/assets/intelligent-text.png'
import Header from '@/components/body/Header.vue'

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
    <Header />
    <!--    <div class="text-error-menu">
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
    </div>-->

    <div class="text-error-logo">
      <div class="text-logo-tidalNebula">
        <img :src="tidalNebula" alt="潮汐星云" />
      </div>
      <div class="text-logo-hint">
        <img :src="intelligentText" alt="智能文本纠错系统" />
      </div>
    </div>

    <div class="text-error-content">
      <div class="text-content-input">
        <div class="text-content-logo">
          <div class="text-logo-input">
            <span class="text-logo-img"><img :src="textInput" alt="文本输入" /></span>
            <span class="text-span-text">文本输入</span>
          </div>
          <div class="text-logo-button">
            <span class="text-button-img"><img :src="correctionPng" alt="中英文切换" /></span>
            <span class="text-button-input">中文纠错</span>
          </div>
        </div>
        <div v-if="showInput" class="text-content-areaText">
          <n-space vertical>
            <n-input
              v-model:value="textValue"
              autosize
              placeholder="请在此处粘贴标题"
              size="large"
              style="min-height: 54.49vh"
              type="textarea"
            />
          </n-space>
        </div>
        <div v-else class="textArea-show" v-html="errorMessage.errorText"></div>
        <div class="text-content-button">
          <div class="text-button-button">
            <n-space>
              <n-button type="warning" @click="clearText">清空文字</n-button>
              <n-button type="error" @click="submitText">开始纠错</n-button>
            </n-space>
          </div>
        </div>
      </div>
      <div class="text-content-show">
        <div class="text-show-correction">
          <div class="text-logo-input">
            <span class="text-logo-img"><img :src="iec" alt="智能纠错" /></span>
            <span class="text-span-text">智能纠错</span>
          </div>
        </div>
        <div v-if="errorMessage.correctList.length !== 0" class="text-areaText-show">
          <div class="text-areaText-result">
            <div class="text-result-results">
              <div class="text-result-front">
                全部风险
                <div class="text-result-total">8</div>
              </div>
            </div>
            <div class="text-result-results">
              <div class="text-result-front">
                文字纠错
                <div class="text-result-total">8</div>
              </div>
            </div>
            <div class="text-result-results">
              <div class="text-result-front">
                铭感审核
                <div class="text-result-total">8</div>
              </div>
            </div>
          </div>
          <div class="text-areaText-suggest">
            <div class="text-suggest-typesetting">
              <div class="text-typesetting-adoption">已采纳:<span>0</span></div>
              <div class="text-typesetting-adoption-all">采纳全部</div>
            </div>
            <div class="text-suggest-typesetting">
              <div class="text-typesetting-adoption">已忽略:<span style="color: red">0</span></div>
              <div class="text-typesetting-adoption-all" style="background-color: gray">
                采纳全部
              </div>
            </div>
          </div>
          <div class="text-areaText-revise">
            <div v-for="(item, index) in errorMessage.correctList" :key="index" class="result-list">
              <div class="red-round"></div>
              <div style="padding-top: 4px">
                <span style="color: red">{{ item.ori_frag }}</span> ->{{ item.correct_frag }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-content-areaText"><img :src="imgIec" alt="logo" /></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: #f4f7fa;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .text-error-menu {
    display: flex;
    width: 100vw;
    height: 6.02vh;
    background-color: black;
    flex-wrap: nowrap;
    justify-content: end;
    flex-direction: row;
    align-items: center;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      height: 100%;
    }
  }

  .text-error-logo {
    display: flex;
    width: 100vw;
    height: 13.89vh;
    background-color: #ffffff;
    flex-direction: row;
    flex-wrap: wrap;

    .text-logo-tidalNebula {
      width: 100vw;
      height: 50%;

      img {
        height: 4.17vh;
        width: 11.67vw;
        padding-top: 1.3vh;
        padding-left: 5.83vw;
      }
    }

    .text-logo-hint {
      width: 100vw;
      height: 50%;

      img {
        width: 11.98vw;
        height: 2.78vh;
        padding-left: 11.2vw;
      }
    }
  }

  .text-error-content {
    width: 100px;
    height: 80vh;
    flex-direction: column;
    -webkit-flex-wrap: wrap;
    display: flex;

    .text-content-input {
      flex-wrap: wrap;
      display: flex;
      flex-direction: row;
      margin-top: 1.39vh;
      width: 65.17vw;
      height: 72.13vh;
      background-color: rgba(255, 255, 255, 100);
      //box-shadow: 0px 2px 22px 5px rgba(17, 54, 145, 12);
      border-radius: 10px;
      margin-left: 9.05vw;

      .text-content-logo {
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 8.8vh;

        .text-logo-input {
          margin-top: 1.57vh;
          margin-left: 3.59vw;
          display: flex;
          width: 6.77vw;
          height: 3.7vh;
          background-color: white;

          .text-logo-img {
            width: 1.72vw;
            height: 100%;

            img {
              padding-top: 0.37vh;
              width: 1.56vw;
              height: 2.78vh;
            }
          }

          .text-span-text {
            height: 100%;
            color: rgba(28, 41, 79, 100);
            font-size: 1.25em;
            text-align: left;
            font-family: SourceHanSansSC-bold, sans-serif;
            font-weight: bold;
          }
        }

        .text-logo-button {
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 100);
          font-size: 1em;
          text-align: center;
          box-shadow: 0 3px 7px -1px rgba(253, 218, 188, 64);
          border: 1px solid rgba(249, 167, 101, 100);
          margin-top: 1.48vh;
          margin-right: 3.59vw;
          display: flex;
          width: 7.14vw;
          height: 3.7vh;
          background-color: white;

          .text-button-img {
            width: 1.72vw;
            height: 100%;

            img {
              padding-top: 0.37vh;
              width: 1.56vw;
              height: 2.78vh;
            }
          }

          .text-button-input {
            padding-left: 0.21vw;
            height: 100%;
            font-size: 1.25em;
            text-align: left;
            color: #f9a765;
            font-family: Roboto, sans-serif;
            font-weight: bold;
          }
        }
      }

      .textArea-show {
        width: 100%;
        height: calc(100% - 17.59vh);
        border: 1px solid rgba(10, 10, 10, 0.1);
      }

      .text-content-areaText {
        flex-direction: row;
        display: flex;
        width: 100%;
        height: calc(100% - 17.59vh);
        background-color: #0e1222;

        :deep(.n-space) {
          width: 100%;
          height: 100%;
        }

        :deep(.n-space:nth-child(1)) {
          height: 100%;
        }
      }

      .text-content-button {
        flex-direction: row;
        display: flex;
        width: 100%;
        height: 8.8vh;
        background-color: white;

        .text-button-button {
          width: 100%;
          justify-content: right;
          padding-right: 1.82vw;
          display: flex;
          margin-top: 2vh;
        }
      }
    }

    .text-content-show {
      border-radius: 10px;
      margin-left: 0.78vw;
      margin-top: 1.39vh;
      display: flex;
      width: 17.4vw;
      height: 72.13vh;
      background-color: rgba(255, 255, 255, 100);
      flex-wrap: wrap;
      box-shadow: 0 2px 22px 5px #e3eaf1;
      //文本返回
      .text-areaText-show {
        background-color: #f4f7fa;
        align-content: flex-start;
        flex-direction: row;
        border-radius: 10px;
        flex-wrap: wrap;
        display: flex;
        width: 100%;
        height: calc(100% - 8.8vh);
        //background-color: rgba(14, 14, 14, 0.3);

        .text-areaText-result {
          margin: 10px;
          border-bottom: 1px solid;
          border-color: rgba(10, 10, 10, 0.1);
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 8.8vh;
          background-color: white;

          .text-result-results {
            width: 30%;
            height: 80%;
            border-radius: 10px;
            margin: 10px;
            background-color: orange;

            .text-result-front {
              width: 100%;
              height: 100%;
              text-align: center;
              padding-top: 13px;

              .text-result-total {
                margin-left: 20px;
                width: 45px;
                border-radius: 10px;
                height: 20px;
                background-color: red;
              }
            }
          }
        }

        .text-areaText-suggest {
          //border-bottom: 1px solid;
          //border-color: rgba(10, 10, 10, 0.1);
          //border-radius: 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          height: 8.8vh;
          background-color: #f4f7fa;

          .text-suggest-typesetting {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            height: 50%;
            justify-content: space-around;
            .text-typesetting-adoption {
              padding-top: 10px;
              color: #6a6f77;
              span {
                padding-left: 3px;
                color: dodgerblue;
              }
            }

            .text-typesetting-adoption-all {
              margin-top: 10px;
              background-color: #bbdbfa;
              border-radius: 10px;
              height: 25px;
              width: 80px;
              align-items: center;
              text-align: center;
            }
          }
        }

        .text-areaText-revise {
          border-bottom: 1px solid;
          border-color: rgba(10, 10, 10, 0.1);
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          width: 100%;
          height: calc(100% - 17.6vh);
          background-color: #f2f6f7;
          .result-list {
            border-radius: 10px;
            background-color: white;
            margin: 8px;
            width: 95%;
            height: 3vh;
            display: flex;
            flex-wrap: nowrap;
            .red-round {
              height: 15px;
              width: 15px;
              margin: 8px;
              border-radius: 50%;
              background-color: red;
            }
          }
        }
      }

      .text-content-areaText {
        flex-direction: row;
        display: flex;
        width: 100%;
        height: calc(100% - 8.8vh);
        background-color: rgba(14, 14, 14, 0.3);

        img {
          width: 100%;
          height: 100%;
        }
      }

      //box-shadow: 0px 2px 22px 5px rgba(17, 54, 145, 12);
      .text-show-correction {
        border-bottom: 1px solid;
        border-color: rgba(10, 10, 10, 0.1);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 8.8vh;

        .text-logo-input {
          margin-top: 1.57vh;
          margin-left: 1.04vw;
          display: flex;
          width: 6.77vw;
          height: 3.7vh;
          background-color: white;

          .text-logo-img {
            width: 1.72vw;
            height: 100%;

            img {
              padding-top: 0.37vh;
              width: 1.56vw;
              height: 2.78vh;
            }
          }

          .text-span-text {
            height: 100%;
            padding-left: 0.16vw;
            color: rgba(28, 41, 79, 100);
            font-size: 1.25em;
            text-align: left;
            font-family: SourceHanSansSC-bold, sans-serif;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>

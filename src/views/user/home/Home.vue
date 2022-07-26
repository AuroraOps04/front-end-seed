<script lang="ts" setup>
import { NAvatar, NInput, NIcon, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import { insertTrafficCountAPI } from '@service/traffic'
import { Search, BriefcaseOutline } from '@vicons/ionicons5'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import rankingPng from '@/assets/ranking.png'
import analysisPng from '@/assets/analysis.png'
import rightPng from '@/assets/right.png'
import twitterPng from '@/assets/twitter.png'
import youtubePng from '@/assets/youtube.png'
import instagramsPng from '@/assets/instagrams.png'
import facebookPng from '@/assets/facebook.png'
import fastPng from '@/assets/fast.png'
import professionalPng from '@/assets/professional.png'
import authoritativePng from '@/assets/authoritative.png'
import stablePng from '@/assets/stable.png'
import logoWhitePng from '@/assets/logo_white.png'
import weiboPng from '@/assets/weibo.png'
import wechatPng from '@/assets/wechat.png'

// Initialize an agent at application startup.

// 游客id
const VisitorId = ref<string>('')

const fpPromise = FingerprintJS.load()

const fetchFingerprint = async () => {
  const fp = await fpPromise
  const result = await fp.get()
  // 赋值游客id
  VisitorId.value = result.visitorId
  console.log('这是id：', VisitorId.value)
}

const router = useRouter()
const store = useStore()
const handleTo = (e: string) => {
  store.commit('SET_MENU', e)
  router.push(`/${e}`)
}
onMounted(() => {
  fetchFingerprint().then(() => {
    insertTrafficCountAPI(VisitorId.value)
  })
})
</script>

<template>
  <div>
    <div class="home-top">
      <div class="home-top-menu">
        <!-- logo -->
        <div class="home-top-menu-logo">
          <img src="@/assets/logo.png" alt="logo" />
          <span></span>
          <!--          <div class="home-title">
            <span style="color: #113691">潮汐</span>
            <span style="color: #f78b32">星云</span>
          </div>-->
        </div>
        <div class="home-top-menu-search">
          <n-input
            placeholder="输入搜索词进入全网搜索"
            round
            class="search"
            style="background-color: rgba(0, 0, 0, 0); border-color: rgba(0, 0, 0, 0)"
            @click="handleTo('search')"
          >
            <template #prefix>
              <n-icon color="#FF7C40">
                <search />
              </n-icon>
            </template>
          </n-input>
          <n-button
            @click="handleTo('errorCorrection')"
            ghost="search"
            color="white"
            size="small"
            class=""
          >
            <template #icon>
              <n-icon>
                <BriefcaseOutline />
              </n-icon>
            </template>
            <span class="errorCorrection">纠错</span>
          </n-button>
        </div>
        <!-- 菜单栏 -->
        <div class="home-top-menu-list">
          <div class="menu-hover" @click="handleTo('home')">首页</div>
          <div @click="handleTo('Leaderboard')">排行榜</div>
        </div>
        <!-- 头像 -->
        <div class="home-top-menu-avatar">
          <span @click="handleTo('login')" v-if="!store.getters.currentId" class="btn-login">
            登陆
          </span>
          <div class="info" v-else>
            <NAvatar round :size="40" :src="store.getters?.currentPictureUrl" />
            <span @click="handleTo('person')" class="person-text">个人中心</span>
          </div>
        </div>
      </div>

      <div class="home-top-main">
        <div class="main-content">
          <div class="title1">全球大数据舆情监测平台</div>
          <div class="title2">
            基于网络公开数据、融媒体及舆论大数据人工智能，<br />
            制定系统化的新媒体大数据评价体系和影响力标准，<br />
            提供舆论分析报告、融媒体平台解决方案、一站式行业大数据解决方案以及软件开发等服务。
          </div>
        </div>
      </div>
    </div>

    <div class="home-main">
      <div class="main-detail1">
        <div class="detail-box">
          <img :src="rankingPng" alt="榜单查询" />
          <div class="box-title1">平台榜单查询</div>
          <span class="box-title2"
            >独家优先形式联合发布数据榜单<br />构筑全平台内容数据价值评估体系</span
          >
        </div>
        <div class="detail-box">
          <img :src="analysisPng" alt="数据分析" />
          <div class="box-title1">账号数据分析</div>
          <div class="box-title2">针对账号进行全面的数据监测分析</div>
        </div>
      </div>

      <div class="main-detail2">
        <div class="row-line"></div>
        <span class="detail-title">新媒体平台指数</span>
        <div class="row-line"></div>
      </div>

      <div class="main-detail3">
        <span class="detail3-title">查看详情</span>
        <span style="width: 10px"></span>
        <img :src="rightPng" alt="箭头" />
      </div>

      <div class="main-detail4">
        <div class="detail4-box">
          <img :src="facebookPng" alt="facebook" />
          <span>Facebook指数</span>
        </div>
        <div class="detail4-box">
          <img :src="youtubePng" alt="youtube" />
          <span>YouTube指数</span>
        </div>
        <div class="detail4-box">
          <img :src="twitterPng" alt="twitter" />
          <span>Twitter指数</span>
        </div>
        <div class="detail4-box">
          <img :src="instagramsPng" alt="instagrams" />
          <span>Instagrams指数</span>
        </div>
      </div>

      <div class="main-detail5">
        <div class="row-line"></div>
        <span class="detail-title">我们的优势</span>
        <div class="row-line"></div>
      </div>

      <div class="main-detail6">
        <div class="detail6-box">
          <img :src="professionalPng" alt="专业" />
          <div class="box-title1">专业</div>
          <div class="box-title2">具备专业的技术开发团队<br />针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="authoritativePng" alt="权威" />
          <div class="box-title1">权威</div>
          <div class="box-title2">具备专业的技术开发团队<br />针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="fastPng" alt="极速" />
          <div class="box-title1">极速</div>
          <div class="box-title2">具备专业的技术开发团队<br />针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="stablePng" alt="稳定" />
          <div class="box-title1">稳定</div>
          <div class="box-title2">具备专业的技术开发团队<br />针对不同用户提供定制化服务</div>
        </div>
      </div>
    </div>

    <div class="home-bottom">
      <div class="bottom-main">
        <div class="bottom-left">
          <img :src="logoWhitePng" alt="logo" />
          <div class="left-text">
            <span class="text1">潮汐星云</span>
            <span class="text2">www.cxxy.com</span>
          </div>
        </div>
        <div class="bottom-right">
          <div class="right-detail">
            <span class="text1">关于我们</span>
            <span class="text2">企业简介</span>
            <span class="text2">合作单位</span>
            <span class="text2">加入潮汐</span>
          </div>
          <div class="right-detail">
            <span class="text1">产品产品</span>
            <span class="text2">产品地图</span>
            <span class="text2">产品文档</span>
            <span class="text2">榜单公式</span>
            <span class="text2">在线反馈</span>
          </div>
          <div class="right-detail">
            <span class="text1">联系我们</span>
            <div class="icon">
              <img :src="wechatPng" alt="微信" />
              <img :src="weiboPng" alt="微博" />
            </div>
            <span class="text2">使用咨询：在线客服</span>
            <span class="text2">咨询热线：xx-xxx-xxxx</span>
            <span class="text2">联系邮箱：xxx@xxxxx</span>
          </div>
        </div>
      </div>
      <span class="bottom-pic">@2022 潮汐星云 — 全球大数据舆情监测平台 备案号XXX 网安备案号 </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-top {
  width: 100%;
  height: 626px;
  background-image: url('@/assets/home_bg.png');
  background-size: 100% 626px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    display: flex;
    flex-direction: column;
    background-clip: content-box;
    background-size: auto;
  }

  .home-top-menu {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      height: 20vw;
      line-height: 20vw;
    }

    .home-top-menu-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-left: 100px;
      cursor: pointer;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        margin-left: 1vw;
      }

      img {
        //width: 40px;
        //height: 40px;
        width: auto;
        height: 40px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: auto;
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
        width: 108px;
        height: 40px;
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

    .home-top-menu-search {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .search {
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 10vw;
        }
      }
      .errorCorrection {
        @media screen and (min-width: 320px) and (max-width: 480px) {
          display: none;
        }
      }
    }

    .home-top-menu-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      width: 750px;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: auto;
      }

      div {
        cursor: pointer;
        color: white;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        margin: 0 20px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          height: 5vw;
          line-height: 5vw;
          margin: 0 2vw;
          flex-shrink: 0;
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
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: auto;
        margin-right: 1vw;
      }

      .btn-login {
        width: 80px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 5px;
        background-color: rgba(247, 139, 50, 100);
        color: rgba(255, 255, 255, 100);
        font-size: 14px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 16vw;
          height: 8vw;
          line-height: 8vw;
        }
      }

      .btn-login:hover {
        opacity: 0.7;
      }
      .info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .person-text {
          color: white;
          margin: 0 20px;
          flex-shrink: 0;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
            margin: 0 1vw;
            display: none;
          }
        }
      }
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
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        align-items: center;
        width: 95vw;
      }

      .title1 {
        text-align: center;
        font-size: 38px;
        line-height: 100px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 6vw;
          line-height: 20vw;
        }
      }

      .title2 {
        text-align: left;
        font-size: 18px;
        line-height: 40px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          text-align: center;
          font-size: 4vw;
          line-height: 8vw;
        }
      }
    }
  }
}

.home-main {
  display: flex;
  flex-direction: column;
  //height: 1650px;

  .main-detail1 {
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: url('@/assets/home_bg2.png') no-repeat;
    background-size: 100% 272px;
    margin-top: 108px;
    @media screen and (min-width: 320px) and (max-width: 480px) {
      height: 150vw;
      display: flex;
      flex-direction: column;
      margin-top: 2vw;
    }

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

      @media screen and (min-width: 320px) and (max-width: 480px) {
        line-height: 2vw;
        border-radius: 2vw;
        font-size: 1vw;
        width: 96vw;
        height: 100vw;
        margin: 2vw;
      }

      img {
        width: 80px;
        height: 80px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 15vw;
          height: 15vw;
        }
      }

      .box-title1 {
        text-align: center;
        color: rgba(17, 54, 145, 100);
        font-size: 26px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 6vw;
        }
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        margin: 0 100px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          line-height: 5vw;
          margin: 0 15vw;
        }
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

    @media screen and (min-width: 320px) and (max-width: 480px) {
    }
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
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 4vw;
      }
    }

    img {
      width: 22px;
      height: 22px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 4vw;
        height: 4vw;
      }
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
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: 96vw;
      height: 50vw;
      margin: 2vw;
    }

    .detail4-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      img {
        width: 74px;
        height: 74px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 15vw;
          height: 15vw;
        }
      }

      span {
        color: rgba(187, 187, 187, 100);
        font-size: 22px;
        line-height: 50px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          line-height: 6vw;
        }
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
    @media screen and (min-width: 320px) and (max-width: 480px) {
      height: 20vw;
    }
  }

  .main-detail6 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 100px;

    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 5vw;
    }

    .detail6-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 250px;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        height: 60vw;
      }

      img {
        width: 100px;
        height: 100px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: 15vw;
          height: 15vw;
        }
      }

      .box-title1 {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        border-bottom: 5px solid #f78b32;
        text-align: center;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 5vw;
        }
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 12px;
        text-align: center;
        line-height: 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          line-height: 5vw;
        }
      }
    }
  }

  .detail-title {
    line-height: 20px;
    color: rgba(15, 19, 31, 84);
    font-size: 35px;
    text-align: center;

    @media screen and (min-width: 320px) and (max-width: 480px) {
      font-size: 6vw;
    }
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
  flex-direction: column;
  width: 100%;
  height: 200px;
  background-color: rgba(15, 19, 31, 100);
  color: rgba(16, 16, 16, 100);
  padding-top: 20px;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 40vw;
    padding-top: 2vw;
  }
  .bottom-main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    .bottom-left {
      width: 20vw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        flex-direction: column;
        width: auto;
      }

      img {
        width: auto;
        height: 59px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          width: auto;
          height: 4vw;
        }
      }

      .left-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          align-items: center;
        }

        .text1 {
          color: rgba(255, 255, 255, 100);
          font-size: 35px;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 4vw;
          }
        }

        .text2 {
          color: rgba(255, 255, 255, 100);
          font-size: 20px;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 3vw;
          }
        }
      }

      span:hover {
        opacity: 0.7;
      }
    }

    .bottom-right {
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: self-start;
      justify-content: space-around;

      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 80vw;
      }

      .right-detail {
        display: flex;
        flex-direction: column;
        justify-content: start;

        .text1 {
          color: rgba(255, 255, 255, 84);
          font-size: 20px;
          cursor: pointer;
          margin-bottom: 15px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 3vw;
          }
        }

        .text2 {
          color: rgba(255, 255, 255, 84);
          font-size: 15px;
          cursor: pointer;
          font-weight: normal;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            font-size: 3vw;
          }
        }

        .icon {
          display: flex;
          flex-direction: row;

          img {
            width: auto;
            height: 25px;
            margin: 5px;
            cursor: pointer;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              width: auto;
              height: 4vw;
            }
          }
          img:hover {
            opacity: 0.7;
          }
        }

        .text1:hover,
        .text2:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .bottom-pic {
    text-align: center;
    color: rgba(255, 255, 255, 65);
    font-size: 14px;

    @media screen and (min-width: 320px) and (max-width: 480px) {
      font-size: 3vw;
    }
  }
}
</style>

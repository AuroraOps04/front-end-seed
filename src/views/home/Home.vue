<script lang="ts" setup>
import { NAvatar } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { insertTrafficCount } from '@service/traffic'
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

onMounted(() => {
  insertTrafficCount()
})

const router = useRouter()
const store = useStore()
const handleTo = (e: string) => {
  store.commit('SET_MENU', e)
  router.push(`/${e}`)
}
</script>

<template>
  <div>
    <div class="home-top">
      <div class="home-top-menu">
        <!-- logo -->
        <div class="home-top-menu-logo">
          <img src="@/assets/logo.png" alt="logo" />
          <span></span>
          <div class="home-title">
            <span>潮汐</span>
            <span style="color: white">指数</span>
          </div>
        </div>
        <!-- 菜单栏 -->
        <div class="home-top-menu-list">
          <div class="menu-hover" @click="handleTo('home')">首页</div>
          <div @click="handleTo('Leaderboard')">排行榜</div>
        </div>
        <!-- 头像 -->
        <div class="home-top-menu-avatar">
          <NAvatar round :size="40" :src="store.getters?.currentPictureUrl"> </NAvatar>
          <span @click="handleTo('login')" v-if="!store.getters.currentId">登录</span>
          <span @click="handleTo('person')" v-else>个人中心</span>
        </div>
      </div>

      <div class="home-top-main">
        <div class="main-content">
          <div class="title1">新媒体平台榜单定制服务</div>
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
      <div class="bottom-left">
        <span>潮汐指数</span>
      </div>
      <div class="bottom-right">
        <span>关于</span>
        <span>产品</span>
        <span>客服</span>
      </div>
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

      span {
        color: white;
        margin: 0 20px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          margin: 0 1vw;
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

      @media screen and (min-width: 320px) and (max-width: 480px) {
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
        text-align: center;
        font-size: 18px;
        line-height: 40px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
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
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  height: 200px;
  background-color: rgba(15, 19, 31, 100);
  color: rgba(16, 16, 16, 100);
  padding-top: 20px;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 25vw;
    padding-top: 2vw;
  }

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
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 7vw;
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
    align-items: center;
    justify-content: space-around;

    span {
      color: rgba(255, 255, 255, 84);
      font-size: 30px;
      cursor: pointer;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 5vw;
      }
    }

    span:hover {
      opacity: 0.7;
    }
  }
}
</style>

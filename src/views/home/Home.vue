<template>
  <div>
    <div class="home-top">

      <div class="home-top-menu">
        <!-- logo -->
        <div class="home-top-menu-logo">
          <img src="@/assets/logo.png" style="width: 40px;height: 40px">
          <span style="width: 20px"></span>
          <div class="home-title">
            <span>潮汐</span>
            <span style="color:white;">指数</span>
          </div>
        </div>
        <!-- 菜单栏 -->
        <div class="home-top-menu-list">
          <div class="menu-hover">首页</div>
          <div>排行榜</div>
        </div>
        <!-- 头像 -->
        <div class="home-top-menu-avatar">
          <el-avatar :size="50" :src="circleUrl">头像</el-avatar>
        </div>
      </div>

      <div class="home-top-main">
        <div class="main-content">
          <div class="title1" v-html="title1"></div>
          <div class="title2" v-html="title2"></div>
        </div>
      </div>

    </div>

    <div class="home-main">
      <div class="main-detail1">
        <div class="detail-box" v-for="item in detail">
          <img :src="item.url">
          <div class="box-title1">{{ item.title1 }}</div>
          <div class="box-title2" v-html="item.title2"></div>
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
        <img :src="rightPng">
      </div>

      <div class="main-detail4">
        <div class="detail4-box">
          <img :src="facebookPng">
          <span>Facebook指数</span>
        </div>
        <div class="detail4-box">
          <img :src="youtubePng">
          <span>YouTube指数</span>
        </div>
        <div class="detail4-box">
          <img :src="twitterPng">
          <span>Twitter指数</span>
        </div>
        <div class="detail4-box">
          <img :src="instagramsPng">
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
          <img :src="professionalPng">
          <div class="box-title1">专业</div>
          <div class="box-title2">具备专业的技术开发团队<br/>针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="authoritativePng">
          <div class="box-title1">权威</div>
          <div class="box-title2">具备专业的技术开发团队<br/>针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="fastPng">
          <div class="box-title1">极速</div>
          <div class="box-title2">具备专业的技术开发团队<br/>针对不同用户提供定制化服务</div>
        </div>
        <div class="detail6-box">
          <img :src="stablePng">
          <div class="box-title1">稳定</div>
          <div class="box-title2">具备专业的技术开发团队<br/>针对不同用户提供定制化服务</div>
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

<script lang="ts" setup>
import {ref, reactive} from "vue";
import rankingPng from "@/assets/ranking.png"
import analysisPng from "@/assets/analysis.png"
import rightPng from "@/assets/right.png"
import twitterPng from "@/assets/twitter.png"
import youtubePng from "@/assets/youtube.png"
import instagramsPng from "@/assets/instagrams.png"
import facebookPng from "@/assets/facebook.png"
import fastPng from "@/assets/fast.png"
import professionalPng from "@/assets/professional.png"
import authoritativePng from "@/assets/authoritative.png"
import stablePng from "@/assets/stable.png"


const title1 = ref('新媒体平台榜单定制服务')
const title2 = ref(`基于网络公开数据、融媒体及舆论大数据人工智能，<br/>
制定系统化的新媒体大数据评价体系和影响力标准，<br/>
提供舆论分析报告、融媒体平台解决方案、一站式行业大数据解决方案以及软件开发等服务。`)
const detail = reactive([{
  url: rankingPng,
  title1: "平台榜单查询",
  title2: `独家优先形式联合发布数据榜单<br>构筑全平台内容数据价值评估体系`
}, {
  url: analysisPng,
  title1: "账号数据分析",
  title2: `针对账号进行全面的数据监测分析`
}])

</script>

<style lang="scss">

.home-top {
  width: 100%;
  height: 626px;
  background-image: url("@/assets/home_bg.png");
  background-size: 100% 626px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .home-top-menu {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .home-top-menu-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-left: 100px;
      cursor: pointer;

      .home-title {
        width: 108px;
        height: 40px;
        line-height: 40px;
        color: #F78B32FF;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        text-align: left;
        font-family: SourceHanSansSC-regular;
      }
    }

    .home-top-menu-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      width: 750px;

      div {
        cursor: pointer;
        color: white;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        margin: 0 20px;
      }

      div:hover {
        opacity: 0.7;
        border-bottom: 5px solid #F2882B;
      }

      .menu-hover {
        border-bottom: 5px solid #F2882B;
      }
    }

    .home-top-menu-avatar {
      margin-right: 100px;
      cursor: pointer;
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

      .title1 {
        text-align: center;
        font-size: 38px;
        line-height: 100px;
      }

      .title2 {
        text-align: center;
        font-size: 18px;
        line-height: 40px;
      }
    }

  }
}

.home-main {
  display: flex;
  flex-direction: column;
  height: 1650px;

  .main-detail1 {
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: url("@/assets/home_bg2.png");
    background-repeat: no-repeat;
    background-size: 100% 272px;
    margin-top: 108px;

    .detail-box {
      width: 600px;
      height: 300px;
      line-height: 20px;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      text-align: center;
      box-shadow: 0px 2px 30px 0px rgba(68, 120, 249, 0.28);
      font-family: Roboto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      justify-content: space-around;
      margin: 0 100px 0 100px;

      img {
        width: 80px;
        height: 80px;
      }

      .box-title1 {
        text-align: center;
        color: rgba(17, 54, 145, 100);
        font-size: 26px;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        margin: 0 100px;
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
    }

    img {
      width: 22px;
      height: 22px;
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
    box-shadow: 0px 2px 30px 0px rgba(68, 120, 249, 0.28);
    font-family: Roboto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    justify-content: space-around;

    .detail4-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;


      img {
        width: 74px;
        height: 74px;
      }

      span {
        color: rgba(187, 187, 187, 100);
        font-size: 22px;
        line-height: 50px;
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
  }

  .main-detail6 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 100px;

    .detail6-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 250px;

      img {
        width: 100px;
        height: 100px;
      }

      .box-title1 {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        border-bottom: 5px solid #F78B32;
        text-align: center;
      }

      .box-title2 {
        color: rgba(0, 0, 0, 0.43);
        font-size: 12px;
        text-align: center;
        line-height: 20px;
      }

    }
  }

  .detail-title {
    line-height: 20px;
    color: rgba(15, 19, 31, 84);
    font-size: 35px;
    text-align: center;
  }

  .row-line {
    height: 5px;
    background-color: #7488BF;
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
    }

    span:hover {
      opacity: 0.7;
    }
  }

}
</style>

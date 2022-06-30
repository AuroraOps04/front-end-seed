<script lang="ts" setup>
import personLogoPng from "@/assets/person_logo.png"
import personIconPng from "@/assets/person_icon.png"
import personIcon2Png from "@/assets/person_icon2.png"
import personIcon3Png from "@/assets/person_icon3.png"
import personGradePng from "@/assets/person_grade.png"
import rankingBgPng from "@/assets/ranking_bg.png"
import {NAvatar, NIcon} from "naive-ui";
import {ref, reactive} from "vue";
import {
  PersonOutline,
  StarOutline,
  BarChartOutline,
  PersonCircleOutline,
  IdCardSharp,
  LockClosed,
  PhonePortraitOutline
} from "@vicons/ionicons5";
import Header from "@/components/Header.vue"

const avatar = ref("头像")
const username = ref("账号名称")
const phoneNumber = ref("131****8768")
const menuArr = reactive([
  {
    name: "我的资料",
    code: "person",
    isSelect: true
  },
  {
    name: "我的榜单",
    code: "Leaderboard",
    isSelect: false
  }, {
    name: "收藏账号",
    code: "collect",
    isSelect: false
  },
])
const handleClick = (e: string) => {
  menuArr.forEach(item => {
    item.isSelect = item.code === e;
  })
}
</script>

<template>
  <div>
    <Header></Header>
    <div class="person-top">
      <!-- logo -->
      <div class="person-top-menu-logo">
        <img :src="personLogoPng" style="width: 100px;" alt="logo">
        <span style="width: 20px"></span>
        <div class="logo-title">
          <span>潮汐</span>
          <span style="color:black;">指数</span>
        </div>
      </div>
    </div>

    <div class="person-main">
      <div class="main">
        <div class="main-menu">
          <div class="menu-avatar">
            <n-avatar round :size="80">
              {{ avatar }}
            </n-avatar>
          </div>
          <span class="menu-username">账号名称</span>
          <div class="menu-identification">
            <img :src="personGradePng" style="width: 30px;height: 30px;margin-right: 10px" alt="用户等级">
            <div class="identification-grade">用户等级</div>
          </div>
          <hr style="background: rgba(140,140,140,0.02)">
          <div class="menu-list">
            <div class="list-content" v-for="item in menuArr">
              <n-icon size="25" v-if="item.code==='person'" :component="PersonOutline"
                      :color="item.isSelect?'#F78B32':'black'" @click="handleClick(item.code)"/>
              <n-icon size="25" v-else-if="item.code==='Leaderboard'" :component="BarChartOutline"
                      :color="item.isSelect?'#F78B32':'black'" @click="handleClick(item.code)"/>
              <n-icon size="25" v-else-if="item.code==='collect'" :component="StarOutline"
                      :color="item.isSelect?'#F78B32':'black'" @click="handleClick(item.code)"/>
              <span :style="{color: item.isSelect?'#F78B32':'black'}" @click="handleClick(item.code)">{{
                  item.name
                }}</span>
            </div>
          </div>
        </div>

        <div class="main-content">
          <template v-for="item in menuArr">
            <div class="content-header" v-if="item.isSelect">
              <span>{{ '/' + item.name }}</span>
            </div>
            <hr style="background-color:rgb(239,239,239) " v-if="item.isSelect">
            <div v-if="item.code==='person'&&item.isSelect" class="content-person">
              <div class="person-list">
                <div class="list-title">
                  <n-icon size="40" :component="PersonCircleOutline" color="black" :depth="3"/>
                  <span>头像</span>
                </div>
                <div class="list-info">
                  <n-avatar round :size="48">
                    {{ avatar }}
                  </n-avatar>
                </div>
                <div class="list-controller">更换头像</div>
              </div>

              <div class="person-list">
                <div class="list-title">
                  <n-icon size="40" :component="IdCardSharp" color="black" :depth="3"/>
                  <span>账号</span>
                </div>
                <div class="list-info">
                  {{ username }}
                </div>
                <div class="list-controller">修改名称</div>
              </div>

              <div class="person-list">
                <div class="list-title">
                  <n-icon size="40" :component="LockClosed" color="black" :depth="3"/>
                  <span>密码</span>
                </div>
                <div class="list-info">
                  ************
                </div>
                <div class="list-controller">修改密码</div>
              </div>

              <div class="person-list">
                <div class="list-title">
                  <n-icon size="40" :component="PhonePortraitOutline" color="black" :depth="3"/>
                  <span>绑定手机号</span>
                </div>
                <div class="list-info">
                  {{ phoneNumber }}
                </div>
                <div class="list-controller">更换号码</div>
              </div>
            </div>
            <div v-else-if="item.code==='Leaderboard'&&item.isSelect" class="content-ranking">
              <img :src="rankingBgPng" style="width: 400px" alt="排行榜">
            </div>
            <div v-else-if="item.code==='collect'&&item.isSelect" class="content-collect">

            </div>
          </template>
        </div>
      </div>
      <img :src="personIconPng" class="main-icon1" alt="背景图标">
      <img :src="personIcon2Png" class="main-icon2" alt="背景图标">
      <img :src="personIcon3Png" class="main-icon3" alt="背景图标">
    </div>

  </div>
</template>

<style lang="scss">
.person-top {
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  margin: 0 100px;

  .person-top-menu-logo {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    .logo-title span {
      color: #F78B32;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 5px;
    }
  }
}

.person-main {
  position: relative;
  height: 1000px;

  .main {
    margin: 0 100px;
    height: 100%;
    border-radius: 20px;
    box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
    background-color: white;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;

    .main-menu {
      height: 100%;
      width: 20%;
      border-radius: 20px;
      box-shadow: 0 2px 21px 2px rgba(107, 122, 249, 0.15);
      background: linear-gradient(to bottom, rgba(107, 122, 249, 0.15), white);
      display: flex;
      flex-direction: column;
      justify-content: start;

      .menu-avatar {
        margin: 25px;
      }

      .menu-username {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .menu-identification {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 25px 0;

        .identification-grade {
          width: 100px;
          height: 30px;
          text-align: left;
          padding-left: 15px;
          line-height: 30px;
          border-radius: 15px;
          background: linear-gradient(to right, #F78B32, rgba(0, 0, 0, 0));
          font-size: 16px;
          color: white;
        }
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        margin: 30px 0;

        .list-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
          cursor: pointer;

          span {
            margin: 0 10px;
            font-size: 16px;
            letter-spacing: 2px;
          }
        }

        .list-content:hover {
          opacity: 0.7;
        }
      }
    }

    .main-content {
      width: 100%;

      .content-header {
        color: #BDC7DF;
        font-size: 20px;
        text-align: left;
        height: 60px;
        line-height: 60px;
        margin: 0 20px;
      }

      .content-person {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 100px;

        .person-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .list-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin: 20px 0;

            span {
              font-size: 16px;
              color: #757575;
              margin: 0 20px;
            }
          }

          .list-info {
            font-size: 16px;
          }

          .list-controller {
            font-size: 16px;
            color: #F78B32;
            border-bottom: 1px solid #F78B32;
            cursor: pointer;
          }

          .list-controller:hover {
            opacity: 0.7;
          }
        }
      }

      .content-ranking {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
    }
  }

  .main-icon1 {
    width: 60%;
    position: absolute;
    top: -50px;
    right: 60px;
    z-index: -1;
  }

  .main-icon2 {
    width: 20%;
    position: absolute;
    bottom: -50px;
    left: 0;
    z-index: -1;
  }

  .main-icon3 {
    width: 40%;
    position: absolute;
    top: 200px;
    left: 0;
    z-index: -1;
  }
}

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
    background: url("@/assets/home_bg2.png") no-repeat;
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
      box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
      display: flex;
      flex-direction: column;
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
    box-shadow: 0 2px 30px 0 rgba(68, 120, 249, 0.28);
    display: flex;
    flex-direction: row;
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

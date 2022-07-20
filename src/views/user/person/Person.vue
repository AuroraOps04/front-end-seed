<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PersonOutline, StarOutline, BarChartOutline } from '@vicons/ionicons5'
import { useStore } from 'vuex'

import { NAvatar, NIcon } from 'naive-ui'

import personLogoPng from '@/assets/person_logo.png'
import personIconPng from '@/assets/person_icon.png'
import personIcon2Png from '@/assets/person_icon2.png'
import personIcon3Png from '@/assets/person_icon3.png'
import personGradePng from '@/assets/person_grade.png'
import Header from '@/components/body/Header.vue'

const router = useRouter()
const store = useStore()
const menuArr = reactive([
  {
    name: '账号管理',
    code: 'person',
    path: '/person/person',
    isSelect: true
  },
  {
    name: '我的榜单',
    code: 'Leaderboard',
    path: '/person/leaderboard',
    isSelect: false
  },
  {
    name: '收藏账号',
    code: 'collect',
    path: '/person/collect',
    isSelect: false
  }
])
const menuName = ref<string>()
const handleClick = (e: string) => {
  menuArr.forEach((item) => {
    const tempItem: any = item
    if (tempItem.code === e) {
      store.commit('SET_PERSON_MENU', e)
      localStorage.setItem('person_menu', e)
      menuName.value = tempItem.name
      tempItem.isSelect = true
      router.push(tempItem.path)
    } else {
      tempItem.isSelect = false
    }
  })
}
onMounted(() => {
  const personMenu = localStorage.getItem('person_menu')
  if (personMenu !== '') {
    handleClick(personMenu as string)
  }
})
</script>

<template>
  <div>
    <Header />
    <div class="person-top">
      <!-- logo -->
      <div class="person-top-menu-logo">
        <img :src="personLogoPng" alt="logo" />
        <span></span>
        <div class="logo-title">
          <span>潮汐</span>
          <span style="color: black">指数</span>
        </div>
      </div>
    </div>

    <div class="person-main">
      <div class="main">
        <div class="main-menu">
          <div class="menu-avatar">
            <NAvatar :size="50" :src="store.getters?.currentPictureUrl" round></NAvatar>
          </div>
          <span class="menu-username">{{ store.getters.currentUsername }}</span>
          <span class="menu-ipaddress">IP所属地：{{ store.getters.currentIpAddress }}</span>
          <div class="menu-identification">
            <img :src="personGradePng" alt="用户等级" />
            <div class="identification-grade">普通用户</div>
          </div>
          <hr style="background: rgba(140, 140, 140, 0.02)" />
          <div class="menu-list">
            <div v-for="(item, index) in menuArr" :key="index" class="list-content">
              <NIcon
                v-if="item.code === 'person'"
                :color="item.isSelect ? '#F78B32' : 'black'"
                :component="PersonOutline"
                size="25"
                @click="handleClick(item.code)"
              />
              <NIcon
                v-else-if="item.code === 'Leaderboard'"
                :color="item.isSelect ? '#F78B32' : 'black'"
                :component="BarChartOutline"
                size="25"
                @click="handleClick(item.code)"
              />
              <NIcon
                v-else-if="item.code === 'collect'"
                :color="item.isSelect ? '#F78B32' : 'black'"
                :component="StarOutline"
                size="25"
                @click="handleClick(item.code)"
              />
              <span
                :style="{ color: item.isSelect ? '#F78B32' : 'black' }"
                @click="handleClick(item.code)"
                >{{ item.name }}</span
              >
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="content-header">
            <span>{{ '/' + menuName }}</span>
          </div>
          <hr style="background-color: rgb(239, 239, 239)" />
          <router-view></router-view>
        </div>
      </div>
      <!--        <img :src="personIconPng" alt="背景图标" class="maiNIcon1" />-->
      <img :src="personIcon2Png" alt="背景图标" class="maiNIcon2" />
      <img :src="personIcon3Png" alt="背景图标" class="maiNIcon3" />
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
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 20vw;
    margin: 0 5vw;
  }

  .person-top-menu-logo {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    span {
      width: 20px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 5vw;
      }
    }

    img {
      width: 100px;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        width: 15vw;
      }
    }

    .logo-title span {
      color: #f78b32;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 1vw;
      @media screen and (min-width: 320px) and (max-width: 480px) {
        font-size: 6vw;
      }
    }
  }
}

.person-main {
  position: relative;
  height: 1000px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: auto;
  }

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
    @media screen and (min-width: 320px) and (max-width: 480px) {
      margin: 0 1vw;
    }

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
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 5vw 0;
        }
      }

      .menu-username {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
      }

      .menu-ipaddress {
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 2px;
        color: rgba(187, 187, 187, 100);
      }

      .menu-identification {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 25px 0;

        @media screen and (min-width: 320px) and (max-width: 480px) {
          flex-direction: column;
          margin: 2vw 0;
        }

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin-right: 0;
          }
        }

        .identification-grade {
          width: 100px;
          height: 30px;
          text-align: left;
          padding-left: 15px;
          line-height: 30px;
          border-radius: 15px;
          //background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
          background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
          font-size: 16px;
          color: white;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            height: 6vw;
            line-height: 6vw;
            width: auto;
            font-size: 3vw;
            border-radius: 2vw;
            padding: 0 1vw;
            margin: 2vw 0;
          }
        }
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        margin: 30px 0;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 10vw 0;
        }

        .list-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            flex-direction: column;
          }

          span {
            margin: 0 10px;
            font-size: 16px;
            letter-spacing: 2px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 0;
              font-size: 3vw;
            }
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
        color: #bdc7df;
        font-size: 20px;
        text-align: left;
        height: 60px;
        line-height: 60px;
        margin: 0 20px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
          height: 10vw;
          line-height: 10vw;
        }
      }

      .content-person {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 50px;
        @media screen and (min-width: 320px) and (max-width: 480px) {
          margin: 2vw;
        }

        .pbtn-save {
          border: none;
          width: 150px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(112, 172, 255, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          margin: 10px 5px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 30vw;
            height: 8vw;
            line-height: 8vw;
          }
        }

        .pbtn-close {
          border: none;
          width: 150px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(187, 187, 187, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          margin: 10px 5px;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 30vw;
            height: 8vw;
            line-height: 8vw;
          }
        }

        .pbtn-logout {
          border: none;
          width: 310px;
          height: 35px;
          line-height: 35px;
          border-radius: 8px;
          background-color: rgba(221, 53, 53, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            width: 63vw;
            height: 8vw;
            line-height: 8vw;
          }
        }

        .pbtn-save:hover,
        .pbtn-close:hover,
        .pbtn-logout:hover {
          opacity: 0.7;
        }

        .person-title {
          position: relative;
          text-align: left;
          margin-bottom: 50px;

          .title-span {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }

          .title-bg {
            position: absolute;
            top: 20px;
            left: -5px;
            height: 20px;
            border-radius: 10px;
            width: 100px;
            background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
          }
        }

        .person-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          @media screen and (min-width: 320px) and (max-width: 480px) {
            margin: 5vw 0;
          }

          .list-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin: 20px 0;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              margin: 1vw 0;
            }

            img {
              width: 30px;
              height: 30px;
            }

            span {
              font-size: 16px;
              color: #757575;
              margin: 0 20px;
              @media screen and (min-width: 320px) and (max-width: 480px) {
                font-size: 4vw;
                margin: 0;
              }
            }
          }

          .list-info {
            font-size: 16px;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }

            .info-identification {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              margin: 25px 0;

              @media screen and (min-width: 320px) and (max-width: 480px) {
                flex-direction: column;
                margin: 2vw 0;
              }

              img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
                @media screen and (min-width: 320px) and (max-width: 480px) {
                  margin-right: 0;
                }
              }

              .identification-grade {
                width: 100px;
                height: 30px;
                text-align: left;
                padding-left: 15px;
                line-height: 30px;
                border-radius: 15px;
                //background: linear-gradient(to right, #f78b32, rgba(0, 0, 0, 0));
                background: linear-gradient(to right, #bbbbbb, rgba(0, 0, 0, 0));
                font-size: 16px;
                color: white;
                @media screen and (min-width: 320px) and (max-width: 480px) {
                  height: 6vw;
                  line-height: 6vw;
                  width: auto;
                  font-size: 3vw;
                  border-radius: 2vw;
                  padding: 0 1vw;
                  margin: 2vw 0;
                }
              }
            }
          }

          .list-controller {
            font-size: 16px;
            color: #f78b32;
            border-bottom: 1px solid #f78b32;
            cursor: pointer;

            @media screen and (min-width: 320px) and (max-width: 480px) {
              font-size: 4vw;
            }
          }

          .list-controller:hover {
            opacity: 0.7;
          }
        }
      }

      .content-ranking {
        overflow: hidden;
        height: 100vh;

        .leaderboard_title {
          padding-left: 3vw;
          width: 150px;

          .leaderboard_txt {
            font-size: 20px;
            position: absolute;
            margin: 6px 0 0 15px;
          }

          .leaderboard_title_png {
            margin: 3vh 0 1vh 0;
            height: 2.5vh;
          }
        }

        .toolbar {
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          width: calc(100%);
          margin: 20px 0 20px 0;

          .search_tool {
            display: flex;
            width: calc(50%);
          }

          .search_button {
            display: flex;
            width: calc(50%);
            justify-content: right;
            @media screen and (min-width: 320px) and (max-width: 480px) {
              width: auto;
              justify-content: center;
              margin: 2vw 0;
            }
          }
        }

        .custom-list-sub-interface {
          width: 90%;
        }
      }
    }
  }

  .maiNIcon1 {
    width: 60%;
    position: absolute;
    top: -50px;
    right: 60px;
    z-index: -1;
  }

  .maiNIcon2 {
    width: 20%;
    position: absolute;
    bottom: -50px;
    left: 0;
    z-index: -1;
  }

  .maiNIcon3 {
    width: 40%;
    position: absolute;
    top: 200px;
    left: 0;
    z-index: -1;
  }
}
</style>

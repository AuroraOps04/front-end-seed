<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInputGroup } from 'naive-ui'
import NavigationBar from '@/components/user/facebook/NavigationBar.vue'
import Header from '@/components/body/Header.vue'

const accountName = ref<string>('')
const navigationBarRef = ref<any>()
// 调用findAccountSelectPage方法
const getNavigationBar = () => {
  navigationBarRef.value.NavigationBarMethod(accountName.value)
}
</script>
<template>
  <div class="leaderBoardBak">
    <Header></Header>
    <div class="tideBackground">
      <div class="searchHeader">
        <div class="tide">
          <div class="home-top-menu-logo">
            <img alt="logo" src="@/assets/logo.png" />
            <span></span>
            <div class="home-title">
              <span>潮汐</span>
              <span style="color: white">指数</span>
            </div>
          </div>
          <div class="rightTide">
            <div>
              <NInputGroup>
                <input v-model="accountName" class="form_input" type="text" />
                <NButton ghost type="info" @click="getNavigationBar"> 搜索账号 </NButton>
              </NInputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="navigationBarStyle">
      <NavigationBar ref="navigationBarRef"></NavigationBar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tideBackground {
  background-image: url('@/assets/home_bg.png');
  background-size: 100% 626px;
  background-repeat: no-repeat;
  height: 250px;

  @media screen and (min-width: 320px) and (max-width: 480px) {
    height: 40vw;
  }
}

.navigationBarStyle {
  border: 1px solid white;
  margin-left: calc(3%);
  margin-right: calc(3%);
}

.tidalIndex {
  padding-left: 100px;
  color: white;
  font-size: 25px;
  @media screen and (min-width: 320px) and (max-width: 480px) {
    padding-left: 5vw;
    font-size: 7vw;
  }
}

.searchHeader {
  width: calc(100%);
  height: calc(100%);
}

.home-top-menu-logo {
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

.rightTide {
  width: calc(60%);
  padding-left: calc(25%);
}

input[type='text'],
#btn1,
#btn2 {
  box-sizing: border-box;
  text-align: center;
  font-size: 1.4em;
  height: 34px;
  border-radius: 4px;
  border: 1px solid #08327e;
  color: #6a6f77;
  -moz-appearance: none;
  display: block;
  outline: 0;
  padding: 0 1em;
  text-decoration: none;
  width: 45%;
  background-color: #0e1222;
  opacity: 0.7;
}

input[type='text']:focus {
  border: 1px solid #08327e;
}

.tide {
  padding-top: calc(5%);
  display: flex;
  flex-wrap: nowrap;
}
</style>

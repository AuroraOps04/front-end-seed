<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInputGroup } from 'naive-ui'
import NavigationBar from '@/components/facebook/NavigationBar.vue'
import Header from '@/components/Header.vue'

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
          <div class="leftTide">
            <span class="tidalIndex">潮汐指数</span>
          </div>
          <div class="rightTide">
            <div>
              <NInputGroup>
                <input type="text" class="form_input" v-model="accountName" />
                <!--                <NInput :style="{ width: '40%'}" v-model:value="accountName"/>-->
                <NButton type="info" ghost @click="getNavigationBar"> 搜索账号 </NButton>
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
<style scoped lang="scss">
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

.leftTide {
  float: left;
  width: calc(40%);
}

.rightTide {
  float: left;
  width: calc(60%);
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
}
</style>

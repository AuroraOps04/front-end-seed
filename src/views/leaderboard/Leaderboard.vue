<script lang="ts" setup>
  import {ref} from 'vue'
  import NavigationBar from '@/components/facebook/NavigationBar.vue'
  import { NButton,NInput,NInputGroup } from 'naive-ui'
  import Header from "@/components/Header.vue"
  const accountName = ref<string>('')
  const navigationBarRef = ref<any>();
  //调用findAccountSelectPage方法
  const getNavigationBar = () => {
    navigationBarRef.value.NavigationBarMethod(accountName.value);
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

              <n-input-group>
                <input type="text" class="form_input" v-model="accountName"/>
<!--                <n-input :style="{ width: '40%'}" v-model:value="accountName"/>-->
                <n-button type="info" ghost @click="getNavigationBar">
                  搜索账号
                </n-button>
              </n-input-group>
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
<style scoped>
  .tideBackground {
    background-image: url("@/assets/home_bg.png");
    background-size: 100% 626px;
    background-repeat: no-repeat;
    height: 250px;
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
  }

  .searchHeader {
    width: calc(100%);
    height: calc(100%)
  }

  .leftTide {
    float: left;
    width: calc(40%);
  }

  .rightTide {
    float: left;
    width: calc(60%);
  }
  input[type="text"],#btn1,#btn2{
    box-sizing: border-box;
    text-align:center;
    font-size:1.4em;
    height:34px;
    border-radius:4px;
    border:1px solid #08327E;
    color:#6a6f77;
    -web-kit-appearance:none;
    -moz-appearance: none;
    display:block;
    outline:0;
    padding:0 1em;
    text-decoration:none;
    width:45%;
  }
  input[type="text"]:focus{
    border:1px solid #08327E;
  }

  .tide {
    padding-top: calc(8%);
  }

</style>

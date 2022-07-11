<script lang="ts" setup>
import { NGrid, NGi } from 'naive-ui'
import UserList from '@/components/userlist/UserList.vue'
import Menu from '@/components/admin/Menu.vue'
import userNum from '@/assets/userNum.png'
import accountNum from '@/assets/accountNum.png'
import visitsNum from '@/assets/visitsNum.png'
import underLine from '@/assets/underLine.png'

// 设置实例参数
const userNumPng = userNum
const underLinePng = underLine
const accountNumPng = accountNum
const visitsNumPng = visitsNum
</script>
<template>
  <div class="box_flex">
    <div class="box_bg1">
      <h3>数据看板</h3>
      <img :src="underLinePng" />
      <NGrid x-gap="12" :cols="3">
        <NGi>
          <div style="display: flex; align-items: center">
            <div class="icon"><img :src="visitsNumPng" /></div>

            <div class="title">
              <h3>网站访问量</h3>
              <text>356645</text>
            </div>
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div class="icon"><img :src="userNumPng" /></div>

            <div class="title">
              <h3>注册用户量</h3>
              <text>356645</text>
            </div>
          </div>
        </NGi>
        <NGi>
          <div style="display: flex; align-items: center">
            <div class="icon"><img :src="accountNumPng" /></div>

            <div class="title">
              <h3>检测账号量</h3>
              <text>356645</text>
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>
    <div class="box_bg2">
      <h3>数据趋势</h3>
      <img :src="underLinePng" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box_flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .box_bg1 {
    height: 40%;
    width: 80%;
    margin: 2%;
    margin-left: 80px;
    padding: 2%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: calc(100% - 8vw);
      height: 100%;
      margin: 2vw;
      margin-left: 0;
      padding: 2vw;
    }

    .icon {
      img {
        width: 10vw;
        height: 10vw;
      }
    }

    .title {
      h3 {
        @media screen and (min-width: 320px) and (max-width: 480px) {
          font-size: 4vw;
        }
      }
    }
  }

  .box_bg2 {
    height: 80%;
    width: 80%;
    margin: 2%;
    margin-left: 80px;
    padding: 3%;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    @media screen and (min-width: 320px) and (max-width: 480px) {
      width: calc(100% - 8vw);
      height: 100%;
      margin: 2vw;
      margin-left: 0;
      padding: 2vw;
    }
  }
}
</style>

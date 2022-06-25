<template>
  <div class="leaderBoardBak">
    <div class="tideBackground">
      <div class="searchHeader">
        <div class="tide">
          <div class="leftTide">
            <span class="tidalIndex">潮汐指数</span>
          </div>
          <div class="rightTide">
            <div style="possion:absolute">
              <el-form-item>
                <el-col :span="6">
                  <el-input></el-input>
                </el-col>
                <el-col :span="18">
                  <el-button type="primary">搜索账号</el-button>
                </el-col>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="navigationBarStyle">
      <NavigationBar></NavigationBar>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {defineComponent, ref, reactive, onMounted} from 'vue'
  import NavigationBar from '../../components/facebook/NavigationBar.vue'
  import { listDictByPageApi } from '../../service/dict'
  const params = reactive<API.DictParams & API.PageParams>({
    pageSize: 10,
    page:1
  })
  let data = reactive<API.Dict []>([])

  const fetchDictByPage = async () => {
    const res = await listDictByPageApi(params)
    data = res.data as API.Dict []
  }
  onMounted(() => {
    // fetchDictByPage()
  })

</script>
<style>
  .tideBackground {
    background-image: url("@/assets/home_bg.png");
    background-size: 100% 626px;
    background-repeat: no-repeat;
    possion: relative;
    height: 280px;
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

  .tide {
    padding-top: calc(10%);
  }
  .leaderBoardBak{
    box-shadow: 0px 2px 10px 1px rgba(17, 54, 145, 30);
  }
</style>

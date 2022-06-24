<template>


  <div>


    <el-card class='box-card' shadow='always'>

      <el-row :gutter='1'>
        <el-col :span='3'>
          <div class='profile_picture'>
            <el-avatar src='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' :size='100' />

            <div style='padding: 30px'>
              <el-button type='warning' plain class='button'>收藏</el-button>
            </div>


          </div>
        </el-col>

        <el-col :span='16'>
          <div class='acc_body1'>
            <text class='account_name'>账号名称</text>
          </div>
          <div class='acc_body2'>
            <text class='text_brief'>账号名称：</text>
            <text class>XXXXXXX</text>

          </div>
          <div class='acc_body3'>
            <text class='text_brief'>个人简介：</text>
            <text class>XXXXXXX</text>

          </div>
          <div class='acc_body4'>

            <el-row :gutter='1'>
              <el-col :span='7'>
                <div class='profile_info'>
                  <text class='text_brief'>分类</text>
                  <text class='text_brief_info'>两岸</text>
                </div>
              </el-col>

              <el-col :span='7'>
                <div class='profile_info'>
                  <text class='text_brief'>地区</text>
                  <text class='text_brief_info'>大陆</text>
                </div>
              </el-col>
              <el-col :span='7'>
                <div class='profile_info'>
                  <text class='text_brief'>粉丝数</text>
                  <text class='text_brief_info'>100万+</text>

                </div>
              </el-col>


            </el-row>


          </div>
        </el-col>


        <el-col :span=4>
          <div class='score_body'>
            <text class='text_exponential'>888.8</text>

            <text class='text_exponential'> 分</text>
            <text class='text_num'> /周潮汐指数</text>

          </div>

          <div class='rank_body'>
            <text class='rank'>NO.</text>
            <text class='rank'>1</text>
          </div>
        </el-col>
      </el-row>


    </el-card>


  </div>
  <div>


    <el-card class='box-card2' shadow='always'>

      <el-row :gutter='1'>
        <el-col :span='3'>
          <div>
            <h2 class='text text_first_label'>账号数据</h2>

          </div>
        </el-col>
        <el-col :span='18'>
          <div class='data_body'>
            <h5 class='text_date'>更新于{{currentDate}}</h5>
          </div>
        </el-col>

        <el-col :span='3'>
          <div style='padding-right: 10px'>
            <el-button-group>
              <el-button plain type='warning' round>日榜</el-button>
              <el-button plain round>周榜</el-button>
            </el-button-group>

          </div>
        </el-col>
      </el-row>

      <el-row :gutter='1'>
        <el-col :span='4'>
          <div style='display: flex;align-items: center'>
            <text class='text text_second_label'>榜单排行</text>
            <img :src='arrowpng' class='img_arrow' />

          </div>
        </el-col>

      </el-row>

      <el-row :gutter='1' style='margin-bottom: 80px'>
        <el-col :span=6>
          <div class='score_body2'>
            <text class='text_exponential2'>888.8</text>

            <text class='text_exponential2'> 分</text>
            <text class='text_num'> /周潮汐指数</text>

          </div>

          <div class='rank_body2'>
            <text class='rank'>NO.</text>
            <text class='rank'>1</text>
          </div>
        </el-col>

      </el-row>


      <el-row :gutter='1' style='margin-bottom: 80px'>
        <el-col :span='4'>
          <div style='display: flex;align-items: center'>
            <text class='text text_second_label'>互动数据</text>
            <img :src='arrowpng' class='img_arrow' />

          </div>
        </el-col>

      </el-row>

      <el-row :gutter='1' style='margin-bottom: 80px'>
        <el-col :span='6' class='info_icon'>

          <h4>发文数</h4>
        </el-col>
        <el-col :span='6' class='info_icon'>

          <h4>点赞数</h4>
        </el-col>
        <el-col :span='6' class='info_icon'>

          <h4> 评论数</h4>
        </el-col>
        <el-col :span='6' class='info_icon'>

          <h4>转发数</h4>
        </el-col>
      </el-row>


      <el-row :gutter='1'>
        <el-col :span='4'>
          <div style='display: flex;align-items: center'>
            <text class='text text_second_label'>数据趋势</text>
            <img :src='arrowpng' class='img_arrow' />

          </div>
        </el-col>
      </el-row>

      <el-row :gutter='1'>
        <el-col :span='8'>
          <div class='button_body'>

            <el-button class='button_1' round type='warning'>发文数</el-button>
            <el-button class='button_1' round>点赞数</el-button>
            <el-button class='button_1' round>评论数</el-button>
            <el-button class='button_1' round>转发数</el-button>

          </div>
        </el-col>

        <el-col :span='12'>
          <div
            ref='myChart'
            id='myChart'
            :style="{ width: '700px', height: '350px' }"
          ></div>
        </el-col>

      </el-row>
    </el-card>


  </div>
</template>

<script lang='ts' setup>
import { getCurrentInstance, onMounted } from 'vue'
import arrow from '../../assets/arrow.png'

// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法
let internalInstance = getCurrentInstance()
let echarts = internalInstance!.appContext.config.globalProperties.$echarts

onMounted(() => {
  const dom = document.getElementById('myChart')
  const myChart = echarts.init(dom) // 初始化echarts实例
  const option = {
    xAxis: {
      type: 'category',
      data: ['05.23~05.29', '05.30~06.05', '06.06~06.12', '06.13~06.19']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [12, 7, 25, 22, 27],
        type: 'line',
        smooth: true
      }
    ]
  }
  myChart.setOption(option);
})

const getDate = () => {
  const date = new Date()
  let year = date.getFullYear()
  let month = (date.getMonth() + 1)
  let day = date.getDate()

  // day = day < 10 ? "0" + day : day; //day小于10，加0
  return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}
// 设置实例参数
const currentDate = getDate()
const arrowpng = arrow


</script>


<style scoped>
.text {
  font-style: italic;

}

.text_first_label {
  margin: 25px;
}

.text_second_label {
  margin-top: 5px;
  margin-left: 40px;
  margin-right: 18px;
  font-size: 18px;
  font-weight: 600;


}

.img_arrow {
  width: 20px;
  height: 20px;
  margin-top: 10px
}

.info_icon {
  text-align: center;
}

.text_date {

  color: rgba(17, 54, 145, 58);
  font-size: 8px;
  text-align: left;
  font-family: SourceHanSansSC-medium;
}

.data_body {
  margin-top: 40px;
  margin-left: 20px;
}

.text_num {
  font-size: 8px;
  font-weight: 600;

}

.text_exponential {
  color: rgba(17, 54, 145, 58);
  font-size: 28px;
  font-weight: 700;

}

.text_exponential2 {
  color: rgba(17, 54, 145, 58);
  font-size: 28px;
  font-weight: 550;

}

.text_brief {
  color: #6A6969;

}

.text_brief_info {
  font-size: 20px;
}

.button_1 {
  width: 120px;
  margin: 10px;
}

.acc_body1 {
  margin-top: 15px;
}

.acc_body2 {
  margin: 10px;

}

.acc_body3 {
  margin: 10px;

}

.acc_body4 {
  margin: 10px;

}

.button_body {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 80px;

  text-align: center;
  justify-content: center;

}

.item {
  padding: 18px 0;
}

.button {
  padding-left: 1%;
}

.box-card {
  width: 90%;
  margin: 5%;
  border-radius: 20px


}

.profile_info {
  display: flex;
  flex-direction: column;
  padding: 1%;
  text-align: center;

}

.score_body {
  margin-top: 50px;
}

.rank_body {
  margin-top: 20px;
}

.score_body2 {
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
}

.rank_body2 {
  margin-top: 10px;
  margin-left: 40px;
  margin-right: 40px;
}

.rank {
  font-size: 20px;
  font-weight: 700;
}

.account_name {
  font-size: 20px;
  font-weight: 600;
}

.box-card2 {
  width: 90%;
  margin: 5%;
  height: auto;
  border-radius: 20px
}
</style>


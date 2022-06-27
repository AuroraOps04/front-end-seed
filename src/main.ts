import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'



// 引入 echarts
import * as echarts from 'echarts'
const app = createApp(App)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts



app.use(store)
app.use(router)



app.mount('#app')


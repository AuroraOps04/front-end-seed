import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'


// 新增代码：引入全部组件及样式
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";

// 引入 echarts
import * as echarts from 'echarts'
const app = createApp(App)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts



app.use(store)
app.use(router)

// 新增代码：注册全部组件
app.use(ElementPlus)

app.mount('#app')


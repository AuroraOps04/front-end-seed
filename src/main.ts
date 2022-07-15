import { createApp } from 'vue'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import 'normalize.css/normalize.css'
import './assets/iconfont/iconfont.css'
import App from './App.vue'

import router from '@/router/index'
import store from '@/store/index'

// 引入 vxe-table组件
// 网址连接 :https://vxetable.cn/#/table/start/install
import 'xe-utils'

// 创建vuerouter后，调用beforeEach方法，每个路由跳转时都将其跳转的路由推给百度。
router.afterEach((to, from, next) => {
  setTimeout(() => {
    ;(() => {
      const { document } = window
      // 每次执行前，先移除上次插入的代码
      if (document.getElementById('baidu_tj')) {
        document.getElementById('baidu_tj')!.remove()
      }
      const hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?xxxx'
      hm.id = 'baidu_tj'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode!.insertBefore(hm, s)
    })()
  }, 0)
})

// @ts-ignore
function useTable(app: App) {
  app.use(VXETable)
}

createApp(App).use(router).use(store).use(useTable).mount('#app')

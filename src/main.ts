import { createApp } from 'vue'
import App from './App.vue'

// @ts-ignore
import router from '@/router/index'
// @ts-ignore
import store from '@/store/index'
// 引入 vxe-table组件
// 网址连接 :https://vxetable.cn/#/table/start/install
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// @ts-ignore
function useTable (app: App) {
    app.use(VXETable)

    // 给 vue 实例挂载内部对象，例如：
    // app.config.globalProperties.$XModal = VXETable.modal
    // app.config.globalProperties.$XPrint = VXETable.print
    // app.config.globalProperties.$XSaveFile = VXETable.saveFile
    // app.config.globalProperties.$XReadFile = VXETable.readFile
}

createApp(App).use(router).use(store).use(useTable).use(ElementPlus).mount('#app')

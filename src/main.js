import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon-font/iconfont.css'
import '@/assets/icon-font/iconfont.css'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import i18n from './i18n.js'
// import VConsole from 'vconsole'
// const vConsole = new VConsole()

const app = createApp(App)

app.config.productionTip = false

app.use(ElementPlus).use(VueViewer).use(store).use(router).use(i18n).mount('#app')

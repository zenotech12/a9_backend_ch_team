import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import 'jquery'
import VCharts from 'v-charts'

import i18n from './utils/i18n'
import '@/icons' // icon
import '@/permission' // permission control
import './components/platformCom/install'
import '@/assets/css/override-element-ui.scss'
import { imgGetUrl } from '@/utils/serverConfig'
import echarts from 'echarts'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.use(ElementUI, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    getImageUrl(val, width) {
      if (!val) {
        return ''
      }
      const cd = new Date()
      let imgUrl = imgGetUrl + '?md5=' + val + '&t=' + cd.getMilliseconds()
      if (width) {
        imgUrl += '&width=' + width
      }
      return imgUrl
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

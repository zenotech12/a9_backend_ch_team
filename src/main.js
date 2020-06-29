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
import moment from 'moment'
import VueClipboard from 'vue-clipboard2'
import * as filters from './utils/filters'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$moment = moment

Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.use(VueClipboard)
Vue.config.productionTip = false

Vue.mixin({
  data() {
    return {
      functionCode: ''
    }
  },
  mounted() {
    if (this.$route !== undefined && this.$route.meta !== undefined) {
      this.functionCode = this.$route.meta.code
    }
  },
  methods: {
    permissionCheck(...param) {
      const action = param.length > 0 ? param[0] : 'opt'
      const fName = param.length === 2 ? param[1] : this.functionCode
      const userInfo = store.getters.shopInfo.user_info
      if (userInfo.owner) {
        return true
      }
      if (userInfo.permissions === undefined) {
        return false
      }
      if (userInfo.permissions[fName] && userInfo.permissions[fName].indexOf(action) >= 0) {
        return true
      } else {
        return false
      }
    },
    getImageUrl(val, width, height) {
      if (!val) {
        return ''
      }
      // const cd = new Date()
      let imgUrl = imgGetUrl + '?md5=' + val
      if (width) {
        imgUrl += '&width=' + width
      }
      if (height) {
        imgUrl += '&height=' + height
      }
      return imgUrl
    }
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

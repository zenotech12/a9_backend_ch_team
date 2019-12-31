// 国际化设置
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import enElement from 'element-ui/lib/locale/lang/en'
import zhElement from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from '@/lang/en'
import zhLocale from '@/lang/zh-cn'
import enTools from '@/lang/en-tools'
import zhTools from '@/lang/zh-cn-tools'
import enLogin from '@/lang/en-login'
import zhLogin from '@/lang/zh-cn-login'
import enLang from '@/lang/en-lang'
import zhLang from '@/lang/zh-cn-lang'
import zhGoods from '@/lang/zh-cn-goods'
import zhSys from '@/lang/zh-cn-sys'
import zhOperation from '@/lang/zh-cn-operation'
import zhFinance from '@/lang/zh-cn-finance'
import zhOrder from '@/lang/zh-cn-order'

const messages = {
  en: {
    global: {
      ...enLocale
    },
    tools: {
      ...enTools
    },
    login: {
      ...enLogin
    },
    lang: {
      ...enLang
    },
    ...enElement
  },
  zh: {
    global: {
      ...zhLocale
    },
    tools: {
      ...zhTools
    },
    login: {
      ...zhLogin
    },
    lang: {
      ...zhLang
    },
    goods: {
      ...zhGoods
    },
    order: {
      ...zhOrder
    },
    operation: {
      ...zhOperation
    },
    finance: {
      ...zhFinance
    },
    sys: {
      ...zhSys
    },
    ...zhElement
  }
}

Vue.use(VueI18n)
// 当前语言环境
let lang = navigator.language || navigator.userLanguage
lang = lang.substr(0, 2).toLowerCase()
const i18n = new VueI18n({
  locale: Cookies.get('lang') !== undefined && Cookies.get('lang') !== '' ? Cookies.get('lang') : (lang === 'zh' ? 'zh' : 'en'),
  // 默认语言环境。如果locale中无匹配项则采用该项值
  fallbackLocale: 'zh',
  messages
})
// console.log('lang3', Cookies.get('lang'))

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

export default i18n

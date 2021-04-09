// 国际化设置
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import enElement from 'element-ui/lib/locale/lang/en'
import zhElement from 'element-ui/lib/locale/lang/zh-CN'
import kmElement from 'element-ui/lib/locale/lang/km'
import enLocale from '@/lang/en'
import zhLocale from '@/lang/zh-cn'
import kmLocale from '@/lang/km'
import enTools from '@/lang/en-tools'
import zhTools from '@/lang/zh-cn-tools'
import kmTools from '@/lang/km-tools'
import enLogin from '@/lang/en-login'
import zhLogin from '@/lang/zh-cn-login'
import kmLogin from '@/lang/km-login'
import enLang from '@/lang/en-lang'
import zhLang from '@/lang/zh-cn-lang'
import kmLang from '@/lang/km-lang'
import zhGoods from '@/lang/zh-cn-goods'
import enGoods from '@/lang/en-goods'
import kmGoods from '@/lang/km-goods'
import zhSys from '@/lang/zh-cn-sys'
import enSys from '@/lang/en-sys'
import kmSys from '@/lang/km-sys'
import zhOperation from '@/lang/zh-cn-operation'
import enOperation from '@/lang/en-operation'
import kmOperation from '@/lang/km-operation'
import zhFinance from '@/lang/zh-cn-finance'
import enFinance from '@/lang/en-finance'
import kmFinance from '@/lang/km-finance'
import zhOrder from '@/lang/zh-cn-order'
import enOrder from '@/lang/en-order'
import kmOrder from '@/lang/km-order'
import zhExpressage from '@/lang/zh-cn-expressage'
import enExpressage from '@/lang/en-expressage'
import kmExpressage from '@/lang/km-expressage'
import zhWarehouse from '@/lang/zh-cn-warehouse'
import enWarehouse from '@/lang/en-warehouse'
import kmWarehouse from '@/lang/km-warehouse'
const messages = {
  en: {
    expressage: {
      ...enExpressage
    },
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
    goods: {
      ...enGoods
    },
    order: {
      ...enOrder
    },
    operation: {
      ...enOperation
    },
    finance: {
      ...enFinance
    },
    sys: {
      ...enSys
    },
    warehouse: {
      ...enWarehouse
    },
    ...enElement
  },
  zh: {
    expressage: {
      ...zhExpressage
    },
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
    warehouse: {
      ...zhWarehouse
    },
    ...zhElement
  },
  km: {
    expressage: {
      ...kmExpressage
    },
    global: {
      ...kmLocale
    },
    tools: {
      ...kmTools
    },
    login: {
      ...kmLogin
    },
    lang: {
      ...kmLang
    },
    goods: {
      ...kmGoods
    },
    order: {
      ...kmOrder
    },
    operation: {
      ...kmOperation
    },
    finance: {
      ...kmFinance
    },
    sys: {
      ...kmSys
    },
    warehouse: {
      ...kmWarehouse
    },
    ...kmElement
  }
}

Vue.use(VueI18n)
// 当前语言环境
let lang = navigator.language || navigator.userLanguage
lang = lang.substr(0, 2).toLowerCase()
const i18n = new VueI18n({
  locale: Cookies.get('lang') !== undefined && Cookies.get('lang') !== '' ? Cookies.get('lang') : (lang === 'zh' ? 'zh' : (lang === 'km' ? 'km' : 'en')),
  // 默认语言环境。如果locale中无匹配项则采用该项值
  fallbackLocale: 'en',
  messages
})
// console.log('lang3', Cookies.get('lang'))

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

export default i18n

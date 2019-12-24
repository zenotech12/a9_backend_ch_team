import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken, getVersion } from '@/utils/auth' // 验权
import { version } from '@/utils/static'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (getVersion() !== version()) {
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
      store.dispatch('setRouter', router.options.routes).then(() => {
        next()
      })
      // next()
      // if (store.getters.partnerInfo == null || store.getters.partnerInfo.name === '') {
      //   store.dispatch('GetPartnerInfo').then(pInfo => {
      //     var funcList = pInfo.function_list
      //     var rooterArr = getRooterArr(funcList)
      //     store.dispatch('setRouter', rooterArr).then(() => {
      //       next()
      //     })
      //   })
      // } else {
      //   const funcList = store.getters.partnerInfo === undefined ? [] : store.getters.partnerInfo.function_list
      //   var rooterArr = getRooterArr(funcList)
      //   store.dispatch('setRouter', rooterArr).then(() => {
      //     next()
      //   })
      // }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

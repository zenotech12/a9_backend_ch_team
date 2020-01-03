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
      if (store.getters.shopInfo === null || !store.getters.shopInfo.id) {
        store.dispatch('GetShopInfo').then(sInfo => {
          store.dispatch('setRouter', router.options.routes).then(() => {
            next()
          })
        })
      } else {
        store.dispatch('setRouter', router.options.routes).then(() => {
          next()
        })
      }
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

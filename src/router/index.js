// noinspection JSAnnotator
import Vue from 'vue'
// noinspection JSAnnotator
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
import Layout from '../views/layout/Layout'
/* Layout */
// noinspection JSAnnotator
// import homePage from '@/router/homePage'
// import pushCenter from '@/router/pushCenter'
import goods from '@/router/goods'
// import shopStaffMgr from '@/router/shopStaffMgr'
// import userMgr from '@/router/userMgr'
import system from '@/router/system'
// import shareCou from '@/router/shareCou'
// import withdrawal from '@/router/withdrawal'

// noinspection JSAnnotator
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  // { path: '/app-download', component: () => import('@/views/appDownload/appDownload'), hidden: true },
  // { path: '/coupon/:id', component: () => import('@/views/appDownload/coupon'), hidden: true },
  // { path: '/', component: () => import('@/views/appDownload/webDownload'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      // meta: { title: '主页' },
      component: () => import('@/views/dashboard/index')
    }]
  }, ...goods, ...system]
// , ...dashboard, ...fileManagement, ...user, ...borrow, ...permission]
/*  { path: '*', redirect: '/404', hidden: true },
  ...GoodsRouter,*/
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// export const asyncRouterMap = [
//   { path: '/404', component: () => import('@/views/404'), hidden: true }]
// export const asyncRouterMap = [
//   ...shopStaffMgr]
// export const defaultRouter = [...homePage]


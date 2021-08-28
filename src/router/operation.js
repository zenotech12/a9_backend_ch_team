import Layout from '../views/layout/Layout'
const order = [{
  path: '/operation',
  component: Layout,
  name: 'operation',
  redirect: '/operation/ad',
  meta: { title: 'operationMgr', icon: 'el-icon-s-cooperation', code: '4' },
  children: [{
    path: 'ad',
    name: 'adMgr',
    meta: { title: 'adMgr', icon: 'el-icon-s-cooperation', code: '4_1' },
    component: () => import('@/views/operation/ad')
  }, {
    path: 'coupon',
    name: 'couponInfo',
    meta: { title: 'coupon', icon: 'el-icon-s-cooperation', code: '4_2' },
    component: () => import('@/views/operation/coupon')
  }, {
    path: 'red-envelope',
    name: 'redEnvelope',
    meta: { title: 'redEnvelope', icon: 'el-icon-s-cooperation', code: '4_3' },
    component: () => import('@/views/operation/redEnvelope')
  }, {
    path: 'panic-buys',
    name: 'panicBuys',
    meta: { title: 'panicBuys', icon: 'el-icon-s-cooperation', code: '4_4' },
    component: () => import('@/views/operation/panicbuys')
  }, {
    path: 'cobuy',
    name: 'cobuy',
    meta: { title: 'cobuy', icon: 'el-icon-s-cooperation', code: '4_5' },
    component: () => import('@/views/operation/cobuy')
  }, {
    path: 'cutgoods',
    name: 'cutgoods',
    meta: { title: 'cutGoods', icon: 'el-icon-s-cooperation', code: '4_6' },
    component: () => import('@/views/operation/cutGoods')
  }, {
    path: 'shop',
    name: 'shopInfo',
    meta: { title: 'shopInfo', icon: 'el-icon-s-cooperation', code: '4_7' },
    component: () => import('@/views/operation/shop')
  }, {
    path: 'liveBroadcast',
    name: 'liveBroadcast',
    meta: { title: 'liveBroadcast', icon: 'el-icon-s-cooperation', code: '4_8' },
    component: () => import('@/views/operation/liveBroadcast')
  }, {
    path: 'combinebuys',
    name: 'combinebuys',
    meta: { title: 'combinebuys', icon: 'el-icon-s-cooperation', code: '4_9' },
    component: () => import('@/views/operation/combinebuys')
  }, {
    path: 'overdraftSet',
    name: 'overdraftSet',
    meta: { title: 'overdraftSet', icon: 'el-icon-s-cooperation', code: '4_10' },
    component: () => import('@/views/operation/overdraftSet')
  }, {
    path: 'selfPickStation',
    name: 'selfPickStation',
    meta: { title: 'selfPickStation', icon: 'el-icon-s-cooperation', code: '4_11' },
    component: () => import('@/views/operation/selfPickStation')
  }]
}]
export default order

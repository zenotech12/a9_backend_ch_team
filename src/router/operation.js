import Layout from '../views/layout/Layout'
const order = [{
  path: '/operation',
  component: Layout,
  name: 'operation',
  redirect: '/operation/ad',
  meta: { title: 'operationMgr', icon: 'inventory', code: '4' },
  children: [{
    path: 'ad',
    name: 'adMgr',
    meta: { title: 'adMgr', icon: 'list', code: '4_1' },
    component: () => import('@/views/operation/ad')
  }, {
    path: 'coupon',
    name: 'couponInfo',
    meta: { title: 'coupon', icon: 'list', code: '4_2' },
    component: () => import('@/views/operation/coupon')
  }, {
    path: 'red-envelope',
    name: 'redEnvelope',
    meta: { title: 'redEnvelope', icon: 'list', code: '4_3' },
    component: () => import('@/views/operation/redEnvelope')
  }, {
    path: 'panic-buys',
    name: 'panicBuys',
    meta: { title: 'panicBuys', icon: 'list', code: '4_4' },
    component: () => import('@/views/operation/panicbuys')
  }, {
    path: 'cobuy',
    name: 'cobuy',
    meta: { title: 'cobuy', icon: 'list', code: '4_5' },
    component: () => import('@/views/operation/cobuy')
  }, {
    path: 'cutgoods',
    name: 'cutgoods',
    meta: { title: 'cutGoods', icon: 'list', code: '4_6' },
    component: () => import('@/views/operation/cutGoods')
  }, {
    path: 'shop',
    name: 'shopInfo',
    meta: { title: 'shopInfo', icon: 'list', code: '4_7' },
    component: () => import('@/views/operation/shop')
  }, {
    path: 'liveBroadcast',
    name: 'liveBroadcast',
    meta: { title: 'liveBroadcast', icon: 'list', code: '4_8' },
    component: () => import('@/views/operation/liveBroadcast')
  },{
    path: 'combinebuys',
    name: 'combinebuys',
    meta: { title: 'combinebuys', icon: 'list', code: '4_9' },
    component: () => import('@/views/operation/combinebuys')
  },]
}]
export default order
